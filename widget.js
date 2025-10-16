(() => {
  const API_URL = "https://eo639chyfs9mcu4.m.pipedream.net"; // <- dein Pipedream-Webhook

  // ------- Utilities -------
  const fmt = (d = new Date()) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const getName = () => {
    const KEY = "dp_customer_name";
    let n = localStorage.getItem(KEY);
    if (!n) {
      n = "Gast-" + Math.floor(1000 + Math.random() * 9000);
      localStorage.setItem(KEY, n);
    }
    return n;
  };

  // ------- DOM bauen -------
  const root = document.getElementById("dp-widget-root");

  root.innerHTML = `
    <button id="dp-chat-fab" aria-label="Chat öffnen">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 4h16v12H7l-3 3V4z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <section id="dp-chat-panel" role="dialog" aria-modal="true" aria-label="Kundenservice-Chat">
      <header class="dp-head">
        <div class="dp-title">Assistent</div>
        <button class="dp-close" title="Schließen" aria-label="Schließen">✕</button>
      </header>
      <main class="dp-body" id="dp-body"></main>
      <form class="dp-input" id="dp-form">
        <input type="text" id="dp-input" autocomplete="off" placeholder="Nachricht schreiben…" />
        <button type="submit">Senden</button>
      </form>
    </section>
  `;

  const fab  = root.querySelector("#dp-chat-fab");
  const panel= root.querySelector("#dp-chat-panel");
  const body = root.querySelector("#dp-body");
  const form = root.querySelector("#dp-form");
  const input= root.querySelector("#dp-input");
  const close= root.querySelector(".dp-close");

  const open = () => { panel.style.display = "flex"; input.focus(); };
  const hide = () => { panel.style.display = "none"; };

  fab.addEventListener("click", open);
  close.addEventListener("click", hide);

  // ------- Rendering -------
  const bubble = (text, who="bot") => {
    const wrap = document.createElement("div");
    wrap.className = `dp-msg ${who === "user" ? "dp-user" : "dp-bot"}`;
    wrap.innerHTML = `
      <div>${text}</div>
      <span class="dp-time">${fmt()}</span>
    `;
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
    return wrap;
  };

  const typingOn = () => {
    const n = document.createElement("div");
    n.className = "dp-msg dp-bot";
    n.innerHTML = `<span class="dp-typing"><span></span><span></span><span></span></span>`;
    body.appendChild(n);
    body.scrollTop = body.scrollHeight;
    return n;
  };
  const typingOff = (node) => node && node.remove();

  // ------- Willkommensnachricht -------
  const name = getName();
  bubble(`👋 Hallo, ich bin Ihr Assistent. Ich nenne Sie vorerst „${name}“. Wie kann ich Ihnen helfen?`);

  // ------- Senden / API-Aufruf -------
  let busy = false;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = (input.value || "").trim();
    if (!text || busy) return;

    busy = true;
    bubble(text, "user");
    input.value = "";

    const spinner = typingOn();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          name,
          sessionId: (crypto?.randomUUID?.() || String(Date.now()))
        })
      });

      const data = await res.json().catch(() => ({}));
      typingOff(spinner);

      const reply =
        data?.reply || data?.message || data?.text ||
        "Entschuldigung, das habe ich nicht ganz verstanden.";

      bubble(reply, "bot");

    } catch (err) {
      typingOff(spinner);
      bubble("Es gab gerade ein technisches Problem. Bitte versuchen Sie es erneut.", "bot");
      console.error("Chat error:", err);
    } finally {
      busy = false;
    }
  });
})();