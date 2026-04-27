// ── Sheet drag-to-dismiss ──
const Sheet = (() => {

  const modalEl  = document.getElementById('addCourseModal');
  const backdrop = document.getElementById('modalBackdrop');

  let startY     = 0;
  let currentY   = 0;
  let dragging   = false;
  let scrollTop  = 0;

  function init() {
    modalEl.addEventListener('touchstart', onTouchStart, { passive: true });
    modalEl.addEventListener('touchmove',  onTouchMove,  { passive: false });
    modalEl.addEventListener('touchend',   onTouchEnd,   { passive: true });
  }

  function onTouchStart(e) {
    startY    = e.touches[0].clientY;
    currentY  = e.touches[0].clientY;
    scrollTop = modalEl.scrollTop;
    dragging  = false;
    modalEl.style.transition = 'none';
  }

  function onTouchMove(e) {
    currentY       = e.touches[0].clientY;
    const delta    = currentY - startY;
    const scrolled = scrollTop > 0;

    // Only drag sheet if at top of scroll and moving downward
    if (!scrolled && delta > 0) {
      dragging = true;
    }

    if (!dragging) return;

    e.preventDefault(); // stop page scroll while dragging sheet
    const clamped = Math.max(0, delta);
    modalEl.style.transform = `translateY(${clamped}px)`;
    const progress = Math.min(clamped / 300, 1);
    backdrop.style.opacity = 1 - progress * 0.5;
  }

  function onTouchEnd() {
    modalEl.style.transition = '';

    if (!dragging) return;
    dragging = false;

    const delta = currentY - startY;

    if (delta > 120) {
      modalEl.style.transform = `translateY(100%)`;
      backdrop.style.opacity  = '0';
      setTimeout(() => {
        UI.closeModal();
        modalEl.style.transform = '';
        backdrop.style.opacity  = '';
      }, 280);
    } else {
      // Spring back
      modalEl.style.transform = '';
      backdrop.style.opacity  = '';
    }
  }

  return { init };
})();