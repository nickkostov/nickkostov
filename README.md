## Hi there 👋

<!--
**nickkostov/nickkostov** is a ✨ _special_ ✨ repository because its `README.md` (this file) appears on your GitHub profile.

Here are some ideas to get you started:

- 🔭 I’m currently working on ...
- 🌱 I’m currently learning ...
- 👯 I’m looking to collaborate on ...
- 🤔 I’m looking for help with ...
- 💬 Ask me about ...
- 📫 How to reach me: ...
- 😄 Pronouns: ...
 - ⚡ Fun fact: ...
 -->

### Terminal prompt customization

Terminal command blocks render with a default `$` prompt. Override it by:

1. Setting a `data-prompt` attribute on the `<pre>` or `<code>` element.
2. Providing a global `window.terminalLiveConfig = { prompt: '>' }` before the script loads.

Example using `data-prompt`:

```html
<pre data-prompt="#"><code class="language-terminal-input">
echo hello
_output_:
hello
</code></pre>
```

The commands above will display with a `#` prompt instead of the default `$`.

### Terminal Live

Terminal Live renders interactive, animated terminal sessions from simple Markdown code blocks. It types commands with a blinking cursor and shows their output, with controls to play, replay, and copy the sequence. This is useful for tutorials and documentation where you want readers to see commands “played back” rather than static text.

Example Markdown that generates a terminal block:

```markdown
```terminal-input
echo "hello"
_output_:
hello
```
```

Notes:
- Use a fenced code block with the language set to `terminal-input`.
- Add an `_output_:` line to start the output section; subsequent lines until a blank line are treated as output.
- You can override the prompt per block via a `data-prompt` attribute on the `<pre>` or `<code>` element, or globally via `window.terminalLiveConfig.prompt`.

Customization (planned):
- Prompt: already supported via `data-prompt` or `window.terminalLiveConfig.prompt`.
- Typing speed: will be configurable (per-block and/or global) once implemented.
- Cursor style: will be configurable (appearance/blink) once implemented.
