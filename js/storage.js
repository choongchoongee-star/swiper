// 기록 저장. 서버 없이 localStorage만 쓴다.
// 나중에 전역 랭킹을 붙이더라도 이 모듈만 갈아끼우면 되도록 분리해 둔다.

const KEY = 'swiper.records.v1';

const empty = { best: 0, runs: [], endings: [] };

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
    /* 사파리 프라이빗 모드 등에서 실패할 수 있다. 기록만 안 남을 뿐 게임은 계속된다. */
  }
}

export function record({ score, ending, cards }) {
  const data = load();
  data.best = Math.max(data.best, score);
  data.runs.unshift({ score, ending: ending.name, emoji: ending.emoji, cards, at: new Date().toISOString() });
  data.runs = data.runs.slice(0, 5);
  if (!data.endings.includes(ending.id)) data.endings.push(ending.id);
  save(data);
  return data;
}
