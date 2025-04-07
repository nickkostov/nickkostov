
document.addEventListener("DOMContentLoaded", () => {
  const terminals = document.querySelectorAll(".terminal");
  terminals.forEach((el) => {
    const data = el.getAttribute("data-lines");
    const lines = data.split("||");
    async function typeLine(text) {
      return new Promise(resolve => {
        const line = document.createElement("div");
        line.classList.add("line");
        const cursor = document.createElement("span");
        cursor.classList.add("blinking-cursor");
        el.appendChild(line);
        line.appendChild(cursor);
        let i = 0;
        const interval = setInterval(() => {
          if (i < text.length) {
            cursor.insertAdjacentText("beforebegin", text[i]);
            i++;
          } else {
            clearInterval(interval);
            cursor.remove();
            resolve();
          }
        }, 50);
      });
    }
    (async () => {
      for (const line of lines) {
        await typeLine(line);
        await new Promise(r => setTimeout(r, 500));
      }
    })();
  });
});
