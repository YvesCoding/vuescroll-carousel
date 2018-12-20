<template>
  <div ref="container" class="carousel-container" :class="{'vertical': type != 'h'}">
    <vue-scroll class="carousel-vs" :ops="ops" ref="vs" @handle-scroll-complete="hSC" @handle-resize="handleResize">
      <slot>
      </slot>
    </vue-scroll>
    <slot name="indicator" v-if="indicator">
      <TheIndicator @dot-click="goToPage" :type="type" :num="realNodesWithoutCloneLen" :currenIndex="internalActiveIndex" />
    </slot>
  </div>
</template>

<script>
import Vue from 'vue';
import vuescroll from 'vuescroll/dist/vuescroll-slide';
import { setInterval, clearInterval } from 'timers';

import TheIndicator from './TheIndicator';

const components = { TheIndicator };
if (!Vue.prototype.$vuescrollConfig) {
  components.vueScroll = vuescroll;
}

export default {
  props: {
    // h: horizontal scroll
    // v: vertoca; scrp;;
    type: {
      tyoe: String,
      default: 'h'
    },
    // Whether carousel is connected between the end and the end or not.
    loop: {
      tyoe: Boolean,
      default: true
    },
    // whether play the carousel automatically or not.
    autoPlay: {
      tyoe: Boolean,
      default: true
    },
    // Interval time of auto-play, only enable when autoPlay is
    // enable
    intervalTime: {
      tyoe: Number,
      default: 1000
    },
    // play speed
    playSpeed: {
      tyoe: Number,
      default: 300
    },
    // show indicator or not
    indicator: {
      type: Boolean,
      default: true
    },
    // the index of current active item, strat from 1
    currentIndex: {
      type: Number,
      default: 1
    }
  },
  watch: {
    currentIndex(newValue) {
      this.goToPage(newValue);
    },
    internalActiveIndex(newValue) {
      this.$emit('update:currentIndex', newValue);
    }
  },
  components,
  created() {
    this.internalActiveIndex = this.currentIndex;
  },
  mounted() {
    this.refresh();
  },
  destroyed() {
    clearInterval(this.autoPlayInerval);
  },
  computed: {
    parent() {
      return this.$el.querySelector('.__panel');
    },
    axis() {
      return this.type == 'h' ? 'x' : 'y';
    },
    halfClonedNodesNum() {
      return (this.realNodesLen - this.realNodesWithoutCloneLen) / 2;
    }
  },
  data() {
    return {
      a: 0,
      ops: {
        bar: {
          opacity: 0
        },
        vuescroll: {
          paging: true,
          scroller: {
            bouncing: false
          }
        },
        scrollPanel: {
          scrollingY: this.type != 'h',
          scrollingX: this.type == 'h',
          speed: this.playSpeed
        }
      },
      // nodes with cloned
      realNodesLen: 0,
      // nodes without cloend
      realNodesWithoutCloneLen: 0,
      internalActiveIndex: 1
    };
  },
  methods: {
    // ------------- API ------------
    refresh() {
      let children = this.children();
      this.removeNodes(children, i => i.isCloned);
      this.realNodesWithoutCloneLen = children.length;
      this.cloneNodes();
      children = this.children();
      this.realNodesLen = children.length;
      this.setChildrenSize();
      this.$refs['vs'].refresh();
      this.$nextTick().then(() => {
        this.goToPage(this.internalActiveIndex, false, true);
        this.setAutoPlay();
      });
    },
    goToPage(pageindex, animate = true, force = false) {
      if (pageindex == this.internalActiveIndex && !force) return;

      pageindex = Math.min(this.realNodesWithoutCloneLen, pageindex);
      this.$refs['vs'].goToPage(
        {
          [this.axis]: pageindex + this.halfClonedNodesNum
        },
        animate
      );
    },
    // ---------- -- API END ---------

    children() {
      return Array.from(this.parent.children).filter(i => !i.isResizeElm);
    },
    // handle scroll complete
    hSC() {
      this.fixPages();
    },
    // handle scroll
    handleResize() {
      this.setChildrenSize();
      this.$nextTick().then(() => {
        this.goToPage(this.internalActiveIndex, false);
      });
    },
    setChildrenSize() {
      const container = this.$refs['container'];
      const height = container.clientHeight;
      const width = container.clientWidth;

      this.children().forEach(c => {
        c.style.height = height + 'px';
        c.style.width = width + 'px';
      });
    },
    fixPages() {
      if (this.children().length > 1) {
        const page = this.$refs['vs'].getCurrentPage()[this.axis];
        this.internalActiveIndex = page - this.halfClonedNodesNum;
        if (this.internalActiveIndex > this.realNodesWithoutCloneLen) {
          this.internalActiveIndex = this.loop ? 1 : this.internalActiveIndex;
        } else if (this.internalActiveIndex < this.halfClonedNodesNum) {
          this.internalActiveIndex = this.realNodesWithoutCloneLen;
        }

        this.$refs['vs'].goToPage(
          {
            [this.axis]: this.internalActiveIndex + this.halfClonedNodesNum
          },
          false
        );
      }
    },
    setAutoPlay() {
      clearInterval(this.autoPlayInerval);

      if (this.autoPlay) {
        this.autoPlayInerval = setInterval(() => {
          this.$refs['vs'].goToPage(
            {
              [this.axis]:
                this.internalActiveIndex + this.halfClonedNodesNum + 1
            },
            true
          );
        }, this.intervalTime);
      }
    },
    cloneNodes() {
      const children = this.children();
      if (children.length > 1 && this.loop) {
        // find start and end elm
        const firstChild = this.getFrist(children, i => !i.isResizeElm);
        const lastChild = this.getLast(children, i => !i.isResizeElm);
        const clonedLastChild = lastChild.cloneNode(true);
        const clonedFirstChild = firstChild.cloneNode(true);

        clonedLastChild.isCloned = clonedFirstChild.isCloned = true;

        this.parent.insertBefore(clonedLastChild, firstChild);
        this.parent.appendChild(clonedFirstChild);
      }
    },
    removeNodes(nodes, filter) {
      Array.from(nodes).forEach(i => {
        if (filter(i)) {
          i.parentNode.removeChild(i);
        }
      });
    },
    getFrist(children, filter) {
      let i = 0;
      const len = children.length;
      let flag = false;
      while (i < len && !flag) {
        if (filter(children[i])) {
          flag = children[i];
        }
        i++;
      }

      return flag;
    },
    getLast(children, filter) {
      let i = children.length - 1;
      let flag = false;
      while (i >= 0 && !flag) {
        if (filter(children[i])) {
          flag = children[i];
        }
        i--;
      }

      return flag;
    }
  }
};
</script>

<style lang="scss">
.carousel-container {
  width: 100%;
  height: 100%;
  position: relative;
  & > .carousel-vs {
    & > .__panel {
      display: flex;
      & > * {
        flex-shrink: 0;
      }
    }
  }
  &.vertical {
    & > .carousel-vs {
      & > .__panel {
        flex-direction: column;
      }
    }
  }
}
</style>
