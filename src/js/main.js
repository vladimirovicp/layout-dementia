//const appModule = require('./lib/app');

//import "./lib/app"
// import "./lib/swiper/swiper-bundle.min.css";
// import "./lib/swiper/swiper-bundle.min.js";

//import "../lib/swiper/swiper-bundle.min.js";

//console.log('Привет main!');

document.addEventListener('DOMContentLoaded', function() {
  const progressSpans = document.querySelectorAll('.progress-bar');
  progressSpans.forEach(function(span) {
    const progress = span.getAttribute('data-progress');
    span.style.width = progress + '%';

    const progressText = document.createElement('div');
    progressText.className = 'progress__number';
    progressText.textContent = progress + '%';

    const parent = span.parentElement;
    parent.appendChild(progressText);

  });
});


const swiperHero = new Swiper('.news__slider', {
    // direction: 'vertical',
    loop: true,
    slidesPerView: 3,
    spaceBetween: 30,

    // effect: 'fade',
    // fadeEffect: {
    //     crossFade: true
    // },

    pagination: {
        el: '.news__pagination',
    },

    navigation: {
        nextEl: '.news__arrow-next',
        prevEl: '.news__arrow-prev',
    },

      scrollbar: {
    el: '.hero__swiper-scrollbar',
  },

});

