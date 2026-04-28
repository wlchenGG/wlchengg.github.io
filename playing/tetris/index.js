const COLS = 10;
const ROWS = 20;
const PREVIEW_GRID = 4;

const STORAGE_BEST_KEY = 'tetris-best-score-v1_7';
const STORAGE_LEADERBOARD_PREFIX = 'tetris-local-leaderboard-v1_7';
const LOCK_DELAY = 520;
const LOCK_RESET_LIMIT = 15;
const LINE_CLEAR_DURATION = 220;
const LOCK_FLASH_DURATION = 180;
const SCORE_ATTACK_DURATION = 120000;

const MODE_DEFS = {
  marathon: {
    label: '马拉松',
    desc: '无限继续，逐级提速，适合长局冲分。'
  },
  stage: {
    label: '关卡模式',
    desc: '每阶段清 10 行晋级，速度提高并追加底部障碍。'
  },
  score_attack: {
    label: '冲分赛',
    desc: '限时 120 秒，比拼短时间内的最高得分。'
  }
};

const DIFFICULTY_DEFS = {
  easy: { label: '简单', speed: 1.0, garbageRows: 0, holes: 2 },
  normal: { label: '普通', speed: 1.15, garbageRows: 2, holes: 2 },
  hard: { label: '困难', speed: 1.35, garbageRows: 4, holes: 1 },
  expert: { label: '专家', speed: 1.6, garbageRows: 6, holes: 1 }
};

const PIECE_DEFS = {
  I: { color: '#35C8FF', matrix: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]] },
  J: { color: '#4A78FF', matrix: [[2, 0, 0], [2, 2, 2], [0, 0, 0]] },
  L: { color: '#FF9B40', matrix: [[0, 0, 3], [3, 3, 3], [0, 0, 0]] },
  O: { color: '#FFD84A', matrix: [[4, 4], [4, 4]] },
  S: { color: '#52E27A', matrix: [[0, 5, 5], [5, 5, 0], [0, 0, 0]] },
  T: { color: '#C26BFF', matrix: [[0, 6, 0], [6, 6, 6], [0, 0, 0]] },
  Z: { color: '#FF617E', matrix: [[7, 7, 0], [0, 7, 7], [0, 0, 0]] }
};

const GARBAGE_VALUE = 8;
const VALUE_TO_COLOR = {
  [GARBAGE_VALUE]: '#495774'
};

Object.values(PIECE_DEFS).forEach(def => {
  def.matrix.flat().forEach(value => {
    if (value) VALUE_TO_COLOR[value] = def.color;
  });
});

const CLASSIC_CLEAR_SCORES = [0, 100, 300, 500, 800];
const TSPIN_CLEAR_SCORES = [400, 800, 1200, 1600];
const TSPIN_LABELS = ['T-SPIN', 'T-SPIN SINGLE', 'T-SPIN DOUBLE', 'T-SPIN TRIPLE'];
const CLEAR_LABELS = ['LOCK', 'SINGLE', 'DOUBLE', 'TRIPLE', 'TETRIS'];


const $$ = selector => Array.from(document.querySelectorAll(selector));

const boardViews = [
  document.getElementById('desktop-board'),
  document.getElementById('mobile-board')
].filter(Boolean).map(canvas => ({ canvas, ctx: canvas.getContext('2d') }));

const previewViews = {
  next: [
    document.getElementById('next-canvas-desktop'),
    document.getElementById('next-canvas-mobile')
  ].filter(Boolean).map(canvas => ({ canvas, ctx: canvas.getContext('2d') })),
  hold: [
    document.getElementById('hold-canvas-desktop'),
    document.getElementById('hold-canvas-mobile')
  ].filter(Boolean).map(canvas => ({ canvas, ctx: canvas.getContext('2d') }))
};

const fieldEls = {
  score: $$('[data-field="score"]'),
  lines: $$('[data-field="lines"]'),
  level: $$('[data-field="level"]'),
  best: $$('[data-field="best"]'),
  combo: $$('[data-field="combo"]'),
  b2b: $$('[data-field="b2b"]'),
  action: $$('[data-field="action"]')
};

const modeMetaEls = $$('[data-mode-meta]');
const modeDescEls = $$('[data-mode-desc]');
const statePills = $$('[data-state-pill]');
const leaderboardListEls = $$('[data-leaderboard-list]');
const leaderboardCaptionEls = $$('[data-leaderboard-caption]');
const leaderboardNameInputs = $$('[data-leaderboard-name]');
const clearLeaderboardButtons = $$('[data-clear-leaderboard]');
const overlays = $$('[data-overlay]').map(node => ({
  root: node,
  kicker: node.querySelector('[data-overlay-kicker]'),
  title: node.querySelector('[data-overlay-title]'),
  desc: node.querySelector('[data-overlay-desc]')
}));
const toastEls = $$('[data-fx-toast]');
const boardBannerEls = $$('[data-board-banner]');
const mobileHintEls = $$('[data-mobile-start-hint]');
const boardFrameEls = $$('[data-board-frame]');

const controls = {
  mode: $$('[data-setting="mode"]'),
  difficulty: $$('[data-setting="difficulty"]'),
  sound: $$('[data-setting="sound"]'),
  haptics: $$('[data-setting="haptics"]')
};

const startPauseButtons = $$('[data-action="start-pause"]');
const restartButtons = $$('[data-action="restart"]');

const touchBindings = [
  ['btn-left', () => movePiece(-1)],
  ['btn-right', () => movePiece(1)],
  ['btn-down', () => softDrop()],
  ['btn-rotate', () => rotateCurrent()],
  ['btn-drop', () => hardDrop()],
  ['btn-hold', () => holdCurrent()]
];

const STORAGE_PLAYER_NAME_KEY = 'tetris-player-name-v1_7';

function isCheckboxControl(element) {
  return element && element.type === 'checkbox';
}

function getVisibleElement(elements) {
  return elements.find(element => element && element.offsetParent !== null) || elements[0] || null;
}

function getControlValue(name) {
  const element = getVisibleElement(controls[name]);
  if (!element) return null;
  return isCheckboxControl(element) ? element.checked : element.value;
}

function setControlValue(name, value) {
  controls[name].forEach(element => {
    if (isCheckboxControl(element)) {
      element.checked = Boolean(value);
    } else {
      element.value = value;
    }
  });
}

function setFieldText(name, value) {
  (fieldEls[name] || []).forEach(element => {
    element.textContent = value;
  });
}

function setPlayerNameInputs(value) {
  leaderboardNameInputs.forEach(input => {
    if (input !== document.activeElement) {
      input.value = value;
    }
  });
}

function getPlayerName() {
  const activeInput = getVisibleElement(leaderboardNameInputs) || leaderboardNameInputs[0];
  const value = activeInput ? activeInput.value.trim() : '';
  return value || '玩家';
}

function savePlayerName(name) {
  localStorage.setItem(STORAGE_PLAYER_NAME_KEY, name);
}

function loadPlayerName() {
  return localStorage.getItem(STORAGE_PLAYER_NAME_KEY) || '玩家';
}


const gesture = {
  active: false,
  pointerId: null,
  startX: 0,
  startY: 0,
  horizontalSteps: 0,
  moved: false
};

const sound = {
  ctx: null
};


const game = {
  board: createEmptyBoard(),
  current: null,
  queue: [],
  holdKind: null,
  holdUsed: false,
  score: 0,
  lines: 0,
  level: 1,
  combo: -1,
  backToBack: 0,
  actionText: 'READY',
  best: loadBestScore(),
  state: 'idle',
  dropCounter: 0,
  dropInterval: 950,
  lastTime: 0,
  currentLanded: false,
  lockTimer: 0,
  lockResetCount: 0,
  lineClearAnimation: null,
  lockFlash: null,
  toastTimer: null,
  bannerTimer: null,
  mobileHintTimer: null,
  lastSavedEntryId: null,
  settings: {
    mode: 'marathon',
    difficulty: 'normal',
    sound: true,
    haptics: true
  },
  session: {
    mode: 'marathon',
    difficulty: 'normal',
    timeLeft: null,
    stage: 1,
    stageLines: 0,
    warning30Shown: false,
    warning10Shown: false,
    lastCountdownMark: null
  }
};

function createEmptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function cloneMatrix(matrix) {
  return matrix.map(row => [...row]);
}

function shuffle(array) {
  const cloned = [...array];
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}

function refillQueue() {
  if (game.queue.length < 7) {
    game.queue.push(...shuffle(Object.keys(PIECE_DEFS)));
  }
}

function createPiece(kind) {
  const definition = PIECE_DEFS[kind];
  return {
    kind,
    matrix: cloneMatrix(definition.matrix),
    pos: { x: Math.floor((COLS - definition.matrix[0].length) / 2), y: 0 },
    lastMove: 'spawn'
  };
}


function getSelectedSettings() {
  return {
    mode: getControlValue('mode') || 'marathon',
    difficulty: getControlValue('difficulty') || 'normal',
    sound: Boolean(getControlValue('sound')),
    haptics: Boolean(getControlValue('haptics'))
  };
}

function applySettingsFromInputs() {
  const selected = getSelectedSettings();
  game.settings = { ...selected };

  modeDescEls.forEach(element => {
    element.textContent = MODE_DEFS[selected.mode].desc;
  });

  leaderboardCaptionEls.forEach(element => {
    element.textContent = `${MODE_DEFS[selected.mode].label} · ${DIFFICULTY_DEFS[selected.difficulty].label}`;
  });

  if (game.state === 'idle') {
    updateModeMeta();
  }

  renderLeaderboard(selected.mode, selected.difficulty);
}


function loadBestScore() {
  const value = Number(localStorage.getItem(STORAGE_BEST_KEY) || 0);
  return Number.isFinite(value) ? value : 0;
}

function saveBestScore() {
  if (game.score > game.best) {
    game.best = game.score;
    localStorage.setItem(STORAGE_BEST_KEY, String(game.best));
    setFieldText('best', game.best);
  }
}

function leaderboardStorageKey(mode, difficulty) {
  return `${STORAGE_LEADERBOARD_PREFIX}:${mode}:${difficulty}`;
}


function renderLeaderboard(mode, difficulty) {
  const entries = loadLeaderboard(mode, difficulty);
  const selectedHighlight = game.lastSavedEntryId && mode === game.session.mode && difficulty === game.session.difficulty
    ? game.lastSavedEntryId
    : null;

  leaderboardListEls.forEach(list => {
    list.innerHTML = '';

    if (!entries.length) {
      list.innerHTML = `
        <li class="empty-rank">
          <strong>暂无记录</strong>
          <span>输入昵称并开始一局后，当前模式与难度的成绩会写入这里。</span>
        </li>
      `;
      return;
    }

    entries.forEach((entry, index) => {
      const li = document.createElement('li');
      li.className = `leaderboard-item${entry.id === selectedHighlight ? ' current' : ''}`;
      li.innerHTML = `
        <span class="rank-index">${index + 1}</span>
        <span class="rank-meta">
          <strong>${entry.name || '玩家'}</strong>
          <span>${entry.date} · ${entry.lines} 行 · ${entry.modeLabel}</span>
          ${entry.id === selectedHighlight ? '<span class="rank-badge">当前成绩</span>' : ''}
        </span>
        <span class="rank-score">${entry.score}</span>
      `;
      list.appendChild(li);
    });

    const current = list.querySelector('.leaderboard-item.current');
    if (current) {
      current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  });
}

function loadLeaderboard(mode, difficulty) {
  try {
    const raw = localStorage.getItem(leaderboardStorageKey(mode, difficulty));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function clearCurrentLeaderboard() {
  const { mode, difficulty } = getSelectedSettings();
  localStorage.removeItem(leaderboardStorageKey(mode, difficulty));
  if (game.session.mode === mode && game.session.difficulty === difficulty) {
    game.lastSavedEntryId = null;
  }
  renderLeaderboard(mode, difficulty);
}

function saveLeaderboardEntry() {
  const mode = game.session.mode;
  const difficulty = game.session.difficulty;
  const entries = loadLeaderboard(mode, difficulty);
  const entry = {
    id: `${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    name: getPlayerName(),
    score: game.score,
    lines: game.lines,
    date: new Date().toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
    modeLabel: MODE_DEFS[mode].label
  };

  entries.push(entry);
  entries.sort((a, b) => b.score - a.score);
  const trimmed = entries.slice(0, 20);

  localStorage.setItem(leaderboardStorageKey(mode, difficulty), JSON.stringify(trimmed));
  game.lastSavedEntryId = trimmed.some(item => item.id === entry.id) ? entry.id : null;
  renderLeaderboard(getControlValue('mode'), getControlValue('difficulty'));
}


function setActionText(text) {
  game.actionText = text;
  setFieldText('action', text);
}

function showToast(title, subtitle = '') {
  toastEls.forEach(toast => {
    toast.innerHTML = subtitle
      ? `<strong>${title}</strong><span>${subtitle}</span>`
      : `<strong>${title}</strong>`;
    toast.classList.remove('show');
    void toast.offsetWidth;
    toast.classList.add('show');
  });

  clearTimeout(game.toastTimer);
  game.toastTimer = setTimeout(() => {
    toastEls.forEach(toast => toast.classList.remove('show'));
  }, 1100);
}

function showBoardBanner(title, subtitle = '', tone = 'accent', duration = 1500) {
  boardBannerEls.forEach(banner => {
    banner.className = `board-banner ${tone}`;
    banner.innerHTML = subtitle
      ? `<strong>${title}</strong><span>${subtitle}</span>`
      : `<strong>${title}</strong>`;
    banner.classList.remove('show');
    void banner.offsetWidth;
    banner.classList.add('show');
  });

  clearTimeout(game.bannerTimer);
  game.bannerTimer = setTimeout(() => {
    boardBannerEls.forEach(banner => banner.classList.remove('show'));
  }, duration);
}

function setBoardDanger(isDanger) {
  boardFrameEls.forEach(frame => frame.classList.toggle('danger', isDanger));
}


function hideMobileStartHint() {
  mobileHintEls.forEach(hint => {
    hint.classList.remove('show');
    hint.setAttribute('aria-hidden', 'true');
  });
  clearTimeout(game.mobileHintTimer);
}

function showMobileStartHint() {
  const visibleHint = mobileHintEls.find(hint => hint.offsetParent !== null);
  if (!visibleHint) return;

  clearTimeout(game.mobileHintTimer);
  visibleHint.classList.add('show');
  visibleHint.setAttribute('aria-hidden', 'false');
  game.mobileHintTimer = setTimeout(() => {
    visibleHint.classList.remove('show');
    visibleHint.setAttribute('aria-hidden', 'true');
  }, 5000);
}

function getAudioContext() {
  if (!game.settings.sound) return null;
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return null;

  if (!sound.ctx) {
    sound.ctx = new AudioCtor();
  }

  if (sound.ctx.state === 'suspended') {
    sound.ctx.resume();
  }

  return sound.ctx;
}

function playTone({ freq = 440, duration = 0.08, type = 'triangle', volume = 0.04, slideTo = null, when = 0 }) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const startTime = ctx.currentTime + when;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, startTime);
  if (slideTo) {
    oscillator.frequency.exponentialRampToValueAtTime(slideTo, startTime + duration);
  }

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.02);
}

function playSound(name) {
  if (!game.settings.sound) return;

  if (name === 'start') {
    playTone({ freq: 392, duration: 0.07, when: 0 });
    playTone({ freq: 523, duration: 0.08, when: 0.08 });
  } else if (name === 'rotate') {
    playTone({ freq: 600, duration: 0.04, volume: 0.025 });
  } else if (name === 'hold') {
    playTone({ freq: 320, duration: 0.05, volume: 0.03 });
    playTone({ freq: 450, duration: 0.06, volume: 0.03, when: 0.04 });
  } else if (name === 'drop') {
    playTone({ freq: 220, duration: 0.08, type: 'square', volume: 0.035, slideTo: 120 });
  } else if (name === 'clear') {
    playTone({ freq: 520, duration: 0.06, when: 0 });
    playTone({ freq: 700, duration: 0.08, when: 0.07 });
  } else if (name === 'power') {
    playTone({ freq: 440, duration: 0.07, when: 0, volume: 0.045 });
    playTone({ freq: 660, duration: 0.08, when: 0.08, volume: 0.045 });
    playTone({ freq: 880, duration: 0.1, when: 0.16, volume: 0.05 });
  } else if (name === 'stage') {
    playTone({ freq: 392, duration: 0.06, when: 0 });
    playTone({ freq: 523, duration: 0.06, when: 0.08 });
    playTone({ freq: 659, duration: 0.1, when: 0.16 });
  } else if (name === 'lose') {
    playTone({ freq: 320, duration: 0.08, when: 0, slideTo: 220 });
    playTone({ freq: 220, duration: 0.12, when: 0.12, slideTo: 120 });
  }
}

function vibrate(pattern) {
  if (!game.settings.haptics) return;
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

function seedGarbageRows(count) {
  if (count <= 0) return;

  for (let i = 0; i < count; i += 1) {
    addGarbageRow(DIFFICULTY_DEFS[game.session.difficulty].holes);
  }
}

function addGarbageRow(holeCount = 1) {
  const row = Array(COLS).fill(GARBAGE_VALUE);
  const holes = new Set();

  while (holes.size < holeCount) {
    holes.add(Math.floor(Math.random() * COLS));
  }

  holes.forEach(index => {
    row[index] = 0;
  });

  const removedTopRow = game.board.shift();
  game.board.push(row);

  if (removedTopRow && removedTopRow.some(cell => cell !== 0)) {
    finishGame();
  }
}


function resetGameState() {
  game.settings = getSelectedSettings();
  game.session = {
    mode: game.settings.mode,
    difficulty: game.settings.difficulty,
    timeLeft: game.settings.mode === 'score_attack' ? SCORE_ATTACK_DURATION : null,
    stage: 1,
    stageLines: 0,
    warning30Shown: false,
    warning10Shown: false,
    lastCountdownMark: null
  };

  game.board = createEmptyBoard();
  seedGarbageRows(DIFFICULTY_DEFS[game.session.difficulty].garbageRows);
  game.current = null;
  game.queue = [];
  game.holdKind = null;
  game.holdUsed = false;
  game.score = 0;
  game.lines = 0;
  game.level = 1;
  game.combo = -1;
  game.backToBack = 0;
  game.dropCounter = 0;
  game.currentLanded = false;
  game.lockTimer = 0;
  game.lockResetCount = 0;
  game.lineClearAnimation = null;
  game.lockFlash = null;
  game.lastSavedEntryId = null;
  setBoardDanger(false);
  setActionText('READY');
  refillQueue();
  updateDropInterval();
  spawnNextPiece();
  setState('playing');
  updateStats();
  updateModeMeta();
  playSound('start');
  showBoardBanner('READY', MODE_DEFS[game.session.mode].label, 'accent', 900);
  showMobileStartHint();
  render();
}

function updateDropInterval() {
  const difficulty = DIFFICULTY_DEFS[game.session.difficulty];
  const base = 950 / difficulty.speed;
  const stageBoost = game.session.mode === 'stage' ? (game.session.stage - 1) * 40 : 0;
  const scoreAttackBoost = game.session.mode === 'score_attack' ? 25 : 0;

  game.dropInterval = Math.max(
    90,
    Math.round(base - (game.level - 1) * 70 - stageBoost - scoreAttackBoost)
  );
}

function spawnNextPiece(kindOverride = null) {
  refillQueue();
  const kind = kindOverride || game.queue.shift();
  game.current = createPiece(kind);
  game.holdUsed = false;
  game.currentLanded = false;
  game.lockTimer = 0;
  game.lockResetCount = 0;
  syncGroundedState(false);

  if (collides(game.board, game.current.matrix, game.current.pos)) {
    finishGame();
  }
}


function setState(nextState) {
  game.state = nextState;
  const stateLabel = ({ idle: '待机', playing: '进行中', paused: '暂停', gameover: '结束' })[nextState];

  statePills.forEach(pill => {
    pill.textContent = stateLabel;
    pill.className = `state-pill ${nextState}`;
  });

  if (nextState === 'idle') {
    overlays.forEach(overlay => {
      overlay.root.classList.add('visible');
      overlay.kicker.textContent = '准备';
      overlay.title.textContent = '点击开始';
      overlay.desc.textContent = '';
    });
    hideMobileStartHint();
    setBoardDanger(false);
  } else if (nextState === 'paused') {
    overlays.forEach(overlay => {
      overlay.root.classList.add('visible');
      overlay.kicker.textContent = '';
      overlay.title.textContent = '已暂停';
      overlay.desc.textContent = '';
    });
    hideMobileStartHint();
  } else if (nextState === 'gameover') {
    overlays.forEach(overlay => {
      overlay.root.classList.add('visible');
      overlay.kicker.textContent = '';
      overlay.title.textContent = '游戏结束';
      overlay.desc.textContent = `得分 ${game.score}`;
    });
    hideMobileStartHint();
    setBoardDanger(false);
  } else {
    overlays.forEach(overlay => overlay.root.classList.remove('visible'));
  }

  const startLabel = nextState === 'playing'
    ? '暂停'
    : nextState === 'paused'
      ? '继续'
      : nextState === 'gameover'
        ? '开始新局'
        : '开始游戏';

  startPauseButtons.forEach(button => {
    button.textContent = startLabel;
  });
}

function formatTime(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}


function updateModeMeta() {
  const activeMode = game.state === 'playing' || game.state === 'paused' || game.state === 'gameover'
    ? game.session.mode
    : getControlValue('mode');

  const activeDifficulty = game.state === 'playing' || game.state === 'paused' || game.state === 'gameover'
    ? game.session.difficulty
    : getControlValue('difficulty');

  const modeLabel = MODE_DEFS[activeMode].label;
  const difficultyLabel = DIFFICULTY_DEFS[activeDifficulty].label;

  let extra = '';
  if (activeMode === 'stage') {
    const stage = game.session.stage || 1;
    const progress = game.session.stageLines || 0;
    extra = `｜第 ${stage} 关 · ${progress}/10 行`;
  } else if (activeMode === 'score_attack') {
    extra = `｜剩余 ${formatTime(game.session.timeLeft ?? SCORE_ATTACK_DURATION)}`;
  }

  modeMetaEls.forEach(element => {
    element.textContent = `${modeLabel} · ${difficultyLabel}${extra}`;
  });
}

function updateStats() {
  setFieldText('score', game.score);
  setFieldText('lines', game.lines);
  setFieldText('level', game.level);
  setFieldText('best', game.best);
  setFieldText('combo', Math.max(0, game.combo));
  setFieldText('b2b', game.backToBack);
  setFieldText('action', game.actionText);
  updateModeMeta();
}

function collides(board, matrix, pos) {
  for (let y = 0; y < matrix.length; y += 1) {
    for (let x = 0; x < matrix[y].length; x += 1) {
      const value = matrix[y][x];
      if (!value) continue;

      const boardX = x + pos.x;
      const boardY = y + pos.y;

      if (boardX < 0 || boardX >= COLS || boardY >= ROWS) {
        return true;
      }

      if (boardY >= 0 && board[boardY][boardX] !== 0) {
        return true;
      }
    }
  }
  return false;
}

function canControlCurrent() {
  return game.state === 'playing' && !!game.current && !game.lineClearAnimation;
}

function getPieceCells(piece) {
  const cells = [];
  piece.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (!value) return;
      const boardX = x + piece.pos.x;
      const boardY = y + piece.pos.y;
      if (boardY >= 0) {
        cells.push({ x: boardX, y: boardY, color: VALUE_TO_COLOR[value] });
      }
    });
  });
  return cells;
}

function mergePiece() {
  game.current.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (!value) return;
      const boardY = y + game.current.pos.y;
      const boardX = x + game.current.pos.x;
      if (boardY >= 0) {
        game.board[boardY][boardX] = value;
      }
    });
  });
}

function getFullRows() {
  const rows = [];
  for (let y = 0; y < ROWS; y += 1) {
    if (game.board[y].every(cell => cell !== 0)) {
      rows.push(y);
    }
  }
  return rows;
}

function removeRows(rows) {
  const rowSet = new Set(rows);
  game.board = game.board.filter((_, index) => !rowSet.has(index));
  while (game.board.length < ROWS) {
    game.board.unshift(Array(COLS).fill(0));
  }
}

function detectTSpin() {
  if (!game.current || game.current.kind !== 'T' || game.current.lastMove !== 'rotate') {
    return false;
  }

  const centerX = game.current.pos.x + 1;
  const centerY = game.current.pos.y + 1;
  const corners = [
    { x: centerX - 1, y: centerY - 1 },
    { x: centerX + 1, y: centerY - 1 },
    { x: centerX - 1, y: centerY + 1 },
    { x: centerX + 1, y: centerY + 1 }
  ];

  let occupiedCorners = 0;
  corners.forEach(corner => {
    if (
      corner.x < 0 ||
      corner.x >= COLS ||
      corner.y >= ROWS ||
      corner.y < 0 ||
      game.board[corner.y][corner.x] !== 0
    ) {
      occupiedCorners += 1;
    }
  });

  return occupiedCorners >= 3;
}


function applyModeProgress(cleared) {
  if (game.session.mode !== 'stage' || cleared <= 0) return;

  game.session.stageLines += cleared;
  while (game.session.stageLines >= 10) {
    game.session.stageLines -= 10;
    game.session.stage += 1;
    addGarbageRow(Math.max(1, DIFFICULTY_DEFS[game.session.difficulty].holes - 1));
    showToast(`STAGE ${game.session.stage}`, '速度提升 · 障碍追加');
    showBoardBanner(`LEVEL ${game.level}`, `进入第 ${game.session.stage} 关`, 'accent', 1500);
    playSound('stage');
    vibrate([18, 20, 18]);
  }
}

function applyScoring({ cleared, tSpin }) {
  let baseScore = 0;
  let difficultClear = false;
  let label = cleared > 0 ? CLEAR_LABELS[cleared] : 'LOCK';
  const previousLevel = game.level;

  if (tSpin) {
    baseScore = TSPIN_CLEAR_SCORES[cleared] * game.level;
    label = TSPIN_LABELS[cleared];
    difficultClear = cleared > 0;
  } else {
    baseScore = CLASSIC_CLEAR_SCORES[cleared] * game.level;
    difficultClear = cleared === 4;
  }

  if (cleared > 0) {
    game.lines += cleared;
    game.level = Math.floor(game.lines / 10) + 1;
    game.combo += 1;
    applyModeProgress(cleared);
  } else {
    game.combo = -1;
  }

  updateDropInterval();

  let b2bBonus = 0;
  if (difficultClear) {
    if (game.backToBack > 0) {
      b2bBonus = Math.floor(baseScore * 0.5);
    }
    game.backToBack += 1;
  } else if (cleared > 0) {
    game.backToBack = 0;
  }

  const comboBonus = cleared > 0 && game.combo > 0
    ? game.combo * 50 * game.level
    : 0;

  game.score += baseScore + b2bBonus + comboBonus;
  saveBestScore();

  const labelParts = [];
  labelParts.push(tSpin || cleared > 0 ? label : 'LOCK');
  if (b2bBonus > 0) labelParts.push(`B2B x${game.backToBack}`);
  if (comboBonus > 0) labelParts.push(`Combo x${game.combo}`);
  setActionText(labelParts.join(' • '));

  if (cleared > 0 || tSpin) {
    const toastSubtitle = [
      b2bBonus > 0 ? `Back-to-Back x${game.backToBack}` : '',
      comboBonus > 0 ? `Combo x${game.combo}` : ''
    ].filter(Boolean).join(' · ');

    showToast(label, toastSubtitle || `${baseScore + b2bBonus + comboBonus} 分`);
    if (tSpin || cleared === 4) {
      playSound('power');
      vibrate([20, 30, 20]);
    } else {
      playSound('clear');
      vibrate(20);
    }
  }

  if (game.level > previousLevel) {
    showBoardBanner(`LEVEL ${game.level}`, '速度提升', 'accent', 1400);
    playSound('stage');
  }
}

function beginLockDelay() {
  if (!game.current) return;
  if (!game.currentLanded) {
    game.currentLanded = true;
    game.lockTimer = 0;
  }
}

function syncGroundedState(canResetTimer) {
  if (!game.current) return;

  const grounded = collides(
    game.board,
    game.current.matrix,
    { x: game.current.pos.x, y: game.current.pos.y + 1 }
  );

  if (!grounded) {
    game.currentLanded = false;
    game.lockTimer = 0;
    return;
  }

  if (!game.currentLanded) {
    game.currentLanded = true;
    game.lockTimer = 0;
    return;
  }

  if (canResetTimer && game.lockResetCount < LOCK_RESET_LIMIT) {
    game.lockResetCount += 1;
    game.lockTimer = 0;
  }
}

function movePiece(direction) {
  if (!canControlCurrent()) return false;

  game.current.pos.x += direction;
  if (collides(game.board, game.current.matrix, game.current.pos)) {
    game.current.pos.x -= direction;
    return false;
  }

  game.current.lastMove = 'move';
  syncGroundedState(true);
  render();
  return true;
}

function rotateMatrix(matrix) {
  const rotated = cloneMatrix(matrix);
  for (let y = 0; y < rotated.length; y += 1) {
    for (let x = 0; x < y; x += 1) {
      [rotated[x][y], rotated[y][x]] = [rotated[y][x], rotated[x][y]];
    }
  }
  rotated.forEach(row => row.reverse());
  return rotated;
}

function rotateCurrent() {
  if (!canControlCurrent()) return false;

  const rotated = rotateMatrix(game.current.matrix);
  const kicks = [0, -1, 1, -2, 2];

  for (const offset of kicks) {
    const nextPos = { x: game.current.pos.x + offset, y: game.current.pos.y };
    if (!collides(game.board, rotated, nextPos)) {
      game.current.matrix = rotated;
      game.current.pos = nextPos;
      game.current.lastMove = 'rotate';
      syncGroundedState(true);
      playSound('rotate');
      render();
      return true;
    }
  }
  return false;
}

function stepDown(source = 'gravity') {
  if (!canControlCurrent()) return false;

  game.current.pos.y += 1;
  if (collides(game.board, game.current.matrix, game.current.pos)) {
    game.current.pos.y -= 1;
    beginLockDelay();
    return false;
  }

  if (source === 'soft') {
    game.score += 1;
    saveBestScore();
    updateStats();
  }

  game.current.lastMove = 'drop';
  game.dropCounter = 0;
  syncGroundedState(false);
  render();
  return true;
}

function createLockFlash(cells) {
  game.lockFlash = {
    cells,
    elapsed: 0,
    duration: LOCK_FLASH_DURATION
  };
}

function finalizeLock() {
  if (!game.current) return;

  const tSpin = detectTSpin();
  const lockedCells = getPieceCells(game.current);
  mergePiece();
  createLockFlash(lockedCells);

  const rowsToClear = getFullRows();
  game.current = null;
  game.currentLanded = false;
  game.lockTimer = 0;
  game.lockResetCount = 0;

  if (rowsToClear.length > 0) {
    game.lineClearAnimation = {
      rows: rowsToClear,
      tSpin,
      elapsed: 0,
      duration: LINE_CLEAR_DURATION
    };
  } else {
    applyScoring({ cleared: 0, tSpin });
    spawnNextPiece();
  }

  updateStats();
  render();
}

function softDrop() {
  if (!canControlCurrent()) return false;
  return stepDown('soft');
}

function hardDrop() {
  if (!canControlCurrent()) return;

  let distance = 0;
  while (!collides(game.board, game.current.matrix, { x: game.current.pos.x, y: game.current.pos.y + 1 })) {
    game.current.pos.y += 1;
    distance += 1;
  }

  game.score += distance * 2;
  saveBestScore();
  updateStats();
  playSound('drop');
  vibrate(12);
  finalizeLock();
  game.dropCounter = 0;
}

function holdCurrent() {
  if (!canControlCurrent() || game.holdUsed) return;

  const outgoingKind = game.current.kind;
  if (!game.holdKind) {
    game.holdKind = outgoingKind;
    spawnNextPiece();
  } else {
    const incomingKind = game.holdKind;
    game.holdKind = outgoingKind;
    spawnNextPiece(incomingKind);
  }

  game.holdUsed = true;
  setActionText('HOLD');
  showToast('HOLD');
  playSound('hold');
  vibrate(10);
  updateStats();
  render();
}

function finishGame() {
  if (game.state === 'gameover') return;
  saveBestScore();
  saveLeaderboardEntry();
  playSound('lose');
  vibrate([30, 30, 30]);
  updateStats();
  setState('gameover');
  render();
}

function startOrPause() {
  if (game.state === 'idle' || game.state === 'gameover') {
    resetGameState();
  } else if (game.state === 'playing') {
    setState('paused');
  } else if (game.state === 'paused') {
    setState('playing');
    game.dropCounter = 0;
    game.lockTimer = 0;
  }
}

function restartGame() {
  resetGameState();
}

function getGhostPosition() {
  const ghost = { x: game.current.pos.x, y: game.current.pos.y };
  while (!collides(game.board, game.current.matrix, { x: ghost.x, y: ghost.y + 1 })) {
    ghost.y += 1;
  }
  return ghost;
}

function resizeCanvas(canvas, ctx) {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.round(rect.width * ratio));
  const height = Math.max(1, Math.round(rect.height * ratio));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawRoundedBlock(ctx, x, y, size, color, alpha = 1) {
  const inset = size * 0.08;
  const width = size - inset * 2;
  const radius = Math.max(4, size * 0.16);

  ctx.save();
  ctx.globalAlpha = alpha;

  ctx.fillStyle = color;
  roundedRect(ctx, x + inset, y + inset, width, width, radius);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  roundedRect(ctx, x + inset, y + inset, width, width * 0.42, radius);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = Math.max(1, size * 0.05);
  roundedRect(ctx, x + inset, y + inset, width, width, radius);
  ctx.stroke();
  ctx.restore();
}


function drawBoardBackground(canvas, ctx) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const cell = width / COLS;

  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#0d1528');
  gradient.addColorStop(1, '#09101c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;

  for (let x = 0; x <= COLS; x += 1) {
    ctx.beginPath();
    ctx.moveTo(x * cell + 0.5, 0);
    ctx.lineTo(x * cell + 0.5, height);
    ctx.stroke();
  }

  for (let y = 0; y <= ROWS; y += 1) {
    ctx.beginPath();
    ctx.moveTo(0, y * cell + 0.5);
    ctx.lineTo(width, y * cell + 0.5);
    ctx.stroke();
  }
}

function drawMatrix(ctx, matrix, offset, cell, options = {}) {
  const alpha = options.alpha ?? 1;
  const ghost = options.ghost ?? false;

  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (!value) return;
      const drawX = (x + offset.x) * cell;
      const drawY = (y + offset.y) * cell;

      if (drawY + cell <= 0) return;

      if (ghost) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.setLineDash([6, 6]);
        ctx.strokeRect(drawX + cell * 0.18, drawY + cell * 0.18, cell * 0.64, cell * 0.64);
        ctx.restore();
        return;
      }

      drawRoundedBlock(ctx, drawX, drawY, cell, VALUE_TO_COLOR[value], alpha);
    });
  });
}


function drawLineClearAnimation(ctx, canvas, cell) {
  if (!game.lineClearAnimation) return;

  const width = canvas.clientWidth;
  const progress = Math.min(1, game.lineClearAnimation.elapsed / game.lineClearAnimation.duration);
  const bandWidth = width * (1 - progress * 0.88);
  const bandX = (width - bandWidth) / 2;

  game.lineClearAnimation.rows.forEach(rowIndex => {
    const y = rowIndex * cell;
    ctx.save();
    ctx.globalAlpha = 0.28 + Math.sin(progress * Math.PI) * 0.42;
    const gradient = ctx.createLinearGradient(bandX, y, bandX + bandWidth, y);
    gradient.addColorStop(0, 'rgba(255,255,255,0)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.92)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(bandX, y + cell * 0.08, bandWidth, cell * 0.84);
    ctx.restore();
  });
}

function drawLockFlash(ctx, cell) {
  if (!game.lockFlash) return;

  const progress = Math.min(1, game.lockFlash.elapsed / game.lockFlash.duration);
  const alpha = 0.45 * (1 - progress);
  const glowSize = cell * (0.22 + progress * 0.42);

  game.lockFlash.cells.forEach(({ x, y, color }) => {
    const left = x * cell;
    const top = y * cell;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    roundedRect(
      ctx,
      left - glowSize * 0.16,
      top - glowSize * 0.16,
      cell + glowSize * 0.32,
      cell + glowSize * 0.32,
      cell * 0.2
    );
    ctx.fill();
    ctx.restore();
  });
}


function renderPreview(canvas, ctx, kind) {
  if (!canvas || canvas.clientWidth === 0 || canvas.clientHeight === 0) return;
  resizeCanvas(canvas, ctx);
  const size = canvas.clientWidth;
  ctx.clearRect(0, 0, size, size);

  const bg = ctx.createLinearGradient(0, 0, 0, size);
  bg.addColorStop(0, 'rgba(255,255,255,0.06)');
  bg.addColorStop(1, 'rgba(255,255,255,0.02)');
  ctx.fillStyle = bg;
  roundedRect(ctx, 0, 0, size, size, 16);
  ctx.fill();

  if (!kind) return;

  const matrix = PIECE_DEFS[kind].matrix;
  const cell = size / PREVIEW_GRID;
  const bounds = getActiveBounds(matrix);
  const offsetX = (PREVIEW_GRID - bounds.width) / 2 - bounds.minX;
  const offsetY = (PREVIEW_GRID - bounds.height) / 2 - bounds.minY;

  drawMatrix(ctx, matrix, { x: offsetX, y: offsetY }, cell);
}

function getActiveBounds(matrix) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (!value) return;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });
  });

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1
  };
}


function render() {
  boardViews.forEach(({ canvas, ctx }) => {
    if (!canvas || canvas.clientWidth === 0 || canvas.clientHeight === 0) return;

    resizeCanvas(canvas, ctx);
    drawBoardBackground(canvas, ctx);

    const cell = canvas.clientWidth / COLS;
    drawMatrix(ctx, game.board, { x: 0, y: 0 }, cell);

    if (game.current) {
      const ghostPos = getGhostPosition();
      drawMatrix(ctx, game.current.matrix, ghostPos, cell, { ghost: true });
      drawMatrix(ctx, game.current.matrix, game.current.pos, cell);
    }

    drawLineClearAnimation(ctx, canvas, cell);
    drawLockFlash(ctx, cell);
  });

  previewViews.next.forEach(({ canvas, ctx }) => renderPreview(canvas, ctx, game.queue[0]));
  previewViews.hold.forEach(({ canvas, ctx }) => renderPreview(canvas, ctx, game.holdKind));
}

function processLineClearAnimation(delta) {
  if (!game.lineClearAnimation) return false;

  game.lineClearAnimation.elapsed += delta;
  if (game.lineClearAnimation.elapsed >= game.lineClearAnimation.duration) {
    const clearedRows = game.lineClearAnimation.rows;
    const tSpin = game.lineClearAnimation.tSpin;
    removeRows(clearedRows);
    applyScoring({ cleared: clearedRows.length, tSpin });
    game.lineClearAnimation = null;
    spawnNextPiece();
    updateStats();
  }
  return true;
}

function processLockFlash(delta) {
  if (!game.lockFlash) return;
  game.lockFlash.elapsed += delta;
  if (game.lockFlash.elapsed >= game.lockFlash.duration) {
    game.lockFlash = null;
  }
}


function tick(time = 0) {
  const delta = time - game.lastTime;
  game.lastTime = time;

  processLockFlash(delta);

  if (game.state === 'playing') {
    if (game.session.mode === 'score_attack') {
      game.session.timeLeft -= delta;
      if (game.session.timeLeft <= 30000 && !game.session.warning30Shown) {
        game.session.warning30Shown = true;
        showBoardBanner('30 秒', '冲分进入后半段', 'warning', 1200);
      }
      if (game.session.timeLeft <= 10000 && !game.session.warning10Shown) {
        game.session.warning10Shown = true;
        showBoardBanner('倒计时 10 秒', '准备收尾', 'danger', 1200);
      }

      const countdownMark = Math.ceil(game.session.timeLeft / 1000);
      if (countdownMark <= 5 && countdownMark > 0 && countdownMark !== game.session.lastCountdownMark) {
        game.session.lastCountdownMark = countdownMark;
        showBoardBanner(String(countdownMark), '加速冲分', 'danger', 700);
      }

      setBoardDanger(game.session.timeLeft <= 10000 && game.session.timeLeft > 0);

      if (game.session.timeLeft <= 0) {
        game.session.timeLeft = 0;
        updateStats();
        finishGame();
      }
    } else {
      setBoardDanger(false);
    }

    if (processLineClearAnimation(delta)) {
      updateStats();
      render();
      requestAnimationFrame(tick);
      return;
    }

    if (game.current) {
      if (game.currentLanded) {
        game.lockTimer += delta;
        if (game.lockTimer >= LOCK_DELAY) {
          finalizeLock();
        }
      } else {
        game.dropCounter += delta;
        if (game.dropCounter >= game.dropInterval) {
          stepDown('gravity');
        }
      }
    }

    updateStats();
  }

  render();
  requestAnimationFrame(tick);
}


function bindBoardGestures() {
  boardViews.forEach(({ canvas }) => {
    canvas.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse') return;
      event.preventDefault();
      if (!canControlCurrent()) return;

      gesture.active = true;
      gesture.pointerId = event.pointerId;
      gesture.startX = event.clientX;
      gesture.startY = event.clientY;
      gesture.horizontalSteps = 0;
      gesture.moved = false;

      canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener('pointermove', event => {
      if (!gesture.active || event.pointerId !== gesture.pointerId) return;
      event.preventDefault();
      if (!canControlCurrent()) return;

      const dx = event.clientX - gesture.startX;
      const dy = event.clientY - gesture.startY;
      if (Math.abs(dx) <= Math.abs(dy) * 0.8) return;

      const stepThreshold = Math.max(24, canvas.clientWidth / COLS * 0.82);
      const nextStep = Math.trunc(dx / stepThreshold);

      while (nextStep > gesture.horizontalSteps) {
        if (!movePiece(1)) break;
        gesture.horizontalSteps += 1;
        gesture.moved = true;
      }

      while (nextStep < gesture.horizontalSteps) {
        if (!movePiece(-1)) break;
        gesture.horizontalSteps -= 1;
        gesture.moved = true;
      }
    });

    const finishGesture = event => {
      if (!gesture.active || event.pointerId !== gesture.pointerId) return;
      event.preventDefault();

      const dx = event.clientX - gesture.startX;
      const dy = event.clientY - gesture.startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      const tapThreshold = 16;
      const verticalDominant = absY > absX * 1.15;

      if (canControlCurrent()) {
        if (!gesture.moved && absX < tapThreshold && absY < tapThreshold) {
          holdCurrent();
        } else if (verticalDominant && dy < -34) {
          rotateCurrent();
        } else if (verticalDominant && dy > 76) {
          hardDrop();
        } else if (verticalDominant && dy > 26) {
          softDrop();
        }
      }

      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }

      gesture.active = false;
      gesture.pointerId = null;
    };

    canvas.addEventListener('pointerup', finishGesture);
    canvas.addEventListener('pointercancel', finishGesture);
  });
}


function bindControls() {
  startPauseButtons.forEach(button => {
    button.addEventListener('click', startOrPause);
  });

  restartButtons.forEach(button => {
    button.addEventListener('click', restartGame);
  });

  Object.entries(controls).forEach(([name, elements]) => {
    elements.forEach(element => {
      element.addEventListener('change', () => {
        const value = isCheckboxControl(element) ? element.checked : element.value;
        setControlValue(name, value);
        applySettingsFromInputs();
      });
    });
  });

  leaderboardNameInputs.forEach(input => {
    input.addEventListener('input', () => {
      const sanitized = input.value.replace(/\s+/g, ' ').trim().slice(0, 10) || '玩家';
      setPlayerNameInputs(sanitized);
      savePlayerName(sanitized);
    });
  });

  clearLeaderboardButtons.forEach(button => {
    button.addEventListener('click', () => {
      const { mode, difficulty } = getSelectedSettings();
      const label = `${MODE_DEFS[mode].label} · ${DIFFICULTY_DEFS[difficulty].label}`;
      if (window.confirm(`确定清空 ${label} 的本地排行榜吗？`)) {
        clearCurrentLeaderboard();
      }
    });
  });

  document.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();
    const controlKeys = ['arrowleft', 'arrowright', 'arrowdown', 'arrowup', ' ', 'x', 'c', 'shift', 'p', 'enter'];

    if (controlKeys.includes(key) || event.key === ' ') {
      event.preventDefault();
    }

    if ((game.state === 'idle' || game.state === 'gameover') && (key === ' ' || key === 'enter')) {
      startOrPause();
      return;
    }

    if (key === 'p') {
      if (game.state === 'playing' || game.state === 'paused') {
        startOrPause();
      }
      return;
    }

    if (!canControlCurrent()) return;

    if (event.key === 'ArrowLeft') movePiece(-1);
    else if (event.key === 'ArrowRight') movePiece(1);
    else if (event.key === 'ArrowDown') softDrop();
    else if (event.key === 'ArrowUp' || key === 'x') rotateCurrent();
    else if (event.key === ' ') hardDrop();
    else if (key === 'c' || key === 'shift') holdCurrent();
  }, { passive: false });

  touchBindings.forEach(([id, handler]) => {
    const button = document.getElementById(id);
    if (!button) return;

    button.addEventListener('pointerdown', event => {
      event.preventDefault();
      if (!canControlCurrent()) return;
      handler();
    });
  });

  bindBoardGestures();
  window.addEventListener('resize', render);
}


function init() {
  const playerName = loadPlayerName();
  setPlayerNameInputs(playerName);
  savePlayerName(playerName);
  setControlValue('mode', 'marathon');
  setControlValue('difficulty', 'normal');
  setControlValue('sound', true);
  setControlValue('haptics', true);
  applySettingsFromInputs();
  updateStats();
  setActionText('READY');
  setState('idle');
  bindControls();
  render();
  requestAnimationFrame(tick);
}

init();
