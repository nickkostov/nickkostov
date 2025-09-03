// Anime.js Digital Clock (Hacker style) for the homepage
(function () {
  let intervalRef = null;

  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function formatTime() {
    const d = new Date();
    return {
      hh: pad(d.getHours()),
      mm: pad(d.getMinutes()),
      ss: pad(d.getSeconds()),
    };
  }

  function renderDigital(container) {
    container.innerHTML = "";

    const wrap = document.createElement("div");
    wrap.className = "digital-clock";

    const time = document.createElement("div");
    time.className = "time";

    const segHH = document.createElement("span");
    segHH.className = "seg hh";
    const colon1 = document.createElement("span");
    colon1.className = "colon";
    colon1.textContent = ":";
    const segMM = document.createElement("span");
    segMM.className = "seg mm";
    const colon2 = document.createElement("span");
    colon2.className = "colon";
    colon2.textContent = ":";
    const segSS = document.createElement("span");
    segSS.className = "seg ss";

    time.appendChild(segHH);
    time.appendChild(colon1);
    time.appendChild(segMM);
    time.appendChild(colon2);
    time.appendChild(segSS);

    wrap.appendChild(time);

    // Subtle entrance animation
    if (typeof anime !== "undefined") {
      wrap.style.opacity = "0";
      anime({ targets: wrap, opacity: [0, 1], translateY: [-6, 0], duration: 600, easing: "easeOutQuad" });
    }

    container.appendChild(wrap);

    const applyTime = () => {
      const { hh, mm, ss } = formatTime();
      segHH.textContent = hh;
      segMM.textContent = mm;
      segSS.textContent = ss;
    };

    // Initial paint
    applyTime();

    // Clear & set interval for updates
    if (intervalRef) clearInterval(intervalRef);
    intervalRef = setInterval(applyTime, 1000);
  }

  function initClock() {
    const mount = document.getElementById("anime-clock");
    if (!mount) return;
    renderDigital(mount);
  }

  // Expose for SPA re-init
  window.__initAnimeClock = initClock;

  // Initial load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initClock);
  } else {
    initClock();
  }
})();

