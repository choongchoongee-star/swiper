// 인생 덱 생성.
// 좋은 일·나쁜 일은 '비복원 추출'로 뽑는다. 한 바퀴를 다 돌기 전에는 같은 사건이 다시 오지 않는다.
// 일상 카드(그루밍·하품 같은 것)는 여러 번 나와도 이상하지 않으므로 그냥 섞어 쓴다.

import { GOOD_CARDS, BAD_CARDS, CALM_CARDS, CHOICE_CARDS, EXTEND_CARD, CLOVER_CARD, TRIAL_CARD } from './cards.js';

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 한 바퀴를 다 쓸 때까지 같은 카드를 내주지 않는 추출기.
function cycler(pool) {
  let bag = shuffled(pool);
  return {
    next(avoidId) {
      if (!bag.length) bag = shuffled(pool);
      // 새 바퀴의 첫 장이 직전 카드와 겹치면 한 칸 뒤로 미룬다.
      if (bag.length > 1 && bag[0].id === avoidId) {
        [bag[0], bag[1]] = [bag[1], bag[0]];
      }
      return bag.shift();
    },
  };
}

// 단계별 긍정 비율 (아기·전설묘 구간은 조금 더 다정하게)
function goodRatio(i) {
  if (i < 25) return 0.6;
  if (i < 75) return 0.5;
  return 0.6;
}

export function buildDeck(length = 130) {
  const good = cycler(GOOD_CARDS);
  const bad = cycler(BAD_CARDS);
  const deck = [];
  let badStreak = 0;
  let lastId = null;

  for (let i = 0; i < length; i++) {
    let card;
    if (Math.random() < 0.1) {
      card = CALM_CARDS[Math.floor(Math.random() * CALM_CARDS.length)];
      if (card.id === lastId) card = CALM_CARDS[(CALM_CARDS.indexOf(card) + 1) % CALM_CARDS.length];
    } else if (badStreak >= 2) {
      card = good.next(lastId); // 세 번 연속 불행은 없다
    } else {
      card = (Math.random() < goodRatio(i) ? good : bad).next(lastId);
    }

    badStreak = card.tone === 'bad' ? badStreak + 1 : 0;
    lastId = card.id;
    deck.push(card);
  }

  // 특수 카드 삽입
  const inserts = [];

  // 선택 분기 카드는 한 판에 네 번만. 조작에 익숙해지도록 첫 12장에는 넣지 않는다.
  const choicePool = shuffled(CHOICE_CARDS);
  const span = Math.max(1, Math.floor((length - 16) / 4));
  for (let i = 0; i < 4 && i < choicePool.length; i++) {
    inserts.push({ at: 12 + i * span + Math.floor(Math.random() * span), card: choicePool[i] });
  }

  for (const at of [20, 45, 70, 90]) {
    if (Math.random() < 0.4) inserts.push({ at, card: EXTEND_CARD });
  }
  inserts.push({ at: 15 + Math.floor(Math.random() * 15), card: CLOVER_CARD });
  inserts.push({ at: 55 + Math.floor(Math.random() * 20), card: CLOVER_CARD });
  inserts.push({ at: 60 + Math.floor(Math.random() * 25), card: TRIAL_CARD });

  inserts.sort((a, b) => b.at - a.at);
  for (const { at, card } of inserts) {
    if (at < deck.length) deck.splice(at, 0, card);
  }

  return deck;
}
