// Menu
const leftMenu = document.querySelector('.left-menu'),
  hamburger = document.querySelector('.hamburger');

hamburger.addEventListener('click', () => {
  leftMenu.classList.toggle('openMenu')
  hamburger.classList.toggle('open')
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.left-menu')) {
    leftMenu.classList.remove('openMenu');
    hamburger.classList.remove('open');
  }
});


