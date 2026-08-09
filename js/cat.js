// 고양이 SVG. 손으로 그린 펜선 느낌 — 굵고 균일한 검정 아웃라인, 납작한 채색, 점 같은 눈.
// 식빵 자세(앞발을 모으고 꼬리를 몸에 감은 모습)를 기본으로 하고 표정만 갈아 끼운다.
// 외부 에셋을 쓰지 않으므로 라이선스 문제가 없다.

const FACES = {
  idle: `
    <circle class="eye" cx="86" cy="86" r="7"/>
    <circle class="eye" cx="138" cy="86" r="7"/>
    <path class="mouth" d="M104 106 q8 8 16 0"/>`,
  happy: `
    <path class="eye-line" d="M76 88 q10 -13 20 0"/>
    <path class="eye-line" d="M128 88 q10 -13 20 0"/>
    <path class="mouth" d="M104 104 q8 10 16 0"/>
    <path class="blush" d="M62 98 q7 6 14 0"/>
    <path class="blush" d="M148 98 q7 6 14 0"/>`,
  proud: `
    <path class="eye-line" d="M76 90 q10 -15 20 0"/>
    <path class="eye-line" d="M128 90 q10 -15 20 0"/>
    <path class="mouth mouth--open" d="M98 102 q14 18 28 0 z"/>
    <path class="blush" d="M60 98 q8 7 16 0"/>
    <path class="blush" d="M146 98 q8 7 16 0"/>`,
  sad: `
    <ellipse class="eye" cx="86" cy="88" rx="6.5" ry="8.5"/>
    <ellipse class="eye" cx="138" cy="88" rx="6.5" ry="8.5"/>
    <path class="brow" d="M72 70 q12 5 20 1"/>
    <path class="brow" d="M152 70 q-12 5 -20 1"/>
    <path class="mouth" d="M104 110 q8 -8 16 0"/>
    <path class="tear" d="M79 98 q-4 12 3 16 q7 -5 3 -16"/>`,
  scared: `
    <circle class="eye" cx="86" cy="86" r="10"/>
    <circle class="eye" cx="138" cy="86" r="10"/>
    <circle class="glint" cx="89" cy="82" r="3"/>
    <circle class="glint" cx="141" cy="82" r="3"/>
    <path class="brow" d="M70 64 q13 -5 22 2"/>
    <path class="brow" d="M154 64 q-13 -5 -22 2"/>
    <ellipse class="mouth--o" cx="112" cy="108" rx="7" ry="9"/>
    <path class="sweat" d="M166 74 q-5 11 2 15 q8 -4 3 -15"/>`,
  hurt: `
    <path class="eye-line" d="M78 79 l16 14"/><path class="eye-line" d="M94 79 l-16 14"/>
    <path class="eye-line" d="M130 79 l16 14"/><path class="eye-line" d="M146 79 l-16 14"/>
    <path class="mouth" d="M100 108 q6 -7 12 0 q6 7 12 0"/>
    <g class="bandage">
      <path d="M138 46 l26 14"/>
      <path class="bandage-x" d="M146 44 l10 18"/>
    </g>`,
};

// assets/cat-<표정>.png 가 있으면 그림을 쓰고, 없으면 아래 SVG로 그린다.
// 그림을 넣기 전에도 게임은 그대로 돌아간다.
export const MOODS = ['idle', 'happy', 'proud', 'sad', 'scared', 'hurt'];
let useImages = false;

export function probeAssets() {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => { useImages = true; resolve(true); };
    img.onerror = () => resolve(false);
    img.src = 'assets/cat-idle.png';
  });
}

export function catSVG({ stage, mood = 'idle' }) {
  if (useImages) {
    const img = `<img class="cat cat-img cat--${mood}" style="--cat-scale:${stage.scale}"
      src="assets/cat-${mood}.png" alt="" draggable="false">`;
    // 골목의 어른이 되면 머리 위에 왕관을 얹는다.
    if (stage.key === 'legend') {
      return `<span class="cat-crowned">${img}<img class="crown-img" src="assets/crown.png" alt=""></span>`;
    }
    return img;
  }
  return catInk({ stage, mood });
}

function catInk({ stage, mood = 'idle' }) {
  const face = FACES[mood] || FACES.idle;
  const crown = stage.key === 'legend'
    ? `<path class="crown" d="M74 24 l10 -22 l12 15 l12 -21 l12 21 l12 -15 l10 22 z"/>`
    : '';
  return `
<svg class="cat cat--${mood}" viewBox="0 0 250 210" style="--cat-scale:${stage.scale}" aria-hidden="true">
  <!-- 꼬리: 검정 굵은 선 위에 색을 덧그어 펜선처럼 만든다 -->
  <path class="tail-ink" d="M186 172 C 232 166 240 96 196 84"/>
  <path class="tail-fill" d="M186 172 C 232 166 240 96 196 84"/>

  <g class="cat-body">
    <ellipse class="body" cx="118" cy="146" rx="92" ry="56"/>
    <path class="belly" d="M64 176 q54 24 108 0 q-54 16 -108 0"/>
    <ellipse class="paw" cx="92" cy="182" rx="32" ry="17"/>
    <ellipse class="paw" cx="146" cy="182" rx="32" ry="17"/>
    <path class="paw-line" d="M76 172 h34"/>
    <path class="paw-line" d="M132 172 h34"/>
  </g>

  <g class="cat-head">
    ${crown}
    <path class="ear" d="M56 56 q-8 -34 -4 -46 q24 6 44 26 z"/>
    <path class="ear" d="M168 56 q8 -34 4 -46 q-24 6 -44 26 z"/>
    <path class="ear-in" d="M62 46 q-5 -22 -3 -30 q15 5 28 19 z"/>
    <path class="ear-in" d="M162 46 q5 -22 3 -30 q-15 5 -28 19 z"/>
    <ellipse class="head" cx="112" cy="86" rx="68" ry="56"/>
    <g class="brow-stripes">
      <path d="M98 44 v14"/><path d="M112 41 v15"/><path d="M126 44 v14"/>
    </g>
    ${face}
    <path class="nose" d="M107 96 h10 l-5 6 z"/>
    <g class="whiskers">
      <path d="M46 88 h-26"/><path d="M46 98 h-28"/>
      <path d="M178 88 h26"/><path d="M178 98 h28"/>
    </g>
  </g>
</svg>`;
}
