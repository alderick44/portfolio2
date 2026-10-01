// Étiquette qui suit le curseur au survol d'un média (.cursor-label).
// Le texte vient du .cursor-label__text placé dans le bloc : sans souris,
// c'est lui qui s'affiche en légende sous le média (voir style.css).

const labelledMedia = document.querySelectorAll(".cursor-label");
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");

if (labelledMedia.length) {
  const label = document.createElement("div");
  label.className = "cursor-label-bubble";
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

  labelledMedia.forEach((media) => {
    const text = media.querySelector(".cursor-label__text");
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
  });
}
