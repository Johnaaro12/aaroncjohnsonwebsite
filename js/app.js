/* ═══════════════════════════════════════════
   Aaron Johnson – Site Data & Logic
   ═══════════════════════════════════════════
   
   PROJECTS, SKILLS, and NOTES content is managed
   via markdown files in their respective folders.
   Each folder has an index.js you edit to add entries.
   
   This file contains: About Me, Home, and all
   rendering logic.
   
   ═══════════════════════════════════════════ */

// ─── ABOUT ME DATA ───
// Edit these sections to update the About Me page content below the profile card.
const ABOUT_ME = [
  {
    heading: "Who am I",
    text: "I'm a ServiceNow Technical Architect based in Minneapolis with over a decade of experience designing and building enterprise solutions. I got my start taking apart old computers and radios as a kid, taught myself to code as a teenager, and found my way into the ServiceNow ecosystem where I've been ever since. I've worked across every major module — from ITSM fundamentals to complex integrations and custom application development.",
  }
];

// ─── HOME PAGE DATA ───
const HOME_BLURB = "I'm a ServiceNow Technical Architect with over a decade of experience designing and building enterprise solutions. I specialize in platform architecture, custom application development, and complex integrations. Everything on this site is a reflection of what I've built and what I've learned along the way.";

// Add, remove, or reorder sections here. Each one renders below the hero.
const HOME_SECTIONS = [
  {
    heading: "Background",
    text: "I'm a Senior ServiceNow Developer based in Saint Paul, Minnesota. I started my career in the ITSM space working on BMC Remedy ITSM and Kinetic Request before stepping into ServiceNow development. I've grown through every layer of the development process, serving as a Business Analyst, System Admin, and Developer before stepping into an Architect role. I hold a B.S. in Information Systems from the University of Wisconsin - La Crosse.",
  },
  {
    heading: "What I Do",
    text: "At Intermountain Health, my biggest project has been rebuilding the entire ServiceNow platform during the merger of two health systems into a single instance, spanning ITSM, HRSD, SPM, and Agile Development modules. I design end-to-end workflows like the onboarding process I built using Lifecycle Events. I also create custom solutions when off-the-shelf doesn't cut it, whether that's a timekeeping app to replace Kronos during downtime or COVID compliance modules during the pandemic. Right now, I'm leading Virtual Agent development, working on AI-powered enhancements to improve automated support. Across everything I do, the thread is the same: automate what can be automated, simplify what's complex, and make the platform work harder for the people using it.",
  },
  {
    heading: "Certifications",
    text: "Certified System Administrator (CSA), Certified Implementation Specialist – ITSM (CIS-ITSM), and Certified Application Developer (CAD).",
  },
];


/* ═══════════════════════════════════════════
   RENDERING LOGIC
   (You generally don't need to edit below)
   ═══════════════════════════════════════════ */

const CARDS_PER_PAGE = 9;
let projectPage = 0;
let skillPage = 0;
let notePage = 0;

// Type → folder mapping
const FOLDER_MAP = {
  projects: "projects",
  skills: "skills",
  notes: "notes",
};

const LABEL_MAP = {
  projects: "Projects",
  skills: "Skills",
  notes: "Notes",
};

function getPageVar(type) {
  if (type === "projects") return projectPage;
  if (type === "skills") return skillPage;
  return notePage;
}

function setPageVar(type, val) {
  if (type === "projects") projectPage = val;
  else if (type === "skills") skillPage = val;
  else notePage = val;
}

// ─── Render Card Grid (3x3 with Show More) ───
function renderCardGrid(containerId, data, page, type) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const end = (page + 1) * CARDS_PER_PAGE;
  const visible = data.slice(0, end);
  const hasMore = end < data.length;

  container.innerHTML = `
    <div class="card-grid">
      ${visible.map((item, i) => `
        <div class="card" data-index="${i}">
          <h3 class="card__title">${item.title}</h3>
          <p class="card__desc">${item.description}</p>
        </div>
      `).join("")}
    </div>
    ${hasMore ? `<button class="show-more-btn">Show More</button>` : ""}
    ${page > 0 ? `<button class="show-less-btn">Show Less</button>` : ""}
  `;

  // Card click → fetch markdown detail
  container.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      const idx = parseInt(card.dataset.index);
      showMarkdownDetail(containerId, data, data[idx], type);
    });
  });

  // Show More
  const moreBtn = container.querySelector(".show-more-btn");
  if (moreBtn) {
    moreBtn.addEventListener("click", () => {
      setPageVar(type, getPageVar(type) + 1);
      renderCardGrid(containerId, data, getPageVar(type), type);
    });
  }

  // Show Less
  const lessBtn = container.querySelector(".show-less-btn");
  if (lessBtn) {
    lessBtn.addEventListener("click", () => {
      setPageVar(type, 0);
      renderCardGrid(containerId, data, 0, type);
      container.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

// ─── Markdown Detail View (all card types) ───
async function showMarkdownDetail(containerId, data, item, type) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const folder = FOLDER_MAP[type];
  const label = LABEL_MAP[type];

  // Loading state with working back button
  container.innerHTML = `
    <div class="detail-view">
      <button class="detail-view__back">
        <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
        Back to ${label}
      </button>
      <div class="detail-view__card">
        <p class="detail-view__body" style="color: var(--text-muted);">Loading…</p>
      </div>
    </div>
  `;

  wireBackButton(container, containerId, data, type);

  try {
    const response = await fetch(`${folder}/${item.file}`);
    if (!response.ok) throw new Error("File not found");
    const markdown = await response.text();
    const html = marked.parse(markdown);

    container.innerHTML = `
      <div class="detail-view">
        <button class="detail-view__back">
          <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          Back to ${label}
        </button>
        <div class="detail-view__card markdown-body">
          ${html}
        </div>
      </div>
    `;

    wireBackButton(container, containerId, data, type);

  } catch (err) {
    container.querySelector(".detail-view__card").innerHTML = `
      <p class="detail-view__body" style="color: var(--pink);">
        Could not load <code>${item.file}</code>. Make sure the file exists in the <code>${folder}/</code> folder.
      </p>
    `;
  }

  document.querySelector(".main-panel").scrollTo({ top: 0, behavior: "smooth" });
}

function wireBackButton(container, containerId, data, type) {
  container.querySelector(".detail-view__back").addEventListener("click", () => {
    renderCardGrid(containerId, data, getPageVar(type), type);
  });
}

// ─── Render About Me ───
function renderAboutMe() {
  const container = document.getElementById("about-content");
  if (!container) return;

  container.innerHTML = ABOUT_ME.map((section) => `
    <h3 class="section-subtitle">${section.heading}</h3>
    <p class="section-text">${section.text}</p>
  `).join("");
}

// ─── Render Home ───
function renderHome() {
  const blurb = document.getElementById("home-blurb");
  const sections = document.getElementById("home-sections");
  if (blurb) blurb.textContent = HOME_BLURB;
  if (sections) {
    sections.innerHTML = HOME_SECTIONS.map((section) => `
      <h3 class="section-subtitle">${section.heading}</h3>
      <p class="section-text">${section.text}</p>
    `).join("");
  }
}

// ─── Section Navigation ───
function initNavigation() {
  const navItems = document.querySelectorAll(".nav-item[data-section]");
  const sections = document.querySelectorAll(".page-section");

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = item.dataset.section;

      navItems.forEach((n) => n.classList.remove("active"));
      item.classList.add("active");

      sections.forEach((s) => {
        s.classList.toggle("active", s.id === `section-${targetId}`);
      });

      // Re-render card grids when switching (resets any open detail view)
      if (targetId === "projects") {
        renderCardGrid("projects-content", PROJECTS_INDEX, projectPage, "projects");
      } else if (targetId === "skills") {
        renderCardGrid("skills-content", SKILLS_INDEX, skillPage, "skills");
      } else if (targetId === "notes") {
        renderCardGrid("notes-content", NOTES_INDEX, notePage, "notes");
      }

      document.querySelector(".main-panel").scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

// ─── Theme Toggle ───
function initThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  const saved = localStorage.getItem("theme");

  // Apply saved theme or default to light
  if (saved === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  toggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  });
}

// ─── Initialize ───
document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  renderHome();
  renderCardGrid("projects-content", PROJECTS_INDEX, projectPage, "projects");
  renderCardGrid("skills-content", SKILLS_INDEX, skillPage, "skills");
  renderCardGrid("notes-content", NOTES_INDEX, notePage, "notes");
  renderAboutMe();
  initNavigation();
});