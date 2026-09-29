/* ============================================================
   AI-CROP.JS — builds the multi-section form, attempts to
   auto-fetch GPS + weather (requires VITE_GOOGLE_MAPS_API_KEY
   in services/fetchFarmAutoData.js — see README), then shows
   AI recommendation cards on submit.
   ============================================================ */
import { listenHardwareData } from "../services/hardware.js";
import { generateCropRecommendations } from "../services/gemini.js";
import { fetchFarmAutoData } from "../services/fetchFarmAutoData.js";

/* ---------- i18n helpers (fall back if BV_I18N missing) ---------- */
function _t(key, fallback) {
  const I = window.BV_I18N;
  if (!I) return fallback;
  const v = I.t(key);
  return v === key ? fallback || key : v;
}

window.addEventListener("bv-shell-ready", async () => {
  const D = window.BV_DATA;

  // --- Form state ----------------------------------------------------------
  const form = {
    state: "Madhya Pradesh",
    district: "",
    village: "",
    pinCode: "",
    temp: "",
    rainfall: "850",
    humidity: "",
    season: "",
    floodDroughtHistory: "None reported",
    soil: "Black Soil (Regur / Black Cotton)",
    ph: "6.5",
    soilFertility: "Good",
    nitrogen: "Medium",
    phosphorus: "Medium",
    potassium: "Medium",
    land: "5",
    landUnit: "Acre",
    irrigation: "Borewell",
    currentCrop: "Wheat",
    prevCrop: "Soybean",
    compostAvailability: "Available (Sufficient)",
    chemicalFertilizerAvailability: "Moderate",
    budget: "75000",
    labourCost: "18000",
    sellingPreference: "Local Market",
  };
  const auto = {};

  function detectSeason() {
    const m = new Date().getMonth() + 1;
    if (m >= 6 && m <= 10) return D.SEASONS[0];
    if (m >= 11 || m <= 3) return D.SEASONS[1];
    return D.SEASONS[2];
  }

  // --- Helpers to build inputs --------------------------------------------
  function input(key, attrs = {}) {
    const cls = auto[key] ? "bv-input bv-input-auto" : "bv-input";
    const a = Object.entries(attrs)
      .map(([k, v]) => `${k}="${v}"`)
      .join(" ");
    return `<input class="${cls}" data-key="${key}" value="${form[key] ?? ""}" ${a} />`;
  }
  function select(key, options) {
    const cls = auto[key] ? "bv-input bv-input-auto" : "bv-input";
    return `<select class="${cls}" data-key="${key}">
      ${options.map((o) => `<option ${form[key] === o ? "selected" : ""}>${o}</option>`).join("")}
    </select>`;
  }
  function label(text, key) {
    const chip = auto[key]
      ? `<span class="bv-auto-chip"><i data-lucide="zap" style="width:9px;height:9px"></i>${_t("acAuto", "Auto")}</span>`
      : "";
    return `<label class="bv-label">${text}${chip}</label>`;
  }

  function renderForm() {
    document.getElementById("bv-form-sections").innerHTML = `
      <!-- LOCATION -->
      <div class="bv-section">
        <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="bv-step-badge">Step 1 of 5</span>
            <span class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <i data-lucide="map-pin" class="text-emerald-600 dark:text-emerald-400" style="width:16px;height:16px"></i>
              ${_t("acSecLocation", "Location & Regional Parameters")}
            </span>
          </div>
          ${auto.state || auto.district ? `<span class="bv-auto-chip"><i data-lucide="sparkles" style="width:10px;height:10px"></i>${_t("acAutoFromGps", "Auto-synced via GPS")}</span>` : ""}
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>${label(_t("acLblState", "State"), "state")}${select("state", D.INDIA_STATES)}</div>
          <div>${label(_t("acLblDistrict", "District"), "district")}${input("district", { placeholder: _t("acPhDistrict", "e.g. Vidisha") })}</div>
          <div>${label(_t("acLblVillage", "Village"), "village")}${input("village", { placeholder: _t("acPhVillage", "e.g. Karera") })}</div>
          <div>${label(_t("acLblPin", "Pin Code"), "pinCode")}${input("pinCode", { placeholder: _t("acPhPin", "6-digit PIN"), maxlength: 6 })}</div>
        </div>
      </div>

      <!-- WEATHER -->
      <div class="bv-section">
        <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="bv-step-badge">Step 2 of 5</span>
            <span class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <i data-lucide="cloud-sun" class="text-sky-500" style="width:16px;height:16px"></i>
              ${_t("acSecWeather", "Weather & Climate Metrics")}
            </span>
          </div>
          ${auto.temp ? `<span class="bv-auto-chip"><i data-lucide="cloud-lightning" style="width:10px;height:10px"></i>${_t("acGoogleWeather", "Google Weather API")}</span>` : ""}
        </div>
        <div class="grid grid-cols-3 gap-3 mb-4">
          <div>${label(_t("acLblTemp", "Temp (°C)"), "temp")}${input("temp", { type: "number", placeholder: "°C" })}</div>
          <div>${label(_t("acLblHumidity", "Humidity (%)"), "humidity")}${input("humidity", { type: "number", min: 0, max: 100, placeholder: "%" })}</div>
          <div>${label(_t("acLblSeason", "Season"), "season")}${select("season", ["", ...D.SEASONS])}</div>
        </div>
        <div class="mb-4">
          ${label(_t("acLblRainfall", "Annual Rainfall") + " — " + form.rainfall + " " + _t("acLblMm", "mm"), "rainfall")}
          <input class="w-full accent-emerald-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer" data-key="rainfall" type="range" min="200" max="2000" value="${form.rainfall}" />
        </div>
        <div>${label(_t("acLblFlood", "Flood / Drought History"), "floodDroughtHistory")}${select("floodDroughtHistory", D.FLOOD_DROUGHT_OPTIONS)}</div>
      </div>

      <!-- SOIL & FARM -->
      <div class="bv-section">
        <div class="flex items-center gap-2 mb-4">
          <span class="bv-step-badge">Step 3 of 5</span>
          <span class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
            <i data-lucide="test-tube-2" class="text-emerald-600 dark:text-emerald-400" style="width:16px;height:16px"></i>
            ${_t("acSecSoil", "Soil & Farm Profile")}
          </span>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="col-span-2">${label(_t("acLblSoilType", "Soil Type"))}${select("soil", D.INDIAN_SOIL_TYPES)}</div>
          <div>${label(_t("acLblSoilPh", "Soil pH"))}${input("ph", { type: "number", step: "0.1", min: 4, max: 9 })}</div>
          <div>${label(_t("acLblFertility", "Soil Fertility"))}${select("soilFertility", D.SOIL_FERTILITY_OPTIONS)}</div>
          <div>${label(_t("acLblN", "Nitrogen (N)"))}${select("nitrogen", D.NUTRIENT_LEVELS)}</div>
          <div>${label(_t("acLblP", "Phosphorus (P)"))}${select("phosphorus", D.NUTRIENT_LEVELS)}</div>
          <div>${label(_t("acLblK", "Potassium (K)"))}${select("potassium", D.NUTRIENT_LEVELS)}</div>
          <div>${label(_t("acLblIrr", "Irrigation Facility"))}${select("irrigation", D.IRRIGATION_OPTIONS)}</div>
        </div>
        <div>
          ${label(_t("acLblLand", "Land Size & Unit"))}
          <div class="flex gap-2">
            ${input("land", { type: "number", min: "0.1", step: "0.1" })}
            <div class="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0">
              ${D.LAND_UNITS.map((u) => `<button type="button" class="bv-land-unit ${form.landUnit === u ? "active" : ""}" data-unit="${u}">${u}</button>`).join("")}
            </div>
          </div>
        </div>
      </div>

      <!-- CROP -->
      <div class="bv-section">
        <div class="flex items-center gap-2 mb-4">
          <span class="bv-step-badge">Step 4 of 5</span>
          <span class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
            <i data-lucide="wheat" class="text-amber-600 dark:text-amber-400" style="width:16px;height:16px"></i>
            ${_t("acSecCrop", "Crop & Rotation History")}
          </span>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>${label(_t("acLblCurCrop", "Current Crop"))}${select("currentCrop", D.CROP_OPTIONS)}</div>
          <div>${label(_t("acLblPrevCrop", "Previous Crop Grown"))}${select("prevCrop", D.CROP_OPTIONS)}</div>
          <div>${label(_t("acLblCompost", "Compost Availability"))}${select("compostAvailability", D.COMPOST_OPTIONS)}</div>
          <div>${label(_t("acLblChem", "Chemical Fertilizer Availability"))}${select("chemicalFertilizerAvailability", D.CHEMICAL_FERTILIZER_OPTIONS)}</div>
        </div>
      </div>

      <!-- INVESTMENT -->
      <div>
        <div class="flex items-center gap-2 mb-4">
          <span class="bv-step-badge">Step 5 of 5</span>
          <span class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
            <i data-lucide="circle-dollar-sign" class="text-emerald-600 dark:text-emerald-400" style="width:16px;height:16px"></i>
            ${_t("acSecInvest", "Investment & Commercial Plan")}
          </span>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>${label(_t("acLblBudget", "Budget (₹)"))}${input("budget", { type: "number", min: 0, step: 1000 })}</div>
          <div>${label(_t("acLblLabour", "Labour Cost (₹)"))}${input("labourCost", { type: "number", min: 0, step: 500 })}</div>
          <div class="col-span-2">${label(_t("acLblSelling", "Selling Preference"))}${select("sellingPreference", D.SELLING_PREFERENCES)}</div>
        </div>
      </div>
    `;
    window.lucide && window.lucide.createIcons();
  }
  renderForm();

  // Re-render dynamic content when language changes (defensive — BV_I18N.set
  // also triggers a reload, but this keeps things instant if that changes).
  window.addEventListener("bv-language-changed", () => {
    renderForm();
    const btn = document.getElementById("bv-submit");
    if (btn && !btn.disabled) {
      btn.innerHTML = `<i data-lucide="bot" style="width:16px;height:16px"></i>${_t("acGetRec", "Get AI Recommendation")}`;
      window.lucide && window.lucide.createIcons();
    }
  });

  // --- Form change handlers -----------------------------------------------
  const sections = document.getElementById("bv-form-sections");
  sections.addEventListener("input", (e) => {
    const k = e.target.dataset.key;
    if (!k) return;
    form[k] = e.target.value;
    if (auto[k]) {
      auto[k] = false;
      renderForm();
    }
  });
  sections.addEventListener("click", (e) => {
    const u = e.target.closest("[data-unit]");
    if (!u) return;
    form.landUnit = u.dataset.unit;
    renderForm();
  });

  // --- Auto-fetch GPS + weather -------------------------------------------
  const status = document.getElementById("bv-fetch-status");
  status.innerHTML = `<div class="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs px-3 py-2 rounded-xl font-semibold"><span class="spinner"></span>${_t("acFetching", "Fetching GPS & Google Weather…")}</div>`;
  try {
    const data = await fetchFarmAutoData();
    Object.assign(form, {
      state: data.state || form.state,
      district: data.district || "",
      village: data.village || "",
      pinCode: data.pinCode || "",
      temp: data.temp || "",
      humidity: data.humidity || "",
      rainfall: data.rainfall || form.rainfall,
      season: detectSeason(),
      floodDroughtHistory: data.floodDroughtHistory || "None reported",
    });
    [
      "state",
      "district",
      "village",
      "pinCode",
      "temp",
      "humidity",
      "rainfall",
      "season",
      "floodDroughtHistory",
    ].forEach((k) => (auto[k] = true));
    renderForm();
    status.innerHTML = `<div class="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs px-3 py-2 rounded-xl font-semibold"><i data-lucide="check-circle" style="width:13px;height:13px"></i>${_t("acFetched", "GPS & Google Weather data fetched")}</div>`;
  } catch (err) {
    status.innerHTML = `<div class="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-xl max-w-md">${err.message}</div>`;
  }
  window.lucide && window.lucide.createIcons();

  // --- Submit handler → render recommendation cards ----------------------
  // document.getElementById("bv-crop-form").addEventListener("submit", (e) => {
  //   e.preventDefault();
  //   const btn = document.getElementById("bv-submit");
  //   btn.disabled = true;
  //   btn.innerHTML = `<span class="spinner spinner-lg"></span>${_t("acAnalysing", "Analysing…")}`;
  //   setTimeout(() => {
  //     btn.disabled = false;
  //     btn.innerHTML = `<i data-lucide="bot" style="width:16px;height:16px"></i>${_t("acGetRec", "Get AI Recommendation")}`;
  //     renderResults();
  //     window.lucide && window.lucide.createIcons();
  //   }, 1500);
  // });

  document
    .getElementById("bv-crop-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const btn = document.getElementById("bv-submit");
      const results = document.getElementById("bv-results");

      try {
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner spinner-lg"></span>Generating AI Recommendation...`;

          results.innerHTML = `
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 text-center">
        <div class="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
          BhoomiVeda AI is analyzing your farm...
        </div>
      </div>
    `;

        const recommendation = await generateCropRecommendations({
          state: form.state,
          district: form.district,
          village: form.village,
          temp: form.temp,
          humidity: form.humidity,
          rainfall: form.rainfall,
          soilType: form.soil,
          ph: form.ph,
          nitrogen: form.nitrogen,
          phosphorus: form.phosphorus,
          potassium: form.potassium,
          season: form.season || detectSeason(),
          budget: form.budget,
          land: form.land,
          language:
            (window.BV_I18N && window.BV_I18N.lang) ||
            localStorage.getItem("bv-language") ||
            "hi",
        });

        results.innerHTML = `
      <div class="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4 mb-4">
        <div class="font-bold text-emerald-800 dark:text-emerald-300">
          AI Crop Recommendation Generated
        </div>

        <div class="text-sm text-emerald-700 dark:text-emerald-400">
          ${form.village || "-"},
          ${form.district || "-"},
          ${form.state}
        </div>
      </div>

        <!-- AI Confidence Card -->
  <div class="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-2xl p-4 mb-4">
  <h3 class="font-bold text-blue-700 dark:text-blue-300">
    AI Confidence
  </h3>
  <p class="text-blue-900 dark:text-blue-200 font-semibold">${recommendation.confidence}%</p>
</div>

      <div class="grid md:grid-cols-3 gap-4 mb-6">

  <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
    <h3 class="font-bold text-emerald-700 dark:text-emerald-400">
      Option 1: ${recommendation.crop1 || "Not Available"}
    </h3>
    <p class="text-slate-600 dark:text-slate-300 text-sm mt-1">${recommendation.crop1Reason}</p>
  </div>

  <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
    <h3 class="font-bold text-emerald-700 dark:text-emerald-400">
      Option 2: ${recommendation.crop2 || "Not Available"}
    </h3>
    <p class="text-slate-600 dark:text-slate-300 text-sm mt-1">${recommendation.crop2Reason}</p>
  </div>

  <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
    <h3 class="font-bold text-emerald-700 dark:text-emerald-400">
      Option 3: ${recommendation.crop3 || "Not Available"}
    </h3>
    <p class="text-slate-600 dark:text-slate-300 text-sm mt-1">${recommendation.crop3Reason}</p>
  </div>

</div>

<div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 mb-4">
  <h3 class="font-bold text-emerald-700 dark:text-emerald-400">
    Fertilizer Plan
  </h3>
  <p class="text-slate-600 dark:text-slate-300 text-sm mt-1">${recommendation.fertilizer}</p>
</div>

<div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 mb-4">
  <h3 class="font-bold text-blue-700 dark:text-blue-400">
    Irrigation Strategy
  </h3>
  <p class="text-slate-600 dark:text-slate-300 text-sm mt-1">${recommendation.irrigation}</p>
</div>

<div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 mb-4">
  <h3 class="font-bold text-amber-600 dark:text-amber-400">
    Risks & Precautions
  </h3>
  <p class="text-slate-600 dark:text-slate-300 text-sm mt-1">${recommendation.risks}</p>
</div>

<div class="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl p-5 shadow-sm">
  <h3 class="font-bold">
    Expected Profit Potential
  </h3>
  <p class="text-emerald-50 text-sm mt-1">${recommendation.profit}</p>
</div>
    `;
      } catch (err) {
        console.error(err);

        results.innerHTML = `
      <div class="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-2xl p-4 text-red-700 dark:text-red-400">
        Failed to generate recommendation.
        <br>
        ${err.message}
      </div>
    `;
      } finally {
        btn.disabled = false;

        btn.innerHTML = `<i data-lucide="bot" style="width:16px;height:16px"></i>
       Get AI Recommendation`;

        window.lucide && window.lucide.createIcons();
      }
    });

  function renderResults() {
    const unitToAcre = {
      Acre: 1,
      Bigha: 0.625,
      Bissa: 0.03125,
      Hectare: 2.471,
    };
    const acres =
      (parseFloat(form.land) || 1) * (unitToAcre[form.landUnit] || 1);
    const out = document.getElementById("bv-results");

    const cards = D.cropRecommendations
      .map((crop, idx) => {
        const totalInvest = Math.round(crop.investment * acres);
        const totalYield = Math.round(crop.yieldPerAcre * acres * 10) / 10;
        const totalRevenue = Math.round(crop.marketPrice * totalYield);
        const totalProfit = totalRevenue - totalInvest;
        const roi = Math.round((totalProfit / totalInvest) * 100);
        return `
        <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-3xl">${crop.icon}</span>
            <div class="flex-1">
              <div class="font-bold text-gray-900 dark:text-white">${crop.crop}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">${_t("acRank", "Rank")} #${idx + 1} · ${crop.risk} ${_t("acRiskLbl", "Risk")} · 💧 ${crop.water} ${_t("acWater", "water")}</div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-black" style="color:${crop.color}">${crop.confidence}%</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">${_t("acAiMatch", "AI match")}</div>
            </div>
          </div>
          <div class="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
            <div class="h-full rounded-full" style="width:${crop.confidence}%;background:${crop.color}"></div>
          </div>
          <div class="grid grid-cols-2 gap-3 text-xs text-gray-700 dark:text-gray-300">
            <div>💸 ${_t("acInvestment", "Investment")}: <b>₹${totalInvest.toLocaleString()}</b></div>
            <div>📈 ${_t("acProfit", "Profit")}: <b class="text-green-600">₹${totalProfit.toLocaleString()}</b></div>
            <div>🌾 ${_t("acYield", "Yield")}: <b>${totalYield} ${crop.yieldUnit}</b></div>
            <div>📊 ${_t("acRoi", "ROI")}: <b class="text-green-600">${roi}%</b></div>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">💡 ${crop.successNote}</p>
        </div>
      `;
      })
      .join("");

    out.innerHTML = `
      <div class="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
        <i data-lucide="check-circle" class="text-green-600" style="width:20px;height:20px"></i>
        <div>
          <div class="font-semibold text-green-800 text-sm">${_t("acAnalysisComplete", "AI Analysis Complete")}</div>
          <div class="text-green-700 text-xs">${form.village || "—"}, ${form.district || "—"}, ${form.state} · ${form.season || detectSeason()} · ${form.soil}</div>
        </div>
      </div>
      ${cards}
    `;
  }
});

window.openRecommendation = function () {
  document.getElementById("advisor-selection").classList.add("hidden");

  document.getElementById("recommendation-section").classList.remove("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

window.openSoilModal = function () {
  const modal = document.getElementById("soilModal");

  modal.classList.remove("hidden");
  modal.classList.add("flex");
};

window.closeSoilModal = function () {
  const modal = document.getElementById("soilModal");

  modal.classList.add("hidden");
  modal.classList.remove("flex");
};

// document.addEventListener("submit", function (e) {
//   if (e.target.id === "soilBookingForm") {
//     e.preventDefault();

//     const date = e.target.querySelector('input[type="date"]').value;

//     const time = e.target.querySelector("select").value;

//     // alert(
//     //   `✅ Your soil testing slot has been booked successfully on ${date} at ${time}.`,
//     // );

//     document.addEventListener("submit", function (e) {
//       if (e.target.id === "soilBookingForm") {
//         e.preventDefault();

//         const date = e.target.querySelector('input[type="date"]').value;

//         const time = e.target.querySelector("select").value;

//         const tracking = document.getElementById("soilTrackingContainer");

//         tracking.innerHTML += `

//       <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-lg">

//         <div class="flex items-center justify-between flex-wrap gap-4 mb-6">

//           <div>
//             <h3 class="text-2xl font-black text-gray-900 dark:text-white">
//               🌱 Soil Testing Request
//             </h3>

//             <p class="text-gray-500 dark:text-gray-400 mt-1">
//               Scheduled on ${date} • ${time}
//             </p>
//           </div>

//           <div class="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full font-bold">
//             Slot Booked
//           </div>

//         </div>

//         <div class="space-y-4 mb-8">

//           <div class="flex items-center gap-3">
//             <div class="h-4 w-4 bg-green-500 rounded-full"></div>
//             <p class="font-medium text-gray-800 dark:text-gray-200">
//               Slot Booked Successfully
//             </p>
//           </div>

//           <div class="flex items-center gap-3 opacity-70">
//             <div class="h-4 w-4 bg-yellow-400 rounded-full"></div>
//             <p class="text-gray-700 dark:text-gray-300">
//               Technician Assignment Pending
//             </p>
//           </div>

//           <div class="flex items-center gap-3 opacity-50">
//             <div class="h-4 w-4 bg-gray-400 rounded-full"></div>
//             <p class="text-gray-600 dark:text-gray-400">
//               Soil Report Awaited
//             </p>
//           </div>

//         </div>

//         <button
//           disabled
//           class="w-full bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 py-4 rounded-2xl font-bold cursor-not-allowed"
//         >
//           Soil Report Available After Visit
//         </button>

//       </div>

//     `;

//         closeSoilModal();

//         e.target.reset();
//       }
//     });

//     closeSoilModal();

//     e.target.reset();
//   }
// });

let soilBookings = [];

document.addEventListener("submit", function (e) {
  if (e.target.id === "soilBookingForm") {
    e.preventDefault();

    const date = e.target.querySelector('input[type="date"]').value;

    const time = e.target.querySelector("select").value;

    const booking = {
      id: Date.now(),
      date,
      time,
      status: "Booked", // canonical internal value; UI uses translated label
    };

    soilBookings.push(booking);

    const tmpl = _t(
      "acAlertBooked",
      "✅ Your soil testing slot has been booked successfully on {date} during {time}.",
    );
    alert(tmpl.replace("{date}", date).replace("{time}", time));

    closeSoilModal();

    e.target.reset();
  }
});

window.openSoilReport = function () {
  const modal = document.getElementById("soilReportModal");

  modal.classList.remove("hidden");
  modal.classList.add("flex");
};

window.closeSoilReport = function () {
  const modal = document.getElementById("soilReportModal");

  modal.classList.add("hidden");

  /* RESTORE PAGE SCROLL */

  document.body.style.overflow = "auto";
};

window.showSoilReportAlert = function () {
  alert(
    _t(
      "acReportAlert",
      "🌱 Soil reports will be shown after the technician visit.",
    ),
  );

  const modal = document.getElementById("soilReportModal");

  /* GO TO TOP */

  window.scrollTo({
    top: 0,
    behavior: "instant",
  });

  /* STOP BACKGROUND SCROLL */

  document.body.style.overflow = "hidden";

  /* OPEN REPORT */

  modal.classList.remove("hidden");
};

window.openExistingSlots = function () {
  const modal = document.getElementById("existingSlotsModal");

  const container = document.getElementById("existingSlotsContainer");

  if (soilBookings.length === 0) {
    container.innerHTML = `
      <div class="text-center py-16 text-gray-500 dark:text-gray-400">
        ${_t("acNoBookings", "No bookings available")}
      </div>
    `;
  } else {
    container.innerHTML = soilBookings
      .map((booking) => {
        const statusLabel =
          booking.status === "Cancelled"
            ? _t("acStatusCancelled", "Cancelled")
            : _t("acStatusBooked", "Booked");
        return `

      <div class="border border-gray-200 dark:border-gray-800 rounded-3xl p-6">

        <div class="flex items-center justify-between flex-wrap gap-4 mb-6">

          <div>

            <h3 class="text-2xl font-black text-gray-900 dark:text-white">
              ${_t("acSlotTitle", "🌱 Soil Testing Slot")}
            </h3>

            <p class="text-gray-500 dark:text-gray-400 mt-2">
              ${booking.date} • ${booking.time}
            </p>

          </div>

          <div class="
            px-4 py-2 rounded-full font-bold
            ${booking.status === "Cancelled"
            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          }
          ">
            ${statusLabel}
          </div>

        </div>

        <div class="space-y-4 mb-8">

          <div class="flex items-center gap-3">
            <div class="h-4 w-4 bg-green-500 rounded-full"></div>
            <p class="font-medium text-gray-800 dark:text-gray-200">
              ${_t("acStepConfirmed", "Booking Confirmed")}
            </p>
          </div>

          <div class="flex items-center gap-3 opacity-70">
            <div class="h-4 w-4 bg-yellow-400 rounded-full"></div>
            <p class="text-gray-700 dark:text-gray-300">
              ${_t("acStepPending", "Technician Assignment Pending")}
            </p>
          </div>

          <div class="flex items-center gap-3 opacity-50">
            <div class="h-4 w-4 bg-gray-400 rounded-full"></div>
            <p class="text-gray-600 dark:text-gray-400">
              ${_t("acStepReport", "Soil Report Awaited")}
            </p>
          </div>

          ${booking.status === "Cancelled"
            ? `
              <div class="flex items-center gap-3">
                <div class="h-4 w-4 bg-red-500 rounded-full"></div>
                <p class="text-red-600 dark:text-red-400 font-bold">
                  ${_t("acStepCancelled", "Booking Successfully Cancelled")}
                </p>
              </div>
            `
            : ""
          }

        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <button
            onclick="showSoilReportAlert()"
            class="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold"
          >
            ${_t("acViewReport", "🌾 View Soil Report")}
          </button>

          ${booking.status !== "Cancelled"
            ? `
            <button
              onclick="cancelBooking(${booking.id})"
              class="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold"
            >
              ${_t("acCancelBooking", "❌ Cancel Booking")}
            </button>
            `
            : ""
          }

        </div>

      </div>

    `;
      })
      .join("");
  }

  modal.classList.remove("hidden");
  modal.classList.add("flex");
};

window.closeExistingSlots = function () {
  const modal = document.getElementById("existingSlotsModal");

  modal.classList.add("hidden");
  modal.classList.remove("flex");
};

window.cancelBooking = function (id) {
  const confirmCancel = confirm(
    _t("acConfirmCancel", "Are you sure you want to cancel this booking?"),
  );

  if (!confirmCancel) return;

  soilBookings = soilBookings.map((booking) => {
    if (booking.id === id) {
      booking.status = "Cancelled";
    }

    return booking;
  });

  openExistingSlots();
};

// Auto-open reports modal when navigated with #reports hash (from dashboard "View Report" button)
window.addEventListener("bv-shell-ready", () => {
  try { window.scrollTo(0, 0); } catch (e) {}
  if (window.location.hash === "#reports") {
    setTimeout(() => {
      if (typeof window.openExistingSlots === "function") {
        window.openExistingSlots();
      }
    }, 300);
  }
});


/* ============================================================
   HARDWARE SENSOR INTEGRATION (merged from Ankur's codebase)
   Listens to ESP32 sensor data over Socket.IO and updates the
   live sensor cards on the AI-Crop page. Both payload shapes
   (lowercase + uppercase ESP32) are kept to preserve Ankur's
   original behaviour exactly.
   ============================================================ */
window.addEventListener("bv-shell-ready", () => {
  listenHardwareData((data) => {

    if (data.temperature) {
      document.getElementById("temperature-value").textContent =
        data.temperature + "°C";
    }

    if (data.humidity) {
      document.getElementById("humidity-value").textContent =
        data.humidity + "%";
    }

    if (data.moisture) {
      document.getElementById("moisture-value").textContent =
        data.moisture + "%";
    }

    if (data.ph) {
      document.getElementById("ph-value").textContent =
        data.ph;
    }

  });

  listenHardwareData((data) => {

    console.log("Received ESP32:", data);

    const tempEl = document.getElementById("temperature-value");
    const humEl = document.getElementById("humidity-value");
    const moistureEl = document.getElementById("moisture-value");

    if (tempEl && data.TEMP) {
      tempEl.textContent = data.TEMP + "°C";
    }

    if (humEl && data.HUM) {
      humEl.textContent = data.HUM + "%";
    }

    if (moistureEl && data.MOISTURE) {
      moistureEl.textContent = data.MOISTURE;
    }

  });
});
