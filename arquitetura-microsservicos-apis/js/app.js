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
    .then(html=>{const tmp=document.createElement('div');tmp.innerHTML=html.trim();const sec=tmp.querySelector('section.tab-panel');p.innerHTML=sec?sec.innerHTML:html;injectMermaidToolbars();renderMermaidIn(p);posCarregar(p);})
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

/* ── Checkpoint: feedback por alternativa, com "tente outra" ── */
function fimFrase(t){t=(t||'').trim();return /[.!?]$/.test(t)?t:t+'.';}
function rotulo(o){const t=o.textContent.trim().replace(/[.]$/,'');return '<em>'+t+'</em>'+(o.dataset.exp?': '+fimFrase(o.dataset.exp):'.');}
function listaOutras(c,certa,icone){
  const itens=[...c.querySelectorAll('.quiz-opt')].filter(o=>o!==certa&&o.dataset.exp);
  if(!itens.length)return '';
  return '<details class="outras"><summary>Ver por que as outras opções não servem</summary><ul class="exp-opcoes">'+itens.map(o=>'<li>'+icone(o)+' <strong>'+o.textContent.trim().replace(/[.]$/,'')+'</strong>: '+fimFrase(o.dataset.exp)+'</li>').join('')+'</ul></details>';
}
function responder(btn){
  const q=btn.closest('.quiz-q');if(q.dataset.done||btn.disabled)return;
  const fb=q.querySelector('.quiz-fb');
  if(btn.dataset.correct!=='1'){
    btn.classList.add('bad');btn.disabled=true;
    fb.innerHTML='<strong>🔴 Ainda não.</strong> '+rotulo(btn)+' <strong>Tente outra opção.</strong>';
    fb.classList.add('show');return;
  }
  q.dataset.done='1';btn.classList.add('ok');q.querySelectorAll('.quiz-opt').forEach(o=>o.disabled=true);
  fb.innerHTML='<strong>🎉 Isso mesmo, '+nomeAluno()+'!</strong> '+rotulo(btn)+' '+(fb.dataset.exp||'')+listaOutras(q,btn,()=>'🔴');
  fb.classList.add('show');
}
function refazerQuiz(id){document.querySelectorAll('#'+id+' .quiz-q').forEach(q=>{delete q.dataset.done;q.querySelectorAll('.quiz-opt').forEach(o=>{o.classList.remove('ok','bad');o.disabled=false;});q.querySelector('.quiz-fb').classList.remove('show');});}

/* ── Diversos ── */
function showToast(m){const c=document.getElementById('toast-container');const d=document.createElement('div');d.className='toast';d.textContent=m;c.appendChild(d);setTimeout(()=>{d.classList.add('hiding');setTimeout(()=>d.remove(),300);},3000);}
function toggleFaq(e){e.classList.toggle('open');}
function filterGloss(){const t=document.getElementById('gloss-search').value.toLowerCase();document.querySelectorAll('#gloss-table tbody tr').forEach(r=>{r.style.display=r.textContent.toLowerCase().includes(t)?'':'none';});}
const INDICE=[
  {tab:'inicio',title:'Início: a PagUai',k:'pagUai fintech história personagens helena joana rafa diego geraldo tech lead product owner sre coordenadora arquitetura avatar crachá sprints mapa unidade jornada'},
  {tab:'sprint-02',title:'Sprint 2: Strangler Fig e API First',k:'strangler fig gateway yarp extrato serviço síncrona assíncrona contrato openapi api first design first contract first code first mock prism spectral lint sala de contrato lívia paginação cursor problem details rfc 9457 falha parcial timeout 502 503 adr 0004'},
  {tab:'sprint-01',title:'Sprint 1: bounded contexts e monólito modular',k:'bounded context contexto delimitado ddd domínio subdomínio central suporte genérico linguagem ubíqua mapa de contextos monólito modular contrato schema testes de arquitetura netarchtest saldo pagamentos extrato adr 0002 0003 critérios extração event storming'},
  {tab:'sprint-00',title:'Sprint 0: o monólito',k:'monólito monolito docker compose scalar mailpit postgres adr vantagens custos deploy acoplamento laboratório checkpoint c4'},
  {tab:'ambiente',title:'Ambiente: preparar a máquina',k:'ambiente instalar docker desktop engine git vs code dotnet sdk winget brew apt codespaces verificar check-env progresso windows macos linux'},
  {tab:'diagramas',title:'Diagramas e ADRs',k:'diagrama desenho solução implantação resiliência c4 adr como ler zona disponibilidade aws azure google cloud fluxo pix legenda'},
  {tab:'tecnologias',title:'Tecnologias e nuvem',k:'ficha tecnologia nuvem aws azure google cloud equivalente postgresql docker compose mailpit scalar dotnet rds cloud sql'},
  {tab:'problemas',title:'Problemas comuns',k:'git tag checkout fetch detached head diff stash erro porta ocupada 8080 port already allocated dns resource temporarily unavailable root dubious ownership buildx migration health errou'},
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

/* ═══════════ Recursos trazidos da ODA SENAC (adaptados à PagUai) ═══════════ */
const PASSOS_KEY='amaPassos', SO_KEY='amaSO', PERFIL_KEY='amaPerfil';
const NOME_PADRAO='Arquiteto(a)', AVATAR_PADRAO='🧑‍💻';
function posCarregar(p){if(window.iniciarSalas)iniciarSalas(p);renderBuscas(p);restaurarPassos(p);atualizarProgresso();aplicarPerfil(p);const so=document.body.getAttribute('data-so');if(so)escolherSO(so);}

/* ── Buscas para ir além (Google, YouTube e Google Acadêmico) ── */
const URL_BUSCA={g:['🔎 Google','https://www.google.com/search?hl=pt-BR&q='],y:['🎬 YouTube','https://www.youtube.com/results?search_query='],s:['🎓 Google Acadêmico','https://scholar.google.com/scholar?hl=pt-BR&q=']};
function linkBusca(tipo,termo){const [rot,url]=URL_BUSCA[tipo];return '<a class="ext" target="_blank" rel="noopener" href="'+url+encodeURIComponent(termo)+'">'+rot+': <em>'+termo+'</em></a>';}
function blocoTermo(termo,tipos){return '<div class="busca-item">'+tipos.split('').map(t=>linkBusca(t,termo)).join('')+'</div>';}
function renderBuscas(c){c.querySelectorAll('.buscas:not([data-ok])').forEach(b=>{
  let html='<h5>🔗 Buscas para ir além</h5>';
  try{if(b.dataset.itens){JSON.parse(b.dataset.itens).forEach(t=>html+=blocoTermo(t,'gy'));}
      if(b.dataset.scholar){html+='<div class="busca-item">'+linkBusca('s',b.dataset.scholar)+'</div>';}}catch(e){return;}
  b.innerHTML=html;b.setAttribute('data-ok','1');});}

/* ── Progresso dos passos (salvo só neste navegador) ── */
function lerPassos(){try{return JSON.parse(localStorage.getItem(PASSOS_KEY)||'{}');}catch(e){return {};}}
function gravarPassos(o){try{localStorage.setItem(PASSOS_KEY,JSON.stringify(o));}catch(e){}}
function restaurarPassos(c){const s=lerPassos();c.querySelectorAll('.check-passo input[data-passo]').forEach(i=>{i.checked=!!s[i.dataset.passo];i.closest('.check-passo').classList.toggle('feito',i.checked);});}
function marcarPasso(i){const s=lerPassos();s[i.dataset.passo]=i.checked;gravarPassos(s);i.closest('.check-passo').classList.toggle('feito',i.checked);atualizarProgresso();if(i.checked)showToast('✅ Passo concluído!');}
function atualizarProgresso(){document.querySelectorAll('.progresso').forEach(p=>{const area=p.closest('.tab-panel')||document;const todos=area.querySelectorAll('.check-passo input[data-passo]');if(!todos.length)return;const feitos=[...todos].filter(i=>i.checked).length;p.querySelector('.barra span').style.width=(100*feitos/todos.length)+'%';p.querySelector('.conta').textContent=feitos+' de '+todos.length+' passos';});}
function zerarPassos(){gravarPassos({});document.querySelectorAll('.check-passo input').forEach(i=>{i.checked=false;i.closest('.check-passo').classList.remove('feito');});atualizarProgresso();}

/* ── Sistema operacional: Windows, macOS ou Linux ── */
function detectarSO(){const u=navigator.userAgent;if(/Windows/i.test(u))return 'win';if(/Mac/i.test(u))return 'mac';return 'linux';}
function escolherSO(so){document.body.setAttribute('data-so',so);try{localStorage.setItem(SO_KEY,so);}catch(e){}document.querySelectorAll('.os-btn[data-os]').forEach(b=>b.classList.toggle('active',b.dataset.os===so));}
document.addEventListener('click',e=>{const b=e.target.closest('.os-btn[data-os]');if(b)escolherSO(b.dataset.os);});

/* ── Perfil: nome e avatar (salvos só neste navegador, nada é enviado) ── */
function lerPerfil(){try{return JSON.parse(localStorage.getItem(PERFIL_KEY)||'{}');}catch(e){return {};}}
function gravarPerfil(o){try{localStorage.setItem(PERFIL_KEY,JSON.stringify(o));}catch(e){}}
function nomeAluno(){const n=(lerPerfil().nome||'').trim();return n||NOME_PADRAO;}
function avatarAluno(){return lerPerfil().avatar||AVATAR_PADRAO;}
function aplicarPerfil(c){c=c||document;c.querySelectorAll('[data-aluno-nome]').forEach(e=>e.textContent=nomeAluno());c.querySelectorAll('[data-aluno-avatar]').forEach(e=>e.textContent=avatarAluno());
  const inp=c.querySelector('#perfil-nome');if(inp&&document.activeElement!==inp)inp.value=lerPerfil().nome||'';
  c.querySelectorAll('.avatar-opt').forEach(b=>b.classList.toggle('active',b.dataset.avatar===avatarAluno()));}
function salvarNome(v){const p=lerPerfil();p.nome=v.slice(0,40);gravarPerfil(p);aplicarPerfil(document);}
function escolherAvatar(a){const p=lerPerfil();p.avatar=a;gravarPerfil(p);aplicarPerfil(document);showToast(a+' Avatar escolhido!');}

/* ── Exercício de decisão: escolha do time, alternativa válida ou errada ── */
const ICONE_DEC={time:'🟢',alt:'🟠',errada:'🔴'};
function decidir(btn){
  const d=btn.closest('.decisao');if(d.dataset.done||btn.disabled)return;
  const fb=d.querySelector('.decisao-fb');const t=btn.dataset.tipo;
  if(t==='errada'){btn.classList.add('bad','escolhida');btn.disabled=true;fb.innerHTML='<strong>🔴 Ainda não.</strong> '+rotulo(btn)+' <strong>Tente outra opção.</strong>';fb.classList.add('show');return;}
  if(t==='alt'){btn.classList.add('alt','escolhida');btn.disabled=true;fb.innerHTML='<strong>🟠 Alternativa válida.</strong> '+rotulo(btn)+' <strong>Mas o time escolheu outra. Qual será?</strong>';fb.classList.add('show');return;}
  d.dataset.done='1';btn.classList.add('ok','escolhida');d.querySelectorAll('.quiz-opt').forEach(o=>o.disabled=true);
  let html='<strong>🎉 Você encontrou a escolha do time, '+nomeAluno()+'!</strong> '+rotulo(btn)+(fb.dataset.exp?' '+fb.dataset.exp:'');
  html+=listaOutras(d,btn,o=>ICONE_DEC[o.dataset.tipo]);
  if(d.dataset.adr)html+='<p class="regra-adr">📌 Esta decisão está registrada no <strong>ADR '+d.dataset.adr+'</strong>. Se o contexto mudar, ninguém edita o ADR antigo: propõe-se um <strong>novo ADR</strong> que o substitui.</p>';
  fb.innerHTML=html;fb.classList.add('show');
}
function refazerDecisao(btn){const d=btn.closest('.decisao');delete d.dataset.done;d.querySelectorAll('.quiz-opt').forEach(o=>{o.classList.remove('escolhida','ok','bad','alt');o.disabled=false;});d.querySelector('.decisao-fb').classList.remove('show');}

/* ── Preveja e revele ── */
function revelarPrevisao(btn){const b=btn.closest('.preveja');b.classList.add('aberta');btn.style.display='none';}

/* ── Desenhos: troca de aba, zoom e passos do fluxo ── */
function verDesenho(btn,grupo,arq){
  document.querySelectorAll('.visoes[data-grupo="'+grupo+'"] .btn').forEach(b=>b.classList.toggle('active',b===btn));
  const img=document.getElementById('img-'+grupo);img.src='desenhos/'+arq+'.webp';img.alt=btn.textContent.trim();
  const ed=document.getElementById('edit-'+grupo);if(ed){ed.href='desenhos/paguai-'+arq+'.drawio.svg';ed.setAttribute('download','paguai-'+arq+'.drawio.svg');}
  const ab=document.getElementById('abrir-'+grupo);if(ab)ab.href='desenhos/'+arq+'.webp';
}
function zoomDesenho(w){w.classList.toggle('zoom');}
function verPasso(btn){const f=btn.closest('.fluxo');f.querySelectorAll('.passo-btn').forEach(b=>b.classList.toggle('active',b===btn));f.querySelector('.explica').innerHTML=btn.dataset.exp;}
function verPeca(btn){const c=btn.closest('.pecas-wrap');c.querySelectorAll('.peca').forEach(b=>b.classList.toggle('active',b===btn));c.querySelector('.peca-def').innerHTML='<strong>'+btn.textContent+'</strong>: '+btn.dataset.def;}

window.addEventListener('DOMContentLoaded',()=>{let so=null;try{so=localStorage.getItem(SO_KEY);}catch(e){}escolherSO(so||detectarSO());aplicarPerfil(document);});

/* ── Modo leitura: botão fixo para sair, tecla Esc e aviso ── */
(function(){
  function garantirBotaoSair(){if(document.getElementById('sair-leitura'))return;const b=document.createElement('button');b.id='sair-leitura';b.type='button';b.className='btn sair-leitura';b.textContent='✕ Sair do modo leitura';b.onclick=()=>alternarLeitura(false);document.body.appendChild(b);}
  function alternarLeitura(forcar){garantirBotaoSair();const on=document.body.classList.toggle('focus-mode',forcar);if(typeof showToast==='function')showToast(on?'📖 Modo leitura ativado. Esc ou o botão no canto para sair.':'Modo leitura desativado.');}
  window.alternarLeitura=alternarLeitura;
  function ligar(){garantirBotaoSair();const t=document.getElementById('focus-toggle');if(t){t.textContent='📖 Modo leitura';t.onclick=()=>alternarLeitura();}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ligar);else ligar();
  window.addEventListener('load',ligar);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('focus-mode'))alternarLeitura(false);},true);
})();
