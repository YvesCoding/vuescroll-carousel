<template>
    <div class="dot-group" :class="{'vertical': type != 'h','horizontal': type == 'h'}">
        <a href="javascript:void(0)" v-for="i in num" :key="i" :class="{active: currenIndex == i}" @click="handleClick(i)">
            <i class="dot-item"></i>
        </a>
    </div>
</template>

<script>
export default {
  props: {
    currenIndex: Number,
    num: Number,
    type: String
  },
  methods: {
    handleClick(index) {
      this.$emit('dot-click', index);
    }
  }
};
</script>

<style lang="scss">
.dot-group {
  position: absolute;
  display: flex;
  right: 10px;
  .dot-item {
    display: inline-block;
    vertical-align: middle;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background-color: #d0cdd1;
  }
  &.vertical {
    flex-direction: column;
    top: 50%;
    transform: translateY(-50%);
    & > a {
      margin-top: 6px;
    }
  }
  &.horizontal {
    bottom: 10px;
    & > a {
      margin-left: 6px;
    }
  }
  & > a {
    display: block;
    width: 6px;
    height: 6px;
  }
  & > a.active {
    .dot-item {
      background-color: #ff9900;
    }
  }
}
</style>
