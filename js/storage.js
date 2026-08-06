// 기록 저장. 서버 없이 localStorage만 쓴다. 오락실 기계처럼 이 기기에만 남는다.
// 나중에 전역 랭킹을 붙이더라도 이 모듈만 갈아끼우면 되도록 분리해 둔다.

const KEY = 'swiper.records.v2';
const RANK_SIZE = 10;

const empty = { best: 0, ranks: [], endings: [], lastName: '' };

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...empty };
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return { ...empty };
  }
}

function save(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* 프라이빗 모드 등에서 실패할 수 있다. 기록만 안 남을 뿐 게임은 계속된다. */
  }
}

// 엔딩 도감은 이름을 등록하지 않아도 쌓인다.
export function recordEnding(ending) {
  const data = load();
  if (!data.endings.includes(ending.id)) {
    data.endings.push(ending.id);
    save(data);
  }
  return data;
}

// 랭킹 등록. 등록된 순위(1부터)를 돌려주고, 10위 안에 못 들면 null.
export function submitScore({ name, score, ending, cards }) {
  const data = load();
  const entry = {
    name: name.slice(0, 8) || '이름없음',
    score, cards,
    ending: ending.name, emoji: ending.emoji, code: ending.code || null,
    at: new Date().toISOString(),
  };
  data.ranks.push(entry);
  data.ranks.sort((a, b) => b.score - a.score);
  data.ranks = data.ranks.slice(0, RANK_SIZE);
  data.best = Math.max(data.best, score);
  data.lastName = entry.name;
  if (!data.endings.includes(ending.id)) data.endings.push(ending.id);
  save(data);

  const rank = data.ranks.indexOf(entry);
  return { data, rank: rank === -1 ? null : rank + 1 };
}

/* ---------- 진행 중인 판 저장 ---------- */
// 카드를 한 장 넘길 때마다 저장해 두었다가, 앱을 닫았다 와도 이어서 할 수 있게 한다.
const RUN_KEY = 'swiper.run.v1';

export function saveRun(state, deckIds) {
  try {
    localStorage.setItem(RUN_KEY, JSON.stringify({ state, deckIds, at: Date.now() }));
  } catch {
    /* 저장에 실패해도 진행 중인 게임은 그대로 계속된다. */
  }
}

export function loadRun() {
  try {
    const raw = localStorage.getItem(RUN_KEY);
    if (!raw) return null;
    const run = JSON.parse(raw);
    if (!run?.state || !Array.isArray(run.deckIds)) return null;
    if (run.state.dead || run.state.index >= run.state.total) return null;
    return run;
  } catch {
    return null;
  }
}

export function clearRun() {
  try {
    localStorage.removeItem(RUN_KEY);
  } catch {
    /* 지우지 못해도 다음 시작에서 덮어쓴다. */
  }
}

export function wouldRank(score) {
  const { ranks } = load();
  return ranks.length < RANK_SIZE || score > ranks[ranks.length - 1].score;
}
