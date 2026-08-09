// 엔딩 판정.
// 완주하면 30종 중 하나가 나온다. 판정에 쓰는 것은 세 가지다.
//   1) 어떤 스탯이 가장 두드러졌나 (중앙값 대비 비율로 비교)
//   2) 총점이 어느 정도였나
//   3) 어떤 사건을 많이 겪었나 (사냥·먹이·사람·고양이·모험·날씨·위험·쉼·보물)
// 사건으로 결정되는 특별 엔딩을 먼저 보고, 없으면 스탯과 점수로 정한다.

// 완주 기록의 중앙값. 스탯 간 크기가 달라서 비율로 비교해야 공평하다.
const MED = { hap: 106, exp: 124, abi: 36, hp: 44 };
const SCORE_HIGH = 2740;
const SCORE_LOW = 2310;

export function buildContext(state, score) {
  const ratios = {
    abi: state.abi / MED.abi,
    hap: state.hap / MED.hap,
    exp: state.exp / MED.exp,
    hp: state.hp / MED.hp,
  };
  const dom = Object.keys(ratios).reduce((a, b) => (ratios[a] >= ratios[b] ? a : b));
  const tier = score >= SCORE_HIGH ? 'high' : score < SCORE_LOW ? 'low' : 'mid';
  const t = state.tagCounts || {};
  return {
    dom, tier, score, ratios,
    tag: (k) => t[k] || 0,
    great: state.greatCount,
    terrible: state.terribleCount,
  };
}

// 위에서부터 먼저 걸리는 엔딩이 채택된다. 앞쪽일수록 특별하고 조건이 까다롭다.
export const ENDINGS = [
  // --- 겪은 사건으로 결정되는 특별 엔딩 ---
  { id: 'hunter', emoji: '🏹', name: '전설의 사냥꾼', desc: '네가 지나간 자리에는 깃털 한 장 남지 않았다.',
    hint: '사냥에 얽힌 일을 아주 많이 겪고, 능력이 가장 높은 채로 완주하기',
    test: (s, c) => c.tag('hunt') >= 5 && c.dom === 'abi' },
  { id: 'gourmet', emoji: '🍽', name: '골목의 미식가', desc: '이 동네에서 맛있는 것이 어디 있는지, 너만큼 아는 고양이는 없었다.',
    hint: '먹을 것에 얽힌 일을 아주 많이 겪기',
    test: (s, c) => c.tag('food') >= 9 },
  { id: 'humanfriend', emoji: '🫂', name: '사람의 친구', desc: '사람을 겁내지 않았고, 사람도 너를 겁내지 않았다.',
    hint: '사람과 얽힌 일을 아주 많이 겪고, 행복을 평균 이상으로 지키기',
    test: (s, c) => c.tag('human') >= 12 && c.ratios.hap >= 1 },
  { id: 'clanlord', emoji: '👑', name: '골목 고양이들의 왕', desc: '싸움으로 얻은 자리가 아니었다. 다들 그저 너를 따랐다.',
    hint: '다른 고양이와 얽힌 일을 아주 많이 겪고, 높은 점수로 완주하기',
    test: (s, c) => c.tag('cat') >= 9 && c.tier === 'high' },
  { id: 'mourner', emoji: '💔', name: '많은 이별을 겪은 고양이', desc: '곁에 있던 얼굴들을 하나씩 떠나보내고도, 너는 계속 걸었다.',
    hint: '고양이와 얽힌 일을 많이 겪되, 대실패도 그만큼 많이 겪기',
    test: (s, c) => c.tag('cat') >= 7 && c.terrible >= 8 },
  { id: 'chief', emoji: '🫱', name: '골목의 대장', desc: '네 뒤에는 늘 몇 마리가 따라다녔다.',
    hint: '갈림길에서 늘 곁을 지키는 쪽을 골라, 고양이와 얽힌 일을 최대한 많이 겪기',
    test: (s, c) => c.tag('cat') >= 9 },
  { id: 'neighbor', emoji: '😺', name: '다정한 이웃', desc: '누구와도 잘 지냈고, 누구도 너를 미워하지 않았다.',
    hint: '고양이와 얽힌 일을 많이 겪기 — 아기 고양이나 밥그릇 앞에서 나누는 쪽으로',
    test: (s, c) => c.tag('cat') >= 8 },
  { id: 'companion', emoji: '🐈', name: '조용한 동행', desc: '말수는 적었지만, 곁을 지킬 줄 아는 고양이였다.',
    hint: '고양이와 얽힌 일을 평균보다 조금 더 겪기',
    test: (s, c) => c.tag('cat') >= 7 },
  { id: 'explorer', emoji: '🗺', name: '방랑하는 탐험가', desc: '골목의 끝이 어디인지 확인해본 유일한 고양이였다.',
    hint: '낯선 곳으로 가는 선택을 반복하기',
    test: (s, c) => c.tag('explore') >= 5 },
  { id: 'stormrider', emoji: '⛈', name: '폭풍을 견딘 고양이', desc: '비도 눈도 바람도, 결국 너를 어쩌지 못했다.',
    hint: '날씨에 시달리는 일을 아주 많이 겪고 살아남기',
    test: (s, c) => c.tag('weather') >= 8 },
  { id: 'ninelives', emoji: '🩹', name: '아홉 목숨', desc: '몇 번이나 끝인 줄 알았지만, 너는 매번 다시 일어났다.',
    hint: '대실패를 열두 번 넘게 겪고도 끝까지 살아남기',
    test: (s, c) => c.terrible >= 12 },
  { id: 'lucky', emoji: '🍀', name: '타고난 행운아', desc: '무슨 일을 해도 이상하게 잘 풀렸다. 그것도 재능이다.',
    hint: '대성공을 열네 번 넘게 만들기 — 운이 따라야 한다',
    test: (s, c) => c.great >= 14 },
  { id: 'treasurer', emoji: '💰', name: '보물 사냥꾼', desc: '반짝이는 것을 알아보는 눈, 그건 아무나 갖는 게 아니다.',
    hint: '보물과 얽힌 일을 빠짐없이 겪고, 높은 점수로 완주하기',
    test: (s, c) => c.tag('treasure') >= 2 && c.tier === 'high' },
  { id: 'nightking', emoji: '🌃', name: '밤의 지배자', desc: '위험한 밤을 그렇게 많이 지나고도 너는 멀쩡했다.',
    hint: '위험한 일을 아주 많이 겪고도 끝까지 살아남기',
    test: (s, c) => c.tag('danger') >= 8 },
  { id: 'mascot', emoji: '🎀', name: '동네 마스코트', desc: '골목을 지나는 사람마다 네 이름을 한 번씩 불렀다.',
    hint: '사람과 얽힌 일을 많이 겪고, 행복을 가장 높게 키우기',
    test: (s, c) => c.tag('human') >= 11 && c.dom === 'hap' },
  { id: 'homebody', emoji: '🏠', name: '창가의 고양이', desc: '멀리 가지 않았다. 좋은 자리를 아는 것도 능력이다.',
    hint: '모험 대신 쉬는 쪽을 거의 매번 고르기',
    test: (s, c) => c.tag('rest') >= 12 },
  { id: 'loner', emoji: '🌙', name: '혼자 자는 고양이', desc: '품은 그리웠지만, 결국 혼자가 편했다.',
    hint: '고양이와도 사람과도 거의 얽히지 않고 혼자 지내기',
    test: (s, c) => c.tag('cat') <= 3 && c.tag('human') <= 8 },

  // --- 어느 쪽으로도 치우치지 않은 삶 ---
  { id: 'ordinary', emoji: '🌤', name: '평범하지만 좋은 삶', desc: '특별할 것 없었지만, 나쁘지 않았다.',
    hint: '어느 한쪽으로도 치우치지 않게, 네 성향을 고르게 키우기',
    test: (s, c) => {
      const v = Object.values(c.ratios);
      return Math.max(...v) / Math.max(0.01, Math.min(...v)) < 1.55;
    } },
  { id: 'survivor', emoji: '🌱', name: '그래도 살아남은 고양이', desc: '대단할 건 없었다. 끝까지 버텼다는 것만으로 충분하다.',
    hint: '점수는 낮지만 대실패를 일곱 번 넘게 겪고도 완주하기',
    test: (s, c) => c.tier === 'low' && c.terrible >= 7 },

  // --- 가장 두드러진 스탯 × 점수 ---
  { id: 'shadow', emoji: '🥷', name: '그림자 사냥꾼', desc: '아무도 네가 지나간 것을 알아채지 못했다.',
    hint: '🪶 능력을 가장 높게 키우고, 높은 점수로 완주하기',
    test: (s, c) => c.dom === 'abi' && c.tier === 'high' },
  { id: 'swift', emoji: '🐾', name: '재빠른 길고양이', desc: '위험한 것들은 늘 너보다 한 발 느렸다.',
    hint: '🪶 능력을 가장 높게 키우고, 보통 점수로 완주하기',
    test: (s, c) => c.dom === 'abi' && c.tier === 'mid' },
  { id: 'clumsy', emoji: '🌀', name: '서툰 사냥꾼', desc: '잘하지는 못했지만, 매번 다시 덤볐다.',
    hint: '🪶 능력을 가장 높게 키우되, 점수는 낮게 끝내기',
    test: (s, c) => c.dom === 'abi' },

  { id: 'sunshine', emoji: '🌻', name: '모두의 햇살', desc: '네가 앉은 자리마다 사람들이 모여들었다.',
    hint: '😊 행복을 가장 높게 키우고, 높은 점수로 완주하기',
    test: (s, c) => c.dom === 'hap' && c.tier === 'high' },
  { id: 'smiley', emoji: '😸', name: '웃음 많은 고양이', desc: '별것 아닌 일에도 기분이 좋아지는 재주가 있었다.',
    hint: '😊 행복을 가장 높게 키우고, 보통 점수로 완주하기',
    test: (s, c) => c.dom === 'hap' && c.tier === 'mid' },
  { id: 'humble', emoji: '🌾', name: '소박한 행복', desc: '가진 것은 적었지만, 그럭저럭 즐거운 나날이었다.',
    hint: '😊 행복을 가장 높게 키우되, 점수는 낮게 끝내기',
    test: (s, c) => c.dom === 'hap' },


  { id: 'chronicle', emoji: '📜', name: '골목의 산증인', desc: '이 동네에서 일어난 일 중 네가 모르는 것은 없었다.',
    hint: '✨ 경험치를 가장 높게 키우고, 높은 점수로 완주하기',
    test: (s, c) => c.dom === 'exp' && c.tier === 'high' },
  { id: 'pathfinder', emoji: '🧭', name: '길을 아는 고양이', desc: '어느 골목으로 가면 무엇이 있는지, 몸이 먼저 기억했다.',
    hint: '✨ 경험치를 가장 높게 키우고, 보통 점수로 완주하기',
    test: (s, c) => c.dom === 'exp' && c.tier === 'mid' },
  { id: 'learner', emoji: '🍃', name: '아직 배우는 중', desc: '세상은 넓고, 너는 이제 막 몇 골목을 알았을 뿐이다.',
    hint: '✨ 경험치를 가장 높게 키우되, 점수는 낮게 끝내기',
    test: (s, c) => c.dom === 'exp' },

  { id: 'sturdy', emoji: '💪', name: '튼튼한 고양이', desc: '무슨 일을 겪어도 다음 날이면 멀쩡히 걸어 다녔다.',
    hint: '❤️ 체력을 가장 높게 지키고, 높은 점수로 완주하기',
    test: (s, c) => c.dom === 'hp' && c.tier === 'high' },
  { id: 'wellfed', emoji: '🍚', name: '배부른 고양이', desc: '굶은 날보다 배부른 날이 많았다. 그거면 충분하다.',
    hint: '❤️ 체력을 가장 높게 지키고, 보통 점수로 완주하기',
    test: (s, c) => c.dom === 'hp' && c.tier === 'mid' },
  { id: 'skinny', emoji: '🪶', name: '마른 고양이', desc: '몸은 야위었지만, 끝까지 제 발로 걸었다.',
    hint: '❤️ 체력을 가장 높게 지키되, 점수는 낮게 끝내기',
    test: (s, c) => c.dom === 'hp' },

  // 어디에도 걸리지 않았을 때를 위한 안전망. 위의 '평범하지만 좋은 삶'과 같은 엔딩이라
  // 도감에는 한 칸만 차지한다.
  { id: 'ordinary', emoji: '🌤', name: '평범하지만 좋은 삶', desc: '특별할 것 없었지만, 나쁘지 않았다.',
    hidden: true, test: () => true },
];

// 도감에 실리는 엔딩(= 모을 수 있는 엔딩) 목록.
export const DEX = ENDINGS.filter((e) => !e.hidden);
export const TYPE_COUNT = DEX.length;

// 체력이 다하면 죽는 대신 구조된다. 길 생활은 여기서 끝나지만 삶은 이어진다.
export const RESCUE_ENDINGS = {
  hunger: { id: 'rescue_hunger', emoji: '🍚', name: '구조된 날',
    desc: '빈 그릇 앞에서 잠든 너를, 누군가 조용히 안아 올렸다. 이제 배곯을 일은 없다.' },
  sick: { id: 'rescue_sick', emoji: '🏥', name: '병원 가는 길',
    desc: '몸이 버텨주지 않던 날, 낯선 손이 너를 담요에 감쌌다. 다음 날 아침 눈이 떠졌다.' },
  injury: { id: 'rescue_injury', emoji: '🤲', name: '못 본 척하지 않은 사람',
    desc: '쓰러진 너를 지나치지 않은 사람이 있었다. 골목 생활은 그날로 끝났다.' },
  cold: { id: 'rescue_cold', emoji: '🧣', name: '따뜻한 품',
    desc: '그 겨울, 얼어붙기 직전의 너를 품에 안은 사람이 있었다. 이제 춥지 않다.' },
};

export function judgeEnding(state, score) {
  if (state.rescued) return RESCUE_ENDINGS[state.rescueCause] || RESCUE_ENDINGS.hunger;
  const ctx = buildContext(state, score);
  return ENDINGS.find((e) => e.test(state, ctx));
}

// 카드 id로 사인을 추정한다.
export function causeOf(cardId) {
  if (['hunger', 'fish', 'snack', 'feeder', 'bin', 'can', 'badfood', 'poison'].includes(cardId)) return 'hunger';
  if (['sick', 'flea', 'bath'].includes(cardId)) return 'sick';
  if (['winter', 'rain', 'ice', 'typhoon', 'firstsnow', 'puddle', 'monsoon', 'heatwave'].includes(cardId)) return 'cold';
  return 'injury';
}
