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


async function loadHowIWorkContent(lang) {
    try {
        const res = await fetch("content/howwork.json");
        const data = await res.json();

        const section = data[lang];
        if (!section) return console.error("No How I Work data for:", lang);

        document.getElementById("how-i-work-title").textContent = section.title;

        const container = document.querySelector("#fh5co-features .row:last-child");
        container.innerHTML = "";

        section.items.forEach(item => {
            const col = document.createElement("div");
            col.className = "col-md-3 text-center";

            col.innerHTML = `
        <div class="feature-left">
          <span class="icon">
            <i class="${item.icon}"></i>
          </span>
          <div class="feature-copy">
            <h3>${item.title}</h3>
            <p>${item.text}</p>
          </div>
        </div>
      `;

            container.appendChild(col);
        });

    } catch (err) {
        console.error("Error loading how-i-work.json:", err);
    }
}




async function loadMyExperienceContent(lang) {
    try {
        const response = await fetch("content/experience.json");
        const data = await response.json();

        const content = data[lang];
        if (!content) return console.error(`No data for language: ${lang}`);

        const titleEl = document.getElementById("resume-title-experience");
        const headingEl = document.getElementById("experience-title");
        const timelineEl = document.getElementById("resume-timeline-experience");

        if (!titleEl || !headingEl || !timelineEl) {
            console.error("Missing HTML elements for experience section");
            return;
        }

        // Asignar títulos
        titleEl.textContent = content.title;
        headingEl.textContent = content.experienceTitle;

        // Limpiar items previos
        timelineEl.innerHTML = `
            <li class="timeline-heading text-center animate-box">
                <div><h3 id="experience-title">${content.experienceTitle}</h3></div>
            </li>
        `;

        // Textos del botón desde JSON (nivel superior)
        const readMoreText = data.readMoreText?.[lang] || "Leer más";
        const showLessText = data.showLessText?.[lang] || (lang === "es" ? "Mostrar menos" : "Show less");

        function createTimelineItem(item, inverted = false) {
            const li = document.createElement("li");
            li.className = `animate-box ${inverted ? "timeline-inverted" : "timeline-unverted"}`;

            // Convertimos la descripción en un contenedor ocultable
            const fullDescription = item.description.map(p => `<p>${p}</p>`).join("");
            const shortDescription = item.description.length > 0 ? `<p>${item.description[0]}</p>` : "";

            li.innerHTML = `
                <div class="timeline-badge"><i class="icon-suitcase"></i></div>
                <div class="timeline-panel">
                    <div class="timeline-heading">
                        <h3 class="timeline-title">${item.role || item.title}</h3>
                        <span class="company">${item.company}</span>
                    </div>
                    <div class="timeline-body">
                        <div class="description-short">${shortDescription}</div>
                        <div class="description-full" style="display:none;">${fullDescription}</div>
                        <button class="read-more">${readMoreText}</button>
                    </div>
                </div>
            `;

            // Añadir funcionalidad al botón
            const btn = li.querySelector(".read-more");
            const shortDiv = li.querySelector(".description-short");
            const fullDiv = li.querySelector(".description-full");

            btn.addEventListener("click", () => {
                const isExpanded = fullDiv.style.display === "block";
                fullDiv.style.display = isExpanded ? "none" : "block";
                shortDiv.style.display = isExpanded ? "block" : "none";
                btn.textContent = isExpanded ? readMoreText : showLessText;
            });

            return li;
        }

        content.experience.forEach((item, idx) => {
            const li = createTimelineItem(item, idx % 2 === 1);
            timelineEl.appendChild(li);
        });

    } catch (err) {
        console.error("Error loading experience.json:", err);
    }
}


async function loadMyEducationContent(lang) {
    try {
        const response = await fetch("content/education.json");
        const data = await response.json();

        const content = data[lang];
        if (!content) {
            console.error(`No education data for language: ${lang}`);
            return;
        }

        const titleEl = document.getElementById("resume-title-education");
        const headingEl = document.getElementById("education-title");
        const timelineEl = document.getElementById("resume-timeline-education");

        if (!titleEl || !headingEl || !timelineEl) {
            console.error("Missing HTML elements for education section");
            return;
        }

        // Títulos
        titleEl.textContent = content.title;
        headingEl.textContent = content.educationTitle;

        // Reset timeline
        timelineEl.innerHTML = `
      <li class="timeline-heading text-center animate-box">
        <div><h3 id="education-title">${content.educationTitle}</h3></div>
      </li>
    `;

        const readMoreText = data.readMoreText?.[lang];
        const showLessText = data.showLessText?.[lang];

        function createTimelineItem(item, inverted = false) {
            const li = document.createElement("li");
            li.className = `animate-box ${inverted ? "timeline-inverted" : "timeline-unverted"}`;

            const fullDescription = item.description.map(p => `<p>${p}</p>`).join("");
            const shortDescription = item.description.length
                ? `<p>${item.description[0]}</p>`
                : "";

            li.innerHTML = `
        <div class="timeline-badge"><i class="icon-graduation-cap"></i></div>
        <div class="timeline-panel">
          <div class="timeline-heading">
            <h3 class="timeline-title">${item.degree}</h3>
            <span class="company">${item.institution}</span>
          </div>
          <div class="timeline-body">
            <div class="description-short">${shortDescription}</div>
            <div class="description-full" style="display:none;">${fullDescription}</div>
            <button class="read-more">${readMoreText}</button>
          </div>
        </div>
      `;

            const btn = li.querySelector(".read-more");
            const shortDiv = li.querySelector(".description-short");
            const fullDiv = li.querySelector(".description-full");

            btn.addEventListener("click", () => {
                const expanded = fullDiv.style.display === "block";
                fullDiv.style.display = expanded ? "none" : "block";
                shortDiv.style.display = expanded ? "block" : "none";
                btn.textContent = expanded ? readMoreText : showLessText;
            });

            return li;
        }

        content.education.forEach((item, idx) => {
            timelineEl.appendChild(createTimelineItem(item, idx % 2 === 1));
        });

    } catch (err) {
        console.error("Error loading education.json:", err);
    }
}



async function loadCertifications(lang) {
    try {
        const res = await fetch("content/certification.json");
        const data = await res.json();

        document.getElementById("certifications-title").textContent =
            data.certificationsSection?.title?.[lang] || data.certificationsSection?.title?.["en"];

        document.getElementById("certifications-subtitle").textContent =
            data.certificationsSection?.subtitle?.[lang] || data.certificationsSection?.subtitle?.["en"];

        const container = document.getElementById("certifications-list");
        container.innerHTML = "";

        data.certifications.forEach(cert => {
            const div = document.createElement("div");
            div.className = "col-md-4 text-center col-padding animate-box";

            div.innerHTML = `
        <div class="cert-card" data-image="${cert.image}" style="background-image:url('${cert.image}')">
          <div class="desc">
          </div>
        </div>
        <br>
      `;

            container.appendChild(div);
        });

        enableCertificationPreview();

    } catch (err) {
        console.error("Error loading certifications:", err);
    }
}

/* Lightbox Preview */
function enableCertificationPreview() {
    document.querySelectorAll(".cert-card").forEach(card => {
        card.addEventListener("click", () => {
            const image = card.getAttribute("data-image");

            const overlay = document.createElement("div");
            overlay.className = "cert-lightbox";

            overlay.innerHTML = `
        <span class="close-btn">✕</span>
        <img src="${image}">
      `;

            overlay.addEventListener("click", e => {
                if (e.target.classList.contains("cert-lightbox") || e.target.classList.contains("close-btn")) {
                    overlay.remove();
                }
            });

            document.body.appendChild(overlay);
        });
    });
}

async function loadRecommendationLetters(lang) {
    const res = await fetch("content/recommendation_letters.json");
    const data = await res.json();

    document.getElementById("letters-title").textContent = data.section.title[lang];
    document.getElementById("letters-subtitle").textContent = data.section.subtitle[lang];

    const container = document.getElementById("letters-list");
    container.innerHTML = "";

    const modal = document.getElementById("letters-modal");
    const iframe = document.getElementById("letters-modal-pdf");
    const closeBtn = modal.querySelector(".close-modal");

    closeBtn.onclick = () => { modal.style.display = "none"; };
    modal.onclick = e => {
        if (e.target === modal) modal.style.display = "none";
    };

    data.letters.forEach(letter => {
        const div = document.createElement("div");
        div.className = "col-md-4 animate-box";

        div.innerHTML = `
      <div class="recommendation-card" style="cursor:pointer;">
        <img src="${letter.preview}" style="width:100%; height:auto; object-fit:cover;">
        <h3>${letter.person}</h3>
        <span>${letter.company} — ${letter.date}</span>
      </div>
    `;

        div.querySelector(".recommendation-card").onclick = () => {
            iframe.src = letter.pdf;   // Si es imagen, cambiar a <img> en el modal
            modal.style.display = "flex";
        };

        container.appendChild(div);
    });
}


async function loadAwards(lang) {
  try {
    const res = await fetch("content/awards.json");
    const data = await res.json();

    const content = data[lang];
    if (!content) return console.error(`No data for language: ${lang}`);

    document.getElementById("awards-title").textContent = content.title;
    document.getElementById("awards-heading").textContent = content.awardsHeading;

    const timelineEl = document.getElementById("awards-timeline");
    timelineEl.innerHTML = `
      <li class="timeline-heading text-center animate-box">
        <div><h3 id="awards-heading">${content.awardsHeading}</h3></div>
      </li>
    `;

    const readMoreText = data.readMoreText?.[lang] || "Leer más";
    const showLessText = data.showLessText?.[lang] || (lang === "es" ? "Mostrar menos" : "Show less");

    function createTimelineItem(item, inverted = false) {
      const li = document.createElement("li");
      li.className = `animate-box ${inverted ? "timeline-inverted" : "timeline-unverted"}`;

      const fullDesc = item.description.map(p => `<p>${p}</p>`).join("");
      const shortDesc = item.description.length > 0 ? `<p>${item.description[0]}</p>` : "";

      li.innerHTML = `
        <div class="timeline-badge"><i class="icon-trophy"></i></div>
        <div class="timeline-panel">
          <div class="timeline-heading">
            <h3 class="timeline-title">${item.title}</h3>
            <span class="timeline-institution">${item.institution} · ${item.date}</span>
          </div>
          <div class="timeline-body">
            <div class="description-short">${shortDesc}</div>
            <div class="description-full" style="display:none;">${fullDesc}</div>
            ${item.description.length > 1 ? `<button class="read-more">${readMoreText}</button>` : ""}
          </div>
        </div>
      `;

      const btn = li.querySelector(".read-more");
      if (btn) {
        const shortDiv = li.querySelector(".description-short");
        const fullDiv = li.querySelector(".description-full");

        btn.addEventListener("click", () => {
          const isExpanded = fullDiv.style.display === "block";
          fullDiv.style.display = isExpanded ? "none" : "block";
          shortDiv.style.display = isExpanded ? "block" : "none";
          btn.textContent = isExpanded ? readMoreText : showLessText;
        });
      }

      return li;
    }

    content.awards.forEach((item, idx) => {
      const li = createTimelineItem(item, idx % 2 === 1);
      timelineEl.appendChild(li);
    });

  } catch (err) {
    console.error("Error loading awards:", err);
  }
}




async function loadTestimonials(lang) {
    try {
        const res = await fetch("content/testimonials.json");
        const data = await res.json();
        const content = data[lang];
        if (!content) return console.error(`No data for language: ${lang}`);

        document.getElementById("pm-testimonials-title").textContent = content.title;

        const carousel = document.getElementById("pm-testimonials-carousel");
        carousel.innerHTML = "";

        content.testimonials.forEach(t => {
            const div = document.createElement("div");
            div.className = "pm-testimonial-card";
            div.innerHTML = `
    <div class="testimonial-left">
      <img src="${t.image || 'images/default-user.png'}" alt="${t.name}" class="testimonial-img">
      <div class="testimonial-info">
        <h3>${t.name}</h3>
        <div class="testimonial-position-company">${t.position}${t.company ? " | " + t.company : ""}</div>
        <div class="testimonial-date">${t.date || ""}</div>
      </div>

      <div class="testimonial-right">
        <p>"${t.comment}"</p>
      </div>
    </div>
    
  `;
            carousel.appendChild(div);
        });


        const wrapper = document.querySelector(".pm-testimonials-wrapper");
        let autoScroll = 0;
        const speed = 0.5;
        let isManual = false;

        function scrollLoop() {
            if (!isManual) {
                autoScroll += speed;
                if (autoScroll >= carousel.scrollWidth - wrapper.clientWidth) autoScroll = 0;
                wrapper.scrollLeft = autoScroll;
            }
            requestAnimationFrame(scrollLoop);
        }
        requestAnimationFrame(scrollLoop);

        // Flechas funcionales
        const leftBtn = document.getElementById("pm-testimonials-left");
        const rightBtn = document.getElementById("pm-testimonials-right");
        const cardWidth = carousel.querySelector(".pm-testimonial-card").offsetWidth + 20;

        leftBtn.addEventListener("click", () => {
            isManual = true;
            wrapper.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });
        rightBtn.addEventListener("click", () => {
            isManual = true;
            wrapper.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });

        // Modo manual al pasar ratón sobre wrapper
        wrapper.addEventListener("mouseenter", () => { isManual = true; });
        wrapper.addEventListener("mouseleave", () => { isManual = false; });

    } catch (err) {
        console.error("Error loading testimonials:", err);
    }
}







async function loadCoursesCarousel(lang) {
    try {
        const res = await fetch("content/courses.json");
        const data = await res.json();

        const courses = data.courses;
        const container = document.getElementById("courses-list");
        const pagination = document.getElementById("courses-pagination");

        // Títulos
        document.getElementById("courses-title").textContent = data.coursesSection?.title?.[lang] || data.coursesSection?.title?.["en"];
        document.getElementById("courses-subtitle").textContent = data.coursesSection?.subtitle?.[lang] || data.coursesSection?.subtitle?.["en"];

        const itemsPerPage = 8;
        const totalPages = Math.ceil(courses.length / itemsPerPage);
        let currentPage = 1;

        function renderPage(page) {
            container.innerHTML = "";
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const pageItems = courses.slice(start, end);

            pageItems.forEach(course => {
                const col = document.createElement("div");
                col.className = "col-md-3 col-sm-6 col-xs-12"; // 4 columnas en escritorio
                col.innerHTML = `
                    <div class="course-card" data-pdf="${course.pdf || '#'}">
                        <img src="${course.image}" alt="${course.name?.[lang] || course.name?.en}">
                        <div class="course-content">
                            <h3>${course.name?.[lang] || course.name?.en}</h3>
                            <p class="institution">${course.institution?.[lang] || course.institution?.en}</p>
                            <p class="date">${course.date}</p>
                            <p class="duration">${course.duration} hours</p>
                        </div>
                    </div>
                `;
                container.appendChild(col);

                // Abrir PDF
                col.querySelector(".course-card").addEventListener("click", () => {
                    const modal = document.querySelector(".course-modal");
                    modal.style.display = "flex";
                    document.getElementById("course-pdf-frame").src = course.pdf || "#";
                });
            });

            // Actualizar paginación
            pagination.innerHTML = "";
            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement("span");
                btn.className = `page-btn ${i === page ? "active" : ""}`;
                btn.textContent = i;
                btn.addEventListener("click", () => {
                    renderPage(i);
                });
                pagination.appendChild(btn);
            }
        }

        renderPage(1);

        // Cerrar modal
        document.querySelector(".course-modal .close-modal").addEventListener("click", () => {
            document.querySelector(".course-modal").style.display = "none";
            document.getElementById("course-pdf-frame").src = "";
        });

    } catch (err) {
        console.error("Error loading courses:", err);
    }
}








async function loadHobbies(lang) {
  try {
    const res = await fetch("content/hobbies.json");
    const data = await res.json();
    const content = data[lang];
    if (!content) return console.error(`No data for language: ${lang}`);

    document.getElementById("hobbies-title").textContent = content.title;
    document.getElementById("hobbies-subtitle").textContent = content.subtitle;

    const container = document.getElementById("hobbies-list");
    container.innerHTML = "";

    content.hobbies.forEach((hobby, idx) => {
      const div = document.createElement("div");
      div.className = "col-md-4";

      // Crear carrusel de imágenes
      const carouselImages = hobby.images.map((img, i) => 
        `<img src="${img}" class="${i===0 ? "active" : ""}">`
      ).join("");

      div.innerHTML = `
        <div class="hobby-card" onclick="window.open('${hobby.url}', '_blank')">
          <div class="hobby-carousel">${carouselImages}</div>
          <div class="hobby-icon">${hobby.icon}</div>
          <h3>${hobby.title}</h3>
          <p>${hobby.description}</p>
        </div>
      `;
      container.appendChild(div);

      // Iniciar carrusel automático
      const carousel = div.querySelector(".hobby-carousel");
      const images = carousel.querySelectorAll("img");
      let current = 0;
      setInterval(() => {
        images[current].classList.remove("active");
        current = (current + 1) % images.length;
        images[current].classList.add("active");
      }, 2500 + idx * 200); // Desfase para que no cambien todas al mismo tiempo
    });

  } catch (err) {
    console.error("Error loading hobbies:", err);
  }
}





async function loadAndRenderFooter(lang) {
    try {
        // Cargar JSON
        const res = await fetch("content/footer.json");
        const footerData = await res.json();

        if (!footerData[lang]) return console.error(`No data for language: ${lang}`);
        const data = footerData[lang];

        // Made by
        const madeByEl = document.getElementById("footer-madeby");
        if (madeByEl) madeByEl.innerHTML = `${data.madeBy} <a href="${data.socials.github}" target="_blank">Pabllopf</a> <br> ${data.license}`;

        // Botón Reportar incidencia
        const reportBtn = document.getElementById("footer-report");
        if (reportBtn) {
            reportBtn.innerText = data.reportIssue;
            reportBtn.href = "#"; // actualizar con link real
        }

        // Botón Donar
        const donateBtn = document.getElementById("footer-donate");
        if (donateBtn) {
            donateBtn.innerText = data.donate;
            donateBtn.href = "#"; // actualizar con link real
        }

        // Redes sociales
        const socialsContainer = document.getElementById("footer-socials");
        if (socialsContainer) {
            socialsContainer.innerHTML = "";
            for (const [key, url] of Object.entries(data.socials)) {
                let iconClass = "";
                switch(key) {
                    case "github": iconClass = "icon-github"; break;
                    case "linkedin": iconClass = "icon-linkedin2"; break;
                    case "instagram": iconClass = "icon-instagram"; break;
                    case "email": iconClass = "icon-email"; break;
                }
                socialsContainer.innerHTML += `<li class="list-inline-item"><a href="${url}" target="_blank"><i class="${iconClass}"></i></a></li>`;
            }
        }

        // Visitor badge
        const visitorImg = document.getElementById("footer-visitor-img");
        if (visitorImg) visitorImg.src = data.visitorBadge;

    } catch (err) {
        console.error("Error loading or rendering footer:", err);
    }
}





// Mapa de plataformas a SVG
const platformIcons = {
    "Windows": `<span class="project-platform"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M96 157.7L279.6 132.4L279.6 309.8L96 309.8L96 157.7zM96 482.3L279.6 507.6L279.6 332.4L96 332.4L96 482.3zM299.8 510.3L544 544L544 332.4L299.8 332.4L299.8 510.3zM299.8 129.7L299.8 309.8L544 309.8L544 96L299.8 129.7z"/></svg> </span>`,
    "MacOS": `<span class="project-platform"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M447.1 332.7C446.9 296 463.5 268.3 497.1 247.9C478.3 221 449.9 206.2 412.4 203.3C376.9 200.5 338.1 224 323.9 224C308.9 224 274.5 204.3 247.5 204.3C191.7 205.2 132.4 248.8 132.4 337.5C132.4 363.7 137.2 390.8 146.8 418.7C159.6 455.4 205.8 545.4 254 543.9C279.2 543.3 297 526 329.8 526C361.6 526 378.1 543.9 406.2 543.9C454.8 543.2 496.6 461.4 508.8 424.6C443.6 393.9 447.1 334.6 447.1 332.7zM390.5 168.5C417.8 136.1 415.3 106.6 414.5 96C390.4 97.4 362.5 112.4 346.6 130.9C329.1 150.7 318.8 175.2 321 202.8C347.1 204.8 370.9 191.4 390.5 168.5z"/></svg> </span>`,
    "Linux": `<span class="project-platform"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M316.9 187.3C317.9 187.8 318.7 189 319.9 189C321 189 322.7 188.6 322.8 187.5C323 186.1 320.9 185.2 319.6 184.6C317.9 183.9 315.7 183.6 314.1 184.5C313.7 184.7 313.3 185.2 313.5 185.6C313.8 186.9 315.8 186.7 316.9 187.3zM295 189C296.2 189 297 187.8 298 187.3C299.1 186.7 301.1 186.9 301.5 185.7C301.7 185.3 301.3 184.8 300.9 184.6C299.3 183.7 297.1 184 295.4 184.7C294.1 185.3 292 186.2 292.2 187.6C292.3 188.6 294 189.1 295 189zM516 467.8C512.4 463.8 510.7 456.2 508.8 448.1C507 440 504.9 431.3 498.3 425.7C497 424.6 495.7 423.6 494.3 422.8C493 422 491.6 421.3 490.2 420.8C499.4 393.5 495.8 366.3 486.5 341.7C475.1 311.6 455.2 285.3 440 267.3C422.9 245.8 406.3 225.4 406.6 195.3C407.1 149.4 411.7 64.1 330.8 64C228.4 63.8 254 167.4 252.9 199.2C251.2 222.6 246.5 241 230.4 263.9C211.5 286.4 184.9 322.7 172.3 360.6C166.3 378.5 163.5 396.7 166.1 413.9C159.6 419.7 154.7 428.6 149.5 434.1C145.3 438.4 139.2 440 132.5 442.4C125.8 444.8 118.5 448.4 114 456.9C111.9 460.8 111.2 465 111.2 469.3C111.2 473.2 111.8 477.2 112.4 481.1C113.6 489.2 114.9 496.8 113.2 501.9C108 516.3 107.3 526.3 111 533.6C114.8 540.9 122.4 544.1 131.1 545.9C148.4 549.5 171.9 548.6 190.4 558.4C210.2 568.8 230.3 572.5 246.3 568.8C257.9 566.2 267.4 559.2 272.2 548.6C284.7 548.5 298.5 543.2 320.5 542C335.4 540.8 354.1 547.3 375.6 546.1C376.2 548.4 377 550.7 378.1 552.8L378.1 552.9C386.4 569.6 401.9 577.2 418.4 575.9C435 574.6 452.5 564.9 466.7 548C480.3 531.6 502.7 524.8 517.6 515.8C525 511.3 531 505.7 531.5 497.5C531.9 489.3 527.1 480.2 516 467.8zM319.8 151.3C329.6 129.1 354 129.5 363.8 150.9C370.3 165.1 367.4 181.8 359.5 191.3C357.9 190.5 353.6 188.7 346.9 186.4C348 185.2 350 183.7 350.8 181.8C355.6 170 350.6 154.8 341.7 154.5C334.4 154 327.8 165.3 329.9 177.5C325.8 175.5 320.5 174 316.9 173.1C315.9 166.2 316.6 158.5 319.8 151.3zM279.1 139.8C289.2 139.8 299.9 154 298.2 173.3C294.7 174.3 291.1 175.8 288 177.9C289.2 169 284.7 157.8 278.4 158.3C270 159 268.6 179.5 276.6 186.4C277.6 187.2 278.5 186.2 270.7 191.9C255.1 177.3 260.2 139.8 279.1 139.8zM265.5 200.5C271.7 195.9 279.1 190.5 279.6 190C284.3 185.6 293.1 175.8 307.5 175.8C314.6 175.8 323.1 178.1 333.4 184.7C339.7 188.8 344.7 189.1 356 194C364.4 197.5 369.7 203.7 366.5 212.2C363.9 219.3 355.5 226.6 343.8 230.3C332.7 233.9 324 246.3 305.6 245.2C301.7 245 298.6 244.2 296 243.1C288 239.6 283.8 232.7 276 228.1C267.4 223.3 262.8 217.7 261.3 212.8C259.9 207.9 261.3 203.8 265.5 200.5zM268.8 534.5C266.1 569.6 224.9 568.9 193.5 552.5C163.6 536.7 124.9 546 117 530.6C114.6 525.9 114.6 517.9 119.6 504.2L119.6 504C122 496.4 120.2 488 119 480.1C117.8 472.3 117.2 465.1 119.9 460.1C123.4 453.4 128.4 451 134.7 448.8C145 445.1 146.5 445.4 154.3 438.9C159.8 433.2 163.8 426 168.6 420.9C173.7 415.4 178.6 412.8 186.3 414C194.4 415.2 201.4 420.8 208.2 430L227.8 465.6C237.3 485.5 270.9 514 268.8 534.5zM267.4 508.6C263.3 502 257.8 495 253 489C260.1 489 267.2 486.8 269.7 480.1C272 473.9 269.7 465.2 262.3 455.2C248.8 437 224 422.7 224 422.7C210.5 414.3 202.9 404 199.4 392.8C195.9 381.6 196.4 369.5 199.1 357.6C204.3 334.7 217.7 312.4 226.3 298.4C228.6 296.7 227.1 301.6 217.6 319.2C209.1 335.3 193.2 372.5 215 401.6C215.6 380.9 220.5 359.8 228.8 340.1C240.8 312.7 266.1 265.2 268.1 227.4C269.2 228.2 272.7 230.6 274.3 231.5C278.9 234.2 282.4 238.2 286.9 241.8C299.3 251.8 315.4 251 329.3 243C335.5 239.5 340.5 235.5 345.2 234C355.1 230.9 363 225.4 367.5 219C375.2 249.4 393.2 293.3 404.7 314.7C410.8 326.1 423 350.2 428.3 379.3C431.6 379.2 435.3 379.7 439.2 380.7C453 345 427.5 306.5 415.9 295.8C411.2 291.2 411 289.2 413.3 289.3C425.9 300.5 442.5 323 448.5 348.3C451.3 359.9 451.8 372 448.9 384C465.3 390.8 484.8 401.9 479.6 418.8C477.4 418.7 476.4 418.8 475.4 418.8C478.6 408.7 471.5 401.2 452.6 392.7C433 384.1 416.6 384.1 414.3 405.2C402.2 409.4 396 419.9 392.9 432.5C390.1 443.7 389.3 457.2 388.5 472.4C388 480.1 384.9 490.4 381.7 501.4C349.6 524.3 305 534.3 267.4 508.6zM524.8 497.1C523.9 513.9 483.6 517 461.6 543.6C448.4 559.3 432.2 568 418 569.1C403.8 570.2 391.5 564.3 384.3 549.8C379.6 538.7 381.9 526.7 385.4 513.5C389.1 499.3 394.6 484.7 395.3 472.9C396.1 457.7 397 444.4 399.5 434.2C402.1 423.9 406.1 417 413.2 413.1C413.5 412.9 413.9 412.8 414.2 412.6C415 425.8 421.5 439.2 433 442.1C445.6 445.4 463.7 434.6 471.4 425.8C480.4 425.5 487.1 424.9 494 430.9C503.9 439.4 501.1 461.2 511.1 472.5C521.7 484.1 525.1 492 524.8 497.1zM269.4 212.7C271.4 214.6 274.1 217.2 277.4 219.8C284 225 293.2 230.4 304.7 230.4C316.3 230.4 327.2 224.5 336.5 219.6C341.4 217 347.4 212.6 351.3 209.2C355.2 205.8 357.2 202.9 354.4 202.6C351.6 202.3 351.8 205.2 348.4 207.7C344 210.9 338.7 215.1 334.5 217.5C327.1 221.7 315 227.7 304.6 227.7C294.2 227.7 285.9 222.9 279.7 218C276.6 215.5 274 213 272 211.1C270.5 209.7 270.1 206.5 267.7 206.2C266.3 206.1 265.9 209.9 269.4 212.7z"/></svg> </span>`,
    "iOS": `<span class="project-platform"> <i class="icon-ios"></i> </span>`,
    "Android": `<span class="project-platform"> <i class="icon-android"></i> </span>`
};

async function loadProjects(lang) {
    try {
        const res = await fetch("content/projects.json");
        const config = await res.json();

        document.getElementById("projects-title").textContent =
            config.projectsSection?.title?.[lang] || config.projectsSection?.title?.["en"];
        document.getElementById("projects-subtitle").textContent =
            config.projectsSection?.subtitle?.[lang] || config.projectsSection?.subtitle?.["en"];

        const projectsContainer = document.getElementById("projects-list");
        projectsContainer.innerHTML = "";

        config.projects.forEach((proj, index) => {
            const div = document.createElement("div");
            div.className = "col-md-4";

            // Plataformas
            const platformsHTML = (proj.platforms || [])
                .map(p => platformIcons[p] || p)
                .join("");

            // Descripción
            const description = proj.description?.[lang] || proj.description?.["en"] || "";

            // Generar carrusel si hay más de 1 imagen
            let imagesHTML = "";
            if (proj.images && proj.images.length > 1) {
                imagesHTML = `
          <div class="project-carousel" id="carousel-${index}">
            ${proj.images.map((img, i) => `
              <div class="carousel-slide" style="background-image: url(${img}); ${i === 0 ? 'display:block;' : ''}"></div>
            `).join("")}
            <button class="carousel-prev" onclick="prevSlide(${index})">&#10094;</button>
            <button class="carousel-next" onclick="nextSlide(${index})">&#10095;</button>
          </div>
        `;
            } else {
                imagesHTML = `<a href="${proj.url}" target="_blank" class="blog-bg" style="background-image: url(${proj.images[0]});"></a>`;
            }

            div.innerHTML = `
        <div class="fh5co-blog animate-box">
          ${imagesHTML}
          <div class="blog-text">
            <div class="project-platforms">${platformsHTML}</div>
            <h3><a href="${proj.url}" target="_blank">${proj.name}</a></h3>
            <p>${description}</p>
            <ul class="stuff">
              <li><i class="icon-heart2"></i>${proj.stars}</li>
              <li><i class="icon-eye2"></i>${proj.forks}</li>
              <li><i class="icon-download22"></i>${proj.downloads}</li>
              <li>
                <a href="${proj.url}" target="_blank">
                  ${proj.buttonText?.[lang] || proj.buttonText?.["en"] || "View"}
                  <i class="icon-arrow-right22"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      `;

            projectsContainer.appendChild(div);
        });

    } catch (err) {
        console.error("Error loading projects:", err);
    }
}

// Carrusel JS simple
function nextSlide(index) {
    const carousel = document.getElementById(`carousel-${index}`);
    const slides = carousel.querySelectorAll(".carousel-slide");
    let current = Array.from(slides).findIndex(slide => slide.style.display === "block");
    slides[current].style.display = "none";
    slides[(current + 1) % slides.length].style.display = "block";
}

function prevSlide(index) {
    const carousel = document.getElementById(`carousel-${index}`);
    const slides = carousel.querySelectorAll(".carousel-slide");
    let current = Array.from(slides).findIndex(slide => slide.style.display === "block");
    slides[current].style.display = "none";
    slides[(current - 1 + slides.length) % slides.length].style.display = "block";
}








let currentPage = 1;
const itemsPerPage = 8; // 2 filas de 4
let allBlogs = [];

async function loadBlogs(lang) {
  try {
    const res = await fetch("content/blogs.json");
    const data = await res.json();
    const content = data[lang];
    if (!content) return console.error(`No data for language: ${lang}`);

    document.getElementById("blogs-title").textContent = content.title;
    allBlogs = content.blogs;

    renderBlogs();
    setupSearch();
  } catch (err) {
    console.error("Error loading blogs:", err);
  }
}

function renderBlogs(filter = '') {
  const blogsContainer = document.getElementById("blogs-list");
  blogsContainer.innerHTML = "";

  const filteredBlogs = allBlogs.filter(blog =>
    blog.title.toLowerCase().includes(filter.toLowerCase()) ||
    blog.description.toLowerCase().includes(filter.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  if (currentPage > totalPages) currentPage = 1;

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const blogsToShow = filteredBlogs.slice(start, end);

  blogsToShow.forEach(blog => {
    const div = document.createElement("div");
    div.className = "col-md-3 col-sm-6"; 
    div.innerHTML = `
      <br>
      <div class="blog-pin-card" onclick="window.open('${blog.url}', '_blank')">
        <div class="blog-pin">📍</div>
        <h3>${blog.title}</h3>
        <span class="blog-meta">${blog.platform} · ${blog.date}</span>
        <p>${blog.description}</p>
      </div>
    `;
    blogsContainer.appendChild(div);
  });

  renderPagination(totalPages, filter);
}

function renderPagination(totalPages, filter) {
  const paginationContainer = document.getElementById("blogs-pagination");
  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = "pagination-btn" + (i === currentPage ? " active" : "");
    btn.textContent = i;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderBlogs(filter);
    });
    paginationContainer.appendChild(btn);
  }
}

function setupSearch() {
  const searchInput = document.getElementById("blogs-search");
  searchInput.addEventListener("input", (e) => {
    currentPage = 1;
    renderBlogs(e.target.value);
  });
}






async function loadSkills(lang) {
  const res = await fetch("content/skills.json");
  const data = await res.json();
  const content = data[lang];
  if (!content) return;

  document.getElementById("skills-title").textContent = content.title;
  document.getElementById("skills-subtitle").textContent = content.subtitle;

  const container = document.getElementById("skills-groups");
  container.innerHTML = "";

  content.categories.forEach(cat => {
    const col = document.createElement("div");
    col.className = "col-md-12";

    col.innerHTML = `
      <div class="skills-group">
        <h3>${cat.name}</h3>
        <div class="skills-grid">
          ${cat.items.map(skill => `
            <div class="skill-card">
              <i class="${skill.icon}"></i>
              <span>${skill.name}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    container.appendChild(col);
  });
}


function setupSkillFilters(categories) {
  const container = document.getElementById("skills-filters");
  container.innerHTML = "";

  categories.forEach((cat, index) => {
    const btn = document.createElement("button");
    btn.className = "skill-filter-btn";
    btn.textContent = cat.name;
    btn.onclick = () => {
      document.querySelectorAll(".skills-group").forEach((g, i) => {
        g.style.display = i === index ? "block" : "none";
      });
    };
    container.appendChild(btn);
  });
}


// ==========================
//  IMPACT SECTION LOADER
// ==========================
async function loadAndRenderImpact(lang) {
  try {
    // Cargar JSON si no se ha cargado
    if (!window.impactData) {
      const response = await fetch("content/impact.json");
      window.impactData = await response.json();
    }

    const data = window.impactData[lang];
    if (!data) return;

    // Actualizar título y subtítulo
    document.getElementById("impact-title").innerText = data.title;
    document.getElementById("impact-subtitle").innerText = data.subtitle;

    // Contenedor
    const container = document.getElementById("impact-list");
    container.innerHTML = "";

    // Renderizar cada item
    data.items.forEach(item => {
      container.innerHTML += `
        <div class="col-md-4 impact-col">
          <div class="impact-card">
            <div class="impact-tag">${item.tag}</div>
            <div class="impact-icon">${item.icon}</div>
            <h4>${item.title}</h4>
            <p>${item.desc}</p>
            <div class="impact-result">${item.result}</div>
            <div class="impact-tech">${item.tech}</div>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.error("Error loading or rendering impact section:", error);
  }
}


async function loadContactContent(lang) {
    try {
        const response = await fetch("content/contact.json");
        const data = await response.json();
        const content = data[lang] || data[DEFAULT_LANG];

        document.getElementById("contact-title").textContent = content.title;

        const emailInput = document.getElementById("email");
        emailInput.placeholder = content.emailPlaceholder;

        document.getElementById("contact-email-validate")
            .setAttribute("data-validate", content.emailValidate);

        document.getElementById("contact-subject").value = content.subject;

        document.getElementById("contact-message").placeholder = content.messagePlaceholder;

        document.getElementById("contact-button-text").innerHTML = `
			${content.button} <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
		`;

    } catch (err) {
        console.error("Error loading contact.json:", err);
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
    loadHowIWorkContent(initialLang);
    loadMyExperienceContent(initialLang);
    loadMyEducationContent(initialLang);
    loadContactContent(initialLang);
    loadProjects(initialLang);
    loadRecommendationLetters(initialLang);
    loadCertifications(initialLang);
    loadTestimonials(initialLang);
    loadCoursesCarousel(initialLang);
    loadAwards(initialLang);
    loadBlogs(initialLang);
    loadSkills(initialLang);
    loadAndRenderImpact(initialLang);
    loadHobbies(initialLang);
    loadAndRenderFooter(initialLang);
    setActiveLangButton(initialLang);

    document.querySelectorAll(".cd-stretchy-nav-lang a").forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
            const lang = btn.dataset.lang;
            loadHeaderContent(lang);
            loadAboutContent(lang);
            loadHowIWorkContent(lang);
            loadMyExperienceContent(lang);
            loadMyEducationContent(lang);
            loadContactContent(lang);
            loadRecommendationLetters(lang);
            loadProjects(lang);
            loadCertifications(lang);
            loadTestimonials(lang);
            loadCoursesCarousel(lang);
            loadAwards(lang);
            loadBlogs(lang);
            loadSkills(lang);
            loadAndRenderImpact(lang);
            loadHobbies(lang);
            loadAndRenderFooter(lang);
            setActiveLangButton(lang);
        });
    });
}

// Espera a que cargue el DOM
document.addEventListener("DOMContentLoaded", initLanguageSelector);
