// Datapilot Chat Widget – Einbindungscode für Websites
// Nutzung: 
// <script src="https://datapilotio.github.io/datapilot_chatbot/widget.js"
//         data-endpoint="https://eozh4llwhc0qn35.m.pipedream.net"></script>

(function(){
  const endpoint = document.currentScript.getAttribute('data-endpoint');
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'https://datapilotio.github.io/datapilot_chatbot/styles.css';
  document.head.appendChild(style);

  const iframe = document.createElement('iframe');
  iframe.src = 'https://datapilotio.github.io/datapilot_chatbot/';
  iframe.id = 'datapilot-frame';
  iframe.style = `
    position:fixed; bottom:24px; right:24px; width:400px; height:520px;
    border:none; border-radius:12px; box-shadow:0 6px 24px rgba(0,0,0,.2);
    display:none; z-index:999999;
  `;
  document.body.appendChild(iframe);

  const btn = document.createElement('button');
  btn.innerHTML = '💬';
  btn.id = 'datapilot-button';
  btn.style = `
    position:fixed; bottom:24px; right:24px; width:60px; height:60px;
    border:none; border-radius:50%; background:#2563eb; color:#fff; 
    font-size:28px; cursor:pointer; box-shadow:0 6px 18px rgba(0,0,0,.3);
    z-index:999998;
  `;
  document.body.appendChild(btn);

  btn.onclick = () => {
    const open = iframe.style.display === 'block';
    iframe.style.display = open ? 'none' : 'block';
  };
})();
