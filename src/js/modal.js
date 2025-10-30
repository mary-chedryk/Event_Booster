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
  const card = e.target.closest(".event-card");
  if (!card) return;

  const img = card.querySelector("img")?.src;
  const title = card.querySelector("h3")?.textContent;
  const date = card.querySelector("p")?.textContent;
  const place =
    card.querySelectorAll("p")[1]?.textContent?.replace("📍", "") || "";
  const link = card.querySelector("a")?.href;

  modalImg.src = img;
  modalThumb.src = img;
  modalTitle.textContent = title;
  modalDate.textContent = date;
  modalPlace.textContent = place;
  modalInfo.textContent =
    "This event is one of the most exciting performances of the season. Get your tickets now!";
  modalLink.href = link;
  modalLink2.href = link;

  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => (modal.style.display = "none"));
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});


authorBtn.addEventListener("click", () => {
  window.open("https://www.nba.com/suns/", "_blank");
});