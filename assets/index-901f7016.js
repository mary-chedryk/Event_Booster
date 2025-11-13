(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const style = "";
const modal = document.getElementById("eventModal");
const closeBtn = document.querySelector(".close");
const modalImg = document.getElementById("modalImg");
const modalThumb = document.getElementById("modalThumb");
const modalTitle = document.getElementById("modalTitle");
const modalDate = document.getElementById("modalDate");
const modalPlace = document.getElementById("modalPlace");
const modalInfo = document.getElementById("modalInfo");
const modalLink = document.getElementById("modalLink");
const modalLink2 = document.getElementById("modalLink2");
const authorBtn = document.querySelector(".author-btn");
let scrollY = 0;
document.addEventListener("click", (e) => {
  var _a, _b, _c, _d, _e, _f;
  const card = e.target.closest(".event-card");
  if (!card)
    return;
  const img = (_a = card.querySelector("img")) == null ? void 0 : _a.src;
  const title = (_b = card.querySelector("h3")) == null ? void 0 : _b.textContent;
  const date = (_c = card.querySelector("p")) == null ? void 0 : _c.textContent;
  const place = ((_e = (_d = card.querySelectorAll("p")[1]) == null ? void 0 : _d.textContent) == null ? void 0 : _e.replace("📍", "")) || "";
  const link = (_f = card.querySelector("a")) == null ? void 0 : _f.href;
  modalImg.src = img;
  modalThumb.src = img;
  modalTitle.textContent = title;
  modalDate.textContent = date;
  modalPlace.textContent = place;
  modalInfo.textContent = "This event is one of the most exciting performances of the season. Get your tickets now!";
  modalLink.href = link;
  modalLink2.href = link;
  modal.style.display = "flex";
  scrollY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
});
const closeModal = () => {
  modal.style.display = "none";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  window.scrollTo(0, scrollY);
};
closeBtn.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  if (e.target === modal)
    closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.style.display === "flex") {
    closeModal();
  }
});
authorBtn.addEventListener("click", () => {
  window.open("https://www.nba.com/suns/", "_blank");
});
const apiKey = "2iGZoDHxlEzaibNheCZlL2JhbufbdSxs";
const grid = document.getElementById("events-grid");
const pagination = document.getElementById("pagination");
const keywordInput = document.getElementById("keyword");
const countrySelect = document.getElementById("country");
const searchBtn = document.getElementById("search-btn");
let currentPage = 0;
let totalPages = 1;
let currentKeyword = "";
let currentCountry = "";
async function fetchEvents(page = 0, append = false) {
  var _a, _b, _c;
  const keyword = keywordInput.value.trim();
  const country = countrySelect.value;
  if (page === 0) {
    currentKeyword = keyword;
    currentCountry = country;
  }
  const url = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
  url.searchParams.set("apikey", apiKey);
  if (currentKeyword)
    url.searchParams.set("keyword", currentKeyword);
  if (currentCountry)
    url.searchParams.set("countryCode", currentCountry);
  url.searchParams.set("size", 12);
  url.searchParams.set("page", page);
  if (!append)
    grid.innerHTML = "<p>Loading...</p>";
  else
    pagination.innerHTML = "<p>Loading more...</p>";
  try {
    const res = await fetch(url);
    const data = await res.json();
    const events = ((_a = data._embedded) == null ? void 0 : _a.events) || [];
    totalPages = ((_b = data.page) == null ? void 0 : _b.totalPages) || 1;
    currentPage = ((_c = data.page) == null ? void 0 : _c.number) || 0;
    renderEvents(events, append);
    renderLoadMore();
  } catch (error) {
    console.error(error);
    grid.innerHTML = `<p style="color:red">Error loading events. Check console for details.</p>`;
  }
}
function renderEvents(events, append = false) {
  if (!events.length && !append) {
    grid.innerHTML = "<p>No events found.</p>";
    return;
  }
  const eventCards = events.map(
    (e) => {
      var _a, _b, _c, _d, _e, _f, _g;
      return `
      <div class="event-card">
        <img src="${(_b = (_a = e.images) == null ? void 0 : _a[0]) == null ? void 0 : _b.url}" alt="${e.name}">
        <h3>${e.name}</h3>
        <p class="p-date">${((_d = (_c = e.dates) == null ? void 0 : _c.start) == null ? void 0 : _d.localDate) || "No date"}</p>
        <p class="p-adress">📍 ${((_g = (_f = (_e = e._embedded) == null ? void 0 : _e.venues) == null ? void 0 : _f[0]) == null ? void 0 : _g.name) || ""}</p>
        <a class="load-more-btn" href="${e.url}" target="_blank">More info</a>
      </div>
    `;
    }
  ).join("");
  if (append)
    grid.innerHTML += eventCards;
  else
    grid.innerHTML = eventCards;
}
function renderLoadMore() {
  if (currentPage + 1 < totalPages) {
    pagination.innerHTML = `
      <button id="load-more-btn">Load More</button>
    `;
    document.getElementById("load-more-btn").onclick = () => fetchEvents(currentPage + 1, true);
  } else {
    pagination.innerHTML = `<p>All events loaded ✅</p>`;
  }
}
searchBtn.addEventListener("click", () => fetchEvents(0));
fetchEvents();
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".about-us__slider");
  const slides = document.querySelectorAll(".about-us__slide");
  const btnLeft = document.querySelector(".about-us__arrow--left");
  const btnRight = document.querySelector(".about-us__arrow--right");
  let index = 0;
  const updateSlider = () => {
    const slideWidth = slides[0].offsetWidth + 20;
    slider.style.transform = `translateX(-${index * slideWidth}px)`;
  };
  btnLeft.addEventListener("click", () => {
    index = Math.max(index - 1, 0);
    updateSlider();
  });
  btnRight.addEventListener("click", () => {
    const visibleSlides = window.innerWidth >= 1200 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    index = Math.min(index + 1, slides.length - visibleSlides);
    updateSlider();
  });
  window.addEventListener("resize", updateSlider);
});
