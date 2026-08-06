// 100장짜리 인생 덱 생성.
// 같은 카드가 붙어 나오지 않고, 나쁜 일이 3연속으로 이어지지 않게 다듬는다.

import { GOOD_CARDS, BAD_CARDS, CALM_CARDS, EXTEND_CARD, CLOVER_CARD, TRIAL_CARD } from './cards.js';

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// 단계별 긍정 비율 (아기·전설묘 구간은 조금 더 다정하게)
function goodRatio(i) {
  if (i < 25) return 0.6;
  if (i < 75) return 0.5;
  return 0.6;
}

export function buildDeck(length = 100) {
  const deck = [];
  const recent = [];
  let badStreak = 0;

  for (let i = 0; i < length; i++) {
    let card;
    let guard = 0;

    do {
      const r = Math.random();
      if (r < 0.1) {
        card = pick(CALM_CARDS);
      } else if (badStreak >= 2) {
        card = pick(GOOD_CARDS); // 세 번 연속 불행은 없다
      } else {
        card = Math.random() < goodRatio(i) ? pick(GOOD_CARDS) : pick(BAD_CARDS);
      }
      guard++;
    } while (recent.includes(card.id) && guard < 12);

    recent.push(card.id);
    if (recent.length > 3) recent.shift();
    badStreak = card.tone === 'bad' ? badStreak + 1 : 0;

    deck.push(card);
  }

  // 특수 카드 삽입 (기존 카드를 대체하지 않고 끼워 넣는다)
  const inserts = [];
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
