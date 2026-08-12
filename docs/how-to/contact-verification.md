# Contact verification

Run `contact` in the website terminal. LinkedIn, GitHub, and Website are immediately clickable. Email and phone initially display as blurred `hidden` values. Solve the displayed arithmetic question and select **Reveal email & phone** to reveal clickable email and telephone links for the current page session.

Reloading the page resets verification and masks the values again. An incorrect answer leaves both values hidden.

## Security boundary

This check discourages casual viewing but is not a real CAPTCHA or anti-scraping boundary. The site is static and downloads `content/content.json` into the browser, so an automated client can still retrieve the underlying values.

Strong protection requires removing private values from the static JSON and retrieving them from a server-side endpoint only after a service such as Cloudflare Turnstile validates the visitor.
