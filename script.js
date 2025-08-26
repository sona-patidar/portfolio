// Typing effect for hero headline
const typingTexts = [
    'PASSION',
    'Web Developer',
    'Software Developer',
    'Frontend Enthusiast',
    'Tech Learner'
];
const typingElement = document.getElementById('typing-text');
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;
let pauseTime = 1200;

function type() {
    if (!typingElement) return;
    const currentText = typingTexts[textIndex];
    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
            setTimeout(type, 400);
        } else {
            setTimeout(type, typingSpeed / 2);
        }
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(type, pauseTime);
        } else {
            setTimeout(type, typingSpeed);
        }
    }
}
document.addEventListener('DOMContentLoaded', type);

// --- Admin Panel & Dynamic Portfolio Logic ---
function getProjects() {
    return JSON.parse(localStorage.getItem('projects') || '[]');
}
function getSkills() {
    return JSON.parse(localStorage.getItem('skills') || '[]');
}
function saveProjects(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
}
function saveSkills(skills) {
    localStorage.setItem('skills', JSON.stringify(skills));
}
function getCertificates() {
    return JSON.parse(localStorage.getItem('certificates') || '[]');
}
function saveCertificates(certificates) {
    localStorage.setItem('certificates', JSON.stringify(certificates));
}

// Admin Panel Logic
if (document.getElementById('project-form')) {
    const projectForm = document.getElementById('project-form');
    const projectTitle = document.getElementById('project-title');
    const projectCategory = document.getElementById('project-category');
    const projectImageFile = document.getElementById('project-image-file');
    const projectDemo = document.getElementById('project-demo');
    const projectTech = document.getElementById('project-tech');
    const adminProjectList = document.getElementById('admin-project-list');

    function renderAdminProjects() {
        const projects = getProjects();
        adminProjectList.innerHTML = projects.map((p, i) => `
            <div class="admin-project-item">
                <img src="${p.image}" alt="" style="width:40px;height:30px;object-fit:cover;border-radius:4px;vertical-align:middle;"> 
                <b>${p.title}</b> <span style="color:#888;">(${p.category})</span>
                <button onclick="removeProject(${i})" style="margin-left:1em;">Remove</button>
            </div>
        `).join('');
    }
    projectForm.onsubmit = function(e) {
        e.preventDefault();
        const file = projectImageFile.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
            const projects = getProjects();
            projects.push({
                title: projectTitle.value,
                category: projectCategory.value,
                image: evt.target.result,
                demo: projectDemo.value,
                tech: projectTech.value
            });
            saveProjects(projects);
            projectForm.reset();
            renderAdminProjects();
            const msg = document.getElementById('project-added-msg');
            if (msg) { msg.style.display = 'block'; setTimeout(()=>{msg.style.display='none';}, 3000); }
        };
        reader.readAsDataURL(file);
    };
    window.removeProject = function(idx) {
        const projects = getProjects();
        projects.splice(idx, 1);
        saveProjects(projects);
        renderAdminProjects();
    };
    renderAdminProjects();
}
if (document.getElementById('skill-form')) {
    const skillForm = document.getElementById('skill-form');
    const skillName = document.getElementById('skill-name');
    const skillLevel = document.getElementById('skill-level');
    const skillDesc = document.getElementById('skill-desc');
    const adminSkillList = document.getElementById('admin-skill-list');

    function renderAdminSkills() {
        const skills = getSkills();
        adminSkillList.innerHTML = skills.map((s, i) => `
            <div class="admin-skill-item">
                <b>${s.name}</b> <span style="color:#888;">(${s.level})</span>
                <button onclick="removeSkill(${i})" style="margin-left:1em;">Remove</button>
            </div>
        `).join('');
    }
    skillForm.onsubmit = function(e) {
        e.preventDefault();
        const skills = getSkills();
        skills.push({
            name: skillName.value,
            level: skillLevel.value,
            desc: skillDesc.value
        });
        saveSkills(skills);
        skillForm.reset();
        renderAdminSkills();
    };
    window.removeSkill = function(idx) {
        const skills = getSkills();
        skills.splice(idx, 1);
        saveSkills(skills);
        renderAdminSkills();
    };
    renderAdminSkills();
}
// Admin Panel: Certificates
if (document.getElementById('certificate-form')) {
    const certForm = document.getElementById('certificate-form');
    const certTitle = document.getElementById('certificate-title');
    const certDesc = document.getElementById('certificate-desc');
    const certImageFile = document.getElementById('certificate-image-file');
    const adminCertList = document.getElementById('admin-certificate-list');
    function renderAdminCertificates() {
        const certs = getCertificates();
        adminCertList.innerHTML = certs.map((c, i) => `
            <div class="admin-cert-item">
                <img src="${c.image}" alt="" style="width:40px;height:30px;object-fit:cover;border-radius:4px;vertical-align:middle;"> 
                <b>${c.title}</b> <span style="color:#888;">${c.desc}</span>
                <button onclick="removeCertificate(${i})" style="margin-left:1em;">Remove</button>
            </div>
        `).join('');
    }
    certForm.onsubmit = function(e) {
        e.preventDefault();
        const file = certImageFile.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
            const certs = getCertificates();
            certs.push({
                title: certTitle.value,
                desc: certDesc.value,
                image: evt.target.result
            });
            saveCertificates(certs);
            certForm.reset();
            renderAdminCertificates();
        };
        reader.readAsDataURL(file);
    };
    window.removeCertificate = function(idx) {
        const certs = getCertificates();
        certs.splice(idx, 1);
        saveCertificates(certs);
        renderAdminCertificates();
    };
    renderAdminCertificates();
}

// Dynamic Projects Page
if (document.querySelector('.projects-grid')) {
    function renderProjectsPage() {
        const grid = document.querySelector('.projects-grid');
        const projects = getProjects();
        if (projects.length === 0) return;
        function getCategoryClass(cat) {
            if (/web app/i.test(cat)) return 'webapp';
            if (/machine learning/i.test(cat)) return 'ml';
            if (/mobile/i.test(cat)) return 'mobile';
            if (/ui\/?ux/i.test(cat)) return 'uiux';
            return 'other';
        }
        grid.innerHTML = projects.map(p => `
            <div class="project-card">
                <img src="${p.image}" alt="${p.title}" class="project-image">
                <div class="project-category ${getCategoryClass(p.category)}">${p.category}</div>
                <div class="project-name">${p.title}</div>
                <div class="project-tech-list">
                    ${(p.tech||'').split(',').map(t=>`<span class='project-tech'>${t.trim()}</span>`).join('')}
                </div>
                <a href="${p.demo}" class="project-demo-btn" target="_blank">Demo</a>
            </div>
        `).join('');
    }
    renderProjectsPage();
}
// Dynamic Skills Page
if (document.querySelector('.skills-circles')) {
    function getSkillPercent(level) {
        if (!level) return 0;
        if (/beg/i.test(level)) return 20;
        if (/inter/i.test(level)) return 60;
        if (/perf|exp/i.test(level)) return 100;
        const n = parseInt(level);
        return isNaN(n) ? 0 : n;
    }
    function renderSkillsPage() {
        const circles = document.querySelector('.skills-circles');
        const skills = getSkills();
        if (skills.length === 0) return;
        circles.innerHTML = skills.map((s, i) => {
            const percent = getSkillPercent(s.level);
            const radius = 48;
            const circ = 2 * Math.PI * radius;
            const offset = circ * (1 - percent / 100);
            return `
                <div class="skill-circle-card" style="animation-delay:${0.1 + i * 0.15}s">
                    <div class="circle-progress">
                        <svg width="120" height="120">
                            <circle cx="60" cy="60" r="${radius}" stroke="#23233a" stroke-width="10" fill="none" />
                            <circle class="circle-bar" cx="60" cy="60" r="${radius}" stroke="#ffc107" stroke-width="10" fill="none" stroke-dasharray="${circ}" stroke-dashoffset="${circ}" />
                        </svg>
                        <span class="circle-percent">${percent}%</span>
                    </div>
                    <div class="circle-skill-name">${s.name}</div>
                    <div class="circle-skill-desc">${s.desc ? s.desc : 'No description provided.'}</div>
                </div>
            `;
        }).join('');
        // Animate circles
        setTimeout(() => {
            document.querySelectorAll('.circle-bar').forEach((bar, i) => {
                const percent = getSkillPercent(skills[i].level);
                const radius = 48;
                const circ = 2 * Math.PI * radius;
                bar.style.strokeDashoffset = circ * (1 - percent / 100);
            });
        }, 100);
    }
    renderSkillsPage();
}
// Achievements Page: Render certificates
if (document.querySelector('.achievements-certificates')) {
    function renderCertificatesPage() {
        const grid = document.querySelector('.achievements-certificates');
        const certs = getCertificates();
        if (certs.length === 0) return;
        grid.innerHTML = certs.map(c => `
            <div class="achievement-card">
                <img src="${c.image}" alt="${c.title}" class="achievement-cert-img">
                <div class="achievement-title">${c.title}</div>
                <div class="achievement-desc">${c.desc}</div>
            </div>
        `).join('');
    }
    renderCertificatesPage();
} 