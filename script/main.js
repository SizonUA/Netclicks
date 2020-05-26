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

leftMenu.addEventListener('click', (event) => {
  const target = event.target;
  const dropdown = target.closest('.dropdown');
  console.log('target: ', target);
  console.log('dropdown: ', dropdown);

  if (dropdown) {
    dropdown.classList.toggle('active');
    leftMenu.classList.add('openMenu');
    hamburger.classList.add('open');
  }
});

// Images
// const tvCardImg = document.querySelector('.tv-card__img');

// tvCardImg.addEventListener('click', () => {

// })
