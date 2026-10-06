const SITE = {
  githubUser: "maitranilim",
  publicUrl: "https://broad-art-3e62.maitranilim.workers.dev/",
  email: "nishan.engg@outlook.com",
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

let toastTimer;
let visionIndex = 0;

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const helper = document.createElement("textarea");
  helper.value = value;
  helper.setAttribute("readonly", "");
  helper.style.cssText = "position:fixed;opacity:0";
  document.body.appendChild(helper);
  helper.select();
  document.execCommand("copy");
  helper.remove();
}

function initScrollEffects() {
  const bar = $("#scroll-progress");
  const header = $("#site-header");
  const toTop = $("#to-top");
  const timeline = $("#timeline");
  const parallax = $$("[data-parallax]");
  let ticking = false;

  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = window.scrollY;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    header.classList.toggle("is-scrolled", y > 12);
    toTop.classList.toggle("is-visible", y > 700);

    if (!reducedMotion) {
      parallax.forEach((node) => {
        const speed = Number(node.dataset.parallax);
        node.style.translate = `0 ${(y * speed).toFixed(1)}px`;
      });
    }

    if (timeline) {
      const rect = timeline.getBoundingClientRect();
      const progress = (window.innerHeight * 0.65 - rect.top) / rect.height;
      timeline.style.setProperty("--tl", Math.max(0, Math.min(1, progress)).toFixed(3));
    }
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", update);
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));
  update();
}

function initReveal() {
  const items = $$(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-in"));
    return;
  }
  items.forEach((item) => {
    const siblings = $$(".reveal", item.parentElement).filter((node) => node.parentElement === item.parentElement);
    const index = siblings.indexOf(item);
    item.style.setProperty("--d", `${Math.min(index, 5) * 70}ms`);
  });
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        target.classList.add("is-in");
        observer.unobserve(target);
        setTimeout(() => {
          target.classList.remove("reveal", "is-in");
          target.style.removeProperty("--d");
        }, 1100);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );
  items.forEach((item) => observer.observe(item));
}

function initCountUp() {
  const counters = $$("[data-count]");
  if (reducedMotion || !("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const node = entry.target;
        const target = Number(node.dataset.count);
        const start = performance.now();
        const duration = 1400;
        function frame(now) {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          node.textContent = String(Math.round(target * eased));
          if (t < 1) requestAnimationFrame(frame);
        }
        node.textContent = "0";
        requestAnimationFrame(frame);
      });
    },
    { threshold: 0.6 },
  );
  counters.forEach((node) => observer.observe(node));
}

function initActiveNav() {
  const links = $$("[data-nav]");
  const map = new Map(links.map((link) => [link.getAttribute("href").slice(1), link]));
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.remove("is-active"));
        map.get(entry.target.id)?.classList.add("is-active");
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  map.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
}

function initMenu() {
  const toggle = $("#menu-toggle");
  const nav = $("#nav");
  function setOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
  }
  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
}

function initPointerEffects() {
  $$(".spot").forEach((node) => {
    node.addEventListener("pointermove", (event) => {
      const rect = node.getBoundingClientRect();
      node.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      node.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  });

  if (!finePointer || reducedMotion) return;

  $$("[data-tilt]").forEach((node) => {
    const host = node.parentElement;
    host.addEventListener("pointermove", (event) => {
      const rect = host.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      node.style.transform = `rotateY(${(x * 8).toFixed(2)}deg) rotateX(${(-y * 8).toFixed(2)}deg) translateZ(0)`;
    });
    host.addEventListener("pointerleave", () => {
      node.style.transform = "";
    });
  });

  $$("[data-magnetic]").forEach((node) => {
    node.addEventListener("pointermove", (event) => {
      const rect = node.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      node.style.transform = `translate(${(x * 0.16).toFixed(1)}px, ${(y * 0.22).toFixed(1)}px)`;
    });
    node.addEventListener("pointerleave", () => {
      node.style.transform = "";
    });
  });
}

function initFilters() {
  const buttons = $$(".filter");
  const cards = $$("#project-grid .card");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      buttons.forEach((other) => {
        const active = other === button;
        other.classList.toggle("is-active", active);
        other.setAttribute("aria-pressed", String(active));
      });
      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.cat.split(" ").includes(filter);
        card.classList.toggle("is-hidden", !match);
        if (match && !reducedMotion) {
          card.animate(
            [
              { opacity: 0, transform: "translateY(14px) scale(0.98)" },
              { opacity: 1, transform: "none" },
            ],
            { duration: 420, easing: "cubic-bezier(0.22, 0.8, 0.24, 1)" },
          );
        }
      });
    });
  });
}

function relativeTime(dateString) {
  const days = Math.floor((Date.now() - new Date(dateString).getTime()) / 86400000);
  if (days < 1) return "Updated today";
  if (days === 1) return "Updated yesterday";
  if (days < 30) return `Updated ${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return months === 1 ? "Updated 1 month ago" : `Updated ${months} months ago`;
  const years = Math.floor(months / 12);
  return years === 1 ? "Updated 1 year ago" : `Updated ${years} years ago`;
}

async function initRepoStatus() {
  const cards = $$("[data-repo]");
  const apply = (card, pushed) => {
    const label = $("[data-status]", card);
    if (label && pushed) label.textContent = relativeTime(pushed);
  };
  cards.forEach((card) => apply(card, card.dataset.pushed));
  try {
    const response = await fetch(`https://api.github.com/users/${SITE.githubUser}/repos?per_page=100&sort=pushed`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!response.ok) return;
    const repos = await response.json();
    cards.forEach((card) => {
      const repo = repos.find((item) => item.name.toLowerCase() === card.dataset.repo.toLowerCase());
      if (repo) apply(card, repo.pushed_at);
    });
  } catch {
    return;
  }
}

function initLightbox() {
  const dialog = $("#lightbox");
  const cards = $$(".vision-card");
  if (!dialog || !cards.length) return;

  function render(index) {
    visionIndex = (index + cards.length) % cards.length;
    const card = cards[visionIndex];
    const image = $("#lb-image");
    image.src = card.dataset.src;
    image.alt = `${card.dataset.title} poster`;
    $("#lb-title").textContent = card.dataset.title;
    $("#lb-meta").textContent = card.dataset.meta;
    $("#lb-pos").textContent = `${String(visionIndex + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
  }

  cards.forEach((card, index) =>
    card.addEventListener("click", () => {
      render(index);
      if (!dialog.open) dialog.showModal();
    }),
  );
  $("#lb-prev").addEventListener("click", () => render(visionIndex - 1));
  $("#lb-next").addEventListener("click", () => render(visionIndex + 1));
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  document.addEventListener("keydown", (event) => {
    if (!dialog.open) return;
    if (event.key === "ArrowLeft") render(visionIndex - 1);
    if (event.key === "ArrowRight") render(visionIndex + 1);
  });
}

function initContactActions() {
  $("#copy-email").addEventListener("click", async () => {
    try {
      await copyText(SITE.email);
      showToast("Email copied to clipboard");
    } catch {
      showToast(SITE.email);
    }
  });

  $("#share-recruiter").addEventListener("click", async () => {
    const url = new URL(SITE.publicUrl);
    url.searchParams.set("view", "recruiter");
    try {
      await copyText(url.href);
      showToast("Recruiter link copied");
    } catch {
      showToast(url.href);
    }
  });
}

function init() {
  if (new URLSearchParams(window.location.search).get("view") === "recruiter") {
    document.body.classList.add("recruiter-view");
  }
  initScrollEffects();
  initReveal();
  initCountUp();
  initActiveNav();
  initMenu();
  initPointerEffects();
  initFilters();
  initRepoStatus();
  initLightbox();
  initContactActions();
}

init();
