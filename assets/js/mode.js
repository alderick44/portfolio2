// Mode du site (recruteur / entrepreneur) : lien présélectionné, session et contenu qui en dépend
// Chargé avant pill-switch.js, qui s'occupe seulement de l'interface de la pilule.

(() => {
  const MODES = ["recruteur", "entrepreneur"];
  const STORAGE_KEY = "pour";
  /* ?pour=site (entrepreneur) ou ?pour=recruteur */
  const fromParam = { site: "entrepreneur", recruteur: "recruteur" };

  function readSession() {
    try {
      return sessionStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function saveSession(mode) {
    try {
      sessionStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* stockage indisponible (navigation privée, etc.) : on ignore */
    }
  }

  /* Le lien l'emporte sur le choix gardé en session, qui l'emporte sur le défaut */
  function initialMode() {
    const param = fromParam[new URLSearchParams(location.search).get("pour")];
    const saved = readSession();
    return param || (MODES.includes(saved) ? saved : "recruteur");
  }

  let current = initialMode();

  function apply() {
    document.documentElement.dataset.mode = current;
    document.querySelectorAll("[data-recruteur]").forEach((el) => {
      el.hidden = current === "entrepreneur";
    });
  }

  function set(mode) {
    if (!MODES.includes(mode)) return;
    current = mode;
    saveSession(mode);
    apply();
  }

  apply();
  saveSession(current);

  window.siteMode = { get: () => current, set };
})();
