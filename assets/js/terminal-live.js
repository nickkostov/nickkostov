document.addEventListener("DOMContentLoaded", () => {
  const terminals = document.querySelectorAll(".terminal-body");

  terminals.forEach(async (term) => {
    const commands = term.dataset.lines.split("&&");
    const output = term.dataset.output;

    for (let cmd of commands) {
      await typeLine(term, `$ ${cmd.trim()}`);
      await new Promise((res) => setTimeout(res, 500));
    }

    if (output) {
      await typeLine(term, output, false);
    }
  });

  function typeLine(container, text, withPrompt = true) {
    return new Promise((resolve) => {
      const line = document.createElement("div");
      line.classList.add("line");

      if (withPrompt) {
        const prompt = document.createElement("span");
        prompt.classList.add("prompt");
        prompt.textContent = "$ ";
        line.appendChild(prompt);
      }

      const cursor = document.createElement("span");
      cursor.classList.add("blinking-cursor");
      line.appendChild(cursor);

      container.appendChild(line);

      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          cursor.insertAdjacentText("beforebegin", text.charAt(i));
          i++;
        } else {
          clearInterval(interval);
          cursor.remove();
          resolve();
        }
      }, 30);
    });
  }
});
