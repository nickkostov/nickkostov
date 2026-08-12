# Terminal visual theme

The terminal theme is defined in `style.css` using custom color properties under `:root`. It uses local system monospace fonts and a text-based `>_` logo, so no external icon or font stylesheet is required.

The startup banner takes its name, title, and location from `content/content.json`. Content sections use compact rows, left borders, and dashed separators instead of dashboard cards.

At widths up to 700px, content spacing contracts, skill and statistic rows become single-column, prompts and long contact values wrap, the footer stacks, and the navbar remains horizontally scrollable without widening the page.
