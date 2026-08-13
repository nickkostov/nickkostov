const { test, expect } = require('@playwright/test');
const cvContent = require('../content/content.json');

function httpsUrl(value) {
    return `https://${value.replace(/^https?:\/\//i, '')}`;
}

async function openTerminal(page) {
    const contentResponse = page.waitForResponse(response =>
        response.url().includes('/content/content.json') && response.ok()
    );

    await page.goto('/');
    await contentResponse;
    await expect(page.locator('#startupStatus')).toHaveText(
        "Terminal initialized. Type 'help' for available commands."
    );
    await expect(page.locator('#commandInput')).toBeEnabled();
    await expect(page.locator('#commandInput')).toBeFocused();
}

async function runCommand(page, command) {
    const input = page.locator('#commandInput');
    await input.fill(command);
    await input.press('Enter');
}

async function expectActivePromptLast(page) {
    await expect(page.locator('#commandInput')).toHaveCount(1);
    await expect(page.locator('#commandInput')).toBeFocused();
    await expect(page.locator('#terminalBody > :last-child')).toHaveAttribute('id', 'activePrompt');
}

test('starts with a focused terminal prompt', async ({ page }) => {
    const pageResponse = page.waitForResponse(response => response.url().endsWith('/'));
    await openTerminal(page);
    const response = await pageResponse;

    await expect(page).toHaveTitle('Nikolay Kostov - Digital CV');
    expect(response.headers()['cache-control']).toContain('no-store');
    await expect(page.locator('#buildVersion')).toHaveText('build: cp10-under-construction-20260813');
    await expect(page.locator('#startupBanner')).toContainText('nickkostov.bg');
    await expect(page.locator('#startupBanner')).toContainText(cvContent.about.name);
    await expect(page.locator('#startupBanner')).toContainText(cvContent.about.title);
    await expect(page.locator('.construction-banner')).toHaveRole('status');
    await expect(page.locator('.construction-banner')).toContainText('still under construction');
    await expect(page.locator('.terminal-nav-button').first()).toBeEnabled();
});

test('loads without external visual assets', async ({ page }) => {
    await openTerminal(page);

    await expect(page.locator('link[rel="stylesheet"][href^="http"]')).toHaveCount(0);
    await expect(page.locator('script[src^="http"]')).toHaveCount(0);
    await expect(page.locator('img[src^="http"]')).toHaveCount(0);
});

test('keeps terminal content within a narrow mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openTerminal(page);

    for (const section of ['Skills', 'Projects', 'Contact']) {
        await page.getByRole('button', { name: section, exact: true }).click();
        const hasPageOverflow = await page.evaluate(() =>
            document.documentElement.scrollWidth > document.documentElement.clientWidth
        );
        expect(hasPageOverflow).toBe(false);
    }

    const navigationScrolls = await page.locator('#terminalNav').evaluate(element =>
        element.scrollWidth > element.clientWidth
    );
    expect(navigationScrolls).toBe(true);
});

test('keeps terminal content within a desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openTerminal(page);

    for (const section of ['Home', 'About', 'Skills', 'CV', 'PDF', 'Projects', 'Contact', 'Stats', 'Certifications']) {
        await page.getByRole('button', { name: section, exact: true }).click();
        const dimensions = await page.evaluate(() => ({
            pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
            bodyOverflow: document.body.scrollWidth > document.body.clientWidth
        }));
        expect(dimensions.pageOverflow || dimensions.bodyOverflow).toBe(false);
    }
});

test('exposes terminal semantics and honors reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openTerminal(page);

    await expect(page.locator('#terminalBody')).toHaveAttribute('role', 'log');
    await expect(page.locator('#terminalBody')).toHaveAttribute('aria-live', 'off');
    await expect(page.locator('#commandInput')).toHaveAccessibleName('Terminal command');
    await runCommand(page, 'home');
    await expect(page.locator('#terminalBody > .output-line[aria-live="polite"]')).toHaveAttribute(
        'aria-label',
        'Output for home'
    );

    const motion = await page.locator('body').evaluate(element => {
        const styles = getComputedStyle(element);
        return { animationDuration: styles.animationDuration, transitionDuration: styles.transitionDuration };
    });
    expect(Number.parseFloat(motion.animationDuration)).toBeLessThanOrEqual(0.001);
    expect(Number.parseFloat(motion.transitionDuration)).toBeLessThanOrEqual(0.001);
});

test('opens every main section from the alternative navbar', async ({ page }) => {
    await openTerminal(page);
    const expectedNavigation = [
        ['Help', 'Available commands:'],
        ['Home', cvContent.home.title],
        ['About', 'About Me'],
        ['Skills', 'My Skills'],
        ['CV', 'Curriculum Vitae'],
        ['PDF', 'Print / Save as PDF'],
        ['Projects', 'My Projects'],
        ['Contact', 'Contact Information'],
        ['Stats', 'Professional Statistics'],
        ['Certifications', 'Certifications']
    ];

    await expect(page.locator('.terminal-nav-button')).toHaveCount(expectedNavigation.length);
    for (const [label, output] of expectedNavigation) {
        const button = page.getByRole('button', { name: label, exact: true });
        await button.click();
        await expect(page.locator('#terminalBody')).toContainText(output);
        await expect(button).toHaveAttribute('aria-current', 'page');
        await expect(button).toBeFocused();
        await expect(page.locator('#commandInput')).toHaveCount(1);
        await expect(page.locator('#terminalBody > :last-child')).toHaveAttribute('id', 'activePrompt');
    }
});

test('runs a known command', async ({ page }) => {
    await openTerminal(page);
    await runCommand(page, 'help');

    await expect(page.locator('#terminalBody')).toContainText('Available commands:');
    await expect(page.locator('#terminalBody')).toContainText('cv (cat resume) - CV and resume');
    await expect(page.locator('.completed-command')).toContainText('help');
    await expectActivePromptLast(page);
});

test('does not expose a GitHub command or navigation button', async ({ page }) => {
    await openTerminal(page);
    await runCommand(page, 'help');

    await expect(page.getByRole('button', { name: 'GitHub', exact: true })).toHaveCount(0);
    await expect(page.locator('#terminalBody')).not.toContainText('github -');
});

test('reports an unknown command', async ({ page }) => {
    await openTerminal(page);
    await runCommand(page, 'not-a-command');

    await expect(page.locator('.command-error')).toHaveText(
        "Command not found: not-a-command. Type 'help' for available commands."
    );
    await expectActivePromptLast(page);
});

test('clear restores one empty focused input', async ({ page }) => {
    await openTerminal(page);
    await runCommand(page, 'help');
    await runCommand(page, 'clear');

    await expect(page.locator('#commandInput')).toHaveCount(1);
    await expect(page.locator('#commandInput')).toBeEmpty();
    await expect(page.locator('#commandInput')).toBeFocused();
    await expect(page.locator('#terminalBody')).not.toContainText('Available commands:');
    await expectActivePromptLast(page);
});

test('CV command exposes the work history and PDF download', async ({ page }) => {
    await openTerminal(page);
    await runCommand(page, 'cv');

    const downloadLink = page.getByRole('link', { name: 'Download resume' });
    await expect(downloadLink).toHaveAttribute('href', 'resume/resume.pdf');
    await expect(downloadLink).toHaveAttribute('download', '');
    await expectActivePromptLast(page);
});

test('pdf command builds a printable CV and opens the print dialog', async ({ page }) => {
    await page.addInitScript(() => {
        window.print = () => {
            document.body.dataset.printRequested = 'true';
        };
    });
    await openTerminal(page);
    await runCommand(page, 'pdf');

    await expect(page.locator('.pdf-export')).toContainText(cvContent.about.name);
    await expect(page.locator('.pdf-export')).toContainText(Object.values(cvContent.cv)[0].company);
    await expect(page.locator('.pdf-export')).toContainText('Certifications');
    await expect(page.locator('.pdf-contact')).toContainText(cvContent.contact.github);
    await page.getByRole('button', { name: 'Print / Save as PDF' }).click();
    await expect(page.locator('body')).toHaveAttribute('data-print-requested', 'true');

    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('.terminal-header')).toBeHidden();
    await expect(page.locator('.construction-banner')).toBeHidden();
    await expect(page.locator('.pdf-export')).toBeVisible();
});

test('keeps only the latest transcript before the active prompt', async ({ page }) => {
    await openTerminal(page);
    await runCommand(page, 'help');
    await runCommand(page, 'about');

    await expect(page.locator('.completed-command')).toHaveCount(1);
    await expect(page.locator('.completed-command')).toContainText('about');
    await expect(page.locator('#terminalBody')).toContainText('About Me');
    await expect(page.locator('#terminalBody')).not.toContainText('Available commands:');
    await expectActivePromptLast(page);
});

test('preserves command history navigation', async ({ page }) => {
    await openTerminal(page);
    await runCommand(page, 'help');
    await runCommand(page, 'about');

    const input = page.locator('#commandInput');
    await input.press('ArrowUp');
    await expect(input).toHaveValue('about');
    await input.press('ArrowUp');
    await expect(input).toHaveValue('help');
    await input.press('ArrowDown');
    await expect(input).toHaveValue('about');
    await input.press('ArrowDown');
    await expect(input).toHaveValue('');
});

test('runs every registered command and generates matching help entries', async ({ page }) => {
    await openTerminal(page);
    const commands = [
        'help', 'home', 'about', 'skills', 'cv', 'pdf', 'projects', 'contact', 'stats',
        'history', 'certifications'
    ];

    await runCommand(page, 'help');
    for (const command of [...commands, 'clear']) {
        await expect(page.locator('#terminalBody')).toContainText(command);
    }

    for (const command of commands) {
        await runCommand(page, command);
        await expect(page.locator('.command-error')).toHaveCount(0);
        await expect(page.locator('.completed-command')).toContainText(command);
        await expectActivePromptLast(page);
    }
});

test('renders every CV content section from content.json', async ({ page }) => {
    await page.addInitScript(() => {
        Math.random = () => 0;
    });
    await openTerminal(page);

    await runCommand(page, 'home');
    await expect(page.locator('#terminalBody')).toContainText(cvContent.home.title);
    await expect(page.locator('#terminalBody')).toContainText(cvContent.home.intro);
    await expect(page.locator('#terminalBody')).toContainText(cvContent.home.summary);

    await runCommand(page, 'about');
    await expect(page.locator('#terminalBody')).toContainText(cvContent.about.name);
    await expect(page.locator('#terminalBody')).toContainText(cvContent.about.summary);
    for (const paragraph of cvContent.about.story) {
        await expect(page.locator('#terminalBody')).toContainText(paragraph);
    }
    await expect(page.locator('.bio-journey > li')).toHaveCount(cvContent.about.journey.length);
    await expect(page.locator('#terminalBody')).toContainText(cvContent.about.motivation);

    await runCommand(page, 'skills');
    await expect(page.locator('#terminalBody')).toContainText(Object.values(cvContent.skills)[0][0]);
    await expect(page.locator('#terminalBody')).toContainText(cvContent.skillsDetailed[0].category);
    await expect(page.locator('#terminalBody')).toContainText(cvContent.skillsDetailed[0].items[0].description);
    await expect(page.locator('.skill-link[href="content/skills/aws.md"]')).toHaveCount(1);
    await expect(page.locator('.command-success[href="content/skills/aws.md"]')).toHaveCount(1);

    await runCommand(page, 'cv');
    await expect(page.locator('#terminalBody')).toContainText(Object.values(cvContent.cv)[0].company);
    await expect(page.getByRole('link', { name: 'Download resume' })).toBeVisible();

    await runCommand(page, 'projects');
    await expect(page.locator('#terminalBody')).toContainText(cvContent.projects[0].name);

    await runCommand(page, 'contact');
    await expect(page.locator('#terminalBody')).toContainText(cvContent.contact.github);

    await runCommand(page, 'stats');
    await expect(page.locator('#terminalBody')).toContainText(String(cvContent.stats.experienceYears));

    await runCommand(page, 'certifications');
    await expect(page.locator('#terminalBody')).toContainText(cvContent.certifications[0].name);

});

test('links every certification to its credential', async ({ page }) => {
    await openTerminal(page);
    await runCommand(page, 'certifications');

    const certificationItems = page.locator('.cert-list > li');
    await expect(certificationItems).toHaveCount(cvContent.certifications.length);

    for (const certification of cvContent.certifications) {
        const link = page.getByRole('link', { name: certification.name, exact: true });
        await expect(link).toHaveAttribute('href', certification.credentialUrl);
        await expect(link).toHaveAttribute('target', '_blank');
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }

    await expect(page.locator('.cert-meta')).toContainText('9QJ69W0BEF41QVG2');
    await expect(page.getByText('No longer supported', { exact: true })).toHaveCount(1);
});

test('supports terminal-style command aliases', async ({ page }) => {
    await openTerminal(page);

    await runCommand(page, 'ls');
    await expect(page.locator('#terminalBody')).toContainText('Available commands:');

    await runCommand(page, 'whoami');
    await expect(page.locator('#terminalBody')).toContainText('About Me');

    await runCommand(page, 'cat resume');
    await expect(page.getByRole('link', { name: 'Download resume' })).toBeVisible();

});

test('masks private contact coordinates behind a human check', async ({ page }) => {
    await openTerminal(page);
    await runCommand(page, 'contact');

    const items = page.locator('.contact-list > li');
    await expect(items).toHaveCount(5);
    await expect(page.locator('.contact-icon')).toHaveText(['📧', '📞', '💼', '🐙', '🌐']);
    await expect(items.nth(0)).toContainText('Email: hidden');
    await expect(items.nth(1)).toContainText('Phone: hidden');
    await expect(page.locator('#terminalBody')).not.toContainText(cvContent.contact.email);
    await expect(page.locator('#terminalBody')).not.toContainText(cvContent.contact.phone);
    await expect(items.nth(2)).toContainText('LinkedIn:');
    await expect(items.nth(3)).toContainText(`GitHub: ${cvContent.contact.github}`);
    await expect(items.nth(4)).toContainText('Website:');
    await expect(page.getByRole('link', { name: cvContent.contact.linkedin })).toHaveAttribute(
        'href',
        httpsUrl(cvContent.contact.linkedin)
    );
    await expect(page.getByRole('link', { name: cvContent.contact.github })).toHaveAttribute(
        'href',
        httpsUrl(cvContent.contact.github)
    );
    await expect(page.getByRole('link', { name: cvContent.contact.website })).toHaveAttribute(
        'href',
        httpsUrl(cvContent.contact.website)
    );
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
    await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
    await expect(page.locator('.contact-verification')).toContainText("Verify you're human:");
});

test('reveals email and phone after a correct human check', async ({ page }) => {
    await openTerminal(page);
    await runCommand(page, 'contact');

    const prompt = await page.locator('.contact-verification label').textContent();
    const operands = prompt.match(/(\d+) \+ (\d+)/).slice(1).map(Number);
    await page.locator('.verification-input').fill(String(operands[0] + operands[1]));
    await page.getByRole('button', { name: 'Reveal email & phone' }).click();

    await expect(page.locator('.contact-verification')).toHaveCount(0);
    await expect(page.locator('#terminalBody')).toContainText(cvContent.contact.email);
    await expect(page.locator('#terminalBody')).toContainText(cvContent.contact.phone);
    await expect(page.locator('.contact-private')).toHaveCount(0);
    await expect(page.locator('.contact-list > li').nth(0).locator('span').last()).toHaveCSS('filter', 'none');
    await expect(page.locator('.contact-list > li').nth(1).locator('span').last()).toHaveCSS('filter', 'none');
    await expect(page.getByRole('link', { name: cvContent.contact.email })).toHaveAttribute(
        'href',
        `mailto:${cvContent.contact.email}`
    );
    await expect(page.getByRole('link', { name: cvContent.contact.phone })).toHaveAttribute(
        'href',
        `tel:${cvContent.contact.phone.replace(/[^\d+]/g, '')}`
    );
    await expect(page.locator('#commandInput')).toBeFocused();
});

test('supports keyboard navigation through contact verification', async ({ page }) => {
    await openTerminal(page);
    await runCommand(page, 'contact');

    const verificationInput = page.locator('.verification-input');
    const prompt = await page.locator('.contact-verification label').textContent();
    const operands = prompt.match(/(\d+) \+ (\d+)/).slice(1).map(Number);
    await verificationInput.fill(String(operands[0] + operands[1]));
    await verificationInput.press('Tab');
    await expect(page.getByRole('button', { name: 'Reveal email & phone' })).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page.locator('.contact-verification')).toHaveCount(0);
    await expect(page.locator('#commandInput')).toBeFocused();
});

test('keeps contact details hidden after a failed human check', async ({ page }) => {
    await openTerminal(page);
    await runCommand(page, 'contact');

    await page.locator('.verification-input').fill('-1');
    await page.getByRole('button', { name: 'Reveal email & phone' }).click();

    await expect(page.locator('.verification-status')).toHaveText('Verification failed. Try again.');
    await expect(page.locator('#terminalBody')).not.toContainText(cvContent.contact.email);
    await expect(page.locator('#terminalBody')).not.toContainText(cvContent.contact.phone);
});

test('parses command names case-insensitively and preserves argument case', async ({ page }) => {
    await openTerminal(page);
    await runCommand(page, 'ABOUT KeepThisCase');
    await expect(page.locator('#terminalBody')).toContainText('About Me');

    await runCommand(page, 'history');
    await expect(page.locator('#terminalBody')).toContainText('1. ABOUT KeepThisCase');
});

test('Tab completes one command or alias', async ({ page }) => {
    await openTerminal(page);
    const input = page.locator('#commandInput');

    await input.fill('abo');
    await input.press('Tab');
    await expect(input).toHaveValue('about');

    await input.fill('cat r');
    await input.press('Tab');
    await expect(input).toHaveValue('cat resume');
});

test('Tab suggests multiple matches without changing the input', async ({ page }) => {
    await openTerminal(page);
    const input = page.locator('#commandInput');
    await input.fill('s');
    await input.press('Tab');

    await expect(input).toHaveValue('s');
    await expect(page.locator('.completion-output')).toHaveText('skills  stats');
    await expectActivePromptLast(page);
});

test('Tab leaves unmatched input unchanged', async ({ page }) => {
    await openTerminal(page);
    const input = page.locator('#commandInput');
    await input.fill('zzz');
    await input.press('Tab');

    await expect(input).toHaveValue('zzz');
    await expect(page.locator('.completion-output')).toHaveCount(0);
});

test('Ctrl+C cancels non-empty input and keeps a fresh prompt', async ({ page }) => {
    await openTerminal(page);
    const input = page.locator('#commandInput');
    await input.fill('unfinished command');
    await input.press('Control+c');

    await expect(page.locator('.completed-command')).toContainText('unfinished command ^C');
    await expect(page.locator('.interrupt-marker')).toHaveText('^C');
    await expect(input).toHaveValue('');
    await expectActivePromptLast(page);
});

test('Ctrl+C cancels empty input', async ({ page }) => {
    await openTerminal(page);
    const input = page.locator('#commandInput');
    await input.press('Control+c');

    await expect(page.locator('.completed-command')).toContainText('$^C');
    await expect(page.locator('.interrupt-marker')).toHaveText('^C');
    await expect(input).toHaveValue('');
    await expectActivePromptLast(page);
});

test('Ctrl+L clears output without losing focus or history', async ({ page }) => {
    await openTerminal(page);
    await runCommand(page, 'help');

    const input = page.locator('#commandInput');
    await input.press('Control+l');
    await expect(page.locator('.output-line')).toHaveCount(0);
    await expectActivePromptLast(page);

    await input.press('ArrowUp');
    await expect(input).toHaveValue('help');
});

test('does not prevent unhandled Ctrl shortcuts', async ({ page }) => {
    await openTerminal(page);
    await page.evaluate(() => {
        document.addEventListener('keydown', event => {
            if (event.ctrlKey && event.key.toLowerCase() === 'k') {
                document.body.dataset.ctrlKPrevented = String(event.defaultPrevented);
            }
        });
    });

    await page.locator('#commandInput').press('Control+k');
    await expect(page.locator('body')).toHaveAttribute('data-ctrl-k-prevented', 'false');
});

test('renders markup-like commands as plain text', async ({ page }) => {
    await openTerminal(page);
    const markupCommand = '<img src=x onerror="document.body.dataset.injected=1">';
    await runCommand(page, markupCommand);

    await expect(page.locator('.submitted-command')).toHaveText(markupCommand);
    await expect(page.locator('.command-error')).toContainText(markupCommand);
    await expect(page.locator('#terminalBody img')).toHaveCount(0);
    await expect(page.locator('body')).not.toHaveAttribute('data-injected', '1');
});

test('renders JSON-backed markup as plain text', async ({ page }) => {
    const injectedName = '<img id="injected-content" src=x onerror="document.body.dataset.injected=1">';

    await page.route('**/content/content.json', async route => {
        const response = await route.fetch();
        const body = await response.json();
        body.about.name = injectedName;
        await route.fulfill({ response, json: body });
    });

    await page.goto('/');
    await expect(page.locator('#commandInput')).toBeEnabled();
    await runCommand(page, 'about');

    await expect(page.locator('#terminalBody')).toContainText(injectedName);
    await expect(page.locator('#injected-content')).toHaveCount(0);
    await expect(page.locator('body')).not.toHaveAttribute('data-injected', '1');
});

test('keeps input disabled while content is loading', async ({ page }) => {
    let releaseResponse;
    const responseGate = new Promise(resolve => {
        releaseResponse = resolve;
    });

    await page.route('**/content/content.json', async route => {
        await responseGate;
        await route.continue();
    });

    await page.goto('/');
    await expect(page.locator('#startupStatus')).toHaveText('initializing...');
    await expect(page.locator('#commandInput')).toBeDisabled();
    await expect(page.locator('.terminal-nav-button').first()).toBeDisabled();

    releaseResponse();

    await expect(page.locator('#startupStatus')).toContainText('Terminal initialized.');
    await expect(page.locator('#commandInput')).toBeEnabled();
    await expect(page.locator('#commandInput')).toBeFocused();
    await expect(page.locator('.terminal-nav-button').first()).toBeEnabled();
});

test('reports an HTTP content-loading failure', async ({ page }) => {
    await page.route('**/content/content.json', route => route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: '{}'
    }));

    await page.goto('/');

    await expect(page.locator('#startupStatus')).toHaveText(
        'Initialization failed: content request returned HTTP 503. Refresh to try again.'
    );
    await expect(page.locator('#startupStatus')).toHaveClass(/command-error/);
    await expect(page.locator('#commandInput')).toBeDisabled();
});

test('reports a network content-loading failure', async ({ page }) => {
    await page.route('**/content/content.json', route => route.abort('failed'));

    await page.goto('/');

    await expect(page.locator('#startupStatus')).toHaveText(
        'Initialization failed: content request could not be completed. Refresh to try again.'
    );
    await expect(page.locator('#commandInput')).toBeDisabled();
});

test('reports malformed content JSON', async ({ page }) => {
    await page.route('**/content/content.json', route => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{not-valid-json'
    }));

    await page.goto('/');

    await expect(page.locator('#startupStatus')).toHaveText(
        'Initialization failed: content response is not valid JSON. Refresh to try again.'
    );
    await expect(page.locator('#commandInput')).toBeDisabled();
});

test('reports a missing required content field', async ({ page }) => {
    await page.route('**/content/content.json', async route => {
        const response = await route.fetch();
        const body = await response.json();
        delete body.home.title;
        await route.fulfill({ response, json: body });
    });

    await page.goto('/');

    await expect(page.locator('#startupStatus')).toHaveText(
        'Initialization failed: content is missing required field: home.title. Refresh to try again.'
    );
    await expect(page.locator('#commandInput')).toBeDisabled();
});

test('allows CV jobs without project details', async ({ page }) => {
    await page.route('**/content/content.json', async route => {
        const response = await route.fetch();
        const body = await response.json();
        delete body.cv.sportsmodule.projects;
        await route.fulfill({ response, json: body });
    });

    await openTerminal(page);
    await runCommand(page, 'cv');

    await expect(page.locator('#commandInput')).toBeEnabled();
    await expect(page.locator('.cv-entry').first()).not.toContainText('Projects:');
});

test('reports an incorrectly typed content field', async ({ page }) => {
    await page.route('**/content/content.json', async route => {
        const response = await route.fetch();
        const body = await response.json();
        body.certifications = 'not-an-array';
        await route.fulfill({ response, json: body });
    });

    await page.goto('/');

    await expect(page.locator('#startupStatus')).toHaveText(
        'Initialization failed: content field certifications must be a non-empty array. Refresh to try again.'
    );
    await expect(page.locator('#commandInput')).toBeDisabled();
});

for (const field of ['linkedin', 'github', 'website']) {
    test(`rejects a malformed contact URL: ${field}`, async ({ page }) => {
        await page.route('**/content/content.json', async route => {
            const response = await route.fetch();
            const body = await response.json();
            body.contact[field] = 'not-a-url';
            await route.fulfill({ response, json: body });
        });

        await page.goto('/');

        await expect(page.locator('#startupStatus')).toHaveText(
            `Initialization failed: content field contact.${field} must be a valid HTTPS URL. Refresh to try again.`
        );
        await expect(page.locator('#commandInput')).toBeDisabled();
    });
}

test('rejects a non-HTTPS certification credential URL', async ({ page }) => {
    await page.route('**/content/content.json', async route => {
        const response = await route.fetch();
        const body = await response.json();
        body.certifications[0].credentialUrl = 'javascript:alert(1)';
        await route.fulfill({ response, json: body });
    });

    await page.goto('/');

    await expect(page.locator('#startupStatus')).toHaveText(
        'Initialization failed: content field certifications[0].credentialUrl must be a valid HTTPS URL. Refresh to try again.'
    );
    await expect(page.locator('#commandInput')).toBeDisabled();
});

test('rejects an unsafe skill Markdown path', async ({ page }) => {
    await page.route('**/content/content.json', async route => {
        const response = await route.fetch();
        const body = await response.json();
        body.skillsDetailed[0].items[0].url = '../private.md';
        await route.fulfill({ response, json: body });
    });

    await page.goto('/');

    await expect(page.locator('#startupStatus')).toHaveText(
        'Initialization failed: content field skillsDetailed[0].items[0].url must be a repository-relative Markdown path. Refresh to try again.'
    );
    await expect(page.locator('#commandInput')).toBeDisabled();
});
