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

    // Row wrapper to sit clock + weather side by side
    const row = document.createElement("div");
    row.className = "hud-row";

    // Clock
    const clockWrap = document.createElement("div");
    clockWrap.className = "digital-clock";
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
    clockWrap.appendChild(time);

    // Weather container
    const weatherWrap = document.createElement("div");
    weatherWrap.className = "weather";
    const weatherEmoji = document.createElement("span");
    weatherEmoji.className = "wx-emoji";
    const weatherTemp = document.createElement("span");
    weatherTemp.className = "wx-temp";
    weatherWrap.appendChild(weatherEmoji);
    weatherWrap.appendChild(weatherTemp);

    // Assemble row
    row.appendChild(clockWrap);
    row.appendChild(weatherWrap);

    // Entrance animations
    if (typeof anime !== "undefined") {
      row.style.opacity = "0";
      anime({ targets: row, opacity: [0, 1], translateY: [-6, 0], duration: 600, easing: "easeOutQuad" });
    }

    container.appendChild(row);

    // Clock update loop
    const applyTime = () => {
      const { hh, mm, ss } = formatTime();
      segHH.textContent = hh;
      segMM.textContent = mm;
      segSS.textContent = ss;
    };
    applyTime();
    if (intervalRef) clearInterval(intervalRef);
    intervalRef = setInterval(applyTime, 1000);

    // Weather fetch + render
    updateWeather(weatherEmoji, weatherTemp);
  }

  function mapWeather(code) {
    // Open-Meteo weather codes mapping (simplified)
    if (code === 0) return { emoji: "☀️", text: "Clear" };
    if ([1,2,3].includes(code)) return { emoji: "🌤️", text: "Partly" };
    if ([45,48].includes(code)) return { emoji: "🌫️", text: "Fog" };
    if (code >= 51 && code <= 57) return { emoji: "🌦️", text: "Drizzle" };
    if (code >= 61 && code <= 67) return { emoji: "🌧️", text: "Rain" };
    if (code >= 71 && code <= 77) return { emoji: "❄️", text: "Snow" };
    if (code >= 80 && code <= 82) return { emoji: "🌦️", text: "Showers" };
    if (code >= 85 && code <= 86) return { emoji: "🌨️", text: "Snow" };
    if (code === 95) return { emoji: "⛈️", text: "Storm" };
    if (code === 96 || code === 99) return { emoji: "⛈️", text: "Storm" };
    return { emoji: "🌀", text: "–" };
  }

  async function getCoords(timeoutMs = 4000) {
    // Try geolocation with a timeout; fall back to default (Sofia)
    const fallback = { lat: 42.6977, lon: 23.3219 };
    if (!("geolocation" in navigator)) return fallback;
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve(fallback), timeoutMs);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(timer);
          resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        () => { clearTimeout(timer); resolve(fallback); },
        { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 10 * 60 * 1000 }
      );
    });
  }

  function readCache(key) {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (!obj || !obj.t || (Date.now() - obj.t) > 10 * 60 * 1000) return null; // 10 min TTL
      return obj;
    } catch { return null; }
  }

  function writeCache(key, value) {
    try { sessionStorage.setItem(key, JSON.stringify(value)); } catch {}
  }

  async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("weather fetch failed");
    return res.json();
  }

  async function updateWeather(emojiEl, tempEl) {
    try {
      const { lat, lon } = await getCoords();
      const clat = Math.round(lat * 100) / 100;
      const clon = Math.round(lon * 100) / 100;
      const cacheKey = `animeWeatherCache:v1:${clat},${clon}`;
      let data = readCache(cacheKey)?.data;
      if (!data) {
        const json = await fetchWeather(lat, lon);
        data = json?.current || null;
        if (data) writeCache(cacheKey, { t: Date.now(), data });
      }
      if (!data) throw new Error("no weather data");
      const temp = Math.round(data.temperature_2m);
      const mapped = mapWeather(Number(data.weather_code));
      emojiEl.textContent = mapped.emoji + " ";
      tempEl.textContent = `${temp}°C`;

      if (typeof anime !== "undefined") {
        anime({ targets: [emojiEl, tempEl], opacity: [0,1], duration: 400, easing: "easeOutQuad" });
      }
    } catch (e) {
      emojiEl.textContent = "🛰️ ";
      tempEl.textContent = "--";
    }
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
