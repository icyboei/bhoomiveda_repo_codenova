/* ============================================================
   PROFILE.JS — Renders the currently authenticated user's profile.
   All hero values, personal details and avatar are loaded from
   BV_AUTH (localStorage). No hardcoded user data.
   Supports profile photo upload (JPG/JPEG/PNG/WEBP) persisted as
   a data URL on the user's profile record.
   ============================================================ */
window.addEventListener("bv-shell-ready", () => {
  const D = window.BV_DATA;
  const A = window.BV_AUTH;
  if (!A) return;

  const $ = (id) => document.getElementById(id);

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  function initials(name) {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "K";
    return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
  }

  const I = window.BV_I18N;
  const t = (k) => (I ? I.t(k) : k);
  const tName = (n) => (I ? I.tName(n) : n);
  const tVal = (v) => (I ? I.tValue(v) : v);
  const NA = () => (I ? I.naLabel() : "Not Available");

  function fmtLocation(u) {
    const parts = [u.village, u.district, u.state].filter(Boolean).map(tVal);
    return parts.length ? parts.join(", ") : NA();
  }
  function fmtLand(u) {
    return u.landSize ? `${u.landSize}` : NA();
  }
  function fmtSince(u) {
    return u.farmerSince ? `${t("farmerSinceLbl")} ${u.farmerSince}` : NA();
  }

  function render() {
    const u = A.getUser() || {};
    const displayName = u.name ? tName(u.name) : (I && I.lang === "hi" ? "किसान" : "Kisan");
    $("bv-fullname").textContent = displayName;
    $("bv-location").textContent = fmtLocation(u);
    $("bv-landsize").textContent = fmtLand(u);
    $("bv-since").textContent    = fmtSince(u);
    $("bv-points").textContent   = Number(u.points || 0).toLocaleString();
    $("bv-avatar-initials").textContent = initials(u.name);

    const img = $("bv-avatar-img");
    if (u.photo) {
      img.src = u.photo;
      img.classList.remove("hidden");
      $("bv-avatar-initials").classList.add("opacity-0");
    } else {
      img.classList.add("hidden");
      img.removeAttribute("src");
      $("bv-avatar-initials").classList.remove("opacity-0");
    }

    const rows = [
      { label: t("fullName"),       value: u.name ? tName(u.name) : "" },
      { label: t("mobileNumber"),   value: u.mobile },
      { label: t("email"),          value: u.email },
      { label: t("villageLbl"),     value: tVal(u.village) },
      { label: t("districtLbl"),    value: tVal(u.district) },
      { label: t("stateLbl"),       value: tVal(u.state) },
      { label: t("landSize"),       value: u.landSize },
      { label: t("farmerSinceLbl"), value: u.farmerSince },
      { label: t("rewardPoints"),   value: u.points ? String(u.points) : "" },
    ];
    $("bv-farm").innerHTML = rows.map(r => `
      <div class="flex justify-between gap-3">
        <span class="text-sm text-gray-500 dark:text-gray-400">${escapeHtml(r.label)}</span>
        <span class="text-sm font-semibold text-gray-900 dark:text-white text-right truncate">${escapeHtml(r.value || NA())}</span>
      </div>
    `).join("");

    window.lucide && window.lucide.createIcons();
  }

  // Productivity stats (static demo metrics, no user identity)
  const stats = [
    { v: "28%",   key: "yieldIncrease", c: "text-green-600" },
    { v: "₹2.8L", key: "annualRevenue", c: "text-blue-600" },
    { v: "18%",   key: "waterSavings",  c: "text-cyan-600" },
    { v: "94%",   key: "aiAccuracy",    c: "text-purple-600" },
  ];
  $("bv-stats").innerHTML = stats.map(s => `
    <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center">
      <div class="text-xl font-black ${s.c}">${s.v}</div>
      <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">${t(s.key)}</div>
    </div>
  `).join("");

  const badges = [
    { icon: "award",       color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30",   nameKey: "badgeTopFarmer",  descKey: "badgeTopFarmerDesc" },
    { icon: "sprout",      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30", nameKey: "badgeHarvest",    descKey: "badgeHarvestDesc" },
    { icon: "droplets",    color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",     nameKey: "badgeWater",      descKey: "badgeWaterDesc" },
    { icon: "sparkles",    color: "text-purple-500 bg-purple-50 dark:bg-purple-950/30", nameKey: "badgeAI",         descKey: "badgeAIDesc" },
    { icon: "users",       color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30", nameKey: "badgeCommunity",  descKey: "badgeCommunityDesc" },
    { icon: "bar-chart-2", color: "text-teal-500 bg-teal-50 dark:bg-teal-950/30",     nameKey: "badgeData",       descKey: "badgeDataDesc" },
  ];
  $("bv-badges").innerHTML = badges.map(b => `
    <div class="bv-badge bg-slate-50 dark:bg-slate-800/80 rounded-xl p-3 text-center cursor-pointer group border border-slate-200/80 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 transition-all">
      <div class="w-10 h-10 mx-auto rounded-lg ${b.color} flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
        <i data-lucide="${b.icon}" class="w-5 h-5"></i>
      </div>
      <div class="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">${t(b.nameKey)}</div>
      <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">${t(b.descKey)}</div>
    </div>
  `).join("");
  window.lucide && window.lucide.createIcons();

  if (D && window.Chart) {
    new Chart($("bv-profile-chart"), {
      type: "line",
      data: {
        labels: D.marketData.map(m => m.month),
        datasets: [{ data: D.marketData.map(m => m.wheat), borderColor: "#2E7D32", borderWidth: 2, pointRadius: 0, tension: .35 }],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false } } },
    });
  }

  render();
  window.addEventListener("bv-auth-changed", render);
  window.addEventListener("bv-language-changed", render);

  /* —— Photo upload —— */
  const ACCEPTED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const photoBtn   = $("bv-photo-btn");
  const photoInput = $("bv-photo-input");
  photoBtn.addEventListener("click", () => photoInput.click());
  photoInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      alert(I && I.lang === "hi" ? "कृपया JPG, PNG या WEBP छवि चुनें।" : "Please choose a JPG, PNG or WEBP image.");
      photoInput.value = "";
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      alert(I && I.lang === "hi" ? "छवि बहुत बड़ी है। कृपया 3 MB से छोटी फ़ाइल चुनें।" : "Image is too large. Please choose a file under 3 MB.");
      photoInput.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      A.updateProfile({ photo: String(reader.result) });
    };
    reader.readAsDataURL(file);
    photoInput.value = "";
  });

  /* —— Edit profile modal —— */
  const FIELDS = [
    { key: "name",        labelKey: "fullName",       type: "text" },
    { key: "email",       labelKey: "email",          type: "email" },
    { key: "village",     labelKey: "villageLbl",     type: "text" },
    { key: "district",    labelKey: "districtLbl",    type: "text" },
    { key: "state",       labelKey: "stateLbl",       type: "text" },
    { key: "landSize",    labelKey: "landSizeAcres",  type: "text" },
    { key: "farmerSince", labelKey: "farmerSinceLbl", type: "number" },
    { key: "points",      labelKey: "rewardPoints",   type: "number" },
  ];

  const modal = $("bv-edit-modal");
  const fieldsEl = $("bv-edit-fields");
  const open  = () => {
    const u = A.getUser() || {};
    fieldsEl.innerHTML = FIELDS.map(f => `
      <div>
        <label class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">${escapeHtml(t(f.labelKey))}</label>
        <input data-key="${f.key}" type="${f.type}" value="${escapeHtml(u[f.key] != null ? u[f.key] : "")}"
          class="w-full rounded-xl border px-4 py-2.5 text-sm outline-none bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-green-500 transition-colors" />
      </div>
    `).join("");
    modal.classList.remove("hidden");
  };
  const close = () => modal.classList.add("hidden");

  $("bv-edit-open").addEventListener("click", open);
  $("bv-edit-close").addEventListener("click", close);
  $("bv-edit-cancel").addEventListener("click", close);
  $("bv-edit-save").addEventListener("click", () => {
    const patch = {};
    fieldsEl.querySelectorAll("input[data-key]").forEach(inp => {
      const k = inp.dataset.key;
      let v = inp.value.trim();
      if (k === "points" || k === "farmerSince") v = v ? Number(v) : "";
      patch[k] = v;
    });
    if (!patch.name) { alert(I && I.lang === "hi" ? "नाम आवश्यक है।" : "Name is required."); return; }
    A.updateProfile(patch);
    close();
  });
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
});
