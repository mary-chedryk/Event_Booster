// const apiKey = '2iGZoDHxlEzaibNheCZlL2JhbufbdSxs'; 
// const grid = document.getElementById('events-grid');
// const pagination = document.getElementById('pagination');
// const keywordInput = document.getElementById('keyword');
// const countrySelect = document.getElementById('country');
// const searchBtn = document.getElementById('search-btn');

// let currentPage = 0;
// let totalPages = 1;
// let currentKeyword = '';
// let currentCountry = '';

// async function fetchEvents(page = 0, append = false) {
//   const keyword = keywordInput.value.trim();
//   const country = countrySelect.value;

//   // Save filters so "Load more" uses same query
//   if (page === 0) {
//     currentKeyword = keyword;
//     currentCountry = country;
//   }

//   const url = new URL('https://app.ticketmaster.com/discovery/v2/events.json');
//   url.searchParams.set('apikey', apiKey);
//   if (currentKeyword) url.searchParams.set('keyword', currentKeyword);
//   if (currentCountry) url.searchParams.set('countryCode', currentCountry);
//   url.searchParams.set('size', 12);
//   url.searchParams.set('page', page);

//   if (!append) grid.innerHTML = '<p>Loading...</p>';
//   else pagination.innerHTML = '<p>Loading more...</p>';

//   try {
//     const res = await fetch(url);
//     const data = await res.json();

//     const events = data._embedded?.events || [];
//     totalPages = data.page?.totalPages || 1;
//     currentPage = data.page?.number || 0;

//     renderEvents(events, append);
//     renderLoadMore();
//   } catch (error) {
//     console.error(error);
//     grid.innerHTML = `<p style="color:red">Error loading events. Check console for details.</p>`;
//   }
// }

// function renderEvents(events, append = false) {
//   if (!events.length && !append) {
//     grid.innerHTML = '<p>No events found.</p>';
//     return;
//   }

//   grid.innerHTML = events
//     .map(
//       (e) => `
//     <div class="event-card">
//       <img src="${e.images?.[0]?.url}" alt="${e.name}">
//       <h3>${e.name}</h3>
//       <p class="p-date">${e.dates?.start?.localDate || 'No date'}</p>
//       <p class="p-adress">📍 ${e._embedded?.venues?.[0]?.name || ''}</p>
//       <a class="load-more-btn" href="${e.url}" target="_blank">More info</a>
//     </div>
//   `
//     )
//     .join('');

//      if (append) grid.innerHTML += grid.innerHTML;
//   else grid.innerHTML = grid.innerHTML;
// }

// // function renderPagination(totalPages, current) {
// //   let buttons = '';
// //   const maxPages = Math.min(totalPages, 6);

// //   for (let i = 0; i < maxPages; i++) {
// //     buttons += `<button class="${i === current ? 'active' : ''}" onclick="fetchEvents(${i})">${i + 1}</button>`;
// //   }

// //   pagination.innerHTML = buttons;
// // }
// function renderLoadMore() {
//   if (currentPage + 1 < totalPages) {
//     pagination.innerHTML = `
//       <button id="load-more-btn">Load More</button>
//     `;
//     document.getElementById('load-more-btn').onclick = () => fetchEvents(currentPage + 1, true);
//   } else {
//     pagination.innerHTML = `<p>All events loaded ✅</p>`;
//   }

// }
// searchBtn.addEventListener('click', () => fetchEvents(0));

// // Load default
// fetchEvents();

const apiKey = '2iGZoDHxlEzaibNheCZlL2JhbufbdSxs'; 
const grid = document.getElementById('events-grid');
const pagination = document.getElementById('pagination');
const keywordInput = document.getElementById('keyword');
const countrySelect = document.getElementById('country');
const searchBtn = document.getElementById('search-btn');

let currentPage = 0;
let totalPages = 1;
let currentKeyword = '';
let currentCountry = '';

async function fetchEvents(page = 0, append = false) {
  const keyword = keywordInput.value.trim();
  const country = countrySelect.value;

  // Save filters so "Load more" uses same query
  if (page === 0) {
    currentKeyword = keyword;
    currentCountry = country;
  }

  const url = new URL('https://app.ticketmaster.com/discovery/v2/events.json');
  url.searchParams.set('apikey', apiKey);
  if (currentKeyword) url.searchParams.set('keyword', currentKeyword);
  if (currentCountry) url.searchParams.set('countryCode', currentCountry);
  url.searchParams.set('size', 12);
  url.searchParams.set('page', page);

  if (!append) grid.innerHTML = '<p>Loading...</p>';
  else pagination.innerHTML = '<p>Loading more...</p>';

  try {
    const res = await fetch(url);
    const data = await res.json();

    const events = data._embedded?.events || [];
    totalPages = data.page?.totalPages || 1;
    currentPage = data.page?.number || 0;

    renderEvents(events, append);
    renderLoadMore();
  } catch (error) {
    console.error(error);
    grid.innerHTML = `<p style="color:red">Error loading events. Check console for details.</p>`;
  }
}

function renderEvents(events, append = false) {
  if (!events.length && !append) {
    grid.innerHTML = '<p>No events found.</p>';
    return;
  }

  const eventCards = events.map(
    (e) => `
      <div class="event-card">
        <img src="${e.images?.[0]?.url}" alt="${e.name}">
        <h3>${e.name}</h3>
        <p class="p-date">${e.dates?.start?.localDate || 'No date'}</p>
        <p class="p-adress">📍 ${e._embedded?.venues?.[0]?.name || ''}</p>
        <a class="load-more-btn" href="${e.url}" target="_blank">More info</a>
      </div>
    `
  ).join('');

  if (append) grid.innerHTML += eventCards;
  else grid.innerHTML = eventCards;
}

function renderLoadMore() {
  if (currentPage + 1 < totalPages) {
    pagination.innerHTML = `
      <button id="load-more-btn">Load More</button>
    `;
    document.getElementById('load-more-btn').onclick = () => fetchEvents(currentPage + 1, true);
  } else {
    pagination.innerHTML = `<p>All events loaded ✅</p>`;
  }
}

searchBtn.addEventListener('click', () => fetchEvents(0));

// Load default
fetchEvents();