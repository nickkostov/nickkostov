const indicator = document.getElementById("indicator");

let timeout = 0;

pill("#page", {
  onLoading() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = 0;
    }

    addClass(indicator, "is-loading");
    indicator.style.display = "block";
  },
  onReady() {
    timeout = setTimeout(() => {
      removeClass(indicator, "is-loading");
      indicator.style.display = "none";
    }, 500);
    // Re-render Mermaid diagrams after PJAX navigation
    try {
      if (window.__renderDiagBlocks) {
        window.__renderDiagBlocks(document);
      }
    } catch (e) {
      console.error('[site] diagram re-render failed:', e);
    }

    // Initialize anime.js clock if present on page
    try {
      if (window.__initAnimeClock) {
        window.__initAnimeClock();
      }
    } catch (e) {
      console.error('[site] anime clock init failed:', e);
    }

    // Re-init name animation after navigation
    try {
      if (window.__initNameAnimate) {
        window.__initNameAnimate();
      }
    } catch (e) {
      console.error('[site] name animate init failed:', e);
    }
  }
});

function addClass(target, className) {
  target.className = target.className
    .trim()
    .split(/\s+/)
    .concat(className)
    .join(" ");
}

function removeClass(indicator, className) {
  indicator.className = indicator.className
    .trim()
    .split(/\s+/)
    .filter(item => item !== className)
    .join(" ");
}
