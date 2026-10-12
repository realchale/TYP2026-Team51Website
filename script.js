// Maintenant marketing site — vanilla JS, no dependencies.

const root = document.documentElement;

/* ---------- Theme toggle ---------- */
const themeToggle = document.getElementById("theme-toggle");

function currentTheme() {
  const set = root.getAttribute("data-theme");
  if (set) return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

themeToggle.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("maintenant-theme", next); } catch (e) {}
});

/* ---------- Mobile menu ---------- */
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

function setMenu(open) {
  navLinks.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

menuToggle.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
navLinks.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

/* ---------- Header border + active nav link ---------- */
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const sectionLinks = [...navLinks.querySelectorAll('a[href^="#"]:not(.btn)')];
if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sectionLinks.forEach((a) => {
    const section = document.querySelector(a.getAttribute("href"));
    if (section) spy.observe(section);
  });
}

/* ---------- Scroll reveal ---------- */
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("visible"));
}

/* ---------- Role tabs (keyboard accessible) ---------- */
const tabs = [...document.querySelectorAll('[role="tab"]')];

function selectTab(tab) {
  tabs.forEach((t) => {
    const selected = t === tab;
    t.setAttribute("aria-selected", String(selected));
    t.tabIndex = selected ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !selected;
  });
}

tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (e) => {
    let next = null;
    if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
    if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
    if (e.key === "Home") next = tabs[0];
    if (e.key === "End") next = tabs[tabs.length - 1];
    if (next) { e.preventDefault(); selectTab(next); next.focus(); }
  });
});

/* ---------- Team avatars: initials from names ---------- */
document.querySelectorAll(".member").forEach((card) => {
  const name = card.querySelector(".member-name").textContent.trim();
  const avatar = card.querySelector("[data-initials]");
  const photo = avatar.getAttribute("data-photo");
  if (photo) {
    avatar.style.backgroundImage = `url("${photo}")`;
    avatar.setAttribute("role", "img");
    avatar.setAttribute("aria-label", name);
  } else {
    avatar.textContent = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    avatar.setAttribute("aria-hidden", "true");
  }
});

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
