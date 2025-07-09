/******************************************************************
 *  JVS – Early Program Experience Survey custom behaviours
 ******************************************************************/

/* ─────────────────────  FIELD MAPS & CONSTANTS  ─────────────── */
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

/* ─────────────────────  UTILS  ──────────────────────────────── */
const cssVar = (name,fallback) => (getComputedStyle(document.documentElement).getPropertyValue(name)||fallback).trim();

/* ─────────────────────  FLOATING LABELS  ────────────────────── */
function initFloat(w){
  const ta = w.querySelector("textarea");
  if(!ta) return;
  if(!w.dataset.floatInit){
    ta.placeholder = "";
    const sync = () => w.classList.toggle("filled", ta.value.trim()!=="");
    ["input","blur","focus"].forEach(evt => ta.addEventListener(evt, sync));
    w.dataset.floatInit = "1";
  }
  w.classList.toggle("filled", ta.value.trim()!=="");
}

/* ─────────────────────  TILE SIZE RE-APPLIER  ───────────────── */
function forceTileSize(){
  const size   = cssVar("--tile","44px");
  const radius = cssVar("--radius","12px");
  document.querySelectorAll("#tfa_5408 .oneChoice label").forEach(lbl=>{
    lbl.style.width        = size;
    lbl.style.height       = size;
    lbl.style.lineHeight   = size;
    lbl.style.borderRadius = radius;
  });
}

/* ─────────────────────  SCALE CAPTIONS  ─────────────────────── */
function ensureScaleCaptions(){
  const holder = document.querySelector("#tfa_5408-D");
  if(!holder) return;

  if(!holder.querySelector(".apple-caption-start")){
    const start = document.createElement("span");
    start.className = "apple-caption-start";
    start.textContent = "Not at all likely";
    holder.appendChild(start);
  }
  if(!holder.querySelector(".apple-caption-end")){
    const end = document.createElement("span");
    end.className = "apple-caption-end";
    end.textContent = "Extremely likely";
    holder.appendChild(end);
  }
}

/* ─────────────────────  ERROR TEXT / COMMENT ERRORS  ───────── */
function applyErrText(){
  for(const [id,msg] of Object.entries(ERR_TXT)){
    const el = document.getElementById(id);
    if(el) el.textContent = msg;
  }
}
function commentErrors(){
  COMMENTS.forEach(({wrap,ta,err})=>{
    const w = document.querySelector(wrap);
    const t = document.querySelector(ta);
    const e = document.querySelector(err);
    if(!w||!t||!e) return;
    const check = ()=>{
      const visible = e.offsetParent!==null && e.textContent.trim().length;
      if(visible && t.value.trim()===""){w.classList.add("error");e.style.display="flex";}
      else                               {w.classList.remove("error");e.style.display="none";}
    };
    if(!w.dataset.errInit){
      t.addEventListener("focus",()=>{w.classList.remove("error");e.style.display="none";});
      ["blur","input"].forEach(evt => t.addEventListener(evt, check));
      w.dataset.errInit = "1";
    }
    check();
  });
}

/* ─────────────────────  SUBMIT BUTTON LABEL  ────────────────── */
function labelSubmit(){
  document.querySelectorAll(
    '.wForm .actions input[type="submit"], .wForm .actions button[type="submit"], .wForm .actions .primaryAction'
  ).forEach(btn=>{
    (btn.tagName==="INPUT") ? btn.value = "Submit Feedback" : btn.textContent = "Submit Feedback";
    btn.style.display = "inline-block";
  });
}

/* ─────────────────────  MAIN SCAN ROUTINE  ──────────────────── */
function scan(){
  document.querySelectorAll(WRAPPERS).forEach(initFloat);
  applyErrText();
  commentErrors();
  labelSubmit();
  forceTileSize();          // keep 44×44 even after FA inline styles
  ensureScaleCaptions();    // add captions once
  /* title & favicon */
  document.title = "JVS Early Program Experience Survey";
  let link = document.querySelector("link[rel*='icon']") || document.createElement("link");
  link.type = "image/png"; link.rel = "icon";
  link.href = "https://jvs.org/wp-content/uploads/2023/07/JVS-logo-no-tagline.png";
  document.head.appendChild(link);
}

/* ─────────────────────  RUN & OBSERVE  ─────────────────────── */
let queued = false;
function queueScan(){ if(queued) return; queued = true; requestAnimationFrame(()=>{queued=false;scan();}); }

document.addEventListener("DOMContentLoaded", scan);
window.addEventListener("load", scan);
window.addEventListener("pageshow", scan);
new MutationObserver(queueScan).observe(document.body,{childList:true,subtree:true});

/* ─────────────────────  APPLE-STYLE ERROR MODAL  ────────────── */
(function(){
  function hideDefaultTfaModal(){
    Array.from(document.querySelectorAll('div[role="alertdialog"], .ui-dialog, .popup, .modal, .ta-alert, .ta-popup'))
         .forEach(m => {m.style.display="none"; m.setAttribute("aria-hidden","true");});
  }
  function showAppleErrorModal(msg){
    if(document.querySelector(".apple-modal-overlay")) return;
    const defaultMsg = "The form is not complete and has not been submitted yet. There are problems with your submission.";
    const overlay = document.createElement("div");
    overlay.className = "apple-modal-overlay";
    overlay.innerHTML = `
      <div class="apple-modal-box" role="dialog" aria-modal="true" tabindex="-1">
        <div class="modal-logo"><img src="https://jvs.org/wp-content/uploads/2023/07/JVS-logo-no-tagline.png" alt="JVS Logo"></div>
        <div class="modal-title">Form Incomplete</div>
        <div class="modal-msg">${msg || defaultMsg}</div>
        <button type="button" class="modal-btn">Continue</button>
      </div>`;
    document.body.appendChild(overlay);
    setTimeout(()=>overlay.querySelector(".apple-modal-box").focus(),30);
    const close = ()=>overlay.remove();
    overlay.querySelector(".modal-btn").onclick = close;
    document.addEventListener("keydown", function esc(e){
      if(e.key==="Escape"){close();document.removeEventListener("keydown",esc);}
    });
  }
  /* override alert() that FA uses */
  window.alert = msg => showAppleErrorModal(msg);
  /* poll & replace FA’s own modal */
  setInterval(()=>{
    const err = document.querySelector('div[role="alertdialog"], .ui-dialog, .popup, .modal, .ta-alert, .ta-popup');
    if(err && err.offsetParent!==null){
      hideDefaultTfaModal();
      showAppleErrorModal(err.innerText.trim());
    }
  },300);
})();

/* ─────────────────────  RESPONSIVE HELPERS  ─────────────────── */
function adjustSubmitButton(){
  const actions = document.querySelectorAll(".wForm .actions, #tfa_0-actions");
  const buttons = document.querySelectorAll(".wForm .actions input[type='submit'], .wForm .actions button[type='submit'], .wForm .actions .primaryAction");
  if(window.innerWidth<=480){
    actions.forEach(el => {el.style.width="100%";el.style.maxWidth="100%";el.style.padding="0 8px";});
    buttons.forEach(el => {el.style.width="100%";el.style.maxWidth="100%";});
  }
}
function adjustCommentFields(){
  const containers = document.querySelectorAll("#tfa_5420-D, #tfa_5432-D, #tfa_5439-D, #tfa_5444-D, #tfa_1318-D");
  const textareas  = document.querySelectorAll("#tfa_5420-D textarea, #tfa_5432-D textarea, #tfa_5439-D textarea, #tfa_5444-D textarea, #tfa_1318-D textarea");
  if(window.innerWidth<=480){
    containers.forEach(el => {el.style.width="100%";el.style.maxWidth="100%";});
    textareas.forEach(el => {el.style.width="100%";el.style.maxWidth="100%";});
  }
}
document.addEventListener("DOMContentLoaded",()=>{
  adjustSubmitButton();
  adjustCommentFields();
});
window.addEventListener("resize",()=>{
  adjustSubmitButton();
  adjustCommentFields();
});
window.addEventListener("load",()=>{
  adjustSubmitButton();
  adjustCommentFields();
});
