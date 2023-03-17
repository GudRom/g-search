const GITHUB_URL = "https://api.github.com";
let search;
let repositories = [];
const loader = document.querySelector(".loader");
const form = document.forms.search;
const input = form.search;
const list = document.querySelector(".main__list");
const empty = list.querySelector(".main__text");
const spanError = document.querySelector(".form__error");
const button = form.querySelector("button");

function getResponseData(requestText) {
  let url = new URL(`${GITHUB_URL}/search/repositories`);
  url.searchParams.set("q", `${requestText}`);
  url.searchParams.set("per_page", "10");
  url.searchParams.set("in", "name");
  loader.classList.add("loader_visible");
  return fetch(url).then((res) => checkResult(res));
}

function checkResult(res) {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(`Ошибка: ${res.status}`);
  }
}

function getTemplate() {
  const card = document
    .querySelector(".template")
    .content.querySelector(".main__list-item")
    .cloneNode(true);
  return card;
}

function createCard(data) {
  let card = getTemplate();

  card.querySelector(".card__name").textContent = data.name;
  card.querySelector(".card__name").href = data["html_url"];
  card.querySelector(".card__description").textContent = data.description;
  card.querySelector(".card__author").textContent = data.owner.login;
  card.querySelector(".card__avatar").src = data.owner["avatar_url"];

  return card;
}

function setInputData(evt) {
  search = evt.target.value;
}

function validateInput(evt) {
  if (evt.target.value.length >= 2) {
    spanError.classList.remove("form__error_visible");
    button.removeAttribute("disabled");
  } else {
    spanError.classList.add("form__error_visible");
    button.setAttribute("disabled", true);
  }
}

function showResult() {
  getResponseData(search).then((data) => {
    repositories = [...data.items];
    loader.classList.remove("loader_visible");
    if (repositories.length != 0) {
      appendCards(repositories);
    } else {
      empty.classList.remove("main__text_invisible");
    }
  });
}

function appendCards(data) {
  data.map((item) => {
    list.append(createCard(item));
  });
}

function clearPrevSearch() {
  if (!empty.classList.contains("main__text_invisible")) {
    empty.classList.add("main__text_invisible");
  }

  if (list.childNodes.length !== 0) {
    list.querySelectorAll("li").forEach((el) => {
      el.remove();
    });
  }
}

input.onchange = (evt) => setInputData(evt);
input.oninput = (evt) => validateInput(evt);

form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  clearPrevSearch();
  showResult();
});
