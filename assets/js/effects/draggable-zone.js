// Éléments qu'on peut bouger (.draggable-zone) : la photo et les logos de technos.
//  - Souris : l'élément est attiré par le curseur quand il s'en approche.
//  - Tactile : on le pousse avec le doigt, il revient en place au relâchement.
//  - Photo (data-stick) : accrochée au bas de l'écran en descendant, puis reprend sa place.
// Réglages par élément : data-magnet (force), data-reach (distance de réaction en px), data-stick (part qui dépasse).
// Effet autonome : sans ce fichier, les éléments restent simplement fixes (voir style/effects.css).
(() => {
  const zones = document.querySelectorAll(".draggable-zone");
  if (!zones.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");

  // Le CSS ne bloque le défilement sur les logos que si ce script tourne
  document.documentElement.classList.add("has-draggable-zone");

  // Magnétisme (souris)
  if (canHover.matches && !reducedMotion) {
    const offsets = new Map(); // décalage actuel de chaque élément, pour retrouver sa vraie position
    let pointer = null;
    let frame = 0;

    function applyMagnet() {
      frame = 0;
      zones.forEach((zone) => {
        const current = offsets.get(zone) || { x: 0, y: 0 };
        let x = 0;
        let y = 0;

        if (pointer) {
          const rect = zone.getBoundingClientRect();
          const cx = rect.left - current.x + rect.width / 2;
          const cy = rect.top - current.y + rect.height / 2;
          const dx = pointer.x - cx;
          const dy = pointer.y - cy;
          const dist = Math.hypot(dx, dy);
          const strength = parseFloat(zone.dataset.magnet) || 0.5;
          const radius = Math.max(rect.width, rect.height) / 2 + (parseFloat(zone.dataset.reach) || 80);

          if (dist < radius) {
            const pull = strength * (1 - dist / radius);
            x = dx * pull;
            y = dy * pull;
          }
        }

        if (x !== current.x || y !== current.y) {
          offsets.set(zone, { x, y });
          zone.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
      });
    }

    function requestMagnet() {
      if (!frame) frame = requestAnimationFrame(applyMagnet);
    }

    document.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") return;
      pointer = { x: event.clientX, y: event.clientY };
      requestMagnet();
    });

    document.documentElement.addEventListener("mouseleave", () => {
      pointer = null;
      requestMagnet();
    });
  }

  // Glissement au doigt : mouvement élastique (plus on tire, plus ça résiste).
  // touch-action (CSS) laisse la photo défiler à la verticale ; les logos, petits, se poussent dans tous les sens.
  zones.forEach((zone) => {
    let start = null;
    let max = 0;

    zone.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse") return;
      start = { x: event.clientX, y: event.clientY };
      max = Math.max(zone.offsetWidth, zone.offsetHeight) * 0.3; // distance maximale du déplacement
      zone.classList.add("is-dragging");
      zone.setPointerCapture(event.pointerId);
    });

    zone.addEventListener("pointermove", (event) => {
      if (!start || event.pointerType === "mouse") return;
      const x = max * Math.tanh((event.clientX - start.x) / max);
      const y = max * Math.tanh((event.clientY - start.y) / max);
      zone.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });

    function release() {
      if (!start) return;
      start = null;
      zone.classList.remove("is-dragging");
      zone.style.transform = "translate3d(0, 0, 0)";
    }

    zone.addEventListener("pointerup", release);
    zone.addEventListener("pointercancel", release);
  });

  // Photo accrochée au bas de l'écran (mise en page empilée, téléphone et tablette) :
  // en descendant, seul le haut de la photo dépasse du bas de l'écran. Quand le bas de l'écran
  // arrive au texte, elle reprend sa place avec un effet élastique. Rien en remontant.
  // Utilise la propriété `translate`, séparée du `transform` du magnétisme et du glissement, donc ils se combinent.
  // La position naturelle vient du parent, qui lui ne bouge pas.
  const stickZone = document.querySelector(".draggable-zone[data-stick]");
  const stackedLayout = window.matchMedia("(max-width: 991.98px)");

  if (stickZone && !reducedMotion) {
    const anchor = stickZone.parentElement;
    const peekRatio = parseFloat(stickZone.dataset.stick) || 0.5;
    const elastic = "0.7s cubic-bezier(0.34, 1.56, 0.64, 1)";
    const soft = "0.3s ease-out";
    let transition = "";
    let lastY = window.scrollY;
    let goingDown = true;
    let frame = 0;

    function updateStick() {
      frame = 0;
      if (!stackedLayout.matches) {
        stickZone.style.translate = "";
        return;
      }

      // L'effet ne joue qu'en descendant : en remontant, la photo reste à sa place normale
      if (window.scrollY !== lastY) goingDown = window.scrollY > lastY;
      lastY = window.scrollY;

      const rect = anchor.getBoundingClientRect();
      const viewportBottom = window.innerHeight;
      const peekLine = viewportBottom - rect.height * peekRatio;
      const reachedText = viewportBottom >= rect.bottom; // le bas de l'écran touche le texte sous la photo
      const stuck = goingDown && !reachedText;
      const shift = stuck ? Math.max(0, peekLine - rect.top) : 0;

      // Relâchée en descendant : retour élastique. Sinon : suit le défilement avec un léger amorti.
      const next = goingDown && reachedText ? elastic : soft;
      if (next !== transition) {
        transition = next;
        stickZone.style.setProperty("--translate-transition", transition);
      }
      stickZone.style.translate = `0 ${shift}px`;
    }

    function requestStick() {
      if (!frame) frame = requestAnimationFrame(updateStick);
    }

    window.addEventListener("scroll", requestStick, { passive: true });
    window.addEventListener("resize", requestStick);
    updateStick();
  }
})();
