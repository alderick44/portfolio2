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
