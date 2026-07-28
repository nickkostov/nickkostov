// Sample content data (would normally come from YAML)
const contentData = {
    skills: {
        cloud: ["AWS", "Azure", "GCP"],
        containerOrchestrators: ["Docker", "Podman", "Kubernetes"],
        programmingLanguages: ["JavaScript", "Python", "Go", "Java"],
        databases: ["PostgreSQL", "MongoDB", "Redis"],
        devOps: ["Jenkins", "GitLab CI", "Terraform", "Ansible"],
        frameworks: ["React", "Node.js", "Express", "Django"]
    },
    cv: {
        company1: {
            jobTitle: "Senior Cloud Engineer",
            company: "Tech Solutions Inc.",
            period: "2020 - Present",
            skills: ["AWS", "Kubernetes", "Terraform", "Docker"],
            projects: ["Cloud Migration Project", "Microservices Architecture"]
        },
        company2: {
            jobTitle: "DevOps Engineer",
            company: "Digital Innovations Ltd.",
            period: "2017 - 2020",
            skills: ["Jenkins", "GitLab CI", "Docker", "AWS"],
            projects: ["CI/CD Pipeline Implementation", "Infrastructure Automation"]
        },
        company3: {
            jobTitle: "Software Developer",
            company: "WebCraft Studios",
            period: "2015 - 2017",
            skills: ["JavaScript", "React", "Node.js", "Python"],
            projects: ["E-commerce Platform", "Mobile App Backend"]
        }
    },
    projects: [
        {
            name: "Cloud Migration Solution",
            description: "Led migration of legacy applications to AWS cloud infrastructure, reducing costs by 40%.",
            technologies: ["AWS", "Kubernetes", "Terraform", "Docker"],
            period: "2021"
        },
        {
            name: "Microservices Architecture",
            description: "Designed and implemented microservices architecture for enterprise application using Docker and Kubernetes.",
            technologies: ["Kubernetes", "Docker", "Go", "gRPC"],
            period: "2020"
        },
        {
            name: "DevOps Automation Platform",
            description: "Built CI/CD platform with Jenkins and GitLab CI, automating deployment processes for 20+ applications.",
            technologies: ["Jenkins", "GitLab CI", "Ansible", "Docker"],
            period: "2019"
        }
    ],
    about: {
        name: "Nikolay Kostov",
        title: "Senior Cloud Engineer & DevOps Specialist",
        description: "Passionate cloud engineer with over 8 years of experience in building scalable, reliable systems. Specialized in cloud infrastructure, container orchestration, and DevOps practices.",
        education: "MSc in Computer Science, University of Sofia",
        location: "Sofia, Bulgaria"
    },
    contact: {
        email: "nikolay.kostov@example.com",
        phone: "+359 123 456 789",
        linkedin: "linkedin.com/in/nikolaykostov",
        github: "github.com/nikolaykostov",
        website: "nikolay-kostov.dev"
    },
    stats: {
        experienceYears: 8,
        projectsCompleted: 25,
        companiesWorked: 3,
        certifications: 5
    }
};

// DOM elements
const terminalBody = document.getElementById('terminalBody');
const commandInput = document.getElementById('commandInput');

// Current command history
let commandHistory = [];
let historyIndex = -1;

// Process command function
function processCommand(command) {
    command = command.trim().toLowerCase();
    
    if (command === '') return;
    
    // Add to history
    commandHistory.push(command);
    historyIndex = commandHistory.length;
    
    // Display command
    const promptLine = document.createElement('div');
    promptLine.className = 'prompt-line';
    promptLine.innerHTML = `
        <span class="prompt-user">nikolay.kostov</span>
        <span class="prompt-host">@nikolay-kostov-cv</span>
        <span class="prompt-path">~</span>
        <span class="prompt-symbol">$</span>
    `;
    
    const inputLine = document.createElement('div');
    inputLine.className = 'input-line';
    inputLine.innerHTML = `
        <span class="command-output">${command}</span>
    `;
    
    terminalBody.appendChild(promptLine);
    terminalBody.appendChild(inputLine);
    
    // Process command
    let output = '';
    switch(command) {
        case 'help':
            output = `
                <div class="command-info">Available commands:</div>
                <div class="output-line"><span class="command-success">home</span> - Show home page</div>
                <div class="output-line"><span class="command-success">about</span> - About me</div>
                <div class="output-line"><span class="command-success">skills</span> - My skills</div>
                <div class="output-line"><span class="command-success">cv</span> - My CV experience</div>
                <div class="output-line"><span class="command-success">projects</span> - My projects</div>
                <div class="output-line"><span class="command-success">contact</span> - Contact information</div>
                <div class="output-line"><span class="command-success">clear</span> - Clear terminal</div>
                <div class="output-line"><span class="command-success">help</span> - Show this help</div>
                <div class="output-line"><span class="command-success">stats</span> - My professional stats</div>
                <div class="output-line"><span class="command-success">quote</span> - Inspirational quote</div>
                <div class="output-line"><span class="command-success">history</span> - Show command history</div>
                <div class="output-line"><span class="command-success">experience</span> - Detailed experience</div>
                <div class="output-line"><span class="command-success">certifications</span> - My certifications</div>
                <div class="output-line"><span class="command-success">resume</span> - Download resume</div>
                <div class="output-line"><span class="command-success">skills-detailed</span> - Detailed skills breakdown</div>
            `;
            break;
            
        case 'home':
            output = `
                <div class="command-title">Welcome to My Digital CV Terminal</div>
                <div class="command-output">
                    This terminal provides an interactive way to explore my professional background.
                    Type <span class="command-success">help</span> to see available commands.
                </div>
                <div class="command-output">
                    I'm a Senior Cloud Engineer with expertise in cloud platforms, container orchestration,
                    and DevOps practices. This terminal showcases my skills and experience in an interactive way.
                </div>
            `;
            break;
            
        case 'about':
            output = `
                <div class="command-title">About Me</div>
                <div class="command-output">
                    <strong>Name:</strong> ${contentData.about.name}<br>
                    <strong>Title:</strong> ${contentData.about.title}<br>
                    <strong>Location:</strong> ${contentData.about.location}<br>
                    <strong>Education:</strong> ${contentData.about.education}
                </div>
                <div class="command-output">
                    ${contentData.about.description}
                </div>
            `;
            break;
            
        case 'skills':
            output = `
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
            break;
            
        case 'cv':
            output = `
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
            break;
            
        case 'projects':
            output = `
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
            break;
            
        case 'contact':
            output = `
                <div class="command-title">Contact Information</div>
                <div class="contact-info">
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <span>${contentData.contact.email}</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <span>${contentData.contact.phone}</span>
                    </div>
                    <div class="contact-item">
                        <i class="fab fa-linkedin"></i>
                        <span>${contentData.contact.linkedin}</span>
                    </div>
                    <div class="contact-item">
                        <i class="fab fa-github"></i>
                        <span>${contentData.contact.github}</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-globe"></i>
                        <span>${contentData.contact.website}</span>
                    </div>
                </div>
            `;
            break;
            
        case 'clear':
            // Clear all content
            terminalBody.innerHTML = '';
            
            // Re-add the prompt and input line
            const newPromptLine = document.createElement('div');
            newPromptLine.className = 'prompt-line';
            newPromptLine.innerHTML = `
                <span class="prompt-user">nikolay.kostov</span>
                <span class="prompt-host">@nikolay-kostov-cv</span>
                <span class="prompt-path">~</span>
                <span class="prompt-symbol">$</span>
            `;
            
            const newInputLine = document.createElement('div');
            newInputLine.className = 'input-line';
            newInputLine.innerHTML = `
                <input type="text" class="command-input" id="commandInput" autofocus>
                <span class="cursor"></span>
            `;
            
            terminalBody.appendChild(newPromptLine);
            terminalBody.appendChild(newInputLine);
            
            // Re-attach event listener to the new input
            const newCommandInput = document.getElementById('commandInput');
            newCommandInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
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
            
            // Focus the new input
            newCommandInput.focus();
            return;
            
        case 'stats':
            output = `
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
            break;
            
        case 'quote':
            const quotes = [
                "The best way to predict the future is to invent it. - Alan Kay",
                "Software is a great combination between artistry and engineering. - Bill Gates",
                "Innovation distinguishes between a leader and a follower. - Steve Jobs",
                "The only way to do great work is to love what you do. - Steve Jobs",
                "Technology is best when it brings people together. - Matt Mullenweg"
            ];
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            output = `
                <div class="command-title">Inspirational Quote</div>
                <div class="quote">${randomQuote}</div>
            `;
            break;
            
        case 'history':
            output = `
                <div class="command-title">Command History</div>
                <div class="command-output">
                    ${commandHistory.length > 0 ? 
                        commandHistory.map((cmd, index) => `<div>${index + 1}. ${cmd}</div>`).join('') : 
                        'No commands executed yet.'}
                </div>
            `;
            break;
            
        case 'experience':
            output = `
                <div class="command-title">Detailed Experience</div>
                <div class="command-output">
                    I have over 8 years of professional experience in cloud engineering and DevOps practices.
                    My career has evolved from software development to specializing in cloud infrastructure
                    and automation solutions.
                </div>
                <div class="command-output">
                    <strong>Key Areas of Expertise:</strong>
                </div>
                <div class="output-line"><span class="command-success">Cloud Platforms</span>: AWS, Azure, GCP</div>
                <div class="output-line"><span class="command-success">Containerization</span>: Docker, Kubernetes, Podman</div>
                <div class="output-line"><span class="command-success">CI/CD</span>: Jenkins, GitLab CI, GitHub Actions</div>
                <div class="output-line"><span class="command-success">Infrastructure as Code</span>: Terraform, Ansible</div>
                <div class="output-line"><span class="command-success">Programming</span>: JavaScript, Python, Go</div>
            `;
            break;
            
        case 'certifications':
            output = `
                <div class="command-title">Certifications</div>
                <div class="output-line"><span class="command-success">AWS Certified Solutions Architect - Professional</span></div>
                <div class="output-line"><span class="command-success">Google Cloud Professional Cloud Architect</span></div>
                <div class="output-line"><span class="command-success">Kubernetes Administrator (CKA)</span></div>
                <div class="output-line"><span class="command-success">Azure Solutions Architect Expert</span></div>
                <div class="output-line"><span class="command-success">Certified Kubernetes Application Developer (CKAD)</span></div>
            `;
            break;
            
        case 'resume':
            output = `
                <div class="command-title">Resume</div>
                <div class="command-output">
                    Downloading resume...
                </div>
                <div class="progress-bar">
                    <div class="progress" id="downloadProgress"></div>
                </div>
                <div class="command-output">
                    <span class="command-success">Resume downloaded successfully!</span> (PDF format)
                </div>
            `;
            
            // Simulate download progress
            const progressBar = document.getElementById('downloadProgress');
            let width = 0;
            const interval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(interval);
                } else {
                    width += 5;
                    progressBar.style.width = width + '%';
                }
            }, 100);
            break;
            
        case 'skills-detailed':
            output = `
                <div class="command-title">Detailed Skills Breakdown</div>
                <div class="output-line"><span class="command-info">Cloud Platforms:</span></div>
                <div class="output-line command-output">
                    <span class="command-success">AWS:</span> Advanced knowledge of EC2, S3, Lambda, ECS, EKS
                </div>
                <div class="output-line command-output">
                    <span class="command-success">Azure:</span> Experience with Azure VMs, AKS, Storage Accounts
                </div>
                <div class="output-line command-output">
                    <span class="command-success">GCP:</span> Familiar with GKE, Cloud Functions, BigQuery
                </div>
                <div class="output-line"><span class="command-info">Containerization & Orchestration:</span></div>
                <div class="output-line command-output">
                    <span class="command-success">Kubernetes:</span> Deployment, scaling, networking, security
                </div>
                <div class="output-line command-output">
                    <span class="command-success">Docker:</span> Container creation, image management, Docker Compose
                </div>
            `;
            break;
            
        default:
            output = `<div class="command-error">Command not found: ${command}. Type 'help' for available commands.</div>`;
    }
    
    // Display output
    const outputLine = document.createElement('div');
    outputLine.className = 'output-line';
    outputLine.innerHTML = output;
    terminalBody.appendChild(outputLine);
    
    // Scroll to bottom
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Event listener for command input
commandInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
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

// Focus input on terminal click
terminalBody.addEventListener('click', function() {
    commandInput.focus();
});

// Initial welcome message
setTimeout(() => {
    const welcomeLine = document.createElement('div');
    welcomeLine.className = 'output-line command-output';
    welcomeLine.innerHTML = `
        <div>Terminal initialized. Type <span class="command-success">help</span> for available commands.</div>
    `;
    terminalBody.appendChild(welcomeLine);
}, 1000);