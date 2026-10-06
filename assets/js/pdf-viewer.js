//Principalement fait par IA

import * as pdfjsLib from "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.5.207/legacy/build/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.5.207/legacy/build/pdf.worker.min.mjs";

const container = document.getElementById("wabasso-pdf");
const pdfUrl = "assets/pdf/WABASSO-wireframe-desktop.pdf";

// --- Aperçu statique --- instantané
const previewWrapper = document.createElement("div");
previewWrapper.style.position = "relative";
previewWrapper.style.borderRadius = "0.5rem";
previewWrapper.style.overflow = "hidden";
previewWrapper.style.maxHeight = "70vh";

const previewImg = document.createElement("img");
previewImg.src = "assets/img/wabasso-preview.webp";
previewImg.classList.add("d-block", "rounded-4");
previewImg.style.width = "100%";

const fade = document.createElement("div");
fade.style.cssText = `
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 80px;
  background: linear-gradient(to bottom, transparent, var(--bs-body-bg, #111));
  pointer-events: none;
`;

const btn = document.getElementById('wabasso-btn')

previewWrapper.appendChild(previewImg);
previewWrapper.appendChild(fade);
container.appendChild(previewWrapper);
// container.appendChild(btn);


// --- Préchargement : on télécharge
// le PDF ET on le dessine sur un canvas hors écran. Au clic, il ne reste qu'à l'afficher. ---
let renderPromise = null;
const startLoading = () => {
  if (!renderPromise) {
    renderPromise = (async () => {
      const pdf = await pdfjsLib.getDocument({
        url: pdfUrl,
        disableRange: true,
        disableStream: true,
      }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.5 });

      const fullCanvas = document.createElement("canvas");
      fullCanvas.width = viewport.width;
      fullCanvas.height = viewport.height;
      fullCanvas.classList.add("d-block", "rounded-4", "mt-3");
      fullCanvas.style.width = "100%";

      await page.render({ canvasContext: fullCanvas.getContext("2d"), viewport }).promise;
      return fullCanvas;
    })();
    // Si ça échoue, on oublie la promesse pour pouvoir réessayer au clic
    renderPromise.catch(() => {
      renderPromise = null;
    });
  }
  return renderPromise;
};

// Dès que la page est chargée, on lance le tout quand le navigateur est inactif
const whenIdle = () =>
  "requestIdleCallback" in window
    ? requestIdleCallback(startLoading, { timeout: 3000 })
    : setTimeout(startLoading, 1000);

if (document.readyState === "complete") whenIdle();
else window.addEventListener("load", whenIdle, { once: true });

// --- Au clic : spinner (si le rendu n'est pas fini) puis affichage du canvas ---
btn.addEventListener("click", async () => {
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span>Chargement...`;

  let fullCanvas;
  try {
    fullCanvas = await startLoading();
  } catch (err) {
    console.error(err);
    const msg = document.createElement("p");
    msg.className = "small text-danger fs-6 fw-bold mb-2";
    msg.textContent = "Erreur, l'aperçu n'a pas pu s'afficher.";
    const link = document.createElement("a");
    link.className = "btn btn-primary";
    link.href = pdfUrl;
    link.download = "";
    link.textContent = "Télécharger le design";
    btn.replaceWith(msg, link);
    return;
  }

  previewWrapper.remove();
  btn.remove();
  container.appendChild(fullCanvas);
});
