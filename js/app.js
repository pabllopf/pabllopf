const DEFAULT_LANG = "en";

// Detecta el idioma del sistema operativo
function getSystemLanguage() {
    return (
        navigator.languages?.[0] ||
        navigator.language ||
        navigator.userLanguage ||
        DEFAULT_LANG
    ).slice(0, 2);
}

// Carga el contenido del header
async function loadHeaderContent(lang) {
    try {
        const response = await fetch("content/header.json");
        const data = await response.json();
        const content = data[lang] || data[DEFAULT_LANG];

        document.getElementById("header-name").textContent = content.name;
        document.getElementById("header-title").textContent = content.title;

        const cvBtn = document.getElementById("header-cv");
        cvBtn.href = content.cv;
        cvBtn.textContent = content.cvText;

        document.getElementById("linkedin-link").href = content.social.linkedin;
        document.getElementById("github-link").href = content.social.github;
        document.getElementById("email-link").href = content.social.email;
        document.getElementById("instagram-link").href = content.social.instagram;

        // Menú
        document.getElementById("menu-about").querySelector("span").textContent = content.menu.about;
        document.getElementById("menu-resume").querySelector("span").textContent = content.menu.resume;
        document.getElementById("menu-skills").querySelector("span").textContent = content.menu.skills;
        document.getElementById("menu-contact").querySelector("span").textContent = content.menu.contact;

    } catch (err) {
        console.error("Error loading header.json:", err);
    }
}

// Carga el contenido del About
async function loadAboutContent(lang) {
    try {
        const response = await fetch("content/about.json");
        const data = await response.json();
        const content = data[lang] || data[DEFAULT_LANG];

        document.getElementById("about-title").textContent = content.title;
        document.getElementById("about-heading").textContent = content.heading;

        const container = document.getElementById("about-content");
        container.innerHTML = "";

        content.paragraphs.forEach(text => {
            const p = document.createElement("p");
            p.innerHTML = text; // permite <b>, <br>, etc.
            container.appendChild(p);
        });
    } catch (err) {
        console.error("Error loading about.json:", err);
    }
}



async function loadMyExperienceContent(lang) {
    try {
        const response = await fetch("content/experience.json"); // JSON de experiencia + educación
        const data = await response.json();
        const content = data[lang] || data[DEFAULT_LANG];

        // Título principal de la sección
        document.getElementById("resume-title-experience").textContent = content.title;

        // Heading de Experiencia
        document.getElementById("experience-title").textContent = content.experienceTitle;

        const timeline = document.getElementById("resume-timeline-experience");

        // Limpiar items previos
        const existingItems = timeline.querySelectorAll(".timeline-inverted, .timeline-unverted");
        existingItems.forEach(item => item.remove());

        // Función interna para crear un item (Experiencia o Educación)
        function createTimelineItem(item, icon = "icon-suitcase", inverted = false) {
            const li = document.createElement("li");
            li.className = `animate-box ${inverted ? "timeline-inverted" : "timeline-unverted"}`;

            li.innerHTML = `
                <div class="timeline-badge"><i class="${icon}"></i></div>
                <div class="timeline-panel">
                    <div class="timeline-heading">
                        <h3 class="timeline-title">${item.role || item.title}</h3>
                        <span class="company">${item.company}</span>
                    </div>
                    <div class="timeline-body">
                        ${item.description.map(p => `<p>${p}</p>`).join("")}
                    </div>
                </div>
            `;
            return li;
        }

        // Renderizar toda la experiencia
        content.experience.forEach((item, index) => {
            const li = createTimelineItem(item, "icon-suitcase", index % 2 === 1);
            timeline.appendChild(li);
        });
    } catch (err) {
        console.error("Error loading experience.json:", err);
    }
}


async function loadMyEducationContent(lang) {
    try {
        const response = await fetch("content/education.json"); // JSON de experiencia + educación
        const data = await response.json();
        const content = data[lang] || data[DEFAULT_LANG];

        // Título principal de la sección
        document.getElementById("resume-title-education").textContent = content.title;

        // Heading de Experiencia
        document.getElementById("education-title").textContent = content.educationTitle;

        const timeline = document.getElementById("resume-timeline-education");

        // Limpiar items previos
        const existingItems = timeline.querySelectorAll(".timeline-inverted, .timeline-unverted");
        existingItems.forEach(item => item.remove());

        // Función interna para crear un item (Experiencia o Educación)
        function createTimelineItem(item, icon = "icon-suitcase", inverted = false) {
            const li = document.createElement("li");
            li.className = `animate-box ${inverted ? "timeline-inverted" : "timeline-unverted"}`;

            li.innerHTML = `
                <div class="timeline-badge"><i class="${icon}"></i></div>
                <div class="timeline-panel">
                    <div class="timeline-heading">
                        <h3 class="timeline-title">${item.title || item.title}</h3>
                        <span class="company">${item.title}</span>
                    </div>
                    <div class="timeline-body">
                        ${item.description.map(p => `<p>${p}</p>`).join("")}
                    </div>
                </div>
            `;
            return li;
        }

        // Renderizar toda la experiencia
        content.education.forEach((item, index) => {
            const li = createTimelineItem(item, "icon-suitcase", index % 2 === 1);
            timeline.appendChild(li);
        });
    } catch (err) {
        console.error("Error loading experience.json:", err);
    }
}




// Marca el botón activo
function setActiveLangButton(lang) {
    document.querySelectorAll(".cd-stretchy-nav-lang a").forEach(a => {
        a.classList.toggle("active-yes", a.dataset.lang === lang);
        a.classList.toggle("active-no", a.dataset.lang !== lang);
    });
}

// Inicialización con selector de idiomas
function initLanguageSelector() {
    const initialLang = getSystemLanguage();

    loadHeaderContent(initialLang);
    loadAboutContent(initialLang);
    loadMyExperienceContent(initialLang);
    loadMyEducationContent(initialLang);
    setActiveLangButton(initialLang);

    document.querySelectorAll(".cd-stretchy-nav-lang a").forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
            const lang = btn.dataset.lang;
            loadHeaderContent(lang);
            loadAboutContent(lang);
            loadMyExperienceContent(lang);
            loadMyEducationContent(lang);
            setActiveLangButton(lang);
        });
    });
}

// Espera a que cargue el DOM
document.addEventListener("DOMContentLoaded", initLanguageSelector);
