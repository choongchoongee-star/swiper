import { buildDeck } from './deck.js';
import { createState, stageOf, lockStage, applyEffect, tickHunger, computeScore } from './state.js';
import { roll, rollExtreme, TIER_LABEL } from './resolve.js';
import { catSVG, probeAssets, MOODS } from './cat.js';
import { judgeEnding, causeOf, DEX, TYPE_COUNT, ENDINGS, RESCUE_ENDINGS } from './endings.js';
import { tagOf, cardById } from './cards.js';
import { playGreat, playTerrible, isMuted, toggleMute } from './sfx.js';
import { load, recordEnding, recordBest, submitScore, wouldRank, saveRun, loadRun, clearRun, markAutoIntroSeen, markDexDoneSeen } from './storage.js';
import { isOn as rankOn, fetchTop, pushScore, RANK_SIZE } from './rank.js';

const $ = (sel) => document.querySelector(sel);

const screens = { title: $('#title'), game: $('#game'), ending: $('#ending'), dexview: $('#dexview'), shareview: $('#shareview'), dexdone: $('#dexdone') };
const els = {
  progress: $('#progress'), score: $('#score'), stats: $('#stats'),
  card: $('#card'), stage: $('#stage-banner'), result: $('#result'),
  hint: $('#hint'),
};

// 선택 한 번이 성향에 더해주는 양.
// 스탯마다 자라는 규모가 달라서(동료는 한 자릿수, 경험치는 세 자릿수) 각자의 크기에 맞춰 잡았다.
// 한 판에 여덟 번쯤 나오므로 꾸준히 한쪽만 고르면 그 성향이 확실히 앞선다.
const STAT_META = {
  hp: { icon: '❤️', name: '체력', gain: 6, desc: '0이 되면 사람에게 구조되어 길 생활이 끝난다. 카드를 넘길 때마다 1씩 준다.' },
  hap: { icon: '😊', name: '행복', gain: 12, desc: '사람과 햇볕, 다정한 순간으로 쌓인다.' },
  abi: { icon: '🪶', name: '능력', gain: 5, desc: '사냥과 위기 회피의 성공 확률을 올린다.' },
  exp: { icon: '✨', name: '경험치', gain: 20, desc: '성장 단계를 앞당기고 점수에서 가장 큰 몫을 차지한다.' },
};

const AUTO_INTERVAL = 2000;

let deck, state, current, busy = false, resultOpen = false;
let resolved = false;  // 지금 화면의 카드가 이미 판정됐나
let grew = null;       // 이번 카드로 올라간 성장 단계 (넘길 때 배너로 알린다)
let autoTimer = null;
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
  // 전역 랭킹은 늦게 와도 되므로 기기 기록을 먼저 그려두고, 도착하면 갈아 끼운다.
  if (rankOn()) {
    fetchTop().then((top) => {
      if (top && !screens.title.hidden) $('#recent').innerHTML = rankTable(top, '명예의 전당');
    });
  }
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
  btn.innerHTML = `🐾 이어서 하기<small>${run.state.total}장 중 ${run.state.index}장을 넘겼다</small>`;
  btn.addEventListener('click', resumeGame);
  $('#start').after(btn);
}

function collected(data) {
  return data.endings.filter((e) => !e.startsWith('rescue') && !e.startsWith('death'));
}

// 엔딩 그림은 있으면 쓰고, 없으면 이모지로 둔다.
// assets/endings/<엔딩 id>.png 를 한 장씩 넣는 대로 반영된다.
function endingArt(ending, cls) {
  return `<img class="${cls}" src="assets/endings/${ending.id}.png"
    alt="" loading="lazy" data-emoji="${ending.emoji}">`;
}

function wireArtFallback(root) {
  root.querySelectorAll('img[data-emoji]').forEach((img) => {
    img.addEventListener('error', () => {
      const span = document.createElement('span');
      span.className = img.className.replace('-art', '-emoji');
      span.textContent = img.dataset.emoji;
      img.replaceWith(span);
    }, { once: true });
  });
}

// 모은 엔딩은 그대로, 못 본 엔딩은 물음표로 보여준다.
function renderDex() {
  const data = load();
  const have = new Set(data.endings);
  $('#dex-count').textContent = `${collected(data).length} / ${TYPE_COUNT} 종을 만났다`;
  $('#dex-list').innerHTML = DEX.map((e, i) => {
    if (have.has(e.id)) {
      return `<li class="dex-item got">
        ${endingArt(e, 'dex-art')}
        <div><b>${e.name}</b><p>${e.desc}</p>
        ${e.hint ? `<p class="dex-hint">조건 · ${e.hint}</p>` : ''}</div>
      </li>`;
    }
    return `<li class="dex-item">
      <span class="dex-emoji">❔</span>
      <div><b>??? <small>No.${String(i + 1).padStart(2, '0')}</small></b>
      <p class="dex-hint">힌트 · ${e.hint || '아직 만나지 못한 삶.'}</p></div>
    </li>`;
  }).join('');
  wireArtFallback($('#dex-list'));
  show('dexview');
}

// 명예의 전당은 남이 서버에 넣은 값을 그린다. 전부 남의 글씨라고 보고 다룬다.
function rankTable(ranks, title) {
  if (!Array.isArray(ranks) || !ranks.length) return '';
  const rows = ranks.map((r, i) => {
    const name = escapeHtml(String(r?.name ?? '')).slice(0, 40) || '이름없음';
    // 이모지 자리에는 글자 몇 개만 허용한다. 태그가 들어와도 그냥 글씨로 보이게 이스케이프한다.
    const emoji = escapeHtml([...String(r?.emoji ?? '🐾')].slice(0, 2).join(''));
    const score = Number(r?.score);
    return `
    <li>
      <span class="rk">${i + 1}</span>
      <span class="nm">${name}</span>
      <span class="en">${emoji}</span>
      <b>${Number.isFinite(score) ? score.toLocaleString() : 0}</b>
    </li>`;
  }).join('');
  return `<h3>${escapeHtml(title)}</h3><ul class="ranks">${rows}</ul>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ---------- 게임 ---------- */

// ?cards=20 으로 짧게 돌려볼 수 있다. 테스트와 시연용.
function requestedLength() {
  const n = Number(new URLSearchParams(location.search).get('cards'));
  return Number.isFinite(n) && n >= 3 ? Math.floor(Math.min(n, 300)) : 50;
}

function startGame() {
  const total = requestedLength();
  deck = buildDeck(total + 30, total);
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
  resolved = false;
  grew = null;
  lastRun = null;
  hideResult();
  setAuto(false);
  // 표정과 이펙트는 판이 시작될 때 한 번에 받아둔다
  preload([...MOODS.map((m) => `assets/cat-${m}.png`),
    'assets/fx/great.png', 'assets/fx/terrible.png', 'assets/crown.png']);
  show('game');
  // 선택 결과 카드를 보던 중에 나갔다면 그 카드부터 다시 보여준다.
  if (state.pending) showPending();
  else nextCard();
  renderHud();
  persist();
  introduceAuto();
}

// 처음 열렸을 때 한 번만 알려준다.
function introduceAuto() {
  if (!autoUnlocked()) return;
  const data = load();
  if (data.autoIntroSeen) return;
  markAutoIntroSeen();
  showToast(`<b>▶ 자동으로 넘기기</b>
    <p>이제 2초에 한 장씩 저절로 넘어가게 할 수 있다. 아래 버튼으로 켜고 끈다.<br>
    자동일 때 좌우 선택은 <b>무작위</b>로 정해지니, 성향을 노릴 때는 직접 넘기는 게 낫다.</p>`);
}

function persist() {
  if (state.rescued || state.index >= state.total) clearRun();
  else saveRun(state, deck.map((c) => c.id));
}

function renderHud() {
  // 선택 결과 카드는 방금 넘긴 그 카드의 결과이므로 번호를 앞당기지 않는다.
  const shown = (resolved || state.pending) ? state.index : state.index + 1;
  els.progress.textContent = `${Math.min(shown, state.total)} / ${state.total}`;
  els.score.textContent = computeScore(state).toLocaleString();
  els.stats.innerHTML = [
    ['❤️', state.hp, 'hp'], ['😊', state.hap, 'hap'],
    ['🪶', state.abi, 'abi'], ['✨', state.exp, 'exp'],
  ].map(([icon, v, k]) => `<span class="stat stat--${k}"><i>${icon}</i>${v}</span>`).join('');
  document.body.style.setProperty('--tint', stageOf(state).tint);
}

// 그림이 카드보다 늦게 뜨면 글씨만 먼저 보여 어색하다.
// 앞으로 나올 카드의 그림을 미리 받아두고 브라우저 캐시에 올려둔다.
const preloaded = new Map();

function preload(urls) {
  for (const url of urls) {
    if (preloaded.has(url)) continue;
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    preloaded.set(url, img);
  }
}

function preloadAhead(from, count = 5) {
  const urls = [];
  for (let i = from; i < Math.min(from + count, deck.length); i++) {
    urls.push(`assets/cards/${deck[i].id}.png`);
    // 선택 카드는 고르자마자 결과 카드가 이어지므로 양쪽 결과 그림도 미리 받아둔다.
    if (deck[i].choices) urls.push(`assets/cards/${deck[i].id}_0.png`, `assets/cards/${deck[i].id}_1.png`);
  }
  preload(urls);
}

function nextCard() {
  if (state.rescued || state.index >= state.total || state.index >= deck.length) return finish();
  current = deck[state.index];
  resolved = false;
  renderCard(current);
  preloadAhead(state.index + 1);
  // 선택 카드가 아니면 카드가 뜨는 순간 바로 판정하고 결과를 함께 보여준다.
  // 스와이프는 「이 장면을 겪는다」가 아니라 「다음 장으로 넘긴다」는 뜻이 된다.
  if (!current.choices) resolveCard(current);
}

function renderCard(card) {
  const stage = stageOf(state);
  const leanTag = (c) => {
    const m = STAT_META[c.lean?.stat];
    return m ? `<small class="lean">${m.icon} ${m.name}</small>` : '';
  };
  const choices = card.choices
    ? `<div class="choices">
         <button class="choice" data-choice="0">
           <span class="arrow">←</span><b>${card.choices[0].label}</b>${leanTag(card.choices[0])}
         </button>
         <button class="choice" data-choice="1">
           <span class="arrow">→</span><b>${card.choices[1].label}</b>${leanTag(card.choices[1])}
         </button>
       </div>`
    : '';
  els.card.className = `card card--${card.tone || 'calm'}${card.special ? ' card--special' : ''}${card.isResult ? ' card--result' : ''}`;
  els.card.innerHTML = `
    <div class="card-emoji">${card.emoji}</div>
    <h2 class="card-title">${card.title}</h2>
    <p class="card-text">${card.text}</p>
    <div class="card-cat">
      <img class="card-art" src="assets/cards/${card.id}.png" alt="">
    </div>
    ${choices}`;

  // 그 카드 전용 그림이 없으면 평소 표정의 고양이로 대신한다.
  // 결과 카드 전용 그림이 아직 없으면 선택지 카드의 그림으로 대신한다.
  const art = els.card.querySelector('.card-art');
  art.addEventListener('error', () => {
    if (card.artFallback) {
      art.src = `assets/cards/${card.artFallback}.png`;
      card.artFallback = null;
      art.addEventListener('error', () => {
        art.outerHTML = catSVG({ stage, mood: 'idle' });
      }, { once: true });
      return;
    }
    art.outerHTML = catSVG({ stage, mood: 'idle' });
  }, { once: true });

  els.hint.textContent = card.choices ? '⚡ 좌우로 스와이프해 선택 — 중간은 없다' : '위로 스와이프';
  els.card.querySelectorAll('.choice').forEach((b) =>
    b.addEventListener('click', () => commit(Number(b.dataset.choice))));
}

// 구조되는 이유는 마지막 한 장이 아니라 그 판을 통틀어 무엇이 가장 몸을 상하게 했는지로 정한다.
// 마지막 카드만 보면 사고로 끝나는 판이 대부분이라, 굶주림·병·추위 엔딩을 볼 일이 거의 없었다.
function worstCause(state) {
  const d = state.causeDamage || {};
  const keys = Object.keys(d);
  const total = keys.reduce((a, k) => a + Math.max(0, d[k] || 0), 0);
  if (!total) return 'hunger';
  // 가장 큰 것 하나로 못 박으면 한 종류만 계속 나온다. 깎인 양에 비례해 뽑는다.
  let r = Math.random() * total;
  for (const k of keys) {
    r -= Math.max(0, d[k] || 0);
    if (r <= 0) return k;
  }
  return keys[0];
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

  if (card.isResult) return passResult();      // 선택 결과 카드 — 넘기기만 한다
  if (card.choices) return chooseCard(card, choiceIdx);
  return advance();                            // 이미 판정이 끝난 카드 — 다음 장으로
}

// 카드가 화면에 뜨는 순간의 판정. 결과 알림과 연출이 카드와 동시에 나온다.
function resolveCard(card) {
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
    tier = roll(state, card);
    eff = card.outcomes[tier];
    label = TIER_LABEL[tier];
    text = pickText(card, tier, eff.t);
    if (tier === 'great') state.greatCount++;
    if (tier === 'terrible') state.terribleCount++;
    if (tier === 'great' || tier === 'terrible') {
      state.highlights.push({ emoji: card.emoji, title: card.title, tier, text });
    }
  }

  const delta = applyEffect(state, eff);
  chargeDamage(card, delta);
  tickHunger(state);
  if (card.special !== 'clover' && state.cloverLeft > 0) state.cloverLeft--;

  state.index++;
  resolved = true;
  if (state.hp <= 0) {
    state.rescued = true;
    state.rescueCause = worstCause(state);
  }

  lockStage(state);
  const after = stageOf(state).key;
  grew = stageBefore === after ? null : after;

  renderHud();
  persist();
  fanfare(tier);
  showResult({ label, tier, text, delta, mood: eff.mood });
  busy = false;
}

// 선택 카드는 고른 쪽의 성향이 쌓인다. 성패는 여전히 운이 정한다.
function chooseCard(card, choiceIdx) {
  const stageBefore = stageOf(state).key;
  const choice = card.choices[choiceIdx];
  const lean = choice.lean;
  if (lean?.tag) state.tagCounts[lean.tag] = (state.tagCounts[lean.tag] || 0) + 1;

  const tier = rollExtreme(state, card);
  let eff = choice.outcomes[tier];
  const label = TIER_LABEL[tier];
  const text = pickText(card, tier, eff.t);
  if (tier === 'great') state.greatCount++;
  if (tier === 'terrible') state.terribleCount++;
  state.highlights.push({ emoji: card.emoji, title: card.title, tier, text });

  // 고른 방향의 성향은 성패와 무관하게 쌓인다.
  eff = { ...eff, [lean.stat]: (eff[lean.stat] || 0) + STAT_META[lean.stat].gain };

  const delta = applyEffect(state, eff);
  chargeDamage(card, delta);
  tickHunger(state);
  if (state.cloverLeft > 0) state.cloverLeft--;

  state.index++;
  if (state.hp <= 0) {
    state.rescued = true;
    state.rescueCause = worstCause(state);
  }

  lockStage(state);
  const after = stageOf(state).key;
  // 선택 카드는 「선택지 카드 + 결과 카드」 한 세트다.
  // 고른 순간에는 결과를 감추고, 다음 장에서 무슨 일이 벌어졌는지 보여준다.
  state.pending = {
    art: `${card.id}_${choiceIdx}`,
    baseId: card.id,
    emoji: card.emoji,
    title: choice.label,
    text, tier, label, delta, mood: eff.mood,
    grew: stageBefore === after ? null : after,
  };
  renderHud();
  persist();
  flyOutCard(null);
  setTimeout(() => { showPending(); busy = false; }, 380);
}

// 무엇 때문에 체력이 깎였는지 쌓아둔다. 구조될 때 어떤 엔딩이 나올지는 이 누적으로 정한다.
function chargeDamage(card, delta) {
  if (delta.hp >= 0) return;
  const cause = causeOf(card.id);
  state.causeDamage[cause] = (state.causeDamage[cause] || 0) - delta.hp;
}

// 판정이 끝난 카드를 넘긴다.
function advance() {
  const grown = grew;
  grew = null;
  flyOutCard(null);
  setTimeout(() => {
    if (state.rescued) return finish();
    if (grown) return announceStage(grown);
    nextCard();
    busy = false;
  }, 380);
}

// 선택 결과 카드를 띄우고, 그 위에서 결과 알림과 대성공·대실패 연출을 낸다.
function showPending() {
  const p = state.pending;
  current = {
    id: p.art, isResult: true, emoji: p.emoji, title: p.title, text: p.text,
    artFallback: p.baseId, tone: p.tier === 'great' ? 'good' : 'bad',
  };
  resolved = false;
  renderCard(current);
  renderHud();          // 결과 카드는 방금 넘긴 그 카드의 번호를 그대로 유지한다
  fanfare(p.tier);
  showResult(p);
}

function passResult() {
  const grew = state.pending?.grew;
  state.pending = null;
  persist();
  flyOutCard(null);
  setTimeout(() => {
    if (state.rescued) return finish();
    if (grew) return announceStage(grew);
    nextCard();
    busy = false;
  }, 380);
}

function flyOutCard(tier) {
  els.card.classList.add('card--out');
  fanfare(tier);
  setTimeout(() => els.card.classList.remove('card--out'), 360);
}

function fanfare(tier) {
  if (tier === 'great') { flash('flash--great'); bigFx('great'); buzz([20, 40, 20]); playGreat(); }
  if (tier === 'terrible') { flash('flash--terrible'); bigFx('terrible'); buzz(90); playTerrible(); }
}

// 대성공·대실패는 화면 한가운데에 크게 찍어준다.
const FX = {
  great: { label: '대성공!', mood: 'proud', mark: '✨' },
  terrible: { label: '대실패…', mood: 'hurt', mark: '💥' },
};

function bigFx(tier) {
  const fx = FX[tier];
  const el = $('#fx');
  el.className = `fx fx--${tier}`;
  el.innerHTML = `
    <div class="fx-inner">
      <img class="fx-art" src="assets/fx/${tier}.png" alt="" data-mood="${fx.mood}">
      <div class="fx-label">${fx.mark} ${fx.label}</div>
    </div>`;
  // 전용 이펙트 그림이 없으면 그 표정의 고양이로 대신한다.
  const art = el.querySelector('.fx-art');
  art.addEventListener('error', () => {
    art.outerHTML = `<div class="fx-cat">${catSVG({ stage: stageOf(state), mood: fx.mood })}</div>`;
  }, { once: true });

  el.hidden = false;
  requestAnimationFrame(() => el.classList.add('show'));
  clearTimeout(bigFx.timer);
  bigFx.timer = setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => { el.hidden = true; }, 250);
  }, 900);
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
    ['❤️', delta.hp], ['😊', delta.hap],
    ['🪶', delta.abi], ['✨', delta.exp], ['💰', delta.score],
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
  els.stage.innerHTML = `<div class="stage-inner">${catSVG({ stage, mood: 'proud' })}<b>${stage.emoji} ${stage.name}${subjectJosa(stage.name)} 되었다</b></div>`;
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
  setAuto(false);
  clearRun();
  const score = computeScore(state);
  let ending = judgeEnding(state, score);
  // 히든 자비 규칙: 도감이 30/31이면, 완주하는 순간 남은 한 종이 확정으로 나온다.
  // 마지막 한 칸을 확률에 맡기는 건 너무 가혹하다. 화면에는 알리지 않는다.
  if (!state.rescued) {
    const have = new Set(load().endings);
    const missing = DEX.filter((e) => !have.has(e.id));
    if (missing.length === 1) ending = missing[0];
  }
  const before = recordEnding(ending);
  const data = { ...before, best: before.best };
  // 이름을 등록하지 않아도 최고 기록은 남는다. 갱신 여부는 갱신 전 값으로 판단한다.
  recordBest(score);
  lastRun = { ending, score, cards: state.index };

  const highs = state.highlights.slice(-3).reverse()
    .map((h) => `<li class="high high--${h.tier}"><span>${h.emoji}</span><div><b>${h.title} · ${TIER_LABEL[h.tier]}</b><p>${h.text}</p></div></li>`)
    .join('') || '<li class="high"><span>🐾</span><div><b>평온한 삶</b><p>크게 좋을 것도, 나쁠 것도 없는 하루하루였다.</p></div></li>';

  $('#ending-body').innerHTML = `
    <div class="ending-cat">${endingArt(ending, 'ending-art')}</div>
    <div class="ending-name">${ending.emoji} ${ending.name}</div>
    <p class="ending-desc">${ending.desc}</p>
    <div class="ending-score">${score.toLocaleString()}<small>점</small></div>
    <p class="ending-meta">${state.index}장의 인생 · ${stageOf(state).name}${data.best && score <= data.best ? ` · 최고 ${data.best.toLocaleString()}점` : ' · 🎉 최고 기록!'}</p>
    <h3>기억에 남는 순간</h3>
    <ul class="highs">${highs}</ul>`;

  // 엔딩 그림이 아직 없으면 고양이 그림으로 대신한다.
  const art = $('#ending-body .ending-art');
  if (art) {
    art.addEventListener('error', () => {
      art.outerHTML = catSVG({ stage: stageOf(state), mood: state.rescued ? 'happy' : 'proud' });
    }, { once: true });
  }

  renderSubmit(score);
  show('ending');
  hideResult();

  // 마지막 칸이 채워진 바로 그 순간, 한 번만 축하 씬을 띄운다.
  const now = load();
  if (collected(now).length >= TYPE_COUNT && !now.dexDoneSeen) {
    markDexDoneSeen();
    setTimeout(showDexDone, 900);
  }
}

// 도감 완성 축하 씬. 서른한 마리가 단체사진처럼 바글바글 모여 인사한다.
function showDexDone() {
  // 뒷줄부터 앞줄로, 뒤로 갈수록 작게 — 줄마다 좌우로 조금씩 어긋나게 세운다.
  // 배경까지 그려진 네모 판 그림은 앞줄에 서면 튀므로 맨 뒷줄로 보낸다.
  const BOXY = new Set(['pathfinder', 'learner', 'homebody']);
  const lineup = [...DEX.filter((e) => BOXY.has(e.id)), ...DEX.filter((e) => !BOXY.has(e.id))];
  const rows = [[0, 9], [9, 17], [17, 24], [24, 31]]; // 뒷줄 9 · 8 · 7 · 7
  const html = rows.map(([from, to], r) => {
    const cats = lineup.slice(from, to).map((e, i) => {
      const idx = from + i;
      const jitter = ((idx * 37) % 11) - 5;             // -5 ~ +5px, 판마다 같게
      return `<span class="crowd-cat" style="animation-delay:${idx * 70}ms; transform: translateY(${jitter}px)" title="${e.name}">
        ${endingArt(e, 'crowd-art')}
      </span>`;
    }).join('');
    return `<div class="crowd-row crowd-row--${r}">${cats}</div>`;
  }).join('');
  $('#dexdone-crowd').innerHTML = html;
  wireArtFallback($('#dexdone-crowd'));
  playGreat();
  buzz([40, 60, 40, 60, 80]);
  show('dexdone');
}

// 오락실처럼 이름을 넣어 랭킹에 올린다.
async function renderSubmit(score) {
  const box = $('#submit');
  let top = null;
  if (rankOn()) {
    box.innerHTML = '<p class="submit-title">명예의 전당을 불러오는 중…</p>';
    top = await fetchTop();
  }
  // 이름은 언제나 남길 수 있다. 순위권에 드는지는 문구로만 알려준다.
  const qualifies = top
    ? (top.length < RANK_SIZE || score > top[top.length - 1].score)
    : wouldRank(score);
  const last = load().lastName;
  box.innerHTML = `
    <div class="submit-form">
      <p class="submit-title">${qualifies ? '🏆 랭킹에 오를 점수다!' : '🐾 이름을 남겨두자'}</p>
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

async function doSubmit() {
  const name = $('#rank-name').value.trim();
  const go = $('#rank-go');
  if (go) { go.disabled = true; go.textContent = '등록 중'; }
  // 기기 기록은 항상 남긴다(최고 점수·마지막에 쓴 이름). 전역 랭킹은 되면 더 좋고.
  const { data, rank } = submitScore({ ...lastRun, name });
  const online = rankOn() ? await pushScore({ ...lastRun, name }) : null;
  // 서버가 답을 줬다면 그 순위가 진실이다. 순위권 밖(null)일 때 기기 순위로 갈아타면
  // 「1위로 등록됐다」 같은 거짓말이 된다. 기기 순위는 서버가 아예 실패했을 때만 쓴다.
  const place = online ? online.rank : rank;
  $('#submit').innerHTML = `
    <p class="submit-done">${place
      ? `${place}위로 등록됐다!`
      : '아쉽게 순위권 밖 — 그래도 기록은 남았다.'}</p>
    ${rankTable(online?.top || data.ranks, '명예의 전당')}`;
}

/* ---------- 공유 ---------- */
// 서버가 없으므로 결과를 주소에 담는다. 링크를 연 사람에게는 전용 화면을 그려준다.
//   ?s=e.<엔딩id>.<점수36진수>.<장수36진수>   — 한 판의 결과
//   ?s=d.<도감비트마스크36진수>              — 엔딩 도감 진행도

const ALL_ENDINGS = [...ENDINGS, ...Object.values(RESCUE_ENDINGS)];

function shareUrl(payload) {
  return `${location.origin}${location.pathname}?s=${payload}`;
}

function endingShareUrl() {
  const { ending, score, cards } = lastRun;
  return shareUrl(`e.${ending.id}.${score.toString(36)}.${cards.toString(36)}`);
}

function dexShareUrl() {
  const have = new Set(load().endings);
  let mask = 0n;
  DEX.forEach((e, i) => { if (have.has(e.id)) mask |= 1n << BigInt(i); });
  return shareUrl(`d.${mask.toString(36)}`);
}

// 기기의 공유 시트를 먼저 쓰고, 안 되면 클립보드에 복사한다.
async function shareLink(url, text) {
  try {
    if (navigator.share) return await navigator.share({ title: '스와이프 캣', text, url });
  } catch { /* 사용자가 공유 시트를 닫음 */ }
  try {
    await navigator.clipboard.writeText(url);
    showToast('<b>🔗 링크를 복사했다</b><p>붙여넣어 공유해보자.</p>', 2600);
  } catch {
    showToast(`<b>🔗 이 링크를 복사해 공유하자</b><p style="word-break:break-all">${url}</p>`, 6000);
  }
}

function parseShare() {
  const raw = new URLSearchParams(location.search).get('s');
  if (!raw) return null;
  const [kind, ...rest] = raw.split('.');
  if (kind === 'e' && rest.length >= 2) {
    const ending = ALL_ENDINGS.find((e) => e.id === rest[0]);
    if (!ending) return null;
    return { kind, ending, score: parseInt(rest[1], 36) || 0, cards: parseInt(rest[2], 36) || 0 };
  }
  if (kind === 'd' && rest.length >= 1) {
    try { return { kind, mask: BigInt(parseInt(rest[0], 36) || 0) }; } catch { return null; }
  }
  return null;
}

function renderShareView(shared) {
  if (shared.kind === 'e') {
    const e = shared.ending;
    $('#share-body').innerHTML = `
      <p class="share-from">어느 길고양이의 일생이 도착했다</p>
      <div class="ending-cat">${endingArt(e, 'ending-art')}</div>
      <div class="ending-name">${e.emoji} ${e.name}</div>
      <p class="ending-desc">${e.desc}</p>
      <div class="ending-score">${shared.score.toLocaleString()}<small>점</small></div>
      <p class="ending-meta">${shared.cards ? `${shared.cards}장의 인생` : ''}</p>`;
  } else {
    const got = DEX.filter((_, i) => (shared.mask >> BigInt(i)) & 1n);
    const cells = DEX.map((e, i) => ((shared.mask >> BigInt(i)) & 1n)
      ? `<li class="share-cell got" title="${e.name}">${endingArt(e, 'share-art')}</li>`
      : '<li class="share-cell">❔</li>').join('');
    $('#share-body').innerHTML = `
      <p class="share-from">어느 골목의 엔딩 도감이 도착했다</p>
      <div class="ending-name">📖 엔딩 도감 ${got.length} / ${TYPE_COUNT}</div>
      <ul class="share-grid">${cells}</ul>
      <p class="ending-desc">${got.length >= TYPE_COUNT ? '모든 삶을 만나봤다. 골목의 산증인이다.' : '아직 만나지 못한 삶이 남아 있다.'}</p>`;
  }
  wireArtFallback($('#share-body'));
  show('shareview');
}

/* ---------- 자동 넘기기 ---------- */
// 한 번이라도 끝까지 가본 사람에게만 열린다. 두 번째 판부터 쓸 수 있는 편의 기능.
function autoUnlocked() {
  return load().endings.length > 0;
}

function autoRunning() {
  return autoTimer !== null;
}

function setAuto(on) {
  clearInterval(autoTimer);
  autoTimer = null;
  if (on) autoTimer = setInterval(autoStep, AUTO_INTERVAL);
  renderAutoButton();
}

function autoStep() {
  if (!screens.game || screens.game.hidden) return setAuto(false);
  if (busy) return;
  if (resultOpen) hideResult();
  // 좌우 선택 카드는 자동일 때 무작위로 고른다. 성향을 노리려면 직접 넘겨야 한다.
  commit(current?.choices ? (Math.random() < 0.5 ? 0 : 1) : null);
}

function renderAutoButton() {
  const btn = $('#auto');
  if (!autoUnlocked()) { btn.hidden = true; return; }
  btn.hidden = false;
  btn.classList.toggle('on', autoRunning());
  btn.textContent = autoRunning() ? '⏸ 자동 넘기는 중' : '▶ 자동으로 넘기기';
}

function showToast(html, ms = 5200) {
  const el = $('#toast');
  el.innerHTML = html;
  el.hidden = false;
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => { el.hidden = true; }, 300);
  }, ms);
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
$('#auto').addEventListener('click', (e) => { e.stopPropagation(); setAuto(!autoRunning()); });

// 받침이 있으면 '이', 없으면 '가'. 「골목의 어른이 되었다」처럼 자연스럽게 읽히도록.
function subjectJosa(word) {
  const last = word.trim().slice(-1).charCodeAt(0);
  if (last < 0xac00 || last > 0xd7a3) return '이';
  return (last - 0xac00) % 28 ? '이' : '가';
}

function renderMute() {
  $('#mute').textContent = isMuted() ? '🔇' : '🔊';
}
renderMute();
$('#mute').addEventListener('click', (e) => { e.stopPropagation(); toggleMute(); renderMute(); });

// 진행 중에 처음 화면으로. 저장되어 있으므로 「이어서 하기」로 돌아올 수 있다.
$('#pause').addEventListener('click', (e) => {
  e.stopPropagation();
  setAuto(false);
  hideResult();
  // 구조가 확정된 카드에서 나가면 저장이 이미 지워져 그 판이 통째로 사라진다.
  // 이때는 나가는 대신 엔딩을 보여준다.
  if (state?.rescued) return finish();
  persist();
  renderTitle();
});

// 하단 성향 수치가 무슨 의미인지 알려준다.
$('#help').addEventListener('click', (e) => {
  e.stopPropagation();
  const sheet = $('#helpsheet');
  if (!sheet.hidden) { sheet.hidden = true; return; }
  sheet.innerHTML = `
    <h3>성향</h3>
    <p class="help-lead">겪는 일은 운이 정하지만, <b>어느 성향으로 자랄지는 선택으로 정할 수 있다.</b>
      좌우 선택 카드가 나올 때마다 고른 쪽의 성향이 쌓이고, 마지막에 가장 높은 성향이 엔딩을 가른다.</p>
    <ul>${Object.values(STAT_META)
      .map((m) => `<li><b>${m.icon} ${m.name}</b><span>${m.desc}</span></li>`).join('')}</ul>
    <p class="help-lead">엔딩별 조건은 <b>📖 엔딩 도감</b>에서 볼 수 있다.</p>
    <button class="btn btn--sm" id="help-close">닫기</button>`;
  sheet.hidden = false;
  $('#help-close').addEventListener('click', () => { sheet.hidden = true; });
});
bindTitleSwipe();
$('#dex-back').addEventListener('click', renderTitle);
$('#retry').addEventListener('click', startGame);
$('#to-title').addEventListener('click', renderTitle);
bindSwipe($('#game'));
$('#share-ending').addEventListener('click', () => {
  if (!lastRun) return;
  const { ending, score } = lastRun;
  shareLink(endingShareUrl(), `${ending.emoji} ${ending.name} — ${score.toLocaleString()}점. 내 길고양이의 일생.`);
});
$('#dex-share').addEventListener('click', () => {
  const n = collected(load()).length;
  shareLink(dexShareUrl(), `📖 엔딩 도감 ${n} / ${TYPE_COUNT} — 내가 만난 길고양이의 삶들.`);
});
$('#dexdone-share').addEventListener('click', () => {
  shareLink(dexShareUrl(), `📖 엔딩 도감 ${TYPE_COUNT} / ${TYPE_COUNT} 완성 — 골목의 모든 삶을 만났다.`);
});
$('#dexdone-close').addEventListener('click', () => { show('ending'); });

$('#share-play').addEventListener('click', () => {
  history.replaceState(null, '', location.pathname); // 공유 파라미터를 떼고 시작한다
  renderTitle();
});

probeAssets().then(() => {
  const shared = parseShare();
  if (shared) renderShareView(shared);
  else renderTitle();
});
