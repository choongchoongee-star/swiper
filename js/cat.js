// 고양이 SVG. 부위를 나눠 그려서 표정과 자세를 코드로 조합한다.
// 외부 에셋을 쓰지 않으므로 라이선스 문제가 없다.

const FACES = {
  idle: `<path class="mouth" d="M96 118 q8 7 16 0" />
         <circle class="eye" cx="82" cy="100" r="7"/><circle class="eye" cx="122" cy="100" r="7"/>
         <circle class="glint" cx="84.5" cy="97.5" r="2.4"/><circle class="glint" cx="124.5" cy="97.5" r="2.4"/>`,
  happy: `<path class="mouth" d="M92 116 q12 12 24 0" />
          <path class="eye-line" d="M74 101 q8 -10 16 0"/><path class="eye-line" d="M114 101 q8 -10 16 0"/>`,
  proud: `<path class="mouth" d="M90 114 q14 16 28 0" />
          <path class="eye-line" d="M74 103 q8 -12 16 0"/><path class="eye-line" d="M114 103 q8 -12 16 0"/>
          <path class="blush" d="M64 112 q6 5 12 0"/><path class="blush" d="M128 112 q6 5 12 0"/>`,
  sad: `<path class="mouth" d="M94 122 q10 -8 20 0" />
        <ellipse class="eye" cx="82" cy="102" rx="6.5" ry="8"/><ellipse class="eye" cx="122" cy="102" rx="6.5" ry="8"/>
        <path class="brow" d="M72 88 q10 6 18 2"/><path class="brow" d="M132 88 q-10 6 -18 2"/>
        <path class="tear" d="M76 110 q-3 10 3 14 q6 -4 3 -14"/>`,
  scared: `<ellipse class="mouth-o" cx="104" cy="120" rx="7" ry="9"/>
           <circle class="eye" cx="82" cy="100" r="9"/><circle class="eye" cx="122" cy="100" r="9"/>
           <circle class="glint" cx="85" cy="97" r="2.6"/><circle class="glint" cx="125" cy="97" r="2.6"/>
           <path class="brow" d="M70 84 q12 -4 20 2"/><path class="brow" d="M138 84 q-12 -4 -20 2"/>`,
  hurt: `<path class="mouth" d="M94 122 q10 -9 20 0" />
         <path class="eye-line" d="M74 96 l16 12"/><path class="eye-line" d="M90 96 l-16 12"/>
         <path class="eye-line" d="M114 96 l16 12"/><path class="eye-line" d="M130 96 l-16 12"/>
         <path class="bandage" d="M126 74 l22 12" />`,
};

export function catSVG({ stage, mood = 'idle' }) {
  const face = FACES[mood] || FACES.idle;
  const crown = stage.key === 'legend'
    ? `<path class="crown" d="M78 58 l8 -20 l10 14 l8 -20 l8 20 l10 -14 l8 20 z"/>`
    : '';
  return `
<svg class="cat cat--${mood}" viewBox="0 0 208 200" style="--cat-scale:${stage.scale}" aria-hidden="true">
  <g class="cat-body">
    <path class="tail" d="M168 150 q34 -6 26 -40 q-6 -24 -26 -14"/>
    <ellipse class="body" cx="104" cy="152" rx="58" ry="42"/>
    <path class="stripe" d="M74 130 q10 8 4 20"/>
    <path class="stripe" d="M96 124 q10 9 4 22"/>
    <path class="stripe" d="M118 126 q10 8 4 20"/>
    <ellipse class="paw" cx="78" cy="186" rx="15" ry="9"/>
    <ellipse class="paw" cx="130" cy="186" rx="15" ry="9"/>
  </g>
  <g class="cat-head">
    ${crown}
    <path class="ear" d="M62 74 l-6 -34 l32 16 z"/>
    <path class="ear" d="M146 74 l6 -34 l-32 16 z"/>
    <path class="ear-in" d="M66 68 l-3 -18 l17 8 z"/>
    <path class="ear-in" d="M142 68 l3 -18 l-17 8 z"/>
    <ellipse class="head" cx="104" cy="98" rx="52" ry="44"/>
    <path class="stripe" d="M96 58 q8 8 16 0"/>
    <ellipse class="muzzle" cx="104" cy="118" rx="24" ry="16"/>
    <path class="nose" d="M99 110 h10 l-5 6 z"/>
    ${face}
    <g class="whiskers">
      <path d="M56 112 h-22"/><path d="M56 120 h-24"/>
      <path d="M152 112 h22"/><path d="M152 120 h24"/>
    </g>
  </g>
</svg>`;
}
