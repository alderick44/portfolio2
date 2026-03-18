//Principalement fait par IA

import * as pdfjsLib from "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.5.207/build/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@5.5.207/build/pdf.worker.min.mjs";

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

// --- Au clic : spinner + render PDF complet ---
btn.addEventListener("click", async () => {
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span>Chargement...`;

  const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 0.5 });

  const fullCanvas = document.createElement("canvas");
  fullCanvas.width = viewport.width;
  fullCanvas.height = viewport.height;
  fullCanvas.classList.add("d-block", "rounded-4", "mt-3");
  fullCanvas.style.width = "100%";

  await page.render({ canvasContext: fullCanvas.getContext("2d"), viewport }).promise;

  previewWrapper.remove();
  btn.remove();
  container.appendChild(fullCanvas);
});
