/* ============================================================
   SCHEMES.JS — category filter + search + render scheme cards.
   Uses BV_I18N.tr() for English data values (names, ministry,
   descriptions, benefits, deadlines) and BV_I18N.t() for fixed
   UI labels and category names.
   ============================================================ */
window.addEventListener("bv-shell-ready", () => {
  const D = window.BV_DATA;
  const I = window.BV_I18N;
  const tr = (x) => I.tr(x);
  const t  = (k) => I.t(k);

  // Categories: keep English value as the canonical key used for
  // filtering against data.js; only the label shown is translated.
  const cats = [
    { key: "All",            labelKey: "catAll" },
    { key: "Financial Aid",  labelKey: "catFinancial" },
    { key: "Insurance",      labelKey: "catInsurance" },
    { key: "Advisory",       labelKey: "catAdvisory" },
    { key: "Infrastructure", labelKey: "catInfrastructure" },
  ];
  let selected = "All";
  let query = "";

  const catsEl = document.getElementById("bv-cats");
  const listEl = document.getElementById("bv-schemes");
  const searchEl = document.getElementById("bv-search");

  function renderCats() {
    catsEl.innerHTML = cats.map(c =>
      `<button class="bv-cat ${c.key === selected ? "active" : ""}" data-cat="${c.key}">${t(c.labelKey)}</button>`
    ).join("");
  }

  function renderList() {
    const filtered = D.schemes.filter(s =>
      (selected === "All" || s.category === selected) &&
      (s.name.toLowerCase().includes(query.toLowerCase()) ||
       tr(s.name).toLowerCase().includes(query.toLowerCase()))
    );
    listEl.innerHTML = filtered.map(s => `
      <div class="bv-scheme bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <h3 class="font-bold text-gray-900 dark:text-white">${tr(s.name)}</h3>
              ${s.eligible
                ? `<span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"><i data-lucide="check-circle" style="width:10px;height:10px"></i>${t("eligible")}</span>`
                : `<span class="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"><i data-lucide="alert-triangle" style="width:10px;height:10px"></i>${t("notEligible")}</span>`}
              ${s.applied ? `<span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">${t("appliedTag")}</span>` : ""}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">${tr(s.ministry)}</div>
          </div>
          <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">${t("cat" + (s.category === "Financial Aid" ? "Financial" : s.category))}</span>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">${tr(s.description)}</p>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div>
              <div class="text-xs text-gray-500 dark:text-gray-400">${t("benefit")}</div>
              <div class="text-sm font-bold text-green-600">${tr(s.benefit)}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500 dark:text-gray-400">${t("deadline")}</div>
              <div class="text-sm font-bold flex items-center gap-1 ${s.deadline === "Ongoing" ? "text-blue-600" : "text-orange-500"}">
                <i data-lucide="clock" style="width:12px;height:12px"></i>${tr(s.deadline)}
              </div>
            </div>
          </div>
          <button ${(!s.eligible || s.applied) ? "disabled" : ""}
            class="px-4 py-2 rounded-xl text-sm font-bold transition-colors ${s.applied ? "bg-blue-100 text-blue-700 cursor-default" : s.eligible ? "bg-green-600 text-white hover:bg-green-700 shadow-sm" : "bg-gray-100 text-gray-400 cursor-not-allowed"}">
            ${s.applied ? t("appliedTag") : s.eligible ? t("applyNow") : t("notEligible")}
          </button>
        </div>
      </div>
    `).join("") || `<p class="text-sm text-gray-500 col-span-full">${t("noSchemes")}</p>`;
    window.lucide && window.lucide.createIcons();
  }

  catsEl.addEventListener("click", e => {
    const b = e.target.closest("[data-cat]");
    if (!b) return;
    selected = b.dataset.cat;
    renderCats(); renderList();
  });
  searchEl.addEventListener("input", e => { query = e.target.value; renderList(); });

  renderCats(); renderList();
});
