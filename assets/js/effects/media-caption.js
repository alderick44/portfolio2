// Légende sur un média (.media-caption).
// Le texte vient du .media-caption__text placé dans le bloc.
//  - Souris : une bulle suit le curseur au survol.
//  - Tactile : un toucher affiche la légende dans l'image, un autre toucher ailleurs la referme.
// Effet autonome : sans ce fichier, la légende reste visible sous le média (voir style/effects.css).
(() => {
  const labelledMedia = document.querySelectorAll(".media-caption");
  if (!labelledMedia.length) return;

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");

  // Le CSS ne cache les légendes que si ce script tourne
  document.documentElement.classList.add("has-media-caption");

  const label = document.createElement("div");
  label.className = "media-caption-bubble";
  label.setAttribute("aria-hidden", "true");
  document.body.appendChild(label);

  function moveLabel(event) {
    const gap = 16;
    const edge = 8;
    let x = event.clientX + gap;
    let y = event.clientY + gap;

    /* Bascule de l'autre côté du curseur près des bords de l'écran */
    if (x + label.offsetWidth > window.innerWidth - edge) {
      x = event.clientX - label.offsetWidth - gap;
    }
    if (y + label.offsetHeight > window.innerHeight - edge) {
      y = event.clientY - label.offsetHeight - gap;
    }

    label.style.transform = `translate3d(${Math.max(edge, x)}px, ${Math.max(edge, y)}px, 0)`;
  }

  function closeCaptions(except) {
    labelledMedia.forEach((media) => {
      if (media !== except) media.classList.remove("is-caption-open");
    });
  }

  labelledMedia.forEach((media) => {
    const text = media.querySelector(".media-caption__text");
    if (!text) return;

    media.addEventListener("mouseenter", (event) => {
      if (!canHover.matches || text.hidden) return;
      label.textContent = text.textContent.trim();
      moveLabel(event);
      label.classList.add("is-visible");
    });

    media.addEventListener("mousemove", (event) => {
      if (label.classList.contains("is-visible")) moveLabel(event);
    });

    media.addEventListener("mouseleave", () => {
      label.classList.remove("is-visible");
    });

    // Si le média contient un lien, le premier toucher affiche seulement la légende
    media.addEventListener("click", (event) => {
      if (canHover.matches) return;
      const wasOpen = media.classList.contains("is-caption-open");
      closeCaptions(media);
      media.classList.add("is-caption-open");
      if (!wasOpen && event.target.closest("a")) event.preventDefault();
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".media-caption")) closeCaptions(null);
  });
})();
