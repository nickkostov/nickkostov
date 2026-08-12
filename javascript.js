let contentData = null;

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function escapeContentTree(value) {
    if (Array.isArray(value)) {
        return value.map(escapeContentTree);
    }

    if (value && typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value).map(([key, item]) => [escapeHtml(key), escapeContentTree(item)])
        );
    }

    return typeof value === 'string' ? escapeHtml(value) : value;
}

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
    requiredArray(requiredField(root, 'certifications', 'certifications'), 'certifications')
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
    contentData = escapeContentTree(rawContent);
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
        bannerIdentity.innerHTML = `${contentData.about.name} // ${contentData.about.title} // ${contentData.about.location}`;
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
    const entries = commandRegistry.map(command => {
        const aliases = command.aliases.length > 0
            ? ` <span class="command-info">(${command.aliases.map(escapeHtml).join(', ')})</span>`
            : '';
        return `<div class="output-line"><span class="command-success">${escapeHtml(command.name)}</span>${aliases} - ${escapeHtml(command.description)}</div>`;
    }).join('');

    return `
        <div class="command-info">Available commands:</div>
        ${entries}
    `;
}

function renderHome() {
    return `
                <div class="command-title">${contentData.home.title}</div>
                <div class="command-output">
                    ${contentData.home.intro}
                </div>
                <div class="command-output">
                    ${contentData.home.summary}
                </div>
            `;
}

function renderAbout() {
    const story = contentData.about.story.map(paragraph => `
        <p class="bio-paragraph">${paragraph}</p>
    `).join('');
    const journey = contentData.about.journey.map((item, index) => `
        <li>
            <span class="bio-step">${String(index + 1).padStart(2, '0')}</span>
            <span class="bio-stage">${item.stage}</span>
            <span class="bio-detail">${item.detail}</span>
        </li>
    `).join('');

    return `
                <div class="command-title">About Me</div>
                <div class="bio-identity">
                    <div><span class="bio-label">name</span>${contentData.about.name}</div>
                    <div><span class="bio-label">role</span>${contentData.about.title}</div>
                    <div><span class="bio-label">location</span>${contentData.about.location}</div>
                </div>
                <div class="bio-section">
                    <div class="bio-heading">Profile</div>
                    <p class="bio-paragraph">${contentData.about.summary}</p>
                </div>
                <div class="bio-section">
                    <div class="bio-heading">My path into technology</div>
                    ${story}
                </div>
                <div class="bio-section">
                    <div class="bio-heading">Journey</div>
                    <ol class="bio-journey">${journey}</ol>
                </div>
                <div class="bio-section bio-motivation">
                    <div class="bio-heading">What drives me</div>
                    <p class="bio-paragraph">${contentData.about.motivation}</p>
                </div>
            `;
}

function renderSkills() {
    let output = `
                <div class="command-title">My Skills</div>
                <div class="skills-grid">
            `;
            
            for (const [category, skills] of Object.entries(contentData.skills)) {
                output += `
                    <div class="skill-category">
                        <h3>${category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
                        <ul class="skill-list">
                `;
                
                skills.forEach(skill => {
                    output += `<li>${skill}</li>`;
                });
                
                output += `
                        </ul>
                    </div>
                `;
            }
            
            output += `
                </div>
            `;
    return output;
}

function renderCv() {
    let output = `
                <div class="command-title">My Professional Experience</div>
            `;
            
            for (const [key, job] of Object.entries(contentData.cv)) {
                output += `
                    <div class="cv-entry">
                        <h3>${job.company}</h3>
                        <div class="job-title">${job.jobTitle}</div>
                        <div class="date">${job.period}</div>
                        <div><strong>Skills:</strong></div>
                        <ul class="skills-list">
                `;
                
                job.skills.forEach(skill => {
                    output += `<li>${skill}</li>`;
                });
                
                output += `
                        </ul>
                        <div><strong>Projects:</strong></div>
                        <ul class="projects-list">
                `;
                
                job.projects.forEach(project => {
                    output += `<li>${project}</li>`;
                });
                
                output += `
                        </ul>
                    </div>
                `;
            }
    return output;
}

function renderProjects() {
    let output = `
                <div class="command-title">My Projects</div>
                <div class="projects-grid">
            `;
            
            contentData.projects.forEach(project => {
                output += `
                    <div class="project-card">
                        <h3>${project.name}</h3>
                        <p>${project.description}</p>
                        <div class="tech-stack">
                            ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                        </div>
                        <div class="date">${project.period}</div>
                    </div>
                `;
            });
            
            output += `
                </div>
            `;
    return output;
}

function renderContact() {
    const emailHref = `mailto:${contentData.contact.email}`;
    const phoneHref = `tel:${contentData.contact.phone.replace(/[^\d+]/g, '')}`;
    const linkedInHref = `https://${contentData.contact.linkedin.replace(/^https?:\/\//i, '')}`;
    const githubHref = `https://${contentData.contact.github.replace(/^https?:\/\//i, '')}`;
    const websiteHref = `https://${contentData.contact.website.replace(/^https?:\/\//i, '')}`;
    const privateContact = contactVerified
        ? {
            email: `<a class="contact-link" href="${emailHref}">${contentData.contact.email}</a>`,
            phone: `<a class="contact-link" href="${phoneHref}">${contentData.contact.phone}</a>`
        }
        : {
            email: '<span class="contact-private" data-contact-field="email">hidden</span>',
            phone: '<span class="contact-private" data-contact-field="phone">hidden</span>'
        };

    let verification = '';
    if (!contactVerified) {
        const left = Math.floor(Math.random() * 8) + 2;
        const right = Math.floor(Math.random() * 8) + 2;
        contactChallenge = { left, right, answer: left + right };
        verification = `
            <form class="contact-verification">
                <label for="contactChallenge">Verify you're human: ${left} + ${right} =</label>
                <input id="contactChallenge" class="verification-input" inputmode="numeric" autocomplete="off" required>
                <button class="terminal-action" type="submit">Reveal email &amp; phone</button>
                <span class="verification-status" role="status"></span>
            </form>
        `;
    }

    return `
                <div class="command-title">Contact Information</div>
                <ul class="contact-list">
                    <li><span class="contact-icon" aria-hidden="true">📧</span><span><span class="contact-label">Email:</span> ${privateContact.email}</span></li>
                    <li><span class="contact-icon" aria-hidden="true">📞</span><span><span class="contact-label">Phone:</span> ${privateContact.phone}</span></li>
                    <li><span class="contact-icon" aria-hidden="true">💼</span><span><span class="contact-label">LinkedIn:</span> <a class="contact-link" href="${linkedInHref}" target="_blank" rel="noopener noreferrer">${contentData.contact.linkedin}</a></span></li>
                    <li><span class="contact-icon" aria-hidden="true">🐙</span><span><span class="contact-label">GitHub:</span> <a class="contact-link" href="${githubHref}" target="_blank" rel="noopener noreferrer">${contentData.contact.github}</a></span></li>
                    <li><span class="contact-icon" aria-hidden="true">🌐</span><span><span class="contact-label">Website:</span> <a class="contact-link" href="${websiteHref}" target="_blank" rel="noopener noreferrer">${contentData.contact.website}</a></span></li>
                </ul>
                ${verification}
            `;
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
    return `
                <div class="command-title">Professional Statistics</div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="value">${contentData.stats.experienceYears}</div>
                        <div class="label">Years Experience</div>
                    </div>
                    <div class="stat-card">
                        <div class="value">${contentData.stats.projectsCompleted}</div>
                        <div class="label">Projects Completed</div>
                    </div>
                    <div class="stat-card">
                        <div class="value">${contentData.stats.companiesWorked}</div>
                        <div class="label">Companies Worked</div>
                    </div>
                    <div class="stat-card">
                        <div class="value">${contentData.stats.certifications}</div>
                        <div class="label">Certifications</div>
                    </div>
                </div>
            `;
}

function renderQuote() {
    const randomQuote = contentData.quotes[Math.floor(Math.random() * contentData.quotes.length)];
    return `
                <div class="command-title">Inspirational Quote</div>
                <div class="quote">${randomQuote}</div>
            `;
}

function renderHistory() {
    return `
                <div class="command-title">Command History</div>
                <div class="command-output">
                    ${commandHistory.length > 0 ? 
                        commandHistory.map((cmd, index) => `<div>${index + 1}. ${escapeHtml(cmd)}</div>`).join('') : 
                        'No commands executed yet.'}
                </div>
            `;
}

function renderExperience() {
    const expertise = contentData.experience.expertise.map(item => `
        <div class="output-line"><span class="command-success">${item.area}</span>: ${item.details}</div>
    `).join('');

    return `
                <div class="command-title">Detailed Experience</div>
                <div class="command-output">
                    ${contentData.experience.summary}
                </div>
                <div class="command-output">
                    <strong>Key Areas of Expertise:</strong>
                </div>
                ${expertise}
            `;
}

function renderCertifications() {
    const certifications = contentData.certifications.map(certification => `
        <li>
            <span class="cert-marker" aria-hidden="true">✓</span>
            <span class="cert-content">
                <a class="cert-link" href="${certification.credentialUrl}" target="_blank" rel="noopener noreferrer">${certification.name}</a>
                ${certification.credentialId ? `<span class="cert-meta">credential id: ${certification.credentialId}</span>` : ''}
                ${certification.status ? `<span class="cert-status">${certification.status}</span>` : ''}
            </span>
        </li>
    `).join('');

    return `
                <div class="command-title">Certifications</div>
                <ul class="cert-list">${certifications}</ul>
            `;
}

function renderResume() {
    return `
                <div class="command-title">Resume</div>
                <div class="command-output">
                    <a class="command-success" href="resume/resume.pdf" download>Download resume</a>
                </div>
            `;
}

function renderDetailedSkills() {
    const sections = contentData.skillsDetailed.map(section => `
        <div class="output-line"><span class="command-info">${section.category}:</span></div>
        ${section.items.map(item => `
            <div class="output-line command-output">
                <span class="command-success">${item.name}:</span> ${item.description}
            </div>
        `).join('')}
    `).join('');

    return `
                <div class="command-title">Detailed Skills Breakdown</div>
                ${sections}
            `;
}

function renderGithub() {
    const githubUrl = `https://${contentData.contact.github.replace(/^https?:\/\//i, '')}`;
    return `
        <div class="command-title">GitHub</div>
        <div class="command-output">
            <a class="command-success" href="${githubUrl}" target="_blank" rel="noopener noreferrer">Open GitHub profile</a>
        </div>
    `;
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
        const outputLine = document.createElement('div');
        outputLine.className = 'output-line';
        outputLine.innerHTML = `<div class="command-error">Command not found: ${escapeHtml(commandText)}. Type 'help' for available commands.</div>`;
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
    const outputLine = document.createElement('div');
    outputLine.className = 'output-line';
    outputLine.innerHTML = output;
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
