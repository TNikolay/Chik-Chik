/*
https://github.com/maksim-leskin/api-chik-chik 
https://www.youtube.com/watch?v=ot7hG00iJQs
https://kind-fluorescent-shamrock.glitch.me/

GET /api - получить список услуг
GET /api?service={n} - получить список барберов
GET /api?spec={n} - получить список месяца работы барбера
GET /api?spec={n}&month={n} - получить список дней работы барбера
GET /api?spec={n}&month={n}&day={n} - получить список свободных часов барбера
POST /api/order - оформить заказ
*/

const API_URL = 'https://kind-fluorescent-shamrock.glitch.me/'


window.addEventListener("DOMContentLoaded", onDOMContentLoaded);
window.addEventListener("load", onLoad);

let slider, slContainer;

function onDOMContentLoaded() {
  initSlider();
  initService();
  initReserve();
}

function onLoad() {
  startSlider();
}

function addPreloader(el) { el.classList.add("preload"); }
function removePreloader(el) { setTimeout(() => { el.classList.remove("preload");}, 100); }

function initSlider() {
  slider = document.querySelector(".slider");
  addPreloader(slider);

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

  removePreloader(slider);
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


function initService() {
  
  const priceList = document.querySelector('.price__list');
  const reserveFieldsetService = document.querySelector('.reserve__fildset_service');
  priceList.textContent = '';
  reserveFieldsetService.innerHTML = '<legend class="reserve__legend">Услуга</legend>';

  addPreloader(priceList);
  addPreloader(reserveFieldsetService);
  
  fetch(`${API_URL}api`).then(r => r.json()).then(data => {
    console.log({data});
    renderPrice(priceList, data);
    removePreloader(priceList);
    renderService(reserveFieldsetService, data);
    removePreloader(reserveFieldsetService);
  });
}


function renderPrice(parent, data) {

  data.forEach(item => {
    const el = document.createElement('li');
    el.classList.add('price__item');
    el.innerHTML = ` <span class="price__item-title">${item.name}</span><span class="price__item-count">${item.price} руб</span>`;
    parent.append(el);
  });
/* <li class="price__item">
  <span class="price__item-title">Стрижка ножницами</span>
  <span class="price__item-count">2500 руб</span>
</li> */
}


function renderService(parent, data) {

  const labels = data.map( item => {
    const l = document.createElement('label');
    l.classList.add('radio');
    l.innerHTML = `<input class="radio__input" type="radio" name="service" value="${item.id}"><span class="radio__label">${item.name}</span>`;
    return l;
  });
  parent.append(...labels);

/* <label class="radio">
     <input class="radio__input" type="radio" name="service">
      <span class="radio__label">Стрижка ножницами</span>
    </label> */
}

function renderSpec(parent, data) {

  parent.innerHTML = '<legend class="reserve__legend">Специалист</legend>';
  const labels = data.map(item => {
    const l = document.createElement('label');
    l.classList.add('radio');
    l.innerHTML = `<input class="radio__input" type="radio" name="spec" value="${item.id}">
<span class="radio__label radio__label__spec" style="--bg-image: url(${API_URL}${item.img})">${item.name}</span>`;
    return l;
  });
  parent.append(...labels);

/* <label class="radio">
    <input class="radio__input" type="radio" name="spec">
    <span class="radio__label radio__label__spec" style="--bg-image: url(../images/masters/spec1.png)">Игорь</span>
  </label>*/
}

function renderMonth(parent, data) {

  parent.textContent = '';
  const labels = data.map(item => {
    const l = document.createElement('label');
    l.classList.add('radio');
    l.innerHTML = `<input class="radio__input" type="radio" name="month" value="${item}">
<span class="radio__label">${new Intl.DateTimeFormat('ru-RU', {month: "long"}).format(new Date(item))}</span>`;
    return l;
  });
  parent.append(...labels);

/* <label class="radio">
      <input class="radio__input" type="radio" name="month" />
      <span class="radio__label">Январь</span>
  </label>*/
}

function renderDay(parent, data, month) {

  parent.textContent = '';
  const labels = data.map(item => {
    const l = document.createElement('label');
    l.classList.add('radio');
    l.innerHTML = `<input class="radio__input" type="radio" name="day" value="${item}">
<span class="radio__label">${new Intl.DateTimeFormat('ru-RU', {month: "long", day: "numeric"}).format(new Date(`${month}/${item}`))}</span>`;
    return l;
  });
  parent.append(...labels);

/* <label class="radio">
    <input class="radio__input" type="radio" name="day" />
    <span class="radio__label">18 Января</span>
  </label>*/
}

function renderTime(parent, data) {

  parent.textContent = '';
  const labels = data.map(item => {
    const l = document.createElement('label');
    l.classList.add('radio');
    l.innerHTML = `<input class="radio__input" type="radio" name="time" value="${item}"><span class="radio__label">${item}</span>`;
    return l;
  });
  parent.append(...labels);

/* <label class="radio">
    <input class="radio__input" type="radio" name="time" />
    <span class="radio__label">13:00-14:30</span>
</label>*/
}


function setDisabled(ar, v) { ar.forEach(a => {a.disabled = v; })}

function initReserve() {
  
  const reserveForm = document.querySelector('.reserve__form');
  const { fieldspec, fielddata, fieldmonth, fieldday, fieldtime, btn } = reserveForm;

  setDisabled([fieldspec, fielddata, fieldmonth, fieldday, fieldtime, btn], true);

  reserveForm.addEventListener('change', async evt => {
    console.log(evt.target);
    
    if (evt.target.name == 'service') {
      setDisabled([fieldspec, fielddata, fieldmonth, fieldday, fieldtime, btn], true);
      addPreloader(fieldspec);
      const response = await fetch(`${API_URL}/api?service=${evt.target.value}`);
      const data = await response.json(); 
      renderSpec(fieldspec, data);
      removePreloader(fieldspec);
      setDisabled([fieldspec], false);
    }
    else if (evt.target.name == 'spec') {
      setDisabled([fielddata, fieldmonth, fieldday, fieldtime, btn], true);
      addPreloader(fieldmonth);
      const response = await fetch(`${API_URL}/api?spec=${evt.target.value}`);
      const data = await response.json(); 
      renderMonth(fieldmonth, data);
      removePreloader(fieldmonth);
      setDisabled([fielddata, fieldmonth], false);
    }
    else if (evt.target.name == 'month') {
      setDisabled([fieldday, fieldtime, btn], true);
      addPreloader(fieldday);
      const response = await fetch(`${API_URL}/api?spec=${reserveForm.spec.value}&month=${evt.target.value}`);
      const data = await response.json(); 
      renderDay(fieldday, data, evt.target.value);
      removePreloader(fieldday);
      setDisabled([fieldday], false);
    }
    else if (evt.target.name == 'day') {
      setDisabled([fieldtime, btn], true);
      addPreloader(fieldtime);
      const response = await fetch(`${API_URL}/api?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}&day=${evt.target.value}`);
      const data = await response.json(); 
      renderTime(fieldtime, data);
      removePreloader(fieldtime);
      setDisabled([fieldtime], false);
    }
    else if (evt.target.name == 'time') {
      setDisabled([btn], false);
    }
  });
}
