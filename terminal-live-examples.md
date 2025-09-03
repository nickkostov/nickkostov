---
title: Terminal Live Examples
layout: page
---

Below are several runnable terminal examples demonstrating how to write Markdown that renders as an animated terminal session with commands and outputs.

## Basic playback

```terminal-input
echo "hello world"
_output_:
hello world
```

## Multiple commands and outputs

```terminal-input
pwd
_output_:
/home/user/project
ls -1
_output_:
README.md
src
package.json
```

## Custom prompt per block

Use raw HTML to set a custom prompt for a single block via `data-prompt`.

<pre data-prompt="#"><code class="language-terminal-input">whoami
_output_:
root
</code></pre>

Tip: you can also set a global prompt by defining `window.terminalLiveConfig = { prompt: ">" }` before the terminal script loads (see README for details).

