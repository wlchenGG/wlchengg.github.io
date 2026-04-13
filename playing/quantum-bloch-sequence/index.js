(() => {
  const TAU = Math.PI * 2;
  const EPS = 1e-9;
  const VERSION = 'v0.6.0';
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  const $ = (id) => document.getElementById(id);
  const canvas = $('scene');
  const ctx = canvas.getContext('2d');
  const offlineModeBtn = $('offlineModeBtn');
  const onlineModeBtn = $('onlineModeBtn');
  const viewerStatus = $('viewerStatus');
  const onlineFrame = $('onlineFrame');

  const qubitCountSelect = $('qubitCountSelect');
  const displayQubitSelect = $('displayQubitSelect');
  const targetQubitSelect = $('targetQubitSelect');
  const controlQubitSelect = $('controlQubitSelect');
  const secondQubitSelect = $('secondQubitSelect');
  const anglePiInput = $('anglePiInput');
  const angleDegreeValue = $('angleDegreeValue');
  const singleGateButtons = $('singleGateButtons');
  const twoQubitGateButtons = $('twoQubitGateButtons');

  const playBtn = $('playBtn');
  const stepBtn = $('stepBtn');
  const prevBtn = $('prevBtn');
  const resetBtn = $('resetBtn');
  const clearBtn = $('clearBtn');
  const measureSelectedBtn = $('measureSelectedBtn');
  const measureAllBtn = $('measureAllBtn');
  const speedInput = $('speedInput');
  const speedValue = $('speedValue');

  const gateExplainTitle = $('gateExplainTitle');
  const gateExplainFormula = $('gateExplainFormula');
  const gateExplainBody = $('gateExplainBody');
  const explainTitle = $('explainTitle');
  const explainText = $('explainText');

  const stepValue = $('stepValue');
  const gateValue = $('gateValue');
  const dimensionValue = $('dimensionValue');
  const selectedQubitValue = $('selectedQubitValue');
  const p0Value = $('p0Value');
  const p1Value = $('p1Value');
  const purityValue = $('purityValue');
  const entanglementValue = $('entanglementValue');
  const thetaValue = $('thetaValue');
  const phiValue = $('phiValue');
  const stateText = $('stateText');
  const progressBar = $('progressBar');
  const qubitSummaryGrid = $('qubitSummaryGrid');
  const basisMeta = $('basisMeta');
  const basisChart = $('basisChart');
  const measurementStatus = $('measurementStatus');
  const measurementDetail = $('measurementDetail');

  const formulaStageLabel = $('formulaStageLabel');
  const formulaGateLabel = $('formulaGateLabel');
  const formulaMatrix = $('formulaMatrix');
  const formulaInputState = $('formulaInputState');
  const formulaOutputState = $('formulaOutputState');
  const selectedDensityMatrix = $('selectedDensityMatrix');
  const formulaNote = $('formulaNote');

  const testSummary = $('testSummary');
  const testList = $('testList');
  const circuitBoard = $('circuitBoard');

  const gateMeta = {
    init: {
      key: 'init',
      label: '初始态',
      formula: '|ψ⟩ = |0…0⟩',
      detail: '系统从 |0…0⟩ 出发。单量子位时，这等价于 Bloch 球北极；多量子位时，每个局部量子位初始也都是纯态 |0⟩。',
      short: '系统起点',
      arity: 0,
      kind: 'init',
    },
    X: { key: 'X', label: 'X', formula: 'X = [[0,1],[1,0]]', detail: '翻转 |0⟩ 与 |1⟩。在 Bloch 球上等价于绕 X 轴旋转 π。', short: '比特翻转', arity: 1, kind: 'single' },
    Y: { key: 'Y', label: 'Y', formula: 'Y = [[0,-i],[i,0]]', detail: '翻转并引入虚数相位，几何上是绕 Y 轴旋转 π。', short: '含相位翻转', arity: 1, kind: 'single' },
    Z: { key: 'Z', label: 'Z', formula: 'Z = [[1,0],[0,-1]]', detail: '不改测量概率，但改变相对相位。', short: '相位翻转', arity: 1, kind: 'single' },
    H: { key: 'H', label: 'H', formula: 'H = 1/√2 · [[1,1],[1,-1]]', detail: '把确定态推向叠加态；也是构造 Bell / GHZ 等纠缠电路的常见第一步。', short: '制造叠加', arity: 1, kind: 'single' },
    S: { key: 'S', label: 'S', formula: 'S = diag(1,i)', detail: '相位门 π/2。对 |1⟩ 分量乘上 i。', short: '相位 π/2', arity: 1, kind: 'single' },
    T: { key: 'T', label: 'T', formula: 'T = diag(1,e^{iπ/4})', detail: '更细粒度的相位门，常见于量子线路分解。', short: '相位 π/4', arity: 1, kind: 'single' },
    Rx: { key: 'Rx', label: 'Rx', formula: 'Rx(θ)=cos(θ/2)I-i sin(θ/2)X', detail: '连续绕 X 轴旋转。', short: 'X 轴旋转', arity: 1, kind: 'single', rotation: true },
    Ry: { key: 'Ry', label: 'Ry', formula: 'Ry(θ)=cos(θ/2)I-i sin(θ/2)Y', detail: '连续绕 Y 轴旋转。', short: 'Y 轴旋转', arity: 1, kind: 'single', rotation: true },
    Rz: { key: 'Rz', label: 'Rz', formula: 'Rz(θ)=diag(e^{-iθ/2}, e^{iθ/2})', detail: '连续绕 Z 轴旋转，主要改变量子相位。', short: 'Z 轴旋转', arity: 1, kind: 'single', rotation: true },
    CNOT: { key: 'CNOT', label: 'CNOT', formula: 'CNOT = [[1,0,0,0],[0,1,0,0],[0,0,0,1],[0,0,1,0]]', detail: '当控制位为 1 时翻转目标位，是最经典的双量子位门之一，用来制造纠缠。', short: '受控非门', arity: 2, kind: 'controlled' },
    CZ: { key: 'CZ', label: 'CZ', formula: 'CZ = diag(1,1,1,-1)', detail: '当控制位与目标位都为 1 时引入 -1 相位。', short: '受控相位', arity: 2, kind: 'controlled' },
    SWAP: { key: 'SWAP', label: 'SWAP', formula: 'SWAP = [[1,0,0,0],[0,0,1,0],[0,1,0,0],[0,0,0,1]]', detail: '交换两个量子位的局部状态。', short: '交换量子位', arity: 2, kind: 'swap' },
    MEASURE: { key: 'MEASURE', label: 'M', formula: 'P_m = |m⟩⟨m|（m ∈ {0,1}）', detail: '对某一条线路做投影测量。系统会按 Born 规则随机得到 0 或 1，并坍缩到对应子空间。后续门会基于坍缩后的全局态继续执行。', short: '单位测量', arity: 1, kind: 'measurement' },
    MEASURE_ALL: { key: 'MEASURE_ALL', label: 'M_all', formula: 'Π_x = |x⟩⟨x|', detail: '对全部量子位做计算基测量。系统会直接坍缩到某一个确定的基态 |x⟩。', short: '全量测量', arity: 0, kind: 'measurement-all' },
  };

  const singleGateOrder = ['X', 'Y', 'Z', 'H', 'S', 'T', 'Rx', 'Ry', 'Rz'];
  const twoQubitGateOrder = ['CNOT', 'CZ', 'SWAP'];

  const presets = {
    singleSuperposition: {
      qubits: 1,
      sequence: [{ key: 'H', target: 0 }],
    },
    singleSpiral: {
      qubits: 1,
      sequence: [{ key: 'H', target: 0 }, { key: 'Rz', target: 0, angle: Math.PI / 2 }, { key: 'Rx', target: 0, angle: Math.PI / 2 }],
    },
    bell: {
      qubits: 2,
      sequence: [{ key: 'H', target: 0 }, { key: 'CNOT', control: 0, target: 1 }],
    },
    swapDemo: {
      qubits: 2,
      sequence: [{ key: 'X', target: 0 }, { key: 'SWAP', a: 0, b: 1 }],
    },
    ghz: {
      qubits: 3,
      sequence: [{ key: 'H', target: 0 }, { key: 'CNOT', control: 0, target: 1 }, { key: 'CNOT', control: 0, target: 2 }],
    },
  };

  const state = {
    qubitCount: 1,
    selectedQubit: 0,
    sequence: [],
    snapshots: [],
    stepIndex: 0,
    playing: false,
    displayVector: vec(0, 1, 0),
    currentVector: vec(0, 1, 0),
    animation: {
      active: false,
      elapsed: 0,
      duration: Number(speedInput.value),
      startVector: vec(0, 1, 0),
      endVector: vec(0, 1, 0),
      startRadius: 1,
      endRadius: 1,
    },
    transition: null,
    camera: {
      yaw: 0.88,
      pitch: -0.46,
      zoom: 1.12,
      dragging: false,
      lastX: 0,
      lastY: 0,
    },
    onlineViewer: {
      mode: 'offline',
      ready: false,
      failed: false,
      lastSignature: '',
    },
  };

  let insertPopover = null;
  let insertTargetIndex = 0;
  let draggedStepIndex = null;

  function vec(x = 0, y = 0, z = 0) { return { x, y, z }; }
  function vClone(v) { return vec(v.x, v.y, v.z); }
  function vLen(v) { return Math.hypot(v.x, v.y, v.z); }
  function vScale(v, s) { return vec(v.x * s, v.y * s, v.z * s); }
  function vNorm(v) { const l = vLen(v) || 1; return vec(v.x / l, v.y / l, v.z / l); }
  function vDot(a, b) { return a.x * b.x + a.y * b.y + a.z * b.z; }
  function vCross(a, b) { return vec(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x); }
  function vLerp(a, b, t) { return vec(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t); }

  function complex(re, im = 0) { return { re, im }; }
  function cAdd(a, b) { return complex(a.re + b.re, a.im + b.im); }
  function cSub(a, b) { return complex(a.re - b.re, a.im - b.im); }
  function cMul(a, b) { return complex(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re); }
  function cConj(a) { return complex(a.re, -a.im); }
  function cScale(a, s) { return complex(a.re * s, a.im * s); }
  function cAbs2(a) { return a.re * a.re + a.im * a.im; }
  function cis(angle) { return complex(Math.cos(angle), Math.sin(angle)); }
  function cloneStateVector(arr) { return arr.map((a) => complex(a.re, a.im)); }

  function approx(a, b, eps = 1e-6) { return Math.abs(a - b) <= eps; }
  function radToDeg(r) { return (r * 180) / Math.PI; }
  function wrapDeg(r) { return ((radToDeg(r) % 360) + 360) % 360; }
  function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function formatComplex(value) {
    const re = Math.abs(value.re) < 1e-8 ? 0 : value.re;
    const im = Math.abs(value.im) < 1e-8 ? 0 : value.im;
    return `${re.toFixed(3)} ${im >= 0 ? '+' : '-'} ${Math.abs(im).toFixed(3)}i`;
  }

  function ketLabel(index, qubitCount) {
    return `|${index.toString(2).padStart(qubitCount, '0')}⟩`;
  }

  function formatGlobalState(vector, qubitCount, prefix = '|ψ⟩') {
    const lines = [];
    vector.forEach((amp, index) => {
      if (cAbs2(amp) > 1e-8) {
        lines.push(`${formatComplex(amp)} · ${ketLabel(index, qubitCount)}`);
      }
    });
    return `${prefix} = ${lines.join('\n   + ') || `${formatComplex(complex(0, 0))} · ${ketLabel(0, qubitCount)}`}`;
  }

  function formatDensityMatrix(rho) {
    return `ρ = [ ${formatComplex(rho[0][0])} , ${formatComplex(rho[0][1])} ]\n    [ ${formatComplex(rho[1][0])} , ${formatComplex(rho[1][1])} ]`;
  }

  function formatMatrixCell(cell) {
    const re = Number(cell.re.toFixed(3));
    const im = Number(Math.abs(cell.im).toFixed(3));
    return `${re}${cell.im >= 0 ? ' + ' : ' - '}${im}i`;
  }

  function formatMatrix(matrix) {
    if (!matrix) return '|ψ⟩ = |0…0⟩';
    if (typeof matrix === 'string') return matrix;
    return matrix.map((row) => `[ ${row.map(formatMatrixCell).join(' , ')} ]`).join('\n');
  }

  function localMatrixForStep(step) {
    if (!step) return null;
    const key = step.key;
    if (key === 'X') return [[complex(0), complex(1)], [complex(1), complex(0)]];
    if (key === 'Y') return [[complex(0), complex(0, -1)], [complex(0, 1), complex(0)]];
    if (key === 'Z') return [[complex(1), complex(0)], [complex(0), complex(-1)]];
    if (key === 'H') return [[complex(Math.SQRT1_2), complex(Math.SQRT1_2)], [complex(Math.SQRT1_2), complex(-Math.SQRT1_2)]];
    if (key === 'S') return [[complex(1), complex(0)], [complex(0), complex(0, 1)]];
    if (key === 'T') return [[complex(1), complex(0)], [complex(0), cis(Math.PI / 4)]];
    if (key === 'Rx') {
      const half = step.angle / 2;
      return [[complex(Math.cos(half)), complex(0, -Math.sin(half))], [complex(0, -Math.sin(half)), complex(Math.cos(half))]];
    }
    if (key === 'Ry') {
      const half = step.angle / 2;
      return [[complex(Math.cos(half)), complex(-Math.sin(half))], [complex(Math.sin(half)), complex(Math.cos(half))]];
    }
    if (key === 'Rz') {
      const half = step.angle / 2;
      return [[cis(-half), complex(0)], [complex(0), cis(half)]];
    }
    if (key === 'CNOT') return [
      [complex(1), complex(0), complex(0), complex(0)],
      [complex(0), complex(1), complex(0), complex(0)],
      [complex(0), complex(0), complex(0), complex(1)],
      [complex(0), complex(0), complex(1), complex(0)],
    ];
    if (key === 'CZ') return [
      [complex(1), complex(0), complex(0), complex(0)],
      [complex(0), complex(1), complex(0), complex(0)],
      [complex(0), complex(0), complex(1), complex(0)],
      [complex(0), complex(0), complex(0), complex(-1)],
    ];
    if (key === 'SWAP') return [
      [complex(1), complex(0), complex(0), complex(0)],
      [complex(0), complex(0), complex(1), complex(0)],
      [complex(0), complex(1), complex(0), complex(0)],
      [complex(0), complex(0), complex(0), complex(1)],
    ];
    if (key === 'MEASURE') {
      return step.outcome === 0
        ? [[complex(1), complex(0)], [complex(0), complex(0)]]
        : [[complex(0), complex(0)], [complex(0), complex(1)]];
    }
    if (key === 'MEASURE_ALL') return `Π_${ketLabel(step.outcomeIndex, state.qubitCount)} = ${ketLabel(step.outcomeIndex, state.qubitCount)}⟨${step.outcomeBits || step.outcomeIndex.toString(2).padStart(state.qubitCount, '0')}|`;
    return null;
  }

  function zeroStateVector(qubitCount) {
    const dim = 1 << qubitCount;
    const arr = Array.from({ length: dim }, () => complex(0, 0));
    arr[0] = complex(1, 0);
    return arr;
  }

  function bitMask(qubitCount, q) {
    return 1 << (qubitCount - 1 - q);
  }

  function normalizeVector(vector) {
    const norm = Math.sqrt(vector.reduce((sum, amp) => sum + cAbs2(amp), 0)) || 1;
    return vector.map((amp) => complex(amp.re / norm, amp.im / norm));
  }

  function chooseOutcome(probabilities) {
    let r = Math.random();
    for (let i = 0; i < probabilities.length; i += 1) {
      r -= probabilities[i];
      if (r <= 0) return i;
    }
    return Math.max(0, probabilities.length - 1);
  }

  function mostLikelyIndex(probabilities) {
    let best = 0;
    for (let i = 1; i < probabilities.length; i += 1) {
      if (probabilities[i] > probabilities[best]) best = i;
    }
    return best;
  }

  function collapseMeasuredQubit(stateVec, target, outcome, qubitCount) {
    const mask = bitMask(qubitCount, target);
    const projected = stateVec.map((amp, index) => (((index & mask) ? 1 : 0) === outcome ? complex(amp.re, amp.im) : complex(0, 0)));
    const norm = projected.reduce((sum, amp) => sum + cAbs2(amp), 0);
    if (norm < EPS) return null;
    return normalizeVector(projected);
  }

  function collapseAllQubits(stateVec, outcomeIndex) {
    const projected = stateVec.map((amp, index) => (index === outcomeIndex ? complex(amp.re, amp.im) : complex(0, 0)));
    const norm = projected.reduce((sum, amp) => sum + cAbs2(amp), 0);
    if (norm < EPS) return null;
    return normalizeVector(projected);
  }

  function resolveMeasurementStep(step, stateVec, qubitCount) {
    if (step.key === 'MEASURE') {
      const stats = reducedStats(stateVec, step.target, qubitCount);
      const probabilities = [stats.p0, stats.p1];
      const outcome = probabilities[step.outcome] > EPS ? step.outcome : mostLikelyIndex(probabilities);
      return { ...step, outcome, probability: probabilities[outcome] };
    }
    if (step.key === 'MEASURE_ALL') {
      const probabilities = stateVec.map((amp) => cAbs2(amp));
      const outcomeIndex = probabilities[step.outcomeIndex] > EPS ? step.outcomeIndex : mostLikelyIndex(probabilities);
      return {
        ...step,
        outcomeIndex,
        outcomeBits: outcomeIndex.toString(2).padStart(qubitCount, '0'),
        probability: probabilities[outcomeIndex],
      };
    }
    return step;
  }

  function applySingleQubitMatrix(stateVec, matrix, target, qubitCount) {
    const out = cloneStateVector(stateVec);
    const mask = bitMask(qubitCount, target);
    for (let base = 0; base < stateVec.length; base += 1) {
      if (base & mask) continue;
      const idx0 = base;
      const idx1 = base | mask;
      const a = stateVec[idx0];
      const b = stateVec[idx1];
      out[idx0] = cAdd(cMul(matrix[0][0], a), cMul(matrix[0][1], b));
      out[idx1] = cAdd(cMul(matrix[1][0], a), cMul(matrix[1][1], b));
    }
    return normalizeVector(out);
  }

  function applyCNOT(stateVec, control, target, qubitCount) {
    const out = cloneStateVector(stateVec);
    const controlMask = bitMask(qubitCount, control);
    const targetMask = bitMask(qubitCount, target);
    for (let index = 0; index < stateVec.length; index += 1) {
      if ((index & controlMask) && !(index & targetMask)) {
        const swapped = index | targetMask;
        out[index] = stateVec[swapped];
        out[swapped] = stateVec[index];
      }
    }
    return out;
  }

  function applyCZ(stateVec, control, target, qubitCount) {
    const out = cloneStateVector(stateVec);
    const controlMask = bitMask(qubitCount, control);
    const targetMask = bitMask(qubitCount, target);
    for (let index = 0; index < stateVec.length; index += 1) {
      if ((index & controlMask) && (index & targetMask)) {
        out[index] = cScale(out[index], -1);
      }
    }
    return out;
  }

  function applySWAP(stateVec, a, b, qubitCount) {
    if (a === b) return cloneStateVector(stateVec);
    const out = cloneStateVector(stateVec);
    const maskA = bitMask(qubitCount, a);
    const maskB = bitMask(qubitCount, b);
    for (let index = 0; index < stateVec.length; index += 1) {
      const bitA = Boolean(index & maskA);
      const bitB = Boolean(index & maskB);
      if (!bitA && bitB) {
        const swapped = (index | maskA) & ~maskB;
        out[index] = stateVec[swapped];
        out[swapped] = stateVec[index];
      }
    }
    return out;
  }

  function applyStep(stateVec, step, qubitCount) {
    const key = step.key;
    if (key === 'MEASURE') return collapseMeasuredQubit(stateVec, step.target, step.outcome, qubitCount) || cloneStateVector(stateVec);
    if (key === 'MEASURE_ALL') return collapseAllQubits(stateVec, step.outcomeIndex) || cloneStateVector(stateVec);
    if (gateMeta[key].arity === 1) {
      return applySingleQubitMatrix(stateVec, localMatrixForStep(step), step.target, qubitCount);
    }
    if (key === 'CNOT') return applyCNOT(stateVec, step.control, step.target, qubitCount);
    if (key === 'CZ') return applyCZ(stateVec, step.control, step.target, qubitCount);
    if (key === 'SWAP') return applySWAP(stateVec, step.a, step.b, qubitCount);
    return cloneStateVector(stateVec);
  }

  function reducedDensityMatrix(globalState, qubitIndex, qubitCount) {
    const mask = bitMask(qubitCount, qubitIndex);
    let rho00 = complex(0, 0);
    let rho01 = complex(0, 0);
    let rho11 = complex(0, 0);
    for (let base = 0; base < globalState.length; base += 1) {
      if (base & mask) continue;
      const idx0 = base;
      const idx1 = base | mask;
      const a0 = globalState[idx0];
      const a1 = globalState[idx1];
      rho00 = cAdd(rho00, complex(cAbs2(a0), 0));
      rho11 = cAdd(rho11, complex(cAbs2(a1), 0));
      rho01 = cAdd(rho01, cMul(a0, cConj(a1)));
    }
    return [
      [rho00, rho01],
      [cConj(rho01), rho11],
    ];
  }

  function reducedStats(globalState, qubitIndex, qubitCount) {
    const rho = reducedDensityMatrix(globalState, qubitIndex, qubitCount);
    const rho00 = rho[0][0].re;
    const rho11 = rho[1][1].re;
    const rho01 = rho[0][1];
    const x = 2 * rho01.re;
    const yBloch = -2 * rho01.im;
    const zBloch = rho00 - rho11;
    const vector = vec(x, zBloch, yBloch);
    const purity = rho00 * rho00 + rho11 * rho11 + 2 * cAbs2(rho01);
    const radius = Math.min(1, Math.sqrt(Math.max(0, x * x + yBloch * yBloch + zBloch * zBloch)));
    return {
      rho,
      p0: Math.max(0, Math.min(1, rho00)),
      p1: Math.max(0, Math.min(1, rho11)),
      vector,
      radius,
      purity,
      mixed: purity < 0.999,
    };
  }

  function blochAnglesFromVector(v) {
    const radius = vLen(v);
    if (radius < EPS) return { theta: Math.PI / 2, phi: 0, radius };
    const n = vNorm(v);
    const theta = Math.acos(Math.max(-1, Math.min(1, n.y)));
    let phi = Math.atan2(n.z, n.x);
    if (phi < 0) phi += TAU;
    return { theta, phi, radius };
  }

  function currentSnapshot() {
    return state.snapshots[state.stepIndex] || zeroStateVector(state.qubitCount);
  }

  function stepLabel(step) {
    if (!step) return '初始态';
    if (step.key === 'MEASURE') return `M q${step.target} → ${step.outcome}`;
    if (step.key === 'MEASURE_ALL') return `M_all → ${ketLabel(step.outcomeIndex, state.qubitCount)}`;
    if (gateMeta[step.key].rotation) {
      const piTimes = Number((step.angle / Math.PI).toFixed(3));
      return `${step.key}(${piTimes}π) q${step.target}`;
    }
    if (gateMeta[step.key].kind === 'single') return `${step.key} q${step.target}`;
    if (step.key === 'SWAP') return `SWAP q${step.a}↔q${step.b}`;
    return `${step.key} q${step.control}→q${step.target}`;
  }

  function stepSecondary(step) {
    if (!step) return '|0…0⟩';
    if (step.key === 'MEASURE') return `P=${((step.probability || 0) * 100).toFixed(1)}%`;
    if (step.key === 'MEASURE_ALL') return `P=${((step.probability || 0) * 100).toFixed(1)}%`;
    if (gateMeta[step.key].rotation) return `${wrapDeg(step.angle).toFixed(1)}°`;
    return gateMeta[step.key].short;
  }

  function stepExplain(step) {
    if (!step) return gateMeta.init;
    return gateMeta[step.key];
  }

  function selectedStatsAt(stepIndex) {
    const snapshot = state.snapshots[stepIndex] || zeroStateVector(state.qubitCount);
    return reducedStats(snapshot, state.selectedQubit, state.qubitCount);
  }

  function allQubitSummaries(snapshot) {
    return Array.from({ length: state.qubitCount }, (_, q) => reducedStats(snapshot, q, state.qubitCount));
  }

  function recomputeSnapshots() {
    const snapshots = [zeroStateVector(state.qubitCount)];
    let current = snapshots[0];
    for (let i = 0; i < state.sequence.length; i += 1) {
      const originalStep = state.sequence[i];
      const step = (originalStep.key === 'MEASURE' || originalStep.key === 'MEASURE_ALL')
        ? resolveMeasurementStep(originalStep, current, state.qubitCount)
        : originalStep;
      if (step !== originalStep) state.sequence[i] = step;
      current = applyStep(current, step, state.qubitCount);
      snapshots.push(current);
    }
    state.snapshots = snapshots;
    state.stepIndex = Math.min(state.stepIndex, state.sequence.length);
  }

  function createSingleStep(key) {
    const step = { key, target: Number(targetQubitSelect.value) };
    if (gateMeta[key].rotation) step.angle = (Number(anglePiInput.value) || 0.5) * Math.PI;
    return step;
  }

  function createTwoQubitStep(key) {
    if (key === 'SWAP') {
      return { key, a: Number(targetQubitSelect.value), b: Number(secondQubitSelect.value) };
    }
    return { key, control: Number(controlQubitSelect.value), target: Number(targetQubitSelect.value) };
  }

  function sanitizeStepForQubitCount(step, qubitCount) {
    const clone = JSON.parse(JSON.stringify(step));
    if (clone.target != null) clone.target = Math.min(qubitCount - 1, clone.target);
    if (clone.control != null) clone.control = Math.min(qubitCount - 1, clone.control);
    if (clone.a != null) clone.a = Math.min(qubitCount - 1, clone.a);
    if (clone.b != null) clone.b = Math.min(qubitCount - 1, clone.b);
    return clone;
  }

  function isValidStep(step, qubitCount = state.qubitCount) {
    if (!step) return false;
    if (step.key === 'MEASURE_ALL') return true;
    if (gateMeta[step.key].arity === 1) return step.target >= 0 && step.target < qubitCount;
    if (step.key === 'SWAP') return qubitCount >= 2 && step.a !== step.b;
    return qubitCount >= 2 && step.control !== step.target;
  }

  function setExplanation(meta, step = null) {
    gateExplainTitle.textContent = meta.key === 'init' ? '初始态 |0…0⟩' : (meta.kind?.startsWith('measurement') ? `${meta.label} 测量` : `${meta.label} 门`);
    gateExplainFormula.textContent = meta.formula;
    let detail = meta.detail;
    if (step && gateMeta[step.key]?.rotation) {
      detail += ` 当前角度 ${(step.angle / Math.PI).toFixed(3)}π（${wrapDeg(step.angle).toFixed(1)}°）。`;
    }
    if (step && step.key === 'SWAP') {
      detail += ` 当前交换的是 q${step.a} 与 q${step.b}。`;
    }
    if (step && (step.key === 'CNOT' || step.key === 'CZ')) {
      detail += ` 当前控制位 q${step.control}，目标位 q${step.target}。`;
    }
    if (step && step.key === 'MEASURE') {
      detail += ` 本次测量得到 q${step.target} = ${step.outcome}，对应概率约 ${(100 * (step.probability || 0)).toFixed(2)}%。`;
    }
    if (step && step.key === 'MEASURE_ALL') {
      detail += ` 本次全量测量得到 ${ketLabel(step.outcomeIndex, state.qubitCount)}，对应概率约 ${(100 * (step.probability || 0)).toFixed(2)}%。`;
    }
    gateExplainBody.textContent = detail;
    explainTitle.textContent = gateExplainTitle.textContent;
    explainText.textContent = detail;
  }

  function renderQubitSelectors() {
    const options = Array.from({ length: state.qubitCount }, (_, index) => `<option value="${index}">q${index}</option>`).join('');
    [displayQubitSelect, targetQubitSelect, controlQubitSelect, secondQubitSelect].forEach((el) => {
      el.innerHTML = options;
    });
    displayQubitSelect.value = String(Math.min(state.selectedQubit, state.qubitCount - 1));
    targetQubitSelect.value = String(Math.min(Number(targetQubitSelect.value || 0), state.qubitCount - 1));
    controlQubitSelect.value = String(Math.min(Math.max(0, state.qubitCount > 1 ? 1 : 0), state.qubitCount - 1));
    secondQubitSelect.value = String(Math.min(Math.max(0, state.qubitCount > 2 ? 2 : state.qubitCount - 1), state.qubitCount - 1));
  }

  function updateAnglePreview() {
    const angle = (Number(anglePiInput.value) || 0) * Math.PI;
    angleDegreeValue.textContent = `${wrapDeg(angle).toFixed(1)}°`;
  }

  function addSequenceStep(step) {
    if (!isValidStep(step)) {
      viewerStatus.textContent = step.key === 'SWAP' ? 'SWAP 需要选择两个不同量子位。' : '控制位与目标位不能相同，或当前量子位数不足。';
      return;
    }
    state.sequence.push(step);
    commitSequenceEdit(0);
  }

  function renderGateButtons() {
    singleGateButtons.innerHTML = '';
    twoQubitGateButtons.innerHTML = '';

    singleGateOrder.forEach((key) => {
      const meta = gateMeta[key];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gate-btn';
      btn.innerHTML = `<span>${meta.label}</span><small>${meta.short}</small>`;
      btn.title = `${meta.formula}\n\n${meta.detail}`;
      btn.addEventListener('mouseenter', () => setExplanation(meta, meta.rotation ? createSingleStep(meta.key) : createSingleStep(meta.key)));
      btn.addEventListener('click', () => addSequenceStep(createSingleStep(key)));
      singleGateButtons.appendChild(btn);
    });

    twoQubitGateOrder.forEach((key) => {
      const meta = gateMeta[key];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gate-btn';
      btn.dataset.key = key;
      btn.innerHTML = `<span>${meta.label}</span><small>${meta.short}</small>`;
      btn.title = `${meta.formula}\n\n${meta.detail}`;
      btn.addEventListener('mouseenter', () => {
        const sample = key === 'SWAP' ? createTwoQubitStep('SWAP') : createTwoQubitStep(key);
        setExplanation(meta, sample);
      });
      btn.addEventListener('click', () => addSequenceStep(createTwoQubitStep(key)));
      twoQubitGateButtons.appendChild(btn);
    });
    updateTwoQubitButtonsState();
  }

  function updateTwoQubitButtonsState() {
    const disabled = state.qubitCount < 2;
    twoQubitGateButtons.querySelectorAll('button').forEach((btn) => {
      btn.disabled = disabled;
      btn.classList.toggle('is-disabled', disabled);
    });
  }

  function renderQubitSummaries() {
    qubitSummaryGrid.innerHTML = '';
    const snapshot = currentSnapshot();
    const summaries = allQubitSummaries(snapshot);
    summaries.forEach((summary, index) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `qubit-chip ${index === state.selectedQubit ? 'is-selected' : ''}`;
      card.innerHTML = `
        <div class="qubit-chip-header"><strong>q${index}</strong><span class="chip-tag">${summary.mixed ? '混合态' : '纯态'}</span></div>
        <div class="mini">P(|1⟩) ${(summary.p1 * 100).toFixed(1)}% · Purity ${summary.purity.toFixed(3)} · |r| ${summary.radius.toFixed(3)}</div>
      `;
      card.addEventListener('click', () => {
        state.selectedQubit = index;
        displayQubitSelect.value = String(index);
        syncStateToStep(state.stepIndex);
      });
      qubitSummaryGrid.appendChild(card);
    });
  }

  function renderBasisChart() {
    const snapshot = currentSnapshot();
    const probabilities = snapshot.map((amp, index) => ({ index, p: cAbs2(amp) })).filter((item) => item.p > 1e-6);
    const totalStates = 1 << state.qubitCount;
    basisMeta.textContent = `当前为 ${totalStates} 维系统；仅显示概率大于 0.0001 的基态分量。`;
    basisChart.innerHTML = '';
    if (!probabilities.length) {
      basisChart.innerHTML = '<div class="mini">当前没有可见的基态概率。</div>';
      return;
    }
    probabilities.sort((a, b) => b.p - a.p);
    probabilities.forEach(({ index, p }) => {
      const row = document.createElement('div');
      row.className = 'basis-row';
      row.innerHTML = `<code>${ketLabel(index, state.qubitCount)}</code><div class="basis-bar"><span style="width:${(p * 100).toFixed(3)}%"></span></div><strong>${(p * 100).toFixed(2)}%</strong>`;
      basisChart.appendChild(row);
    });
  }

  function latestMeasurementStep(stepIndex = state.stepIndex) {
    for (let i = Math.min(stepIndex, state.sequence.length) - 1; i >= 0; i -= 1) {
      const step = state.sequence[i];
      if (step?.key === 'MEASURE' || step?.key === 'MEASURE_ALL') return { step, index: i + 1 };
    }
    return null;
  }

  function upcomingMeasurementStep() {
    const step = state.sequence[state.stepIndex];
    return step && (step.key === 'MEASURE' || step.key === 'MEASURE_ALL') ? step : null;
  }

  function updateMeasurementPanel() {
    const latest = latestMeasurementStep();
    const upcoming = upcomingMeasurementStep();
    measurementStatus.className = 'measurement-pill';
    if (latest) {
      measurementStatus.classList.add('is-collapsed');
      if (latest.step.key === 'MEASURE') {
        measurementStatus.textContent = `最近测量：第 ${latest.index} 步 · q${latest.step.target} = ${latest.step.outcome}`;
        measurementDetail.textContent = `该次测量按 Born 规则以 ${(100 * (latest.step.probability || 0)).toFixed(2)}% 的概率得到结果 ${latest.step.outcome}，并把全局态坍缩到 q${latest.step.target}=${latest.step.outcome} 的子空间。后面的门都基于这个坍缩后的状态继续执行。`;
      } else {
        measurementStatus.textContent = `最近测量：第 ${latest.index} 步 · ${ketLabel(latest.step.outcomeIndex, state.qubitCount)}`;
        measurementDetail.textContent = `该次全量测量以 ${(100 * (latest.step.probability || 0)).toFixed(2)}% 的概率得到 ${ketLabel(latest.step.outcomeIndex, state.qubitCount)}，系统随后坍缩为一个确定的计算基态。`;
      }
      return;
    }
    if (upcoming) {
      measurementStatus.classList.add('is-pending');
      measurementStatus.textContent = `下一步是测量：${stepLabel(upcoming)}`;
      measurementDetail.textContent = '当前电路前方已经排入测量步骤。播放到该步时，公式面板会展示相应的投影算符，右侧 Bloch 球与全局概率分布会一起发生坍缩。';
      return;
    }
    measurementStatus.textContent = '尚未发生测量';
    measurementDetail.textContent = '点击上面的按钮，会按 Born 规则对当前态进行采样，并把“测量步骤”插入到当前电路位置。坍缩后的状态会继续流向后续门。';
  }

  function updatePanels() {
    const snapshot = currentSnapshot();
    const selectedStats = selectedStatsAt(state.stepIndex);
    const angles = blochAnglesFromVector(state.displayVector);
    stepValue.textContent = `${state.stepIndex} / ${state.sequence.length}`;
    gateValue.textContent = stepLabel(state.sequence[state.stepIndex - 1] || null);
    dimensionValue.textContent = String(1 << state.qubitCount);
    selectedQubitValue.textContent = `q${state.selectedQubit}`;
    p0Value.textContent = `${(selectedStats.p0 * 100).toFixed(1)}%`;
    p1Value.textContent = `${(selectedStats.p1 * 100).toFixed(1)}%`;
    purityValue.textContent = selectedStats.purity.toFixed(3);
    entanglementValue.textContent = state.qubitCount === 1 ? '单比特，无纠缠' : (selectedStats.mixed ? '该位与其他位相关 / 纠缠' : '该位局部仍是纯态');
    thetaValue.textContent = `${radToDeg(angles.theta).toFixed(1)}°`;
    phiValue.textContent = `${wrapDeg(angles.phi).toFixed(1)}°`;
    stateText.textContent = `当前全局量子态：${formatGlobalState(snapshot, state.qubitCount)}`;
    progressBar.style.width = `${state.sequence.length ? (state.stepIndex / state.sequence.length) * 100 : 0}%`;
    renderQubitSummaries();
    renderBasisChart();
    updateMeasurementPanel();
  }

  function transitionAtStep(stepIndex) {
    if (stepIndex <= 0 || stepIndex > state.sequence.length) return null;
    const step = state.sequence[stepIndex - 1];
    return {
      index: stepIndex,
      step,
      matrix: localMatrixForStep(step),
      inputState: state.snapshots[stepIndex - 1],
      outputState: state.snapshots[stepIndex],
      selectedInput: reducedStats(state.snapshots[stepIndex - 1], state.selectedQubit, state.qubitCount),
      selectedOutput: reducedStats(state.snapshots[stepIndex], state.selectedQubit, state.qubitCount),
    };
  }

  function updateFormulaPanel() {
    const transition = state.animation.active ? state.transition : (state.transition || transitionAtStep(state.stepIndex));
    let stageText = '等待执行';
    let gateText = '初始态';
    let note = '对于多量子比特，这里显示当前门的局部矩阵，以及全局态如何被推进。对于选中量子位，还会显示它的约化密度矩阵。';
    if (state.stepIndex < state.sequence.length && !state.animation.active && state.sequence.length) {
      stageText = `下一步预览 · 第 ${state.stepIndex + 1} 步`;
      gateText = stepLabel(state.sequence[state.stepIndex]);
      const preview = transitionAtStep(state.stepIndex + 1);
      formulaMatrix.textContent = formatMatrix(preview.matrix);
      formulaInputState.textContent = formatGlobalState(preview.inputState, state.qubitCount, '|ψ_in⟩');
      formulaOutputState.textContent = formatGlobalState(preview.outputState, state.qubitCount, '|ψ_out⟩');
      selectedDensityMatrix.textContent = formatDensityMatrix(preview.selectedOutput.rho);
      formulaStageLabel.textContent = stageText;
      formulaGateLabel.textContent = gateText;
      formulaNote.textContent = '这是下一步的理论输入 / 输出；真正播放时，右侧轨迹会高亮当前弧段。';
      return;
    }
    if (!transition) {
      formulaStageLabel.textContent = stageText;
      formulaGateLabel.textContent = gateText;
      formulaMatrix.textContent = '|ψ⟩ = |0…0⟩';
      formulaInputState.textContent = formatGlobalState(zeroStateVector(state.qubitCount), state.qubitCount, '|ψ_in⟩');
      formulaOutputState.textContent = formatGlobalState(zeroStateVector(state.qubitCount), state.qubitCount, '|ψ_out⟩');
      selectedDensityMatrix.textContent = 'ρ = [[1, 0], [0, 0]]';
      formulaNote.textContent = note;
      return;
    }
    stageText = state.animation.active ? `执行中 · 第 ${transition.index} 步` : `最近一步 · 第 ${transition.index} 步`;
    gateText = stepLabel(transition.step);
    formulaStageLabel.textContent = stageText;
    formulaGateLabel.textContent = gateText;
    formulaMatrix.textContent = formatMatrix(transition.matrix);
    formulaInputState.textContent = formatGlobalState(transition.inputState, state.qubitCount, '|ψ_in⟩');
    formulaOutputState.textContent = formatGlobalState(transition.outputState, state.qubitCount, '|ψ_out⟩');
    selectedDensityMatrix.textContent = formatDensityMatrix(transition.selectedOutput.rho);
    if (transition.step.key === 'MEASURE') {
      note = `这里显示的是单量子位投影算符 P_${transition.step.outcome}。系统以 ${(100 * (transition.step.probability || 0)).toFixed(2)}% 的概率获得该结果，并坍缩到 q${transition.step.target}=${transition.step.outcome} 的子空间。`;
    } else if (transition.step.key === 'MEASURE_ALL') {
      note = `这里显示的是全量投影 Π_${ketLabel(transition.step.outcomeIndex, state.qubitCount)}。系统以 ${(100 * (transition.step.probability || 0)).toFixed(2)}% 的概率坍缩到这个确定的计算基态。`;
    } else {
      note = gateMeta[transition.step.key].arity === 2
        ? '这里显示的是双量子位门的局部 4×4 矩阵；它作用到系统的两个目标线路上，整体全局态会在 2^n 维空间中变化。'
        : '这里显示的是单量子位门的局部 2×2 矩阵；它只作用在选中的那一条线路上，但仍会改变整个全局态。';
    }
    if (transition.selectedOutput.mixed && state.qubitCount > 1 && transition.step.key !== 'MEASURE_ALL') {
      note += ' 当前选中量子位的约化密度矩阵已经不是纯态，这通常意味着它和其他量子位发生了纠缠或更一般的相关。';
    }
    formulaNote.textContent = note;
  }

  function syncStateToStep(stepCount) {
    state.stepIndex = Math.max(0, Math.min(stepCount, state.sequence.length));
    const selected = selectedStatsAt(state.stepIndex);
    state.currentVector = vClone(selected.vector);
    state.displayVector = vClone(selected.vector);
    state.animation.active = false;
    state.transition = transitionAtStep(state.stepIndex);
    const explainedStep = state.sequence[state.stepIndex - 1] || null;
    setExplanation(stepExplain(explainedStep), explainedStep);
    renderCircuitBoard();
    updatePanels();
    updateFormulaPanel();
    sendViewerSync(true);
  }

  function commitSequenceEdit(stepCount = 0) {
    state.playing = false;
    playBtn.textContent = '▶ 播放';
    recomputeSnapshots();
    closeInsertPopover();
    syncStateToStep(stepCount);
  }

  function performStep() {
    if (state.animation.active || state.stepIndex >= state.sequence.length) return;
    const transition = transitionAtStep(state.stepIndex + 1);
    const selectedOutput = transition.selectedOutput;
    state.transition = transition;
    state.stepIndex += 1;
    state.currentVector = vClone(selectedOutput.vector);
    state.animation.active = true;
    state.animation.elapsed = 0;
    state.animation.duration = Number(speedInput.value);
    state.animation.startVector = vClone(state.displayVector);
    state.animation.endVector = vClone(selectedOutput.vector);
    state.animation.startRadius = vLen(state.displayVector);
    state.animation.endRadius = selectedOutput.radius;
    setExplanation(stepExplain(transition.step), transition.step);
    renderCircuitBoard();
    updatePanels();
    updateFormulaPanel();
  }

  function stepBack() {
    if (state.animation.active) return;
    if (state.stepIndex <= 0) return;
    syncStateToStep(state.stepIndex - 1);
  }

  function trailPoints() {
    const points = [];
    for (let i = 0; i <= state.stepIndex; i += 1) {
      points.push(selectedStatsAt(i).vector);
    }
    return points;
  }

  function slerpDirections(a, b, t) {
    const lenA = vLen(a);
    const lenB = vLen(b);
    if (lenA < EPS || lenB < EPS) return vLerp(a, b, t);
    const na = vNorm(a);
    const nb = vNorm(b);
    let dot = Math.max(-1, Math.min(1, vDot(na, nb)));
    if (dot > 0.9995) {
      const dir = vNorm(vLerp(na, nb, t));
      const radius = lenA + (lenB - lenA) * t;
      return vScale(dir, radius);
    }
    const theta = Math.acos(dot) * t;
    const relative = vNorm(vLerp(nb, vScale(na, dot), -1));
    const partA = vScale(na, Math.cos(theta));
    const partB = vScale(relative, Math.sin(theta));
    const dir = vNorm(vLerp(partA, partB, 1));
    const radius = lenA + (lenB - lenA) * t;
    return vScale(dir, radius);
  }

  function sampleArcPoints(start, end, count = 26) {
    const points = [];
    for (let i = 0; i <= count; i += 1) {
      const t = i / count;
      points.push(slerpDirections(start, end, t));
    }
    return points;
  }

  function getCurrentArcInfo() {
    if (state.animation.active) {
      return { active: true, points: sampleArcPoints(state.animation.startVector, state.displayVector, 18) };
    }
    if (state.stepIndex > 0) {
      return {
        active: false,
        points: sampleArcPoints(selectedStatsAt(state.stepIndex - 1).vector, selectedStatsAt(state.stepIndex).vector, 18),
      };
    }
    return { active: false, points: [] };
  }

  function updateViewerStatus(message) {
    viewerStatus.textContent = message;
  }

  function renderCircuitBoard() {
    circuitBoard.innerHTML = '';
    circuitBoard.style.setProperty('--lane-count', String(state.qubitCount));

    const labelColumn = document.createElement('div');
    labelColumn.className = 'lane-label-column';
    labelColumn.innerHTML = '<div class="lane-label-spacer">线路</div>';
    for (let q = 0; q < state.qubitCount; q += 1) {
      const cell = document.createElement('div');
      cell.className = 'lane-label';
      cell.innerHTML = `<strong>q${q}</strong>`;
      labelColumn.appendChild(cell);
    }
    circuitBoard.appendChild(labelColumn);

    const startColumn = document.createElement('div');
    startColumn.className = 'start-column';
    startColumn.innerHTML = '<div class="start-head">起点</div>';
    for (let q = 0; q < state.qubitCount; q += 1) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'start-cell';
      cell.innerHTML = '<span>|0⟩</span>';
      cell.addEventListener('click', () => syncStateToStep(0));
      cell.addEventListener('mouseenter', () => setExplanation(gateMeta.init));
      startColumn.appendChild(cell);
    }
    circuitBoard.appendChild(startColumn);

    circuitBoard.appendChild(makeInsertColumn(0));

    if (!state.sequence.length) {
      const empty = document.createElement('div');
      empty.className = 'mini';
      empty.style.alignSelf = 'center';
      empty.textContent = '还没有电路。先在左侧添加门，或者使用一个多比特预设。';
      circuitBoard.appendChild(empty);
      return;
    }

    state.sequence.forEach((step, index) => {
      const column = document.createElement('div');
      column.className = 'step-column';
      column.dataset.index = String(index);

      const status = index + 1 < state.stepIndex ? 'done' : (index + 1 === state.stepIndex ? 'current' : 'pending');
      const head = document.createElement('button');
      head.type = 'button';
      head.className = `step-head ${status}`;
      head.draggable = true;
      head.innerHTML = `<strong>${index + 1}. ${stepLabel(step)}</strong><small>${stepSecondary(step)}</small>`;
      head.addEventListener('click', () => syncStateToStep(index + 1));
      head.addEventListener('mouseenter', () => setExplanation(stepExplain(step), step));
      head.addEventListener('dragstart', (event) => {
        draggedStepIndex = index;
        head.classList.add('dragging');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', String(index));
      });
      head.addEventListener('dragend', () => {
        draggedStepIndex = null;
        head.classList.remove('dragging');
        document.querySelectorAll('.step-column.drag-over').forEach((el) => el.classList.remove('drag-over'));
        document.querySelectorAll('.insert-slot.drag-over').forEach((el) => el.classList.remove('drag-over'));
      });
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'step-delete';
      del.textContent = '×';
      del.title = '删除这一步';
      del.addEventListener('click', (event) => {
        event.stopPropagation();
        state.sequence.splice(index, 1);
        commitSequenceEdit(0);
      });
      head.appendChild(del);
      column.appendChild(head);

      const connector = renderStepConnector(step);
      if (connector) column.appendChild(connector);

      for (let q = 0; q < state.qubitCount; q += 1) {
        const lane = document.createElement('div');
        lane.className = 'lane-cell';
        decorateLaneCell(lane, step, q);
        column.appendChild(lane);
      }

      column.addEventListener('dragover', (event) => {
        event.preventDefault();
        column.classList.add('drag-over');
      });
      column.addEventListener('dragleave', () => column.classList.remove('drag-over'));
      column.addEventListener('drop', (event) => {
        event.preventDefault();
        column.classList.remove('drag-over');
        if (draggedStepIndex !== null) reorderSteps(draggedStepIndex, index);
      });

      circuitBoard.appendChild(column);
      circuitBoard.appendChild(makeInsertColumn(index + 1));
    });
  }

  function renderStepConnector(step) {
    let top = null;
    let bottom = null;
    if (step.key === 'SWAP') {
      top = Math.min(step.a, step.b);
      bottom = Math.max(step.a, step.b);
    } else if (gateMeta[step.key].arity === 2) {
      top = Math.min(step.control, step.target);
      bottom = Math.max(step.control, step.target);
    }
    if (top == null || bottom == null || top === bottom) return null;
    const connector = document.createElement('div');
    connector.className = 'step-connector';
    const laneHeight = 58;
    const gap = 8;
    const headHeight = 50;
    const y1 = headHeight + gap + top * (laneHeight + gap) + laneHeight / 2;
    const y2 = headHeight + gap + bottom * (laneHeight + gap) + laneHeight / 2;
    connector.style.top = `${y1}px`;
    connector.style.height = `${y2 - y1}px`;
    return connector;
  }

  function decorateLaneCell(cell, step, qubitIndex) {
    if (step.key === 'MEASURE' && step.target === qubitIndex) {
      const gate = document.createElement('div');
      gate.className = 'gate-box gate-measure';
      gate.innerHTML = `<strong>M</strong><small>${step.outcome}</small>`;
      cell.appendChild(gate);
      return;
    }
    if (step.key === 'MEASURE_ALL') {
      const gate = document.createElement('div');
      gate.className = 'gate-box gate-measure';
      gate.innerHTML = `<strong>M</strong><small>${step.outcomeBits || step.outcomeIndex.toString(2).padStart(state.qubitCount, '0')}</small>`;
      cell.appendChild(gate);
      return;
    }
    if (gateMeta[step.key].arity === 1 && step.target === qubitIndex) {
      const gate = document.createElement('div');
      gate.className = 'gate-box';
      gate.innerHTML = `<span>${step.key}</span>${gateMeta[step.key].rotation ? `<small>${wrapDeg(step.angle).toFixed(0)}°</small>` : ''}`;
      cell.appendChild(gate);
      return;
    }
    if (step.key === 'CNOT') {
      if (step.control === qubitIndex) {
        const dot = document.createElement('div');
        dot.className = 'control-dot';
        cell.appendChild(dot);
      }
      if (step.target === qubitIndex) {
        const target = document.createElement('div');
        target.className = 'target-plus';
        cell.appendChild(target);
      }
      return;
    }
    if (step.key === 'CZ') {
      if (step.control === qubitIndex) {
        const dot = document.createElement('div');
        dot.className = 'control-dot';
        cell.appendChild(dot);
      }
      if (step.target === qubitIndex) {
        const gate = document.createElement('div');
        gate.className = 'gate-box';
        gate.innerHTML = '<span>Z</span><small>受控</small>';
        cell.appendChild(gate);
      }
      return;
    }
    if (step.key === 'SWAP' && (step.a === qubitIndex || step.b === qubitIndex)) {
      const mark = document.createElement('div');
      mark.className = 'swap-mark';
      cell.appendChild(mark);
    }
  }

  function makeInsertColumn(index) {
    const column = document.createElement('div');
    column.className = 'insert-column';
    column.innerHTML = '<div class="insert-head">插入</div>';
    for (let q = 0; q < state.qubitCount; q += 1) {
      const cell = document.createElement('div');
      cell.className = 'insert-cell';
      if (q === 0) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'insert-slot';
        btn.textContent = '+';
        btn.title = '在这里插入一个门';
        btn.addEventListener('click', () => openInsertPopover(index, btn));
        btn.addEventListener('dragover', (event) => {
          event.preventDefault();
          btn.classList.add('drag-over');
        });
        btn.addEventListener('dragleave', () => btn.classList.remove('drag-over'));
        btn.addEventListener('drop', (event) => {
          event.preventDefault();
          btn.classList.remove('drag-over');
          if (draggedStepIndex !== null) reorderSteps(draggedStepIndex, index);
        });
        cell.appendChild(btn);
      }
      column.appendChild(cell);
    }
    return column;
  }

  function reorderSteps(fromIndex, toIndex) {
    if (fromIndex === toIndex || fromIndex + 1 === toIndex) return;
    const [moved] = state.sequence.splice(fromIndex, 1);
    const adjusted = toIndex > fromIndex ? toIndex - 1 : toIndex;
    state.sequence.splice(adjusted, 0, moved);
    commitSequenceEdit(0);
  }

  function ensureInsertPopover() {
    if (insertPopover) return insertPopover;
    insertPopover = document.createElement('div');
    insertPopover.className = 'insert-popover';
    insertPopover.innerHTML = `
      <div class="insert-popover-title">
        <span>在这里插入一个量子门</span>
        <button type="button" class="ghost" data-close-insert>关闭</button>
      </div>
      <div class="insert-grid"></div>
    `;
    const grid = insertPopover.querySelector('.insert-grid');
    [...singleGateOrder, ...twoQubitGateOrder].forEach((key) => {
      const meta = gateMeta[key];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'insert-mini-btn';
      btn.innerHTML = `<strong>${meta.label}</strong><small>${meta.arity === 1 ? meta.short : '使用当前线路选择'}</small>`;
      btn.title = `${meta.formula}\n\n${meta.detail}`;
      btn.addEventListener('mouseenter', () => {
        const step = meta.arity === 1 ? createSingleStep(key) : createTwoQubitStep(key);
        setExplanation(meta, step);
      });
      btn.addEventListener('click', () => {
        const step = meta.arity === 1 ? createSingleStep(key) : createTwoQubitStep(key);
        if (!isValidStep(step)) return;
        state.sequence.splice(insertTargetIndex, 0, step);
        commitSequenceEdit(0);
      });
      grid.appendChild(btn);
    });
    insertPopover.querySelector('[data-close-insert]').addEventListener('click', closeInsertPopover);
    document.body.appendChild(insertPopover);
    document.addEventListener('pointerdown', (event) => {
      if (!insertPopover.classList.contains('is-visible')) return;
      if (insertPopover.contains(event.target) || event.target.closest('.insert-slot')) return;
      closeInsertPopover();
    });
    return insertPopover;
  }

  function openInsertPopover(index, anchor) {
    insertTargetIndex = index;
    const pop = ensureInsertPopover();
    pop.classList.add('is-visible');
    const rect = anchor.getBoundingClientRect();
    const width = Math.min(340, window.innerWidth - 24);
    const left = Math.max(12, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 12));
    const top = Math.min(rect.bottom + 10, window.innerHeight - 260);
    pop.style.left = `${left}px`;
    pop.style.top = `${top}px`;
  }

  function closeInsertPopover() {
    if (!insertPopover) return;
    insertPopover.classList.remove('is-visible');
  }

  function renderPresetHandlers() {
    document.querySelectorAll('[data-preset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const preset = presets[btn.dataset.preset];
        state.qubitCount = preset.qubits;
        state.selectedQubit = 0;
        qubitCountSelect.value = String(state.qubitCount);
        renderQubitSelectors();
        state.sequence = preset.sequence.map((step) => JSON.parse(JSON.stringify(step)));
        updateTwoQubitButtonsState();
        commitSequenceEdit(0);
      });
    });
  }

  function getViewerSignature() {
    const current = state.currentVector;
    return `${state.qubitCount}|${state.selectedQubit}|${state.stepIndex}|${state.sequence.length}|${current.x.toFixed(4)}|${current.y.toFixed(4)}|${current.z.toFixed(4)}`;
  }

  function sendViewerSync(force = false) {
    if (state.onlineViewer.mode !== 'online' || !onlineFrame || !onlineFrame.contentWindow) return;
    const signature = getViewerSignature();
    if (!force && !state.animation.active && signature === state.onlineViewer.lastSignature) return;
    const stats = selectedStatsAt(state.stepIndex);
    onlineFrame.contentWindow.postMessage({
      source: 'qubit-flow-parent',
      type: 'sync',
      payload: {
        displayVector: state.displayVector,
        currentVector: state.currentVector,
        trail: trailPoints(),
        currentArc: getCurrentArcInfo().points,
        meta: {
          qubitCount: state.qubitCount,
          selectedQubit: state.selectedQubit,
          purity: stats.purity,
          radius: stats.radius,
          mixed: stats.mixed,
        },
      },
    }, '*');
    state.onlineViewer.lastSignature = signature;
  }

  function handleViewerMessage(event) {
    if (event.source !== onlineFrame.contentWindow || !event.data || event.data.source !== 'qubit-flow-online-viewer') return;
    if (event.data.type === 'ready') {
      state.onlineViewer.ready = true;
      state.onlineViewer.failed = false;
      if (state.onlineViewer.mode === 'online') {
        updateViewerStatus('在线增强样式已就绪：当前由 Three.js 渲染选中量子位的 Bloch 球。');
        sendViewerSync(true);
      }
    }
    if (event.data.type === 'error') {
      state.onlineViewer.ready = false;
      state.onlineViewer.failed = true;
      updateViewerStatus(`在线增强样式加载失败：${event.data.message || '未知错误'}；已保留离线模式可用。`);
      setViewerMode('offline');
    }
  }

  function setViewerMode(mode) {
    state.onlineViewer.mode = mode;
    const online = mode === 'online';
    offlineModeBtn.classList.toggle('is-active', !online);
    onlineModeBtn.classList.toggle('is-active', online);
    canvas.classList.toggle('is-hidden', online);
    onlineFrame.classList.toggle('is-hidden', !online);
    if (online) {
      updateViewerStatus(state.onlineViewer.ready
        ? '在线增强样式已就绪：当前由 Three.js 渲染选中量子位的 Bloch 球。'
        : '正在尝试加载在线增强样式；需要联网拉取 Three.js。');
      sendViewerSync(true);
    } else {
      updateViewerStatus('当前为离线本地渲染：无需联网，兼容本地直接打开。');
    }
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * DPR));
    canvas.height = Math.max(1, Math.floor(rect.height * DPR));
  }

  function rotateY(v, angle) {
    const c = Math.cos(angle), s = Math.sin(angle);
    return vec(v.x * c + v.z * s, v.y, -v.x * s + v.z * c);
  }
  function rotateX(v, angle) {
    const c = Math.cos(angle), s = Math.sin(angle);
    return vec(v.x, v.y * c - v.z * s, v.y * s + v.z * c);
  }
  function worldToCamera(v) {
    return rotateX(rotateY(v, state.camera.yaw), state.camera.pitch);
  }
  function project(v) {
    const cv = worldToCamera(v);
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const focal = Math.min(w, h) * 0.32 * state.camera.zoom;
    const depth = 4.4 - cv.z;
    const scale = focal / Math.max(1.2, depth);
    return { x: cx + cv.x * scale, y: cy - cv.y * scale, z: cv.z, scale };
  }

  function drawBackground() {
    const w = canvas.width;
    const h = canvas.height;
    const bg = ctx.createRadialGradient(w * 0.5, h * 0.45, 20, w * 0.5, h * 0.45, Math.max(w, h) * 0.6);
    bg.addColorStop(0, 'rgba(25, 52, 95, 0.16)');
    bg.addColorStop(0.6, 'rgba(7, 17, 31, 0.05)');
    bg.addColorStop(1, 'rgba(7, 17, 31, 0)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
  }

  function drawPolyline3D(points, color, width, dash = []) {
    if (points.length < 2) return;
    ctx.save();
    ctx.lineWidth = width * DPR;
    ctx.strokeStyle = color;
    ctx.setLineDash(dash.map((v) => v * DPR));
    ctx.beginPath();
    const first = project(points[0]);
    ctx.moveTo(first.x, first.y);
    for (let i = 1; i < points.length; i += 1) {
      const p = project(points[i]);
      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawGradientSegments(points, innerWidth = 1.12, glowWidth = 4.2) {
    if (points.length < 2) return;
    for (let i = 1; i < points.length; i += 1) {
      const a = project(points[i - 1]);
      const b = project(points[i]);
      const glow = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      glow.addColorStop(0, 'rgba(138,95,255,0.07)');
      glow.addColorStop(1, 'rgba(215,183,255,0.18)');
      ctx.save();
      ctx.strokeStyle = glow;
      ctx.lineWidth = glowWidth * DPR;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.restore();
      const inner = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      inner.addColorStop(0, 'rgba(132,92,255,0.48)');
      inner.addColorStop(1, 'rgba(202,164,255,0.90)');
      ctx.save();
      ctx.strokeStyle = inner;
      ctx.lineWidth = innerWidth * DPR;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawArrowHead(from, to, color, size = 10) {
    const ang = Math.atan2(to.y - from.y, to.x - from.x);
    const s = size * DPR;
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(to.x - Math.cos(ang - 0.4) * s, to.y - Math.sin(ang - 0.4) * s);
    ctx.lineTo(to.x - Math.cos(ang + 0.4) * s, to.y - Math.sin(ang + 0.4) * s);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawSphere() {
    const center = project(vec(0, 0, 0));
    const radius = Math.max(12 * DPR, Math.abs(project(vec(1, 0, 0)).x - center.x));
    const rg = ctx.createRadialGradient(center.x - radius * 0.35, center.y - radius * 0.35, radius * 0.15, center.x, center.y, radius * 1.15);
    rg.addColorStop(0, 'rgba(155,195,255,0.16)');
    rg.addColorStop(1, 'rgba(122,168,255,0.05)');
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, TAU);
    ctx.fill();
    ctx.lineWidth = 1.4 * DPR;
    ctx.strokeStyle = 'rgba(141,180,255,0.33)';
    ctx.stroke();

    const latitudes = [-0.5, 0, 0.5];
    const meridians = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2];
    latitudes.forEach((lat) => {
      const pts = [];
      const y = lat;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      for (let i = 0; i <= 80; i += 1) {
        const t = (i / 80) * TAU;
        pts.push(vec(Math.cos(t) * r, y, Math.sin(t) * r));
      }
      drawPolyline3D(pts, `rgba(255,255,255,${lat === 0 ? 0.22 : 0.12})`, 1);
    });
    meridians.forEach((lon, index) => {
      const pts = [];
      for (let i = 0; i <= 80; i += 1) {
        const t = (i / 80) * Math.PI;
        const y = Math.cos(t);
        const ring = Math.sin(t);
        pts.push(vec(Math.cos(lon) * ring, y, Math.sin(lon) * ring));
      }
      drawPolyline3D(pts, `rgba(255,255,255,${index < 2 ? 0.15 : 0.08})`, 1);
    });
    drawAxis(vec(0, 0, 0), vec(1.35, 0, 0), '#8ec5ff', 'X');
    drawAxis(vec(0, 0, 0), vec(0, 1.25, 0), '#4ade80', '|0⟩');
    drawAxis(vec(0, 0, 0), vec(0, -1.25, 0), '#fb7185', '|1⟩');
    drawAxis(vec(0, 0, 0), vec(0, 0, 1.35), '#8ec5ff', 'Y');
  }

  function drawAxis(start, end, color, label) {
    const a = project(start);
    const b = project(end);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.6 * DPR;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    drawArrowHead(a, b, color, 10);
    ctx.fillStyle = color;
    ctx.font = `${12 * DPR}px Inter, sans-serif`;
    ctx.fillText(label, b.x + 8 * DPR, b.y - 8 * DPR);
    ctx.restore();
  }

  function drawTrail() {
    const points = trailPoints();
    if (points.length < 2) {
      drawTrailPoint(points[0], 0, true);
      return;
    }
    drawGradientSegments(points, 1.1, 4.0);
    for (let i = 0; i < points.length; i += 1) {
      drawTrailPoint(points[i], i, i === points.length - 1);
      if (i > 0) {
        const prev = project(points[i - 1]);
        const curr = project(points[i]);
        const mid = { x: prev.x + (curr.x - prev.x) * 0.62, y: prev.y + (curr.y - prev.y) * 0.62 };
        const fakeFrom = { x: mid.x - (curr.x - prev.x) * 0.001, y: mid.y - (curr.y - prev.y) * 0.001 };
        drawArrowHead(fakeFrom, curr, 'rgba(207,184,255,0.92)', 7);
      }
    }
  }

  function drawTrailPoint(v, index, active) {
    const p = project(v);
    ctx.save();
    ctx.fillStyle = active ? '#70d6ff' : '#a78bfa';
    ctx.beginPath();
    ctx.arc(p.x, p.y, (active ? 5.6 : 3.6) * DPR, 0, TAU);
    ctx.fill();
    if (index > 0) {
      ctx.fillStyle = '#f3e8ff';
      ctx.font = `${11 * DPR}px Inter, sans-serif`;
      ctx.fillText(String(index), p.x + 8 * DPR, p.y - 8 * DPR);
    }
    ctx.restore();
  }

  function drawCurrentArc() {
    const info = getCurrentArcInfo();
    if (!info.points.length) return;
    for (let i = 1; i < info.points.length; i += 1) {
      const a = project(info.points[i - 1]);
      const b = project(info.points[i]);
      const glow = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      glow.addColorStop(0, 'rgba(112,214,255,0.18)');
      glow.addColorStop(1, 'rgba(243,232,255,0.30)');
      ctx.save();
      ctx.strokeStyle = glow;
      ctx.lineWidth = (info.active ? 6.8 : 4.8) * DPR;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.restore();
      const inner = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      inner.addColorStop(0, 'rgba(112,214,255,0.95)');
      inner.addColorStop(1, 'rgba(243,232,255,0.98)');
      ctx.save();
      ctx.strokeStyle = inner;
      ctx.lineWidth = (info.active ? 2.5 : 1.9) * DPR;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawStateArrow() {
    const origin = project(vec(0, 0, 0));
    const tip = project(state.displayVector);
    const dx = tip.x - origin.x;
    const dy = tip.y - origin.y;
    const dist = Math.hypot(dx, dy);
    ctx.save();
    ctx.strokeStyle = '#70d6ff';
    ctx.lineWidth = 3.0 * DPR;
    ctx.shadowColor = 'rgba(112,214,255,0.42)';
    ctx.shadowBlur = 12 * DPR;
    if (dist > 2 * DPR) {
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(tip.x, tip.y);
      ctx.stroke();
      drawArrowHead(origin, tip, '#70d6ff', 12);
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, 6 * DPR, 0, TAU);
      ctx.fillStyle = '#70d6ff';
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(origin.x, origin.y, 8 * DPR, 0, TAU);
      ctx.fillStyle = 'rgba(112,214,255,0.18)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(origin.x, origin.y, 4 * DPR, 0, TAU);
      ctx.fillStyle = '#70d6ff';
      ctx.fill();
    }
    ctx.restore();
  }

  function drawUiOverlay() {
    const h = canvas.height;
    const stats = selectedStatsAt(state.stepIndex);
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.62)';
    ctx.font = `${12 * DPR}px Inter, sans-serif`;
    ctx.fillText(`显示 q${state.selectedQubit} · purity ${stats.purity.toFixed(3)} · |r| ${stats.radius.toFixed(3)} · zoom ${state.camera.zoom.toFixed(2)}×`, 20 * DPR, h - 24 * DPR);
    ctx.restore();
  }

  function renderScene() {
    if (state.onlineViewer.mode !== 'offline') return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawSphere();
    drawTrail();
    drawCurrentArc();
    drawStateArrow();
    drawUiOverlay();
  }

  function tick(dt) {
    if (state.playing && !state.animation.active && state.stepIndex < state.sequence.length) {
      performStep();
    }
    if (state.animation.active) {
      state.animation.elapsed += dt;
      const t = Math.min(1, state.animation.elapsed / Math.max(0.001, state.animation.duration));
      const eased = easeInOutCubic(t);
      state.displayVector = slerpDirections(state.animation.startVector, state.animation.endVector, eased);
      if (t >= 1) {
        state.animation.active = false;
        state.displayVector = vClone(state.animation.endVector);
        if (state.playing && state.stepIndex >= state.sequence.length) {
          state.playing = false;
          playBtn.textContent = '▶ 播放';
        }
      }
    } else {
      state.displayVector = vClone(state.currentVector);
      if (state.playing && state.stepIndex >= state.sequence.length) {
        state.playing = false;
        playBtn.textContent = '▶ 播放';
      }
    }
    renderScene();
    if (state.onlineViewer.mode === 'online') sendViewerSync(state.animation.active);
    updatePanels();
    updateFormulaPanel();
  }

  function onPointerDown(event) {
    if (state.onlineViewer.mode !== 'offline') return;
    state.camera.dragging = true;
    state.camera.lastX = event.clientX;
    state.camera.lastY = event.clientY;
  }

  function onPointerMove(event) {
    if (!state.camera.dragging) return;
    const dx = event.clientX - state.camera.lastX;
    const dy = event.clientY - state.camera.lastY;
    state.camera.lastX = event.clientX;
    state.camera.lastY = event.clientY;
    state.camera.yaw += dx * 0.01;
    state.camera.pitch += dy * 0.01;
    state.camera.pitch = Math.max(-1.4, Math.min(1.4, state.camera.pitch));
  }

  function onPointerUp() {
    state.camera.dragging = false;
  }

  function onWheel(event) {
    if (state.onlineViewer.mode !== 'offline') return;
    event.preventDefault();
    state.camera.zoom *= event.deltaY < 0 ? 1.1 : 0.9;
    state.camera.zoom = Math.max(0.6, Math.min(4.75, state.camera.zoom));
  }

  function insertMeasurementStep(kind) {
    if (state.animation.active) return;
    const insertIndex = state.stepIndex;
    const snapshot = state.snapshots[insertIndex] || zeroStateVector(state.qubitCount);
    let step = null;
    if (kind === 'selected') {
      const target = state.selectedQubit;
      const stats = reducedStats(snapshot, target, state.qubitCount);
      const probabilities = [stats.p0, stats.p1];
      const outcome = chooseOutcome(probabilities);
      step = { key: 'MEASURE', target, outcome, probability: probabilities[outcome] };
      updateViewerStatus(`已插入测量：q${target} 以 ${(100 * probabilities[outcome]).toFixed(2)}% 的概率得到 ${outcome}，状态已坍缩。`);
    } else {
      const probabilities = snapshot.map((amp) => cAbs2(amp));
      const outcomeIndex = chooseOutcome(probabilities);
      step = {
        key: 'MEASURE_ALL',
        outcomeIndex,
        outcomeBits: outcomeIndex.toString(2).padStart(state.qubitCount, '0'),
        probability: probabilities[outcomeIndex],
      };
      updateViewerStatus(`已插入全量测量：系统以 ${(100 * probabilities[outcomeIndex]).toFixed(2)}% 的概率坍缩到 ${ketLabel(outcomeIndex, state.qubitCount)}。`);
    }
    state.sequence.splice(insertIndex, 0, step);
    commitSequenceEdit(insertIndex + 1);
  }

  function bindEvents() {
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('message', handleViewerMessage);
    window.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeInsertPopover(); });

    offlineModeBtn.addEventListener('click', () => setViewerMode('offline'));
    onlineModeBtn.addEventListener('click', () => setViewerMode('online'));
    onlineFrame.addEventListener('load', () => {
      if (state.onlineViewer.mode === 'online') updateViewerStatus('在线增强视图页面已加载，正在等待 Three.js 初始化。');
    });

    qubitCountSelect.addEventListener('change', () => {
      state.qubitCount = Number(qubitCountSelect.value);
      state.selectedQubit = Math.min(state.selectedQubit, state.qubitCount - 1);
      state.sequence = state.sequence.map((step) => sanitizeStepForQubitCount(step, state.qubitCount)).filter((step) => isValidStep(step, state.qubitCount));
      renderQubitSelectors();
      updateTwoQubitButtonsState();
      commitSequenceEdit(0);
    });

    displayQubitSelect.addEventListener('change', () => {
      state.selectedQubit = Number(displayQubitSelect.value);
      syncStateToStep(state.stepIndex);
    });

    anglePiInput.addEventListener('input', () => {
      updateAnglePreview();
      const current = state.sequence[state.stepIndex - 1];
      if (current && gateMeta[current.key]?.rotation) setExplanation(gateMeta[current.key], { ...current, angle: (Number(anglePiInput.value) || 0.5) * Math.PI });
    });

    speedInput.addEventListener('input', () => {
      speedValue.textContent = `${Number(speedInput.value).toFixed(2)}s / 步`;
      state.animation.duration = Number(speedInput.value);
    });

    playBtn.addEventListener('click', () => {
      if (!state.sequence.length) return;
      if (state.stepIndex >= state.sequence.length && !state.animation.active) syncStateToStep(0);
      state.playing = !state.playing;
      playBtn.textContent = state.playing ? '❚❚ 暂停' : '▶ 播放';
    });
    stepBtn.addEventListener('click', () => {
      state.playing = false;
      playBtn.textContent = '▶ 播放';
      performStep();
    });
    prevBtn.addEventListener('click', () => {
      state.playing = false;
      playBtn.textContent = '▶ 播放';
      stepBack();
    });
    resetBtn.addEventListener('click', () => {
      state.playing = false;
      playBtn.textContent = '▶ 播放';
      syncStateToStep(0);
    });
    clearBtn.addEventListener('click', () => {
      state.playing = false;
      playBtn.textContent = '▶ 播放';
      state.sequence = [];
      commitSequenceEdit(0);
    });
    measureSelectedBtn.addEventListener('click', () => {
      state.playing = false;
      playBtn.textContent = '▶ 播放';
      insertMeasurementStep('selected');
    });
    measureAllBtn.addEventListener('click', () => {
      state.playing = false;
      playBtn.textContent = '▶ 播放';
      insertMeasurementStep('all');
    });
  }

  function assertResult(name, pass, detail) {
    const line = document.createElement('div');
    line.className = pass ? 'test-pass' : 'test-fail';
    line.textContent = `${pass ? '✓' : '✗'} ${name}：${detail}`;
    testList.appendChild(line);
    return pass;
  }

  function runSelfTests() {
    testList.innerHTML = '';
    const results = [];

    let vec1 = zeroStateVector(1);
    vec1 = applyStep(vec1, { key: 'X', target: 0 }, 1);
    results.push(assertResult('1Q · X|0⟩ = |1⟩', approx(cAbs2(vec1[1]), 1), `P(|1⟩)=${cAbs2(vec1[1]).toFixed(3)}`));

    vec1 = zeroStateVector(1);
    vec1 = applyStep(vec1, { key: 'H', target: 0 }, 1);
    vec1 = applyStep(vec1, { key: 'H', target: 0 }, 1);
    results.push(assertResult('1Q · H(H|0⟩)=|0⟩', approx(cAbs2(vec1[0]), 1), `P(|0⟩)=${cAbs2(vec1[0]).toFixed(3)}`));

    let vec2 = zeroStateVector(2);
    vec2 = applyStep(vec2, { key: 'H', target: 0 }, 2);
    vec2 = applyStep(vec2, { key: 'CNOT', control: 0, target: 1 }, 2);
    const bellPass = approx(cAbs2(vec2[0]), 0.5) && approx(cAbs2(vec2[3]), 0.5) && approx(cAbs2(vec2[1]), 0) && approx(cAbs2(vec2[2]), 0);
    results.push(assertResult('2Q · Bell 态', bellPass, `P(|00⟩)=${cAbs2(vec2[0]).toFixed(3)}, P(|11⟩)=${cAbs2(vec2[3]).toFixed(3)}`));
    const bellSummary = reducedStats(vec2, 0, 2);
    results.push(assertResult('2Q · Bell 局部纯度=0.5', approx(bellSummary.purity, 0.5), `purity=${bellSummary.purity.toFixed(3)}`));

    let vec3 = zeroStateVector(3);
    vec3 = applyStep(vec3, { key: 'H', target: 0 }, 3);
    vec3 = applyStep(vec3, { key: 'CNOT', control: 0, target: 1 }, 3);
    vec3 = applyStep(vec3, { key: 'CNOT', control: 0, target: 2 }, 3);
    const ghzPass = approx(cAbs2(vec3[0]), 0.5) && approx(cAbs2(vec3[7]), 0.5);
    results.push(assertResult('3Q · GHZ 态', ghzPass, `P(|000⟩)=${cAbs2(vec3[0]).toFixed(3)}, P(|111⟩)=${cAbs2(vec3[7]).toFixed(3)}`));

    let swapVec = zeroStateVector(2);
    swapVec = applyStep(swapVec, { key: 'X', target: 0 }, 2); // |10>
    swapVec = applyStep(swapVec, { key: 'SWAP', a: 0, b: 1 }, 2); // |01>
    results.push(assertResult('2Q · SWAP 把 |10⟩ 变成 |01⟩', approx(cAbs2(swapVec[1]), 1), `P(|01⟩)=${cAbs2(swapVec[1]).toFixed(3)}`));

    let rzVec = zeroStateVector(1);
    rzVec = applyStep(rzVec, { key: 'H', target: 0 }, 1);
    const beforeProb = cAbs2(rzVec[0]);
    rzVec = applyStep(rzVec, { key: 'Rz', target: 0, angle: Math.PI / 3 }, 1);
    results.push(assertResult('1Q · Rz 不改变概率', approx(cAbs2(rzVec[0]), beforeProb), `前后 P(|0⟩)：${beforeProb.toFixed(3)} → ${cAbs2(rzVec[0]).toFixed(3)}`));

    let measureBell = zeroStateVector(2);
    measureBell = applyStep(measureBell, { key: 'H', target: 0 }, 2);
    measureBell = applyStep(measureBell, { key: 'CNOT', control: 0, target: 1 }, 2);
    measureBell = applyStep(measureBell, { key: 'MEASURE', target: 0, outcome: 0, probability: 0.5 }, 2);
    results.push(assertResult('2Q · 测量 Bell 的 q0=0 后坍缩到 |00⟩', approx(cAbs2(measureBell[0]), 1), `P(|00⟩)=${cAbs2(measureBell[0]).toFixed(3)}`));

    let measureAll = zeroStateVector(3);
    measureAll = applyStep(measureAll, { key: 'H', target: 0 }, 3);
    measureAll = applyStep(measureAll, { key: 'CNOT', control: 0, target: 1 }, 3);
    measureAll = applyStep(measureAll, { key: 'CNOT', control: 0, target: 2 }, 3);
    measureAll = applyStep(measureAll, { key: 'MEASURE_ALL', outcomeIndex: 7, outcomeBits: '111', probability: 0.5 }, 3);
    results.push(assertResult('3Q · 全量测量 GHZ 为 |111⟩ 后完全坍缩', approx(cAbs2(measureAll[7]), 1), `P(|111⟩)=${cAbs2(measureAll[7]).toFixed(3)}`));

    const passed = results.filter(Boolean).length;
    testSummary.textContent = `${passed}/${results.length} 项通过`;
    testSummary.className = `test-summary ${passed === results.length ? 'test-pass' : 'test-fail'}`;
  }

  function startLoop() {
    let last = performance.now();
    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      tick(dt);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function bootstrap() {
    qubitCountSelect.value = String(state.qubitCount);
    renderQubitSelectors();
    updateAnglePreview();
    speedValue.textContent = `${Number(speedInput.value).toFixed(2)}s / 步`;
    renderGateButtons();
    renderPresetHandlers();
    bindEvents();
    resizeCanvas();
    recomputeSnapshots();
    setViewerMode('offline');
    syncStateToStep(0);
    runSelfTests();
    startLoop();
    viewerStatus.textContent = '当前为离线本地渲染：无需联网，兼容本地直接打开。';
  }

  bootstrap();
})();
