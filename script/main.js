const IMG_URL = "https://image.tmdb.org/t/p/w185_and_h278_bestv2",
  API_KEY = "fc72db78f66b1438d9694bed567d35c9";

const leftMenu = document.querySelector(".left-menu"),
  hamburger = document.querySelector(".hamburger"),
  tvShows = document.querySelector(".tv-shows"),
  tvShowsList = document.querySelector(".tv-shows__list"),
  modal = document.querySelector(".modal"),
  tvCardImg = document.querySelector(".tv-card__img"),
  modalTitle = document.querySelector(".modal__title"),
  genresList = document.querySelector(".genres-list"),
  rating = document.querySelector(".rating"),
  description = document.querySelector(".description"),
  modalLink = document.querySelector(".modal__link");

// Preloader
const loading = document.createElement("div");
loading.className = "loading";

const preloader = document.createElement("div");
preloader.className = "preloader";

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

  getTestCard = () => {
    return this.getData("card.json");
  };
};

const renderCard = (response) => {
  tvShowsList.textContent = "";

  response.results.forEach((item) => {
    const {
      backdrop_path: backdrop,
      name: title,
      poster_path: poster,
      vote_average: vote,
    } = item;

    const posterIMG = poster ? IMG_URL + poster : "img/no-poster.jpg",
      backdropIMG = backdrop ? IMG_URL + backdrop : posterIMG,
      voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : "";

    const card = document.createElement("li");
    card.className = "tv-shows__item";
    card.innerHTML = `
      <a href="#" class="tv-card">
        ${voteElem}
        <img
          class="tv-card__img"
          src="${posterIMG}"
          data-backdrop="${backdropIMG}"
          alt="${title}"
        />
        <h4 class="tv-card__head">${title}</h4>
      </a>
    `;
    loading.remove();
    tvShowsList.append(card);
  });
};

{
  tvShows.append(loading);
  new DBService().getTestData().then(renderCard);
}

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
    // tvShowsList.append(preloader);

    new DBService()
      .getTestCard()
      .then((response) => {
        console.log("response: ", response);
        tvCardImg.src = IMG_URL + response.poster_path;
        modalTitle.textContent = response.name;
        genresList.textContent = "";
        for (const item of response.genres) {
          genresList.innerHTML += `<li>${item.name}</li>`;
        }
        // rating = response.;
        // description = '';
        // modalLink = '';
      })
      .then(() => {
        // preloader.remove();
        document.body.style.overflow = "hidden";
        modal.classList.remove("hide");
      });
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
