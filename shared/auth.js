/* ============================================================
   AUTH.JS — Central authentication + profile utility.
   - Stores currently logged-in user in localStorage (bv-auth-user).
   - Stores per-user profile data in localStorage keyed by mobile
     number (bv-profile-<mobile>) so each user sees their own data
     across sessions, refreshes and logout/login cycles.
   - Provides guard for protected pages.
   ============================================================ */
(function () {
  const USER_KEY = "bv-auth-user";
  const REDIRECT_KEY = "bv-auth-redirect";
  const PROFILE_PREFIX = "bv-profile-";

  function safeParse(raw, fallback) {
    try { return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
  }

  function getUser() {
    return safeParse(localStorage.getItem(USER_KEY), null);
  }

  function isLoggedIn() {
    const u = getUser();
    return !!(u && u.name);
  }

  function profileKey(mobile) {
    return PROFILE_PREFIX + String(mobile || "").trim();
  }

  function getProfile(mobile) {
    const key = profileKey(mobile || (getUser() && getUser().mobile));
    return safeParse(localStorage.getItem(key), null);
  }

  function saveProfile(profile) {
    if (!profile || !profile.mobile) return;
    localStorage.setItem(profileKey(profile.mobile), JSON.stringify(profile));
  }

  function login(user) {
    const mobile = (user && user.mobile) ? String(user.mobile).trim() : "";
    const incomingName = (user && user.name) ? String(user.name).trim() : "";
    const role = (user && user.role) ? user.role : "farmer";

    // Restore previously saved profile for this mobile, if any.
    let profile = mobile ? getProfile(mobile) : null;

    if (!profile) {
      profile = {
        name: incomingName || "Kisan",
        mobile: mobile,
        role: role,
        email: "",
        village: "",
        district: "",
        state: "",
        landSize: "",
        farmerSince: "",
        points: 0,
        photo: "",
        createdAt: Date.now()
      };
    } else if (incomingName && !profile.name) {
      profile.name = incomingName;
    }

    profile.loggedInAt = Date.now();
    saveProfile(profile);
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent("bv-auth-changed", { detail: profile }));
    return profile;
  }

  function updateProfile(patch) {
    const current = getUser();
    if (!current) return null;
    const next = Object.assign({}, current, patch || {});
    saveProfile(next);
    localStorage.setItem(USER_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("bv-auth-changed", { detail: next }));
    return next;
  }

  function logout() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(REDIRECT_KEY);
    window.dispatchEvent(new CustomEvent("bv-auth-changed", { detail: null }));
    window.location.href = computeBase() + "index.html";
  }

  function computeBase() {
    const page = document.body && document.body.dataset.page;
    if (!page || page === "home-public") return "";
    return "../";
  }

  function authPath()      { return computeBase() + "auth/auth.html"; }
  function dashboardPath() { return computeBase() + "home/index.html"; }

  function saveIntended(url) {
    try { localStorage.setItem(REDIRECT_KEY, url); } catch (e) {}
  }
  function popIntended() {
    try {
      const v = localStorage.getItem(REDIRECT_KEY);
      localStorage.removeItem(REDIRECT_KEY);
      return v;
    } catch (e) { return null; }
  }

  function requireAuth(opts) {
    if (isLoggedIn()) return true;
    saveIntended(window.location.href);
    if (!(opts && opts.silent)) { try { alert("Please login to continue."); } catch (e) {} }
    window.location.href = authPath();
    return false;
  }

  function guardClick(e) {
    if (isLoggedIn()) return true;
    e.preventDefault(); e.stopPropagation();
    const el = e.currentTarget;
    if (el && el.href) saveIntended(el.href);
    try { alert("Please login to continue."); } catch (err) {}
    window.location.href = authPath();
    return false;
  }

  function runPageGuard() {
    const body = document.body;
    if (!body) return;
    if (body.dataset.protected === "true" && !isLoggedIn()) {
      saveIntended(window.location.href);
      try { alert("Please login to continue."); } catch (e) {}
      window.location.replace(authPath());
    }
  }

  function redirectAfterLogin() {
    const intended = popIntended();
    window.location.href = intended || dashboardPath();
  }

  if (document.body) runPageGuard();
  else document.addEventListener("DOMContentLoaded", runPageGuard);

  window.BV_AUTH = {
    getUser, isLoggedIn, login, logout, updateProfile, getProfile,
    requireAuth, guardClick, saveIntended, popIntended,
    redirectAfterLogin, authPath, dashboardPath
  };
})();
