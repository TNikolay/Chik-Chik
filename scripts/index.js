window.addEventListener("DOMContentLoaded", onDOMContentLoaded);
window.addEventListener("load", onLoad);

let slider, slContainer;

function onDOMContentLoaded() {
  initSlider();
}

function onLoad() {
  startSlider();
}

function initSlider() {
  slider = document.querySelector(".slider");
  slider.classList.add("preload");

  slContainer = document.querySelector(".slider__container");
  slContainer.style.display = "none";
}

function startSlider() {
  const checkSlider = () => {
    const w = document.documentElement.offsetWidth;
    //console.log('checkSlider ', { activeSlide });
    if ((w > 560 && activeSlide >= slItems.length - 2) || (w <= 560 && activeSlide == slItems.length - 1)) btnNextSlide.style.display = "none";
    else btnNextSlide.style.display = "";

    if ((w > 560 && activeSlide <= 1) || (w <= 560 && activeSlide == 0)) btnPrevSlide.style.display = "none";
    else btnPrevSlide.style.display = "";
  };

  const prevSlider = () => {
    slItems[activeSlide].classList.remove("slider__item_active");

    const pos = document.documentElement.offsetWidth > 560 ? -slItems[0].clientWidth * (activeSlide - 2) : -slItems[0].clientWidth * (activeSlide - 1);
    slList.style.transform = `translateX(${pos}px)`;
    //console.log('prevSlider ', { pos, activeSlide });
    slItems[--activeSlide].classList.add("slider__item_active");
    checkSlider();
  };

  const nextSlider = () => {
    slItems[activeSlide].classList.remove("slider__item_active");
    
    const pos = document.documentElement.offsetWidth > 560 ? -slItems[0].clientWidth * activeSlide : -slItems[0].clientWidth * (activeSlide + 1);
    slList.style.transform = `translateX(${pos}px)`;
   // console.log('nextSlider ', { pos, activeSlide });
    slItems[++activeSlide].classList.add("slider__item_active");
    checkSlider();
  };

  slider.classList.remove("preload");
  slContainer.style.display = "";

  const slItems = document.querySelectorAll(".slider__item");
  const slList = document.querySelector(".slider__list");
  const btnPrevSlide = document.querySelector(".slider__arrow_left");
  const btnNextSlide = document.querySelector(".slider__arrow_right");
  let activeSlide = 1;

  if (document.documentElement.offsetWidth <= 560) {
    slItems[1].classList.remove("slider__item_active");
    slItems[0].classList.add("slider__item_active");
    activeSlide = 0;
  }

  checkSlider();

  btnNextSlide.addEventListener("click", nextSlider);
  btnPrevSlide.addEventListener("click", prevSlider);
  window.addEventListener("resize", () => {
    // TODO BUG : if width <= 560 and activeSlide == 0 or last and we increasing width...
    const pos = document.documentElement.offsetWidth > 560 ? -slItems[0].clientWidth * (activeSlide - 1): -slItems[0].clientWidth * activeSlide;
    slList.style.transform = `translateX(${pos}px)`;
    checkSlider();
  });
}
