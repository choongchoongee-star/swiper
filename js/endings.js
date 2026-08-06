// 엔딩 판정.
// 완주하면 네 가지 성향 축으로 16가지 엔딩 중 하나가 나온다. (MBTI식 4글자 코드)
//   야성 W ↔ 애교 C   — 능력으로 살았나, 사랑으로 살았나
//   무리 S ↔ 고독 O   — 곁에 누가 있었나
//   모험 A ↔ 안식 R   — 밖으로 나갔나, 몸을 사렸나
//   행운 L ↔ 파란 D   — 대성공이 많았나, 대실패가 많았나

// 축을 가르는 기준값. 700회 시뮬레이션에서 완주 기록의 중앙값이라 대체로 반반씩 갈린다.
const MED = { hap: 132, exp: 184, abi: 47, hp: 69, fri: 3, luck: 3 };

export const AXES = [
  { pos: 'W', neg: 'C', posName: '야성', negName: '애교' },
  { pos: 'S', neg: 'O', posName: '무리', negName: '고독' },
  { pos: 'A', neg: 'R', posName: '모험', negName: '안식' },
  { pos: 'L', neg: 'D', posName: '행운', negName: '파란' },
];

export function traitCode(s) {
  return [
    s.abi / MED.abi >= s.hap / MED.hap ? 'W' : 'C',
    s.fri >= MED.fri ? 'S' : 'O',
    s.exp / MED.exp >= s.hp / MED.hp ? 'A' : 'R',
    s.greatCount - s.terribleCount >= MED.luck ? 'L' : 'D',
  ].join('');
}

export const TYPE_ENDINGS = {
  WSAL: { emoji: '👑', name: '골목의 왕', desc: '이 동네에서 네 눈을 피하지 않는 자는 없었다.' },
  WSAD: { emoji: '⚔️', name: '상처투성이 대장', desc: '흉터 하나하나가 전부 네 무용담이었다.' },
  WSRL: { emoji: '🧱', name: '담벼락 순찰대장', desc: '매일 같은 길을 도는 것, 그게 네 통치 방식이었다.' },
  WSRD: { emoji: '🩹', name: '흉터 많은 형님', desc: '겁 없는 후배들이 늘 네 뒤를 따라다녔다.' },
  WOAL: { emoji: '🌑', name: '그림자 사냥꾼', desc: '아무도 네가 지나간 것을 알아채지 못했다.' },
  WOAD: { emoji: '🎒', name: '떠돌이 방랑묘', desc: '정착하지 않았고, 그래서 잃을 것도 없었다.' },
  WORL: { emoji: '🏯', name: '지붕 위의 은둔자', desc: '높은 곳에서 세상을 내려다보는 게 네 유일한 취미였다.' },
  WORD: { emoji: '🪨', name: '외길의 생존자', desc: '혼자였고 거칠었지만, 끝까지 걸었다.' },
  CSAL: { emoji: '⭐', name: '동네 인기 스타', desc: '골목 사람들 모두가 네 이름을 알고 있었다.' },
  CSAD: { emoji: '💧', name: '정 많은 울보', desc: '잘 울었고, 그만큼 잘 웃었다.' },
  CSRL: { emoji: '🌻', name: '모두의 햇살', desc: '네가 앉은 자리마다 사람들이 모여들었다.' },
  CSRD: { emoji: '🎭', name: '사랑받는 말썽쟁이', desc: '사고를 쳐도 도무지 미워할 수 없는 얼굴이었다.' },
  COAL: { emoji: '🪟', name: '창가의 몽상가', desc: '멀리 보는 걸 좋아했지만, 끝내 떠나지는 않았다.' },
  COAD: { emoji: '🍃', name: '조용한 방랑자', desc: '말없이 왔다가 말없이 사라지는 고양이였다.' },
  CORL: { emoji: '🏠', name: '집사의 보물', desc: '누군가의 세상 전부가 되었다.' },
  CORD: { emoji: '🌙', name: '혼자 자는 고양이', desc: '품은 그리웠지만, 결국 혼자가 편했다.' },
};

export const TYPE_COUNT = Object.keys(TYPE_ENDINGS).length;

export const DEATH_ENDINGS = {
  hunger: { id: 'death_hunger', emoji: '😿', name: '짧은 생 — 굶주림', desc: '끝내 빈 그릇 앞에서 눈을 감았다.' },
  sick: { id: 'death_sick', emoji: '😿', name: '짧은 생 — 병', desc: '몸이 끝까지 버텨주지 않았다.' },
  injury: { id: 'death_injury', emoji: '😿', name: '짧은 생 — 사고', desc: '세상은 작은 고양이에게 너무 거칠었다.' },
  cold: { id: 'death_cold', emoji: '😿', name: '짧은 생 — 추위', desc: '그 겨울은 유난히 길었다.' },
};

export function judgeEnding(state) {
  if (state.dead) return DEATH_ENDINGS[state.deathCause] || DEATH_ENDINGS.hunger;
  const code = traitCode(state);
  return { id: code, code, ...TYPE_ENDINGS[code] };
}

// 성향 축을 화면에 보여주기 위한 형태로 풀어준다.
export function traitBreakdown(state) {
  const code = traitCode(state);
  return AXES.map((ax, i) => {
    const isPos = code[i] === ax.pos;
    return { letter: code[i], name: isPos ? ax.posName : ax.negName, other: isPos ? ax.negName : ax.posName };
  });
}

// 카드 id로 사인을 추정한다.
export function causeOf(cardId) {
  if (['hunger', 'fish', 'snack', 'feeder', 'bin'].includes(cardId)) return 'hunger';
  if (['sick', 'flea'].includes(cardId)) return 'sick';
  if (['winter', 'rain', 'ice', 'typhoon', 'firstsnow', 'puddle'].includes(cardId)) return 'cold';
  return 'injury';
}
