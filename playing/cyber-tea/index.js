const state = {
  theme: 'bamboo',
  tea: null,
  leavesAdded: false,
  waterAdded: false,
  brewing: false,
  brewed: false,
  infusion: 1,
  maxInfusions: 3,
  infusionHistory: [],
  heat: 48,
  temperature: 22,
  strength: 0,
  calm: 18,
  drag: null,
  home: {},
  fanBoostUntil: 0,
  audioOn: true,
  musicOn: false,
  volume: 58,
  progress: 0,
  zones: {},
  embedUrl: '',
  playerVisible: true,
  roomDraftName: '',
  meditationMinutes: 3,
  meditationRemaining: 180,
  meditationRunning: false,
  meditationTimer: null,
  breathIndex: 0,
};

const themes = [
  { id: 'bamboo', name: '竹林曲水', badge: '竹林 · 曲水 · 轻烟', track: '竹林风与水声', desc: '更自然的风、水与木质共鸣。' },
  { id: 'neon', name: '霓虹禅亭', badge: '霓虹 · 雨幕 · 低频', track: '霓虹低频与雨幕', desc: '更冷更赛博，适合夜晚放空。' },
  { id: 'ink', name: '墨室夜雨', badge: '墨室 · 夜雨 · 余白', track: '夜雨墨室', desc: '更安静、留白更强。' },
];

const teas = [
  {
    id: 'black',
    name: '炭焙红茶',
    note: '温润甜香，适合煮饮。',
    target: 68,
    brewSec: 12,
    calmGain: 14,
    colors: ['#8d5a26', '#583216'],
    flavor: ['甜香舒展', '焦糖感更明显', '尾韵沉稳收束'],
  },
  {
    id: 'oolong',
    name: '焙火乌龙',
    note: '香高有层次，韵味很适合多泡。',
    target: 74,
    brewSec: 14,
    calmGain: 16,
    colors: ['#4f7a33', '#29461f'],
    flavor: ['焙火初开', '花果层次展开', '喉韵回甘更长'],
  },
  {
    id: 'white',
    name: '月光白茶',
    note: '轻柔木香，适合安静地慢饮。',
    target: 62,
    brewSec: 10,
    calmGain: 18,
    colors: ['#b0c5a3', '#6d7a61'],
    flavor: ['清柔醒香', '木甜感更明显', '余味更空灵'],
  },
  {
    id: 'pu',
    name: '陈香熟普',
    note: '厚重沉静，越泡越稳。',
    target: 78,
    brewSec: 16,
    calmGain: 20,
    colors: ['#513729', '#2c1b12'],
    flavor: ['陈香初显', '厚度与甜感拉开', '沉香感更完整'],
  },
];

const stepDefs = [
  { key: 'tea', title: '选定茶叶', text: '决定这一轮茶室的性格。' },
  { key: 'leaves', title: '投茶入壶', text: '将茶叶拖入壶中。' },
  { key: 'water', title: '注水醒茶', text: '拖热水壶靠近壶口注水。' },
  { key: 'brew', title: '候汤焖煮', text: '点击候汤，并可借风助燃。' },
  { key: 'pour', title: '拎壶分茶', text: '焖煮完成后，直接提壶倒向杯口。' },
];

const $ = (s) => document.querySelector(s);
const els = {
  scene: $('#scene'),
  themePills: $('#themePills'),
  teaCards: $('#teaCards'),
  envChip: $('#envChip'),
  sceneBadge: $('#sceneBadge'),
  trackName: $('#trackName'),
  trackDesc: $('#trackDesc'),
  audioToggle: $('#audioToggle'),
  musicToggle: $('#musicToggle'),
  volumeRange: $('#volumeRange'),
  volumeVal: $('#volumeVal'),
  embedInput: $('#embedInput'),
  loadEmbedBtn: $('#loadEmbedBtn'),
  clearEmbedBtn: $('#clearEmbedBtn'),
  externalPlayerCard: $('#externalPlayerCard'),
  externalFrame: $('#externalFrame'),
  togglePlayerBtn: $('#togglePlayerBtn'),
  externalFrameWrap: $('#externalFrameWrap'),
  heatRange: $('#heatRange'),
  heatVal: $('#heatVal'),
  tempStat: $('#tempStat'),
  strengthStat: $('#strengthStat'),
  calmStat: $('#calmStat'),
  infusionStat: $('#infusionStat'),
  progressLabel: $('#progressLabel'),
  teaSummary: $('#teaSummary'),
  progressFill: $('#progressFill'),
  ritualTitle: $('#ritualTitle'),
  ritualHint: $('#ritualHint'),
  steps: $('#steps'),
  feedbackBox: $('#feedbackBox'),
  infusionHistory: $('#infusionHistory'),
  brewBtn: $('#brewBtn'),
  nextInfusionBtn: $('#nextInfusionBtn'),
  resetBtn: $('#resetBtn'),
  toast: $('#toast'),
  steamLayer: $('#steamLayer'),
  particleLayer: $('#particleLayer'),
  trayWrap: $('#trayWrap'),
  potWrap: $('#potWrap'),
  cupWrap: $('#cupWrap'),
  kettleWrap: $('#kettleWrap'),
  fanWrap: $('#fanWrap'),
  potZone: $('#potZone'),
  fireZone: $('#fireZone'),
  cupZone: $('#cupZone'),
  pourStream: $('#pourStream'),
  embers: $('#embers'),
  breathCore: $('#breathCore'),
  breathText: $('#breathText'),
  roomNameInput: $('#roomNameInput'),
  saveRoomBtn: $('#saveRoomBtn'),
  savedRooms: $('#savedRooms'),
  meditationTime: $('#meditationTime'),
  meditationState: $('#meditationState'),
  startMeditationBtn: $('#startMeditationBtn'),
  pauseMeditationBtn: $('#pauseMeditationBtn'),
  resetMeditationBtn: $('#resetMeditationBtn'),
};

let brewTimer = null;
let audioCtx, masterGain, ambientGain, musicGain, noiseSource, noiseGain, noiseFilter, drones = [], pulseOsc, pulseGain, pulseLfo;
const STORAGE_KEY = 'cyber-tea-rooms';

function currentTea() {
  return teas.find((t) => t.id === state.tea);
}
function currentProfile() {
  const tea = currentTea();
  if (!tea) return { target: 0, brewSec: 0, note: '未选茶' };
  const idx = Math.max(0, Math.min(state.infusion - 1, tea.flavor.length - 1));
  return {
    target: Math.max(56, tea.target - idx * 2),
    brewSec: tea.brewSec + idx * 2,
    note: tea.flavor[idx],
  };
}
function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function renderThemePills() {
  els.themePills.innerHTML = themes.map(t => `<button class="pill ${state.theme === t.id ? 'active' : ''}" data-theme="${t.id}">${t.name}</button>`).join('');
  els.themePills.querySelectorAll('button').forEach(btn => {
    btn.onclick = () => {
      state.theme = btn.dataset.theme;
      applyTheme();
      renderThemePills();
      ensureAudio();
      updateAudioState();
      showToast(`已切换到 ${themes.find(t => t.id === state.theme).name}`);
    };
  });
}

function renderTeaCards() {
  els.teaCards.innerHTML = teas.map(t => `
    <button class="tea-card ${state.tea === t.id ? 'active' : ''}" data-tea="${t.id}">
      <div class="tea-top">
        <div class="tea-icon">
          <i style="background:linear-gradient(90deg, ${t.colors[0]}, ${t.colors[1]})"></i>
        </div>
        <strong>${t.name}</strong>
      </div>
      <span>${t.note}</span>
    </button>
  `).join('');
  els.teaCards.querySelectorAll('button').forEach(btn => {
    btn.onclick = () => {
      state.tea = btn.dataset.tea;
      state.calm = Math.min(99, state.calm + 3);
      resetInfusionProgress(false);
      renderTeaCards();
      refreshTray();
      renderPot();
      renderCup();
      updateProgress();
      updateStats();
      updateGuide();
      showToast(`今日茶选：${currentTea().name}`);
    };
  });
}

function applyTheme() {
  const theme = themes.find(t => t.id === state.theme);
  els.scene.className = `scene theme-${state.theme}`;
  els.envChip.textContent = `当前环境：${theme.name}`;
  els.sceneBadge.textContent = theme.badge;
  els.trackName.textContent = theme.track;
  els.trackDesc.textContent = theme.desc;
}

function teaLeafMarkup(colors) {
  return `
    <ellipse cx="70" cy="74" rx="14" ry="7" fill="${colors[0]}" transform="rotate(-18 70 74)" />
    <ellipse cx="94" cy="67" rx="15" ry="7" fill="${colors[1]}" transform="rotate(24 94 67)" />
    <ellipse cx="117" cy="78" rx="14" ry="7" fill="${colors[0]}" transform="rotate(-6 117 78)" />
    <ellipse cx="140" cy="65" rx="16" ry="7" fill="${colors[1]}" transform="rotate(18 140 65)" />
    <ellipse cx="127" cy="89" rx="13" ry="6" fill="${colors[0]}" transform="rotate(-12 127 89)" />
  `;
}

function refreshTray() {
  const tea = currentTea();
  const colors = tea ? tea.colors : ['#7a8b7b', '#53604f'];
  const ready = !!tea && !state.leavesAdded;
  els.trayWrap.innerHTML = `
    <svg viewBox="0 0 220 150" width="100%" height="100%">
      <defs>
        <linearGradient id="trayWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(124,88,58,0.95)" />
          <stop offset="100%" stop-color="rgba(57,35,25,0.95)" />
        </linearGradient>
      </defs>
      <rect x="18" y="30" width="184" height="92" rx="24" fill="url(#trayWood)" stroke="rgba(255,255,255,.08)" />
      <rect x="28" y="38" width="164" height="76" rx="18" fill="rgba(0,0,0,.12)" stroke="rgba(255,255,255,.05)" />
      ${tea ? `<g id="teaLeafGroup">${teaLeafMarkup(colors)}</g><text x="110" y="112" text-anchor="middle" fill="rgba(232,246,255,.8)" font-size="12">${tea.name}</text>` : `<text x="110" y="80" text-anchor="middle" fill="rgba(232,246,255,.55)" font-size="13">先在左侧选择一种茶</text>`}
    </svg>
  `;
  if (ready) {
    els.trayWrap.querySelector('svg').addEventListener('pointerdown', startLeafDrag);
    els.trayWrap.style.cursor = 'grab';
  } else {
    els.trayWrap.style.cursor = 'default';
  }
}

function renderPot() {
  const tea = currentTea();
  const colors = tea ? tea.colors : ['#8d5a26', '#583216'];
  const liquidTop = state.theme === 'neon' ? 'rgba(112,145,220,.82)' : state.theme === 'ink' ? 'rgba(145,125,112,.76)' : 'rgba(164,112,41,.84)';
  const liquidBottom = state.theme === 'neon' ? 'rgba(54,44,116,.92)' : state.theme === 'ink' ? 'rgba(76,56,50,.90)' : 'rgba(88,51,18,.92)';
  const fillOpacity = state.waterAdded || state.brewed ? Math.min(1, 0.24 + state.strength / 110) : 0;
  const handleGlow = state.brewed ? 0.18 : 0.05;
  const leaves = state.leavesAdded ? `
    <ellipse cx="110" cy="124" rx="8" ry="4" fill="${colors[0]}" transform="rotate(24 110 124)" />
    <ellipse cx="133" cy="120" rx="9" ry="4" fill="${colors[1]}" transform="rotate(-18 133 120)" />
    <ellipse cx="151" cy="126" rx="7" ry="3.6" fill="${colors[0]}" transform="rotate(12 151 126)" />
  ` : '';
  els.potWrap.dataset.grabbable = state.brewed ? 'true' : 'false';
  els.potWrap.innerHTML = `
    <svg viewBox="0 0 260 240" width="100%" height="100%">
      <defs>
        <linearGradient id="potBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(41,49,58,0.95)" />
          <stop offset="100%" stop-color="rgba(16,20,28,0.96)" />
        </linearGradient>
        <linearGradient id="teaLiquidPot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${liquidTop}" />
          <stop offset="100%" stop-color="${liquidBottom}" />
        </linearGradient>
      </defs>
      <ellipse cx="130" cy="184" rx="86" ry="18" fill="rgba(0,0,0,.18)" />
      <path d="M64 112c0-40 30-74 66-74s66 34 66 74v20c0 32-30 58-66 58s-66-26-66-58z" fill="url(#potBody)" stroke="rgba(255,255,255,.08)" stroke-width="2"/>
      <ellipse cx="130" cy="112" rx="66" ry="18" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.08)" />
      <ellipse cx="130" cy="118" rx="58" ry="12" fill="rgba(0,0,0,.25)" />
      <rect x="112" y="52" width="36" height="10" rx="5" fill="rgba(255,255,255,.1)" />
      <circle cx="130" cy="50" r="10" fill="rgba(255,255,255,${handleGlow})" stroke="rgba(255,255,255,.1)" />
      <path d="M50 106c-20 8-24 44 0 54" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="8" stroke-linecap="round"/>
      <path d="M197 104c25 6 32 40 10 56" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="8" stroke-linecap="round"/>
      <g opacity="${fillOpacity}">
        <ellipse cx="130" cy="122" rx="54" ry="10" fill="url(#teaLiquidPot)" />
      </g>
      ${leaves}
    </svg>
  `;
}

function renderCup() {
  const liquidTop = state.theme === 'neon' ? 'rgba(112,145,220,.82)' : state.theme === 'ink' ? 'rgba(145,125,112,.76)' : 'rgba(164,112,41,.84)';
  const liquidBottom = state.theme === 'neon' ? 'rgba(54,44,116,.92)' : state.theme === 'ink' ? 'rgba(76,56,50,.90)' : 'rgba(88,51,18,.92)';
  const latest = state.infusionHistory[state.infusionHistory.length - 1];
  const visible = latest ? Math.min(34, 8 + latest.strength * 0.22) : 0;
  els.cupWrap.innerHTML = `
    <svg viewBox="0 0 160 140" width="100%" height="100%">
      <defs>
        <linearGradient id="teaLiquidCup" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${liquidTop}" />
          <stop offset="100%" stop-color="${liquidBottom}" />
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="108" rx="44" ry="10" fill="rgba(0,0,0,.16)" />
      <path d="M44 36h72l-8 56c-2 12-12 18-28 18s-26-6-28-18z" fill="rgba(232,242,248,.92)" stroke="rgba(255,255,255,.15)" />
      <ellipse cx="80" cy="36" rx="36" ry="8" fill="rgba(255,255,255,.28)" stroke="rgba(255,255,255,.15)" />
      <ellipse cx="80" cy="${92 - visible}" rx="25" ry="${Math.max(5, visible * 0.18)}" fill="url(#teaLiquidCup)" opacity="${latest ? 1 : 0}" />
      ${latest ? `<text x="80" y="128" text-anchor="middle" fill="rgba(232,246,255,.68)" font-size="11">第 ${latest.infusion} 泡</text>` : ''}
    </svg>
  `;
}

function renderKettle() {
  els.kettleWrap.innerHTML = `
    <svg viewBox="0 0 170 170" width="100%" height="100%">
      <defs>
        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="rgba(232,246,255,.82)" />
          <stop offset="100%" stop-color="rgba(90,112,132,.85)" />
        </linearGradient>
      </defs>
      <circle cx="82" cy="92" r="46" fill="url(#metal)" stroke="rgba(255,255,255,.24)" />
      <path d="M96 54c10-18 32-16 42 2" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="8" stroke-linecap="round"/>
      <path d="M42 88c-20 8-22 32-4 44" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="8" stroke-linecap="round"/>
      <path d="M112 86c16-12 26-12 36-4" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="8" stroke-linecap="round"/>
      <path d="M116 83c14 6 20 12 23 22" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="5" stroke-linecap="round"/>
      <rect x="70" y="36" width="24" height="12" rx="6" fill="rgba(255,255,255,.12)" />
      <circle cx="82" cy="34" r="10" fill="rgba(255,255,255,.12)"/>
      <text x="84" y="154" text-anchor="middle" fill="rgba(232,246,255,.68)" font-size="12">热水壶</text>
    </svg>
  `;
}

function renderFan() {
  els.fanWrap.innerHTML = `
    <svg viewBox="0 0 130 130" width="100%" height="100%">
      <defs>
        <linearGradient id="fanG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="rgba(42,55,72,.92)" />
          <stop offset="100%" stop-color="rgba(18,24,34,.96)" />
        </linearGradient>
      </defs>
      <circle cx="65" cy="54" r="38" fill="url(#fanG)" stroke="rgba(255,255,255,.1)" />
      <circle cx="65" cy="54" r="9" fill="rgba(124,231,255,.48)" />
      <path d="M65 25c11 0 18 8 18 15-10 6-24 8-33 6 0-9 4-21 15-21z" fill="rgba(124,231,255,.38)"/>
      <path d="M89 60c8 7 9 18 4 24-11-2-24-10-30-18 7-6 17-13 26-6z" fill="rgba(124,231,255,.28)"/>
      <path d="M44 70c-3 11-13 16-21 14-2-11 2-26 9-33 8 4 15 10 12 19z" fill="rgba(124,231,255,.22)"/>
      <rect x="58" y="90" width="14" height="20" rx="6" fill="rgba(255,255,255,.14)" />
      <text x="65" y="122" text-anchor="middle" fill="rgba(232,246,255,.68)" font-size="12">风扇</text>
    </svg>
  `;
}

function renderEmbers() {
  const heat = effectiveHeat();
  els.embers.style.opacity = Math.min(.95, .15 + heat / 130);
  els.embers.innerHTML = Array.from({ length: 7 }).map((_, i) => {
    const h = 12 + ((i % 3) * 8 + (0.2 + heat / 100 * .9) * 16);
    return `<span class="flame" style="height:${h}px;animation-delay:${(i * .11).toFixed(2)}s"></span>`;
  }).join('');
}

function effectiveHeat() {
  const boost = Date.now() < state.fanBoostUntil ? 20 : 0;
  return Math.min(100, state.heat + boost);
}

function bindDragItem(el, type, canStart) {
  el.addEventListener('pointerdown', (ev) => {
    if (canStart && !canStart()) return;
    ensureAudio();
    const rect = el.getBoundingClientRect();
    state.drag = { type, el, dx: ev.clientX - rect.left, dy: ev.clientY - rect.top };
    el.style.left = rect.left + 'px';
    el.style.top = rect.top + 'px';
    el.style.right = 'auto';
    el.style.bottom = 'auto';
    el.style.transform = 'none';
    el.style.position = 'fixed';
    el.style.zIndex = '20';
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp, { once: true });
  });
}

function bindDraggables() {
  bindDragItem(els.kettleWrap, 'kettle');
  bindDragItem(els.fanWrap, 'fan');
  bindDragItem(els.potWrap, 'pot', () => state.brewed && !state.brewing);
}

function saveHomes() {
  ['kettleWrap', 'fanWrap', 'potWrap'].forEach((key) => {
    const el = els[key];
    const st = getComputedStyle(el);
    state.home[key] = {
      left: st.left,
      top: st.top,
      right: st.right,
      bottom: st.bottom,
      transform: st.transform === 'none' ? '' : st.transform,
    };
  });
}

function restoreHome(el, key) {
  const home = state.home[key];
  el.style.position = 'absolute';
  el.style.left = home.left;
  el.style.top = home.top;
  el.style.right = home.right;
  el.style.bottom = home.bottom;
  el.style.transform = home.transform;
  el.style.zIndex = '2';
  requestAnimationFrame(layoutZones);
}

function layoutZones() {
  const potRect = els.potWrap.getBoundingClientRect();
  const cupRect = els.cupWrap.getBoundingClientRect();
  const sceneRect = els.scene.getBoundingClientRect();
  const px = potRect.left - sceneRect.left;
  const py = potRect.top - sceneRect.top;
  const cx = cupRect.left - sceneRect.left;
  const cy = cupRect.top - sceneRect.top;

  Object.assign(els.potZone.style, {
    left: `${px + potRect.width * 0.31}px`,
    top: `${py + potRect.height * 0.18}px`,
    width: `${potRect.width * 0.38}px`,
    height: `${potRect.height * 0.22}px`,
  });

  Object.assign(els.fireZone.style, {
    left: `${px + potRect.width * 0.12}px`,
    top: `${py + potRect.height * 0.72}px`,
    width: `${potRect.width * 0.74}px`,
    height: `${potRect.height * 0.18}px`,
  });

  Object.assign(els.cupZone.style, {
    left: `${cx + cupRect.width * 0.18}px`,
    top: `${cy + cupRect.height * 0.1}px`,
    width: `${cupRect.width * 0.54}px`,
    height: `${cupRect.height * 0.38}px`,
  });

  state.zones.pot = els.potZone.getBoundingClientRect();
  state.zones.fire = els.fireZone.getBoundingClientRect();
  state.zones.cup = els.cupZone.getBoundingClientRect();
}

function startLeafDrag(ev) {
  if (!state.tea || state.leavesAdded) return;
  const tea = currentTea();
  const leaf = document.createElement('div');
  leaf.className = 'tea-drop';
  leaf.style.background = `linear-gradient(90deg, ${tea.colors[0]}, ${tea.colors[1]})`;
  document.body.appendChild(leaf);
  positionLeaf(leaf, ev.clientX, ev.clientY);
  state.drag = { type: 'leaf', el: leaf };
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp, { once: true });
  highlightZone('pot');
  ensureAudio();
}

function positionLeaf(el, x, y) {
  el.style.left = `${x - 9}px`;
  el.style.top = `${y - 5}px`;
}
function insideRect(x, y, rect) {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}
function nearRect(x, y, rect, gap = 40) {
  return x >= rect.left - gap && x <= rect.right + gap && y >= rect.top - gap && y <= rect.bottom + gap;
}
function toggleZone(el, on) { el.classList.toggle('highlight', on); }
function clearHighlights() { [els.potZone, els.fireZone, els.cupZone].forEach(z => z.classList.remove('highlight')); }
function highlightZone(kind) { clearHighlights(); if (kind === 'pot') els.potZone.classList.add('highlight'); if (kind === 'fire') els.fireZone.classList.add('highlight'); if (kind === 'cup') els.cupZone.classList.add('highlight'); }

function onPointerMove(ev) {
  if (!state.drag) return;
  if (state.drag.type === 'leaf') {
    positionLeaf(state.drag.el, ev.clientX, ev.clientY);
    toggleZone(els.potZone, insideRect(ev.clientX, ev.clientY, state.zones.pot));
    return;
  }

  const el = state.drag.el;
  el.style.left = `${ev.clientX - state.drag.dx}px`;
  el.style.top = `${ev.clientY - state.drag.dy}px`;

  if (state.drag.type === 'kettle') {
    toggleZone(els.potZone, nearRect(ev.clientX, ev.clientY, state.zones.pot, 48));
  } else if (state.drag.type === 'fan') {
    toggleZone(els.fireZone, nearRect(ev.clientX, ev.clientY, state.zones.fire, 68));
  } else if (state.drag.type === 'pot') {
    toggleZone(els.cupZone, nearRect(ev.clientX, ev.clientY, state.zones.cup, 64));
  }
}

function onPointerUp(ev) {
  window.removeEventListener('pointermove', onPointerMove);
  if (!state.drag) return;
  const drag = state.drag;
  clearHighlights();
  if (drag.type === 'leaf') {
    const hit = insideRect(ev.clientX, ev.clientY, state.zones.pot);
    drag.el.remove();
    if (hit) addLeaves();
  } else if (drag.type === 'kettle') {
    const near = nearRect(ev.clientX, ev.clientY, state.zones.pot, 48);
    if (near) pourWater();
    restoreHome(drag.el, 'kettleWrap');
  } else if (drag.type === 'fan') {
    const near = nearRect(ev.clientX, ev.clientY, state.zones.fire, 68);
    if (near) boostFire();
    restoreHome(drag.el, 'fanWrap');
  } else if (drag.type === 'pot') {
    const near = nearRect(ev.clientX, ev.clientY, state.zones.cup, 64);
    if (near) pourTeaByPot();
    restoreHome(drag.el, 'potWrap');
  }
  state.drag = null;
}

function addLeaves() {
  if (!state.tea) return showToast('先选茶，再投茶。');
  if (state.leavesAdded) return;
  state.leavesAdded = true;
  state.calm = Math.min(99, state.calm + 6);
  renderPot();
  updateProgress();
  updateStats();
  updateGuide();
  burst('leaf');
  showToast('茶叶已入壶。');
}

function showPourStream(fromRect, toRect) {
  const x = fromRect.left + fromRect.width * .78;
  const y = fromRect.top + fromRect.height * .56;
  const h = Math.max(84, toRect.top - y + 46);
  els.pourStream.style.left = `${x}px`;
  els.pourStream.style.top = `${y}px`;
  els.pourStream.style.height = `${h}px`;
  els.pourStream.style.opacity = '1';
  setTimeout(() => els.pourStream.style.opacity = '0', 900);
}

function pourWater() {
  if (!state.leavesAdded) return showToast('先投茶，再注水。');
  if (state.waterAdded) return showToast('这一泡已经注过水。');
  state.waterAdded = true;
  state.brewed = false;
  state.temperature = Math.max(state.temperature, 58);
  state.strength = Math.max(state.strength, 10 + (state.infusion - 1) * 4);
  state.calm = Math.min(99, state.calm + 8);
  showPourStream(els.kettleWrap.getBoundingClientRect(), state.zones.pot);
  renderPot();
  updateProgress();
  updateStats();
  updateGuide();
  burst('water');
  showToast(`第 ${state.infusion} 泡已注水。`);
}

function boostFire() {
  state.fanBoostUntil = Date.now() + 3500;
  state.calm = Math.min(99, state.calm + 2);
  renderEmbers();
  burst('spark');
  showToast('风至火起，温度短暂提升。');
}

function startBrewing() {
  if (!state.waterAdded) return showToast('先完成注水。');
  if (state.brewing) return;
  if (state.brewed) return showToast('这一泡已经到位，可以直接分茶。');

  const profile = currentProfile();
  state.brewing = true;
  updateGuide();
  showToast(`开始候汤：第 ${state.infusion} 泡 · ${profile.note}`);

  brewTimer = setInterval(() => {
    const heat = effectiveHeat();
    const tempGain = 0.7 + heat / 42;
    const strengthGain = 0.8 + Math.max(0, (state.temperature - 45) / 22);
    state.temperature = Math.min(100, state.temperature + tempGain * .32);
    state.strength = Math.min(100, state.strength + strengthGain * (.36 + state.infusion * .03));
    state.calm = Math.min(99, state.calm + .35);

    renderEmbers();
    spawnSteam();
    updateStats();
    updateGuide();

    const brewedEnough = state.temperature >= profile.target && state.strength >= 48 + state.infusion * 5;
    const longEnough = (state.brewSeconds = (state.brewSeconds || 0) + 1) >= profile.brewSec;
    if (brewedEnough && longEnough) completeBrewing();
  }, 1000);
}

function completeBrewing() {
  clearInterval(brewTimer);
  brewTimer = null;
  state.brewSeconds = 0;
  state.brewing = false;
  state.brewed = true;
  state.calm = Math.min(99, state.calm + (currentTea()?.calmGain || 12));
  renderPot();
  updateProgress();
  updateStats();
  updateGuide();
  burst('steam');
  showToast('茶已到位，拎起茶壶倒向茶杯。');
}

function pourTeaByPot() {
  if (!state.brewed) return showToast('还没到分茶的时候。');
  const profile = currentProfile();
  const entry = {
    infusion: state.infusion,
    note: profile.note,
    strength: Math.round(state.strength),
    temperature: Math.round(state.temperature),
  };
  state.infusionHistory.push(entry);
  state.calm = Math.min(99, state.calm + 10);
  showPourStream(els.potWrap.getBoundingClientRect(), state.zones.cup);
  renderCup();
  renderInfusionHistory();
  burst('final');
  showToast(`第 ${state.infusion} 泡已分茶。`);

  if (state.infusion >= state.maxInfusions) {
    state.waterAdded = false;
    state.brewed = false;
    updateProgress();
    updateStats();
    updateGuide();
    return;
  }

  updateProgress();
  updateStats();
  updateGuide();
}

function prepareNextInfusion() {
  if (!state.tea || !state.leavesAdded) return showToast('先开始一轮煮茶。');
  if (state.infusionHistory.length < state.infusion) return showToast('先完成当前这泡分茶。');
  if (state.infusion >= state.maxInfusions) return showToast('已经到最后一泡。');
  state.infusion += 1;
  state.waterAdded = false;
  state.brewed = false;
  state.brewing = false;
  state.temperature = Math.max(38, state.temperature * 0.52);
  state.strength = Math.max(10, state.strength * 0.32);
  renderPot();
  updateProgress();
  updateStats();
  updateGuide();
  showToast(`已切换到第 ${state.infusion} 泡，请重新注水。`);
}

function resetInfusionProgress(clearTea = true) {
  clearInterval(brewTimer);
  brewTimer = null;
  state.infusion = 1;
  state.leavesAdded = false;
  state.waterAdded = false;
  state.brewing = false;
  state.brewed = false;
  state.temperature = 22;
  state.strength = 0;
  state.infusionHistory = [];
  state.brewSeconds = 0;
  if (clearTea) state.tea = null;
  renderInfusionHistory();
}

function renderInfusionHistory() {
  if (!state.infusionHistory.length) {
    els.infusionHistory.innerHTML = `<div class="guide">还没有完成任何一泡。多泡模式下，每一泡都会留下风味记录。</div>`;
    return;
  }
  els.infusionHistory.innerHTML = state.infusionHistory.map(item => `
    <div class="infusion-card">
      <div class="infusion-card-head">
        <strong>第 ${item.infusion} 泡</strong>
        <span class="tiny muted">${item.temperature}°C · ${item.strength}%</span>
      </div>
      <div class="tiny muted">${item.note}</div>
    </div>
  `).join('');
}

function currentStep() {
  if (!state.tea) return 'tea';
  if (!state.leavesAdded) return 'leaves';
  if (!state.waterAdded) return 'water';
  if (!state.brewed) return 'brew';
  return 'pour';
}
function isDone(key) {
  return {
    tea: !!state.tea,
    leaves: state.leavesAdded,
    water: state.waterAdded,
    brew: state.brewed,
    pour: state.infusionHistory.length >= state.infusion,
  }[key];
}
function renderSteps() {
  const current = currentStep();
  els.steps.innerHTML = stepDefs.map(step => {
    const done = isDone(step.key);
    const cls = `${done ? 'done' : ''} ${current === step.key && !done ? 'current' : ''}`;
    return `
      <div class="step ${cls}">
        <div class="step-head">
          <div style="display:flex;align-items:center;gap:10px;"><span class="dot"></span><strong>${step.title}</strong></div>
          <span class="tiny muted">${done ? '已完成' : current === step.key ? '当前' : '待进行'}</span>
        </div>
        <div class="tiny muted">${step.text}</div>
      </div>
    `;
  }).join('');
}

function updateProgress() {
  let p = 0;
  if (state.tea) p++;
  if (state.leavesAdded) p++;
  if (state.waterAdded) p++;
  if (state.brewed) p++;
  if (state.infusionHistory.length >= state.infusion) p++;
  state.progress = p;
  const pct = Math.round(p / 5 * 100);
  els.progressFill.style.width = `${pct}%`;
  els.progressLabel.textContent = `${pct}%`;
  renderSteps();
}

function updateStats() {
  els.tempStat.textContent = `${Math.round(state.temperature)}°C`;
  els.strengthStat.textContent = `${Math.round(state.strength)}%`;
  els.calmStat.textContent = `${Math.round(state.calm)}`;
  els.infusionStat.textContent = `${state.infusion} / ${state.maxInfusions}`;
  els.heatVal.textContent = `${state.heat}%`;
  els.volumeVal.textContent = `${state.volume}%`;
  const tea = currentTea();
  const profile = currentProfile();
  if (!tea) {
    els.teaSummary.textContent = '未开始';
  } else if (state.infusionHistory.length >= state.maxInfusions) {
    els.teaSummary.textContent = `${tea.name} · 三泡已毕`;
  } else if (state.infusionHistory.length >= state.infusion) {
    els.teaSummary.textContent = `${tea.name} · ${profile.note} · 可进下一泡`;
  } else {
    els.teaSummary.textContent = `${tea.name} · 第 ${state.infusion} 泡`;
  }
}

function updateGuide() {
  const tea = currentTea();
  const profile = currentProfile();
  if (!tea) {
    els.ritualTitle.textContent = '先选一款茶';
    els.ritualHint.textContent = '左侧先决定今天这盏茶的性格，然后把茶叶亲手送进壶里。';
    els.feedbackBox.textContent = '先选环境，再选茶。让这间小茶室先有自己的气质。';
    return;
  }
  if (!state.leavesAdded) {
    els.ritualTitle.textContent = '投茶入壶';
    els.ritualHint.textContent = `把茶盘中的 ${tea.name} 拖入壶里，茶叶颜色和形态已经按茶种区分。`;
    els.feedbackBox.textContent = `${tea.name} 已选定。现在把茶叶送进壶中，进入第 ${state.infusion} 泡。`;
    return;
  }
  if (!state.waterAdded) {
    els.ritualTitle.textContent = `第 ${state.infusion} 泡 · 注水`;
    els.ritualHint.textContent = '拖热水壶靠近壶口，激活区域已和壶口位置动态对齐。';
    els.feedbackBox.textContent = `目标风味：${profile.note}。这一步先让水和茶叶真正碰面。`;
    return;
  }
  if (state.brewing) {
    els.ritualTitle.textContent = `第 ${state.infusion} 泡 · 候汤`;
    els.ritualHint.textContent = `火候目标 ${profile.target}°C，建议焖煮 ${profile.brewSec} 秒左右。`;
    els.feedbackBox.textContent = `候汤中：${Math.round(state.temperature)}°C / ${Math.round(state.strength)}%。可以拖风扇靠近风炉短暂助燃。`;
    return;
  }
  if (!state.brewed) {
    els.ritualTitle.textContent = `第 ${state.infusion} 泡 · 待起香`;
    els.ritualHint.textContent = `这一泡的风味是“${profile.note}”，点击“开始候汤”即可。`;
    els.feedbackBox.textContent = '现在不是着急结束，而是把这一泡慢慢煮到位。';
    return;
  }
  if (state.infusionHistory.length < state.infusion) {
    els.ritualTitle.textContent = '拎壶分茶';
    els.ritualHint.textContent = '焖煮完成后，直接提起茶壶，拖向右侧杯口完成分茶。';
    els.feedbackBox.textContent = '这一步已经改为真正的拖拽分茶，不再依赖右侧按钮。';
    return;
  }
  if (state.infusion < state.maxInfusions) {
    els.ritualTitle.textContent = '准备下一泡';
    els.ritualHint.textContent = '点击“准备下一泡”，然后重新注水，继续观察香气变化。';
    els.feedbackBox.textContent = `第 ${state.infusion} 泡已记录：${profile.note}。可以继续进入下一泡。`;
    return;
  }
  els.ritualTitle.textContent = '三泡已毕';
  els.ritualHint.textContent = '这一轮多泡茶道完成了。你可以收藏这间茶室，或者换环境与茶重新开始。';
  els.feedbackBox.textContent = '这一轮已完整结束。收藏一下当前茶室布局和音乐设置，会很适合作为你的常用静心空间。';
}

function spawnSteam() {
  const count = 2 + Math.round(effectiveHeat() / 36);
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'steam';
    s.style.left = `${46 + Math.random() * 12}%`;
    s.style.bottom = `${31 + Math.random() * 4}%`;
    s.style.animationDuration = `${3.8 + Math.random() * 1.6}s`;
    s.style.animationDelay = `${Math.random() * .8}s`;
    els.steamLayer.appendChild(s);
    requestAnimationFrame(() => s.style.opacity = '1');
    setTimeout(() => s.remove(), 4600);
  }
}

function burst(type) {
  const total = type === 'final' ? 18 : 10;
  for (let i = 0; i < total; i++) {
    const p = document.createElement('div');
    p.style.position = 'absolute';
    p.style.left = `${46 + Math.random() * 18}%`;
    p.style.top = `${50 + Math.random() * 14}%`;
    p.style.width = `${type === 'spark' ? 5 : 8}px`;
    p.style.height = p.style.width;
    p.style.borderRadius = '50%';
    p.style.pointerEvents = 'none';
    p.style.opacity = '.9';
    p.style.background =
      type === 'leaf' ? 'rgba(100,190,110,.85)' :
      type === 'water' ? 'rgba(159,231,255,.9)' :
      type === 'spark' ? 'rgba(255,180,90,.95)' :
      type === 'steam' ? 'rgba(255,255,255,.65)' :
      'rgba(154,124,255,.9)';
    p.style.boxShadow = '0 0 16px rgba(255,255,255,.18)';
    els.particleLayer.appendChild(p);
    const dx = -50 + Math.random() * 100;
    const dy = -60 + Math.random() * 40;
    p.animate([{ transform: 'translate(0,0) scale(1)', opacity: .95 }, { transform: `translate(${dx}px, ${dy}px) scale(.2)`, opacity: 0 }], { duration: 900 + Math.random() * 600, easing: 'cubic-bezier(.2,.8,.2,1)' });
    setTimeout(() => p.remove(), 1600);
  }
}

function showToast(text) {
  els.toast.textContent = text;
  els.toast.classList.add('show');
  clearTimeout(showToast.tid);
  showToast.tid = setTimeout(() => els.toast.classList.remove('show'), 2200);
}

function setupControls() {
  els.audioToggle.onclick = () => {
    state.audioOn = !state.audioOn;
    els.audioToggle.classList.toggle('active', state.audioOn);
    els.audioToggle.textContent = `环境音：${state.audioOn ? '开' : '关'}`;
    ensureAudio();
    updateAudioState();
  };
  els.musicToggle.onclick = () => {
    state.musicOn = !state.musicOn;
    els.musicToggle.classList.toggle('active', state.musicOn);
    els.musicToggle.textContent = `冥想脉冲：${state.musicOn ? '开' : '关'}`;
    ensureAudio();
    updateAudioState();
  };
  els.volumeRange.oninput = (e) => {
    state.volume = +e.target.value;
    updateStats();
    updateAudioState();
  };
  els.heatRange.oninput = (e) => {
    state.heat = +e.target.value;
    renderEmbers();
    updateStats();
  };
  els.brewBtn.onclick = startBrewing;
  els.nextInfusionBtn.onclick = prepareNextInfusion;
  els.resetBtn.onclick = () => {
    clearInterval(brewTimer);
    resetInfusionProgress(true);
    state.temperature = 22;
    state.strength = 0;
    state.calm = 18;
    renderTeaCards();
    refreshTray();
    renderPot();
    renderCup();
    updateProgress();
    updateStats();
    updateGuide();
    showToast('已重新开始。');
  };
  els.saveRoomBtn.onclick = saveCurrentRoom;
  els.roomNameInput.oninput = (e) => { state.roomDraftName = e.target.value.trim(); };

  els.loadEmbedBtn.onclick = loadEmbed;
  els.clearEmbedBtn.onclick = clearEmbed;
  els.togglePlayerBtn.onclick = () => {
    state.playerVisible = !state.playerVisible;
    els.externalFrameWrap.style.display = state.playerVisible ? 'block' : 'none';
    els.togglePlayerBtn.textContent = state.playerVisible ? '隐藏' : '显示';
  };

  document.querySelectorAll('[data-minutes]').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('[data-minutes]').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      state.meditationMinutes = +btn.dataset.minutes;
      state.meditationRemaining = state.meditationMinutes * 60;
      updateMeditationUI();
    };
  });
  els.startMeditationBtn.onclick = startMeditation;
  els.pauseMeditationBtn.onclick = pauseMeditation;
  els.resetMeditationBtn.onclick = resetMeditation;
}

function ensureAudio() {
  if (audioCtx) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return;
  }
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    ambientGain = audioCtx.createGain();
    musicGain = audioCtx.createGain();
    masterGain.gain.value = 0.18;
    ambientGain.gain.value = 0.12;
    musicGain.gain.value = 0;
    ambientGain.connect(masterGain);
    musicGain.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

    noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 900;
    noiseFilter.Q.value = 0.8;
    noiseGain = audioCtx.createGain();
    noiseGain.gain.value = .03;
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ambientGain);
    noiseSource.start();

    [196, 294, 392].forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      osc.type = idx === 1 ? 'triangle' : 'sine';
      osc.frequency.value = freq;
      const g = audioCtx.createGain();
      g.gain.value = idx === 1 ? .012 : .008;
      osc.connect(g);
      g.connect(ambientGain);
      osc.start();
      drones.push({ osc, g });
    });

    pulseOsc = audioCtx.createOscillator();
    pulseOsc.type = 'sine';
    pulseOsc.frequency.value = 220;
    pulseGain = audioCtx.createGain();
    pulseGain.gain.value = 0;
    pulseLfo = audioCtx.createOscillator();
    const pulseDepth = audioCtx.createGain();
    pulseLfo.frequency.value = .18;
    pulseDepth.gain.value = 0.03;
    pulseLfo.connect(pulseDepth);
    pulseDepth.connect(pulseGain.gain);
    pulseOsc.connect(pulseGain);
    pulseGain.connect(musicGain);
    pulseOsc.start();
    pulseLfo.start();

    updateAudioState();
  } catch (e) {
    console.warn(e);
  }
}

function updateAudioState() {
  if (!audioCtx || !masterGain) return;
  const vol = state.volume / 100;
  masterGain.gain.setTargetAtTime(vol * .28, audioCtx.currentTime, .2);
  const theme = state.theme;
  const ambientTarget = state.audioOn ? .11 + (theme === 'neon' ? .03 : 0) : 0;
  const musicTarget = state.musicOn ? .08 : 0;
  ambientGain.gain.setTargetAtTime(ambientTarget, audioCtx.currentTime, .35);
  musicGain.gain.setTargetAtTime(musicTarget, audioCtx.currentTime, .35);
  noiseFilter.frequency.setTargetAtTime(theme === 'bamboo' ? 700 : theme === 'neon' ? 1400 : 500, audioCtx.currentTime, .4);
  noiseGain.gain.setTargetAtTime(theme === 'bamboo' ? .02 : theme === 'neon' ? .035 : .018, audioCtx.currentTime, .4);
  drones.forEach((item, idx) => {
    const base = theme === 'bamboo' ? [196, 294, 392] : theme === 'neon' ? [174, 261, 348] : [165, 247, 330];
    item.osc.frequency.setTargetAtTime(base[idx], audioCtx.currentTime, .4);
    item.g.gain.setTargetAtTime(state.audioOn ? (theme === 'ink' ? .006 : idx === 1 ? .012 : .008) : 0, audioCtx.currentTime, .4);
  });
  pulseOsc.frequency.setTargetAtTime(theme === 'neon' ? 180 : theme === 'ink' ? 200 : 220, audioCtx.currentTime, .4);
}

function setupBreath() {
  const seq = [
    { text: '吸气 · 4 秒', scale: 1.18, dur: 4000 },
    { text: '停驻 · 2 秒', scale: 1.18, dur: 2000 },
    { text: '呼气 · 6 秒', scale: .84, dur: 6000 },
    { text: '留白 · 2 秒', scale: .84, dur: 2000 },
  ];
  (function loop() {
    const step = seq[state.breathIndex % seq.length];
    els.breathText.textContent = step.text;
    els.breathCore.style.transform = `scale(${step.scale})`;
    state.breathIndex++;
    setTimeout(loop, step.dur);
  })();
}

function startMeditation() {
  if (state.meditationRunning) return;
  if (!state.meditationRemaining) state.meditationRemaining = state.meditationMinutes * 60;
  state.meditationRunning = true;
  state.musicOn = true;
  els.musicToggle.classList.add('active');
  els.musicToggle.textContent = '冥想脉冲：开';
  ensureAudio();
  updateAudioState();

  state.meditationTimer = setInterval(() => {
    state.meditationRemaining = Math.max(0, state.meditationRemaining - 1);
    updateMeditationUI();
    if (state.meditationRemaining <= 0) {
      pauseMeditation();
      showToast('冥想计时已完成。');
    }
  }, 1000);
  updateMeditationUI();
}

function pauseMeditation() {
  state.meditationRunning = false;
  clearInterval(state.meditationTimer);
  state.meditationTimer = null;
  updateMeditationUI();
}

function resetMeditation() {
  pauseMeditation();
  state.meditationRemaining = state.meditationMinutes * 60;
  updateMeditationUI();
}

function updateMeditationUI() {
  els.meditationTime.textContent = state.meditationRemaining ? formatTime(state.meditationRemaining) : '00:00';
  els.meditationState.textContent = state.meditationRunning ? '正在呼吸与停留' : '选择时长后开始';
}

function loadEmbed() {
  const url = els.embedInput.value.trim();
  if (!/^https?:\/\//i.test(url)) return showToast('请输入合法的 http(s) 链接。');
  state.embedUrl = url;
  els.externalFrame.src = url;
  els.externalPlayerCard.classList.add('show');
  showToast('已尝试加载外部播放器。');
}
function clearEmbed() {
  state.embedUrl = '';
  els.externalFrame.src = 'about:blank';
  els.externalPlayerCard.classList.remove('show');
  els.embedInput.value = '';
  showToast('外部播放器已清空。');
}

function getSavedRooms() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function setSavedRooms(rooms) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms.slice(0, 8)));
}
function saveCurrentRoom() {
  const name = state.roomDraftName || `${themes.find(t => t.id === state.theme).name} · ${currentTea()?.name || '未选茶'}`;
  const rooms = getSavedRooms();
  rooms.unshift({
    id: Date.now(),
    name,
    theme: state.theme,
    tea: state.tea,
    heat: state.heat,
    embedUrl: state.embedUrl,
    audioOn: state.audioOn,
    musicOn: state.musicOn,
    meditationMinutes: state.meditationMinutes,
  });
  setSavedRooms(rooms);
  renderSavedRooms();
  showToast('当前茶室已收藏。');
}
function applyRoom(room) {
  state.theme = room.theme || 'bamboo';
  state.tea = room.tea || null;
  state.heat = room.heat || 48;
  state.embedUrl = room.embedUrl || '';
  state.audioOn = room.audioOn !== false;
  state.musicOn = !!room.musicOn;
  state.meditationMinutes = room.meditationMinutes || 3;
  state.meditationRemaining = state.meditationMinutes * 60;
  pauseMeditation();

  els.embedInput.value = state.embedUrl;
  if (state.embedUrl) {
    els.externalFrame.src = state.embedUrl;
    els.externalPlayerCard.classList.add('show');
  } else {
    els.externalPlayerCard.classList.remove('show');
    els.externalFrame.src = 'about:blank';
  }

  els.audioToggle.classList.toggle('active', state.audioOn);
  els.audioToggle.textContent = `环境音：${state.audioOn ? '开' : '关'}`;
  els.musicToggle.classList.toggle('active', state.musicOn);
  els.musicToggle.textContent = `冥想脉冲：${state.musicOn ? '开' : '关'}`;
  els.heatRange.value = state.heat;
  resetInfusionProgress(false);
  renderThemePills();
  renderTeaCards();
  applyTheme();
  refreshTray();
  renderPot();
  renderCup();
  renderEmbers();
  updateProgress();
  updateStats();
  updateGuide();
  updateMeditationUI();
  ensureAudio();
  updateAudioState();
  showToast(`已载入茶室：${room.name}`);
}
function removeRoom(id) {
  const rooms = getSavedRooms().filter(r => r.id !== id);
  setSavedRooms(rooms);
  renderSavedRooms();
}
function renderSavedRooms() {
  const rooms = getSavedRooms();
  if (!rooms.length) {
    els.savedRooms.innerHTML = `<div class="guide">还没有收藏茶室。你可以把常用环境、茶和音乐组合存下来。</div>`;
    return;
  }
  els.savedRooms.innerHTML = rooms.map(room => `
    <div class="room-card">
      <div class="room-card-head">
        <strong>${room.name}</strong>
        <div class="room-actions">
          <button class="toggle small" data-apply="${room.id}">载入</button>
          <button class="toggle small" data-delete="${room.id}">删除</button>
        </div>
      </div>
      <div class="tag-line">
        <span class="tag">${themes.find(t => t.id === room.theme)?.name || '环境'}</span>
        <span class="tag">${teas.find(t => t.id === room.tea)?.name || '未选茶'}</span>
        <span class="tag">火力 ${room.heat}%</span>
        <span class="tag">${room.embedUrl ? '含外部音乐' : '内置音效'}</span>
      </div>
    </div>
  `).join('');
  els.savedRooms.querySelectorAll('[data-apply]').forEach(btn => btn.onclick = () => applyRoom(getSavedRooms().find(r => r.id === +btn.dataset.apply)));
  els.savedRooms.querySelectorAll('[data-delete]').forEach(btn => btn.onclick = () => removeRoom(+btn.dataset.delete));
}

function passiveCooling() {
  setInterval(() => {
    if (!state.brewing) {
      const target = state.waterAdded ? 56 : 22;
      if (state.temperature > target) state.temperature -= .22;
      if (Date.now() >= state.fanBoostUntil) renderEmbers();
      updateStats();
    }
  }, 1000);
}

function init() {
  renderThemePills();
  renderTeaCards();
  applyTheme();
  refreshTray();
  renderPot();
  renderCup();
  renderKettle();
  renderFan();
  renderEmbers();
  renderInfusionHistory();
  renderSavedRooms();
  updateProgress();
  updateStats();
  updateGuide();
  updateMeditationUI();
  setupControls();
  setupBreath();
  bindDraggables();
  requestAnimationFrame(() => {
    saveHomes();
    layoutZones();
  });
  window.addEventListener('resize', layoutZones);
  passiveCooling();
  document.body.addEventListener('pointerdown', ensureAudio, { once: true });
}

init();
