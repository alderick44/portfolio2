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


const range = 800; // en pixels (plus petit = plus rapide)

window.addEventListener("scroll", () => {
  const progress = window.scrollY / range;
  const clamped = Math.min(1, Math.max(0, progress));
  const bw = 1 - clamped; // 1 en haut, 0 après "range" px

  document.body.style.setProperty("--bw", bw);
});

document.addEventListener("DOMContentLoaded", () => {
  const sw = document.getElementById("nav-switch");
  if (!sw) return;

  const btns = [...sw.querySelectorAll(".pill-switch__btn")];

  function setState(target, { scroll = true } = {}) {
    sw.dataset.state = target;

    // Cache les contenus recruteur quand on est en mode "créer un site" (entrepreneur)
    document.querySelectorAll("[data-recruteur]").forEach((el) => {
      el.hidden = target === "entrepreneur";
    });

    btns.forEach((b) => {
      const on = b.dataset.target === target;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });

    document.getElementById("recruteur")?.classList.toggle("show", target === "recruteur");
    document.getElementById("entrepreneur")?.classList.toggle("show", target === "entrepreneur");

    if (scroll) {
      document.getElementById(target)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  function toggle() {
    const current = sw.dataset.state || "recruteur";
    setState(current === "recruteur" ? "entrepreneur" : "recruteur");
  }

  sw.addEventListener("click", (e) => {
    e.preventDefault();
    toggle();
  });

  setState("recruteur", { scroll: false });
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

    // Priorité au message custom (pas de copie)
    if (customMsg) {
      showFeedback(customMsg);
      return;
    }

    // Sinon: copie + message "Copié!"
    try {
      await navigator.clipboard.writeText(textToCopy);
      showFeedback("Copié!");
    } catch (error) {
      console.error("Erreur copie :", error);
      showFeedback("Impossible de copier");
    }
  });
});