// 효과음. 음원 파일 없이 WebAudio로 직접 만든다 — 외부 에셋이 없으니 라이선스 문제가 없다.
// 브라우저 정책상 사용자가 화면을 한 번 건드린 뒤에야 소리가 난다.

const KEY = 'swiper.muted';
let ctx = null;
let muted = false;

try {
  muted = localStorage.getItem(KEY) === '1';
} catch { /* 저장소를 못 읽어도 소리는 켠 채로 시작한다 */ }

function audio() {
  if (muted) return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(ac, { freq, to, start, dur, type = 'triangle', gain = 0.16 }) {
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  const t0 = ac.currentTime + start;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);

  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  osc.connect(amp).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

// 대성공: 짧게 올라가는 세 음
export function playGreat() {
  const ac = audio();
  if (!ac) return;
  [523.25, 659.25, 783.99].forEach((f, i) => {
    tone(ac, { freq: f, start: i * 0.075, dur: 0.2, gain: 0.15 });
  });
  tone(ac, { freq: 1046.5, start: 0.22, dur: 0.34, type: 'sine', gain: 0.1 });
}

// 대실패: 아래로 미끄러지는 낮은 소리
export function playTerrible() {
  const ac = audio();
  if (!ac) return;
  tone(ac, { freq: 220, to: 70, start: 0, dur: 0.42, type: 'sawtooth', gain: 0.13 });
  tone(ac, { freq: 110, to: 55, start: 0.05, dur: 0.38, type: 'square', gain: 0.06 });
}

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  try {
    localStorage.setItem(KEY, muted ? '1' : '0');
  } catch { /* 저장 실패해도 이번 판에는 적용된다 */ }
  return muted;
}
