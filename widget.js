(function () {
  // 👉 HIER DEINE PIPEDREAM-URL EINTRAGEN:
  const WEBHOOK = "https://eo639chyfs9mcu4.m.pipedream.net";

  // Chat-Button (das blaue Symbol unten rechts)
  const fab = document.createElement("button");
  fab.className = "dp-fab";
  fab.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 3a9 9 0 0 0-9 9c0 1.53.38 2.97 1.06 4.22L3 21l4.9-1.03A9 9 0 1 0 12 3z"/>
  </svg>`;
  document.body.appendChild(fab);

  // Chatfenster
  const chat = document.createElement("div");
  chat.className = "dp-chat";
  chat.innerHTML = `
    <div class="dp-header">
      <div class="title">Assistent</div>
      <div class="close" title="Schließen">✕</div>
    </div>
    <div class="dp-body"></div>
    <div class="dp-input">
      <input type="text" placeholder="Nachricht schreiben…" />
      <button>Senden</button>
    </div>
  `;
  document.body.appendChild(chat);

  const bodyEl  = chat.querySelector(".dp-body");
  const inputEl = chat.querySelector("input");
  const sendBtn = chat.querySelector("button");
  const closeEl = chat.querySelector(".close");

  // Benutzername + Sitzung
  const sessionId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
  const guestName = "Gast-" + Math.floor(1000 + Math.random() * 9000);

  // Öffnen / Schließen
  fab.onclick = () => chat.classList.toggle("open");
  closeEl.onclick = () => chat.classList.remove("open");

  // Hilfsfunktionen
  function now() {
    return new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  }
  function addMsg(text, who = "bot", time = now()) {
    const msg = document.createElement("div");
    msg.className = "dp-msg" + (who === "user" ? " user" : "");
    msg.innerHTML = `<div class="dp-text">${text}</div><div class="dp-time">${time}</div>`;
    bodyEl.appendChild(msg);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  // Begrüßung
  addMsg(`Hallo! Ich bin Assistent. Ich nenne Sie vorerst „${guestName}“. Wie kann ich helfen?`);

  // Nachricht senden
  async function send() {
    const text = inputEl.value.trim();
    if (!text) return;
    addMsg(text, "user");
    inputEl.value = "";

    try {
      const res = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, name: guestName, sessionId })
      });

      let data = {};
      try { data = await res.json(); } catch {}

      console.log("BOT status:", res.status, data);

      const botText = data?.reply || "Entschuldigung, gerade gab es ein Problem.";
      const t = data?.time || now();

      addMsg(botText, "bot", t);
    } catch (e) {
      console.error("Fetch error:", e);
      addMsg("Entschuldigung, die Verbindung ist fehlgeschlagen. Bitte später erneut versuchen.", "bot");
    }
  }

  sendBtn.onclick = send;
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
  });
})();