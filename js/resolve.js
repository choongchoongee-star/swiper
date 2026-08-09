// 결과 판정. 이 게임에는 전략이 없다 — 선택지는 확률을 바꾸지 않는다.
// 확률을 움직이는 것은 플레이어가 통제할 수 없는 스탯과 성장 단계뿐이다.

import { stageOf } from './state.js';

// 대실패는 대성공의 절반쯤만 나오게 한다. 나쁜 일이 계속 터지면 넘길 맛이 안 난다.
const BASE = { great: 0.10, good: 0.40, bad: 0.425, terrible: 0.075 };
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export function probabilities(state, card) {
  const p = { ...BASE };

  // 관련 스탯이 높을수록 실패에서 성공 쪽으로 무게가 옮겨간다.
  const rel = state[card.stat] ?? 0;
  const statBonus = clamp(rel / 100, 0, 0.3);
  const shift = clamp(statBonus + stageOf(state).mod, -0.05, 0.4);

  if (shift > 0) {
    const takeFromBad = p.bad * shift;
    const takeFromTerrible = p.terrible * shift;
    p.bad -= takeFromBad;
    p.terrible -= takeFromTerrible;
    const moved = takeFromBad + takeFromTerrible;
    p.great += moved * 0.3;
    p.good += moved * 0.7;
  } else if (shift < 0) {
    const give = -shift;
    const fromGreat = p.great * give;
    const fromGood = p.good * give;
    p.great -= fromGreat;
    p.good -= fromGood;
    p.bad += (fromGreat + fromGood) * 0.7;
    p.terrible += (fromGreat + fromGood) * 0.3;
  }

  // 곁을 지켜준 고양이가 많을수록 최악의 일은 덜 일어난다.
  const friends = state.tagCounts?.cat || 0;
  const cut = p.terrible * clamp(friends * 0.012, 0, 0.15);
  p.terrible -= cut;
  p.good += cut;

  // 체력이 바닥일 때 대실패 연타로 죽는 것을 막는다.
  if (state.hp < 20) {
    const half = p.terrible / 2;
    p.terrible -= half;
    p.bad += half;
  }

  // 클로버 효과: 대실패가 아예 나오지 않는다.
  if (state.cloverLeft > 0) {
    p.bad += p.terrible;
    p.terrible = 0;
  }

  const sum = p.great + p.good + p.bad + p.terrible;
  for (const k of Object.keys(p)) p[k] /= sum;
  return p;
}

// 선택 분기 카드는 중간이 없다. 대성공 아니면 대실패.
// 어느 쪽을 골랐는지는 확률에 영향을 주지 않는다 — 여기서도 전략은 없다.
export function rollExtreme(state, card) {
  const p = probabilities(state, card);
  const good = p.great + p.good;
  const bad = p.bad + p.terrible;
  return Math.random() < good / (good + bad) ? 'great' : 'terrible';
}

export function roll(state, card) {
  const p = probabilities(state, card);
  let r = Math.random();
  for (const tier of ['great', 'good', 'bad', 'terrible']) {
    if (r < p[tier]) return tier;
    r -= p[tier];
  }
  return 'bad';
}

export const TIER_LABEL = {
  great: '대성공',
  good: '성공',
  bad: '실패',
  terrible: '대실패',
};
