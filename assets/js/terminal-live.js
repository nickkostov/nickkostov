document.addEventListener("DOMContentLoaded", () => {
  const inputBlocks = document.querySelectorAll('pre > code.language-terminal-input');
  const outputBlocks = document.querySelectorAll('pre > code.language-terminal-output');

  inputBlocks.forEach(async (codeBlock) => {
    const pre = codeBlock.parentElement;
    const lines = codeBlock.innerText.trim().split("\n");

    const container = document.createElement("div");
    container.classList.add("terminal-box");

    pre.replaceWith(container);

    for (let line of lines) {
      await typeLine(container, `$ ${line.trim()}`);
      await wait(400);
    }
  });

  outputBlocks.forEach((codeBlock) => {
    const pre = codeBlock.parentElement;
    const output = codeBlock.innerText.trim().split("\n");

    const container = document.createElement("div");
    container.classList.add("terminal-box");

    output.forEach(line => {
      const lineDiv = document.createElement("div");
      lineDiv.classList.add("line");
      lineDiv.textContent = line;
      container.appendChild(lineDiv);
    });

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
