/* La vidéo démo ne se télécharge que lorsqu'elle approche de l'écran.
   Mouvement réduit : elle ne démarre pas toute seule, on la lance avec les commandes. */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const loadVideo = (v) => {
  v.src = v.dataset.src;
  if (reduceMotion) v.controls = true;
  else v.play().catch(() => {});
};
const lazyVideos = document.querySelectorAll("video[data-src]");
if ("IntersectionObserver" in window) {
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        videoObserver.unobserve(e.target);
        loadVideo(e.target);
      });
    },
    { rootMargin: "300px 0px" },
  );
  lazyVideos.forEach((v) => videoObserver.observe(v));
} else {
  lazyVideos.forEach(loadVideo);
}

const sectionFormation = document.querySelector("#formation");

sectionFormation.addEventListener("shown.bs.collapse", () => {
  sectionFormation.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
});


//-----------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const stickyCta = document.getElementById("realisations-sticky");
  const realisations = document.getElementById("realisations");

  if (!stickyCta || !realisations) return;

  /* Le bouton ne sert qu'à ceux qui ont sauté les réalisations (raccourci de la pilule).
     On les considère vues si la section Spora est restée 2 s à l'écran :
     un défilement automatique qui passe par-dessus ne compte pas. */
  const seenTarget = document.getElementById("realisations-spora") || realisations;
  let hasSeenRealisations = false;
  let seenTimeout;

  const seenObserver = new IntersectionObserver(([entry]) => {
    clearTimeout(seenTimeout);
    if (!entry.isIntersecting) return;
    seenTimeout = setTimeout(() => {
      hasSeenRealisations = true;
      seenObserver.disconnect();
      updateStickyVisibility();
    }, 2000);
  });
  seenObserver.observe(seenTarget);

  function updateStickyVisibility() {
    const rect = realisations.getBoundingClientRect(); //.getBoundingClientRect(), check MDN
    const hasPassedRealisations = rect.bottom < 0;
    stickyCta.classList.toggle(
      "is-visible",
      hasPassedRealisations && !hasSeenRealisations,
    );
  }

  window.addEventListener("scroll", updateStickyVisibility, { passive: true });
  window.addEventListener("resize", updateStickyVisibility);

  stickyCta.addEventListener("click", (event) => {
    event.preventDefault();
    realisations.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  });

  updateStickyVisibility();
});

//-----------------------------------------------------------------------

const actionButtons = document.querySelectorAll("button[data-copy], button[data-msg]");

actionButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const textToCopy = button.dataset.copy?.trim();
    const customMsg = button.dataset.msg?.trim();

    if (!textToCopy && !customMsg) return;

    const feedback = button.parentElement.querySelector("[data-feedback]");

    function showFeedback(message) {
      if (!feedback) return;
      feedback.textContent = message;
      clearTimeout(feedback._copyTimeout);

      feedback._copyTimeout = setTimeout(() => {
        feedback.textContent = "";
      }, 2000);
    }

    if (customMsg) {
      showFeedback(customMsg);
      return;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      showFeedback("Copié!");
    } catch (error) {
      console.error("Erreur copie :", error);
      feedback.classList.remove('text-sucess');
      feedback.classList.add('text-danger')
      showFeedback("Impossible de copier");
    }
  });
});
