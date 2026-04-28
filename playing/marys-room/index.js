const body = document.body;
const phaseLabel = document.getElementById('phase-label');
const progressFill = document.getElementById('progress-fill');
const tags = document.querySelectorAll('.tag');
const statusPill = document.getElementById('status-pill');
const advanceBtn = document.getElementById('advance-btn');
const restartBtn = document.getElementById('restart-btn');
const revealBtn = document.getElementById('reveal-btn');
const quizSection = document.getElementById('quiz-section');
const revealSection = document.getElementById('reveal-section');
const stepKicker = document.getElementById('step-kicker');
const stepTitle = document.getElementById('step-title');
const stepDescription = document.getElementById('step-description');
const predictionOptions = document.querySelectorAll('.choice-card');
const predictionFeedback = document.getElementById('prediction-feedback');
const summaryText = document.getElementById('summary-text');
const appleTitle = document.getElementById('apple-title');
const appleDesc = document.getElementById('apple-desc');

let phase = 1;
let selectedPrediction = '';

const stepContent = {
  1: {
    bodyClass: 'phase-room',
    label: '阶段 1 / 3：黑白房间',
    status: '仅有物理知识',
    stepKicker: '阶段 1',
    title: '先理解前提',
    description: '玛丽掌握颜色视觉的所有物理知识，但她始终没有第一人称的颜色经验。此时，问题被建立起来了。',
    appleTitle: '目标对象：苹果',
    appleDesc: '她知道它会反射哪些波长，也知道大脑如何处理这些输入，但仍未见过“红”作为一种主观感受。',
    advanceText: '开始实验：进入预判',
    showQuiz: false,
    showReveal: false
  },
  2: {
    bodyClass: 'phase-quiz',
    label: '阶段 2 / 3：做出预判',
    status: '提出你的判断',
    stepKicker: '阶段 2',
    title: '先站队，再体验',
    description: '你需要在看到结果之前表态：主观体验是否会带来新的认识？这一步能让思想实验从“读题”变成“参与”。',
    appleTitle: '她知道红色的全部事实',
    appleDesc: '但“知道事实”是否已经包含“看见红色是什么感觉”？请先做你的预判。',
    advanceText: '已进入预判区',
    showQuiz: true,
    showReveal: false
  },
  3: {
    bodyClass: 'phase-reveal',
    label: '阶段 3 / 3：第一次看到红色',
    status: '获得第一人称体验',
    stepKicker: '阶段 3',
    title: '体验被真正点亮',
    description: '现在不只是“红色存在”，而是“红色被经验到”。思想实验的冲击力，来自这个主观体验是否算一种新知识。',
    appleTitle: '第一次经验到“红”',
    appleDesc: '苹果还是那个苹果，物理事实也没有改变，变化的是玛丽终于拥有了“红色看起来是什么样”的感受。',
    advanceText: '实验已完成',
    showQuiz: true,
    showReveal: true
  }
};

const feedbackMap = {
  new: '你认为玛丽会学到新的东西，这通常对应“体验不能被纯说明完全替代”的直觉。',
  none: '你认为玛丽不会学到新的东西，这更接近一种强物理主义立场：完整事实知识已经足够。',
  unsure: '你选择保留判断，这很合理，因为这个思想实验本来就在逼近意识哲学最难回答的边界。'
};

function updateTags(currentPhase) {
  tags.forEach((tag, index) => {
    tag.classList.toggle('active', index < currentPhase);
  });
}

function updatePhase(nextPhase) {
  phase = nextPhase;
  const content = stepContent[phase];

  body.className = content.bodyClass;
  phaseLabel.textContent = content.label;
  statusPill.textContent = content.status;
  stepKicker.textContent = content.stepKicker;
  stepTitle.textContent = content.title;
  stepDescription.textContent = content.description;
  appleTitle.textContent = content.appleTitle;
  appleDesc.textContent = content.appleDesc;
  advanceBtn.textContent = content.advanceText;
  advanceBtn.disabled = phase !== 1;

  progressFill.style.width = `${(phase / 3) * 100}%`;
  updateTags(phase);

  quizSection.classList.toggle('hidden', !content.showQuiz);
  revealSection.classList.toggle('hidden', !content.showReveal);
}

function setPrediction(choice) {
  selectedPrediction = choice;

  predictionOptions.forEach((option) => {
    option.classList.toggle('selected', option.dataset.choice === choice);
  });

  predictionFeedback.textContent = feedbackMap[choice];
  revealBtn.disabled = false;
}

function buildSummary(choice) {
  const summaries = {
    new: '你在实验开始前就判断：玛丽第一次看到红色时，会获得一种此前没有的内容。升级后的演示把这个差别明确拆成了“第三人称说明”与“第一人称感受”的对照，因此你的判断会被进一步强化：她不是多背了一条事实，而是第一次拥有了某种体验。',
    none: '你在实验开始前判断：玛丽不会学到真正新的东西，因为她本就知道全部事实。升级后的演示会让这个立场更清晰——你可以把“第一次见到红色”理解为既有知识的实例化，而不是一种额外的知识类型。',
    unsure: '你在实验开始前选择保留判断。这个结果很贴合思想实验本身的价值：它并不急着给答案，而是逼你面对一个难题——完整描述大脑过程，是否就等于穷尽了主观经验本身？'
  };

  return summaries[choice] || '请先完成你的预判，然后再查看实验摘要。';
}

advanceBtn.addEventListener('click', () => {
  updatePhase(2);
  quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

predictionOptions.forEach((option) => {
  option.addEventListener('click', () => setPrediction(option.dataset.choice));
});

revealBtn.addEventListener('click', () => {
  if (!selectedPrediction) return;

  updatePhase(3);
  summaryText.textContent = buildSummary(selectedPrediction);
  revealSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

restartBtn.addEventListener('click', () => {
  selectedPrediction = '';
  predictionOptions.forEach((option) => option.classList.remove('selected'));
  predictionFeedback.textContent = '请选择一个立场，系统会记录你的预判，并在最后生成你的思考摘要。';
  summaryText.textContent = '等待你的选择生成总结。';
  revealBtn.disabled = true;
  updatePhase(1);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

updatePhase(1);
