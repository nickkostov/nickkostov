document.addEventListener("DOMContentLoaded", () => {
  const inputBlocks = document.querySelectorAll('pre > code.language-terminal-input');
  const outputBlocks = document.querySelectorAll('pre > code.language-terminal-output');

  inputBlocks.forEach((codeBlock) => {
    const pre = codeBlock.parentElement;
    const lines = codeBlock.innerText.trim().split("\n");
    const container = document.createElement("div");
    container.classList.add("terminal-box");

    const playBtn = document.createElement("button");
    playBtn.classList.add("terminal-play");
    playBtn.textContent = "▶ Play";
    container.appendChild(playBtn);

    const terminalBody = document.createElement("div");
    terminalBody.classList.add("terminal-body");
    terminalBody.dataset.lines = JSON.stringify(lines);
    container.appendChild(terminalBody);

    pre.replaceWith(container);

    playBtn.addEventListener("click", async () => {
      playBtn.remove();
      for (let line of lines) {
        let clean = line.trim();
        let commandText = /^[\$\>]\s/.test(clean) ? clean : `$ ${clean}`;
        await typeLine(terminalBody, commandText);
        await wait(400);
      }
    });
  });

  outputBlocks.forEach((codeBlock) => {
    const pre = codeBlock.parentElement;
    const output = codeBlock.innerText.trim().split("\n");

    const container = document.createElement("div");
    container.classList.add("terminal-box");

    const terminalBody = document.createElement("div");
    terminalBody.classList.add("terminal-body");

    output.forEach(line => {
      const lineDiv = document.createElement("div");
      lineDiv.classList.add("line");
      lineDiv.textContent = line;
      terminalBody.appendChild(lineDiv);
    });

    container.appendChild(terminalBody);
    pre.replaceWith(container);
  });

  function typeLine(container, text) {
    return new Promise((resolve) => {
      const line = document.createElement("div");
      line.classList.add("line");

      const prompt = document.createElement("span");
      prompt.classList.add("prompt");
      prompt.textContent = "$ ";
      line.appendChild(prompt);

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
      }, 25);
    });
  }

  function wait(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }
});