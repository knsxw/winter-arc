// Web Audio API synthesized sound generator - no external asset dependencies
let audioCtx = null;
let ambientGainNode = null;
let ambientSource = null;
let isAmbientPlaying = false;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playHabitTick(pitchMultiplier = 1.0) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 587.33 * pitchMultiplier; // D5 note
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {
    console.error('Audio play error', e);
  }
}

export function playArcCompleteChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [440, 554.37, 659.25, 880, 1108.73]; // A major arpeggio
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);

      gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.07);
      osc.stop(ctx.currentTime + idx * 0.07 + 0.35);
    });
  } catch (e) {
    console.error('Chime error', e);
  }
}

export function toggleBlizzardAmbience(volume = 0.05) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    if (isAmbientPlaying) {
      if (ambientGainNode) {
        ambientGainNode.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 1);
        setTimeout(() => {
          if (ambientSource) {
            ambientSource.stop();
            ambientSource.disconnect();
            ambientSource = null;
          }
          isAmbientPlaying = false;
        }, 1000);
      }
      return false;
    } else {
      // Create pink noise buffer
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }

      ambientSource = ctx.createBufferSource();
      ambientSource.buffer = buffer;
      ambientSource.loop = true;

      // Filter to simulate low icy howling wind
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      ambientGainNode = ctx.createGain();
      ambientGainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      ambientGainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.5);

      ambientSource.connect(filter);
      filter.connect(ambientGainNode);
      ambientGainNode.connect(ctx.destination);

      ambientSource.start();
      isAmbientPlaying = true;
      return true;
    }
  } catch (e) {
    console.error('Ambient audio error', e);
    return false;
  }
}

export function isAmbienceActive() {
  return isAmbientPlaying;
}
