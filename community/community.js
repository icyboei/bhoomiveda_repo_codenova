/* ============================================================
   COMMUNITY.JS — renders posts, trending topics, experts, and
   leaderboard. Uses BV_I18N.tr() for dynamic English data values
   and BV_I18N.t() for fixed UI labels, so the entire feed
   re-renders correctly in Hindi when language is switched.
   ============================================================ */
window.addEventListener("bv-shell-ready", () => {
  const D = window.BV_DATA;
  const I = window.BV_I18N;
  const tr = (t) => I.tr(t);
  const t  = (k) => I.t(k);

  const postsEl = document.getElementById("bv-posts");

  function renderPosts() {
    postsEl.innerHTML = D.communityPosts.map(p => `
      <div class="bv-post bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style="background:${p.avatarColor}">${p.avatar}</div>
          <div class="flex-1">
            <div class="font-semibold text-sm text-gray-900 dark:text-white">${tr(p.author)}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><i data-lucide="map-pin" style="width:10px;height:10px"></i>${tr(p.location)} · ${tr(p.time)}</div>
          </div>
          <button class="text-xs px-3 py-1 rounded-full border font-medium border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">${t("follow")}</button>
        </div>
        <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400 mb-3">${tr(p.content)}</p>
        <div class="flex gap-2 mb-4">
          ${p.tags.map(tag => `<span class="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-medium">#${tr(tag)}</span>`).join("")}
        </div>
        <div class="flex items-center gap-6 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button data-like="${p.id}" class="bv-like ${p.liked ? "liked" : ""} flex items-center gap-1.5 text-sm transition-colors text-gray-500 dark:text-gray-400 hover:text-red-400">
            <i data-lucide="heart" style="width:15px;height:15px"></i>${p.likes}
          </button>
          <button class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors"><i data-lucide="message-circle" style="width:15px;height:15px"></i>${p.comments}</button>
          <button class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors"><i data-lucide="share-2" style="width:15px;height:15px"></i>${p.shares}</button>
        </div>
      </div>
    `).join("");
    window.lucide && window.lucide.createIcons();
  }

  postsEl.addEventListener("click", e => {
    const btn = e.target.closest("[data-like]");
    if (!btn) return;
    const id = Number(btn.dataset.like);
    D.communityPosts = D.communityPosts.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p);
    renderPosts();
  });

  // Trending
  document.getElementById("bv-trending").innerHTML = D.trendingTopics.map((tp,i) => `
    <div class="flex items-center justify-between group cursor-pointer">
      <div class="flex items-center gap-2">
        <span class="text-xs font-black w-5 text-center ${i < 3 ? "text-yellow-500" : "text-gray-500 dark:text-gray-400"}">#${i+1}</span>
        <span class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-green-600 transition-colors">${tr(tp.topic)}</span>
      </div>
      <span class="text-xs text-gray-500 dark:text-gray-400">${tp.posts} ${t("posts")}</span>
    </div>
  `).join("");

  // Experts
  document.getElementById("bv-experts").innerHTML = D.expertQuestions.map(q => `
    <div class="p-3 rounded-xl bg-gray-50 dark:bg-gray-700">
      <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-2">${tr(q.question)}</p>
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold ${q.answered ? "text-green-600" : "text-orange-500"}">${q.answered ? "✓ " + tr(q.expert) : t("awaitingExpert")}</span>
        <span class="text-xs text-gray-500 dark:text-gray-400">${q.answers} ${t("answers")}</span>
      </div>
    </div>
  `).join("");

  // Leaderboard
  document.getElementById("bv-leaderboard").innerHTML = D.leaderboard.map(f => `
    <div class="flex items-center gap-3 p-2 rounded-xl ${f.rank <= 3 ? "bg-yellow-50 dark:bg-yellow-900/20" : ""}">
      <span class="text-lg w-6 text-center">${f.badge}</span>
      <div class="flex-1">
        <div class="text-sm font-semibold text-gray-900 dark:text-white">${tr(f.name)}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400">${tr(f.state)}</div>
      </div>
      <div class="text-right">
        <div class="text-sm font-bold text-green-600">${f.points.toLocaleString()}</div>
        <div class="text-xs text-gray-500 dark:text-gray-400">${t("pts")}</div>
      </div>
    </div>
  `).join("");

  renderPosts();
});
