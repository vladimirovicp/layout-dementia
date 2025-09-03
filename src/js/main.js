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
    slidesPerView: 1,
    spaceBetween: 20,
    slidesPerGroup: 1,

    breakpoints: {
      768: {
        slidesPerView: 3,
        slidesPerGroup: 3,
      }
    },

    pagination: {
        el: '.news__pagination',
        clickable: true,
    },

    navigation: {
        nextEl: '.news__arrow-next',
        prevEl: '.news__arrow-prev',
    },

      scrollbar: {
    el: '.hero__swiper-scrollbar',
  },

});

