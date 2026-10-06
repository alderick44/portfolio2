// Pilule de choix du profil (recruteur / entrepreneur)

/* Mouvement réduit : les défilements se font sans animation */
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const scrollBehavior = () => (reducedMotion.matches ? "auto" : "smooth");

//----- Mode, épinglage et indicateur -----

document.addEventListener("DOMContentLoaded", () => {
  const sw = document.getElementById("nav-switch");
  if (!sw) return;

  const btns = [...sw.querySelectorAll(".pill-switch__btn")];
  const wrap = sw.closest(".pill-switch-wrap");
  const anchor = wrap?.parentElement;

  /* La pilule vit dans le hero, puis reste épinglée en haut une fois dépassée */
  function updatePinned() {
    if (!wrap || !anchor) return;
    wrap.classList.toggle("is-pinned", anchor.getBoundingClientRect().top <= 12);
  }

  window.addEventListener("scroll", updatePinned, { passive: true });
  window.addEventListener("resize", updatePinned);
  updatePinned();

  const hint = wrap?.querySelector(".pill-switch-hint");
  const hintText = {
    recruteur: "Expérience, formation et CV ↓",
    entrepreneur: "Ma démarche pour créer votre site ↓",
  };
  let hintTimeout;

  function hideHint() {
    clearTimeout(hintTimeout);
    hint?.classList.remove("is-visible");
  }

  /* delay : durée d'affichage en ms (le survol l'affiche tant que la souris reste dessus) */
  function showHint(target, delay = 5000) {
    if (!hint) return;
    hint.textContent = hintText[target];
    hint.href = `#${target}`;
    hint.classList.add("is-visible");
    clearTimeout(hintTimeout);
    hintTimeout = setTimeout(hideHint, delay);
  }

  function setState(target, { scroll = true } = {}) {
    sw.dataset.state = target;
    siteMode.set(target);

    btns.forEach((b) => {
      const on = b.dataset.target === target;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });

    document.getElementById("recruteur")?.classList.toggle("show", target === "recruteur");
    document.getElementById("entrepreneur")?.classList.toggle("show", target === "entrepreneur");

    if (scroll) {
      document.getElementById(target)?.scrollIntoView({
        behavior: scrollBehavior(),
        block: "start",
      });
    }
  }

  sw.addEventListener("click", (e) => {
    e.preventDefault();
    const btn = e.target.closest(".pill-switch__btn");
    if (!btn) return;
    /* Devant les panneaux (ou plus bas), on suit le panneau qui change ;
       plus haut, la page ne bouge pas et un indicateur dit ce qui a changé */
    const current = document.getElementById(sw.dataset.state);
    const atPanels =
      !!current && current.getBoundingClientRect().top < window.innerHeight / 2;

    setState(btn.dataset.target, { scroll: atPanels });
    if (atPanels) hideHint();
    else showHint(btn.dataset.target);
  });

  /* Au survol (souris seulement), le bouton annonce où mène l'option survolée.
     Le délai laisse le temps d'aller jusqu'à l'indicateur sans qu'il disparaisse. */
  btns.forEach((btn) => {
    btn.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "mouse") showHint(btn.dataset.target, 60000);
    });
    btn.addEventListener("pointerleave", (e) => {
      if (e.pointerType !== "mouse") return;
      clearTimeout(hintTimeout);
      hintTimeout = setTimeout(hideHint, 400);
    });
  });
  hint?.addEventListener("pointerenter", () => clearTimeout(hintTimeout));
  hint?.addEventListener("pointerleave", () => {
    hintTimeout = setTimeout(hideHint, 400);
  });

  hint?.addEventListener("click", (e) => {
    e.preventDefault();
    hideHint();
    /* L'indicateur peut annoncer l'option survolée, pas seulement le mode actif */
    setState(hint.getAttribute("href").slice(1));
  });

  setState(siteMode.get(), { scroll: false });
});

//----- Taille compacte selon les sections visibles -----

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
