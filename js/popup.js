var navMain = document.querySelector('.main-nav');
var navToggle = document.querySelector('.page-header__toggle');
var navTop = document.querySelector('.page-header__panel');

navMain.classList.remove('main-nav--nojs');

navToggle.addEventListener('click', function() {
  if (navMain.classList.contains('main-nav--closed')) {
    navMain.classList.remove('main-nav--closed');
    navMain.classList.add('main-nav--opened');
    navTop.classList.remove('page-header__panel--bottom-btn-gum');
    navTop.classList.add('page-header__panel--top-btn-cross');
  } else {
    navMain.classList.add('main-nav--closed');
    navMain.classList.remove('main-nav--opened');
    navTop.classList.remove('page-header__panel--top-btn-cross');
    navTop.classList.add('page-header__panel--bottom-btn-gum');
  }
});
