import { profile, skills, projects, timeline, hobbies, roadmap } from './data.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage blocked, ignore */
    }
  },
};

let toastTimer;
function toast(message) {
  let el = $('#toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    el.setAttribute('role', 'status');
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ---------- comic sound-effect pops ---------- */
const WORDS = ['THWIP!', 'POW!', 'BAM!', 'ZAP!', 'WHAM!', 'GOAL!', 'KRAK!'];
function spawnPop(x, y, word) {
  const el = document.createElement('span');
  el.className = 'pop';
  el.textContent = word || WORDS[Math.floor(Math.random() * WORDS.length)];
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.setProperty('--rot', `${Math.round(Math.random() * 30 - 15)}deg`);
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
  setTimeout(() => el.remove(), 1400); // fallback when animations are disabled
}

/* ---------- renderers ---------- */
function renderAbout() {
  $('#bio').innerHTML = profile.bio.map((p) => `<p>${esc(p)}</p>`).join('');
  $('#facts').innerHTML = `
    <dt>Studying</dt><dd>${esc(profile.degree)}</dd>
    <dt>Graduating</dt><dd>${esc(profile.graduation)}</dd>
    <dt>Age</dt><dd>${esc(profile.age)}</dd>
    <dt>Into</dt><dd>Full-stack, mobile, 3D and games</dd>
    <dt>Team</dt><dd>Manchester City</dd>`;
}

function renderSkills() {
  $('#skill-groups').innerHTML = skills
    .map((g, i) => {
      const items = g.items
        .map((s) => {
          const badge = s.learning ? '<span class="badge">learning</span>' : '';
          const dots = s.level
            ? `<span class="lvl" role="img" aria-label="Level ${s.level} of 5">${[1, 2, 3, 4, 5]
                .map((n) => `<i class="${n <= s.level ? 'on' : ''}"></i>`)
                .join('')}</span>`
            : '';
          if (s.tag) {
            return `<li><button class="chip" type="button" data-tag="${esc(s.tag)}" data-label="${esc(s.name)}" aria-pressed="false"><span>${esc(s.name)} ${badge}</span>${dots}</button></li>`;
          }
          return `<li><span class="chip static"><span>${esc(s.name)} ${badge}</span>${dots}</span></li>`;
        })
        .join('');
      return `<div class="panel tilt" style="--r:${[-1.2, 1, -0.8, 1.4][i % 4]}deg;--sh:var(${i % 2 ? '--b' : '--a'})">
        <h3>${esc(g.group)}</h3><ul class="chips">${items}</ul></div>`;
    })
    .join('');
}

function renderProjects() {
  $('#project-grid').innerHTML = projects
    .map((p, i) => {
      const links = [
        p.live ? `<a class="btn small" href="${esc(p.live)}" target="_blank" rel="noopener">Visit live site</a>` : '',
        p.repo ? `<a class="btn small alt" href="${esc(p.repo)}" target="_blank" rel="noopener">View repo</a>` : '',
      ].join('');
      const feats = p.features?.length
        ? `<ul class="features">${p.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>`
        : '';
      return `
    <article class="panel card tilt${p.featured ? ' featured' : ''}" data-tags="${esc(p.tags.join(' '))}" style="--r:${p.featured ? 0 : [-1, 0.8, -0.6, 1.1, -0.9][i % 5]}deg;--sh:var(${p.featured ? '--a' : ['--a', '--b', '--c'][i % 3]})">
      <span class="status">${esc(p.status)}</span>
      <div class="card-main">
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.blurb)}</p>
        ${feats}
      </div>
      <div class="card-side">
        <ul class="tags">${p.stack.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
        <div class="card-links">${links}</div>
      </div>
    </article>`;
    })
    .join('');
}

function renderTimeline() {
  $('#timeline').innerHTML = timeline
    .map(
      (t, i) => `
    <li class="tl tl-${esc(t.kind)}">
      <div class="panel" style="--r:${i % 2 ? 0.7 : -0.7}deg;--sh:var(${i % 2 ? '--b' : '--a'})">
        <p class="when">${esc(t.when)}</p>
        <h3>${esc(t.title)}</h3>
        <p>${esc(t.body)}</p>
      </div>
    </li>`
    )
    .join('');
}

function renderHobbies() {
  $('#hobbies').innerHTML = hobbies
    .map(
      (h, i) => `
    <div class="flip" role="button" tabindex="0" aria-pressed="false" aria-label="${esc(h.front)}. Activate to read more.">
      <div class="flip-in">
        <div class="face front" style="--sh:var(${['--a', '--b', '--c', '--b'][i % 4]})"><span class="big">${esc(h.title)}</span><span class="small">${esc(h.front)}</span></div>
        <div class="face back"><p>${esc(h.back)}</p></div>
      </div>
    </div>`
    )
    .join('');
}

function renderRoadmap() {
  const saved = store.get('quest', null);
  const done = new Set(saved ?? roadmap.filter((r) => r.done).map((r) => r.id));
  const list = $('#quest');
  list.innerHTML = roadmap
    .map(
      (r, i) => `
    <li><button class="node" type="button" data-id="${esc(r.id)}" aria-pressed="${done.has(r.id)}" style="--r:${i % 2 ? 0.8 : -0.8}deg">
      <span class="node-title">${esc(r.title)}</span>
      <span class="node-body">${esc(r.body)}</span>
      <span class="stamp" aria-hidden="true">DONE</span>
    </button></li>`
    )
    .join('');

  const update = () => {
    const pct = Math.round((done.size / roadmap.length) * 100);
    $('#xp-fill').style.setProperty('--w', `${pct}%`);
    $('#xp-label').textContent = `Level ${done.size + 1}: ${done.size} of ${roadmap.length} quests done`;
  };
  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.node');
    if (!btn) return;
    const id = btn.dataset.id;
    if (done.has(id)) done.delete(id);
    else {
      done.add(id);
      const r = btn.getBoundingClientRect();
      spawnPop(r.right - 60, r.top + 20, 'LEVEL UP!');
    }
    btn.setAttribute('aria-pressed', String(done.has(id)));
    store.set('quest', [...done]);
    update();
  });
  update();
}

/* ---------- interactions ---------- */
function initFilter() {
  let active = null;
  const status = $('#filter-status');
  const cards = $$('.card');
  const chips = $$('.chip[data-tag]');

  function apply() {
    let matches = 0;
    cards.forEach((c) => {
      const has = !active || c.dataset.tags.split(' ').includes(active);
      c.classList.toggle('faded', !has);
      if (has) matches += 1;
    });
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.tag === active)));
    if (!active) status.textContent = 'Pick a skill above to filter the projects.';
    else {
      const label = chips.find((c) => c.dataset.tag === active)?.dataset.label || active;
      status.textContent = matches
        ? `Showing ${matches} project${matches > 1 ? 's' : ''} that use ${label}. Click the skill again to clear.`
        : `No project uses ${label} yet.`;
    }
  }

  chips.forEach((chip) =>
    chip.addEventListener('click', () => {
      active = active === chip.dataset.tag ? null : chip.dataset.tag;
      apply();
      if (active) $('#work').scrollIntoView({ behavior: 'smooth', block: 'start' });
    })
  );
  apply();
}

function initTilt() {
  if (!matchMedia('(hover: hover)').matches) return;
  $$('.tilt').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty('--ry', `${(px - 0.5) * 12}deg`);
      el.style.setProperty('--rx', `${(0.5 - py) * 12}deg`);
      el.style.setProperty('--gx', `${px * 100}%`);
      el.style.setProperty('--gy', `${py * 100}%`);
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--ry', '0deg');
      el.style.setProperty('--rx', '0deg');
    });
  });
}

function initFlip() {
  $$('.flip').forEach((el) => {
    const toggle = () => el.setAttribute('aria-pressed', String(el.getAttribute('aria-pressed') !== 'true'));
    el.addEventListener('click', toggle);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
}

function initDimensions(scene) {
  const root = document.documentElement;
  function apply(dim, announce) {
    root.dataset.dim = dim;
    $$('.dim').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.dim === dim)));
    const cs = getComputedStyle(root);
    const get = (n) => cs.getPropertyValue(n).trim();
    scene.setPalette([get('--a'), get('--b'), get('--c'), get('--d')], get('--ink'));
    $('meta[name="theme-color"]')?.setAttribute('content', get('--bg'));
    store.set('dim', dim);
    if (announce) toast(`Dimension: ${$(`.dim[data-dim="${dim}"]`)?.dataset.name ?? dim}`);
  }
  $$('.dim').forEach((b) => b.addEventListener('click', () => apply(b.dataset.dim, true)));
  apply(store.get('dim', '1610'), false);
  return apply;
}

function initPops(scene) {
  document.addEventListener('click', (e) => {
    if (e.target.closest('a,button,input,textarea,canvas,.chip,.flip,.nav,.node')) return;
    const struck = scene.hit(e.clientX, e.clientY);
    spawnPop(e.clientX, e.clientY, struck ? 'THWIP!' : undefined);
  });
}

function initNav() {
  const progress = $('#progress');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.setProperty('--p', max > 0 ? (window.scrollY / max).toFixed(4) : 0);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const links = $$('.nav-links a');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => {
          if (l.getAttribute('href') === `#${en.target.id}`) l.setAttribute('aria-current', 'true');
          else l.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  $$('main section[id]').forEach((s) => io.observe(s));
}

function initContact() {
  $('#mail-link').href = `mailto:${profile.email}`;
  $('#mail-link').textContent = profile.email;
  $('#gh-link').href = profile.github;
  $('#contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const subject = `Portfolio message from ${data.get('name')}`;
    const body = `${data.get('message')}\n\n${data.get('name')}\n${data.get('from')}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast('Opening your email app...');
  });
}

// Pulls the live repo list from GitHub. If it fails (offline, rate limit) the
// featured projects above still show, so nothing breaks.
async function loadRepos() {
  const box = $('#more-repos');
  try {
    const res = await fetch(`https://api.github.com/users/${profile.githubUser}/repos?per_page=100&sort=updated`);
    if (!res.ok) throw new Error(String(res.status));
    const repos = (await res.json()).filter((r) => !r.fork);
    const featured = new Set(projects.map((p) => p.repo).filter(Boolean).map((r) => r.toLowerCase()));
    const rest = repos.filter((r) => !featured.has(r.html_url.toLowerCase()));
    $('#repo-count').textContent = `${repos.length} public repositories on GitHub`;
    if (!rest.length) return;
    box.innerHTML = `<h3>More on GitHub</h3><ul class="repo-list">${rest
      .map(
        (r) =>
          `<li><a href="${esc(r.html_url)}" target="_blank" rel="noopener" title="${esc(r.description || '')}">${esc(r.name)}${
            r.language ? ` <small>${esc(r.language)}</small>` : ''
          }</a></li>`
      )
      .join('')}</ul>`;
  } catch {
    $('#repo-count').textContent = 'See everything on GitHub';
  }
}

function initKonami(applyDim) {
  const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let i = 0;
  const dims = ['1610', 'city', 'noir'];
  window.addEventListener('keydown', (e) => {
    i = e.key === seq[i] ? i + 1 : e.key === seq[0] ? 1 : 0;
    if (i !== seq.length) return;
    i = 0;
    toast('Multiverse unlocked!');
    for (let n = 0; n < 12; n++) {
      setTimeout(
        () => spawnPop(Math.random() * innerWidth, Math.random() * innerHeight * 0.8 + 60),
        n * 90
      );
    }
    dims.forEach((d, n) => setTimeout(() => applyDim(d, false), n * 500));
    setTimeout(() => applyDim(dims[0], false), dims.length * 500);
  });
}

export function initUI({ scene, morphButton }) {
  renderAbout();
  renderSkills();
  renderProjects();
  renderTimeline();
  renderHobbies();
  renderRoadmap();

  const applyDim = initDimensions(scene);
  initFilter();
  initTilt();
  initFlip();
  initPops(scene);
  initNav();
  initContact();
  initKonami(applyDim);
  loadRepos();
  morphButton?.addEventListener('click', () => {
    scene.cycleHero();
    const r = morphButton.getBoundingClientRect();
    spawnPop(r.right + 30, r.top, 'MORPH!');
  });
}