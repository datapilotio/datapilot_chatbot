(function () {
  const script    = document.currentScript;
  const ENDPOINT  = script.getAttribute('data-endpoint') || '';
  const CHAT_URL  = script.getAttribute('data-chat-url') || 'Chatbot.html';

  // --- Iframe (geschlossen, feste Größe) ---
  const iframe = document.createElement('iframe');
  iframe.src   = CHAT_URL;
  iframe.id    = 'datapilot-frame';
  iframe.style.cssText = `
    position: fixed; inset:auto 24px 24px auto;
    width: 380px; height: 520px;
    display: none; border: 0; border-radius: 14px;
    box-shadow: var(--dp-shadow);
    z-index: 2147483647; background:#fff;
  `;
  iframe.setAttribute('title','Chatfenster');
  iframe.setAttribute('aria-hidden','true');
  document.body.appendChild(iframe);

  // --- Button (kleines blaues Icon) ---
  const btn = document.createElement('button');
  btn.id = 'datapilot-button';
  btn.setAttribute('aria-expanded','false');
  btn.setAttribute('aria-controls','datapilot-frame');
  btn.style.cssText = `
    position: fixed; inset:auto 24px 24px auto;
    width: 56px; height: 56px; border: none; border-radius: 50%;
    background: #2563eb; color: #fff; cursor: pointer;
    box-shadow: var(--dp-shadow);
    z-index: 2147483646; display:flex; align-items:center; justify-content:center;
  `;
  // kleines Chat-SVG
  btn.innerHTML = `
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 14c-.6 0-1-.4-1-1V7c0-1.7 1.3-3 3-3h9c1.7 0 3 1.3 3 3v6c0 1.7-1.3 3-3 3H9l-3.2 2.4c-.6.4-1.4 0-1.4-.7V14Z" fill="#fff"/>
    </svg>`;
  document.body.appendChild(btn);

  // Toggle
  const toggle = () => {
    const open = iframe.style.display === 'none';
    iframe.style.display = open ? 'block' : 'none';
    iframe.setAttribute('aria-hidden', open ? 'false' : 'true');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  btn.addEventListener('click', toggle);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && iframe.style.display !== 'none') toggle();
  });

  // Übergabe der Endpoint-URL an das Iframe (postMessage)
  window.addEventListener('message', (ev) => {
    if (ev.source === iframe.contentWindow && ev.data === 'datapilot:need-endpoint') {
      iframe.contentWindow.postMessage({ type: 'datapilot:endpoint', endpoint: ENDPOINT }, '*');
    }
  });
})();