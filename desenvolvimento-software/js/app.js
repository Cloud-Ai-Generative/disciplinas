/* ═══════════ MERMAID ═══════════ */
function getMermaidTheme(){return document.documentElement.getAttribute('data-theme')==='light'?'default':'dark';}
function initMermaid(){mermaid.initialize({startOnLoad:false,theme:getMermaidTheme(),securityLevel:'loose',flowchart:{useMaxWidth:false,htmlLabels:true,curve:'basis',padding:20},sequence:{useMaxWidth:false,actorMargin:50,width:150,height:40,boxMargin:8,noteMargin:10,messageMargin:35},er:{useMaxWidth:true},themeVariables:{fontSize:'14px'}});}
async function renderMermaidIn(c){if(!window.mermaid||!c)return;for(const b of c.querySelectorAll('.mermaid-box:not([data-rendered])')){const code=b.dataset.code,n=b.querySelector('.mermaid');if(!n||!code)continue;try{const{svg}=await mermaid.render('m'+Math.random().toString(36).slice(2,8),code);n.innerHTML=svg;b.setAttribute('data-rendered','1');}catch(e){n.innerHTML='<pre style="color:#ef4444;padding:10px">Erro: '+e.message+'</pre>';}}}
const MM_TOOLBAR=`<div class="mermaid-toolbar"><button class="mermaid-btn" onclick="showMermaidCode(this)" title="Ver/copiar código Mermaid"><span class="ico">⟨/⟩</span><span class="lbl">Código</span></button><button class="mermaid-btn" onclick="mZoom(this.closest('.mermaid-box'),-1)" title="− zoom"><span class="ico">−</span><span class="lbl">Zoom</span></button><button class="mermaid-btn" onclick="mZoom(this.closest('.mermaid-box'),1)" title="+ zoom"><span class="ico">+</span><span class="lbl">Zoom</span></button><button class="mermaid-btn" onclick="mZoom(this.closest('.mermaid-box'),0)" title="reset"><span class="ico">↺</span><span class="lbl">Reset</span></button><button class="mermaid-btn" onclick="mFS(this.closest('.mermaid-box'),1)" title="tela cheia"><span class="ico">⛶</span><span class="lbl">Tela Cheia</span></button></div><button class="mermaid-close-fs" onclick="mFS(this.closest('.mermaid-box'),0)">✕</button>`;
function injectMermaidToolbars(){document.querySelectorAll('.mermaid-box').forEach(b=>{if(!b.querySelector('.mermaid-toolbar'))b.insertAdjacentHTML('afterbegin',MM_TOOLBAR);});}
const ZL=['','zoom-125','zoom-150','zoom-175','zoom-200'];
function mZoom(b,d){let c=0;ZL.forEach((k,i)=>{if(k&&b.classList.contains(k))c=i;});c=d===0?0:Math.max(0,Math.min(4,c+d));ZL.forEach(k=>k&&b.classList.remove(k));if(ZL[c])b.classList.add(ZL[c]);}
function mFS(b,on){b.classList.toggle('fullscreen',!!on);document.body.style.overflow=on?'hidden':'';}
function showMermaidCode(btn){document.getElementById('modal-code-content').textContent=btn.closest('.mermaid-box').dataset.code;document.getElementById('code-modal').classList.add('active');}
function closeCodeModal(){document.getElementById('code-modal').classList.remove('active');}
function copyModalCode(f){const c=document.getElementById('modal-code-content').textContent;const out=f==='gitlab'?'```mermaid\n'+c+'\n```':c;navigator.clipboard.writeText(out).then(()=>{const b=document.getElementById(f==='gitlab'?'modal-copy-gitlab':'modal-copy-raw');const o=b.innerHTML;b.innerHTML='✅ Copiado!';b.style.background='var(--success)';showToast(f==='gitlab'?'🦊 Formato GitLab copiado!':'📋 Mermaid copiado!');setTimeout(()=>{b.innerHTML=o;b.style.background='';},2000);});}
function copyCode(btn){const w=btn.closest('.code-editor-wrap')||btn.parentElement;const p=w.querySelector('.code-editor,pre');if(!p)return;navigator.clipboard.writeText(p.textContent).then(()=>{const o=btn.textContent;btn.textContent='✅ Copiado!';btn.classList.add('copied');setTimeout(()=>{btn.textContent='📋 Copiar';btn.classList.remove('copied');},1500);});}
/* ═══════════ TABS / SUBTABS ═══════════ */
/* ── PATCH E2: lazy-load de abas (fetch tabs/*.html) ── */
function loadTab(t){
  const p=document.getElementById(t);
  if(!p)return Promise.reject(new Error('Painel '+t+' não existe no index.html'));
  if(p.dataset.loaded)return Promise.resolve();
  p.dataset.loaded='1';
  return fetch('tabs/'+t+'.html')
    .then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.text();})
    .then(html=>{p.innerHTML=html;initTab(t);injectMermaidToolbars();renderMermaidIn(p);})
    .catch(e=>{p.dataset.loaded='';throw e;});
}
function initTab(t){
  if(t==='tab1'){switchBaseOs('win');}
  if(t==='tab2'){makeInitz('sim-lab');}
  if(t==='tab6'){makeInitz('sim-proj');}
  if(t==='tab4'){const y=document.getElementById('contract-yaml');if(y)y.textContent=currentContract();meetReset();}
  if(t==='tab8'){meet2Reset();}
}
function switchTab(t){
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===t));
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.toggle('active',p.id===t));
  const panel=document.getElementById(t);
  if(panel&&!panel.dataset.loaded){
    loadTab(t).catch(e=>{panel.innerHTML='<div class="card"><div class="warning-banner"><strong>⚠️ Erro ao carregar tabs/'+t+'.html:</strong> '+e.message+' — sirva a página via HTTP (npx serve / Live Server / GitHub Pages).</div></div>';});
  }else{
    setTimeout(()=>renderMermaidIn(panel),80);
  }
  window.scrollTo({top:0,behavior:'smooth'});
}
function switchSubTab(s){document.querySelectorAll('.sub-tab-btn').forEach(b=>b.className='sub-tab-btn '+(b.dataset.sub===s?'btn btn-primary':'btn'));document.querySelectorAll('.sub-panel').forEach(p=>p.classList.toggle('active',p.id===s));setTimeout(()=>renderMermaidIn(document.querySelector('.sub-panel.active')),80);}
</script> 
