(function () {
  const cfg = document.currentScript?.dataset || {};
  const ENDPOINT = cfg.endpoint || "";
  const TITLE = cfg.title || "Assistent";
  const ACCENT = cfg.accent || "#2563eb";

  // Button (kleines, rundes, blaues Icon)
  const btn = document.createElement("button");
  btn.setAttribute("aria-label", "Chat öffnen");
  btn.id = "dp-btn";
  btn.style.cssText = `
    position:fixed; right:24px; bottom:24px; z-index:999999;
    width:56px; height:56px; border-radius:50%;
    border:none; outline:none; cursor:pointer;
    background:${ACCENT}; color:#fff; box-shadow:0 8px 24px rgba(0,0,0,.18);
    display:flex; align-items:center; justify-content:center;
  `;
  // kleines Chat-SVG
  btn.innerHTML = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z"/>
  </svg>`;
  document.body.appendChild(btn);

  // Iframe (kompaktes Fenster)
  const frame = document.createElement("iframe");
  frame.id = "dp-frame";
  frame.title = TITLE;
  frame.src = "chat.html"; // gleiche Repo-Root-Datei
  frame.style.cssText = `
    position:fixed; right:24px; bottom:92px; z-index:999998;
    width:360px; height:520px; display:none; border:0;
    border-radius:14px; box-shadow:0 16px 48px rgba(0,0,0,.22); background:#fff;
    max-width:calc(100vw - 32px); max-height:calc(100vh - 140px);
  `;
  document.body.appendChild(frame);

  // Toggle
  let open = false;
  btn.addEventListener("click", () => {
    open = !open;
    frame.style.display = open ? "block" : "none";
    if (open) {
      // Konfiguration an das Iframe schicken
      frame.contentWindow?.postMessage({type:"dp_init", endpoint:ENDPOINT, title:TITLE, accent:ACCENT}, "*");
    }
  });

  // Falls jemand das Iframe direkt lädt, erneut die Config senden, wenn es bereit meldet
  window.addEventListener("message", (e) => {
    if (e?.data?.type === "dp_ready") {
      frame.contentWindow?.postMessage({type:"dp_init", endpoint:ENDPOINT, title:TITLE, accent:ACCENT}, "*");
    }
  });
})(); 