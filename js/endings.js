// 엔딩 판정.

// 조건 수치는 500회 시뮬레이션의 완주 스탯 분포에 맞춰 잡았다.
// 위에서부터 먼저 걸리는 엔딩이 채택된다.
export const ENDINGS = [
  { id: 'legend', emoji: '👑', name: '전설의 고양이', desc: '골목마다 네 이야기가 전해진다.', test: (s) => s.exp >= 180 && s.hap >= 160 },
  { id: 'treasure', emoji: '🏠', name: '집사의 보물', desc: '누군가의 세상 전부가 되었다.', test: (s) => s.hap >= 150 },
  { id: 'king', emoji: '🐈‍⬛', name: '골목의 왕', desc: '이 동네에서 네 눈을 피하지 않는 자는 없다.', test: (s) => s.abi >= 60 && s.fri >= 2 },
  { id: 'neighbor', emoji: '😺', name: '다정한 이웃', desc: '너를 기다리는 친구가 많다.', test: (s) => s.fri >= 4 },
  { id: 'ordinary', emoji: '🌤', name: '평범하지만 좋은 삶', desc: '특별할 것 없었지만, 나쁘지 않았다.', test: () => true },
];

export const DEATH_ENDINGS = {
  hunger: { id: 'death_hunger', emoji: '😿', name: '짧은 생 — 굶주림', desc: '끝내 빈 그릇 앞에서 눈을 감았다.' },
  sick: { id: 'death_sick', emoji: '😿', name: '짧은 생 — 병', desc: '몸이 끝까지 버텨주지 않았다.' },
  injury: { id: 'death_injury', emoji: '😿', name: '짧은 생 — 사고', desc: '세상은 작은 고양이에게 너무 거칠었다.' },
  cold: { id: 'death_cold', emoji: '😿', name: '짧은 생 — 추위', desc: '그 겨울은 유난히 길었다.' },
};

export function judgeEnding(state) {
  if (state.dead) return DEATH_ENDINGS[state.deathCause] || DEATH_ENDINGS.hunger;
  return ENDINGS.find((e) => e.test(state));
}

// 카드 id로 사인을 추정한다.
export function causeOf(cardId) {
  if (['hunger', 'fish', 'snack'].includes(cardId)) return 'hunger';
  if (['sick'].includes(cardId)) return 'sick';
  if (['winter', 'rain'].includes(cardId)) return 'cold';
  return 'injury';
}
