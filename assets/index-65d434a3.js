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
});
closeBtn.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => {
  if (e.target === modal)
    modal.style.display = "none";
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
async function fetchEvents(page = 0) {
  var _a;
  const keyword = keywordInput.value.trim();
  const country = countrySelect.value;
  const url = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
  url.searchParams.set("apikey", apiKey);
  if (keyword)
    url.searchParams.set("keyword", keyword);
  if (country)
    url.searchParams.set("countryCode", country);
  url.searchParams.set("size", 12);
  url.searchParams.set("page", page);
  grid.innerHTML = "<p>Loading...</p>";
  try {
    const res = await fetch(url);
    const data = await res.json();
    const events = ((_a = data._embedded) == null ? void 0 : _a.events) || [];
    renderEvents(events);
    const pageInfo = data.page || {};
    renderPagination(pageInfo.totalPages || 1, pageInfo.number || 0);
  } catch (error) {
    console.error(error);
    grid.innerHTML = `<p style="color:red">Error loading events. Check console for details.</p>`;
  }
}
function renderEvents(events) {
  if (!events.length) {
    grid.innerHTML = "<p>No events found.</p>";
    return;
  }
  grid.innerHTML = events.map(
    (e) => {
      var _a, _b, _c, _d, _e, _f, _g;
      return `
    <div class="event-card">
      <img src="${(_b = (_a = e.images) == null ? void 0 : _a[0]) == null ? void 0 : _b.url}" alt="${e.name}">
      <h3>${e.name}</h3>
      <p>${((_d = (_c = e.dates) == null ? void 0 : _c.start) == null ? void 0 : _d.localDate) || "No date"}</p>
      <p>📍 ${((_g = (_f = (_e = e._embedded) == null ? void 0 : _e.venues) == null ? void 0 : _f[0]) == null ? void 0 : _g.name) || ""}</p>
      <a href="${e.url}" target="_blank">More info</a>
    </div>
  `;
    }
  ).join("");
}
function renderPagination(totalPages, current) {
  let buttons = "";
  const maxPages = Math.min(totalPages, 6);
  for (let i = 0; i < maxPages; i++) {
    buttons += `<button class="${i === current ? "active" : ""}" onclick="fetchEvents(${i})">${i + 1}</button>`;
  }
  pagination.innerHTML = buttons;
}
searchBtn.addEventListener("click", () => fetchEvents(0));
fetchEvents();
