// Animate site title (Nikolay Kostov) by lines using Splitting + anime.js
(function () {
  function init() {
    const el = document.getElementById("site-title");
    if (!el || typeof anime === "undefined") return;

    // Prevent double-initialization on SPA nav
    if (el.dataset.nkAnimated === "1") return;
    el.dataset.nkAnimated = "1";

    // Split into lines
    let inners = [];
    let lines = [];
    if (typeof Splitting !== "undefined") {
      const results = Splitting({ target: el, by: "lines" }) || [];
      lines = (results[0] && results[0].lines) ? results[0].lines : [];
    }

    // Wrap each line with an inner span so we can clip the container
    if (lines.length) {
      lines.forEach(function(line) {
        const inner = document.createElement("span");
        inner.className = "line-inner";
        while (line.firstChild) inner.appendChild(line.firstChild);
        line.appendChild(inner);
        inners.push(inner);
      });
    } else {
      // Fallback: animate the whole element as one line
      const inner = document.createElement("span");
      inner.className = "line-inner";
      while (el.firstChild) inner.appendChild(el.firstChild);
      el.appendChild(inner);
      inners = [inner];
    }

    // Animate lines up and out, then loop
    anime({
      targets: inners,
      translateY: [
        { value: ["100%", "0%"], duration: 750, easing: "cubicBezier(0.16, 1, 0.3, 1)" },
        { value: "-100%", delay: 750, duration: 750, easing: "cubicBezier(0.7, 0, 1, 1)" }
      ],
      delay: anime.stagger(200),
      loop: true,
      loopDelay: 500
    });
  }

  // Initial + SPA re-init
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose for calls after PJAX nav
  window.__initNameAnimate = init;
})();
