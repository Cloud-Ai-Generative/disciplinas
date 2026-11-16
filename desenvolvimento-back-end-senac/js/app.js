/* ═══════════ ODA: Desenvolvimento Back-end · API de doações Vila Esperança (base: ODA PagUai) ═══════════ */
const TEMA_KEY = 'vilaTheme';
const PASSOS_KEY = 'vilaPassos';
const SO_KEY = 'vilaSO';

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

/* ── Checkpoint (quiz) ── */
function rotulo(o){return '<em>'+o.textContent.trim()+'</em>'+(o.dataset.exp?': '+o.dataset.exp:'.');}
function listaOutras(c,certa,icone){
  const itens=[...c.querySelectorAll('.quiz-opt')].filter(o=>o!==certa&&o.dataset.exp);
  if(!itens.length)return '';
  return '<details class="outras"><summary>Ver por que as outras opções não servem</summary><ul class="exp-opcoes">'+itens.map(o=>'<li>'+icone(o)+' <strong>'+o.textContent.trim()+'</strong>: '+o.dataset.exp+'</li>').join('')+'</ul></details>';
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
  fb.innerHTML='<strong>🎉 Parabéns, '+nomeAluno()+'!</strong> '+rotulo(btn)+' '+(fb.dataset.exp||'')+listaOutras(q,btn,()=>'🔴');
  fb.classList.add('show');
}
function refazerQuiz(id){document.querySelectorAll('#'+id+' .quiz-q').forEach(q=>{delete q.dataset.done;q.querySelectorAll('.quiz-opt').forEach(o=>{o.classList.remove('ok','bad');o.disabled=false;});q.querySelector('.quiz-fb').classList.remove('show');});}

/* ── Diversos ── */
function showToast(m){const c=document.getElementById('toast-container');const d=document.createElement('div');d.className='toast';d.textContent=m;c.appendChild(d);setTimeout(()=>{d.classList.add('hiding');setTimeout(()=>d.remove(),300);},3000);}
function toggleFaq(e){e.classList.toggle('open');}
function filterGloss(){const t=document.getElementById('gloss-search').value.toLowerCase();document.querySelectorAll('#gloss-table tbody tr').forEach(r=>{r.style.display=r.textContent.toLowerCase().includes(t)?'':'none';});}
const INDICE=[
  {tab:'inicio',title:'Início: a Vila Esperança',k:'vila esperança associação contagem doações personagens dona cida marcos bia lucas objetivo indicador roteiro etapas'},
  {tab:'time',title:'O time: papéis e funções',k:'time papéis funções tech lead product owner po qa testador cliente stakeholder usuário desenvolvedor back-end carreira ana julia bia lucas marcos dona cida'},
  {tab:'ambiente',title:'Antes da aula: preparando o ambiente',k:'instalar instalação git vs code vscode extensões docker desktop wsl codespaces requisitos clonar verificação hello-world windows macos linux ubuntu'},
  {tab:'secao-1',title:'1. O problema do caderno',k:'problema caderno contexto voluntário aplicativo api banco extensão'},
  {tab:'secao-2',title:'2. REST e o recurso /doacoes',k:'rest recurso verbo http get post put delete status 200 201 204 400 404 flask adr 0001'},
  {tab:'secao-3',title:'3. Ambiente com Docker Compose',k:'docker compose contêiner container env .env healthcheck volume porta app factory saude adr 0003 0006'},
  {tab:'secao-4',title:'4. Modelo Doacao',k:'modelo model sqlalchemy orm tabela postgresql seed camadas estrutura create_all adr 0002 0005 0008'},
  {tab:'secao-5',title:'5. Cadastro (POST) com validação',k:'post cadastro validação validar 400 201 erros location adr 0004 0007 ao vivo'},
  {tab:'secao-6',title:'6. Listagem e consulta (GET)',k:'get listar consultar 200 404 psql banco'},
  {tab:'secao-7',title:'7. Desafio: PUT e DELETE',k:'desafio put delete atualizar excluir 204 gabarito'},
  {tab:'secao-8',title:'8. Avaliação',k:'avaliação checklist indicador quiz recapitulação'},
  {tab:'problemas',title:'Problemas comuns',k:'erro porta ocupada port already allocated wsl virtualização bios permissão docker daemon crlf env database_url 5432 8000'},
  {tab:'glossario',title:'Glossário',k:'glossário termos definição api rest orm contêiner adr'}
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


/* ═══════════ Complementos do ODA Vila Esperança ═══════════ */
function posCarregar(p){renderBuscas(p);restaurarPassos(p);atualizarProgresso();aplicarPerfil(p);}

/* ── Buscas para ir além (Google, Scholar e YouTube em português) ── */
function renderBuscas(c){c.querySelectorAll('.buscas[data-termos]:not([data-ok])').forEach(b=>{const q=encodeURIComponent(b.dataset.termos);b.innerHTML='<h5>🔗 Buscas para ir além (em português)</h5>'+
 '<a class="ext" target="_blank" rel="noopener" onclick="event.stopPropagation()" href="https://www.google.com/search?hl=pt-BR&lr=lang_pt&q='+q+'">🔎 Busca no Google</a>'+
 '<a class="ext" target="_blank" rel="noopener" onclick="event.stopPropagation()" href="https://scholar.google.com/scholar?hl=pt-BR&lr=lang_pt&q='+q+'">🎓 Pesquisa científica (Google Scholar)</a>'+
 '<a class="ext" target="_blank" rel="noopener" onclick="event.stopPropagation()" href="https://www.youtube.com/results?search_query='+q+'">🎬 Videoaulas no YouTube</a>';b.setAttribute('data-ok','1');});}

/* ── Checklist de progresso (salvo só neste navegador) ── */
function lerPassos(){try{return JSON.parse(localStorage.getItem(PASSOS_KEY)||'{}');}catch(e){return {};}}
function gravarPassos(o){try{localStorage.setItem(PASSOS_KEY,JSON.stringify(o));}catch(e){}}
function restaurarPassos(c){const s=lerPassos();c.querySelectorAll('.check-passo input[data-passo]').forEach(i=>{i.checked=!!s[i.dataset.passo];i.closest('.check-passo').classList.toggle('feito',i.checked);});}
function marcarPasso(i){const s=lerPassos();s[i.dataset.passo]=i.checked;gravarPassos(s);i.closest('.check-passo').classList.toggle('feito',i.checked);atualizarProgresso();if(i.checked)showToast('✅ Passo concluído!');}
function atualizarProgresso(){const todos=document.querySelectorAll('.check-passo input[data-passo]');if(!todos.length)return;const feitos=[...todos].filter(i=>i.checked).length;document.querySelectorAll('.progresso').forEach(p=>{p.querySelector('.barra span').style.width=(100*feitos/todos.length)+'%';p.querySelector('.conta').textContent=feitos+' de '+todos.length+' passos';});}
function zerarPassos(){gravarPassos({});document.querySelectorAll('.check-passo input').forEach(i=>{i.checked=false;i.closest('.check-passo').classList.remove('feito');});atualizarProgresso();}

/* ── Sistema operacional (Windows, macOS ou Linux) ── */
function detectarSO(){const u=navigator.userAgent;if(/Windows/i.test(u))return 'win';if(/Mac/i.test(u))return 'mac';return 'linux';}
function escolherSO(so){document.body.setAttribute('data-so',so);try{localStorage.setItem(SO_KEY,so);}catch(e){}document.querySelectorAll('.os-btn[data-os]').forEach(b=>b.classList.toggle('active',b.dataset.os===so));}
document.addEventListener('click',e=>{const b=e.target.closest('.os-btn[data-os]');if(b)escolherSO(b.dataset.os);});
window.addEventListener('DOMContentLoaded',()=>{let so=null;try{so=localStorage.getItem(SO_KEY);}catch(e){}escolherSO(so||detectarSO());});
const _switchOriginal=switchTab;switchTab=function(t,a){_switchOriginal(t,a);setTimeout(()=>{const so=document.body.getAttribute('data-so');if(so)escolherSO(so);},400);};

/* ── Perfil do aluno: nome e ícone (salvos só neste navegador) ── */
const PERFIL_KEY='vilaPerfil';
const NOME_PADRAO='Aluno(a) Back-End', AVATAR_PADRAO='🧑‍💻';
function lerPerfil(){try{return JSON.parse(localStorage.getItem(PERFIL_KEY)||'{}');}catch(e){return {};}}
function gravarPerfil(o){try{localStorage.setItem(PERFIL_KEY,JSON.stringify(o));}catch(e){}}
function nomeAluno(){const n=(lerPerfil().nome||'').trim();return n||NOME_PADRAO;}
function avatarAluno(){return lerPerfil().avatar||AVATAR_PADRAO;}
function aplicarPerfil(c){c=c||document;c.querySelectorAll('[data-aluno-nome]').forEach(e=>e.textContent=nomeAluno());c.querySelectorAll('[data-aluno-avatar]').forEach(e=>e.textContent=avatarAluno());
  const inp=c.querySelector('#perfil-nome');if(inp&&document.activeElement!==inp)inp.value=lerPerfil().nome||'';
  c.querySelectorAll('.avatar-opt').forEach(b=>b.classList.toggle('active',b.dataset.avatar===avatarAluno()));}
function salvarNome(v){const p=lerPerfil();p.nome=v.slice(0,40);gravarPerfil(p);aplicarPerfil(document);}
function escolherAvatar(a){const p=lerPerfil();p.avatar=a;gravarPerfil(p);aplicarPerfil(document);showToast(a+' Ícone escolhido!');}

/* ── Decisões do time: o aluno escolhe e vê o que o time decidiu ── */
const ICONE_DEC={time:'🟢',alt:'🟠',errada:'🔴'};
function decidir(btn){
  const d=btn.closest('.decisao');if(d.dataset.done||btn.disabled)return;
  const fb=d.querySelector('.decisao-fb');const t=btn.dataset.tipo;
  if(t==='errada'){btn.classList.add('bad');btn.disabled=true;
    fb.innerHTML='<strong>🔴 Ainda não.</strong> '+rotulo(btn)+' <strong>Tente outra opção.</strong>';fb.classList.add('show');return;}
  if(t==='alt'){btn.classList.add('alt');btn.disabled=true;
    fb.innerHTML='<strong>🟠 Alternativa válida.</strong> '+rotulo(btn)+' <strong>Mas o time escolheu outra. Qual será?</strong>';fb.classList.add('show');return;}
  d.dataset.done='1';btn.classList.add('ok');d.querySelectorAll('.quiz-opt').forEach(o=>o.disabled=true);
  let html='<strong>🎉 '+(d.querySelector('[data-tipo=alt]')?'Você encontrou a escolha do time':'Parabéns')+', '+nomeAluno()+'!</strong> '+rotulo(btn)+(fb.dataset.exp?' '+fb.dataset.exp:'');
  html+=listaOutras(d,btn,o=>ICONE_DEC[o.dataset.tipo]);
  if(d.dataset.adr)html+='<p class="regra-adr">📌 Esta decisão está registrada no <strong>ADR '+d.dataset.adr+'</strong> e vale para todo o projeto: o time segue o que foi decidido, inclusive quem votou diferente. Se o contexto mudar ou surgir um argumento novo, ninguém edita o ADR antigo: propõe-se um <strong>novo ADR</strong> que o substitui.</p>';
  else if(d.dataset.regra)html+='<p class="regra-adr">📌 '+d.dataset.regra+'</p>';
  fb.innerHTML=html;fb.classList.add('show');
}
function refazerDecisao(btn){const d=btn.closest('.decisao');delete d.dataset.done;d.querySelectorAll('.quiz-opt').forEach(o=>{o.classList.remove('escolhida','ok','bad','alt');o.disabled=false;});d.querySelector('.decisao-fb').classList.remove('show');}

/* ── Revelação progressiva (tabela da Seção 2) ── */
function revelar(el){el.classList.add('revelado');}
function revelarTudo(id){document.querySelectorAll('#'+id+' .oculto').forEach(e=>e.classList.add('revelado'));}
function esconderTudo(id){document.querySelectorAll('#'+id+' .oculto').forEach(e=>e.classList.remove('revelado'));}
window.addEventListener('DOMContentLoaded',()=>aplicarPerfil(document));
