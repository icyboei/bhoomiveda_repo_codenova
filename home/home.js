// Language switching is fully handled by shared/language.js
// (auto-wires every <select class="bv-lang-switcher"> and applies
//  data-i18n attributes across the page).

window.addEventListener("bv-shell-ready", () => {
  const currentLang = (window.BV_I18N && window.BV_I18N.lang) || localStorage.getItem("bv-language") || "hi";
  const D = window.BV_DATA;

  if (!D) return;

  const T = (k) => (window.BV_I18N ? window.BV_I18N.t(k) : k);
  const tr = (x) => (window.BV_I18N ? window.BV_I18N.tr(x) : x);

  const welcomeHeadingEl = document.getElementById("bv-welcome-heading");
  if (welcomeHeadingEl) {
    const user = window.BV_AUTH && window.BV_AUTH.getUser();
    const rawName = (user && user.name) ? user.name : "Kisan";
    const I = window.BV_I18N;
    const greet = I ? I.t("welcome") : "Welcome";
    const displayName = I ? I.tName(rawName) : rawName;
    welcomeHeadingEl.textContent = greet + " " + displayName;
  }

  const isDarkMode = () => document.documentElement.classList.contains("dark");

  const stats = [
    {
      icon: "sprout",
      label: T("activeCrops"),
      value: currentLang === "hi" ? "3 फसलें" : "3 Active Crops",
      sub: currentLang === "hi" ? "12 एकड़ कुल क्षेत्र" : "12 Acres Total Area",
      trend: 12,
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.12)"
    },
    {
      icon: "shield-check",
      label: T("soilScore"),
      value: "78 / 100",
      sub: currentLang === "hi" ? "इष्टतम एनपीके स्तर" : "Optimal NPK Balance",
      trend: 5,
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, 0.12)"
    },
    {
      icon: "trending-up",
      label: currentLang === "hi" ? "अनुमानित उपज" : "Est. Season Yield",
      value: currentLang === "hi" ? "142 कुंतल" : "142 Quintals",
      sub: currentLang === "hi" ? "खरीफ फसल लक्ष्य" : "Kharif Harvest Target",
      trend: 18,
      color: "#06b6d4",
      bgColor: "rgba(6, 182, 212, 0.12)"
    },
    {
      icon: "bar-chart-3",
      label: currentLang === "hi" ? "बाजार सूचकांक" : "Market Advantage",
      value: "₹2,450 / Qt",
      sub: currentLang === "hi" ? "उच्च बाजार मांग" : "High Demand Surge",
      trend: 8,
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, 0.12)"
    }
  ];

  const statRowEl = document.getElementById("bv-stat-row");
  if (statRowEl) {
    statRowEl.innerHTML = stats.map(s => `
      <div class="bv-stat-card bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-default">
        <div class="flex items-center justify-between mb-3">
          <div class="p-2.5 rounded-lg flex items-center justify-center" style="background:${s.bgColor}">
            <i data-lucide="${s.icon}" style="color:${s.color};width:18px;height:18px"></i>
          </div>

          <div class="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
            s.trend >= 0
              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40"
              : "bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-800/40"
          }">
            <i data-lucide="${
              s.trend >= 0
                ? "trending-up"
                : "trending-down"
            }" style="width:12px;height:12px"></i>
            +${Math.abs(s.trend)}%
          </div>
        </div>

        <div class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-0.5">
          ${s.value}
        </div>

        <div class="text-xs font-semibold text-slate-700 dark:text-slate-300">
          ${s.label}
        </div>

        <div class="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1 truncate">
          ${s.sub}
        </div>
      </div>
    `).join("");
  }

  const soilBarsEl = document.getElementById("bv-soil-bars");
  if (soilBarsEl && D.soilData) {
    soilBarsEl.innerHTML = D.soilData.map(item => `
      <div>
        <div class="flex justify-between text-xs font-semibold mb-1.5">
          <span class="text-slate-600 dark:text-slate-400">
            ${tr(item.name)}
          </span>

          <span class="text-slate-900 dark:text-white font-bold">
            ${item.value}%
          </span>
        </div>

        <div class="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full bv-bar-fill transition-all"
            style="width:${item.value}%;background:${item.color}">
          </div>
        </div>
      </div>
    `).join("");
  }

  const riskColor = {
    Low: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/60 dark:border-emerald-800/40",
    Medium: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200/60 dark:border-amber-800/40",
    High: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 border-red-200/60 dark:border-red-800/40"
  };

  const cropPicksEl = document.getElementById("bv-crop-picks");
  if (cropPicksEl && D.cropRecommendations) {
    cropPicksEl.innerHTML = D.cropRecommendations.map(crop => {
      const cropIconName = crop.icon === "wheat" ? "wheat" : "sprout";
      return `
      <div class="bv-pick-card bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all">

        <div class="flex items-center gap-3 mb-3">

          <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
            <i data-lucide="${cropIconName}" style="width:20px;height:20px"></i>
          </div>

          <div class="min-w-0 flex-1">
            <div class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5 truncate">

              ${tr(crop.crop)}

              ${
                crop.hybrid
                  ? `
                    <span class="text-[10px] bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40 px-1.5 py-0.2 rounded font-semibold">
                      ${T("hybrid")}
                    </span>
                  `
                  : ""
              }

            </div>

            <div class="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
              ₹${crop.profit.toLocaleString()} / acre
            </div>
          </div>

          <div class="ml-auto text-right flex-shrink-0">

            <div class="text-base font-extrabold" style="color:${crop.color}">
              ${crop.confidence}%
            </div>

            <div class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              ${T("match")}
            </div>

          </div>
        </div>

        <div class="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
          <div
            class="h-full rounded-full transition-all"
            style="width:${crop.confidence}%;background:${crop.color}">
          </div>
        </div>

        <div class="flex items-center gap-2 flex-wrap">

          <span class="text-[11px] px-2 py-0.5 rounded-md font-semibold border ${riskColor[crop.risk] || riskColor.Low}">
            ${T("risk")}: ${T((crop.risk || "").toLowerCase()) || crop.risk}
          </span>

          <span class="text-[11px] px-2 py-0.5 rounded-md font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200/60 dark:border-sky-800/40 inline-flex items-center gap-1">
            <i data-lucide="droplets" style="width:11px;height:11px"></i> ${crop.water} ${T("water")}
          </span>

        </div>
      </div>
    `}).join("");
  }

  const activityEl = document.getElementById("bv-activity");
  if (activityEl && D.recentActivity) {
    activityEl.innerHTML = D.recentActivity.map(a => `
      <div class="flex gap-3 items-start p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">

        <div class="p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex-shrink-0 mt-0.5 border border-slate-200/60 dark:border-slate-700/60">
          <i data-lucide="${a.icon}" style="width:14px;height:14px"></i>
        </div>

        <div class="flex-1 min-w-0">

          <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
            ${tr(a.text)}
          </p>

          <p class="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
            ${tr(a.time)}
          </p>

        </div>
      </div>
    `).join("");
  }

  const colorBorder = {
    warning: "border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20",
    success: "border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20",
    info: "border-l-sky-500 bg-sky-50/50 dark:bg-sky-950/20",
    ai: "border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20"
  };

  const notifCardsEl = document.getElementById("bv-notif-cards");
  if (notifCardsEl && D.notifications) {
    notifCardsEl.innerHTML = D.notifications.map(n => `
      <div class="border-l-4 rounded-r-lg px-3.5 py-2.5 ${colorBorder[n.type] || colorBorder.info} border-y border-r border-slate-200/50 dark:border-slate-800/50">

        <div class="text-xs font-bold text-slate-900 dark:text-white">
          ${tr(n.title)}
        </div>

        <div class="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
          ${tr(n.desc)}
        </div>

        <div class="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1">
          ${n.time} ${T("ago") || "ago"}
        </div>

      </div>
    `).join("");
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Render Charts with Theme Awareness
  const gridColor = isDarkMode() ? "rgba(148, 163, 184, 0.12)" : "rgba(226, 232, 240, 0.8)";
  const textColor = isDarkMode() ? "#94a3b8" : "#64748b";

  const marketChartEl = document.getElementById("bv-market-chart");
  let marketChart, profitChart;

  if (marketChartEl && typeof Chart !== "undefined" && D.marketData) {
    const months = D.marketData.map(m => m.month);

    marketChart = new Chart(marketChartEl, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Wheat",
            data: D.marketData.map(m => m.wheat),
            borderColor: "#10b981",
            backgroundColor: "rgba(16,185,129,.08)",
            fill: true,
            tension: 0.3,
            pointRadius: 3,
            borderWidth: 2
          },
          {
            label: "Rice",
            data: D.marketData.map(m => m.rice),
            borderColor: "#2563eb",
            backgroundColor: "rgba(37,99,235,.08)",
            fill: true,
            tension: 0.3,
            pointRadius: 3,
            borderWidth: 2
          },
          {
            label: "Soybean",
            data: D.marketData.map(m => m.soybean),
            borderColor: "#d97706",
            backgroundColor: "rgba(217,119,6,.08)",
            fill: true,
            tension: 0.3,
            pointRadius: 3,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { size: 11, weight: '500' } }
          },
          y: {
            grid: { color: gridColor },
            ticks: { color: textColor, font: { size: 11 } }
          }
        }
      }
    });
  }

  const profitChartEl = document.getElementById("bv-profit-chart");
  if (profitChartEl && typeof Chart !== "undefined" && D.profitData) {
    profitChart = new Chart(profitChartEl, {
      type: "bar",
      data: {
        labels: D.profitData.map(p => p.crop),
        datasets: [
          {
            label: "Revenue",
            data: D.profitData.map(p => p.profit),
            backgroundColor: "#10b981",
            borderRadius: 4
          },
          {
            label: "Cost",
            data: D.profitData.map(p => p.cost),
            backgroundColor: "#64748b",
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { size: 11, weight: '500' } }
          },
          y: {
            grid: { color: gridColor },
            ticks: { color: textColor, font: { size: 11 } }
          }
        }
      }
    });
  }

  // Update chart styles when theme changes
  window.addEventListener("bv-theme-changed", () => {
    const newGridColor = isDarkMode() ? "rgba(148, 163, 184, 0.12)" : "rgba(226, 232, 240, 0.8)";
    const newTextColor = isDarkMode() ? "#94a3b8" : "#64748b";

    [marketChart, profitChart].forEach(chart => {
      if (chart) {
        if (chart.options.scales.x) chart.options.scales.x.ticks.color = newTextColor;
        if (chart.options.scales.y) {
          chart.options.scales.y.grid.color = newGridColor;
          chart.options.scales.y.ticks.color = newTextColor;
        }
        chart.update();
      }
    });
  });
});
