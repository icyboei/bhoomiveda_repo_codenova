/* ============================================================
   AI-ASSISTANT.JS — simple canned-response chat.
   ============================================================ */
window.addEventListener("bv-shell-ready", () => {
  const panel    = document.getElementById("bv-ai-panel");
  const toggle   = document.getElementById("bv-ai-toggle");
  const closeBtn = document.getElementById("bv-ai-close");
  const sendBtn  = document.getElementById("bv-ai-send");
  const input    = document.getElementById("bv-ai-input");
  const list     = document.getElementById("bv-ai-messages");
  if (!panel) return;

  const responses = [
    "Based on your soil data, I recommend adding 20kg of nitrogen fertilizer to Field A before the next irrigation.",
    "Current wheat prices are trending up — good time to sell your stored stock!",
    "Rain is expected in 48 hours. Hold off irrigation until Thursday.",
    "Your Soybean crop shows 94% match for this season's conditions."
  ];

  const messages = [{ from: "ai", text: "Hello Farmer! How can I help with your farm today?" }];

  function render() {
    list.innerHTML = messages.map(m => `
      <div class="flex ${m.from === "user" ? "justify-end" : "justify-start"}">
        <div class="max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${m.from === "user" ? "bv-bubble-user" : "bv-bubble-ai"}">${m.text}</div>
      </div>
    `).join("");
    list.scrollTop = list.scrollHeight;
  }
  function send() {
    const v = input.value.trim();
    if (!v) return;
    messages.push({ from: "user", text: v });
    messages.push({ from: "ai", text: responses[Math.floor(Math.random() * responses.length)] });
    input.value = "";
    render();
  }

  toggle.addEventListener("click", () => panel.classList.toggle("hidden"));
  closeBtn.addEventListener("click", () => panel.classList.add("hidden"));
  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", e => { if (e.key === "Enter") send(); });
  render();
});
