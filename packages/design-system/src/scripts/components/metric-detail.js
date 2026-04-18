/**
 * Metric Detail — data-driven trend visualization
 *
 * Reads ?id= from URL, renders the appropriate metric type:
 * - "scored": multi-question assessment with total score (PHQ-2, PHQ-9, GAD-7)
 *   → line chart with severity zone bands, per-question breakdown, score history
 * - "single": single-value check-in (mood, meal satisfaction)
 *   → line chart with emoji Y-axis, emoji history
 * - "binary": yes/no screening (Hunger Vital Sign)
 *   → line chart showing flag count, text history
 */

const METRICS = {
  mood: {
    type: 'single',
    title: { en: 'Mood', es: 'Estado de ánimo' },
    about: {
      en: 'This tracks how you\'ve been feeling day to day. Your care team uses this to understand how you\'re doing between visits.',
      es: 'Esto rastrea cómo se ha sentido día a día. Su equipo de atención usa esto para entender cómo está entre visitas.'
    },
    emojiScale: [
      { value: 1, emoji: '😫', label: { en: 'Awful', es: 'Muy mal' } },
      { value: 2, emoji: '😔', label: { en: 'Not great', es: 'No muy bien' } },
      { value: 3, emoji: '😐', label: { en: 'Okay', es: 'Más o menos' } },
      { value: 4, emoji: '🙂', label: { en: 'Good', es: 'Bien' } },
      { value: 5, emoji: '😊', label: { en: 'Great', es: 'Muy bien' } },
    ],
    history: [
      { date: 'March 28, 2026', value: 4 },
      { date: 'March 21, 2026', value: 4 },
      { date: 'March 14, 2026', value: 3 },
      { date: 'March 7, 2026', value: 3 },
      { date: 'February 28, 2026', value: 2 },
      { date: 'February 21, 2026', value: 3 },
      { date: 'February 14, 2026', value: 2 },
      { date: 'February 7, 2026', value: 1 },
    ],
    trendDirection: 'improving',
  },

  phq2: {
    type: 'scored',
    title: { en: 'Depression Screen', es: 'Evaluación de depresión' },
    about: {
      en: 'The PHQ-2 measures how often you\'ve felt down or lost interest in things over the past two weeks. A score of 0–6 is possible. Lower scores mean you\'re doing well. If the score is 3 or higher, your care team may follow up with additional questions.',
      es: 'El PHQ-2 mide con qué frecuencia se ha sentido desanimado/a o ha perdido interés en las cosas en las últimas dos semanas. Una puntuación de 0 a 6 es posible. Puntuaciones más bajas significan que está bien. Si la puntuación es 3 o más, su equipo de atención puede hacer preguntas adicionales.'
    },
    scoreRange: { min: 0, max: 6 },
    // Zone bands: patient-friendly labels, Haven palette tints
    zones: [
      { min: 0, max: 2, label: { en: 'Doing well', es: 'Va bien' }, color: 'rgba(233, 245, 242, 0.6)' },        // teal-50
      { min: 3, max: 4, label: { en: 'Something to watch', es: 'Algo para observar' }, color: 'rgba(251, 250, 248, 0.8)' }, // sand-50
      { min: 5, max: 6, label: { en: 'Your care team is here to help', es: 'Su equipo está aquí para ayudarle' }, color: 'rgba(252, 235, 230, 0.6)' }, // warm tint
    ],
    questions: [
      { id: 'q1', text: { en: 'Little interest or pleasure in doing things', es: 'Poco interés o placer en hacer cosas' } },
      { id: 'q2', text: { en: 'Feeling down, depressed, or hopeless', es: 'Sentirse desanimado/a, deprimido/a, o sin esperanza' } },
    ],
    optionLabels: [
      { value: 0, label: { en: 'Not at all', es: 'Nunca' } },
      { value: 1, label: { en: 'Several days', es: 'Varios días' } },
      { value: 2, label: { en: 'More than half the days', es: 'Más de la mitad de los días' } },
      { value: 3, label: { en: 'Nearly every day', es: 'Casi todos los días' } },
    ],
    // Each entry: { date, total, answers: { q1: val, q2: val } }
    history: [
      { date: 'March 20, 2026', total: 1, answers: { q1: 0, q2: 1 } },
      { date: 'February 20, 2026', total: 2, answers: { q1: 1, q2: 1 } },
      { date: 'January 20, 2026', total: 3, answers: { q1: 2, q2: 1 } },
      { date: 'December 20, 2025', total: 4, answers: { q1: 2, q2: 2 } },
      { date: 'November 20, 2025', total: 5, answers: { q1: 3, q2: 2 } },
    ],
    trendDirection: 'improving',
  },

  hunger: {
    type: 'binary',
    title: { en: 'Food Security', es: 'Seguridad alimentaria' },
    about: {
      en: 'The Hunger Vital Sign screens for food insecurity — whether you\'ve worried about food running out or not having enough. Your answers help your care team connect you with food assistance resources.',
      es: 'La Evaluación de Seguridad Alimentaria detecta inseguridad alimentaria — si le ha preocupado que la comida se acabe o no tener suficiente. Sus respuestas ayudan a su equipo de atención a conectarle con recursos de asistencia alimentaria.'
    },
    questions: [
      { id: 'hvs1', text: { en: 'Worried food would run out', es: 'Preocupado de que la comida se acabara' } },
      { id: 'hvs2', text: { en: 'Food didn\'t last / couldn\'t afford more', es: 'La comida no duró / no pudo comprar más' } },
    ],
    // Each entry: { date, flagged (boolean), answers: { hvs1: yes/no, hvs2: yes/no } }
    history: [
      { date: 'March 15, 2026', flagged: false, answers: { hvs1: 'no', hvs2: 'no' } },
      { date: 'February 15, 2026', flagged: false, answers: { hvs1: 'no', hvs2: 'no' } },
      { date: 'January 15, 2026', flagged: true, answers: { hvs1: 'yes', hvs2: 'no' } },
      { date: 'December 15, 2025', flagged: true, answers: { hvs1: 'yes', hvs2: 'yes' } },
      { date: 'November 15, 2025', flagged: true, answers: { hvs1: 'yes', hvs2: 'yes' } },
      { date: 'October 15, 2025', flagged: true, answers: { hvs1: 'yes', hvs2: 'no' } },
    ],
    trendDirection: 'improving',
  },
};

// ── Helpers ────────────────────────────────────────────────────
const lang = localStorage.getItem('cena-lang') || 'en';
function t(obj) { return obj?.[lang] || obj?.en || ''; }

function rowHTML(date, valueHTML) {
  return `<div class="flex items-center justify-between py-3" style="border-bottom: 1px solid var(--color-sand-100);">
    <p class="text-sm" style="color: var(--color-sand-600);">${date}</p>
    <span>${valueHTML}</span>
  </div>`;
}

function trendBadgeHTML(direction) {
  const icons = { improving: 'fa-arrow-up', flat: 'fa-arrow-right', worsening: 'fa-arrow-down' };
  const labels = {
    improving: { en: 'Improving', es: 'Mejorando' },
    flat: { en: 'Stable', es: 'Estable' },
    worsening: { en: 'Declining', es: 'Empeorando' },
  };
  const cls = direction === 'improving' ? 'trend-improving' : direction === 'worsening' ? 'trend-worsening' : 'trend-flat';
  return `<span class="trend-badge ${cls}"><i class="fa-solid ${icons[direction]} text-[10px]"></i> ${t(labels[direction])}</span>`;
}

function severityLabel(score, zones) {
  for (const z of zones) {
    if (score >= z.min && score <= z.max) return t(z.label);
  }
  return score;
}

function severityBadge(score, zones) {
  for (const z of zones) {
    if (score >= z.min && score <= z.max) {
      const cls = z.min === 0 ? 'badge-success' : z.max <= 4 ? 'badge-warning' : 'badge-error';
      return `<span class="badge ${cls} badge-sm">${t(z.label)}</span>`;
    }
  }
  return score;
}

// ── Render Functions ───────────────────────────────────────────

function renderSingle(metric) {
  const latest = metric.history[0];
  const scale = metric.emojiScale;
  const item = scale.find(s => s.value === latest.value);

  // Title
  document.getElementById('metric-title').textContent = t(metric.title);

  // Status card
  document.getElementById('metric-current-value').textContent = `${item.emoji} ${t(item.label)}`;
  document.getElementById('metric-last-date').textContent = `Last check-in: ${latest.date}`;
  document.getElementById('metric-trend').innerHTML = trendBadgeHTML(metric.trendDirection);

  // About
  document.getElementById('about-text').textContent = t(metric.about);

  // History
  const historyEl = document.getElementById('history-list');
  historyEl.innerHTML = metric.history.map(h => {
    const s = scale.find(s => s.value === h.value);
    return rowHTML(h.date, `${s.emoji} ${t(s.label)}`);
  }).join('');

  // Chart
  const data = metric.history.slice().reverse().map(h => h.value);
  const labels = metric.history.slice().reverse().map(h => h.date.replace(/, \d{4}$/, '').replace(/\w+ /, ''));
  const emojiTicks = scale.map(s => s.emoji);

  new Chart(document.getElementById('metric-chart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: HAVEN.primary[600],
        backgroundColor: HAVEN.primary[100],
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: HAVEN.primary[600],
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        tension: 0.3,
        fill: true,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => emojiTicks[ctx.parsed.y - 1] || ctx.parsed.y } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 }, color: HAVEN.sand[400] } },
        y: {
          min: 1, max: scale.length,
          grid: { color: HAVEN.sand[100] },
          ticks: { stepSize: 1, font: { size: 11 }, color: HAVEN.sand[400], callback: (v) => emojiTicks[v - 1] || '' }
        }
      }
    }
  });
}

function renderScored(metric) {
  const latest = metric.history[0];

  // Title
  document.getElementById('metric-title').textContent = t(metric.title);

  // Status card — total score + severity label
  const label = severityLabel(latest.total, metric.zones);
  document.getElementById('metric-current-value').textContent = label;
  document.getElementById('metric-last-date').textContent = `Score: ${latest.total} of ${metric.scoreRange.max} · ${latest.date}`;
  document.getElementById('metric-trend').innerHTML = trendBadgeHTML(metric.trendDirection);

  // About
  document.getElementById('about-text').textContent = t(metric.about);

  // Per-question breakdown (last submission)
  const breakdownEl = document.getElementById('question-breakdown');
  const breakdownList = document.getElementById('breakdown-list');
  breakdownEl.style.display = '';
  breakdownList.innerHTML = metric.questions.map(q => {
    const answerVal = latest.answers[q.id];
    const optLabel = metric.optionLabels?.find(o => o.value === answerVal);
    return `<div class="flex items-start justify-between py-2" style="border-bottom: 1px solid var(--color-sand-100);">
      <p class="text-sm flex-1 pr-3" style="color: var(--color-sand-600);">${t(q.text)}</p>
      <span class="text-sm font-medium shrink-0">${optLabel ? t(optLabel.label) : answerVal}</span>
    </div>`;
  }).join('');

  // History — show total score + severity badge per entry
  const historyEl = document.getElementById('history-list');
  historyEl.innerHTML = metric.history.map(h => {
    return rowHTML(h.date, `<span class="text-sm font-medium mr-2">${h.total}</span>${severityBadge(h.total, metric.zones)}`);
  }).join('');

  // Chart — line with zone band annotations
  const data = metric.history.slice().reverse().map(h => h.total);
  const labels = metric.history.slice().reverse().map(h => h.date.replace(/, \d{4}$/, '').replace(/\w+ /, ''));

  const annotations = {};
  metric.zones.forEach((z, i) => {
    annotations[`zone${i}`] = {
      type: 'box',
      yMin: z.min - 0.5,
      yMax: z.max + 0.5,
      backgroundColor: z.color,
      borderWidth: 0,
      label: {
        display: true,
        content: t(z.label),
        position: 'start',
        font: { size: 9, weight: 'normal' },
        color: HAVEN.sand[400],
        padding: 4,
      }
    };
  });

  new Chart(document.getElementById('metric-chart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: HAVEN.primary[600],
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 6,
        pointBackgroundColor: HAVEN.primary[600],
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        tension: 0.3,
        fill: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        annotation: { annotations },
        tooltip: {
          callbacks: {
            label: (ctx) => `Score: ${ctx.parsed.y} — ${severityLabel(ctx.parsed.y, metric.zones)}`
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 }, color: HAVEN.sand[400] } },
        y: {
          min: metric.scoreRange.min,
          max: metric.scoreRange.max,
          grid: { display: false },
          ticks: {
            stepSize: 1,
            font: { size: 10 },
            color: HAVEN.sand[400],
          }
        }
      }
    }
  });
}

function renderBinary(metric) {
  const latest = metric.history[0];

  // Title
  document.getElementById('metric-title').textContent = t(metric.title);

  // Status card
  const statusText = latest.flagged
    ? (lang === 'es' ? 'Necesidad identificada' : 'Need identified')
    : (lang === 'es' ? 'Sin preocupaciones' : 'No concerns');
  document.getElementById('metric-current-value').textContent = statusText;
  document.getElementById('metric-last-date').textContent = latest.date;
  document.getElementById('metric-trend').innerHTML = trendBadgeHTML(metric.trendDirection);

  // About
  document.getElementById('about-text').textContent = t(metric.about);

  // Per-question breakdown
  const breakdownEl = document.getElementById('question-breakdown');
  const breakdownList = document.getElementById('breakdown-list');
  breakdownEl.style.display = '';
  breakdownList.innerHTML = metric.questions.map(q => {
    const val = latest.answers[q.id];
    const displayVal = val === 'yes' ? (lang === 'es' ? 'Sí' : 'Yes') : 'No';
    const color = val === 'yes' ? 'var(--color-warning-600)' : 'var(--color-success-600)';
    return `<div class="flex items-start justify-between py-2" style="border-bottom: 1px solid var(--color-sand-100);">
      <p class="text-sm flex-1 pr-3" style="color: var(--color-sand-600);">${t(q.text)}</p>
      <span class="text-sm font-medium shrink-0" style="color: ${color};">${displayVal}</span>
    </div>`;
  }).join('');

  // History
  const historyEl = document.getElementById('history-list');
  historyEl.innerHTML = metric.history.map(h => {
    const badge = h.flagged
      ? '<span class="badge badge-warning badge-sm">' + (lang === 'es' ? 'Necesidad' : 'Need identified') + '</span>'
      : '<span class="badge badge-success badge-sm">' + (lang === 'es' ? 'Sin preocupaciones' : 'No concerns') + '</span>';
    return rowHTML(h.date, badge);
  }).join('');

  // Chart — flags over time (1 = flagged, 0 = clear)
  const data = metric.history.slice().reverse().map(h => h.flagged ? 1 : 0);
  const labels = metric.history.slice().reverse().map(h => h.date.replace(/, \d{4}$/, '').replace(/\w+ /, ''));

  new Chart(document.getElementById('metric-chart'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: HAVEN.primary[600],
        backgroundColor: HAVEN.primary[100],
        borderWidth: 2,
        pointRadius: 6,
        pointBackgroundColor: data.map(d => d ? HAVEN.warning[500] : HAVEN.success[500]),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        tension: 0,
        fill: true,
        stepped: true,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ctx.parsed.y === 1 ? 'Need identified' : 'No concerns'
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 }, color: HAVEN.sand[400] } },
        y: {
          min: -0.2, max: 1.2,
          grid: { display: false },
          ticks: {
            stepSize: 1,
            font: { size: 10 },
            color: HAVEN.sand[400],
            callback: (v) => v === 0 ? 'Clear' : v === 1 ? 'Flagged' : ''
          }
        }
      }
    }
  });
}

// ── Init ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const id = new URLSearchParams(window.location.search).get('id');
  const metric = METRICS[id];

  if (!metric) {
    document.getElementById('metric-current-value').textContent = 'Metric not found';
    return;
  }

  switch (metric.type) {
    case 'single': renderSingle(metric); break;
    case 'scored': renderScored(metric); break;
    case 'binary': renderBinary(metric); break;
  }
});
