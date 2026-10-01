const sectionFormation = document.querySelector("#formation");

sectionFormation.addEventListener("shown.bs.collapse", () => {
  sectionFormation.scrollIntoView({ behavior: "smooth" });
});


document.querySelectorAll('.profile-picture-zone').forEach((zone) => {
  function setProfileOffset(x, y) {
    zone.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }


  zone.addEventListener('mousemove', (event) => {
    const rect = zone.getBoundingClientRect();
    const mx = event.clientX - rect.left;
    const my = event.clientY - rect.top;
    const dx = (mx - rect.width / 2) / (rect.width / 2);
    const dy = (my - rect.height / 2) / (rect.height / 2);
    const amp = -25;
    setProfileOffset(dx * amp, dy * amp);
  });

  zone.addEventListener('mouseleave', () => setProfileOffset(0, 0));
});


//-----------------------------------------------------------------------


const range = 800; 

window.addEventListener("scroll", () => {
  const progress = window.scrollY / range;
  const clamped = Math.min(1, Math.max(0, progress));
  const bw = 1 - clamped;

  document.body.style.setProperty("--bw", bw);
});

//----------------------------------------------------------------------

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
    realisations.scrollIntoView({ behavior: "smooth", block: "start" });
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
