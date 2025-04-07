document.addEventListener("DOMContentLoaded", () => {
    const blocks = document.querySelectorAll('pre > code.language-terminal');
  
    blocks.forEach((block) => {
      const lines = block.innerText.trim().split("\n");
      const container = document.createElement("div");
      container.classList.add("terminal");
  
      block.parentElement.replaceWith(container);
  
      async function typeLines() {
        for (const line of lines) {
          await typeLine(container, line);
          await new Promise(r => setTimeout(r, 600));
        }
      }
  
      function typeLine(container, text) {
        return new Promise(resolve => {
          const line = document.createElement("div");
          line.classList.add("line", "prompt");
  
          const cursor = document.createElement("span");
          cursor.classList.add("blinking-cursor");
          line.appendChild(cursor);
  
          container.appendChild(line);
  
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
          }, 40);
        });
      }
  
      typeLines();
    });
  });
  