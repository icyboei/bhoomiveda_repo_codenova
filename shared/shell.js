/* ============================================================
   SHELL.JS — Code that runs on every page.
   Responsibilities:
     1. Load reusable HTML partials (navbar, sidebar, AI button).
     2. Manage dark/light mode (toggled by the navbar button, persisted
        in localStorage so the choice survives reloads).
        DEFAULT: dark mode on first visit.
     3. Highlight the active sidebar link.
     4. Wire up the mobile menu open/close (sidebar drawer).
     5. Inject the global responsive overrides stylesheet.
   ============================================================ */

(function () {
  // --- Inject global responsive stylesheet ---------------------------
  // Resolved relative to the current page; works whether we're at
  // /index.html or /home/index.html etc.
  (function injectResponsiveCss() {
    try {
      // Find an existing shell.css <link> and reuse its directory so
      // we don't have to know the page depth.
      const shellLink = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        .find(l => /shared\/shell\.css(\?|$)/.test(l.getAttribute("href") || ""));
      const href = shellLink
        ? shellLink.getAttribute("href").replace(/shell\.css.*$/, "responsive.css")
        : "shared/responsive.css";
      if (document.querySelector('link[data-bv-responsive]')) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.setAttribute("data-bv-responsive", "1");
      document.head.appendChild(link);
    } catch (e) { /* non-fatal */ }
  })();

  // --- Theme helpers -------------------------------------------------
  // Default = dark on first visit (null → dark)
  function applyThemePref() {
    const saved = localStorage.getItem("bv-theme");
    const wantDark = saved === null ? true : saved === "dark";
    document.documentElement.classList.toggle("dark", wantDark);
    if (saved === null) localStorage.setItem("bv-theme", "dark");
  }
  applyThemePref();

  window.bvToggleDark = function () {
    const isDark = document.documentElement.classList.contains("dark");
    const newDark = !isDark;
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("bv-theme", newDark ? "dark" : "light");
    // Legacy key support
    localStorage.setItem("bv-dark", newDark ? "1" : "0");
    window.dispatchEvent(new CustomEvent("bv-theme-changed", { detail: { dark: newDark } }));
  };

  // --- Partial loader: replaces every <div data-include="path"> with HTML
  async function loadPartials() {
    const slots = document.querySelectorAll("[data-include]");
    await Promise.all(Array.from(slots).map(async (slot) => {
      try {
        const res = await fetch(slot.getAttribute("data-include"));
        slot.innerHTML = await res.text();
      } catch (err) {
        console.warn("Failed to load partial:", err);
      }
    }));
    // Re-render icons after partials are injected
    if (window.lucide) window.lucide.createIcons();
    // Wire mobile menu drawer (after partials are in the DOM)
    setupMobileDrawer();
    // Tell other scripts the shell is ready
    window.dispatchEvent(new Event("bv-shell-ready"));
  }

  // --- Mobile sidebar drawer ----------------------------------------
  function setupMobileDrawer() {
    const sidebarWrap = document.querySelector('[data-include$="sidebar/sidebar.html"]');
    if (!sidebarWrap) return;

    // The mobile header is the first sibling block flagged `md:hidden`.
    const mobileHeader = document.querySelector('.md\\:hidden');
    if (!mobileHeader) return;

    // The menu trigger is the first button containing a `menu` lucide icon.
    const menuBtn = mobileHeader.querySelector('button');
    if (!menuBtn || menuBtn.dataset.bvDrawerWired === "1") return;
    menuBtn.dataset.bvDrawerWired = "1";
    menuBtn.setAttribute("aria-label", "Toggle menu");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.classList.add("bv-menu-btn");

    // Ensure the mobile header stays above the drawer backdrop so the
    // hamburger remains clickable while the drawer is open.
    mobileHeader.classList.add("bv-mobile-header");

    let backdrop = null;
    let isOpen = false;

    function setIconState(open) {
      const icon = menuBtn.querySelector("[data-lucide]");
      if (icon) {
        icon.setAttribute("data-lucide", open ? "x" : "menu");
      }
      if (window.lucide) window.lucide.createIcons();
    }

    function openDrawer() {
      if (isOpen) return;
      isOpen = true;
      sidebarWrap.classList.add("bv-drawer-open");
      document.body.classList.add("bv-drawer-locked");
      menuBtn.setAttribute("aria-expanded", "true");
      if (!backdrop) {
        backdrop = document.createElement("div");
        backdrop.className = "bv-drawer-backdrop";
        backdrop.addEventListener("click", closeDrawer);
        document.body.appendChild(backdrop);
      }
      setIconState(true);
    }
    function closeDrawer() {
      if (!isOpen) return;
      isOpen = false;
      sidebarWrap.classList.remove("bv-drawer-open");
      document.body.classList.remove("bv-drawer-locked");
      menuBtn.setAttribute("aria-expanded", "false");
      if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
      backdrop = null;
      setIconState(false);
    }
    function toggleDrawer(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      if (isOpen) closeDrawer();
      else openDrawer();
    }

    menuBtn.addEventListener("click", toggleDrawer);

    // Close the drawer when the user picks a destination.
    sidebarWrap.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (link) closeDrawer();
    });

    // Close on viewport jump to desktop.
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) closeDrawer();
    });

    // Close on Escape.
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
    });
  }

  // Run after DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadPartials);
  } else {
    loadPartials();
  }
})();
