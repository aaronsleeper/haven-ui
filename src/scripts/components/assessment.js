/**
 * Assessment Flow Controller
 *
 * Drives the Intro → Question → Complete flow on assessment.html.
 * Reads assessment ID from URL params. Renders questions one at a time.
 * Supports question types: radio, emoji-scale, slider, yes-no, free-text.
 */

// ── Assessment Definitions (prototype dummy data) ──────────────
const ASSESSMENTS = {
  'phq-2': {
    title: { en: 'How have you been feeling?', es: '¿Cómo se ha sentido?' },
    description: {
      en: 'Two quick questions about your mood over the past two weeks. Your answers help your care team support you.',
      es: 'Dos preguntas rápidas sobre su estado de ánimo en las últimas dos semanas. Sus respuestas ayudan a su equipo de atención a apoyarle.'
    },
    category: 'behavioral',
    icon: 'fa-brain',
    avatarClass: 'avatar-primary',
    estimatedMinutes: 2,
    scoring: { method: 'sum', threshold: 3, followUp: 'phq-9' },
    questions: [
      {
        id: 'q1', type: 'radio',
        text: { en: 'Over the past 2 weeks, how often have you had little interest or pleasure in doing things?', es: 'En las últimas 2 semanas, ¿con qué frecuencia ha tenido poco interés o placer en hacer cosas?' },
        helper: { en: 'Over the past 2 weeks', es: 'En las últimas 2 semanas' },
        options: [
          { value: 0, label: { en: 'Not at all', es: 'Nunca' } },
          { value: 1, label: { en: 'Several days', es: 'Varios días' } },
          { value: 2, label: { en: 'More than half the days', es: 'Más de la mitad de los días' } },
          { value: 3, label: { en: 'Nearly every day', es: 'Casi todos los días' } },
        ]
      },
      {
        id: 'q2', type: 'radio',
        text: { en: 'Over the past 2 weeks, how often have you felt down, depressed, or hopeless?', es: 'En las últimas 2 semanas, ¿con qué frecuencia se ha sentido desanimado/a, deprimido/a, o sin esperanza?' },
        options: [
          { value: 0, label: { en: 'Not at all', es: 'Nunca' } },
          { value: 1, label: { en: 'Several days', es: 'Varios días' } },
          { value: 2, label: { en: 'More than half the days', es: 'Más de la mitad de los días' } },
          { value: 3, label: { en: 'Nearly every day', es: 'Casi todos los días' } },
        ]
      }
    ]
  },

  'mood-checkin': {
    title: { en: 'How are you feeling today?', es: '¿Cómo se siente hoy?' },
    description: {
      en: 'A quick check on how you\'re doing. Takes less than a minute.',
      es: 'Un breve registro de cómo se siente. Toma menos de un minuto.'
    },
    category: 'checkin',
    icon: 'fa-face-smile',
    avatarClass: 'avatar-primary',
    estimatedMinutes: 1,
    isCheckin: true,
    questions: [
      {
        id: 'mood', type: 'emoji-scale',
        text: { en: 'How are you feeling right now?', es: '¿Cómo se siente en este momento?' },
        options: [
          { value: 1, label: { en: 'Awful', es: 'Muy mal' }, emoji: '😫' },
          { value: 2, label: { en: 'Not great', es: 'No muy bien' }, emoji: '😔' },
          { value: 3, label: { en: 'Okay', es: 'Más o menos' }, emoji: '😐' },
          { value: 4, label: { en: 'Good', es: 'Bien' }, emoji: '🙂' },
          { value: 5, label: { en: 'Great', es: 'Muy bien' }, emoji: '😊' },
        ]
      }
    ]
  },

  'hunger-vital-sign': {
    title: { en: 'Food security check-in', es: 'Evaluación de seguridad alimentaria' },
    description: {
      en: 'Two questions to help us understand your food situation. Your answers are confidential.',
      es: 'Dos preguntas para ayudarnos a entender su situación alimentaria. Sus respuestas son confidenciales.'
    },
    category: 'sdoh',
    icon: 'fa-people-group',
    avatarClass: 'avatar-secondary',
    estimatedMinutes: 2,
    scoring: { method: 'flag-any-yes' },
    questions: [
      {
        id: 'hvs1', type: 'yes-no',
        text: {
          en: 'Within the past 12 months, did you worry that your food would run out before you got money to buy more?',
          es: 'En los últimos 12 meses, ¿le preocupó que su comida se acabara antes de tener dinero para comprar más?'
        },
      },
      {
        id: 'hvs2', type: 'yes-no',
        text: {
          en: 'Within the past 12 months, did the food you bought not last and you didn\'t have money to get more?',
          es: 'En los últimos 12 meses, ¿la comida que compró no duró y no tenía dinero para obtener más?'
        },
      }
    ]
  }
};

// ── State ──────────────────────────────────────────────────────
let currentAssessment = null;
let currentQuestionIndex = 0;
let answers = {};
let lang = 'en';

// ── DOM refs ───────────────────────────────────────────────────
const introEl = document.getElementById('assess-intro');
const questionEl = document.getElementById('assess-question');
const completeEl = document.getElementById('assess-complete');
const btnStart = document.getElementById('btn-start');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');
const btnClose = document.getElementById('btn-close');
const questionContainer = document.getElementById('question-container');
const progressText = document.getElementById('question-progress');
const progressFill = document.getElementById('progress-fill');

// ── Helpers ────────────────────────────────────────────────────
function t(obj) {
  if (!obj) return '';
  return obj[lang] || obj.en || '';
}

function showScreen(screen) {
  introEl.style.display = screen === 'intro' ? 'flex' : 'none';
  questionEl.style.display = screen === 'question' ? 'flex' : 'none';
  completeEl.style.display = screen === 'complete' ? 'flex' : 'none';
}

// ── Question Renderers ─────────────────────────────────────────
function renderRadio(q) {
  const name = `q-${q.id}`;
  return q.options.map(opt => `
    <label class="pref-row mb-2">
      <input type="radio" name="${name}" value="${opt.value}" class="sr-only" ${answers[q.id] == opt.value ? 'checked' : ''}>
      <span class="pref-row-indicator pref-row-indicator--circle"><i class="fa-solid fa-check"></i></span>
      <span class="pref-row-label">${t(opt.label)}</span>
    </label>
  `).join('');
}

function renderEmojiScale(q) {
  const name = `q-${q.id}`;
  const items = q.options.map(opt => `
    <label class="emoji-scale-option">
      <input type="radio" name="${name}" value="${opt.value}" class="sr-only" ${answers[q.id] == opt.value ? 'checked' : ''}>
      <span class="emoji-scale-icon">${opt.emoji}</span>
      <span class="emoji-scale-label">${t(opt.label)}</span>
    </label>
  `).join('');
  return `<fieldset class="emoji-scale"><legend class="sr-only">${t(q.text)}</legend>${items}</fieldset>`;
}

function renderYesNo(q) {
  const name = `q-${q.id}`;
  const yesLabel = lang === 'es' ? 'Sí' : 'Yes';
  const noLabel = 'No';
  return `
    <div class="grid grid-cols-2 gap-3">
      <label class="card flex items-center justify-center cursor-pointer p-4 text-center ${answers[q.id] === 'yes' ? 'border-teal-600 bg-teal-50' : ''}" style="min-height: 64px;">
        <input type="radio" name="${name}" value="yes" class="sr-only" ${answers[q.id] === 'yes' ? 'checked' : ''}>
        <span class="text-sm font-semibold">${yesLabel}</span>
      </label>
      <label class="card flex items-center justify-center cursor-pointer p-4 text-center ${answers[q.id] === 'no' ? 'border-teal-600 bg-teal-50' : ''}" style="min-height: 64px;">
        <input type="radio" name="${name}" value="no" class="sr-only" ${answers[q.id] === 'no' ? 'checked' : ''}>
        <span class="text-sm font-semibold">${noLabel}</span>
      </label>
    </div>
  `;
}

function renderSlider(q) {
  const val = answers[q.id] ?? Math.round((q.min + q.max) / 2);
  return `
    <div class="assess-slider">
      <p class="assess-slider-value" aria-live="polite">${val}</p>
      <input type="range" class="assess-slider-track" min="${q.min || 0}" max="${q.max || 10}" value="${val}" step="1" aria-label="${t(q.text)}">
      <div class="assess-slider-labels">
        <span>${t(q.minLabel)}</span>
        <span>${t(q.maxLabel)}</span>
      </div>
    </div>
  `;
}

function renderFreeText(q) {
  const val = answers[q.id] || '';
  return `
    <textarea class="w-full" rows="3" maxlength="500" placeholder="${t(q.placeholder) || ''}">${val}</textarea>
    ${val.length > 400 ? `<p class="text-xs text-right mt-1" style="color: var(--color-sand-400);">${val.length} / 500</p>` : ''}
  `;
}

// ── Slide Transition ───────────────────────────────────────────
function slideTransition(container, direction, callback) {
  const outX = direction === 'forward' ? '-100%' : '100%';
  const inX = direction === 'forward' ? '100%' : '-100%';
  container.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
  container.style.transform = `translateX(${outX})`;
  container.style.opacity = '0';
  setTimeout(() => {
    callback();
    container.style.transition = 'none';
    container.style.transform = `translateX(${inX})`;
    requestAnimationFrame(() => {
      container.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
      container.style.transform = 'translateX(0)';
      container.style.opacity = '1';
    });
  }, 200);
}

// ── Render Question ────────────────────────────────────────────
function renderQuestion(index, direction) {
  const doRender = () => renderQuestionContent(index);
  if (direction && questionContainer.innerHTML) {
    slideTransition(questionContainer, direction, doRender);
  } else {
    doRender();
  }
}

function renderQuestionContent(index) {
  const q = currentAssessment.questions[index];
  const total = currentAssessment.questions.length;

  // Update progress
  if (total > 2) {
    progressText.style.display = '';
    const qLabel = lang === 'es' ? `Pregunta ${index + 1} de ${total}` : `Question ${index + 1} of ${total}`;
    progressText.childNodes[0].textContent = qLabel;
    progressFill.style.width = `${((index + 1) / total) * 100}%`;
    progressText.setAttribute('aria-label', qLabel);
  } else {
    progressText.style.display = 'none';
  }

  // Question text
  let html = `<p class="text-lg font-medium leading-relaxed">${t(q.text)}</p>`;
  if (q.helper) {
    html += `<p class="text-sm mt-1" style="color: var(--color-sand-400);">${t(q.helper)}</p>`;
  }
  html += '<div class="mt-6">';

  // Render by type
  switch (q.type) {
    case 'radio': html += renderRadio(q); break;
    case 'emoji-scale': html += renderEmojiScale(q); break;
    case 'yes-no': html += renderYesNo(q); break;
    case 'slider': html += renderSlider(q); break;
    case 'free-text': html += renderFreeText(q); break;
  }
  html += '</div>';

  questionContainer.innerHTML = html;

  // Update button text
  const isLast = index === total - 1;
  btnNext.textContent = isLast ? (lang === 'es' ? 'Enviar' : 'Submit') : (lang === 'es' ? 'Siguiente' : 'Next');

  // Enable/disable next based on answer
  updateNextState();

  // Listen for answer changes
  questionContainer.querySelectorAll('input[type="radio"]').forEach(input => {
    input.addEventListener('change', () => {
      answers[q.id] = input.value;
      updateNextState();
      // Update yes-no card styling
      if (q.type === 'yes-no') {
        questionContainer.querySelectorAll('label.card').forEach(label => {
          const radio = label.querySelector('input');
          if (radio.checked) {
            label.style.borderColor = 'var(--color-teal-600)';
            label.style.background = 'var(--color-teal-50)';
          } else {
            label.style.borderColor = '';
            label.style.background = '';
          }
        });
      }
    });
  });

  // Slider listener
  const slider = questionContainer.querySelector('.assess-slider-track');
  if (slider) {
    slider.addEventListener('input', () => {
      answers[q.id] = slider.value;
      updateNextState();
    });
    // Reinit slider fill
    const event = new Event('input');
    slider.dispatchEvent(event);
  }

  // Free text listener
  const textarea = questionContainer.querySelector('textarea');
  if (textarea) {
    textarea.addEventListener('input', () => {
      answers[q.id] = textarea.value;
      updateNextState();
    });
  }
}

function updateNextState() {
  const q = currentAssessment.questions[currentQuestionIndex];
  if (q.type === 'slider') {
    // Slider always has a value
    btnNext.disabled = false;
  } else if (q.type === 'free-text') {
    // Free text is always optional in this prototype
    btnNext.disabled = false;
  } else {
    btnNext.disabled = answers[q.id] === undefined;
  }
}

// ── Scoring ────────────────────────────────────────────────────
function calculateScore() {
  if (!currentAssessment.scoring) return null;
  const s = currentAssessment.scoring;

  if (s.method === 'sum') {
    let total = 0;
    currentAssessment.questions.forEach(q => {
      total += parseInt(answers[q.id]) || 0;
    });
    return { total, flagged: s.threshold && total >= s.threshold, followUp: s.followUp };
  }

  if (s.method === 'flag-any-yes') {
    const flagged = currentAssessment.questions.some(q => answers[q.id] === 'yes');
    return { flagged };
  }

  return null;
}

// ── Complete Screen ────────────────────────────────────────────
function showComplete() {
  showScreen('complete');
  const result = calculateScore();

  // Show reassurance if flagged
  const reassurance = document.getElementById('reassurance-card');
  if (result && result.flagged) {
    reassurance.style.display = '';
  }

  // Show follow-up card if applicable
  const followup = document.getElementById('followup-card');
  if (result && result.followUp) {
    followup.style.display = '';
    document.getElementById('btn-followup').addEventListener('click', () => {
      window.location.href = `assessment.html?id=${result.followUp}`;
    });
    // Change Done to outline
    document.getElementById('btn-done').className = 'btn-outline w-full text-center';
    document.getElementById('btn-done').textContent = lang === 'es' ? 'Listo por ahora' : 'Done for now';
  }
}

// ── Init ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const mode = params.get('mode');

  lang = localStorage.getItem('cena-lang') || 'en';

  currentAssessment = ASSESSMENTS[id];
  if (!currentAssessment) {
    introEl.querySelector('.flex-1').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
        <h2>${lang === 'es' ? 'Evaluación no encontrada' : 'Assessment not found'}</h2>
      </div>
    `;
    return;
  }

  // Populate intro
  document.getElementById('intro-title').textContent = t(currentAssessment.title);
  document.getElementById('intro-description').textContent = t(currentAssessment.description);
  const iconEl = document.getElementById('intro-icon');
  iconEl.className = `avatar avatar-xl ${currentAssessment.avatarClass}`;
  iconEl.innerHTML = `<i class="fa-solid ${currentAssessment.icon}"></i>`;

  // Check-in mode: skip intro
  if (mode === 'checkin' || currentAssessment.isCheckin) {
    showScreen('question');
    renderQuestion(0);
  } else {
    showScreen('intro');
  }

  // ── Event Listeners ──
  btnStart.addEventListener('click', () => {
    showScreen('question');
    renderQuestion(0);
  });

  btnNext.addEventListener('click', () => {
    const total = currentAssessment.questions.length;
    if (currentQuestionIndex < total - 1) {
      currentQuestionIndex++;
      renderQuestion(currentQuestionIndex, 'forward');
    } else {
      // Submit
      showComplete();
    }
  });

  btnPrev.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      renderQuestion(currentQuestionIndex, 'back');
    } else {
      // Back to intro (or health hub for check-ins)
      if (mode === 'checkin' || currentAssessment.isCheckin) {
        window.location.href = '/apps/patient/health/index.html';
      } else {
        showScreen('intro');
      }
    }
  });

  btnClose.addEventListener('click', () => {
    window.location.href = '/apps/patient/health/index.html';
  });
});
