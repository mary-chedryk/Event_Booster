document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.about-us__slider');
  const slides = document.querySelectorAll('.about-us__slide');
  const btnLeft = document.querySelector('.about-us__arrow--left');
  const btnRight = document.querySelector('.about-us__arrow--right');

  let index = 0;

  const updateSlider = () => {
    const slideWidth = slides[0].offsetWidth + 20; // ширина + gap
    slider.style.transform = `translateX(-${index * slideWidth}px)`;
  };

  btnLeft.addEventListener('click', () => {
    index = Math.max(index - 1, 0);
    updateSlider();
  });

  btnRight.addEventListener('click', () => {
    const visibleSlides =
      window.innerWidth >= 1200 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    index = Math.min(index + 1, slides.length - visibleSlides);
    updateSlider();
  });

  window.addEventListener('resize', updateSlider);
});
