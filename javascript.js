let contentData = null;

function requiredField(parent, key, path) {
    if (!parent || !Object.prototype.hasOwnProperty.call(parent, key)) {
        throw new Error(`content is missing required field: ${path}`);
    }
    return parent[key];
}

function requiredObject(value, path) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error(`content field ${path} must be an object`);
    }
    return value;
}

function requiredArray(value, path) {
    if (!Array.isArray(value) || value.length === 0) {
        throw new Error(`content field ${path} must be a non-empty array`);
    }
    return value;
}

function requiredString(value, path) {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new Error(`content field ${path} must be a non-empty string`);
    }
}

function requiredNumber(value, path) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new Error(`content field ${path} must be a number`);
    }
}

function requiredHttpsUrl(value, path) {
    requiredString(value, path);
    let url;
    try {
        url = new URL(value);
    } catch (error) {
        throw new Error(`content field ${path} must be a valid HTTPS URL`);
    }
    if (url.protocol !== 'https:') {
        throw new Error(`content field ${path} must be a valid HTTPS URL`);
    }
}

function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
}

function createOutputLine(className = '') {
    return createElement('div', `output-line${className ? ` ${className}` : ''}`);
}

function createTitle(text) {
    return createElement('div', 'command-title', text);
}

function createLink(text, href, className = 'contact-link', newTab = false) {
    const link = createElement('a', className, text);
    link.href = href;
    if (newTab) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    }
    return link;
}

function validateStringFields(object, path, fields) {
    fields.forEach(field => {
        requiredString(requiredField(object, field, `${path}.${field}`), `${path}.${field}`);
    });
}

function validateStringArray(value, path) {
    requiredArray(value, path).forEach((item, index) => requiredString(item, `${path}[${index}]`));
}

function validateContent(data) {
    const root = requiredObject(data, 'root');

    const home = requiredObject(requiredField(root, 'home', 'home'), 'home');
    validateStringFields(home, 'home', ['title', 'intro', 'summary']);

    const about = requiredObject(requiredField(root, 'about', 'about'), 'about');
    validateStringFields(about, 'about', ['name', 'title', 'location', 'summary', 'motivation']);
    validateStringArray(requiredField(about, 'story', 'about.story'), 'about.story');
    requiredArray(requiredField(about, 'journey', 'about.journey'), 'about.journey')
        .forEach((value, index) => {
            const item = requiredObject(value, `about.journey[${index}]`);
            validateStringFields(item, `about.journey[${index}]`, ['stage', 'detail']);
        });

    const contact = requiredObject(requiredField(root, 'contact', 'contact'), 'contact');
    validateStringFields(contact, 'contact', ['email', 'phone', 'linkedin', 'github', 'website']);
    ['linkedin', 'github', 'website'].forEach(field => {
        requiredHttpsUrl(contact[field], `contact.${field}`);
    });

    const stats = requiredObject(requiredField(root, 'stats', 'stats'), 'stats');
    ['experienceYears', 'projectsCompleted', 'companiesWorked', 'certifications'].forEach(field => {
        requiredNumber(requiredField(stats, field, `stats.${field}`), `stats.${field}`);
    });

    const skills = requiredObject(requiredField(root, 'skills', 'skills'), 'skills');
    const skillEntries = Object.entries(skills);
    if (skillEntries.length === 0) throw new Error('content field skills must not be empty');
    skillEntries.forEach(([category, items]) => validateStringArray(items, `skills.${category}`));

    const cv = requiredObject(requiredField(root, 'cv', 'cv'), 'cv');
    const jobs = Object.entries(cv);
    if (jobs.length === 0) throw new Error('content field cv must not be empty');
    jobs.forEach(([key, value]) => {
        const job = requiredObject(value, `cv.${key}`);
        validateStringFields(job, `cv.${key}`, ['jobTitle', 'company', 'period']);
        validateStringArray(requiredField(job, 'skills', `cv.${key}.skills`), `cv.${key}.skills`);
        validateStringArray(requiredField(job, 'projects', `cv.${key}.projects`), `cv.${key}.projects`);
    });

    requiredArray(requiredField(root, 'projects', 'projects'), 'projects').forEach((value, index) => {
        const project = requiredObject(value, `projects[${index}]`);
        validateStringFields(project, `projects[${index}]`, ['name', 'description', 'period']);
        validateStringArray(
            requiredField(project, 'technologies', `projects[${index}].technologies`),
            `projects[${index}].technologies`
        );
    });

    validateStringArray(requiredField(root, 'quotes', 'quotes'), 'quotes');
    const certifications = requiredArray(requiredField(root, 'certifications', 'certifications'), 'certifications');
    if (stats.certifications !== certifications.length) {
        throw new Error('content field stats.certifications must equal certifications.length');
    }
    certifications
        .forEach((value, index) => {
            const certification = requiredObject(value, `certifications[${index}]`);
            requiredString(
                requiredField(certification, 'name', `certifications[${index}].name`),
                `certifications[${index}].name`
            );
            requiredHttpsUrl(
                requiredField(certification, 'credentialUrl', `certifications[${index}].credentialUrl`),
                `certifications[${index}].credentialUrl`
            );
            if (certification.credentialId !== undefined) {
                requiredString(certification.credentialId, `certifications[${index}].credentialId`);
            }
            if (certification.status !== undefined) {
                requiredString(certification.status, `certifications[${index}].status`);
            }
        });

    const experience = requiredObject(requiredField(root, 'experience', 'experience'), 'experience');
    requiredString(requiredField(experience, 'summary', 'experience.summary'), 'experience.summary');
    requiredArray(requiredField(experience, 'expertise', 'experience.expertise'), 'experience.expertise')
        .forEach((value, index) => {
            const item = requiredObject(value, `experience.expertise[${index}]`);
            validateStringFields(item, `experience.expertise[${index}]`, ['area', 'details']);
        });

    requiredArray(requiredField(root, 'skillsDetailed', 'skillsDetailed'), 'skillsDetailed')
        .forEach((value, sectionIndex) => {
            const section = requiredObject(value, `skillsDetailed[${sectionIndex}]`);
            requiredString(
                requiredField(section, 'category', `skillsDetailed[${sectionIndex}].category`),
                `skillsDetailed[${sectionIndex}].category`
            );
            requiredArray(
                requiredField(section, 'items', `skillsDetailed[${sectionIndex}].items`),
                `skillsDetailed[${sectionIndex}].items`
            ).forEach((itemValue, itemIndex) => {
                const item = requiredObject(itemValue, `skillsDetailed[${sectionIndex}].items[${itemIndex}]`);
                validateStringFields(
                    item,
                    `skillsDetailed[${sectionIndex}].items[${itemIndex}]`,
                    ['name', 'description']
                );
            });
        });
}

// Load content data from JSON file
async function loadContentData() {
    let response;

    try {
        response = await fetch('content/content.json');
    } catch (error) {
        throw new Error('content request could not be completed');
    }

    if (!response.ok) {
        throw new Error(`content request returned HTTP ${response.status}`);
    }

    let rawContent;
    try {
        rawContent = await response.json();
    } catch (error) {
        throw new Error('content response is not valid JSON');
    }

    validateContent(rawContent);
    contentData = rawContent;
}

// DOM elements
const terminalBody = document.getElementById('terminalBody');
const originalCommandInput = document.getElementById('commandInput');
const startupStatus = document.getElementById('startupStatus');
const bannerIdentity = document.getElementById('bannerIdentity');
const activePrompt = document.getElementById('activePrompt');
const terminalNav = document.getElementById('terminalNav');

// Current command history
let commandHistory = [];
let historyIndex = -1;
let contactVerified = false;
let contactChallenge = null;

function setStartupStatus(message, statusClass) {
    if (!startupStatus) return;

    startupStatus.className = `output-line ${statusClass}`;
    startupStatus.textContent = message;
}

function clearTerminal() {
    terminalBody.querySelectorAll('.output-line').forEach(line => line.remove());
    originalCommandInput.value = '';
    originalCommandInput.focus();
}

function renderCompletedCommand(command, marker = '') {
    const commandLine = document.createElement('div');
    commandLine.className = 'output-line prompt-line completed-command';

    [
        ['prompt-user', 'visitor'],
        ['prompt-host', '@nickkostov.bg:'],
        ['prompt-path', '~'],
        ['prompt-symbol', '$'],
        ['submitted-command command-success', command]
    ].forEach(([className, text]) => {
        const part = document.createElement('span');
        part.className = className;
        part.textContent = text;
        commandLine.appendChild(part);
    });

    if (marker) {
        const markerPart = document.createElement('span');
        markerPart.className = 'command-warning interrupt-marker';
        markerPart.textContent = command ? ` ${marker}` : marker;
        commandLine.appendChild(markerPart);
    }

    terminalBody.insertBefore(commandLine, activePrompt);
}

function cancelCurrentInput() {
    const pendingCommand = originalCommandInput.value;
    clearTerminal();
    renderCompletedCommand(pendingCommand, '^C');
    historyIndex = commandHistory.length;
    originalCommandInput.focus();
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

async function initializeTerminal() {
    initTerminal();
    initNavigation();

    try {
        await loadContentData();
        bannerIdentity.textContent = `${contentData.about.name} // ${contentData.about.title} // ${contentData.about.location}`;
        setStartupStatus("Terminal initialized. Type 'help' for available commands.", 'command-output');
        originalCommandInput.disabled = false;
        setNavigationDisabled(false);
        originalCommandInput.focus();
    } catch (error) {
        setStartupStatus(`Initialization failed: ${error.message}. Refresh to try again.`, 'command-error');
        originalCommandInput.disabled = true;
    }
}

function initNavigation() {
    commandRegistry
        .filter(command => command.navLabel)
        .forEach(command => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'terminal-nav-button';
            button.textContent = command.navLabel;
            button.dataset.command = command.name;
            button.disabled = true;
            button.addEventListener('click', () => {
                processCommand(command.name);
                button.focus();
            });
            terminalNav.appendChild(button);
        });
}

function setNavigationDisabled(disabled) {
    terminalNav.querySelectorAll('.terminal-nav-button').forEach(button => {
        button.disabled = disabled;
    });
}

function setActiveNavigation(commandName) {
    terminalNav.querySelectorAll('.terminal-nav-button').forEach(button => {
        if (button.dataset.command === commandName) {
            button.setAttribute('aria-current', 'page');
        } else {
            button.removeAttribute('aria-current');
        }
    });
}

// Initialize terminal with event listener on existing input field
function initTerminal() {
    if (originalCommandInput) {
        originalCommandInput.addEventListener('keydown', function(e) {
            const key = e.key.toLowerCase();

            if (e.ctrlKey && key === 'c') {
                e.preventDefault();
                cancelCurrentInput();
            } else if (e.ctrlKey && key === 'l') {
                e.preventDefault();
                clearTerminal();
                historyIndex = commandHistory.length;
            } else if (e.key === 'Tab') {
                e.preventDefault();
                completeCommand(this);
            } else if (e.key === 'Enter') {
                processCommand(this.value);
                this.value = '';
            } else if (e.key === 'ArrowUp') {
                if (commandHistory.length > 0) {
                    if (historyIndex > 0) {
                        historyIndex--;
                    }
                    this.value = commandHistory[historyIndex] || '';
                }
            } else if (e.key === 'ArrowDown') {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    this.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    this.value = '';
                }
            }
        });
    }
}

function renderHelp() {
    const output = document.createDocumentFragment();
    output.appendChild(createElement('div', 'command-info', 'Available commands:'));
    commandRegistry.forEach(command => {
        const entry = createOutputLine();
        entry.appendChild(createElement('span', 'command-success', command.name));
        if (command.aliases.length > 0) {
            entry.appendChild(document.createTextNode(` (${command.aliases.join(', ')})`));
        }
        entry.appendChild(document.createTextNode(` - ${command.description}`));
        output.appendChild(entry);
    });
    return output;
}

function renderHome() {
    const output = document.createDocumentFragment();
    output.appendChild(createTitle(contentData.home.title));
    output.appendChild(createElement('div', 'command-output', contentData.home.intro));
    output.appendChild(createElement('div', 'command-output', contentData.home.summary));
    return output;
}

function renderAbout() {
    const output = document.createDocumentFragment();
    output.appendChild(createTitle('About Me'));

    const identity = createElement('div', 'bio-identity');
    [['name', contentData.about.name], ['role', contentData.about.title], ['location', contentData.about.location]]
        .forEach(([label, value]) => {
            const row = createElement('div');
            row.append(createElement('span', 'bio-label', label), document.createTextNode(value));
            identity.appendChild(row);
        });
    output.appendChild(identity);

    const profile = createElement('div', 'bio-section');
    profile.append(createElement('div', 'bio-heading', 'Profile'), createElement('p', 'bio-paragraph', contentData.about.summary));
    output.appendChild(profile);

    const story = createElement('div', 'bio-section');
    story.appendChild(createElement('div', 'bio-heading', 'My path into technology'));
    contentData.about.story.forEach(paragraph => story.appendChild(createElement('p', 'bio-paragraph', paragraph)));
    output.appendChild(story);

    const journey = createElement('div', 'bio-section');
    journey.appendChild(createElement('div', 'bio-heading', 'Journey'));
    const journeyList = createElement('ol', 'bio-journey');
    contentData.about.journey.forEach((item, index) => {
        const row = createElement('li');
        row.append(
            createElement('span', 'bio-step', String(index + 1).padStart(2, '0')),
            createElement('span', 'bio-stage', item.stage),
            createElement('span', 'bio-detail', item.detail)
        );
        journeyList.appendChild(row);
    });
    journey.appendChild(journeyList);
    output.appendChild(journey);

    const motivation = createElement('div', 'bio-section bio-motivation');
    motivation.append(createElement('div', 'bio-heading', 'What drives me'), createElement('p', 'bio-paragraph', contentData.about.motivation));
    output.appendChild(motivation);
    return output;
}

function renderSkills() {
    const output = document.createDocumentFragment();
    output.appendChild(createTitle('My Skills'));
    const grid = createElement('div', 'skills-grid');
    for (const [category, skills] of Object.entries(contentData.skills)) {
        const entry = createElement('div', 'skill-category');
        entry.appendChild(createElement('h3', '', category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())));
        const list = createElement('ul', 'skill-list');
        skills.forEach(skill => list.appendChild(createElement('li', '', skill)));
        entry.appendChild(list);
        grid.appendChild(entry);
    }
    output.appendChild(grid);
    return output;
}

function renderCv() {
    const output = document.createDocumentFragment();
    output.appendChild(createTitle('My Professional Experience'));
    for (const job of Object.values(contentData.cv)) {
        const entry = createElement('div', 'cv-entry');
        entry.append(
            createElement('h3', '', job.company),
            createElement('div', 'job-title', job.jobTitle),
            createElement('div', 'date', job.period),
            createElement('div', '', 'Skills:')
        );
        const skills = createElement('ul', 'skills-list');
        job.skills.forEach(skill => skills.appendChild(createElement('li', '', skill)));
        entry.appendChild(skills);
        entry.appendChild(createElement('div', '', 'Projects:'));
        const projects = createElement('ul', 'projects-list');
        job.projects.forEach(project => projects.appendChild(createElement('li', '', project)));
        entry.appendChild(projects);
        output.appendChild(entry);
    }
    return output;
}

function renderProjects() {
    const output = document.createDocumentFragment();
    output.appendChild(createTitle('My Projects'));
    const grid = createElement('div', 'projects-grid');
    contentData.projects.forEach(project => {
        const card = createElement('div', 'project-card');
        card.append(createElement('h3', '', project.name), createElement('p', '', project.description));
        const technologies = createElement('div', 'tech-stack');
        project.technologies.forEach(technology => technologies.appendChild(createElement('span', '', technology)));
        card.append(technologies, createElement('div', 'date', project.period));
        grid.appendChild(card);
    });
    output.appendChild(grid);
    return output;
}

function renderContact() {
    const emailHref = `mailto:${contentData.contact.email}`;
    const phoneHref = `tel:${contentData.contact.phone.replace(/[^\d+]/g, '')}`;
    const output = document.createDocumentFragment();
    output.appendChild(createTitle('Contact Information'));
    const list = createElement('ul', 'contact-list');
    const contacts = [
        ['📧', 'Email', contactVerified ? createLink(contentData.contact.email, emailHref) : createElement('span', 'contact-private', 'hidden')],
        ['📞', 'Phone', contactVerified ? createLink(contentData.contact.phone, phoneHref) : createElement('span', 'contact-private', 'hidden')],
        ['💼', 'LinkedIn', createLink(contentData.contact.linkedin, contentData.contact.linkedin, 'contact-link', true)],
        ['🐙', 'GitHub', createLink(contentData.contact.github, contentData.contact.github, 'contact-link', true)],
        ['🌐', 'Website', createLink(contentData.contact.website, contentData.contact.website, 'contact-link', true)]
    ];
    contacts.forEach(([icon, label, value]) => {
        const item = createElement('li');
        const iconElement = createElement('span', 'contact-icon', icon);
        iconElement.setAttribute('aria-hidden', 'true');
        const detail = createElement('span');
        detail.append(createElement('span', 'contact-label', `${label}: `), value);
        item.append(iconElement, detail);
        if (!contactVerified && (label === 'Email' || label === 'Phone')) {
            value.dataset.contactField = label.toLowerCase();
        }
        list.appendChild(item);
    });
    output.appendChild(list);

    if (!contactVerified) {
        const left = Math.floor(Math.random() * 8) + 2;
        const right = Math.floor(Math.random() * 8) + 2;
        contactChallenge = { left, right, answer: left + right };
        const form = createElement('form', 'contact-verification');
        form.appendChild(createElement('label', '', `Verify you're human: ${left} + ${right} =`));
        const input = createElement('input', 'verification-input');
        input.id = 'contactChallenge';
        input.inputMode = 'numeric';
        input.autocomplete = 'off';
        input.required = true;
        const button = createElement('button', 'terminal-action', 'Reveal email & phone');
        button.type = 'submit';
        form.append(input, button, createElement('span', 'verification-status'));
        form.querySelector('.verification-status').setAttribute('role', 'status');
        output.appendChild(form);
    }
    return output;
}

function verifyContactChallenge(form) {
    const answerInput = form.querySelector('.verification-input');
    const status = form.querySelector('.verification-status');
    const answer = Number.parseInt(answerInput.value, 10);

    if (!contactChallenge || answer !== contactChallenge.answer) {
        status.className = 'verification-status command-error';
        status.textContent = 'Verification failed. Try again.';
        answerInput.select();
        return;
    }

    contactVerified = true;
    const email = terminalBody.querySelector('[data-contact-field="email"]');
    const phone = terminalBody.querySelector('[data-contact-field="phone"]');
    if (email) {
        const emailLink = document.createElement('a');
        emailLink.className = 'contact-link';
        emailLink.href = `mailto:${contentData.contact.email}`;
        emailLink.textContent = contentData.contact.email;
        email.replaceChildren(emailLink);
        email.classList.remove('contact-private');
        email.removeAttribute('data-contact-field');
    }
    if (phone) {
        const phoneLink = document.createElement('a');
        phoneLink.className = 'contact-link';
        phoneLink.href = `tel:${contentData.contact.phone.replace(/[^\d+]/g, '')}`;
        phoneLink.textContent = contentData.contact.phone;
        phone.replaceChildren(phoneLink);
        phone.classList.remove('contact-private');
        phone.removeAttribute('data-contact-field');
    }
    form.remove();
    originalCommandInput.focus();
}

function renderStats() {
    const output = document.createDocumentFragment();
    output.appendChild(createTitle('Professional Statistics'));
    const grid = createElement('div', 'stats-grid');
    [['experienceYears', 'Years Experience'], ['projectsCompleted', 'Projects Completed'], ['companiesWorked', 'Companies Worked'], ['certifications', 'Certifications']]
        .forEach(([key, label]) => {
            const card = createElement('div', 'stat-card');
            card.append(createElement('div', 'value', String(contentData.stats[key])), createElement('div', 'label', label));
            grid.appendChild(card);
        });
    output.appendChild(grid);
    return output;
}

function renderQuote() {
    const randomQuote = contentData.quotes[Math.floor(Math.random() * contentData.quotes.length)];
    const output = document.createDocumentFragment();
    output.append(createTitle('Inspirational Quote'), createElement('div', 'quote', randomQuote));
    return output;
}

function renderHistory() {
    const output = document.createDocumentFragment();
    output.appendChild(createTitle('Command History'));
    const history = createElement('div', 'command-output');
    if (commandHistory.length > 0) {
        commandHistory.forEach((command, index) => history.appendChild(createElement('div', '', `${index + 1}. ${command}`)));
    } else {
        history.textContent = 'No commands executed yet.';
    }
    output.appendChild(history);
    return output;
}

function renderExperience() {
    const output = document.createDocumentFragment();
    output.append(createTitle('Detailed Experience'), createElement('div', 'command-output', contentData.experience.summary));
    const areas = createElement('div', 'command-output');
    areas.appendChild(createElement('strong', '', 'Key Areas of Expertise:'));
    output.appendChild(areas);
    contentData.experience.expertise.forEach(item => {
        const line = createOutputLine();
        line.append(createElement('span', 'command-success', item.area), document.createTextNode(`: ${item.details}`));
        output.appendChild(line);
    });
    return output;
}

function renderCertifications() {
    const output = document.createDocumentFragment();
    output.appendChild(createTitle('Certifications'));
    const list = createElement('ul', 'cert-list');
    contentData.certifications.forEach(certification => {
        const item = createElement('li');
        const marker = createElement('span', 'cert-marker', '✓');
        marker.setAttribute('aria-hidden', 'true');
        const content = createElement('span', 'cert-content');
        content.appendChild(createLink(certification.name, certification.credentialUrl, 'cert-link', true));
        if (certification.credentialId) content.appendChild(createElement('span', 'cert-meta', `credential id: ${certification.credentialId}`));
        if (certification.status) content.appendChild(createElement('span', 'cert-status', certification.status));
        item.append(marker, content);
        list.appendChild(item);
    });
    output.appendChild(list);
    return output;
}

function renderResume() {
    const output = document.createDocumentFragment();
    output.appendChild(createTitle('Resume'));
    const link = createLink('Download resume', 'resume/resume.pdf', 'command-success');
    link.setAttribute('download', '');
    output.appendChild(createElement('div', 'command-output'));
    output.lastChild.appendChild(link);
    return output;
}

function renderDetailedSkills() {
    const output = document.createDocumentFragment();
    output.appendChild(createTitle('Detailed Skills Breakdown'));
    contentData.skillsDetailed.forEach(section => {
        const heading = createOutputLine();
        heading.appendChild(createElement('span', 'command-info', `${section.category}:`));
        output.appendChild(heading);
        section.items.forEach(item => {
            const line = createOutputLine('command-output');
            line.append(createElement('span', 'command-success', `${item.name}:`), document.createTextNode(` ${item.description}`));
            output.appendChild(line);
        });
    });
    return output;
}

function renderGithub() {
    const output = document.createDocumentFragment();
    output.appendChild(createTitle('GitHub'));
    const link = createLink('Open GitHub profile', contentData.contact.github, 'command-success', true);
    const line = createElement('div', 'command-output');
    line.appendChild(link);
    output.appendChild(line);
    return output;
}

const commandRegistry = [
    { name: 'help', aliases: ['ls'], navLabel: 'Help', description: 'Show available commands', execute: renderHelp },
    { name: 'home', aliases: [], navLabel: 'Home', description: 'Show home page', execute: renderHome },
    { name: 'about', aliases: ['whoami'], navLabel: 'About', description: 'About me', execute: renderAbout },
    { name: 'skills', aliases: [], navLabel: 'Skills', description: 'My skills', execute: renderSkills },
    { name: 'cv', aliases: [], navLabel: 'CV', description: 'My CV experience', execute: renderCv },
    { name: 'projects', aliases: [], navLabel: 'Projects', description: 'My projects', execute: renderProjects },
    { name: 'contact', aliases: [], navLabel: 'Contact', description: 'Contact information', execute: renderContact },
    { name: 'clear', aliases: [], description: 'Clear terminal', execute: () => null },
    { name: 'stats', aliases: [], navLabel: 'Stats', description: 'Professional stats', execute: renderStats },
    { name: 'quote', aliases: [], navLabel: 'Quote', description: 'Inspirational quote', execute: renderQuote },
    { name: 'history', aliases: [], description: 'Command history', execute: renderHistory },
    { name: 'experience', aliases: [], navLabel: 'Experience', description: 'Detailed experience', execute: renderExperience },
    { name: 'certifications', aliases: [], navLabel: 'Certifications', description: 'My certifications', execute: renderCertifications },
    { name: 'resume', aliases: ['cat resume'], navLabel: 'Resume', description: 'Download resume', execute: renderResume },
    { name: 'skills-detailed', aliases: [], navLabel: 'Skill Details', description: 'Detailed skills breakdown', execute: renderDetailedSkills },
    { name: 'github', aliases: ['open github'], navLabel: 'GitHub', description: 'Open my GitHub profile', execute: renderGithub }
];

function parseCommandInput(input) {
    const trimmedInput = input.trim();
    const normalizedInput = trimmedInput.replace(/\s+/g, ' ');
    const normalizedLower = normalizedInput.toLowerCase();

    const exactCommand = commandRegistry.find(command =>
        command.name === normalizedLower || command.aliases.includes(normalizedLower)
    );

    if (exactCommand) {
        return { command: exactCommand, args: '' };
    }

    const separatorIndex = trimmedInput.search(/\s/);
    const commandName = (separatorIndex === -1 ? trimmedInput : trimmedInput.slice(0, separatorIndex)).toLowerCase();
    const args = separatorIndex === -1 ? '' : trimmedInput.slice(separatorIndex).trimStart();
    const command = commandRegistry.find(item => item.name === commandName) || null;

    return { command, args };
}

function completionCandidates(value) {
    const query = value.trimStart().toLowerCase();
    if (!query) return [];

    return commandRegistry
        .flatMap(command => [command.name, ...command.aliases])
        .filter(label => label.startsWith(query))
        .sort();
}

function completeCommand(input) {
    terminalBody.querySelectorAll('.completion-output').forEach(line => line.remove());
    const candidates = completionCandidates(input.value);

    if (candidates.length === 1) {
        input.value = candidates[0];
        input.setSelectionRange(input.value.length, input.value.length);
        return;
    }

    if (candidates.length > 1) {
        const suggestions = document.createElement('div');
        suggestions.className = 'output-line command-info completion-output';
        suggestions.textContent = candidates.join('  ');
        terminalBody.insertBefore(suggestions, activePrompt);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
}

// Process command function
function processCommand(input) {
    const commandText = input.trim();
    if (commandText === '') return;

    terminalBody.querySelectorAll('.output-line').forEach(line => line.remove());
    commandHistory.push(commandText);
    historyIndex = commandHistory.length;
    renderCompletedCommand(commandText);

    const parsed = parseCommandInput(commandText);
    if (!parsed.command) {
        const outputLine = createOutputLine();
        outputLine.appendChild(createElement(
            'div',
            'command-error',
            `Command not found: ${commandText}. Type 'help' for available commands.`
        ));
        terminalBody.insertBefore(outputLine, activePrompt);
        originalCommandInput.focus();
        terminalBody.scrollTop = terminalBody.scrollHeight;
        return;
    }

    if (parsed.command.name === 'clear') {
        clearTerminal();
        return;
    }

    setActiveNavigation(parsed.command.name);
    const output = parsed.command.execute(parsed.args);
    const outputLine = createOutputLine();
    outputLine.setAttribute('aria-live', 'polite');
    outputLine.setAttribute('aria-label', `Output for ${commandText}`);
    outputLine.appendChild(output);
    terminalBody.insertBefore(outputLine, activePrompt);
    originalCommandInput.focus();
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Initialize the terminal when page loads
document.addEventListener('DOMContentLoaded', initializeTerminal);

// Focus input on terminal click
terminalBody.addEventListener('click', function(event) {
    if (!event.target.closest('input, button, a')) {
        document.getElementById('commandInput')?.focus();
    }
});

terminalBody.addEventListener('submit', function(event) {
    const form = event.target.closest('.contact-verification');
    if (!form) return;

    event.preventDefault();
    verifyContactChallenge(form);
});
