const apiKey = '2iGZoDHxlEzaibNheCZlL2JhbufbdSxs'; 
const grid = document.getElementById('events-grid');
const pagination = document.getElementById('pagination');
const keywordInput = document.getElementById('keyword');
const countrySelect = document.getElementById('country');
const searchBtn = document.getElementById('search-btn');

let currentPage = 0;

async function fetchEvents(page = 0) {
  const keyword = keywordInput.value.trim();
  const country = countrySelect.value;

  const url = new URL('https://app.ticketmaster.com/discovery/v2/events.json');
  url.searchParams.set('apikey', apiKey);
  if (keyword) url.searchParams.set('keyword', keyword);
  if (country) url.searchParams.set('countryCode', country);
  url.searchParams.set('size', 12);
  url.searchParams.set('page', page);

  grid.innerHTML = '<p>Loading...</p>';

  try {
    const res = await fetch(url);
    const data = await res.json();

    const events = data._embedded?.events || [];
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
    grid.innerHTML = '<p>No events found.</p>';
    return;
  }

  grid.innerHTML = events
    .map(
      (e) => `
    <div class="event-card">
      <img src="${e.images?.[0]?.url}" alt="${e.name}">
      <h3>${e.name}</h3>
      <p class="p-date">${e.dates?.start?.localDate || 'No date'}</p>
      <p class="p-adress">📍 ${e._embedded?.venues?.[0]?.name || ''}</p>
      <a href="${e.url}" target="_blank">More info</a>
    </div>
  `
    )
    .join('');
}

function renderPagination(totalPages, current) {
  let buttons = '';
  const maxPages = Math.min(totalPages, 6);

  for (let i = 0; i < maxPages; i++) {
    buttons += `<button class="${i === current ? 'active' : ''}" onclick="fetchEvents(${i})">${i + 1}</button>`;
  }

  pagination.innerHTML = buttons;
}

searchBtn.addEventListener('click', () => fetchEvents(0));

// Load default
fetchEvents();
