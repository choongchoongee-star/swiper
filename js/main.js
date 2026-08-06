import { buildDeck } from './deck.js';
import { createState, stageOf, applyEffect, tickHunger, computeScore } from './state.js';
import { roll, TIER_LABEL } from './resolve.js';
import { catSVG } from './cat.js';
import { judgeEnding, causeOf, ENDINGS } from './endings.js';
import { load, record } from './storage.js';

const $ = (sel) => document.querySelector(sel);

const screens = { title: $('#title'), game: $('#game'), ending: $('#ending') };
const els = {
  progress: $('#progress'), score: $('#score'), stats: $('#stats'),
  card: $('#card'), stage: $('#stage-banner'), result: $('#result'),
  hint: $('#hint'),
};

let deck, state, current, busy = false, resultOpen = false;

function show(name) {
  for (const [k, el] of Object.entries(screens)) el.hidden = k !== name;
}

/* ---------- 타이틀 ---------- */

function renderTitle() {
  const data = load();
  $('#title-cat').innerHTML = catSVG({ stage: { key: 'baby', scale: 0.85 }, mood: 'happy' });
  $('#best').textContent = data.best ? `내 최고 기록 ${data.best.toLocaleString()}점` : '아직 기록이 없다';
  $('#dex').textContent = `엔딩 도감 ${data.endings.filter((e) => !e.startsWith('death')).length} / ${ENDINGS.length}`;
  const runs = data.runs.length
    ? data.runs.map((r) => `<li><span>${r.emoji} ${r.ending}</span><b>${r.score.toLocaleString()}</b></li>`).join('')
    : '';
  $('#recent').innerHTML = runs ? `<h3>최근 기록</h3><ul>${runs}</ul>` : '';
  show('title');
}

/* ---------- 게임 ---------- */

function startGame() {
  deck = buildDeck(140);
  state = createState();
  current = null;
  busy = false;
  hideResult();
  show('game');
  nextCard();
  renderHud();
}

function renderHud() {
  els.progress.textContent = `${Math.min(state.index + 1, state.total)} / ${state.total}`;
  els.score.textContent = computeScore(state).toLocaleString();
  els.stats.innerHTML = [
    ['❤️', state.hp, 'hp'], ['😊', state.hap, 'hap'], ['🪶', state.abi, 'abi'],
    ['😺', state.fri, 'fri'], ['✨', state.exp, 'exp'],
  ].map(([icon, v, k]) => `<span class="stat stat--${k}"><i>${icon}</i>${v}</span>`).join('');
  document.body.style.setProperty('--tint', stageOf(state).tint);
}

function nextCard() {
  if (state.dead || state.index >= state.total || state.index >= deck.length) return finish();
  current = deck[state.index];
  renderCard(current);
}

function renderCard(card) {
  const stage = stageOf(state);
  const choices = card.choices
    ? `<div class="choices">
         <button class="choice" data-choice="0"><span>←</span>${card.choices[0].label}</button>
         <button class="choice" data-choice="1">${card.choices[1].label}<span>→</span></button>
       </div>`
    : '';
  els.card.className = `card card--${card.tone || 'calm'}${card.special ? ' card--special' : ''}`;
  els.card.innerHTML = `
    <div class="card-emoji">${card.emoji}</div>
    <h2 class="card-title">${card.title}</h2>
    <p class="card-text">${card.text}</p>
    <div class="card-cat">${catSVG({ stage, mood: 'idle' })}</div>
    ${choices}`;
  els.hint.textContent = card.choices ? '좌우로 스와이프해 선택' : '위로 스와이프';
  els.card.querySelectorAll('.choice').forEach((b) =>
    b.addEventListener('click', () => commit(Number(b.dataset.choice))));
}

function commit(choiceIdx = null) {
  if (busy) return;
  const card = current;
  if (card.choices && choiceIdx === null) return; // 선택 카드는 좌우로만 넘어간다
  busy = true;

  const stageBefore = stageOf(state).key;
  let tier = null, eff = null, text = '', label = '';

  if (card.special === 'extend') {
    state.total += 5;
    label = '행운'; text = card.result; eff = {};
  } else if (card.special === 'clover') {
    state.cloverLeft = 3;
    label = '행운'; text = card.result; eff = {};
  } else if (card.calm) {
    label = '평온'; text = card.text; eff = card.calm;
  } else {
    tier = roll(state, card);
    const outcomes = card.choices ? card.choices[choiceIdx].outcomes : card.outcomes;
    eff = outcomes[tier];
    label = TIER_LABEL[tier];
    text = eff.t;
    if (tier === 'great') state.greatCount++;
    if (tier === 'great' || tier === 'terrible') {
      state.highlights.push({ emoji: card.emoji, title: card.title, tier, text });
    }
  }

  const delta = applyEffect(state, eff);
  tickHunger(state);
  if (state.cloverLeft > 0) state.cloverLeft--;

  state.index++;
  if (state.hp <= 0) {
    state.dead = true;
    state.deathCause = causeOf(card.id);
  }

  renderHud();
  flyOutCard(tier);
  showResult({ label, tier, text, delta, mood: eff.mood });

  const stageAfter = stageOf(state).key;
  const grew = stageBefore !== stageAfter;

  setTimeout(() => {
    if (state.dead) return finish();
    if (grew) return announceStage(stageAfter);
    nextCard();
    busy = false;
  }, 380);
}

function flyOutCard(tier) {
  els.card.classList.add('card--out');
  if (tier === 'great') flash('flash--great');
  if (tier === 'terrible') { flash('flash--terrible'); buzz(60); }
  setTimeout(() => els.card.classList.remove('card--out'), 360);
}

function flash(cls) {
  const el = $('#flash');
  el.className = cls;
  requestAnimationFrame(() => { el.className = `${cls} on`; });
  setTimeout(() => { el.className = ''; }, 420);
}

function buzz(ms) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

function showResult({ label, tier, text, delta, mood }) {
  const chips = [
    ['❤️', delta.hp], ['😊', delta.hap], ['🪶', delta.abi],
    ['😺', delta.fri], ['✨', delta.exp], ['💰', delta.score],
  ].filter(([, v]) => v)
    .map(([i, v]) => `<span class="chip ${v > 0 ? 'up' : 'down'}">${i} ${v > 0 ? '+' : ''}${v}</span>`)
    .join('');

  els.result.className = `result show result--${tier || 'calm'}`;
  els.result.innerHTML = `
    <div class="result-cat">${catSVG({ stage: stageOf(state), mood: mood || 'idle' })}</div>
    <div class="result-body">
      <span class="result-label">${label}</span>
      <p class="result-text">${text}</p>
      <div class="chips">${chips}</div>
    </div>`;
  resultOpen = true;
}

function hideResult() {
  els.result.className = 'result';
  resultOpen = false;
}

function announceStage(key) {
  const stage = stageOf(state);
  els.stage.innerHTML = `<div class="stage-inner">${catSVG({ stage, mood: 'proud' })}<b>${stage.emoji} ${stage.name}이(가) 되었다</b></div>`;
  els.stage.classList.add('show');
  buzz([30, 60, 30]);
  setTimeout(() => {
    els.stage.classList.remove('show');
    nextCard();
    busy = false;
  }, 1600);
}

/* ---------- 엔딩 ---------- */

function finish() {
  const ending = judgeEnding(state);
  const score = computeScore(state);
  const data = record({ score, ending, cards: state.index });

  const highs = state.highlights.slice(-3).reverse()
    .map((h) => `<li class="high high--${h.tier}"><span>${h.emoji}</span><div><b>${h.title} · ${TIER_LABEL[h.tier]}</b><p>${h.text}</p></div></li>`)
    .join('') || '<li class="high"><span>🐾</span><div><b>평온한 삶</b><p>크게 좋을 것도, 나쁠 것도 없는 하루하루였다.</p></div></li>';

  $('#ending-body').innerHTML = `
    <div class="ending-cat">${catSVG({ stage: stageOf(state), mood: state.dead ? 'sad' : 'proud' })}</div>
    <div class="ending-name">${ending.emoji} ${ending.name}</div>
    <p class="ending-desc">${ending.desc}</p>
    <div class="ending-score">${score.toLocaleString()}<small>점</small></div>
    <p class="ending-meta">${state.index}장의 인생 · ${stageOf(state).name}${data.best === score ? ' · 🎉 최고 기록!' : ` · 최고 ${data.best.toLocaleString()}점`}</p>
    <h3>기억에 남는 순간</h3>
    <ul class="highs">${highs}</ul>`;
  show('ending');
  hideResult();
}

/* ---------- 입력 ---------- */

function bindSwipe(target) {
  let sx = 0, sy = 0, active = false;

  target.addEventListener('pointerdown', (e) => {
    if (resultOpen) hideResult();
    if (busy) return;
    active = true; sx = e.clientX; sy = e.clientY;
    els.card.classList.add('card--drag');
  });

  target.addEventListener('pointermove', (e) => {
    if (!active) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    els.card.style.transform = `translate(${current?.choices ? dx * 0.6 : 0}px, ${Math.min(dy, 40)}px) rotate(${current?.choices ? dx * 0.02 : 0}deg)`;
  });

  const end = (e) => {
    if (!active) return;
    active = false;
    els.card.classList.remove('card--drag');
    els.card.style.transform = '';
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (current?.choices) {
      if (dx < -60) commit(0);
      else if (dx > 60) commit(1);
    } else if (dy < -50) {
      commit();
    }
  };
  target.addEventListener('pointerup', end);
  target.addEventListener('pointercancel', () => { active = false; els.card.style.transform = ''; });
}

document.addEventListener('keydown', (e) => {
  if (screens.game.hidden) return;
  if (resultOpen) hideResult();
  if (e.key === 'ArrowUp' && !current?.choices) commit();
  if (e.key === 'ArrowLeft' && current?.choices) commit(0);
  if (e.key === 'ArrowRight' && current?.choices) commit(1);
});

$('#start').addEventListener('click', startGame);
$('#retry').addEventListener('click', startGame);
$('#to-title').addEventListener('click', renderTitle);
bindSwipe($('#game'));
renderTitle();
