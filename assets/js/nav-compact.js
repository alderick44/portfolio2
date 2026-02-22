const navSwitch = document.getElementById("nav-switch");
const sentinels = document.querySelectorAll("[data-sentinel]");

let io = null;
const visibilityMap = new Map();

function setCompact(next) {
  if (!navSwitch) return;
  navSwitch.classList.toggle("is-compact", next);
}

function recalcCompact() {
  const anyVisible = [...visibilityMap.values()].some(Boolean);
  setCompact(!anyVisible);
}

function setupObserver() {
  if (!sentinels.length) return;

  if (io) io.disconnect();
  visibilityMap.clear();

  io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      visibilityMap.set(entry.target, entry.isIntersecting);
    }
    recalcCompact();
  }, {
    threshold: 0
  });

  sentinels.forEach((sentinel) => {
    visibilityMap.set(sentinel, false);
    io.observe(sentinel);
  });
}

setupObserver();
window.addEventListener("resize", setupObserver);