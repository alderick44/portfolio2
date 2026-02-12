const profilePictureZone = document.getElementById('profile-picture-zone');
function setProfileOffset(x, y) {
  profilePictureZone.style.transform = `translate3d(${x}px, ${y}px, 0)`;
}
profilePictureZone.addEventListener('mousemove', (event) => {
  const rect = profilePictureZone.getBoundingClientRect();
  const mx = event.clientX - rect.left;
  const my = event.clientY - rect.top;
  const dx = (mx - rect.width / 2) / (rect.width / 2);
  const dy = (my - rect.height / 2) / (rect.height / 2);
  const amp = -25;
  setProfileOffset(dx * amp, dy * amp);
});
profilePictureZone.addEventListener('mouseleave', () => setProfileOffset(0, 0));



const range = 800; // en pixels (plus petit = plus rapide)

window.addEventListener('scroll', () => {
  const progress = window.scrollY / range;
  const clamped = Math.min(1, Math.max(0, progress));
  const bw = 1 - clamped; // 1 en haut, 0 après "range" px

  document.body.style.setProperty('--bw', bw);
});




const sw = document.getElementById("audienceSwitch");
const btns = sw.querySelectorAll(".pill-switch__btn");

function setAudience(target){
  sw.dataset.state = target;
  btns.forEach(b=>{
    const active = b.dataset.target === target;
    b.classList.toggle("is-active", active);
    b.setAttribute("aria-selected", String(active));
  });

  document.getElementById("recruteur").classList.toggle("show", target === "recruteur");
  document.getElementById("entrepreneur").classList.toggle("show", target === "entrepreneur");
}

btns.forEach(b => b.addEventListener("click", () => setAudience(b.dataset.target)));
setAudience("recruteur");
