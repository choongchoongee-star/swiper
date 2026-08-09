// 게임 상태와 점수 계산.

export const STAGES = [
  { key: 'baby', name: '아기 고양이', emoji: '🐱', scale: 0.62, mod: -0.05, tint: '#ffe8d6' },
  { key: 'teen', name: '어린 고양이', emoji: '🐈', scale: 0.8, mod: 0, tint: '#ffe0b8' },
  { key: 'adult', name: '다 큰 고양이', emoji: '🐈‍⬛', scale: 1, mod: 0.05, tint: '#ffd39b' },
  { key: 'legend', name: '골목의 어른', emoji: '👑', scale: 1.15, mod: 0.1, tint: '#f7c07a' },
];

// 밸런스 계수.
// 카드에 적힌 숫자는 서사의 크기(가시에 찔림 -3, 차에 치임 -20)를 나타내고,
// 실제 체감 난이도는 여기서 조절한다. 400회 시뮬레이션 기준 생존율 70%.
const HP_START = 60;
const HP_MAX = 120;
const DAMAGE_MUL = 0.74;
const HEAL_MUL = 1.22;
const HUNGER_EVERY = 1; // 이 장수마다 체력 1 감소 (판이 50장으로 짧아져 매 장으로 올렸다)
const FRIEND_TO_HAP = 7; // 카드에 적힌 '동료 1'이 행복 몇 만큼인지

export function createState() {
  return {
    hp: HP_START, hap: 30, abi: 10, exp: 0,
    bonusScore: 0,
    greatCount: 0,
    terribleCount: 0,
    textUse: {},        // 같은 카드가 다시 나왔을 때 다른 문장을 쓰기 위한 사용 횟수
    tagCounts: {},      // 어떤 종류의 사건을 몇 번 겪었나 (엔딩 판정에 쓴다)
    index: 0,          // 지금까지 넘긴 카드 수
    total: 100,        // 연장 카드로 늘어난다
    cloverLeft: 0,     // 남은 대실패 무효 횟수
    stageKey: 'baby',
    highlights: [],    // 대성공/대실패 기록
    rescued: false,
    rescueCause: null,
    causeDamage: { hunger: 0, sick: 0, injury: 0, cold: 0 }, // 무엇이 체력을 가장 많이 깎았나
    pending: null,     // 아직 보여주지 않은 선택 결과 카드
  };
}

// 성장 단계는 판 길이에 대한 비율로 본다. 50장짜리든 100장짜리든 네 단계를 모두 거친다.
export function stageOf(state) {
  const p = state.index / Math.max(1, state.total);
  if (p >= 0.75 || state.exp >= 250) return STAGES[3];
  if (p >= 0.5 || state.exp >= 130) return STAGES[2];
  if (p >= 0.25 || state.exp >= 50) return STAGES[1];
  return STAGES[0];
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// 결과 효과를 상태에 반영하고, 실제로 변한 양을 돌려준다(연출용).
export function applyEffect(state, eff) {
  const before = { hp: state.hp, hap: state.hap, abi: state.abi, exp: state.exp };
  if (eff.hpHalf) state.hp = Math.floor(state.hp / 2);
  if (eff.hp) state.hp += eff.hp > 0 ? eff.hp * HEAL_MUL : eff.hp * DAMAGE_MUL;
  if (eff.hap) state.hap += eff.hap;
  if (eff.abi) state.abi += eff.abi;
  if (eff.exp) state.exp += eff.exp;
  // 친구가 생기고 잃는 일은 행복으로 들어간다. 스탯을 넷으로 줄이면서 흡수했다.
  if (eff.fri) state.hap += eff.fri * FRIEND_TO_HAP;
  if (eff.score) state.bonusScore += eff.score;

  state.hp = Math.round(clamp(state.hp, 0, HP_MAX));
  state.hap = Math.max(0, state.hap);
  state.abi = Math.max(0, state.abi);

  return {
    hp: state.hp - before.hp,
    hap: state.hap - before.hap,
    abi: state.abi - before.abi,
    exp: state.exp - before.exp,
    score: eff.score || 0,
  };
}

// 카드를 넘길 때마다 체력이 1씩 자연 감소한다. 굶주림의 압박.
export function tickHunger(state) {
  if (state.index % HUNGER_EVERY !== 0) return;
  const before = state.hp;
  state.hp = Math.max(0, state.hp - 1);
  if (state.causeDamage) state.causeDamage.hunger += before - state.hp;
}

export function computeScore(state) {
  const raw =
    state.exp * 3 +
    state.hap * 2 +
    state.abi * 2 +
    state.hp * 1 +
    state.greatCount * 100 +
    state.bonusScore +
    // 완주 보너스는 실제로 끝까지 갔을 때만 붙인다.
    // 진행 중에도 더해두면 첫 화면부터 640점으로 보이고, 구조로 끝나는 순간 크게 깎여 보인다.
    (!state.rescued && state.index >= state.total ? 500 : 0);
  const stageMul = stageOf(state).key === 'legend' ? 1.2 : 1;
  const earlyMul = state.rescued ? 0.7 : 1;
  return Math.round(raw * stageMul * earlyMul);
}
