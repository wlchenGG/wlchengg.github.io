const room = document.getElementById('room');
const toyLayer = document.getElementById('toyLayer');
const catLayer = document.getElementById('catLayer');
const effectLayer = document.getElementById('effectLayer');
const facilityLayer = document.getElementById('facilityLayer');
const messLayer = document.getElementById('messLayer');
const catsList = document.getElementById('catsList');
const petCountEl = document.getElementById('petCount');
const comfortValueEl = document.getElementById('comfortValue');
const statusText = document.getElementById('statusText');
const themeHint = document.getElementById('themeHint');
const roomTitle = document.getElementById('roomTitle');
const roomSubtitle = document.getElementById('roomSubtitle');
const soundBtn = document.getElementById('soundBtn');
const themeRow = document.getElementById('themeRow');
const feederAutoBtn = document.getElementById('feederAutoBtn');
const feedBtn = document.getElementById('feedBtn');
const scoopBtn = document.getElementById('scoopBtn');
const cleanFloorBtn = document.getElementById('cleanFloorBtn');
const careStatus = document.getElementById('careStatus');
const hand = document.getElementById('hand');

const THEMES = {
  sunny: { name: '午后奶油房', subtitle: '更适合慢慢揉揉猫咪的午后主题', restBoost: 1, curiosityBoost: 1 },
  sage: { name: '森系茶香房', subtitle: '更安静、更克制，适合观察它们自己玩', restBoost: 1.12, curiosityBoost: 0.96 },
  moonlight: { name: '月光夜谈房', subtitle: '更暗、更安静，猫咪会更常进入休息和打盹', restBoost: 1.58, curiosityBoost: 0.82 }
};

const SUPPORTS = [
  { id: 'floor', label: '地面', kind: 'floor', capacity: 99, x1: 11, x2: 92, y1: 64, y2: 85, catY: 74, toyY: 79, waitX: 50, waitY: 74 },
  { id: 'shelf', label: '书架', kind: 'platform', capacity: 1, x1: 10, x2: 30, catY: 20.8, toyY: 16.8, waitX: 20, waitY: 73 },
  { id: 'window', label: '窗台', kind: 'platform', capacity: 1, x1: 71, x2: 88, catY: 41.8, toyY: 37.8, waitX: 79, waitY: 73 },
  { id: 'treeTop', label: '猫树上层', kind: 'platform', capacity: 1, x1: 8, x2: 18, catY: 51.8, toyY: 47.8, waitX: 17, waitY: 73 },
  { id: 'treeMid', label: '猫树中层', kind: 'platform', capacity: 1, x1: 9, x2: 18, catY: 67.2, toyY: 63.8, waitX: 22, waitY: 73 }
];

const NAP_SPOTS = [
  { x: 46, y: 78, supportId: 'floor' },
  { x: 54, y: 80, supportId: 'floor' },
  { x: 17, y: 67.2, supportId: 'treeMid' },
  { x: 78, y: 41.8, supportId: 'window' }
];

const SOCIAL_TEXT = {
  sniffing: '嗅嗅',
  greeting: '蹭蹭',
  watching: '盯——'
};

const state = {
  roomRect: null,
  pointerDown: false,
  soundEnabled: false,
  audioCtx: null,
  draggingToy: null,
  activePetCat: null,
  heldCat: null,
  theme: 'sunny',
  petCount: 0,
  napGroupId: 0,
  lastPointer: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  cats: [
    {
      id: 'milo', name: 'Milo', breed: '布偶猫', profile: '慢热黏人',
      fur: 'linear-gradient(180deg, #f7f1e8, #d8cbc1)', phrase: '呼噜呼噜',
      x: 24, y: 73, tx: 24, ty: 73, facing: 1,
      surfaceId: 'floor', targetSupportId: 'floor', queuedSupportId: null, queuedAt: 0, queueTargetX: null, nextQueueTryAt: 0,
      mode: 'roam', nextDecisionAt: 0, actionUntil: 0, napUntil: 0, napGroup: null,
      jump: null, toyFocus: 0, toyTargetId: null, lastPetAt: 0, lastSocialAt: 0, socialPartnerId: null, holdStyle: 'calm',
      happiness: 79.2,
      traits: { affection: 0.95, toy: 0.34, social: 0.64, space: 0.54, rest: 0.78, curiosity: 0.48, energy: 0.38 }
    },
    {
      id: 'mochi', name: 'Mochi', breed: '英短银渐层', profile: '稳重观察派',
      fur: 'linear-gradient(180deg, #eef0f2, #b8c0cb)', phrase: '喵呜~',
      x: 50, y: 74, tx: 50, ty: 74, facing: 1,
      surfaceId: 'floor', targetSupportId: 'floor', queuedSupportId: null, queuedAt: 0, queueTargetX: null, nextQueueTryAt: 0,
      mode: 'roam', nextDecisionAt: 0, actionUntil: 0, napUntil: 0, napGroup: null,
      jump: null, toyFocus: 0, toyTargetId: null, lastPetAt: 0, lastSocialAt: 0, socialPartnerId: null, holdStyle: 'calm',
      happiness: 82.6,
      traits: { affection: 0.58, toy: 0.22, social: 0.46, space: 0.68, rest: 0.72, curiosity: 0.36, energy: 0.28 }
    },
    {
      id: 'yuzu', name: 'Yuzu', breed: '橘猫', profile: '活泼爱玩',
      fur: 'linear-gradient(180deg, #ffd39f, #de9552)', phrase: '咪呀！',
      x: 70, y: 74, tx: 70, ty: 74, facing: -1,
      surfaceId: 'floor', targetSupportId: 'floor', queuedSupportId: null, queuedAt: 0, queueTargetX: null, nextQueueTryAt: 0,
      mode: 'roam', nextDecisionAt: 0, actionUntil: 0, napUntil: 0, napGroup: null,
      jump: null, toyFocus: 0, toyTargetId: null, lastPetAt: 0, lastSocialAt: 0, socialPartnerId: null, holdStyle: 'squirmy',
      happiness: 76.4,
      traits: { affection: 0.72, toy: 0.92, social: 0.58, space: 0.44, rest: 0.42, curiosity: 0.88, energy: 0.86 }
    },
    {
      id: 'sumi', name: 'Sumi', breed: '孟买猫', profile: '高冷独处型',
      fur: 'linear-gradient(180deg, #5d5d67, #26262d)', phrase: '喵。',
      x: 42, y: 79, tx: 42, ty: 79, facing: 1,
      surfaceId: 'floor', targetSupportId: 'floor', queuedSupportId: null, queuedAt: 0, queueTargetX: null, nextQueueTryAt: 0,
      mode: 'roam', nextDecisionAt: 0, actionUntil: 0, napUntil: 0, napGroup: null,
      jump: null, toyFocus: 0, toyTargetId: null, lastPetAt: 0, lastSocialAt: 0, socialPartnerId: null, holdStyle: 'squirmy',
      happiness: 74.8,
      traits: { affection: 0.34, toy: 0.16, social: 0.22, space: 0.82, rest: 0.66, curiosity: 0.30, energy: 0.36 }
    }
  ],
  toys: [
    { id: 'ball', name: '绒球', type: 'ball', x: 60, y: 79, supportId: 'floor' },
    { id: 'feather', name: '羽毛棒', type: 'feather', x: 72, y: 79, supportId: 'floor' },
    { id: 'cushion', name: '抱枕', type: 'cushion', x: 36, y: 79, supportId: 'floor' },
    { id: 'fish', name: '小鱼玩具', type: 'fish', x: 83, y: 79, supportId: 'floor' }
  ]
};

state.lastFrameAt = performance.now();
state.facilities = {
  feeder: { auto: true, bowl: 2.4, maxBowl: 4, lastDispenseAt: 0, cooldown: 12000, x: 84, y: 78.5, supportId: 'floor' },
  litter: { waste: 0, capacity: 5, occupiedBy: null, x: 23, y: 79, supportId: 'floor' },
  floorMesses: []
};

state.cats.forEach((cat, index) => {
  cat.hunger = clamp(78 + (index - 1.5) * 5 + Math.random() * 8, 55, 92);
  cat.bladder = clamp(22 + index * 6 + Math.random() * 8, 10, 46);
  cat.blockedSince = 0;
  cat.lastAteAt = 0;
  cat.lastUsedLitterAt = 0;
  cat.prevX = cat.x;
  cat.prevY = cat.y;
  cat.renderDX = 0;
  cat.renderDY = 0;
  cat.queueKind = null;
  cat.activityText = '闲逛中';
});

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function getSupport(id) {
  return SUPPORTS.find(support => support.id === id) || SUPPORTS[0];
}

function getCatById(id) {
  return state.cats.find(cat => cat.id === id) || null;
}

function setEntityPosition(el, x, y) {
  el.style.left = `${x}%`;
  el.style.top = `${y}%`;
}

function updateRoomRect() {
  state.roomRect = room.getBoundingClientRect();
  const scale = clamp(state.roomRect.width / 1200, 0.56, 1);
  room.style.setProperty('--entity-scale', scale.toFixed(3));
}

function pxToPctX(px) {
  return px / state.roomRect.width * 100;
}

function pxToPctY(py) {
  return py / state.roomRect.height * 100;
}

function pctToPxX(pct) {
  return state.roomRect.width * pct / 100;
}

function pctToPxY(pct) {
  return state.roomRect.height * pct / 100;
}

function pointerToRoomPercent(clientX, clientY) {
  const localX = clamp(clientX - state.roomRect.left, 0, state.roomRect.width);
  const localY = clamp(clientY - state.roomRect.top, 0, state.roomRect.height);
  return { x: pxToPctX(localX), y: pxToPctY(localY) };
}

function updatePointer(clientX, clientY) {
  state.lastPointer.x = clientX;
  state.lastPointer.y = clientY;
  hand.style.left = `${clientX}px`;
  hand.style.top = `${clientY}px`;
}

function createThemeButtons() {
  themeRow.innerHTML = '';
  Object.entries(THEMES).forEach(([key, meta]) => {
    const button = document.createElement('button');
    button.className = `theme-btn${state.theme === key ? ' active' : ''}`;
    button.textContent = meta.name;
    button.addEventListener('click', () => applyTheme(key));
    themeRow.appendChild(button);
  });
}

function applyTheme(themeKey) {
  state.theme = themeKey;
  document.body.dataset.theme = themeKey;
  roomTitle.textContent = THEMES[themeKey].name;
  roomSubtitle.textContent = THEMES[themeKey].subtitle;
  themeHint.textContent = `当前主题：${THEMES[themeKey].name}。`;
  createThemeButtons();
}

function updateStats() {
  petCountEl.textContent = state.petCount;
  const avgHappiness = state.cats.reduce((sum, cat) => sum + cat.happiness, 0) / state.cats.length;
  const comfortPenalty = state.facilities.floorMesses.length * 6 + Math.max(0, state.facilities.litter.waste - 2) * 1.8 + (state.facilities.feeder.bowl < 1 ? 1.2 : 0);
  const comfort = clamp(avgHappiness - comfortPenalty, 0, 100);
  comfortValueEl.textContent = `${comfort.toFixed(2)}%`;

  const sleeping = state.cats.filter(cat => cat.mode === 'napping').length;
  const queueing = state.cats.filter(cat => cat.mode === 'queue').length;
  const pottyQueue = state.cats.filter(cat => cat.mode === 'pottyQueue').length;
  const social = state.cats.filter(cat => ['sniffing', 'greeting', 'watching'].includes(cat.mode)).length;
  const hungryCats = state.cats.filter(cat => cat.hunger < 35).length;

  let text = '猫咪们正在慢慢散步，整个空间松弛而安静。';
  if (state.heldCat) {
    text = `${state.heldCat.name} 正被你抱在怀里。点击房间任意位置可以放下它。`;
  } else if (state.activePetCat) {
    text = `${state.activePetCat.name} 正在享受你的抚摸。`;
  } else if (state.facilities.floorMesses.length) {
    text = `屋里有 ${state.facilities.floorMesses.length} 处便便还没清理，这会拉低舒适度。`;
  } else if (state.facilities.litter.waste >= 4) {
    text = '猫砂盆已经很脏了，猫会开始排斥使用它。';
  } else if (pottyQueue > 0) {
    text = '有猫在猫砂盆外排队，轮到空位才会进去。';
  } else if (hungryCats > 0 && state.facilities.feeder.bowl < 1) {
    text = '有猫有点饿了，喂猫器的粮也快见底了。';
  } else if (social >= 2) {
    text = '有猫在互相闻闻和蹭蹭，社交氛围很自然。';
  } else if (queueing > 0) {
    text = '有猫在平台前观察空位，有的会等，有的会抢先跳上去。';
  } else if (sleeping >= 2) {
    text = '现在有猫在打盹，其他猫会自动保持舒服的距离。';
  } else if (state.theme === 'moonlight') {
    text = '夜间房比白天更安静，猫更容易在这里小睡。';
  }
  statusText.textContent = text;
  renderFacilities();
  updateCareButtons();
}

function renderCatsList() {
  catsList.innerHTML = '';
  state.cats.forEach(cat => {
    syncCatActivity(cat);
    const mood = getMoodSnapshot(cat);
    const item = document.createElement('div');
    item.className = `cat-chip${state.activePetCat?.id === cat.id || state.heldCat?.id === cat.id ? ' active' : ''}`;
    item.innerHTML = `
      <div class="cat-avatar">🐾</div>
      <div class="cat-meta">
        <div class="cat-topline">
          <strong>${cat.name}</strong>
          <span class="mood-tag">${mood.label}</span>
        </div>
        <span>${cat.breed} · ${cat.profile}</span>
        <div class="cat-detail">
          <div>状态：${cat.activityText}</div>
          <div>${cat.bladder > 84 ? '憋便中' : '排便正常'} · ${cat.hunger < 35 ? '有点饿了' : '饥饿正常'}</div>
        </div>
        <div class="mini-bars">
          <div class="mini-bar">
            <span>心情</span>
            <div class="mini-track"><div class="mini-fill mood" style="width:${mood.score.toFixed(1)}%"></div></div>
            <span>${mood.score.toFixed(0)}%</span>
          </div>
          <div class="mini-bar">
            <span>饥饿</span>
            <div class="mini-track"><div class="mini-fill" style="width:${cat.hunger.toFixed(1)}%"></div></div>
            <span>${cat.hunger.toFixed(0)}%</span>
          </div>
          <div class="mini-bar">
            <span>便意</span>
            <div class="mini-track"><div class="mini-fill urge" style="width:${cat.bladder.toFixed(1)}%"></div></div>
            <span>${cat.bladder.toFixed(0)}%</span>
          </div>
        </div>
      </div>
      <div class="mood">${cat.happiness.toFixed(2)}%</div>
    `;
    catsList.appendChild(item);
  });
}

function createBubble(text, x, y, emoji = '') {
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = emoji ? `${emoji} ${text}` : text;
  bubble.style.left = `${x}px`;
  bubble.style.top = `${y}px`;
  effectLayer.appendChild(bubble);
  setTimeout(() => bubble.remove(), 1200);
}

function createSpark(x, y, text = '✨') {
  const spark = document.createElement('div');
  spark.className = 'spark';
  spark.textContent = text;
  spark.style.left = `${x}px`;
  spark.style.top = `${y}px`;
  effectLayer.appendChild(spark);
  setTimeout(() => spark.remove(), 1100);
}

function initAudio() {
  if (!state.audioCtx) state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playTone(freq = 400, duration = 0.12, type = 'triangle', gainValue = 0.03, glide = null) {
  if (!state.soundEnabled) return;
  initAudio();
  const ctx = state.audioCtx;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  if (glide !== null) osc.frequency.linearRampToValueAtTime(glide, ctx.currentTime + duration);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(gainValue, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration + 0.03);
}

function playMeow() {
  playTone(620, 0.09, 'triangle', 0.05, 410);
  setTimeout(() => playTone(470, 0.12, 'triangle', 0.04, 300), 70);
}

function playPurr() {
  playTone(118, 0.08, 'sawtooth', 0.014, 102);
  setTimeout(() => playTone(136, 0.08, 'sawtooth', 0.011, 114), 60);
}

function getHoldStyle(cat) {
  const calmScore = cat.traits.affection + cat.traits.social + cat.traits.rest - cat.traits.energy;
  return calmScore > 0.85 ? 'calm' : 'squirmy';
}

function getBoldness(cat) {
  return clamp(0.18 + cat.traits.energy * 0.3 + cat.traits.curiosity * 0.24 + (1 - cat.traits.space) * 0.18 + cat.traits.social * 0.12, 0.18, 0.92);
}

function getMoodSnapshot(cat) {
  let score = cat.happiness;
  if (cat.hunger < 40) score -= (40 - cat.hunger) * 0.9;
  if (cat.bladder > 78) score -= (cat.bladder - 78) * 0.8;
  if (state.facilities.litter.waste >= 4) score -= 5;
  score -= Math.min(16, state.facilities.floorMesses.length * 5);
  score = clamp(score, 0, 100);
  let label = '放松';
  if (score >= 86) label = '很开心';
  else if (score >= 72) label = '满足';
  else if (score >= 58) label = '一般';
  else if (score >= 42) label = '烦躁';
  else label = '委屈';
  return { score, label };
}

function getActivityLabel(cat) {
  const activityMap = {
    roam: '闲逛中',
    playing: '追玩具',
    queue: '抢平台中',
    pottyQueue: '排队上厕所',
    jumping: '跳跃中',
    napping: '睡觉中',
    grooming: '舔毛中',
    stretching: '伸懒腰',
    sniffing: '闻闻互动',
    greeting: '贴贴互动',
    watching: '观察中',
    held: '被抱起',
    eating: '吃饭中',
    toileting: '上厕所中'
  };
  return activityMap[cat.mode] || '悠闲';
}

function syncCatActivity(cat) {
  cat.activityText = getActivityLabel(cat);
}

function updateCareButtons() {
  feederAutoBtn.textContent = `自动喂食：${state.facilities.feeder.auto ? '开' : '关'}`;
  cleanFloorBtn.textContent = state.facilities.floorMesses.length ? `清理屋内便便（${state.facilities.floorMesses.length}）` : '清理屋内便便';
}

function dispenseFood(amount = 1, source = 'manual') {
  const feeder = state.facilities.feeder;
  const before = feeder.bowl;
  feeder.bowl = clamp(feeder.bowl + amount, 0, feeder.maxBowl);
  feeder.lastDispenseAt = performance.now();
  renderFacilities();
  updateCareButtons();
  if (feeder.bowl <= before + 0.01) return;
  if (source !== 'silent') {
    createBubble(source === 'manual' ? '咔哒，放粮' : '自动补粮', pctToPxX(feeder.x) - 20, pctToPxY(feeder.y) - 46, '🍽️');
  }
}

function getLitterQueue() {
  return state.cats
    .filter(cat => cat.mode === 'pottyQueue' && !cat.jump && state.heldCat?.id !== cat.id)
    .sort((a, b) => a.queuedAt - b.queuedAt);
}

function getLitterQueuePosition(cat) {
  const queue = getLitterQueue();
  const index = Math.max(0, queue.findIndex(item => item.id === cat.id));
  const litter = state.facilities.litter;
  const offsets = [0, -6, 6, -11, 11];
  return {
    x: clamp(litter.x - 10 + (offsets[index] ?? (index - 2) * 4.5), getSupport('floor').x1 + 2, getSupport('floor').x2 - 2),
    y: clamp(litter.y + 2 + Math.min(index, 3) * 2.2, getSupport('floor').y1, getSupport('floor').y2)
  };
}

function litterUsable() {
  return state.facilities.litter.waste < 4;
}

function startPottyQueue(cat) {
  resetSocial(cat);
  clearQueue(cat);
  cat.mode = 'pottyQueue';
  cat.queueKind = 'litter';
  cat.queuedAt = performance.now();
  cat.nextQueueTryAt = cat.queuedAt + 300;
  if (!cat.blockedSince) cat.blockedSince = cat.queuedAt;
}

function createFloorMess(cat) {
  const id = `mess_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const mess = {
    id,
    x: clamp(cat.x + (Math.random() * 5 - 2.5), getSupport('floor').x1 + 1.5, getSupport('floor').x2 - 1.5),
    y: clamp(Math.max(cat.y, getSupport('floor').catY), getSupport('floor').y1, getSupport('floor').y2)
  };
  state.facilities.floorMesses.push(mess);
  cat.bladder = 12 + Math.random() * 8;
  cat.happiness = clamp(cat.happiness - 10, 0, 100);
  cat.blockedSince = 0;
  createBubble('憋不住了…', pctToPxX(mess.x) + 8, pctToPxY(mess.y) - 34, '💩');
  renderMesses();
  updateCareButtons();
}

function renderMesses() {
  messLayer.innerHTML = '';
  state.facilities.floorMesses.forEach(mess => {
    const el = document.createElement('div');
    el.className = 'floor-mess';
    el.innerHTML = '<div class="mess-label">点我清理</div>';
    setEntityPosition(el, mess.x, mess.y);
    el.addEventListener('click', event => {
      event.stopPropagation();
      cleanFloorMess(mess.id);
    });
    messLayer.appendChild(el);
    mess.el = el;
  });
}

function cleanFloorMess(id = null) {
  if (id) {
    state.facilities.floorMesses = state.facilities.floorMesses.filter(item => item.id !== id);
  } else {
    state.facilities.floorMesses = [];
  }
  renderMesses();
  updateCareButtons();
}

function renderFacilities() {
  facilityLayer.innerHTML = '';
  const feeder = state.facilities.feeder;
  const litter = state.facilities.litter;

  const feederEl = document.createElement('div');
  feederEl.className = 'facility feeder';
  feederEl.innerHTML = `
    <div class="facility-badge">喂猫器 ${feeder.auto ? '· 自动' : '· 手动'}</div>
    <div class="feeder-base"></div>
    <div class="feeder-bowl"></div>
    <div class="feeder-food" data-level="${Math.round(feeder.bowl)}"></div>
    <div class="feeder-tower"></div>
  `;
  setEntityPosition(feederEl, feeder.x, feeder.y);
  feederEl.addEventListener('click', event => {
    event.stopPropagation();
    dispenseFood(1, 'manual');
  });
  facilityLayer.appendChild(feederEl);

  const litterEl = document.createElement('div');
  litterEl.className = 'facility litterbox';
  litterEl.innerHTML = `
    <div class="facility-badge">猫砂盆 ${litter.occupiedBy ? '· 使用中' : ''}</div>
    <div class="litter-body"></div>
    <div class="litter-sand"></div>
    <div class="litter-waste" data-level="${Math.min(5, Math.round(litter.waste))}"></div>
  `;
  setEntityPosition(litterEl, litter.x, litter.y);
  litterEl.addEventListener('click', event => {
    event.stopPropagation();
    scoopLitter();
  });
  facilityLayer.appendChild(litterEl);

  const foodStatus = feeder.bowl >= 2 ? '<span class="ok">粮量充足</span>' : feeder.bowl >= 1 ? '<span class="warn">粮量偏少</span>' : '<span class="bad">空碗提醒</span>';
  const litterStatus = litter.waste <= 1 ? '<span class="ok">很干净</span>' : litter.waste <= 3 ? '<span class="warn">需要留意</span>' : '<span class="bad">该铲屎了</span>';
  const messStatus = state.facilities.floorMesses.length === 0 ? '<span class="ok">暂无屋内便便</span>' : `<span class="bad">地上有 ${state.facilities.floorMesses.length} 处便便</span>`;
  careStatus.innerHTML = `
    <div class="care-pill"><strong>喂猫器</strong>${foodStatus}</div>
    <div class="care-pill"><strong>猫砂盆</strong>${litterStatus}</div>
    <div class="care-pill"><strong>地面卫生</strong>${messStatus}</div>
  `;
}

function scoopLitter() {
  const litter = state.facilities.litter;
  litter.waste = Math.max(0, litter.waste - 2);
  renderFacilities();
}

function finishEating(cat) {
  const feeder = state.facilities.feeder;
  feeder.bowl = Math.max(0, feeder.bowl - 0.9);
  cat.hunger = clamp(cat.hunger + 34 + Math.random() * 10, 0, 100);
  cat.happiness = clamp(cat.happiness + 2.5, 0, 100);
  cat.lastAteAt = performance.now();
  cat.mode = 'roam';
  cat.nextDecisionAt = performance.now() + 700;
  renderFacilities();
}

function finishToileting(cat) {
  const litter = state.facilities.litter;
  litter.waste = Math.min(litter.capacity, litter.waste + 1);
  litter.occupiedBy = null;
  cat.bladder = 8 + Math.random() * 8;
  cat.blockedSince = 0;
  cat.happiness = clamp(cat.happiness + (litter.waste < 4 ? 1.6 : -0.8), 0, 100);
  cat.lastUsedLitterAt = performance.now();
  cat.mode = 'roam';
  cat.nextDecisionAt = performance.now() + 650;
  renderFacilities();
}

function updateNeedsAndCare(now, dt) {
  const feeder = state.facilities.feeder;
  const litter = state.facilities.litter;

  if (feeder.auto && feeder.bowl < 1.1 && now - feeder.lastDispenseAt > feeder.cooldown) {
    dispenseFood(1.8, 'auto');
  }

  state.cats.forEach(cat => {
    if (state.heldCat?.id === cat.id) return;
    cat.hunger = clamp(cat.hunger - dt * (0.16 + cat.traits.energy * 0.04), 0, 100);
    cat.bladder = clamp(cat.bladder + dt * (0.12 + cat.traits.rest * 0.02), 0, 100);

    if (cat.hunger < 28) cat.happiness = clamp(cat.happiness - dt * 0.22, 0, 100);
    else if (cat.hunger < 42) cat.happiness = clamp(cat.happiness - dt * 0.08, 0, 100);

    if (cat.bladder > 82) cat.happiness = clamp(cat.happiness - dt * 0.16, 0, 100);
    if (state.facilities.floorMesses.length) cat.happiness = clamp(cat.happiness - dt * 0.035 * state.facilities.floorMesses.length, 0, 100);
    if (litter.waste >= 4) cat.happiness = clamp(cat.happiness - dt * 0.025, 0, 100);
  });
}


function clearQueue(cat) {
  cat.queuedSupportId = null;
  cat.queuedAt = 0;
  cat.queueTargetX = null;
  cat.nextQueueTryAt = 0;
  cat.queueKind = null;
}

function resetSocial(cat) {
  if (!cat.socialPartnerId) return;
  const partner = getCatById(cat.socialPartnerId);
  cat.socialPartnerId = null;
  cat.lastSocialAt = performance.now();
  if (partner && partner.socialPartnerId === cat.id) {
    partner.socialPartnerId = null;
    partner.lastSocialAt = performance.now();
    if (!partner.jump && state.heldCat?.id !== partner.id) {
      partner.mode = 'roam';
      partner.nextDecisionAt = performance.now() + 420;
    }
  }
}

function interruptCat(cat, source = 'human') {
  if (state.heldCat?.id === cat.id) return;
  if (state.activePetCat?.id === cat.id && source !== 'pet') stopPetting();
  resetSocial(cat);
  clearQueue(cat);

  if (state.facilities.litter.occupiedBy === cat.id) {
    state.facilities.litter.occupiedBy = null;
    renderFacilities();
  }

  if (cat.jump) {
    // Preserve current airborne position rather than snapping to the destination.
    cat.jump = null;
    cat.surfaceId = 'floor';
    cat.targetSupportId = 'floor';
    cat.x = clamp(cat.x, getSupport('floor').x1 + 1.5, getSupport('floor').x2 - 1.5);
    cat.y = clamp(Math.max(cat.y, getSupport('floor').y1), getSupport('floor').y1, getSupport('floor').y2);
  }

  if (cat.mode === 'napping' && source === 'pet') {
    cat.mode = 'stretching';
    cat.actionUntil = performance.now() + 900;
  } else if (cat.mode !== 'held') {
    cat.mode = 'roam';
  }

  cat.napUntil = 0;
  cat.napGroup = null;
  cat.nextDecisionAt = performance.now() + (source === 'toy' ? 120 : 400);
}

function createToyElement(toy) {
  const el = document.createElement('div');
  el.className = 'furniture';

  let inner = '';
  if (toy.type === 'ball') inner = '<div class="toy-ball"></div>';
  if (toy.type === 'feather') inner = '<div class="toy-feather"></div><div class="toy-stick"></div>';
  if (toy.type === 'cushion') inner = '<div class="toy-cushion"></div>';
  if (toy.type === 'fish') inner = '<div class="toy-fish"></div>';

  el.innerHTML = `${inner}<div class="toy-label">${toy.name}</div>`;
  toy.el = el;
  setEntityPosition(el, toy.x, toy.y);
  toyLayer.appendChild(el);

  const startDrag = (clientX, clientY) => {
    state.draggingToy = toy;
    toy.dragOffsetX = clientX - (state.roomRect.left + pctToPxX(toy.x));
    toy.dragOffsetY = clientY - (state.roomRect.top + pctToPxY(toy.y));
    el.classList.add('dragging');
  };

  el.addEventListener('mousedown', event => {
    event.stopPropagation();
    startDrag(event.clientX, event.clientY);
  });

  el.addEventListener('touchstart', event => {
    const touch = event.touches[0];
    if (!touch) return;
    startDrag(touch.clientX, touch.clientY);
  }, { passive: true });
}

function renderToys() {
  toyLayer.innerHTML = '';
  state.toys.forEach(createToyElement);
}

function createCatElement(cat) {
  const el = document.createElement('div');
  el.className = 'cat';
  el.style.setProperty('--cat-fur', cat.fur);
  el.innerHTML = `
    <div class="cat-name">${cat.name}</div>
    <div class="cat-actor" style="--facing:${cat.facing}">
      <div class="shadow"></div>
      <div class="body-group">
        <div class="chest"></div>
        <div class="torso"></div>
        <div class="hip"></div>
        <div class="belly"></div>
      </div>
      <div class="legs-group">
        <div class="leg front-left"></div>
        <div class="leg front-right"></div>
        <div class="leg back-left"></div>
        <div class="leg back-right"></div>
      </div>
      <div class="tail-group">
        <div class="tail-base"></div>
        <div class="tail-tip"></div>
      </div>
      <div class="head-group">
        <div class="head"></div>
        <div class="ear left"></div>
        <div class="ear right"></div>
        <div class="face">
          <div class="eye left"></div>
          <div class="eye right"></div>
          <div class="nose"></div>
          <div class="mouth"></div>
          <div class="whisker wl1"></div>
          <div class="whisker wl2"></div>
          <div class="whisker wr1"></div>
          <div class="whisker wr2"></div>
        </div>
      </div>
      <div class="heart">💗</div>
      <div class="zzz">z z z</div>
    </div>
  `;
  cat.el = el;
  cat.actor = el.querySelector('.cat-actor');
  cat.heart = el.querySelector('.heart');
  setEntityPosition(el, cat.x, cat.y);
  catLayer.appendChild(el);

  const beginPet = event => {
    event.stopPropagation();
    if (!state.pointerDown || state.heldCat) return;
    setPetting(cat);
  };

  el.addEventListener('mouseenter', beginPet);
  el.addEventListener('mousemove', () => {
    if (state.pointerDown && !state.heldCat) setPetting(cat);
  });
  el.addEventListener('mousedown', event => {
    if (state.heldCat) return;
    event.stopPropagation();
    state.pointerDown = true;
    setPetting(cat);
  });
  el.addEventListener('touchstart', event => {
    if (state.heldCat) return;
    event.stopPropagation();
    state.pointerDown = true;
    setPetting(cat);
  }, { passive: true });
  el.addEventListener('dblclick', event => {
    event.stopPropagation();
    pickupCat(cat);
  });
}

function renderCats() {
  catLayer.innerHTML = '';
  state.cats.forEach(createCatElement);
  renderCatsList();
  updateStats();
}

function nearestToy(cat) {
  return state.toys
    .map(toy => ({ toy, dist: distance(cat, toy) }))
    .sort((a, b) => a.dist - b.dist)[0];
}

function setAction(cat, mode, duration) {
  const now = performance.now();
  resetSocial(cat);
  cat.mode = mode;
  cat.actionUntil = now + duration;
  cat.nextDecisionAt = now + duration + 240;
  cat.tx = cat.x;
  cat.ty = cat.y;
}

function queueForSupport(cat, supportId, targetX) {
  const support = getSupport(supportId);
  resetSocial(cat);
  cat.mode = 'queue';
  cat.queueKind = 'platform';
  cat.queuedSupportId = supportId;
  cat.targetSupportId = supportId;
  cat.queuedAt = performance.now();
  cat.queueTargetX = clamp(targetX, support.x1 + 1.5, support.x2 - 1.5);
  cat.nextQueueTryAt = performance.now() + 260 + Math.random() * 320;
}

function getQueueForSupport(supportId) {
  return state.cats
    .filter(cat => cat.mode === 'queue' && cat.queuedSupportId === supportId && !cat.jump && state.heldCat?.id !== cat.id)
    .sort((a, b) => a.queuedAt - b.queuedAt);
}

function getQueueWaitPosition(cat) {
  const support = getSupport(cat.queuedSupportId);
  const queue = getQueueForSupport(cat.queuedSupportId);
  const index = Math.max(0, queue.findIndex(item => item.id === cat.id));
  const offsets = [0, -7, 7, -13, 13];
  return {
    x: clamp(support.waitX + (offsets[index] ?? (index - 2) * 5), getSupport('floor').x1 + 1.5, getSupport('floor').x2 - 1.5),
    y: support.waitY
  };
}

function currentReservedCount(supportId) {
  return state.cats.filter(cat => {
    if (state.heldCat?.id === cat.id) return false;
    if (cat.surfaceId === supportId) return true;
    if (cat.jump?.targetSupportId === supportId) return true;
    return false;
  }).length;
}

function platformAvailable(supportId) {
  const support = getSupport(supportId);
  return currentReservedCount(supportId) < support.capacity;
}

function maybeWinQueue(cat, now) {
  if (now < cat.nextQueueTryAt) return false;
  cat.nextQueueTryAt = now + 220 + Math.random() * 300;
  const supportId = cat.queuedSupportId;
  if (!platformAvailable(supportId)) return false;

  const contenders = getQueueForSupport(supportId).filter(other => distance(other, getQueueWaitPosition(other)) < 1.8);
  if (!contenders.length) return false;
  const scored = contenders.map(other => ({
    other,
    score: getBoldness(other) + Math.random() * 0.42 + Math.min(0.24, (now - other.queuedAt) / 8000)
  })).sort((a, b) => b.score - a.score);
  return scored[0]?.other.id === cat.id;
}

function chooseFloorTarget(cat) {
  const floor = getSupport('floor');
  cat.targetSupportId = 'floor';
  cat.tx = floor.x1 + Math.random() * (floor.x2 - floor.x1);
  cat.ty = floor.y1 + Math.random() * (floor.y2 - floor.y1);
}

function choosePlatformRequest(cat) {
  const theme = THEMES[state.theme];
  const candidates = SUPPORTS
    .filter(support => support.kind === 'platform')
    .map(support => ({
      support,
      score: support.capacity - currentReservedCount(support.id) > 0
        ? support.capacity + (0.55 + cat.traits.curiosity * 0.6) * theme.curiosityBoost
        : (0.28 + getBoldness(cat) * 0.34) * theme.curiosityBoost
    }))
    .sort((a, b) => b.score - a.score);

  const chosen = candidates[0]?.support;
  if (!chosen) return false;

  const targetX = clamp(chosen.x1 + 1.5 + Math.random() * (chosen.x2 - chosen.x1 - 3), chosen.x1 + 1.5, chosen.x2 - 1.5);
  if (cat.surfaceId === 'floor') {
    queueForSupport(cat, chosen.id, targetX);
  } else if (cat.surfaceId === chosen.id) {
    cat.targetSupportId = chosen.id;
    cat.tx = targetX;
    cat.ty = chosen.catY;
  } else {
    chooseFloorTarget(cat);
  }
  return true;
}

function startJump(cat, targetSupportId, targetX, targetY, customHeight = null) {
  clearQueue(cat);
  resetSocial(cat);
  cat.mode = 'jumping';
  cat.targetSupportId = targetSupportId;
  const dist = distance(cat, { x: targetX, y: targetY });
  const duration = clamp(420 + dist * 15, 420, 720);
  const height = customHeight ?? clamp(7 + dist * 0.25, 7, 16);
  cat.jump = {
    start: performance.now(),
    duration,
    height,
    fromX: cat.x,
    fromY: cat.y,
    toX: targetX,
    toY: targetY,
    targetSupportId
  };
  cat.tx = targetX;
  cat.ty = targetY;
}

function updateJump(cat, now) {
  const jump = cat.jump;
  if (!jump) return false;
  const rawT = clamp((now - jump.start) / jump.duration, 0, 1);
  const t = easeInOutQuad(rawT);
  const arc = Math.sin(Math.PI * rawT) * jump.height;
  cat.x = lerp(jump.fromX, jump.toX, t);
  cat.y = lerp(jump.fromY, jump.toY, t) - arc;
  cat.facing = jump.toX >= jump.fromX ? 1 : -1;

  if (rawT >= 1) {
    cat.x = jump.toX;
    cat.y = jump.toY;
    cat.surfaceId = jump.targetSupportId;
    cat.targetSupportId = jump.targetSupportId;
    cat.jump = null;
    cat.mode = 'roam';
    cat.nextDecisionAt = performance.now() + 420;
    return true;
  }
  return false;
}

function resolveToyDrop(point) {
  const platformCandidates = SUPPORTS
    .filter(support => support.kind === 'platform' && point.x >= support.x1 - 1 && point.x <= support.x2 + 1)
    .map(support => ({ support, dy: Math.abs(point.y - support.toyY) }))
    .sort((a, b) => a.dy - b.dy);

  const bestPlatform = platformCandidates[0];
  if (bestPlatform && bestPlatform.dy < 18) {
    const support = bestPlatform.support;
    return {
      supportId: support.id,
      x: clamp(point.x, support.x1 + 1.5, support.x2 - 1.5),
      y: support.toyY
    };
  }

  const floor = getSupport('floor');
  return {
    supportId: 'floor',
    x: clamp(point.x, floor.x1, floor.x2),
    y: floor.toyY
  };
}

function resolveCatDrop(point) {
  const platformCandidates = SUPPORTS
    .filter(support => support.kind === 'platform' && point.x >= support.x1 - 1 && point.x <= support.x2 + 1)
    .map(support => ({ support, dy: Math.abs(point.y - support.catY) }))
    .sort((a, b) => a.dy - b.dy);

  const bestPlatform = platformCandidates[0];
  if (bestPlatform && bestPlatform.dy < 16 && platformAvailable(bestPlatform.support.id)) {
    const support = bestPlatform.support;
    return {
      supportId: support.id,
      x: clamp(point.x, support.x1 + 1.5, support.x2 - 1.5),
      y: support.catY
    };
  }

  const floor = getSupport('floor');
  return {
    supportId: 'floor',
    x: clamp(point.x, floor.x1 + 1.5, floor.x2 - 1.5),
    y: clamp(point.y, floor.y1, floor.y2)
  };
}

function enticeCatsByToy(toy, intensity = 1) {
  state.cats.forEach(cat => {
    if (state.heldCat?.id === cat.id || state.activePetCat?.id === cat.id || cat.jump) return;
    const dist = distance(cat, toy);
    const range = 12 + cat.traits.toy * 16;
    if (dist > range) return;
    const chance = 0.08 + cat.traits.toy * 0.58;
    if (Math.random() > chance) return;

    if (['queue', 'watching', 'sniffing', 'greeting', 'grooming'].includes(cat.mode) && Math.random() < 0.12 + cat.traits.toy * 0.52) {
      interruptCat(cat, 'toy');
    }
    if (cat.mode === 'napping' && Math.random() < 0.04 + cat.traits.toy * 0.08) {
      interruptCat(cat, 'pet');
    }

    cat.toyFocus = clamp(cat.toyFocus + intensity * (0.12 + cat.traits.toy * 0.24), 0, 1.1);
    cat.toyTargetId = toy.id;
    cat.nextDecisionAt = Math.min(cat.nextDecisionAt, performance.now() + 180);
  });
}

function moveDraggingToy(clientX, clientY) {
  const toy = state.draggingToy;
  if (!toy) return;
  const localX = clamp(clientX - state.roomRect.left - toy.dragOffsetX, 20, state.roomRect.width - 20);
  const localY = clamp(clientY - state.roomRect.top - toy.dragOffsetY, 18, state.roomRect.height - 18);
  toy.x = pxToPctX(localX);
  toy.y = pxToPctY(localY);
  setEntityPosition(toy.el, toy.x, toy.y);
  enticeCatsByToy(toy, 1);
}

function pickupCat(cat) {
  if (state.draggingToy) return;
  if (state.heldCat?.id === cat.id) return;
  if (state.heldCat) placeHeldCat(state.lastPointer.x, state.lastPointer.y);

  interruptCat(cat, 'hold');
  cat.mode = 'held';
  cat.holdStyle = getHoldStyle(cat);
  state.heldCat = cat;
  hand.textContent = '🤲';
  hand.classList.add('holding');
  updateHeldCatPosition();

  const px = pctToPxX(cat.x);
  const py = pctToPxY(cat.y);
  createBubble(cat.holdStyle === 'calm' ? '乖乖被抱起' : '有点扭动', px + 24, py - 44, '🤲');
  if (cat.holdStyle === 'squirmy') playMeow();
  renderCatsList();
  updateStats();
}

function updateHeldCatPosition() {
  const cat = state.heldCat;
  if (!cat || !state.roomRect) return;
  const point = pointerToRoomPercent(state.lastPointer.x, state.lastPointer.y);
  cat.x = clamp(point.x, 8, 92);
  cat.y = clamp(point.y - 7, 12, 74);
  cat.tx = cat.x;
  cat.ty = cat.y;
  setEntityPosition(cat.el, cat.x, cat.y);
}

function placeHeldCat(clientX, clientY) {
  const cat = state.heldCat;
  if (!cat) return;
  const point = pointerToRoomPercent(clientX, clientY);
  const drop = resolveCatDrop(point);
  state.heldCat = null;
  hand.textContent = '🖐️';
  hand.classList.remove('holding');
  cat.mode = 'roam';
  startJump(cat, drop.supportId, drop.x, drop.y, drop.supportId === 'floor' ? 5 : 7);
  renderCatsList();
  updateStats();
}

function setPetting(cat) {
  if (state.draggingToy || cat.jump || state.heldCat) return;
  const now = performance.now();
  if (now - cat.lastPetAt < 160) return;
  cat.lastPetAt = now;

  if (state.activePetCat && state.activePetCat.id !== cat.id) {
    state.activePetCat.el.classList.remove('petting');
    state.activePetCat.heart.style.display = 'none';
  }

  interruptCat(cat, 'pet');
  if (cat.mode === 'napping') {
    cat.mode = 'stretching';
    cat.actionUntil = now + 900;
  }

  state.activePetCat = cat;
  cat.el.classList.remove('grooming', 'stretching', 'napping', 'walking');
  cat.el.classList.add('petting');
  cat.heart.style.display = 'block';
  hand.classList.add('petting');
  cat.happiness = clamp(cat.happiness + lerp(0.45, 1.05, cat.traits.affection), 0, 100);
  state.petCount += 1;
  cat.toyFocus = Math.max(0, cat.toyFocus - 0.2);
  cat.tx = cat.x;
  cat.ty = cat.y;
  cat.nextDecisionAt = now + 1100;

  const px = pctToPxX(cat.x);
  const py = pctToPxY(cat.y);
  if (Math.random() < 0.34 + cat.traits.affection * 0.3) {
    createBubble(cat.phrase, px + 34, py - 56, '💬');
    playMeow();
  } else {
    createSpark(px + 16 + Math.random() * 24, py - 24, Math.random() > 0.5 ? '💗' : '✨');
    playPurr();
  }

  renderCatsList();
  updateStats();
}

function stopPetting() {
  if (!state.activePetCat) return;
  state.activePetCat.el.classList.remove('petting');
  state.activePetCat.heart.style.display = 'none';
  state.activePetCat = null;
  hand.classList.remove('petting');
  renderCatsList();
  updateStats();
}

function maybeAbandonQueue(cat, now) {
  const waited = now - cat.queuedAt;
  const abandonChance = clamp((waited - 2500) / 9000, 0, 0.35) * (cat.traits.space * 0.8 + (1 - cat.traits.social) * 0.4);
  if (waited > 2600 && Math.random() < abandonChance) {
    clearQueue(cat);
    cat.mode = 'watching';
    cat.actionUntil = now + 900 + Math.random() * 500;
    cat.nextDecisionAt = cat.actionUntil + 180;
    createBubble('算了先看看', pctToPxX(cat.x) + 12, pctToPxY(cat.y) - 32, '👀');
    return true;
  }
  return false;
}

function maybeStartSocial(cat, now) {
  if (cat.mode !== 'roam' || state.heldCat?.id === cat.id || cat.jump || now - cat.lastSocialAt < 3000) return false;
  if (cat.hunger < 42 || cat.bladder > 76) return false;
  const partner = state.cats.find(other =>
    other.id !== cat.id &&
    other.mode === 'roam' &&
    !other.jump &&
    !other.socialPartnerId &&
    state.heldCat?.id !== other.id &&
    other.surfaceId === cat.surfaceId &&
    distance(cat, other) < 15 &&
    now - other.lastSocialAt > 2600
  );
  if (!partner) return false;

  const chance = 0.03 + ((cat.traits.social + partner.traits.social) / 2) * 0.12;
  if (Math.random() > chance) return false;

  const avgAffection = (cat.traits.affection + partner.traits.affection) / 2;
  const avgCuriosity = (cat.traits.curiosity + partner.traits.curiosity) / 2;
  const avgSocial = (cat.traits.social + partner.traits.social) / 2;

  let type = 'watching';
  if (avgSocial > 0.58 && avgAffection > 0.58) type = 'greeting';
  else if (avgCuriosity > 0.48) type = 'sniffing';

  const duration = type === 'greeting' ? 1400 : type === 'sniffing' ? 1200 : 1000;
  const support = getSupport(cat.surfaceId);
  const centerX = clamp((cat.x + partner.x) / 2, support.x1 + 2, support.x2 - 2);
  const offset = type === 'greeting' ? 3 : 4;

  [cat, partner].forEach((item, idx) => {
    item.mode = type;
    item.socialPartnerId = idx === 0 ? partner.id : cat.id;
    item.actionUntil = now + duration;
    item.nextDecisionAt = now + duration + 320;
    item.targetSupportId = item.surfaceId;
    item.tx = clamp(centerX + (idx === 0 ? -offset : offset), support.x1 + 2, support.x2 - 2);
    item.ty = support.kind === 'floor' ? clamp((cat.y + partner.y) / 2, support.y1, support.y2) : support.catY;
  });

  cat.facing = 1;
  partner.facing = -1;
  createBubble(SOCIAL_TEXT[type], pctToPxX(centerX), pctToPxY(cat.ty) - 34, type === 'greeting' ? '💞' : type === 'sniffing' ? '🐽' : '👀');
  return true;
}

function startNap(cat, partner = null) {
  const now = performance.now();
  state.napGroupId += 1;
  const groupId = state.napGroupId;
  const spot = NAP_SPOTS[Math.floor(Math.random() * NAP_SPOTS.length)];
  const support = getSupport(spot.supportId);
  const duration = 4200 + Math.random() * 3600 + cat.traits.rest * 1800 * THEMES[state.theme].restBoost;

  if (cat.surfaceId !== spot.supportId) {
    if (spot.supportId === 'floor') chooseFloorTarget(cat);
    else queueForSupport(cat, spot.supportId, spot.x);
    cat.nextDecisionAt = now + 420;
    return;
  }

  cat.mode = 'napping';
  cat.napGroup = groupId;
  cat.napUntil = now + duration;
  cat.targetSupportId = spot.supportId;
  cat.tx = clamp(spot.x, support.x1 + 1.5, support.x2 - 1.5);
  cat.ty = support.kind === 'floor' ? clamp(spot.y, support.y1, support.y2) : support.catY;
  cat.nextDecisionAt = cat.napUntil;

  if (partner && partner.surfaceId === spot.supportId) {
    const offset = Math.random() > 0.5 ? 6 : -6;
    partner.mode = 'napping';
    partner.napGroup = groupId;
    partner.napUntil = now + duration * 0.92;
    partner.targetSupportId = spot.supportId;
    partner.tx = clamp(spot.x + offset, support.x1 + 1.5, support.x2 - 1.5);
    partner.ty = support.kind === 'floor' ? clamp(spot.y + 1.4, support.y1, support.y2) : support.catY;
    partner.nextDecisionAt = partner.napUntil;
  }
}

function tryPairNap(cat) {
  if (cat.traits.social < 0.5 || Math.random() > cat.traits.social * 0.26) return false;
  const partner = state.cats.find(other =>
    other.id !== cat.id &&
    other.surfaceId === cat.surfaceId &&
    other.mode === 'roam' &&
    !other.jump &&
    other.traits.social > 0.44 &&
    distance(cat, other) < 24
  );
  if (!partner) return false;
  startNap(cat, partner);
  return true;
}

function chooseTarget(cat, now = performance.now()) {
  if (state.activePetCat?.id === cat.id || state.heldCat?.id === cat.id || cat.jump) return;

  if (cat.mode === 'napping' && now < cat.napUntil) return;
  if (['grooming', 'stretching', 'sniffing', 'greeting', 'watching', 'eating', 'toileting'].includes(cat.mode) && now < cat.actionUntil) return;

  if (cat.mode === 'napping' && now >= cat.napUntil) {
    cat.mode = 'stretching';
    cat.actionUntil = now + 1200;
    cat.nextDecisionAt = now + 1450;
    return;
  }

  if (['sniffing', 'greeting', 'watching'].includes(cat.mode) && now >= cat.actionUntil) {
    resetSocial(cat);
    cat.mode = 'roam';
  }

  if (cat.mode === 'stretching' && now >= cat.actionUntil) {
    if (Math.random() < 0.38) {
      setAction(cat, 'grooming', 1700 + Math.random() * 700);
      return;
    }
    cat.mode = 'roam';
  }

  if (cat.mode === 'grooming' && now >= cat.actionUntil) cat.mode = 'roam';

  if (cat.mode === 'eating' && now >= cat.actionUntil) {
    finishEating(cat);
    return;
  }

  if (cat.mode === 'toileting' && now >= cat.actionUntil) {
    finishToileting(cat);
    return;
  }

  if (cat.mode === 'queue') {
    const waitPosition = getQueueWaitPosition(cat);
    cat.tx = waitPosition.x;
    cat.ty = waitPosition.y;

    if (distance(cat, waitPosition) < 1.2 && maybeWinQueue(cat, now)) {
      const support = getSupport(cat.queuedSupportId);
      startJump(cat, support.id, cat.queueTargetX ?? support.waitX, support.catY);
      return;
    }

    maybeAbandonQueue(cat, now);
    return;
  }

  if (cat.mode === 'pottyQueue') {
    const queuePos = getLitterQueuePosition(cat);
    cat.tx = queuePos.x;
    cat.ty = queuePos.y;
    const litter = state.facilities.litter;
    const queue = getLitterQueue();
    const headId = queue[0]?.id;

    if (!litterUsable()) {
      if (!cat.blockedSince) cat.blockedSince = now;
      if (cat.bladder > 96 && now - cat.blockedSince > 9000 && Math.random() < 0.018 + (1 - cat.traits.rest) * 0.02) {
        createFloorMess(cat);
        cat.mode = 'watching';
        cat.actionUntil = now + 800;
        cat.nextDecisionAt = now + 1200;
      }
      return;
    }

    if (!litter.occupiedBy && headId === cat.id && distance(cat, queuePos) < 1.4) {
      litter.occupiedBy = cat.id;
      cat.mode = 'toileting';
      cat.tx = litter.x;
      cat.ty = litter.y + 0.6;
      cat.actionUntil = now + 1800 + Math.random() * 600;
      cat.nextDecisionAt = cat.actionUntil;
      renderFacilities();
      return;
    }
    return;
  }

  if (now < cat.nextDecisionAt) return;

  // Need-based priorities come before play and social.
  const feeder = state.facilities.feeder;
  const litter = state.facilities.litter;
  const floor = getSupport('floor');

  if (cat.hunger < 38) {
    if (feeder.auto && feeder.bowl < 1.05 && now - feeder.lastDispenseAt > feeder.cooldown) {
      dispenseFood(1.8, 'auto');
    }

    if (feeder.bowl > 0.25) {
      if (cat.surfaceId !== 'floor') {
        startJump(cat, 'floor', clamp(feeder.x - 4 + Math.random() * 6, floor.x1 + 2, floor.x2 - 2), clamp(feeder.y - 1.5, floor.y1, floor.y2), 7);
        cat.nextDecisionAt = now + 520;
        return;
      }
      const feederTarget = { x: clamp(feeder.x - 3 + Math.random() * 5, floor.x1 + 2, floor.x2 - 2), y: clamp(feeder.y - 1.2, floor.y1, floor.y2) };
      if (distance(cat, feederTarget) < 4.5) {
        cat.mode = 'eating';
        cat.tx = feederTarget.x;
        cat.ty = feederTarget.y;
        cat.actionUntil = now + 1600 + Math.random() * 600;
        cat.nextDecisionAt = cat.actionUntil;
        return;
      }
      cat.mode = 'roam';
      cat.targetSupportId = 'floor';
      cat.tx = feederTarget.x;
      cat.ty = feederTarget.y;
      cat.nextDecisionAt = now + 480;
      return;
    }
  }

  if (cat.bladder > 78) {
    if (cat.surfaceId !== 'floor') {
      startJump(cat, 'floor', clamp(litter.x + (Math.random() * 6 - 3), floor.x1 + 2, floor.x2 - 2), clamp(litter.y - 0.6, floor.y1, floor.y2), 7);
      cat.nextDecisionAt = now + 520;
      return;
    }

    if (!litterUsable()) {
      if (!cat.blockedSince) cat.blockedSince = now;
      if (cat.bladder > 96 && now - cat.blockedSince > 9000 && Math.random() < 0.018 + (1 - cat.traits.rest) * 0.02) {
        createFloorMess(cat);
        cat.mode = 'watching';
        cat.actionUntil = now + 760;
        cat.nextDecisionAt = now + 1200;
        return;
      }
      cat.mode = 'watching';
      cat.tx = clamp(litter.x - 7 + Math.random() * 4, floor.x1 + 2, floor.x2 - 2);
      cat.ty = clamp(litter.y + 1.5, floor.y1, floor.y2);
      cat.actionUntil = now + 600;
      cat.nextDecisionAt = now + 820;
      return;
    }

    if (litter.occupiedBy && litter.occupiedBy !== cat.id) {
      startPottyQueue(cat);
      return;
    }

    if (!litter.occupiedBy) {
      if (distance(cat, litter) < 4.5) {
        litter.occupiedBy = cat.id;
        cat.mode = 'toileting';
        cat.tx = litter.x;
        cat.ty = litter.y + 0.6;
        cat.actionUntil = now + 1800 + Math.random() * 600;
        cat.nextDecisionAt = cat.actionUntil;
        cat.blockedSince = 0;
        renderFacilities();
        return;
      }
      cat.mode = 'roam';
      cat.targetSupportId = 'floor';
      cat.tx = clamp(litter.x - 2 + Math.random() * 4, floor.x1 + 2, floor.x2 - 2);
      cat.ty = clamp(litter.y + 0.6, floor.y1, floor.y2);
      cat.blockedSince = cat.blockedSince || now;
      cat.nextDecisionAt = now + 420;
      return;
    }
  } else {
    cat.blockedSince = 0;
  }

  if (maybeStartSocial(cat, now)) return;

  const theme = THEMES[state.theme];
  const restChance = (0.05 + cat.traits.rest * 0.12) * theme.restBoost;
  const groomChance = 0.04 + (1 - cat.traits.energy) * 0.06;
  const stretchChance = 0.03 + cat.traits.rest * 0.05;

  const chasingToy = cat.toyFocus > 0.28 && cat.toyTargetId && Math.random() < (0.18 + cat.traits.toy * 0.55);
  if (chasingToy) {
    const toy = state.toys.find(item => item.id === cat.toyTargetId);
    if (toy) {
      const support = getSupport(toy.supportId);
      cat.mode = 'playing';
      if (toy.supportId === cat.surfaceId) {
        cat.targetSupportId = toy.supportId;
        cat.tx = clamp(toy.x + (Math.random() * 5 - 2.5), support.x1 + 1.5, support.x2 - 1.5);
        cat.ty = support.kind === 'floor'
          ? clamp(support.y1 + Math.random() * (support.y2 - support.y1), support.y1, support.y2)
          : support.catY;
      } else if (cat.surfaceId === 'floor' && support.kind === 'platform') {
        queueForSupport(cat, toy.supportId, toy.x);
      } else if (support.kind === 'floor' && cat.surfaceId !== 'floor') {
        startJump(cat, 'floor', clamp(toy.x, floor.x1 + 1.5, floor.x2 - 1.5), clamp(toy.y - 4.5, floor.y1, floor.y2));
      } else {
        chooseFloorTarget(cat);
      }
      cat.nextDecisionAt = now + 900 + (1 - cat.traits.toy) * 700;
      return;
    }
  }

  const nearToy = nearestToy(cat);
  if (nearToy && nearToy.dist < 14 && Math.random() < cat.traits.curiosity * 0.22 * theme.curiosityBoost) {
    const toy = nearToy.toy;
    const support = getSupport(toy.supportId);
    cat.mode = 'playing';
    if (toy.supportId === cat.surfaceId) {
      cat.targetSupportId = toy.supportId;
      cat.tx = clamp(toy.x + (Math.random() * 5 - 2.5), support.x1 + 1.5, support.x2 - 1.5);
      cat.ty = support.kind === 'floor'
        ? clamp(support.y1 + Math.random() * (support.y2 - support.y1), support.y1, support.y2)
        : support.catY;
    } else if (cat.surfaceId === 'floor' && support.kind === 'platform') {
      queueForSupport(cat, toy.supportId, toy.x);
    } else if (support.kind === 'floor' && cat.surfaceId !== 'floor') {
      startJump(cat, 'floor', clamp(toy.x, floor.x1 + 1.5, floor.x2 - 1.5), clamp(toy.y - 4.5, floor.y1, floor.y2));
    } else {
      chooseFloorTarget(cat);
    }
    cat.nextDecisionAt = now + 820;
    return;
  }

  if (Math.random() < restChance) {
    if (!tryPairNap(cat)) startNap(cat);
    return;
  }

  if (Math.random() < groomChance) {
    setAction(cat, 'grooming', 1600 + Math.random() * 800);
    return;
  }

  if (Math.random() < stretchChance) {
    setAction(cat, 'stretching', 1100 + Math.random() * 300);
    return;
  }

  if (cat.surfaceId !== 'floor' && Math.random() < 0.34) {
    startJump(cat, 'floor', clamp(cat.x + (Math.random() * 18 - 9), floor.x1 + 2, floor.x2 - 2), clamp(floor.catY + (Math.random() * 6 - 3), floor.y1, floor.y2));
    cat.nextDecisionAt = now + 880;
    return;
  }

  if (Math.random() < cat.traits.curiosity * 0.28 * theme.curiosityBoost) {
    if (!choosePlatformRequest(cat)) chooseFloorTarget(cat);
  } else {
    chooseFloorTarget(cat);
  }

  cat.mode = 'roam';
  cat.nextDecisionAt = now + 1200 + Math.random() * 2200 + (1 - cat.traits.energy) * 900;
}

function applySeparation() {
  for (let i = 0; i < state.cats.length; i++) {
    for (let j = i + 1; j < state.cats.length; j++) {
      const a = state.cats[i];
      const b = state.cats[j];
      if (a.jump || b.jump || state.heldCat?.id === a.id || state.heldCat?.id === b.id) continue;
      if (a.surfaceId !== b.surfaceId) continue;
      if (['sniffing', 'greeting', 'watching'].includes(a.mode) || ['sniffing', 'greeting', 'watching'].includes(b.mode)) continue;

      const sameNap = a.mode === 'napping' && b.mode === 'napping' && a.napGroup && a.napGroup === b.napGroup;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy) || 0.001;
      const preferred = sameNap ? 9 : 12 + ((a.traits.space + b.traits.space) / 2) * 8;
      if (dist >= preferred) continue;

      const push = (preferred - dist) * (sameNap ? 0.015 : 0.05);
      const ux = dx / dist;
      const uy = dy / dist;
      const support = getSupport(a.surfaceId);

      a.x = clamp(a.x - ux * push, support.x1 + 1, support.x2 - 1);
      b.x = clamp(b.x + ux * push, support.x1 + 1, support.x2 - 1);
      if (support.kind === 'floor') {
        a.y = clamp(a.y - uy * push, support.y1, support.y2);
        b.y = clamp(b.y + uy * push, support.y1, support.y2);
      } else {
        a.y = support.catY;
        b.y = support.catY;
      }
    }
  }
}

function updateCatMoodClasses(cat) {
  cat.el.classList.remove('ear-alert', 'ear-back', 'tail-fast', 'tail-soft', 'calm-hold', 'squirmy-hold', 'sniffing', 'greeting', 'watching', 'held', 'hungry', 'potty-urgent', 'eating', 'toileting');
  cat.el.classList.toggle('napping', cat.mode === 'napping');
  cat.el.classList.toggle('grooming', cat.mode === 'grooming');
  cat.el.classList.toggle('stretching', cat.mode === 'stretching');
  cat.el.classList.toggle('jump-shadow', Boolean(cat.jump));
  cat.el.classList.toggle('hungry', cat.hunger < 35);
  cat.el.classList.toggle('potty-urgent', cat.bladder > 84);
  cat.el.classList.toggle('eating', cat.mode === 'eating');
  cat.el.classList.toggle('toileting', cat.mode === 'toileting');

  if (cat.mode === 'held') {
    cat.el.classList.add('held', cat.holdStyle === 'calm' ? 'calm-hold' : 'squirmy-hold');
    if (cat.holdStyle === 'squirmy') cat.el.classList.add('ear-back', 'tail-fast');
    else cat.el.classList.add('tail-soft');
  } else if (cat.mode === 'napping') {
    cat.el.classList.add('tail-soft');
  } else if (['queue', 'watching', 'pottyQueue'].includes(cat.mode)) {
    cat.el.classList.add('ear-alert');
  } else if (cat.mode === 'sniffing') {
    cat.el.classList.add('sniffing', 'ear-alert');
  } else if (cat.mode === 'greeting') {
    cat.el.classList.add('greeting', 'tail-soft');
  } else if (cat.mode === 'toileting') {
    cat.el.classList.add('tail-soft');
  } else {
    if (cat.traits.energy > 0.72 && cat.mode === 'playing') cat.el.classList.add('tail-fast');
    if (cat.traits.rest > 0.7 && ['roam', 'eating'].includes(cat.mode) && !cat.jump) cat.el.classList.add('tail-soft');
  }
}

function updateCatVisual(cat) {
  setEntityPosition(cat.el, cat.x, cat.y);
  cat.actor.style.setProperty('--facing', cat.facing);
  cat.actor.style.setProperty('--hold-rotate', cat.holdStyle === 'squirmy' ? '-12deg' : '-6deg');
  updateCatMoodClasses(cat);
  syncCatActivity(cat);

  const movement = Math.hypot(cat.renderDX || 0, cat.renderDY || 0);
  const shouldWalk = !cat.jump &&
    (!state.heldCat || state.heldCat.id !== cat.id) &&
    ['roam', 'playing', 'queue', 'pottyQueue'].includes(cat.mode) &&
    movement > 0.035;
  cat.el.classList.toggle('walking', shouldWalk);

  const pointerRoom = pointerToRoomPercent(state.lastPointer.x, state.lastPointer.y);
  const nearPointer = distance(cat, pointerRoom) < 20;
  cat.el.querySelectorAll('.eye').forEach(eye => {
    if (cat.mode === 'napping') return;
    if (cat.mode === 'held' && cat.holdStyle === 'calm') {
      eye.style.setProperty('--eye-scale', '0.45');
    } else {
      eye.style.setProperty('--eye-scale', nearPointer ? '0.7' : '1');
    }
  });
}

function animateCats() {
  const now = performance.now();
  const dt = Math.min(0.05, Math.max(0.008, (now - state.lastFrameAt) / 1000));
  state.lastFrameAt = now;

  updateNeedsAndCare(now, dt);

  state.cats.forEach(cat => {
    const prevX = cat.x;
    const prevY = cat.y;

    cat.toyFocus = Math.max(0, cat.toyFocus - dt * (0.22 + (1 - cat.traits.toy) * 0.12));
    if (cat.toyFocus < 0.03) cat.toyTargetId = null;

    if (state.heldCat?.id === cat.id) {
      updateHeldCatPosition();
      cat.renderDX = cat.x - prevX;
      cat.renderDY = cat.y - prevY;
      cat.prevX = cat.x;
      cat.prevY = cat.y;
      return;
    }

    if (state.activePetCat?.id !== cat.id) chooseTarget(cat, now);
    if (state.activePetCat?.id === cat.id) {
      cat.renderDX = cat.x - prevX;
      cat.renderDY = cat.y - prevY;
      cat.prevX = cat.x;
      cat.prevY = cat.y;
      return;
    }

    if (cat.jump) {
      updateJump(cat, now);
      cat.renderDX = cat.x - prevX;
      cat.renderDY = cat.y - prevY;
      cat.prevX = cat.x;
      cat.prevY = cat.y;
      return;
    }

    const support = getSupport(cat.mode === 'queue' || cat.mode === 'pottyQueue' ? 'floor' : (cat.targetSupportId || cat.surfaceId));
    const easing = cat.mode === 'napping' ? 0.018 : (0.026 + cat.traits.energy * 0.02) * Math.min(1.5, dt * 60);

    const targetDX = cat.tx - cat.x;
    if (Math.abs(targetDX) > 0.12 && !['napping', 'grooming', 'toileting'].includes(cat.mode)) {
      cat.facing = targetDX > 0 ? 1 : -1;
    }

    cat.x += targetDX * easing;
    cat.y += (cat.ty - cat.y) * easing;

    cat.x = clamp(cat.x, support.x1 + 1, support.x2 - 1);
    if (support.kind === 'floor') cat.y = clamp(cat.y, support.y1, support.y2);
    else cat.y = support.catY;

    const dx = cat.x - prevX;
    if (Math.abs(dx) > 0.03 && !['napping', 'grooming', 'toileting'].includes(cat.mode)) {
      cat.facing = dx > 0 ? 1 : -1;
    }

    if (distance(cat, { x: cat.tx, y: cat.ty }) < 0.8 && !['queue', 'pottyQueue'].includes(cat.mode)) {
      cat.surfaceId = cat.targetSupportId || cat.surfaceId;
    }

    cat.happiness = clamp(cat.happiness - dt * (cat.mode === 'napping' ? 0.045 : 0.12), 44, 100);
    cat.renderDX = dx;
    cat.renderDY = cat.y - prevY;
    cat.prevX = cat.x;
    cat.prevY = cat.y;
  });

  applySeparation();
  state.cats.forEach(updateCatVisual);
  updateStats();
  requestAnimationFrame(animateCats);
}

function bindEvents() {
  const resizeObserver = new ResizeObserver(() => updateRoomRect());
  resizeObserver.observe(room);
  window.addEventListener('resize', updateRoomRect);

  window.addEventListener('mousemove', event => {
    updatePointer(event.clientX, event.clientY);
    if (state.draggingToy) moveDraggingToy(event.clientX, event.clientY);
  });

  window.addEventListener('touchmove', event => {
    const touch = event.touches[0];
    if (!touch) return;
    updatePointer(touch.clientX, touch.clientY);
    if (state.draggingToy) moveDraggingToy(touch.clientX, touch.clientY);
  }, { passive: true });

  window.addEventListener('mousedown', () => { state.pointerDown = true; });
  window.addEventListener('touchstart', () => { state.pointerDown = true; }, { passive: true });

  room.addEventListener('click', event => {
    if (state.heldCat) {
      placeHeldCat(event.clientX, event.clientY);
    }
  });

  const release = () => {
    state.pointerDown = false;
    stopPetting();

    if (state.draggingToy) {
      state.draggingToy.el.classList.remove('dragging');
      const snapped = resolveToyDrop({ x: state.draggingToy.x, y: state.draggingToy.y });
      state.draggingToy.supportId = snapped.supportId;
      state.draggingToy.x = snapped.x;
      state.draggingToy.y = snapped.y;
      setEntityPosition(state.draggingToy.el, snapped.x, snapped.y);
      enticeCatsByToy(state.draggingToy, 0.5);
      state.draggingToy = null;
    }
  };

  window.addEventListener('mouseup', release);
  window.addEventListener('touchend', release);
  room.addEventListener('mouseleave', () => {
    if (!state.heldCat) stopPetting();
  });

  feederAutoBtn.addEventListener('click', () => {
    state.facilities.feeder.auto = !state.facilities.feeder.auto;
    updateCareButtons();
    renderFacilities();
  });
  feedBtn.addEventListener('click', () => dispenseFood(1, 'manual'));
  scoopBtn.addEventListener('click', () => {
    scoopLitter();
    updateStats();
  });
  cleanFloorBtn.addEventListener('click', () => {
    cleanFloorMess();
    updateStats();
  });

  soundBtn.addEventListener('click', async () => {
    state.soundEnabled = !state.soundEnabled;
    if (state.soundEnabled) {
      initAudio();
      if (state.audioCtx.state === 'suspended') await state.audioCtx.resume();
      soundBtn.textContent = '🔊 声音已开启';
      playMeow();
    } else {
      soundBtn.textContent = '🔇 点击开启声音';
    }
  });
}

function init() {
  updateRoomRect();
  createThemeButtons();
  applyTheme('sunny');
  renderFacilities();
  renderMesses();
  renderToys();
  renderCats();
  bindEvents();
  updateCareButtons();
  state.cats.forEach(cat => chooseTarget(cat));
  updatePointer(window.innerWidth * 0.55, window.innerHeight * 0.5);
  animateCats();
  setInterval(renderCatsList, 280);
}

init();
