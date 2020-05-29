const IMG_URL = "https://image.tmdb.org/t/p/w185_and_h278_bestv2",
  API_KEY = "fc72db78f66b1438d9694bed567d35c9",
  SERVER = "https://api.themoviedb.org/3";

const leftMenu = document.querySelector(".left-menu"),
  hamburger = document.querySelector(".hamburger"),
  tvShows = document.querySelector(".tv-shows"),
  tvShowsHead = document.querySelector(".tv-shows__head"),
  tvShowsList = document.querySelector(".tv-shows__list"),
  modal = document.querySelector(".modal"),
  tvCardImg = document.querySelector(".tv-card__img"),
  modalTitle = document.querySelector(".modal__title"),
  genresList = document.querySelector(".genres-list"),
  rating = document.querySelector(".rating"),
  description = document.querySelector(".description"),
  modalLink = document.querySelector(".modal__link"),
  searchForm = document.querySelector(".search__form"),
  searchFormInput = document.querySelector(".search__form-input"),
  dropdown = document.querySelectorAll(".dropdown");


// Preloader
const loading = document.createElement("div"),
  preloader = document.querySelector(".preloader");
loading.className = "loading";

// Class
const DBService = class {
  getData = async (url) => {
    tvShows.append(loading);
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`data not received, error ${response.status}`);
    }
  };

  getSearchResult = (query) => {
    return this.getData(
      `${SERVER}/search/tv?api_key=${API_KEY}&language=ru-RU&query=${query}`
    );
  };

  getTvShow = (id) => {
    return this.getData(`${SERVER}/tv/${id}?api_key=${API_KEY}&language=ru-RU`);
  };

  getTopRated = () => {
    return this.getData(`${SERVER}/tv/top_rated?api_key=${API_KEY}&language=ru-RU`);
  };

  getPopular = () => {
    return this.getData(`${SERVER}/tv/popular?api_key=${API_KEY}&language=ru-RU`);
  };

  getToday = () => {
    return this.getData(`${SERVER}/tv/airing_today?api_key=${API_KEY}&language=ru-RU`);
  };

  getWeek = () => {
    return this.getData(`${SERVER}/tv/on_the_air?api_key=${API_KEY}&language=ru-RU`);
  };

};

// Render card
const renderCard = (response, target) => {
  tvShowsList.textContent = "";

  if (!response.total_results) {
    loading.remove();
    tvShowsHead.textContent = 'К сожалению, по Вашему запросу ничего не найдено =(';
    return;
  }
  tvShowsHead.textContent = target ? target.textContent : 'Результат поиска:';
  response.results.forEach((item) => {
    const {
      backdrop_path: backdrop,
      name: title,
      poster_path: poster,
      vote_average: vote,
      id,
    } = item;

    const posterIMG = poster ? IMG_URL + poster : "img/no-poster.jpg",
      backdropIMG = backdrop ? IMG_URL + backdrop : posterIMG,
      voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : "";

    const card = document.createElement("li");
    card.className = "tv-shows__item";
    card.innerHTML = `
      <a href="#" id='${id}' class="tv-card">
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

// Search
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = searchFormInput.value.trim();
  searchFormInput.value = "";
  if (value) {
    // tvShows.append(loading);
    new DBService().getSearchResult(value).then(renderCard);
  }
});

// Menu
// open menu
hamburger.addEventListener("click", () => {
  leftMenu.classList.toggle("openMenu");
  hamburger.classList.toggle("open");
  closeDropdown();
});


// close menu
document.addEventListener("click", (event) => {
  if (!event.target.closest(".left-menu")) {
    leftMenu.classList.remove("openMenu");
    hamburger.classList.remove("open");
    closeDropdown();
  }
});

// deploy item menu
leftMenu.addEventListener("click", (event) => {
  event.preventDefault();
  const target = event.target,
    dropdown = target.closest(".dropdown");
  if (dropdown) {
    dropdown.classList.toggle("active");
    leftMenu.classList.add("openMenu");
    hamburger.classList.add("open");
  }

  if (target.closest('#top-rated')) {
    new DBService().getTopRated().then((response) => renderCard(response, target));
  }

  if (target.closest('#popular')) {
    new DBService().getPopular().then((response) => renderCard(response, target));
  }

  if (target.closest('#today')) {
    new DBService().getToday().then((response) => renderCard(response, target));
  }

  if (target.closest('#week')) {
    new DBService().getWeek().then((response) => renderCard(response, target));
  }


});

// Close dropdown
const closeDropdown = () => {
  dropdown.forEach(item => {
    item.classList.remove('active');

  });
}


// Modal
// open modal
tvShowsList.addEventListener("click", (event) => {
  event.preventDefault();

  const target = event.target,
    card = target.closest(".tv-card");
  if (card) {
    preloader.style.display = 'block';

    new DBService()
      .getTvShow(card.id)
      .then((response) => {
        tvCardImg.src =
          response.poster_path ?
          IMG_URL + response.poster_path :
          "img/no-poster.jpg";

        tvCardImg.alt = response.name;
        modalTitle.textContent = response.name;
        genresList.textContent = "";
        for (const item of response.genres) {
          genresList.innerHTML += `<li>${item.name.toLowerCase()}</li>`;
        }
        rating.textContent = response.vote_average;
        description.textContent = response.overview ? response.overview : "Отсутствует =(";
        modalLink.href = response.homepage ? modalLink.href = response.homepage : modalLink.style.display = 'none';
      })
      .then(() => {
        document.body.style.overflow = "hidden";
        modal.classList.remove("hide");
      })
      .finally(() => {
        preloader.style.display = '';
      })
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
