<script type="text/javascript">
(function(){
  const WRAPPERS = [
    "#tfa_5420-D .inputWrapper",
    "#tfa_5432-D .inputWrapper",
    "#tfa_5439-D .inputWrapper",
    "#tfa_5444-D .inputWrapper",
    "#tfa_1318-D .inputWrapper"
  ].join(",");
  const ERR_TXT = {
    "tfa_1290-E":"Select one option.","tfa_1278-E":"Select one option.","tfa_5421-E":"Select one option.",
    "tfa_1266-E":"Select one option.","tfa_1254-E":"Select one option.","tfa_1242-E":"Select one option.",
    "tfa_5440-E":"Select one option.","tfa_5424-E":"Check at least one box.","tfa_5408-E":"Select rating number.",
    "tfa_5420-E":"Enter a comment.","tfa_5432-E":"Enter a comment.","tfa_5439-E":"Enter a comment.",
    "tfa_5444-E":"Enter a comment.","tfa_5433-E":"Select one option."
  };
  const COMMENTS = [
    {wrap:"#tfa_5420-D .inputWrapper", ta:"#tfa_5420", err:"#tfa_5420-E"},
    {wrap:"#tfa_5432-D .inputWrapper", ta:"#tfa_5432", err:"#tfa_5432-E"},
    {wrap:"#tfa_5439-D .inputWrapper", ta:"#tfa_5439", err:"#tfa_5439-E"},
    {wrap:"#tfa_5444-D .inputWrapper", ta:"#tfa_5444", err:"#tfa_5444-E"},
    {wrap:"#tfa_1318-D .inputWrapper", ta:"#tfa_1318", err:"#tfa_1318-E"}
  ];

  function initFloat(w){
    const ta = w.querySelector("textarea");
    if(!ta) return;
    if(!w.dataset.floatInit){
      ta.placeholder="";
      const sync=()=>w.classList.toggle("filled",ta.value.trim()!=="");
      ["input","blur","focus"].forEach(e=>ta.addEventListener(e,sync));
      w.dataset.floatInit="1";
    }
    w.classList.toggle("filled",ta.value.trim()!=="");
  }
  function applyErrText(){
    for(const [id,msg] of Object.entries(ERR_TXT)){
      const el=document.getElementById(id);
      if(el) el.textContent=msg;
    }
  }
  function commentErrors(){
    COMMENTS.forEach(({wrap,ta,err})=>{
      const w = document.querySelector(wrap);
      const t = document.querySelector(ta);
      const e = document.querySelector(err);
      if(!w||!t||!e) return;
      const check=()=>{
        const visible=e.offsetParent!==null && e.textContent.trim().length;
        if(visible && t.value.trim()===""){
          w.classList.add("error"); e.style.display="flex";
        }else{
          w.classList.remove("error"); e.style.display="none";
        }
      };
      if(!w.dataset.errInit){
        t.addEventListener("focus", ()=>{w.classList.remove("error");e.style.display="none";});
        t.addEventListener("blur",  check);
        t.addEventListener("input", check);
        w.dataset.errInit="1";
      }
      check();
    });
  }
  function labelSubmit(){
    document.querySelectorAll(
      '.wForm .actions input[type="submit"], .wForm .actions button[type="submit"], .wForm .actions .primaryAction'
    ).forEach(btn=>{
      if(btn.tagName==="INPUT") btn.value="Submit Feedback";
      else                      btn.textContent="Submit Feedback";
      btn.style.display="inline-block";
    });
  }
  function scan(){
    document.querySelectorAll(WRAPPERS).forEach(initFloat);
    applyErrText();
    commentErrors();
    labelSubmit();
    document.title = "JVS Early Program Experience Survey"; // Set the browser tab title
    // Set the favicon
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = 'https://jvs.org/wp-content/uploads/2023/07/JVS-logo-no-tagline.png';
    document.head.appendChild(link);
  }
  let queued = false;
  function queueScan(){
    if(queued) return;
    queued = true;
    requestAnimationFrame(()=>{queued=false; scan();});
  }
  document.addEventListener("DOMContentLoaded", scan);
  window.addEventListener("load",     scan);
  window.addEventListener("pageshow", scan);
  new MutationObserver(queueScan).observe(document.body,{childList:true,subtree:true});

  function hideDefaultTfaModal(){
    var modals = Array.from(document.querySelectorAll('div[role="alertdialog"], .ui-dialog, .popup, .modal, .ta-alert, .ta-popup'));
    modals.forEach(m=>{m.style.display="none"; m.setAttribute("aria-hidden","true");});
  }
  function showAppleErrorModal(msg){
    if(document.querySelector('.apple-modal-overlay')) return;
    let defaultMsg = "The form is not complete and has not been submitted yet. There are 10 problems with your submission.";
    var overlay = document.createElement('div');
    overlay.className = "apple-modal-overlay";
    overlay.innerHTML = `
      <div class="apple-modal-box" role="dialog" aria-modal="true" tabindex="-1">
        <div class="modal-logo">
          <img src="https://jvs.org/wp-content/uploads/2023/07/JVS-logo-no-tagline.png" alt="JVS Logo"/>
        </div>
        <div class="modal-title">Form Incomplete</div>
        <div class="modal-msg">${msg?msg:defaultMsg}</div>
        <button type="button" class="modal-btn">Continue</button>
      </div>`;
    document.body.appendChild(overlay);
    setTimeout(()=>overlay.querySelector('.apple-modal-box').focus(),30);
    var close=()=>overlay.remove();
    overlay.querySelector('.modal-btn').onclick=close;
    document.addEventListener('keydown', function esc(e){
      if(e.key==="Escape"){ close(); document.removeEventListener('keydown',esc); }
    });
  }
  var origAlert=window.alert;
  window.alert = function(msg){ showAppleErrorModal(msg); };
  function interceptErrorModal(){
    setInterval(function(){
      var err=document.querySelector('div[role="alertdialog"], .ui-dialog, .popup, .modal, .ta-alert, .ta-popup');
      if(err&&err.offsetParent!==null){
        hideDefaultTfaModal();
        var txt=err.innerText.trim();
        showAppleErrorModal(txt);
      }
    },300);
  }
  function adjustSubmitButton(){
    const actions=document.querySelectorAll('.wForm .actions, #tfa_0-actions');
    const buttons=document.querySelectorAll('.wForm .actions input[type="submit"], .wForm .actions button[type="submit"], .wForm .actions .primaryAction');
    if(window.innerWidth<=480){
      actions.forEach(el=>{el.style.width='100%'; el.style.maxWidth='100%'; el.style.padding='0 8px';});
      buttons.forEach(el=>{el.style.width='100%'; el.style.maxWidth='100%';});
    }
  }
  function adjustCommentFields(){
    const containers=document.querySelectorAll('#tfa_5420-D, #tfa_5432-D, #tfa_5439-D, #tfa_5444-D, #tfa_1318-D');
    const textareas=document.querySelectorAll('#tfa_5420-D textarea, #tfa_5432-D textarea, #tfa_5439-D textarea, #tfa_5444-D textarea, #tfa_1318-D textarea');
    if(window.innerWidth<=480){
      containers.forEach(el=>{ el.style.width='100%'; el.style.maxWidth='100%'; });
      textareas.forEach(el=>{ el.style.width='100%'; el.style.maxWidth='100%'; });
    }
  }
  document.addEventListener('DOMContentLoaded',()=>{
    interceptErrorModal();
    adjustSubmitButton();
    adjustCommentFields();
  });
  window.addEventListener('resize',()=>{
    adjustSubmitButton();
    adjustCommentFields();
  });
  window.addEventListener('load',()=>{
    adjustSubmitButton();
    adjustCommentFields();
  });
})();
</script>
