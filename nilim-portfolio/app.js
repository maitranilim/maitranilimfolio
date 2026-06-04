const PROFILE = {
  name: "Nilim Maitra",
  githubUser: "maitranilim",
  githubUrl: "https://github.com/maitranilim",
  linkedinUrl: "https://www.linkedin.com/in/nilim-maitra-608b952b7/",
  publicUrl: "https://broad-art-3e62.maitranilim.workers.dev/",
  pinnedProjects: [
    {
      name: "Memeception",
      description: "Motion-first, real-time meme discovery in a playful 3D interface.",
      homepage: "https://memeception.vercel.app/",
    },
    {
      name: "Music-Genre-Finder",
      description: "Music discovery and client-side audio analysis in the browser.",
      homepage: "https://audio-magic-sigma.vercel.app",
    },
    {
      name: "moodboard-ai",
      description: "A text-driven moodboard interface for visual inspiration.",
      homepage: "https://moodboard-ai-delta.vercel.app",
    },
  ],
  fallbackRepos: [
    {
      name: "Memeception",
      description: "Motion-first, real-time meme discovery in a playful 3D interface.",
      html_url: "https://memeception.vercel.app/",
      homepage: "https://memeception.vercel.app/",
      language: "JavaScript",
      size: 1100,
      stargazers_count: 0,
      fork: false,
      pushed_at: "2026-06-01T00:00:00Z",
      topics: ["reddit-api", "motion", "javascript"],
    },
    {
      name: "Music-Genre-Finder",
      description: "Music discovery and client-side audio analysis in the browser.",
      html_url: "https://github.com/maitranilim/Music-Genre-Finder",
      homepage: "https://audio-magic-sigma.vercel.app",
      language: "JavaScript",
      size: 1260,
      stargazers_count: 0,
      fork: false,
      pushed_at: "2026-03-01T00:00:00Z",
      topics: ["web-api", "audio", "javascript"],
    },
    {
      name: "moodboard-ai",
      description: "A text-driven moodboard interface for visual inspiration.",
      html_url: "https://github.com/maitranilim/moodboard-ai",
      homepage: "https://moodboard-ai-delta.vercel.app",
      language: "JavaScript",
      size: 940,
      stargazers_count: 0,
      fork: false,
      pushed_at: "2026-02-01T00:00:00Z",
      topics: ["design", "frontend", "javascript"],
    },
  ],
};

const BUILDING_NOW = [
  {
    label: "Playful, API-led experiences",
    detail: "Memeception · Moodboard AI · Motion-first interfaces",
    kind: "Interactive products",
  },
  {
    label: "AI-directed visual systems",
    detail: "Prompt craft · Art movements · Campaign direction",
    kind: "Synthetic vision",
  },
  {
    label: "Responsive frontend systems",
    detail: "JavaScript · Web APIs · Layout · Deployment",
    kind: "Product craft",
  },
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

let activeRepos = PROFILE.fallbackRepos;
let toastTimer;
let activeVisionIndex = 0;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeUrl(value, fallback) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : fallback;
  } catch {
    return fallback;
  }
}

function monthsSince(dateString) {
  const then = new Date(dateString);
  const now = new Date();
  return Math.max(0, (now.getFullYear() - then.getFullYear()) * 12 + now.getMonth() - then.getMonth());
}

function scoreRepo(repo) {
  const recency = Math.max(0, 18 - monthsSince(repo.pushed_at) * 0.7);
  const codeVolume = Math.log10(Math.max(10, repo.size || 0)) * 4;
  const shipped = repo.homepage ? 7 : 0;
  const described = repo.description ? 2 : 0;
  const social = Math.min(8, (repo.stargazers_count || 0) * 2);
  const topics = Math.min(3, (repo.topics || []).length);
  return recency + codeVolume + shipped + described + social + topics;
}

function formatRepoName(name) {
  return name.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatRelativeDate(dateString) {
  if (!dateString) return "Snapshot";
  const months = monthsSince(dateString);
  if (months === 0) return "This month";
  if (months === 1) return "1 month ago";
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(months / 12);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function createProjectIcon(index, name) {
  const icon = document.createElement("span");
  const normalizedName = name.toLowerCase();
  const iconClass = normalizedName.includes("meme")
    ? "meme-icon"
    : normalizedName.includes("music")
      ? "music-icon"
      : "grid-icon";
  icon.className = `project-icon ${iconClass}`;
  icon.setAttribute("aria-hidden", "true");
  if (iconClass !== "meme-icon") {
    for (let i = 0; i < 4; i += 1) icon.appendChild(document.createElement("i"));
  }
  return icon;
}

function renderProjects(repos) {
  const projectList = $("#project-list");
  projectList.replaceChildren();

  const projects = PROFILE.pinnedProjects.map((pinned) => {
    const matchingRepo = repos.find((repo) => repo.name.toLowerCase() === pinned.name.toLowerCase());
    return { ...matchingRepo, ...pinned };
  });

  projects.forEach((repo, index) => {
    const row = document.createElement("a");
    row.className = "project-row";
    row.href = safeUrl(repo.homepage || repo.html_url, PROFILE.githubUrl);
    row.target = "_blank";
    row.rel = "noreferrer";

    const text = document.createElement("span");
    const title = document.createElement("strong");
    const detail = document.createElement("small");
    title.textContent = formatRepoName(repo.name);
    detail.textContent = repo.description || `${repo.language || "Web"} project · recently updated`;
    text.append(title, detail);

    const arrow = document.createElement("span");
    arrow.className = "project-arrow";
    arrow.textContent = "↗";

    row.append(createProjectIcon(index, repo.name), text, arrow);
    projectList.appendChild(row);
  });
}

function inferFocus(repos) {
  const weightedLanguages = new Map();
  repos.forEach((repo, index) => {
    if (!repo.language) return;
    const weight = Math.max(1, 8 - index) + Math.max(0, 10 - monthsSince(repo.pushed_at));
    weightedLanguages.set(repo.language, (weightedLanguages.get(repo.language) || 0) + weight);
  });

  const inferred = [...weightedLanguages.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([language]) => language);

  const defaults = ["JavaScript", "CSS", "HTML"];
  return [...new Set([...inferred, ...defaults])].slice(0, 3);
}

function renderFocus(repos) {
  const focusStack = $("#focus-stack");
  focusStack.replaceChildren();

  BUILDING_NOW.forEach((focus, index) => {
    const card = document.createElement("article");
    card.className = "focus-card";
    card.innerHTML = `
      <span class="focus-index">0${index + 1}</span>
      <div>
        <p>${escapeHtml(focus.kind)}</p>
        <h3>${escapeHtml(focus.label)}</h3>
        <span>${escapeHtml(focus.detail)}</span>
      </div>
      <div class="focus-meter"><span style="--meter: ${Math.max(58, 84 - index * 10)}%"></span></div>
    `;
    focusStack.appendChild(card);
  });
}

function renderActivity(repos) {
  const recentRepos = repos.filter((repo) => monthsSince(repo.pushed_at) <= 18);
  const latestRepo = [...repos].sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))[0];
  const focus = inferFocus(repos);

  $("#repo-count").textContent = String(recentRepos.length || repos.length);
  $("#leading-language").textContent = focus[0] || "JavaScript";
  $("#latest-push").textContent = latestRepo ? formatRelativeDate(latestRepo.pushed_at) : "Snapshot";
}

function renderNarrative(repos) {
  const rankedRepos = repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => scoreRepo(b) - scoreRepo(a));
  activeRepos = rankedRepos.length ? rankedRepos : PROFILE.fallbackRepos;
  renderProjects(activeRepos);
  renderFocus(activeRepos);
  renderActivity(activeRepos);
}

async function refreshGitHub({ announce = false } = {}) {
  const button = $("#refresh-github");
  const status = $("#source-status");
  button.classList.add("is-loading");
  status.textContent = "Syncing GitHub · LinkedIn verified";

  try {
    const response = await fetch(`https://api.github.com/users/${PROFILE.githubUser}/repos?per_page=100&sort=updated`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!response.ok) throw new Error(`GitHub responded ${response.status}`);
    const repos = await response.json();
    renderNarrative(repos);
    status.textContent = "GitHub live · LinkedIn verified";
    if (announce) showToast("Narrative refreshed from live GitHub data.");
  } catch (error) {
    renderNarrative(PROFILE.fallbackRepos);
    status.textContent = "GitHub snapshot · LinkedIn verified";
    if (announce) showToast("Live GitHub is unavailable; verified snapshot retained.");
    console.info("Using verified GitHub snapshot.", error);
  } finally {
    button.classList.remove("is-loading");
  }
}

function recruiterUrl() {
  const url = new URL(PROFILE.publicUrl);
  url.searchParams.set("view", "recruiter");
  return url.href;
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const helper = document.createElement("textarea");
  helper.value = value;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.opacity = "0";
  document.body.appendChild(helper);
  helper.select();
  document.execCommand("copy");
  helper.remove();
}

function openShareDialog(url, copied = true) {
  $("#share-url").value = url;
  $("#share-message").textContent = copied
    ? "The recruiter URL has been copied. It opens a focused, mobile-friendly view of this page."
    : "Copy the recruiter URL below. It opens a focused, mobile-friendly view of this page.";
  $("#share-note").hidden = true;
  const dialog = $("#share-dialog");
  if (!dialog.open) dialog.showModal();
}

function renderVisionDirection(index) {
  const cards = $$(".vision-card");
  activeVisionIndex = (index + cards.length) % cards.length;
  const card = cards[activeVisionIndex];
  const image = $("#vision-dialog-image");
  const title = card.dataset.visionTitle;
  const meta = card.dataset.visionMeta;
  image.src = card.dataset.visionSrc;
  image.alt = `${title} visual direction`;
  $("#vision-dialog-title").textContent = title;
  $("#vision-dialog-meta").textContent = meta;
  $("#vision-dialog-position").textContent = `${String(activeVisionIndex + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
}

function openVisionDirection(card) {
  renderVisionDirection($$(".vision-card").indexOf(card));
  const dialog = $("#vision-dialog");
  if (!dialog.open) dialog.showModal();
}

function navigateVision(direction) {
  renderVisionDirection(activeVisionIndex + direction);
}

function handleVisionKeys(event) {
  if (!$("#vision-dialog").open) return;
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    navigateVision(-1);
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    navigateVision(1);
  }
}

async function shareProfile() {
  const url = recruiterUrl();
  const shareData = {
    title: `${PROFILE.name} · Software Developer`,
    text: "A recruiter-friendly view of Nilim Maitra's shipped products, synthetic visual direction, and core expertise.",
    url,
  };

  if (navigator.share && window.matchMedia("(max-width: 720px)").matches) {
    try {
      await navigator.share(shareData);
      return;
    } catch (error) {
      if (error?.name === "AbortError") return;
    }
  }

  try {
    await copyText(url);
    openShareDialog(url, true);
  } catch {
    openShareDialog(url, false);
  }
}

function setRecruiterView() {
  const recruiterMode = new URLSearchParams(window.location.search).get("view") === "recruiter";
  if (!recruiterMode) return;
  document.body.classList.add("recruiter-view");
  $$("[data-share-profile]").forEach((button) => {
    button.setAttribute("aria-label", "Copy recruiter profile link");
    const label = $("span", button);
    if (label) label.textContent = "Copy profile link";
    const textNode = [...button.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
    if (textNode) textNode.textContent = " Copy profile link";
  });
}

function setMobileShareVisibility() {
  const mobileShare = $(".mobile-share");
  const visible = window.scrollY > 420;
  document.body.classList.toggle("has-scrolled", visible);
  mobileShare.tabIndex = visible ? 0 : -1;
  mobileShare.setAttribute("aria-hidden", String(!visible));
}

function init() {
  setRecruiterView();
  renderNarrative(PROFILE.fallbackRepos);
  refreshGitHub();
  setMobileShareVisibility();

  $("#last-updated").textContent = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  $("#refresh-github").addEventListener("click", () => refreshGitHub({ announce: true }));
  $$("[data-share-profile]").forEach((button) => button.addEventListener("click", shareProfile));
  $$(".vision-card").forEach((card) => card.addEventListener("click", () => openVisionDirection(card)));
  ["#vision-prev", "#vision-prev-copy"].forEach((selector) => $(selector).addEventListener("click", () => navigateVision(-1)));
  ["#vision-next", "#vision-next-copy"].forEach((selector) => $(selector).addEventListener("click", () => navigateVision(1)));
  document.addEventListener("keydown", handleVisionKeys);
  window.addEventListener("scroll", setMobileShareVisibility, { passive: true });
  $("#copy-link").addEventListener("click", async () => {
    await copyText($("#share-url").value);
    showToast("Recruiter URL copied.");
  });
}

init();
