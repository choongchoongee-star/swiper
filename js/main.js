import { buildDeck } from './deck.js';
import { createState, stageOf, applyEffect, tickHunger, computeScore } from './state.js';
import { roll, rollExtreme, TIER_LABEL } from './resolve.js';
import { catSVG, probeAssets } from './cat.js';
import { judgeEnding, causeOf, DEX, TYPE_COUNT } from './endings.js';
import { tagOf, cardById } from './cards.js';
import { load, recordEnding, submitScore, wouldRank, saveRun, loadRun, clearRun } from './storage.js';

const $ = (sel) => document.querySelector(sel);

const screens = { title: $('#title'), game: $('#game'), ending: $('#ending'), dexview: $('#dexview') };
const els = {
  progress: $('#progress'), score: $('#score'), stats: $('#stats'),
  card: $('#card'), stage: $('#stage-banner'), result: $('#result'),
  hint: $('#hint'),
};

let deck, state, current, busy = false, resultOpen = false;
let lastRun = null; // 엔딩 화면에서 랭킹 등록에 쓸 결과

function show(name) {
  for (const [k, el] of Object.entries(screens)) el.hidden = k !== name;
}

/* ---------- 타이틀 ---------- */

function renderTitle() {
  const data = load();
  $('#title-cat').innerHTML = catSVG({ stage: { key: 'baby', scale: 0.85 }, mood: 'happy' });
  $('#best').textContent = data.best ? `내 최고 기록 ${data.best.toLocaleString()}점` : '아직 기록이 없다';
  $('#dex').textContent = `📖 엔딩 도감 ${collected(data).length} / ${TYPE_COUNT}`;
  $('#recent').innerHTML = rankTable(data.ranks, '명예의 전당');
  renderResume();
  $('#title-inner').className = 'title-inner';
  $('#title-inner').style.transform = '';
  $('#title-inner').style.opacity = '';
  show('title');
}

// 진행 중이던 판이 있으면 이어서 할 수 있게 한다.
function renderResume() {
  const old = $('#resume');
  if (old) old.remove();
  const run = loadRun();
  if (!run) return;
  const btn = document.createElement('button');
  btn.id = 'resume';
  btn.className = 'resume';
  btn.innerHTML = `🐾 이어서 하기<small>${run.state.index} / ${run.state.total}장까지 살았다</small>`;
  btn.addEventListener('click', resumeGame);
  $('#start').after(btn);
}

function collected(data) {
  return data.endings.filter((e) => !e.startsWith('death'));
}

// 모은 엔딩은 그대로, 못 본 엔딩은 물음표로 보여준다.
function renderDex() {
  const data = load();
  const have = new Set(data.endings);
  $('#dex-count').textContent = `${collected(data).length} / ${TYPE_COUNT} 종을 만났다`;
  $('#dex-list').innerHTML = DEX.map((e, i) => {
    if (have.has(e.id)) {
      return `<li class="dex-item got">
        <span class="dex-emoji">${e.emoji}</span>
        <div><b>${e.name}</b><p>${e.desc}</p></div>
      </li>`;
    }
    return `<li class="dex-item">
      <span class="dex-emoji">❔</span>
      <div><b>??? <small>No.${String(i + 1).padStart(2, '0')}</small></b><p>아직 만나지 못한 삶.</p></div>
    </li>`;
  }).join('');
  show('dexview');
}

function rankTable(ranks, title) {
  if (!ranks.length) return '';
  const rows = ranks.map((r, i) => `
    <li>
      <span class="rk">${i + 1}</span>
      <span class="nm">${escapeHtml(r.name)}</span>
      <span class="en">${r.emoji}${r.code ? ` ${r.code}` : ''}</span>
      <b>${r.score.toLocaleString()}</b>
    </li>`).join('');
  return `<h3>${title}</h3><ul class="ranks">${rows}</ul>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ---------- 게임 ---------- */

// ?cards=20 으로 짧게 돌려볼 수 있다. 테스트와 시연용.
function requestedLength() {
  const n = Number(new URLSearchParams(location.search).get('cards'));
  return Number.isFinite(n) && n >= 3 ? Math.min(n, 300) : 100;
}

function startGame() {
  const total = requestedLength();
  deck = buildDeck(total + 30);
  state = createState();
  state.total = total;
  beginRun();
}

function resumeGame() {
  const run = loadRun();
  if (!run) return startGame();
  deck = run.deckIds.map(cardById).filter(Boolean);
  state = { ...createState(), ...run.state };
  beginRun();
}

function beginRun() {
  current = null;
  busy = false;
  lastRun = null;
  hideResult();
  show('game');
  nextCard();
  renderHud();
  persist();
}

function persist() {
  if (state.dead || state.index >= state.total) clearRun();
  else saveRun(state, deck.map((c) => c.id));
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
  els.hint.textContent = card.choices ? '⚡ 좌우로 스와이프해 선택 — 중간은 없다' : '위로 스와이프';
  els.card.querySelectorAll('.choice').forEach((b) =>
    b.addEventListener('click', () => commit(Number(b.dataset.choice))));
}

// 같은 카드가 다시 나와도 같은 문장을 반복하지 않는다.
function pickText(card, tier, t) {
  if (!Array.isArray(t)) return t;
  const key = `${card.id}:${tier}`;
  const used = state.textUse[key] || 0;
  state.textUse[key] = used + 1;
  return t[used % t.length];
}

function commit(choiceIdx = null) {
  if (busy) return;
  const card = current;
  if (card.choices && choiceIdx === null) return; // 선택 카드는 좌우로만 넘어간다
  busy = true;

  const stageBefore = stageOf(state).key;
  let tier = null, eff = null, text = '', label = '';

  const tag = tagOf(card.id);
  if (tag) state.tagCounts[tag] = (state.tagCounts[tag] || 0) + 1;

  if (card.special === 'extend') {
    state.total += 5;
    label = '행운'; text = card.result; eff = {};
  } else if (card.special === 'clover') {
    state.cloverLeft = 3;
    label = '행운'; text = card.result; eff = {};
  } else if (card.calm) {
    label = '평온'; text = card.text; eff = card.calm;
  } else {
    tier = card.choices ? rollExtreme(state, card) : roll(state, card);
    const outcomes = card.choices ? card.choices[choiceIdx].outcomes : card.outcomes;
    eff = outcomes[tier];
    label = TIER_LABEL[tier];
    text = pickText(card, tier, eff.t);
    if (tier === 'great') state.greatCount++;
    if (tier === 'terrible') state.terribleCount++;
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
  persist();
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
  clearRun();
  const score = computeScore(state);
  const ending = judgeEnding(state, score);
  const data = recordEnding(ending);
  lastRun = { ending, score, cards: state.index };

  const highs = state.highlights.slice(-3).reverse()
    .map((h) => `<li class="high high--${h.tier}"><span>${h.emoji}</span><div><b>${h.title} · ${TIER_LABEL[h.tier]}</b><p>${h.text}</p></div></li>`)
    .join('') || '<li class="high"><span>🐾</span><div><b>평온한 삶</b><p>크게 좋을 것도, 나쁠 것도 없는 하루하루였다.</p></div></li>';

  $('#ending-body').innerHTML = `
    <div class="ending-cat">${catSVG({ stage: stageOf(state), mood: state.dead ? 'sad' : 'proud' })}</div>
    <div class="ending-name">${ending.emoji} ${ending.name}</div>
    <p class="ending-desc">${ending.desc}</p>
    <div class="ending-score">${score.toLocaleString()}<small>점</small></div>
    <p class="ending-meta">${state.index}장의 인생 · ${stageOf(state).name}${data.best && score <= data.best ? ` · 최고 ${data.best.toLocaleString()}점` : ' · 🎉 최고 기록!'}</p>
    <h3>기억에 남는 순간</h3>
    <ul class="highs">${highs}</ul>`;

  renderSubmit(score);
  show('ending');
  hideResult();
}

// 오락실처럼 이름을 넣어 랭킹에 올린다.
function renderSubmit(score) {
  const box = $('#submit');
  if (!wouldRank(score)) {
    box.innerHTML = rankTable(load().ranks, '명예의 전당');
    return;
  }
  const last = load().lastName;
  box.innerHTML = `
    <div class="submit-form">
      <p class="submit-title">🏆 랭킹에 오를 점수다!</p>
      <div class="submit-row">
        <input id="rank-name" maxlength="8" placeholder="이름" value="${escapeHtml(last)}" autocomplete="off">
        <button id="rank-go" class="btn btn--sm">등록</button>
      </div>
      <button id="rank-skip" class="link">건너뛰기</button>
    </div>`;
  $('#rank-go').addEventListener('click', doSubmit);
  $('#rank-skip').addEventListener('click', () => {
    box.innerHTML = rankTable(load().ranks, '명예의 전당');
  });
  $('#rank-name').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSubmit();
  });
}

function doSubmit() {
  const name = $('#rank-name').value.trim();
  const { data, rank } = submitScore({ ...lastRun, name });
  $('#submit').innerHTML = `
    <p class="submit-done">${rank}위로 등록됐다!</p>
    ${rankTable(data.ranks, '명예의 전당')}`;
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

// 타이틀도 위로 밀어서 시작한다. 첫 화면에서 조작을 미리 익히게 하는 장치다.
function bindTitleSwipe() {
  const el = $('#title');
  const inner = $('#title-inner');
  let sy = 0, active = false, dy = 0;

  el.addEventListener('pointerdown', (e) => {
    if (e.target.closest('#dex') || e.target.closest('#resume')) return;
    active = true; sy = e.clientY; dy = 0;
    inner.className = 'title-inner';
  });

  el.addEventListener('pointermove', (e) => {
    if (!active) return;
    dy = Math.min(0, e.clientY - sy);
    inner.style.transform = `translateY(${dy * 0.9}px)`;
    inner.style.opacity = String(Math.max(0.35, 1 + dy / 260));
  });

  const end = () => {
    if (!active) return;
    active = false;
    if (dy < -60) return launch();
    inner.className = 'title-inner snap';
    inner.style.transform = '';
    inner.style.opacity = '';
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
}

function launch() {
  const inner = $('#title-inner');
  inner.className = 'title-inner launch';
  inner.style.transform = 'translateY(-120%)';
  inner.style.opacity = '0';
  setTimeout(startGame, 260);
}

document.addEventListener('keydown', (e) => {
  if (!screens.title.hidden && (e.key === 'ArrowUp' || e.key === 'Enter')) return launch();
  if (screens.game.hidden) return;
  if (resultOpen) hideResult();
  if (e.key === 'ArrowUp' && !current?.choices) commit();
  if (e.key === 'ArrowLeft' && current?.choices) commit(0);
  if (e.key === 'ArrowRight' && current?.choices) commit(1);
});

$('#start').addEventListener('click', launch);
$('#dex').addEventListener('click', renderDex);
bindTitleSwipe();
$('#dex-back').addEventListener('click', renderTitle);
$('#retry').addEventListener('click', startGame);
$('#to-title').addEventListener('click', renderTitle);
bindSwipe($('#game'));
probeAssets().then(renderTitle);
