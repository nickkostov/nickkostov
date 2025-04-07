function initTerminalBlocks() {
  const inputBlocks = Array.from(document.querySelectorAll('pre > code.language-terminal-input'));

  if (inputBlocks.length === 0) return;

  inputBlocks.forEach((codeBlock) => {
    const pre = codeBlock.parentElement;

    // Skip if already processed
    if (pre.classList.contains("terminal-processed")) return;

    pre.classList.add("terminal-processed");

    const rawLines = codeBlock.innerText.trim().split("\n");

    const blocks = [];
    let i = 0;
    while (i < rawLines.length) {
      const line = rawLines[i].trim();
      if (line === "_output_:") {
        const outputLines = [];
        i++;
        while (
          i < rawLines.length &&
          rawLines[i].trim() !== "_output_:" &&
          rawLines[i].trim() !== "" &&
          !rawLines[i].trim().startsWith("_output_:")
        ) {
          outputLines.push(rawLines[i].trim());
          i++;
        }
        blocks.push({ type: "output", lines: outputLines });
      } else if (line !== "") {
        blocks.push({ type: "command", lines: [line] });
        i++;
      } else {
        i++;
      }
    }

    const container = document.createElement("div");
    container.classList.add("terminal-box");

    const buttonsWrapper = document.createElement("div");
    buttonsWrapper.classList.add("terminal-buttons");

    const playBtn = document.createElement("button");
    playBtn.classList.add("terminal-play");
    playBtn.textContent = "▶ Play";

    const copyBtn = document.createElement("button");
    copyBtn.classList.add("terminal-copy");
    copyBtn.textContent = "📋 Copy";

    buttonsWrapper.appendChild(playBtn);
    buttonsWrapper.appendChild(copyBtn);
    container.appendChild(buttonsWrapper);

    const terminalBody = document.createElement("div");
    terminalBody.classList.add("terminal-body");
    container.appendChild(terminalBody);

    pre.replaceWith(container);

    playBtn.addEventListener("click", () =>
      runBlocks(blocks, terminalBody, buttonsWrapper)
    );

    copyBtn.addEventListener("click", () => {
      const joined = blocks.map(b => b.lines.join("\n")).join("\n");
      navigator.clipboard.writeText(joined).then(() => {
        copyBtn.textContent = "✅ Copied!";
        setTimeout(() => (copyBtn.textContent = "📋 Copy"), 1500);
      });
    });
  });
}

function runBlocks(blocks, container, buttonsWrapper) {
  const oldButtons = container.parentElement.querySelector(".terminal-buttons");
  if (oldButtons) oldButtons.remove();

  container.innerHTML = "";
  let i = 0;

  const nextBlock = () => {
    if (i >= blocks.length) {
      const newWrapper = document.createElement("div");
      newWrapper.classList.add("terminal-buttons");

      const replayBtn = document.createElement("button");
      replayBtn.classList.add("terminal-play");
      replayBtn.textContent = "↻ Replay";
      replayBtn.addEventListener("click", () =>
        runBlocks(blocks, container, newWrapper)
      );

      const copyBtn = document.createElement("button");
      copyBtn.classList.add("terminal-copy");
      copyBtn.textContent = "📋 Copy";
      copyBtn.addEventListener("click", () => {
        const joined = blocks.map(b => b.lines.join("\n")).join("\n");
        navigator.clipboard.writeText(joined).then(() => {
          copyBtn.textContent = "✅ Copied!";
          setTimeout(() => (copyBtn.textContent = "📋 Copy"), 1500);
        });
      });

      newWrapper.appendChild(replayBtn);
      newWrapper.appendChild(copyBtn);
      container.parentElement.insertBefore(newWrapper, container);
      return;
    }

    const block = blocks[i];
    if (block.type === "command") {
      typeLine(container, block.lines[0]).then(() => {
        i++;
        wait(300).then(nextBlock);
      });
    } else if (block.type === "output") {
      block.lines.forEach(line => appendOutput(container, line));
      i++;
      wait(300).then(nextBlock);
    }
  };

  nextBlock();
}

function typeLine(container, text) {
  return new Promise((resolve) => {
    const line = document.createElement("div");
    line.classList.add("line");

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

function appendOutput(container, text) {
  const outputLine = document.createElement("div");
  outputLine.classList.add("line", "output");
  outputLine.textContent = text;
  container.appendChild(outputLine);
}

function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// ⏯️ Initial execution on page load
document.addEventListener("DOMContentLoaded", initTerminalBlocks);

// 🔁 React to dynamic DOM changes
const observer = new MutationObserver(() => {
  const needsInit = Array.from(document.querySelectorAll('pre > code.language-terminal-input'))
    .some(el => !el.parentElement.classList.contains("terminal-processed"));

  if (needsInit) {
    console.log("🔁 DOM mutation detected – running initTerminalBlocks()");
    initTerminalBlocks();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
