// Sound effects utility

let soundEnabled = true;

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

// Simple beep sounds using Web Audio API
function createBeep(frequency: number, duration: number, volume: number = 0.3): void {
  if (!soundEnabled) return;

  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    // Silently fail if audio context is not available
    console.debug('Sound effect failed:', error);
  }
}

export const sounds = {
  click: () => createBeep(800, 0.1, 0.2),
  success: () => createBeep(600, 0.2, 0.3),
  error: () => createBeep(300, 0.3, 0.3),
  win: () => {
    createBeep(523, 0.1, 0.3);
    setTimeout(() => createBeep(659, 0.1, 0.3), 100);
    setTimeout(() => createBeep(784, 0.2, 0.3), 200);
  },
  badge: () => {
    createBeep(440, 0.15, 0.3);
    setTimeout(() => createBeep(554, 0.15, 0.3), 150);
    setTimeout(() => createBeep(659, 0.2, 0.3), 300);
  },
  gameStart: () => {
    createBeep(523, 0.15, 0.3);
    setTimeout(() => createBeep(659, 0.2, 0.3), 150);
  },
  gameEnd: () => {
    createBeep(659, 0.15, 0.3);
    setTimeout(() => createBeep(523, 0.2, 0.3), 150);
  },
};

