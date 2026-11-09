/* ═══════════ ODA: Arquitetura de Microsserviços e APIs (base: ODA DevEnv) ═══════════ */
const TEMA_KEY = 'amaTheme';

/* ── Mermaid ── */
function getMermaidTheme(){return document.documentElement.getAttribute('data-theme')==='dark'?'dark':'default';}
function initMermaid(){mermaid.initialize({startOnLoad:false,theme:getMermaidTheme(),securityLevel:'strict',flowchart:{useMaxWidth:false,htmlLabels:true,curve:'basis',padding:20},sequence:{useMaxWidth:false,actorMargin:50,width:160,height:44,boxMargin:8,noteMargin:10,messageMargin:35},themeVariables:{fontSize:'18px'}});}
async function renderMermaidIn(c){if(!window.mermaid||!c)return;for(const b of c.querySelectorAll('.mermaid-box:not([data-rendered])')){const code=b.dataset.code,n=b.querySelector('.mermaid');if(!n||!code)continue;try{const{svg}=await mermaid.render('m'+Math.random().toString(36).slice(2,8),code);n.innerHTML=svg;b.setAttribute('data-rendered','1');}catch(e){n.innerHTML='<pre style="color:#ef4444;padding:10px">Erro no diagrama: '+e.message+'</pre>';}}}
const MM_TOOLBAR=`<div class="mermaid-toolbar"><button class="mermaid-btn" onclick="showMermaidCode(this)" title="Ver e copiar o código Mermaid"><span class="ico">⟨/⟩</span><span class="lbl">Código</span></button><button class="mermaid-btn" onclick="mZoom(this.closest('.mermaid-box'),-1)" title="Diminuir"><span class="ico">−</span><span class="lbl">Zoom</span></button><button class="mermaid-btn" onclick="mZoom(this.closest('.mermaid-box'),1)" title="Aumentar"><span class="ico">+</span><span class="lbl">Zoom</span></button><button class="mermaid-btn" onclick="mZoom(this.closest('.mermaid-box'),0)" title="Tamanho original"><span class="ico">↺</span><span class="lbl">Reset</span></button><button class="mermaid-btn" onclick="mFS(this.closest('.mermaid-box'),1)" title="Tela cheia"><span class="ico">⛶</span><span class="lbl">Tela cheia</span></button></div><button class="mermaid-close-fs" onclick="mFS(this.closest('.mermaid-box'),0)">✕</button>`;
function injectMermaidToolbars(){document.querySelectorAll('.mermaid-box').forEach(b=>{if(!b.querySelector('.mermaid-toolbar'))b.insertAdjacentHTML('afterbegin',MM_TOOLBAR);});}
const ZL=['','zoom-125','zoom-150','zoom-175','zoom-200'];
function mZoom(b,d){let c=0;ZL.forEach((k,i)=>{if(k&&b.classList.contains(k))c=i;});c=d===0?0:Math.max(0,Math.min(4,c+d));ZL.forEach(k=>k&&b.classList.remove(k));if(ZL[c])b.classList.add(ZL[c]);}
function mFS(b,on){b.classList.toggle('fullscreen',!!on);document.body.style.overflow=on?'hidden':'';}
function showMermaidCode(btn){document.getElementById('modal-code-content').textContent=btn.closest('.mermaid-box').dataset.code;document.getElementById('code-modal').classList.add('active');}
function closeCodeModal(){document.getElementById('code-modal').classList.remove('active');}
function copyModalCode(f){const c=document.getElementById('modal-code-content').textContent;const out=f==='github'?'```mermaid\n'+c+'\n```':c;navigator.clipboard.writeText(out).then(()=>showToast(f==='github'?'Formato GitHub copiado!':'Mermaid copiado!'));}
function copyCode(btn){const w=btn.closest('.code-editor-wrap')||btn.parentElement;const p=w.querySelector('.code-editor,pre');if(!p)return;navigator.clipboard.writeText(p.textContent).then(()=>{btn.textContent='✅ Copiado!';btn.classList.add('copied');setTimeout(()=>{btn.textContent='📋 Copiar';btn.classList.remove('copied');},1500);});}

/* ── Abas (lazy-load de tabs/*.html) ── */
function loadTab(t){
  const p=document.getElementById(t);
  if(!p)return Promise.reject(new Error('Painel '+t+' não existe'));
  if(p.dataset.loaded)return Promise.resolve();
  p.dataset.loaded='1';
  return fetch('tabs/'+t+'.html')
    .then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.text();})
    .then(html=>{const tmp=document.createElement('div');tmp.innerHTML=html.trim();const sec=tmp.querySelector('section.tab-panel');p.innerHTML=sec?sec.innerHTML:html;injectMermaidToolbars();renderMermaidIn(p);})
    .catch(e=>{p.dataset.loaded='';throw e;});
}
function irAncora(a){const el=document.getElementById(a);if(!el)return;el.style.scrollMarginTop='90px';el.scrollIntoView({behavior:'smooth',block:'start'});el.classList.add('ancora-destaque');setTimeout(()=>el.classList.remove('ancora-destaque'),2200);}
function switchTab(t,a){
  const panel=document.getElementById(t);if(!panel)return;
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===t));
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.toggle('active',p.id===t));
  if(!panel.dataset.loaded){
    loadTab(t).then(()=>{if(a)setTimeout(()=>irAncora(a),350);}).catch(e=>{panel.innerHTML='<div class="card"><div class="warning-banner"><strong>⚠️ Erro ao carregar tabs/'+t+'.html:</strong> '+e.message+'. Abra a página por um servidor HTTP (GitHub Pages, Live Server ou npx serve), não direto do arquivo.</div></div>';});
  }else{setTimeout(()=>renderMermaidIn(panel),80);if(a)setTimeout(()=>irAncora(a),150);}
  if(!a)window.scrollTo({top:0,behavior:'smooth'});
  try{history.replaceState(null,'','#'+t);}catch(e){}
}

/* ── Checkpoint (quiz) ── */
function responder(btn){
  const q=btn.closest('.quiz-q');if(q.dataset.done)return;q.dataset.done='1';
  const ok=btn.dataset.correct==='1';
  btn.classList.add(ok?'ok':'bad');
  if(!ok)q.querySelectorAll('.quiz-opt').forEach(o=>{if(o.dataset.correct==='1')o.classList.add('ok');});
  const fb=q.querySelector('.quiz-fb');fb.innerHTML=(ok?'<strong>✅ Isso mesmo.</strong> ':'<strong>Quase.</strong> ')+fb.dataset.exp;fb.classList.add('show');
}
function refazerQuiz(id){document.querySelectorAll('#'+id+' .quiz-q').forEach(q=>{delete q.dataset.done;q.querySelectorAll('.quiz-opt').forEach(o=>o.classList.remove('ok','bad'));q.querySelector('.quiz-fb').classList.remove('show');});}

/* ── Diversos ── */
function showToast(m){const c=document.getElementById('toast-container');const d=document.createElement('div');d.className='toast';d.textContent=m;c.appendChild(d);setTimeout(()=>{d.classList.add('hiding');setTimeout(()=>d.remove(),300);},3000);}
function toggleFaq(e){e.classList.toggle('open');}
function filterGloss(){const t=document.getElementById('gloss-search').value.toLowerCase();document.querySelectorAll('#gloss-table tbody tr').forEach(r=>{r.style.display=r.textContent.toLowerCase().includes(t)?'':'none';});}
const INDICE=[
  {tab:'inicio',title:'Início: a PagUai',k:'pagUai fintech história personagens helena joana rafa geraldo sprints mapa unidade jornada'},
  {tab:'sprint-00',title:'Sprint 0: o monólito',k:'monólito monolito docker compose scalar mailpit postgres adr vantagens custos deploy acoplamento laboratório checkpoint c4'},
  {tab:'problemas',title:'Problemas comuns',k:'erro porta ocupada 8080 port already allocated dns resource temporarily unavailable root dubious ownership buildx migration health errou'},
  {tab:'glossario',title:'Glossário',k:'glossário termos definição monólito microsserviço adr c4 contêiner compose migration smtp'}
];
function runGlobalSearch(term){const res=document.getElementById('global-search-results');if(!term||term.length<2){res.classList.remove('active');return;}const t=term.toLowerCase();const f=INDICE.filter(x=>x.title.toLowerCase().includes(t)||x.k.includes(t));res.innerHTML=f.length?f.map(x=>'<div class="search-result-item" onclick="switchTab(\''+x.tab+'\');this.parentElement.classList.remove(\'active\');document.getElementById(\'global-search-input\').value=\'\'"><strong>'+x.title+'</strong></div>').join(''):'<div class="search-result-item text-muted">Nada encontrado.</div>';res.classList.add('active');}
function alternarTema(){const n=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',n);try{localStorage.setItem(TEMA_KEY,n);}catch(e){}document.querySelectorAll('.mermaid-box').forEach(b=>b.removeAttribute('data-rendered'));initMermaid();renderMermaidIn(document.querySelector('.tab-panel.active'));}

document.addEventListener('keydown',e=>{const tg=e.target.tagName;if(tg==='INPUT'||tg==='TEXTAREA'){if(e.key==='Escape')e.target.blur();return;}
  if(e.key==='/'){document.getElementById('global-search-input').focus();e.preventDefault();}
  if(e.key.toLowerCase()==='d'&&!e.ctrlKey&&!e.metaKey){alternarTema();e.preventDefault();}
  if(e.ctrlKey&&e.shiftKey&&e.key.toLowerCase()==='f'){document.body.classList.toggle('focus-mode');e.preventDefault();}
  if(e.key==='Escape'){closeCodeModal();document.querySelectorAll('.mermaid-box.fullscreen').forEach(b=>mFS(b,0));document.getElementById('global-search-results').classList.remove('active');}});
document.addEventListener('click',e=>{if(!e.target.closest('.global-search'))document.getElementById('global-search-results').classList.remove('active');});
window.addEventListener('DOMContentLoaded',()=>{
  try{const st=localStorage.getItem(TEMA_KEY);if(st)document.documentElement.setAttribute('data-theme',st);}catch(e){}
  initMermaid();
  const inicial=(location.hash||'').slice(1);
  switchTab(document.getElementById(inicial)?inicial:'inicio');
  document.getElementById('theme-toggle').onclick=alternarTema;
  document.getElementById('focus-toggle').onclick=()=>document.body.classList.toggle('focus-mode');
  document.getElementById('print-btn').onclick=()=>window.print();
});
window.addEventListener('hashchange',()=>{const t=(location.hash||'').slice(1);const btn=document.querySelector('.tab-btn[data-tab="'+t+'"]');if(btn&&!btn.classList.contains('active'))switchTab(t);});
(function(){const st=document.createElement('style');st.textContent='.ancora-destaque{outline:3px solid var(--primary);outline-offset:4px;border-radius:8px;transition:outline-color .6s}';document.head.appendChild(st);})();
