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



const range = 800; // en pixels (plus petit = plus rapide)

window.addEventListener('scroll', () => {
  const progress = window.scrollY / range;
  const clamped = Math.min(1, Math.max(0, progress));
  const bw = 1 - clamped; // 1 en haut, 0 après "range" px

  document.body.style.setProperty('--bw', bw);
});



document.addEventListener("DOMContentLoaded", () => {
  const sw = document.getElementById("nav-switch");
  if (!sw) return;

  const btns = [...sw.querySelectorAll(".pill-switch__btn")];

  function setState(target, { scroll = true } = {}) {
    sw.dataset.state = target;

    btns.forEach((b) => {
      const on = b.dataset.target === target;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });

    document.getElementById("recruteur")?.classList.toggle("show", target === "recruteur");
    document.getElementById("entrepreneur")?.classList.toggle("show", target === "entrepreneur");

    if (scroll) {
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
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