<script>
  (function () {
    const WEBHOOK = "https://eo639chyfs9mcu4.m.pipedream.net"; // <- deine URL

    async function callBot(message, name, sessionId) {
      const payload = {
        text: String(message || ""),
        name: name || "",
        sessionId: sessionId || ""
      };
      const res = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      let data;
      try { data = await res.json(); } catch (e) { data = {}; }

      console.log("BOT status:", res.status, "data:", data);
      // Erwartetes Format: { ok, name, time, reply, sessionId }
      return {
        ok: !!data?.ok,
        name: data?.name || name || "Gast",
        time: data?.time || new Date().toLocaleTimeString("de-DE", {hour:"2-digit",minute:"2-digit"}),
        reply: data?.reply || "Entschuldigung, ich konnte gerade keine Antwort generieren."
      };
    }

    // Beispiel: so bindest du’s an dein UI (vereinfachtes Demo)
    window.Minichat = {
      async send(userText) {
        const r = await callBot(userText, window.MinichatUserName, window.MinichatSession);
        // >>> hier in deine Chat-UI einfügen
        addMessageToUI({ who: "bot", text: r.reply, time: r.time });
      }
    };

    // Dummy-UI-Funktion – ersetze durch deine echte
    function addMessageToUI({ who, text, time }) {
      console.log(`[${time}] ${who}: ${text}`);
    }
  })();
</script>