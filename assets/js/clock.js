// Anime.js Analog Clock for the homepage
(function () {
  function createTicks(container) {
    for (let i = 0; i < 60; i++) {
      const tick = document.createElement('div');
      tick.className = 'mark';
      tick.style.transform = `translate(-1px, -100px) rotate(${i * 6}deg)`;
      if (i % 5 === 0) {
        tick.style.height = '12px';
        tick.style.opacity = '0.9';
      }
      container.appendChild(tick);
    }
  }

  function initClock() {
    const mount = document.getElementById('anime-clock');
    if (!mount || typeof anime === 'undefined') return;

    // Clear if re-initializing (SPA navigation)
    mount.innerHTML = '';

    // Build DOM
    const clock = document.createElement('div');
    clock.className = 'clock';

    const hour = document.createElement('div');
    hour.className = 'hand hour';
    const minute = document.createElement('div');
    minute.className = 'hand minute';
    const second = document.createElement('div');
    second.className = 'hand second';
    const dot = document.createElement('div');
    dot.className = 'center-dot';

    clock.appendChild(hour);
    clock.appendChild(minute);
    clock.appendChild(second);
    clock.appendChild(dot);

    createTicks(clock);
    mount.appendChild(clock);

    // Compute current angles
    const now = new Date();
    const s = now.getSeconds() + now.getMilliseconds() / 1000;
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 12) + m / 60;

    const sDeg = s * 6; // 360 / 60
    const mDeg = m * 6; // 360 / 60
    const hDeg = h * 30; // 360 / 12

    // Set initial positions (preserve translateX)
    hour.style.transform = `translateX(-50%) rotate(${hDeg}deg)`;
    minute.style.transform = `translateX(-50%) rotate(${mDeg}deg)`;
    second.style.transform = `translateX(-50%) rotate(${sDeg}deg)`;

    // Animate with continuous linear rotations
    anime({
      targets: second,
      rotate: '+=360',
      duration: 60000,
      easing: 'linear',
      loop: true,
    });

    anime({
      targets: minute,
      rotate: '+=360',
      duration: 60 * 60 * 1000,
      easing: 'linear',
      loop: true,
    });

    anime({
      targets: hour,
      rotate: '+=360',
      duration: 12 * 60 * 60 * 1000,
      easing: 'linear',
      loop: true,
    });
  }

  // Expose for SPA re-init
  window.__initAnimeClock = initClock;

  // Initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClock);
  } else {
    initClock();
  }
})();
