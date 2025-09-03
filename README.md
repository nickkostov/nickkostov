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
