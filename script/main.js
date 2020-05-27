const IMG_URL = "https://image.tmdb.org/t/p/w185_and_h278_bestv2",
  API_KEY = 'fc72db78f66b1438d9694bed567d35c9';

const leftMenu = document.querySelector(".left-menu"),
  hamburger = document.querySelector(".hamburger"),
  tvShowsList = document.querySelector(".tv-shows__list"),
  modal = document.querySelector(".modal");

// Class
const DBService = class {
  getData = async (url) => {
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`data not received, error ${response.status}`);
    }
  };

  getTestData = () => {
    return this.getData("test.json");
  };
};

const renderCard = (response) => {
  tvShowsList.textContent = "";

  response.results.forEach((item) => {
    const {
      backdrop_path: backdrop,
      name: title,
      poster_path: poster,
      vote_average: vote
    } = item;

    const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg',
      backdropIMG = backdrop ? IMG_URL + backdrop : posterIMG;
    // voteElem = vote ? vote : '';


    const card = document.createElement("li");
    card.className = "tv-shows__item";
    card.innerHTML = `
      <a href="#" class="tv-card">
        <span class="tv-card__vote">${vote}</span>
        <img
          class="tv-card__img"
          src="${posterIMG}"
          data-backdrop="${backdropIMG}"
          alt="${title}"
        />
        <h4 class="tv-card__head">${title}</h4>
      </a>
    `;
    tvShowsList.append(card);
  });
};

new DBService().getTestData().then(renderCard);

// Menu
// open menu
hamburger.addEventListener("click", () => {
  leftMenu.classList.toggle("openMenu");
  hamburger.classList.toggle("open");
});

// close menu
document.addEventListener("click", (event) => {
  if (!event.target.closest(".left-menu")) {
    leftMenu.classList.remove("openMenu");
    hamburger.classList.remove("open");
  }
});

// deploy item menu
leftMenu.addEventListener("click", (event) => {
  const target = event.target,
    dropdown = target.closest(".dropdown");
  if (dropdown) {
    dropdown.classList.toggle("active");
    leftMenu.classList.add("openMenu");
    hamburger.classList.add("open");
  }
});

// Modal
// open modal
tvShowsList.addEventListener("click", (event) => {
  event.preventDefault();

  const target = event.target,
    card = target.closest(".tv-card");
  if (card) {
    document.body.style.overflow = "hidden";
    modal.classList.remove("hide");
  }
});

// close modal
modal.addEventListener("click", (event) => {
  const target = event.target,
    closeModalBtn = target.closest(".cross"),
    closeOutModal = target.classList.contains("modal");
  if (closeModalBtn || closeOutModal) {
    document.body.style.overflow = "";
    modal.classList.add("hide");
  }
});

// Card
// change card img
const changeImage = (event) => {
  const card = event.target.closest(".tv-shows__item");

  if (card) {
    const img = card.querySelector(".tv-card__img");
    if (img.dataset.backdrop) {
      [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
    }
  }
};

tvShowsList.addEventListener("mouseover", changeImage);
tvShowsList.addEventListener("mouseout", changeImage);
