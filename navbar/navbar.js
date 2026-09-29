/* ============================================================
   NAVBAR.JS
     - Updates the page title shown in the top bar.
     - Wires dark/light mode toggle to the global shell helper.
     - Toggles notifications dropdown and fills it from data.js.
     - Renders auth controls (login/signup OR profile/logout)
       based on BV_AUTH state.
   ============================================================ */
window.addEventListener("bv-shell-ready", () => {
  const titleEl = document.getElementById("bv-page-title");
  if (titleEl) {
    const key = document.body.dataset.pageTitleKey;
    if (key && window.BV_I18N) {
      titleEl.textContent = window.BV_I18N.t(key);
    } else if (document.body.dataset.pageTitle) {
      titleEl.textContent = document.body.dataset.pageTitle;
    }
  }

  const darkBtn = document.getElementById("bv-dark-toggle");
  if (darkBtn) darkBtn.addEventListener("click", () => window.bvToggleDark());

  // ---------------- Auth controls (login/signup vs profile/logout) ----------------
  const authWrap = document.getElementById("bv-auth-controls");
  const notifWrap = document.getElementById("bv-notif-wrap");

  function base() {
    const page = document.body.dataset.page;
    return (!page || page === "home-public") ? "" : "../";
  }

  function renderAuthControls() {
    if (!authWrap) return;
    const I = window.BV_I18N;
    const t = (k) => (I ? I.t(k) : k);
    const isIn = window.BV_AUTH && window.BV_AUTH.isLoggedIn();
    const user = (window.BV_AUTH && window.BV_AUTH.getUser()) || null;
    if (isIn) {
      const initials = (user.name || "K").trim().charAt(0).toUpperCase();
      const photoBg = user.photo ? `background-image:url('${user.photo}');background-size:cover;background-position:center;` : "";
      const displayName = I ? I.tName(user.name) : user.name;
      authWrap.innerHTML = `
        <div class="relative" id="bv-profile-wrap">
          <button id="bv-profile-btn"
                  style="${photoBg}"
                  class="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-green-700 transition-colors overflow-hidden"
                  title="${displayName}">
            ${user.photo ? "" : initials}
          </button>
          <div id="bv-profile-menu"
               class="hidden absolute right-0 top-11 w-52 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <div class="text-sm font-bold text-gray-900 dark:text-white truncate">${displayName}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 truncate">${user.mobile || ""}</div>
            </div>
            <a href="${base()}profile/index.html"
               class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
              <i data-lucide="user" style="width:14px;height:14px"></i>
              <span>${t("profile")}</span>
            </a>
            <button id="bv-logout-btn"
                    class="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-700">
              <i data-lucide="log-out" style="width:14px;height:14px"></i>
              <span>${t("logout")}</span>
            </button>
          </div>
        </div>
      `;
      if (notifWrap) notifWrap.classList.remove("hidden");

      const pBtn = document.getElementById("bv-profile-btn");
      const pMenu = document.getElementById("bv-profile-menu");
      pBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        pMenu.classList.toggle("hidden");
      });
      document.addEventListener("click", (e) => {
        if (!pMenu.contains(e.target) && !pBtn.contains(e.target)) pMenu.classList.add("hidden");
      });
      document.getElementById("bv-logout-btn").addEventListener("click", () => {
        window.BV_AUTH.logout();
      });
    } else {
      authWrap.innerHTML = `
        <a href="${base()}auth/auth.html"
           class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-green-700 border border-green-700 hover:bg-green-50 dark:text-green-300 dark:border-green-300 dark:hover:bg-green-900/30 transition-colors">
          ${t("login")}
        </a>
        <a href="${base()}auth/auth.html"
           class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white bg-green-700 hover:bg-green-800 shadow-sm transition-colors">
          ${t("signup")}
        </a>
      `;
      if (notifWrap) notifWrap.classList.add("hidden");
    }
    if (window.lucide) window.lucide.createIcons();
  }

  renderAuthControls();
  window.addEventListener("bv-auth-changed", renderAuthControls);
  window.addEventListener("bv-language-changed", renderAuthControls);

  // ---------------- Notifications dropdown ----------------
  const btn   = document.getElementById("bv-notif-btn");
  const panel = document.getElementById("bv-notif-panel");
  const list  = document.getElementById("bv-notif-list");
  if (!btn || !panel || !list) return;

  const bgByType = {
    warning: "bg-yellow-50 dark:bg-transparent",
    success: "bg-green-50 dark:bg-transparent",
    info:    "bg-blue-50 dark:bg-transparent",
    ai:      "bg-purple-50 dark:bg-transparent"
  };
  const dotByType = {
    warning: "bg-yellow-400",
    success: "bg-green-500",
    info:    "bg-blue-400",
    ai:      "bg-purple-400"
  };

  const agoLabel = (window.BV_I18N && window.BV_I18N.t("ago")) || "ago";
  const I_nav = window.BV_I18N;
  if (window.BV_DATA && Array.isArray(window.BV_DATA.notifications)) {
    list.innerHTML = window.BV_DATA.notifications.map(n => `
      <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700 ${bgByType[n.type]} hover:brightness-95 dark:hover:bg-gray-700 transition-colors cursor-pointer last:border-0">
        <div class="flex items-start gap-2">
          <div class="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dotByType[n.type]}"></div>
          <div>
            <div class="text-sm font-semibold text-gray-900 dark:text-white">${I_nav ? I_nav.tr(n.title) : n.title}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">${I_nav ? I_nav.tr(n.desc) : n.desc}</div>
            <div class="text-xs text-gray-400 mt-1">${n.time} ${agoLabel}</div>
          </div>
        </div>
      </div>
    `).join("");
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    panel.classList.toggle("hidden");
  });
  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && !btn.contains(e.target)) panel.classList.add("hidden");
  });
});
