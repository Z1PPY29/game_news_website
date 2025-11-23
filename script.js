// Sample data: o'yinlar va release-lar
const games = [
  {
    id: 'g1',
    title: "Shadow Frontier",
    desc: "Atmosferik action-RPG with dynamic weather and deep story.",
    platform: "PC, PS5",
    releaseDate: "2025-12-05",
    released: false,
    img: "https://images.unsplash.com/photo-1606813902832-3b3b19a3a1a9?q=80&w=800&auto=format&fit=crop",
    url: "#"
  },
  {
    id: 'g2',
    title: "Neon Drift",
    desc: "Arcade racing with synthwave soundtrack.",
    platform: "PC, Xbox",
    releaseDate: "2024-10-01",
    released: true,
    img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop",
    url: "#"
  },
  {
    id: 'g3',
    title: "Galaxy Keepers",
    desc: "Sci-fi strategy with base-building and co-op.",
    platform: "PC",
    releaseDate: "2025-11-28",
    released: false,
    img: "https://images.unsplash.com/photo-1508610048659-a06fb8c02f6a?q=80&w=800&auto=format&fit=crop",
    url: "#"
  },
  {
    id: 'g4',
    title: "Retro Brawler X",
    desc: "2D beat 'em up classic remake.",
    platform: "Switch, PC",
    releaseDate: "2025-05-06",
    released: true,
    img: "https://images.unsplash.com/photo-1585079549659-6f345e2b2d3a?q=80&w=800&auto=format&fit=crop",
    url: "#"
  }
];

// State
let state = {
  query: '',
  filter: 'all',
  sortNewest: true
};

// DOM
const listEl = document.getElementById('gamesList');
const searchEl = document.getElementById('search');
const filterEl = document.getElementById('filter');
const chips = document.querySelectorAll('.chip');
const sortBtn = document.getElementById('sortBtn');
const calendarEl = document.getElementById('calendar');
const noResultsEl = document.getElementById('noResults');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');
const yearEl = document.getElementById('year');

yearEl.textContent = new Date().getFullYear();

// Helpers
function isUpcoming(g){
  const today = new Date();
  return new Date(g.releaseDate) > today;
}
function formatDate(d){
  const dt = new Date(d);
  return dt.toLocaleDateString('uz-UZ', {year:'numeric',month:'short',day:'numeric'});
}

// Render functions
function renderList(){
  let out = games.slice();

  // Filter by search
  if(state.query){
    const q = state.query.toLowerCase();
    out = out.filter(g => g.title.toLowerCase().includes(q) || g.platform.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q));
  }

  // Filter by released/upcoming
  if(state.filter === 'released'){
    out = out.filter(g => !isUpcoming(g));
  } else if(state.filter === 'upcoming'){
    out = out.filter(g => isUpcoming(g));
  }

  // Sort
  out.sort((a,b) => {
    if(state.sortNewest){
      return new Date(b.releaseDate) - new Date(a.releaseDate);
    }
    return new Date(a.releaseDate) - new Date(b.releaseDate);
  });

  // Render
  listEl.innerHTML = '';
  if(out.length === 0){
    noResultsEl.hidden = false;
    return;
  } else noResultsEl.hidden = true;

  out.forEach(g => {
    const li = document.createElement('li');
    li.className = 'game-item';
    li.innerHTML = `
      <div class="thumb" style="background-image:url('${g.img}')"></div>
      <div class="game-meta">
        <h3 class="title">${escapeHtml(g.title)}</h3>
        <div class="meta-row">
          <div class="badge">${isUpcoming(g) ? 'Upcoming' : 'Released'}</div>
          <div>${escapeHtml(g.platform)}</div>
          <div>•</div>
          <div>${formatDate(g.releaseDate)}</div>
        </div>
        <p style="margin:8px 0 0 0;color:var(--muted)">${truncate(g.desc, 120)}</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <button class="open-btn" data-id="${g.id}">Details</button>
        <a class="play-link" href="${g.url}" onclick="event.preventDefault()" style="text-decoration:none;color:var(--accent);font-weight:600">Read</a>
      </div>
    `;
    listEl.appendChild(li);
  });

  // Attach handlers for details buttons
  document.querySelectorAll('.open-btn').forEach(b => {
    b.addEventListener('click', ()=> openDetails(b.dataset.id));
  });
}

function renderCalendar(){
  // next 6 releases sorted by date
  const soon = games.slice().sort((a,b)=> new Date(a.releaseDate)-new Date(b.releaseDate)).slice(0,6);
  calendarEl.innerHTML = '';
  soon.forEach(g=>{
    const li = document.createElement('li');
    li.innerHTML = `<span>${formatDate(g.releaseDate)}</span><strong style="color:var(--accent)">${escapeHtml(g.title)}</strong>`;
    calendarEl.appendChild(li);
  });
}

// Modal
function openDetails(id){
  const g = games.find(x=>x.id===id);
  if(!g) return;
  modalBody.innerHTML = `
    <div class="modal-body">
      <h3>${escapeHtml(g.title)}</h3>
      <div style="display:flex;gap:12px;align-items:center;margin:12px 0">
        <div style="width:160px;height:90px;border-radius:8px;background-image:url('${g.img}');background-size:cover;background-position:center"></div>
        <div>
          <div style="color:var(--muted)">${escapeHtml(g.platform)}</div>
          <div style="margin-top:6px"><strong>${isUpcoming(g) ? 'Release:' : 'Released:'}</strong> ${formatDate(g.releaseDate)}</div>
        </div>
      </div>
      <p>${escapeHtml(g.desc)}</p>
      <div class="links">
        <a href="${g.url}" onclick="event.preventDefault()" style="color:var(--accent);font-weight:700">More information</a>
      </div>
    </div>
  `;
  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function closeDetails(){
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

// Utilities
function truncate(s,n){ return s.length>n? s.slice(0,n-1)+'…': s; }
function escapeHtml(unsafe){
  return unsafe
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
}

// Events
searchEl.addEventListener('input', e => {
  state.query = e.target.value.trim();
  renderList();
});
filterEl.addEventListener('change', e => {
  state.filter = e.target.value;
  renderList();
});
chips.forEach(c=>{
  c.addEventListener('click', ()=> {
    const f = c.dataset.filter;
    state.filter = f;
    filterEl.value = f;
    renderList();
  });
});
sortBtn.addEventListener('click', ()=>{
  state.sortNewest = !state.sortNewest;
  sortBtn.textContent = state.sortNewest ? 'Sort: Newest' : 'Sort: Oldest';
  renderList();
});
closeModal.addEventListener('click', closeDetails);
modal.addEventListener('click', (e)=>{
  if(e.target === modal) closeDetails();
});

// Init
renderList();
renderCalendar();
