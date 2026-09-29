/* ============================================================
   ASK EXPERT — Chat-based farmer consultation
   Storage: localStorage key "bv-consultations"
   AI: Gemini via window.BV_CONFIG.GEMINI_API_KEY (graceful fallback)
   ============================================================ */
(function () {
  const STORE_KEY = "bv-consultations";
  const tr = (k, fb) => (window.BV_I18N ? window.BV_I18N.t(k, fb) : (fb || k));

  /* ----------------------------------------------------------
     EXPERT VIDEO CONFIG (dummy / future-ready)
     ------------------------------------------------------------
     Replace `videoSrc` with a real expert video path or a URL
     coming from the backend. Leave it empty ("") to automatically
     show the placeholder + "coming soon" fallback instead.
     `poster` is the thumbnail shown before playback.
     `fallbackVideo` is an optional secondary source.
  ---------------------------------------------------------- */
  const VIDEO_CONFIG = {
    videoSrc: "assets/new_video.mp4",
    poster: "assets/expert-video-poster.jpg",
    fallbackVideo: "",
  };
  let videoInitialized = false;

  // ---------- State ----------
  let consultations = load();
  let view = "list";       // "list" | "form" | "chat"
  let activeId = null;
  let pendingPhotos = [];  // [{name, dataUrl}]
  let pendingAudio = null; // {dataUrl}
  let mediaRecorder = null, recordChunks = [], recordTimer = null, recordStart = 0;

  // ---------- DOM helpers ----------
  const $ = (s) => document.querySelector(s);

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "[]"); }
    catch { return []; }
  }
  function save() { localStorage.setItem(STORE_KEY, JSON.stringify(consultations)); }
  function uid() { return "c_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function nowISO() { return new Date().toISOString(); }

  function categoryKey(value) {
    return ({
      disease: "aeCatDisease", pest: "aeCatPest", fertilizer: "aeCatFertilizer",
      irrigation: "aeCatIrrigation", soil: "aeCatSoil", weather: "aeCatWeather",
      yield: "aeCatYield", other: "aeCatOther"
    })[value] || "aeCatOther";
  }
  function statusKey(s) {
    return ({ waiting: "aeStatusWaiting", replied: "aeStatusReplied", resolved: "aeStatusResolved" })[s] || "aeStatusWaiting";
  }
  function statusClass(s) {
    return ({ waiting: "ae-status-waiting", replied: "ae-status-replied", resolved: "ae-status-resolved" })[s] || "ae-status-waiting";
  }
  function formatDate(iso) {
    try { return new Date(iso).toLocaleString(); } catch { return iso; }
  }
  function escapeHTML(s) {
    return (s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // ---------- Rendering ----------
  function show(v) {
    view = v;
    $("#ae-list-view").classList.toggle("hidden", v !== "list");
    $("#ae-form-view").classList.toggle("hidden", v !== "form");
    $("#ae-chat-view").classList.toggle("hidden", v !== "chat");
    if (v === "chat") loadVideoAdvice();
    if (window.lucide) window.lucide.createIcons();
  }

  function renderList() {
    const list = $("#ae-consult-list");
    const empty = $("#ae-empty");
    if (!list) return;
    list.innerHTML = "";
    if (!consultations.length) {
      empty.classList.remove("hidden");
      return;
    }
    empty.classList.add("hidden");
    [...consultations].sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || "")).forEach(c => {
      const last = c.messages[c.messages.length - 1];
      const lastText = last ? (last.text || (last.image ? "[Photo]" : last.audio ? "[Voice Note]" : "")) : "";
      const card = document.createElement("button");
      card.className = "ae-consult-card w-full text-left bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 shadow-sm flex items-start gap-3";
      card.innerHTML = `
        <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 flex items-center justify-center flex-shrink-0">
          <i data-lucide="sprout" style="width:18px;height:18px"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-2">
            <div class="font-bold text-sm text-gray-900 dark:text-white truncate">${escapeHTML(c.crop)} · <span class="text-gray-500 dark:text-gray-400 font-normal">${escapeHTML(tr(categoryKey(c.category)))}</span></div>
            <span class="ae-status-pill ${statusClass(c.status)}">${escapeHTML(tr(statusKey(c.status)))}</span>
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">${escapeHTML(lastText)}</div>
          <div class="text-[10px] text-gray-400 dark:text-gray-500 mt-1">${escapeHTML(formatDate(c.updatedAt))}</div>
        </div>`;
      card.addEventListener("click", () => openChat(c.id));
      list.appendChild(card);
    });
    if (window.lucide) window.lucide.createIcons();
  }

  function renderChat() {
    const c = consultations.find(x => x.id === activeId);
    if (!c) return;
    $("#ae-chat-title").textContent = `${c.crop} · ${tr(categoryKey(c.category))}`;
    const statusEl = $("#ae-chat-status");
    statusEl.innerHTML = `<span class="ae-status-pill ${statusClass(c.status)}">${escapeHTML(tr(statusKey(c.status)))}</span>`;

    const box = $("#ae-messages");
    box.innerHTML = "";
    c.messages.forEach(m => box.appendChild(renderMessage(m)));
    box.scrollTop = box.scrollHeight;
    if (window.lucide) window.lucide.createIcons();
  }

  function renderMessage(m) {
    const wrap = document.createElement("div");
    wrap.className = "flex " + (m.role === "farmer" ? "justify-end" : "justify-start");
    const who = m.role === "farmer" ? tr("aeYou") : m.role === "ai" ? tr("aeAI") : tr("aeExpert");
    const cls = m.role === "farmer" ? "ae-msg-farmer" : m.role === "ai" ? "ae-msg-ai" : "ae-msg-expert";
    let inner = `<div class="ae-msg-meta">${escapeHTML(who)}</div>`;
    if (m.text) inner += `<div>${escapeHTML(m.text).replace(/\n/g, "<br>")}</div>`;
    if (m.images && m.images.length) {
      m.images.forEach(src => { inner += `<img src="${src}" alt="">`; });
    } else if (m.image) {
      inner += `<img src="${m.image}" alt="">`;
    }
    if (m.audio) inner += `<audio controls src="${m.audio}"></audio>`;
    if (m.video) inner += `<video controls src="${m.video}" class="rounded-lg mt-2 max-w-full"></video>`;
    if (m.pdf) inner += `<a href="${m.pdf}" target="_blank" class="underline text-xs mt-2 inline-flex items-center gap-1"><i data-lucide="file-text" style="width:12px;height:12px"></i><span>Document PDF</span></a>`;
    wrap.innerHTML = `<div class="ae-msg ${cls}">${inner}</div>`;
    return wrap;
  }

  // ---------- Photo / audio capture ----------
  function readFile(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  }

  function renderPhotoPreview() {
    const wrap = $("#ae-photo-preview");
    wrap.innerHTML = "";
    pendingPhotos.forEach((p, i) => {
      const div = document.createElement("div");
      div.className = "ae-photo-thumb";
      div.innerHTML = `<img src="${p.dataUrl}" alt=""><button type="button" aria-label="Remove">×</button>`;
      div.querySelector("button").addEventListener("click", () => {
        pendingPhotos.splice(i, 1);
        renderPhotoPreview();
      });
      wrap.appendChild(div);
    });
  }

  async function handlePhotoInput(e) {
    const files = Array.from(e.target.files || []);
    for (const f of files) {
      try { pendingPhotos.push({ name: f.name, dataUrl: await readFile(f) }); }
      catch (err) { console.warn(err); }
    }
    e.target.value = "";
    renderPhotoPreview();
  }

  async function handleAudioUpload(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    pendingAudio = { dataUrl: await readFile(f) };
    const a = $("#ae-audio-preview");
    a.src = pendingAudio.dataUrl;
    a.classList.remove("hidden");
    e.target.value = "";
  }

  async function toggleRecord() {
    const btn = $("#ae-record-btn");
    const label = $("#ae-record-label");
    const timer = $("#ae-record-timer");
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordChunks = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (ev) => { if (ev.data.size) recordChunks.push(ev.data); };
      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordChunks, { type: "audio/webm" });
        pendingAudio = { dataUrl: await readFile(blob) };
        const a = $("#ae-audio-preview");
        a.src = pendingAudio.dataUrl;
        a.classList.remove("hidden");
        stream.getTracks().forEach(t => t.stop());
        label.textContent = tr("aeRecordVoice");
        btn.classList.remove("animate-pulse");
        timer.classList.add("hidden");
        clearInterval(recordTimer);
      };
      mediaRecorder.start();
      recordStart = Date.now();
      label.textContent = tr("aeStopRecording");
      btn.classList.add("animate-pulse");
      timer.classList.remove("hidden");
      recordTimer = setInterval(() => {
        const s = Math.floor((Date.now() - recordStart) / 1000);
        const mm = String(Math.floor(s / 60)).padStart(2, "0");
        const ss = String(s % 60).padStart(2, "0");
        timer.textContent = `${mm}:${ss}`;
      }, 500);
    } catch (err) {
      alert("Microphone permission denied or unavailable.");
    }
  }

  // ---------- Submit new consultation ----------
  async function submitQuery() {
    const crop = $("#ae-crop").value.trim();
    const category = $("#ae-category").value;
    let desc = $("#ae-desc").value.trim();

    // Only crop + category are required. Description is optional.
    if (!crop || !category) {
      alert(tr("aeFormErrorCropCat", "Please enter crop name and select a category."));
      return;
    }

    // Soft, non-blocking info when farmer skips description.
    const infoEl = document.getElementById("ae-desc-info");
    if (!desc) {
      if (infoEl) {
        infoEl.classList.remove("hidden");
        if (window.lucide) window.lucide.createIcons();
      }
      // Use a friendly placeholder message so downstream code has text.
      desc = tr("aeNoDescInfo", "No detailed description provided. Expert will still analyze based on crop and category.");
    } else if (infoEl) {
      infoEl.classList.add("hidden");
    }

    // 1) Build the consultation with the farmer's message
    const id = uid();
    const farmerMsg = {
      role: "farmer", text: desc, at: nowISO(),
      images: pendingPhotos.map(p => p.dataUrl),
      audio: pendingAudio ? pendingAudio.dataUrl : null,
    };
    const consult = {
      id, crop, category, status: "waiting",
      createdAt: nowISO(), updatedAt: nowISO(),
      messages: [farmerMsg],
    };
    consultations.push(consult);
    save();

    // Reset the form
    pendingPhotos = []; pendingAudio = null;
    $("#ae-crop").value = ""; $("#ae-desc").value = "";
    $("#ae-audio-preview").classList.add("hidden");
    renderPhotoPreview();

    // 2) Open the chat (also loads the Expert Video Advice panel)
    activeId = id;
    show("chat");
    renderChat();

    // 3) AI instant response (with a thinking placeholder while we wait)
    consult.messages.push({ role: "ai", text: tr("aeAIThinking"), at: nowISO(), pending: true });
    renderChat();
    const ai = await getAIResponse(crop, category, desc);
    renderAIResponse(consult, ai);
    renderChat();

    // 4) Expert guidance (demo / template based)
    renderExpertResponse(consult);
    consult.status = "replied";
    consult.updatedAt = nowISO();
    save();
    renderChat();
    renderList();
  }

  // Push the AI response, replacing the "thinking" placeholder.
  function renderAIResponse(consult, aiText) {
    consult.messages = consult.messages.filter(m => !m.pending);
    consult.messages.push({ role: "ai", text: aiText, at: nowISO() });
  }

  // Push a template-based expert guidance message (demo placeholder
  // until real expert replies are wired to a backend).
  function renderExpertResponse(consult) {
    const catLabel = tr(categoryKey(consult.category));
    const body = tr("aeExpertDemoReply")
      .replace("{crop}", consult.crop)
      .replace("{category}", catLabel);
    consult.messages.push({
      role: "expert",
      text: `${tr("aeExpertGuidance")}\n\n${body}`,
      at: nowISO(),
    });
  }

  // ---------- Expert Video Advice (dummy / future-ready) ----------
  function loadVideoAdvice() {
    const frame = $("#ae-video-frame");
    const controls = $("#ae-video-controls");
    if (!frame) return;
    if (videoInitialized) return; // build the player only once

    const src = VIDEO_CONFIG.videoSrc || VIDEO_CONFIG.fallbackVideo;
    if (!src) { renderVideoFallback(); videoInitialized = true; return; }

    frame.innerHTML =
      `<video id="ae-video" playsinline controls preload="metadata" poster="${VIDEO_CONFIG.poster}">` +
      `<source src="${src}" type="video/mp4" />` +
      `</video>`;
    if (controls) controls.classList.remove("hidden");

    const video = $("#ae-video");
    // If the source can't load, fall back to a placeholder (never a broken player).
    video.addEventListener("error", renderVideoFallback);
    video.querySelector("source").addEventListener("error", renderVideoFallback);
    video.addEventListener("play", () => setVideoToggle(true));
    video.addEventListener("pause", () => setVideoToggle(false));
    video.addEventListener("ended", () => setVideoToggle(false));
    videoInitialized = true;
  }

  function renderVideoFallback() {
    const frame = $("#ae-video-frame");
    const controls = $("#ae-video-controls");
    if (!frame) return;
    if (controls) controls.classList.add("hidden");
    const poster = VIDEO_CONFIG.poster
      ? `style="background-image:url('${VIDEO_CONFIG.poster}')"` : "";
    frame.innerHTML =
      `<div class="ae-video-fallback" ${poster}>` +
      `<i data-lucide="video-off" style="width:28px;height:28px"></i>` +
      `<span>${escapeHTML(tr("aeVideoUnavailable"))}</span>` +
      `</div>`;
    if (window.lucide) window.lucide.createIcons();
  }

  function setVideoToggle(isPlaying) {
    const btn = $("#ae-video-toggle");
    const label = $("#ae-video-toggle-label");
    if (!btn || !label) return;
    label.textContent = tr(isPlaying ? "aeVideoPause" : "aeVideoPlay");
    btn.querySelector("i")?.setAttribute("data-lucide", isPlaying ? "pause" : "play");
    if (window.lucide) window.lucide.createIcons();
  }

  function toggleVideo() {
    const video = $("#ae-video");
    if (!video) return;
    if (video.paused) video.play(); else video.pause();
  }

  async function getAIResponse(crop, category, desc) {

    const lang = (window.BV_I18N && window.BV_I18N.lang) || localStorage.getItem("bv-language") || "hi";
    const isHi = lang === "hi";
    const catLabel = tr(categoryKey(category));
    try {
      const key = window.BV_CONFIG && window.BV_CONFIG.GEMINI_API_KEY;
      if (!key) throw new Error("no key");
      const langInstr = isHi
        ? "Respond ONLY in Hindi (Devanagari script). Use simple farmer-friendly language."
        : "Respond ONLY in simple English suitable for a farmer.";
      const prompt = `You are an agricultural expert helping an Indian farmer.
${langInstr}

Crop: ${crop}
Problem Category: ${catLabel}
Farmer's Description: ${desc}

Return STRICT JSON only (no markdown), with this shape:
{ "possibleIssue": "...", "suggestedAction": "..." }
Keep each field 1-3 short sentences.`;
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
        { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
      );
      const json = await res.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const data = JSON.parse(clean);
      return formatAI(data.possibleIssue, data.suggestedAction);
    } catch (e) {
      console.warn("AI fallback:", e);
      const fb = isHi
        ? { issue: `${catLabel} से संबंधित प्रारंभिक विश्लेषण के अनुसार, आपकी ${crop} फसल पर ध्यान देने की आवश्यकता है।`,
            action: "प्रभावित हिस्सों की तस्वीरें लें और स्थानीय कृषि अधिकारी से तुरंत संपर्क करें। फसल को अधिक पानी देने से बचें।" }
        : { issue: `Based on the ${catLabel.toLowerCase()} you reported, your ${crop} appears to need attention.`,
            action: "Take clear photos of affected leaves/stems and consult your local agriculture officer. Avoid over-watering until expert advice arrives." };
      return formatAI(fb.issue, fb.action);
    }
  }

  function formatAI(issue, action) {
    return `${tr("aeAIResponse")}\n\n${tr("aePossibleIssue")}: ${issue || "-"}\n\n${tr("aeSuggestedAction")}: ${action || "-"}`;
  }

  // ---------- Chat (existing consultation) ----------
  function openChat(id) {
    activeId = id;
    show("chat");
    renderChat();
  }

  async function sendChat() {
    const input = $("#ae-chat-input");
    const text = input.value.trim();
    if (!text) return;
    const c = consultations.find(x => x.id === activeId);
    if (!c) return;
    c.messages.push({ role: "farmer", text, at: nowISO() });
    c.updatedAt = nowISO();
    input.value = "";
    save();
    renderChat();
    renderList();
  }

  async function attachInChat(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const c = consultations.find(x => x.id === activeId);
    if (!c) return;
    const dataUrl = await readFile(f);
    const msg = { role: "farmer", at: nowISO() };
    if (f.type.startsWith("image/")) msg.image = dataUrl;
    else if (f.type.startsWith("audio/")) msg.audio = dataUrl;
    else if (f.type.startsWith("video/")) msg.video = dataUrl;
    c.messages.push(msg);
    c.updatedAt = nowISO();
    save();
    e.target.value = "";
    renderChat();
    renderList();
  }

  // ---------- Wiring ----------
  function wire() {
    $("#ae-new-btn").addEventListener("click", () => {
      pendingPhotos = []; pendingAudio = null;
      $("#ae-audio-preview").classList.add("hidden");
      renderPhotoPreview();
      show("form");
    });
    document.querySelectorAll(".ae-back-btn").forEach(b => b.addEventListener("click", () => {
      show("list"); renderList();
    }));
    document.querySelectorAll(".ae-photo-input").forEach(i => i.addEventListener("change", handlePhotoInput));
    $("#ae-audio-input").addEventListener("change", handleAudioUpload);
    $("#ae-record-btn").addEventListener("click", toggleRecord);
    $("#ae-submit").addEventListener("click", submitQuery);
    $("#ae-chat-send").addEventListener("click", sendChat);
    $("#ae-chat-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); }
    });
    $("#ae-chat-attach").addEventListener("change", attachInChat);
    $("#ae-video-toggle").addEventListener("click", toggleVideo);

    // Re-render on language change to refresh labels in dynamic content
    window.addEventListener("bv-language-changed", () => {
      renderList();
      if (view === "chat") {
        renderChat();
        // keep the play/pause toggle label in the active language
        const video = $("#ae-video");
        setVideoToggle(!!video && !video.paused);
      }
    });

    renderList();
    show("list");
  }

  if (window.addEventListener) {
    window.addEventListener("bv-shell-ready", wire);
    // If shell-ready already fired (shouldn't, but safe), fallback after DOM ready
    if (document.readyState !== "loading") {
      setTimeout(() => { if (!$("#ae-list-view")) return; if (!$("#ae-new-btn").dataset.bvWired) { /* wire if not already */ } }, 0);
    }
  }
})();
