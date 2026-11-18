import confetti from 'canvas-confetti';

export const triggerConfetti = (originY = 0.7) => {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: originY },
      colors: ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
      disableForReducedMotion: true
    });
  } catch (err) {
    // Graceful fallback if canvas is not supported
    console.debug('Confetti effect skipped:', err);
  }
};

export const triggerCelebration = () => {
  try {
    const end = Date.now() + 1000;
    const colors = ['#8b5cf6', '#3b82f6', '#10b981'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch (e) {
    // fallback
  }
};
