/* ============================================================
   SIDEBAR.JS — highlights current page and gates clicks
   when user is not logged in (auth gate).
   ============================================================ */
window.addEventListener("bv-shell-ready", () => {
  const current = document.body.dataset.page;
  document.querySelectorAll("[data-nav]").forEach(a => {
    if (a.dataset.nav === current) a.classList.add("active");
    a.addEventListener("click", function (e) {
      if (!window.BV_AUTH || !window.BV_AUTH.isLoggedIn()) {
        if (window.BV_AUTH) {
          window.BV_AUTH.guardClick(e);
        }
      }
    });
  });
});
