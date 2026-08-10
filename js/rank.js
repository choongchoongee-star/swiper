// 전역 랭킹. Firebase Realtime Database의 REST API만 쓴다.
// SDK를 붙이지 않는 이유: 이 게임은 빌드 도구가 없고, fetch 두 번이면 끝나는 일이다.
//
// DB_URL이 비어 있거나 통신에 실패하면 이 모듈은 조용히 실패한다.
// 그때는 storage.js의 기기 랭킹이 그대로 명예의 전당이 된다. 게임은 어떤 경우에도 멈추지 않는다.

// ⬇️ Firebase 콘솔에서 만든 Realtime Database 주소를 여기에 붙여넣으면 전역 랭킹이 켜진다.
//    예: 'https://스와이프캣-default-rtdb.asia-southeast1.firebasedatabase.app'
//    비워두면 지금처럼 기기 안에만 기록이 남는다.
const DB_URL = '';

const RANK_SIZE = 10;
const TIMEOUT = 4000;

export function isOn() {
  return Boolean(DB_URL);
}

function withTimeout(promise, ms = TIMEOUT) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);
}

// 상위 10명. 실패하면 null을 돌려주고, 부르는 쪽이 기기 랭킹으로 대신한다.
export async function fetchTop() {
  if (!DB_URL) return null;
  try {
    const url = `${DB_URL}/ranks.json?orderBy=%22score%22&limitToLast=${RANK_SIZE}`;
    const res = await withTimeout(fetch(url));
    if (!res.ok) return null;
    const data = await res.json();
    if (!data) return [];
    return Object.values(data)
      .filter((r) => r && typeof r.score === 'number' && typeof r.name === 'string')
      .sort((a, b) => b.score - a.score)
      .slice(0, RANK_SIZE);
  } catch {
    return null;
  }
}

// 점수 등록. 성공하면 등록된 순위(1부터), 실패하면 null.
export async function pushScore({ name, score, ending, cards }) {
  if (!DB_URL) return null;
  const entry = {
    name: String(name).slice(0, 8) || '이름없음',
    score: Math.max(0, Math.round(score)),
    cards: Math.max(0, Math.round(cards || 0)),
    ending: ending?.name || '',
    emoji: ending?.emoji || '🐾',
    at: Date.now(),
  };
  try {
    const res = await withTimeout(fetch(`${DB_URL}/ranks.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    }));
    if (!res.ok) return null;
    const top = await fetchTop();
    if (!top) return null;
    // 같은 점수가 여럿이면 내 이름이 있는 첫 자리를 내 순위로 본다.
    const i = top.findIndex((r) => r.score === entry.score && r.name === entry.name);
    return { rank: i === -1 ? null : i + 1, top };
  } catch {
    return null;
  }
}
