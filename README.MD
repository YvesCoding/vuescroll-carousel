# vuescroll-carousel

<p>
  <a href="https://www.npmjs.com/package/vuescroll-carousel"><img src="https://img.shields.io/npm/v/vuescroll-carousel.svg" alt="Version"></a>  
  <a href="https://www.npmjs.com/package/vuescroll-carousel"><img src="https://img.shields.io/npm/l/vuescroll-carousel.svg" alt="License"></a>
</p>

## Introduction

vuescroll-carousel is a carousel plugin based on **^vuescroll@4.9.0**.

It seems like [`swiper`](https://github.com/nolimits4web/swiper). You can see the guide below.

## Demo

- [Live Demo](https://codepen.io/wangyi7099/pen/OrQoXK)

- See the **Demo** fold of this repo.

## Get Started

1. You should install `Vue@2.x` , `vuescroll@4.9.0+` and `vuescroll-carousel` , and registry the plugins.

```bash
 npm i vue vuescroll vuescroll-carousel -S
```

```javascript
import Vue from vue;
import vuescroll from vuescroll;
import vuescroll/dist/vuescroll.css;
// import carousel plugin and its css file
import vuescrollCarousel from vuescroll-carousel;
import vuescroll-carousel/dist/index.css;

// reigstry the plugin

Vue.use(vuescroll);
Vue.use(vuescrollCarousel);
```

2. Wrap the element and that's all.

```html
<vuescroll-carousel>
  <div v-for="i in 10" :key="i">{{i}}</div>
</vuescroll-carousel>
```

## Props and Api

### Props

| PropName     | Default |                                                                               Description |
| ------------ | :-----: | ----------------------------------------------------------------------------------------: |
| type         |    h    | `h` or `v`. `h` means scrolling on horizontal direction and `v` is on vertical direction. |
| loop         |  true   |                         Whether carousel is connected between the end and the end or not. |
| autoPlay     |  true   |                                           whether play the carousel automatically or not. |
| intervalTime |  1000   |                          Interval time of auto-play, only enable when autoPlay is enable. |
| playSpeed    |   300   |                                                                               play speed. |
| indicator    |  true   |                                                                     show indicator or not |
| currentIndex |    1    |                                           the index of current active item, strat from 1. |

## Api

| Api Name |                           Description                            |                             Arguments |
| -------- | :--------------------------------------------------------------: | ------------------------------------: |
| refresh  | refresh the compoennt's status. All states will be recalculated. |                                     - |
| goToPage |                    Go to the specified page.                     | (pageIndex: Number, animate: Boolean) |

## Author

WangYi7099(Yves Wang)

## License

**MIT**
