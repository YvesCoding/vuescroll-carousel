import carousel from './carousel';

carousel.install = Vue => {
  Vue.component('vuescroll-carousel', carousel);
};

if (typeof window != 'undefined' && window.Vue) {
  window.Vue.use(carousel);
}

carousel.version = __version__;

export default carousel;
