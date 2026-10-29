/* ═══════════ SALA DE CONTRATO ═══════════ */
const PERSONAS={
neg:{p:'👩🏻',n:'Mariana Duarte',r:'Negócio / PO',ri:'💼',c:'var(--warning)'},
back:{p:'🧔',n:'Rafael Souza',r:'Backend',ri:'☕',c:'var(--java-orange)'},
front:{p:'🧕🏾',n:'Juliana Lima',r:'Frontend',ri:'🌐',c:'var(--primary)'},
qa:{p:'👨🏿',n:'Diego Ferreira',r:'QA',ri:'🧪',c:'var(--success)'}
};
const BEATS=[
{a:1,s:'neg',t:'Precisamos de um catálogo: consultar produtos com nome, preço e estoque, e cadastrar novos.',fx:{op:'req',v:'Catálogo: listar + cadastrar'}},
{a:1,s:'neg',t:'Regra: preço sempre > 0 e estoque nunca negativo.',fx:{op:'req',v:'preço > 0; estoque >= 0'}},
{a:1,s:'front',t:'Para o card preciso de id, nome e preco já prontos para exibir.',fx:{op:'req',v:'Card exibe id, nome, preco'}},
{a:1,s:'qa',t:'Preciso de exemplos e códigos de erro para testar bordas.',fx:{op:'req',v:'Exemplos + códigos de erro'}},
{a:2,s:'back',t:'Proponho CRUD completo: GET/POST /api/produtos, GET/PUT/DELETE /api/produtos/{id}.',fx:{op:'eps',v:[['GET','/api/produtos','🔒?'],['POST','/api/produtos','🔒 JWT'],['GET','/api/produtos/{id}','🔒?'],['PUT','/api/produtos/{id}','🔒 JWT'],['DELETE','/api/produtos/{id}','🔒 JWT']]}},
{a:2,s:'back',t:'Escrita exige login. Leitura pública? Mariana, confirma?',fx:null},
{a:2,s:'neg',t:'Leitura pública ok; escrita só autorizado.',fx:{op:'auth',v:'GET público · POST/PUT/DELETE JWT'}},
{a:2,s:'back',t:'Fechado: POST /api/auth/login emite JWT.',fx:{op:'ep',v:['POST','/api/auth/login','público']}},
{a:2,s:'qa',t:'Lista grande: como paginamos?',fx:{op:'poll',id:'pag',q:'⚖️ Decisão: paginação?',opts:[{v:'offset',l:'offset — ?page=0&size=20 (recomendado: simples)'},{v:'cursor',l:'cursor — ?cursor=abc&limit=20 (para listas enormes)'},{v:'none',l:'sem paginação (devolve tudo)'}]}},
{a:3,s:'front',t:'ProdutoResponse: id, nome, preco, estoque.',fx:{op:'fields',v:[['id','integer int64'],['nome','string'],['preco','?'],['estoque','integer']]}},
{a:3,s:'qa',t:'Tipo do preço: number ou string?',fx:{op:'poll',id:'price',q:'⚖️ Decisão: tipo do preco?',opts:[{v:'number',l:'number — 249.90 (recomendado: o banco guarda DECIMAL)'},{v:'string',l:'string decimal — "249.90" (zero risco de arredondamento no JSON)'}]}},
{a:3,s:'back',t:'Id como integer int64, gerado pelo servidor: o cliente NÃO manda id no POST/PUT (vai na URL).',fx:null},
{a:3,s:'qa',t:'Validações no próprio contrato: nome com 2 a 120 letras, preco >= 0.01, estoque >= 0.',fx:{op:'req',v:'nome 2–120 · preco ≥ 0.01 · estoque ≥ 0'}},
{a:4,s:'qa',t:'Erros: 400 validação, 401 sem token (só nas escritas), 404 não encontrado (GET/PUT/DELETE por id).',fx:{op:'req',v:'Erros: 400/401/404'}},
{a:4,s:'qa',t:'Formato de erro?',fx:{op:'poll',id:'err',q:'⚖️ Decisão: formato de erro?',opts:[{v:'rfc7807',l:'RFC 7807 Problem Details'},{v:'custom',l:'Custom { erro }'}]}},
{a:4,s:'qa',t:'Quero examples no schema.',fx:{op:'req',v:'examples nos schemas'}},
{a:5,s:'neg',t:'Consenso: leitura pública, escrita autenticada. Aprovado.',fx:null},
{a:5,s:'back',t:'Gero o openapi.yaml. Contrato fechado!',fx:{op:'freeze'}}
];
const REACT={
pag:{offset:'💬 🧔 Rafael: offset é simples de implementar.\n💬 👨🏿 Diego: fácil de testar, aprovo. ✔',cursor:'💬 🧔 Rafael: cursor é mais trabalhoso, mas escala para milhões de itens.\n💬 👨🏿 Diego: vou precisar simular cursores nos testes (ressalva).',none:'💬 👨🏿 Diego: sem paginação a lista pode ficar gigante; aceito com ressalva.'},
price:{number:'💬 🧕🏾 Juliana: number facilita exibir na tela.\n💬 🧔 Rafael: ok — no banco fica DECIMAL(10,2), nunca float. ✔',string:'💬 🧔 Rafael: string evita qualquer arredondamento no caminho.\n💬 🧕🏾 Juliana: tudo bem, eu converto na tela (cedo).'},
err:{rfc7807:'💬 🧔 Rafael + 👨🏿 Diego: RFC 7807, padrão de mercado, ótimo para testes. ✔',custom:'💬 🧔 Rafael: custom não é padrão; prefiro RFC 7807, mas aceito (cedo).'}
};
const DEC_META={
pag:{offset:{adv:'👨🏿 Diego',con:'—'},cursor:{adv:'🧔 Rafael',con:'👨🏿 Diego'},none:{adv:'—',con:'👨🏿 Diego'}},
price:{number:{adv:'🧕🏾 Juliana',con:'—'},string:{adv:'🧔 Rafael',con:'🧕🏾 Juliana'}},
err:{rfc7807:{adv:'🧔 Rafael + 👨🏿 Diego',con:'—'},custom:{adv:'—',con:'🧔 Rafael'}}
};
let M={i:0,st:{reqs:[],eps:[],fields:[],dec:{}},auto:null,done:false,filter:null};
function renderRoster(){document.getElementById('roster').innerHTML=Object.entries(PERSONAS).map(([k,P])=>'<span class="roster-chip'+(M.filter===k?' on':'')+'" style="--rc:'+P.c+'" onclick="setFilter(\''+k+'\')" title="Filtrar falas de '+P.n+'"><span class="pav">'+P.p+'</span>'+P.n+' · '+P.ri+' '+P.r+'</span>').join('');}
function setFilter(k){M.filter=(M.filter===k?null:k);renderRoster();document.querySelectorAll('#meet-room .bubble').forEach(applyDim);}
function applyDim(d){if(M.filter&&d.dataset.s!==M.filter)d.classList.add('dim');else d.classList.remove('dim');}
function meetReset(){M={i:0,st:{reqs:[],eps:[],fields:[],dec:{}},auto:null,done:false,filter:null};document.getElementById('meet-room').innerHTML='';document.getElementById('meet-out').style.display='none';document.querySelectorAll('#phase-bar .phase').forEach(p=>p.classList.toggle('on',p.dataset.a==='1'));renderRoster();renderCanvas();meetStatus();}
function meetStatus(){document.getElementById('meet-status').textContent='Ato '+(BEATS[Math.min(M.i,BEATS.length-1)].a)+' · fala '+M.i+'/'+BEATS.length;}
function meetNext(){if(M.done)return;const b=BEATS[M.i];addBubble(M.i,b);applyFx(b);M.i++;document.querySelectorAll('#phase-bar .phase').forEach(p=>p.classList.toggle('on',+p.dataset.a<=b.a));renderCanvas();meetStatus();if(b.fx&&b.fx.op==='poll'){stopAuto();renderPoll(b.fx);return;}if(M.i>=BEATS.length){M.done=true;stopAuto();finishMeeting();}}
function meetToggleAuto(){if(M.auto){stopAuto();return;}M.auto=setInterval(()=>{if(M.done){stopAuto();return;}const r=document.getElementById('meet-room');if(r.querySelector('.poll:not(.answered)')){stopAuto();return;}meetNext();},1400);document.getElementById('meet-auto').textContent='⏸ Pausar';}
function stopAuto(){if(M.auto){clearInterval(M.auto);M.auto=null;}const b=document.getElementById('meet-auto');if(b)b.textContent='▶ Auto';}
function addBubble(i,b){const P=PERSONAS[b.s];const room=document.getElementById('meet-room');const d=document.createElement('div');d.className='bubble';d.style.setProperty('--bc',P.c);d.dataset.idx=i;d.dataset.s=b.s;d.innerHTML='<span class="av">'+P.p+'</span><div><div class="who" style="color:'+P.c+'">'+P.p+' '+P.n+' · '+P.ri+' '+P.r+'</div><div class="txt">'+b.t+'</div></div>';room.appendChild(d);applyDim(d);room.scrollTop=room.scrollHeight;}
function applyFx(b){const f=b.fx;if(!f)return;const s=M.st;if(f.op==='req')s.reqs.push({v:f.v,from:M.i});if(f.op==='eps')f.v.forEach(e=>s.eps.push({m:e[0],p:e[1],a:e[2],from:M.i}));if(f.op==='ep')s.eps.push({m:f.v[0],p:f.v[1],a:f.v[2],from:M.i});if(f.op==='auth')s.eps.forEach(e=>{if(e.a==='🔒?')e.a=(e.m==='GET'?'público':'🔒 JWT');});if(f.op==='fields')f.v.forEach(x=>s.fields.push({n:x[0],t:x[1],from:M.i}));}
function renderPoll(f){const room=document.getElementById('meet-room');const d=document.createElement('div');d.className='poll';d.innerHTML='<div class="q">'+f.q+'</div>'+f.opts.map(o=>'<label><input type="radio" name="poll-'+f.id+'" value="'+o.v+'"> '+o.l+'</label>').join('')+'<div class="react" style="display:none"></div>';d.querySelectorAll('input').forEach(inp=>inp.addEventListener('change',()=>{d.classList.add('answered');M.st.dec[f.id]=inp.value;const rec=d.querySelector('.react');rec.style.display='block';rec.textContent=REACT[f.id][inp.value];if(f.id==='price')M.st.fields.forEach(x=>{if(x.n==='preco')x.t=(inp.value==='string'?'string decimal':'number (DECIMAL no banco)');});renderCanvas();setTimeout(meetNext,900);}));room.appendChild(d);room.scrollTop=room.scrollHeight;}
function buildYaml(s){const d=s.dec;
/* tipo do preço (poll "price"): number (padrão) ou string decimal */
const priceY=d.price==='string'
 ?"type: string\n          pattern: '^\\d+(\\.\\d{1,2})?$'\n          description: Valor em reais como texto (ex. \"249.90\"); no banco é DECIMAL(10,2)\n          example: '249.90'"
 :"type: number\n          minimum: 0.01\n          description: Valor em reais; no banco é DECIMAL(10,2) (nunca float)\n          example: 249.90";
/* formato de erro (poll "err") */
const custom=d.err==='custom';
const errCT=custom?'application/json':'application/problem+json';
const errName=custom?'Erro':'ProblemDetails';
const errSchema=custom
 ?"    Erro:\n      type: object\n      properties:\n        erro: { type: string, example: 'O campo preco deve ser maior que zero.' }"
 :"    ProblemDetails:\n      type: object\n      description: Erro no padrão RFC 7807 (Problem Details)\n      properties:\n        type: { type: string, example: 'https://example.com/erros/validacao' }\n        title: { type: string, example: 'Requisição inválida' }\n        status: { type: integer, example: 400 }\n        detail: { type: string, example: 'O campo preco deve ser maior que zero.' }";
const err=(code,desc)=>"        '"+code+"': { $ref: '#/components/responses/"+desc+"' }\n";
/* paginação (poll "pag") */
let pag='',listSchema="                type: array\n                items: { $ref: '#/components/schemas/ProdutoResponse' }\n";
if(d.pag==='offset')pag="      parameters:\n        - { name: page, in: query, description: 'Página (começa em 0)', schema: { type: integer, minimum: 0, default: 0 } }\n        - { name: size, in: query, description: 'Itens por página', schema: { type: integer, minimum: 1, maximum: 100, default: 20 } }\n";
if(d.pag==='cursor'){pag="      parameters:\n        - { name: cursor, in: query, description: 'Valor de proximoCursor da página anterior (vazio = primeira página)', schema: { type: string } }\n        - { name: limit, in: query, description: 'Itens por página', schema: { type: integer, minimum: 1, maximum: 100, default: 20 } }\n";listSchema="                $ref: '#/components/schemas/ProdutoPagina'\n";}
const has=p=>s.eps.some(e=>e.p===p);
const hasM=(p,m)=>s.eps.some(e=>e.p===p&&e.m===m);
const lock="      security:\n        - bearerAuth: []\n";
const open="      security: []\n";
const idP="      parameters:\n        - { name: id, in: path, required: true, schema: { type: integer, format: int64, minimum: 1 } }\n";
const body="      requestBody:\n        required: true\n        content:\n          application/json:\n            schema: { $ref: '#/components/schemas/ProdutoRequest' }\n";
const ok=(code,desc)=>"        '"+code+"':\n          description: "+desc+"\n          content:\n            application/json:\n              schema: { $ref: '#/components/schemas/ProdutoResponse' }\n";
let paths='';
if(has('/api/auth/login'))paths+="  /api/auth/login:\n    post:\n      summary: Login (emite o JWT)\n      tags: [Auth]\n"+open+"      requestBody:\n        required: true\n        content:\n          application/json:\n            schema: { $ref: '#/components/schemas/LoginRequest' }\n      responses:\n        '200':\n          description: Token emitido\n          content:\n            application/json:\n              schema: { $ref: '#/components/schemas/LoginResponse' }\n"+err(400,'Validacao')+err(401,'NaoAutenticado');
if(has('/api/produtos')){
paths+="  /api/produtos:\n    get:\n      summary: Lista produtos (público)\n      tags: [Produtos]\n"+open+pag+"      responses:\n        '200':\n          description: OK\n          content:\n            application/json:\n              schema:\n"+listSchema;
if(hasM('/api/produtos','POST'))paths+="    post:\n      summary: Cadastra produto (exige login)\n      tags: [Produtos]\n"+lock+body+"      responses:\n"+ok(201,'Criado')+err(400,'Validacao')+err(401,'NaoAutenticado');}
if(has('/api/produtos/{id}')){
paths+="  /api/produtos/{id}:\n    get:\n      summary: Busca por id (público)\n      tags: [Produtos]\n"+open+idP+"      responses:\n"+ok(200,'OK')+err(404,'NaoEncontrado');
if(hasM('/api/produtos/{id}','PUT'))paths+="    put:\n      summary: Atualiza produto (exige login)\n      tags: [Produtos]\n"+lock+idP+body+"      responses:\n"+ok(200,'Atualizado')+err(400,'Validacao')+err(401,'NaoAutenticado')+err(404,'NaoEncontrado');
if(hasM('/api/produtos/{id}','DELETE'))paths+="    delete:\n      summary: Exclui produto (exige login)\n      tags: [Produtos]\n"+lock+idP+"      responses:\n        '204':\n          description: Excluído com sucesso (sem corpo)\n"+err(401,'NaoAutenticado')+err(404,'NaoEncontrado');}
/* respostas de erro reutilizáveis: cada uma com exemplo, para o Prism devolver algo legível */
const resp=(name,desc,status,title,detail)=>"    "+name+":\n      description: "+desc+"\n      content:\n        "+errCT+":\n          schema: { $ref: '#/components/schemas/"+errName+"' }\n          example:\n"+(custom?"            erro: '"+detail+"'\n":"            type: 'https://example.com/erros/"+name.toLowerCase()+"'\n            title: '"+title+"'\n            status: "+status+"\n            detail: '"+detail+"'\n");
const responses=resp('Validacao','Dados inválidos',400,'Requisição inválida','O campo preco deve ser maior que zero.')+resp('NaoAutenticado','Token ausente, inválido ou expirado',401,'Não autenticado','Envie o header Authorization: Bearer <token>.')+resp('NaoEncontrado','Recurso não encontrado',404,'Não encontrado','Produto 999 não existe.');
const pagina=d.pag==='cursor'?"    ProdutoPagina:\n      type: object\n      required: [itens]\n      properties:\n        itens:\n          type: array\n          items: { $ref: '#/components/schemas/ProdutoResponse' }\n        proximoCursor:\n          type: string\n          description: Mande em ?cursor= para pegar a próxima página (ausente = acabou)\n          example: 'eyJpZCI6MTAxfQ'\n":'';
const campos="        nome:\n          type: string\n          minLength: 2\n          maxLength: 120\n          example: 'Teclado Mecânico RGB'\n        preco:\n          "+priceY+"\n        estoque:\n          type: integer\n          minimum: 0\n          example: 50";
return `openapi: 3.1.0
info:
  title: Loja de Produtos REST API
  version: 0.1.0-draft
  description: Contrato da Sala de Contrato (Tab 4). Leitura pública; escrita exige login (JWT).
servers:
  - { url: http://localhost:4010, description: Mock (Prism) }
  - { url: http://localhost:8080, description: Backend real }
security:
  - bearerAuth: []
paths:
${paths||"  {}\n"}components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  responses:
${responses}  schemas:
    LoginRequest:
      type: object
      required: [email, senha]
      properties:
        email:
          type: string
          format: email
          example: dev@loja.com.br
        senha:
          type: string
          format: password
          minLength: 8
          example: "SenhaForte#2026"
    LoginResponse:
      type: object
      required: [tokenAcesso, tipo, expiraEm]
      properties:
        tokenAcesso:
          type: string
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.fakesignature"
        tipo:
          type: string
          example: Bearer
        expiraEm:
          type: integer
          description: Segundos até o token expirar
          example: 3600
    ProdutoRequest:
      type: object
      description: O que o cliente ENVIA no POST/PUT (sem id — o id vai na URL ou é gerado pelo servidor)
      required: [nome, preco, estoque]
      additionalProperties: false
      properties:
${campos}
    ProdutoResponse:
      type: object
      description: O que a API DEVOLVE
      required: [id, nome, preco, estoque]
      properties:
        id:
          type: integer
          format: int64
          example: 101
${campos}
${pagina}${errSchema}
`;}
function renderCanvas(){const s=M.st;document.getElementById('cv-req').innerHTML=s.reqs.length?s.reqs.map(r=>'<div data-from="'+r.from+'">• '+r.v+'</div>').join(''):'—';document.getElementById('cv-eps').innerHTML=s.eps.length?'<table><tr><th>Método</th><th>Rota</th><th>Auth</th></tr>'+s.eps.map(e=>'<tr data-from="'+e.from+'"><td>'+e.m+'</td><td>'+e.p+'</td><td>'+e.a+'</td></tr>').join('')+'</table>':'—';document.getElementById('cv-fields').innerHTML=s.fields.length?s.fields.map(f=>'<div data-from="'+f.from+'">• '+f.n+' : '+(f.t==='?'?'(a decidir)':f.t)+'</div>').join(''):'—';const decs=[];if(s.dec.pag)decs.push(['pag',s.dec.pag]);if(s.dec.price)decs.push(['price',s.dec.price]);if(s.dec.err)decs.push(['err',s.dec.err]);document.getElementById('cv-dec').innerHTML=decs.length?decs.map(([k,v])=>{const m=DEC_META[k][v];return '<div>⚖️ '+k+' = '+v+' · defendeu: '+m.adv+(m.con!=='—'?' · cedeu: '+m.con:'')+'</div>';}).join(''):'—';document.getElementById('cv-yaml').textContent=buildYaml(s);}
let CONTRACT_YAML=null;
function finishMeeting(){CONTRACT_YAML=buildYaml(M.st);document.getElementById('contract-yaml').textContent=CONTRACT_YAML;document.getElementById('meet-out').style.display='flex';showToast('🎉 Contrato fechado! YAML gerado a partir das decisões.');}
function currentContract(){return CONTRACT_YAML||buildYaml({reqs:[],eps:[{m:'POST',p:'/api/auth/login',a:'público'},{m:'GET',p:'/api/produtos',a:'público'},{m:'POST',p:'/api/produtos',a:'🔒 JWT'},{m:'GET',p:'/api/produtos/{id}',a:'público'},{m:'PUT',p:'/api/produtos/{id}',a:'🔒 JWT'},{m:'DELETE',p:'/api/produtos/{id}',a:'🔒 JWT'}],fields:[{n:'id',t:'integer int64'},{n:'nome',t:'string'},{n:'preco',t:'number (DECIMAL no banco)'},{n:'estoque',t:'integer'}],dec:{pag:'offset',price:'number',err:'rfc7807'}});}
function copyContract(){navigator.clipboard.writeText(currentContract()).then(()=>showToast('📋 openapi.yaml copiado!'));}
function downloadContract(){const b=new Blob([currentContract()],{type:'text/yaml'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='openapi.yaml';a.click();URL.revokeObjectURL(a.href);}
function ataContent(){const s=M.st;const d=s.dec;const part=Object.values(PERSONAS).map(P=>'- '+P.p+' '+P.n+' — '+P.ri+' '+P.r).join('\n');const decs=['pag','price','err'].map(k=>{const v=d[k];if(!v)return null;const m=DEC_META[k][v];return '- '+k+' = '+v+' · defendeu: '+m.adv+(m.con!=='—'?' · cedeu: '+m.con:'');}).filter(Boolean).join('\n')||'- (padrão)';return "# Ata da Reunião — Sala de Contrato\n\n## Participantes\n"+part+"\n\n## Requisitos\n"+(s.reqs.length?s.reqs.map(r=>'- '+r.v).join('\n'):'- (padrão)')+"\n\n## Endpoints\n"+(s.eps.length?s.eps.map(e=>'- '+e.m+' '+e.p+' ('+e.a+')').join('\n'):'- (padrão)')+"\n\n## Decisões (defendeu/cedeu)\n"+decs+"\n";}
function downloadAta(){const b=new Blob([ataContent()],{type:'text/markdown'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='ata.md';a.click();URL.revokeObjectURL(a.href);showToast('📄 ata.md baixada!');}
function handoffPrism(){showToast('🐳 Rode: docker compose -f docker-compose.prism.yml up -d','info');const el=document.getElementById('lab-prism');if(el)el.scrollIntoView({behavior:'smooth'});}
/* rastreabilidade fala<->canvas */
document.addEventListener('mouseover',e=>{const from=e.target.closest('[data-from]');const bub=e.target.closest('.bubble[data-idx]');document.querySelectorAll('.hl').forEach(x=>x.classList.remove('hl'));if(from){const b=document.querySelector('.bubble[data-idx="'+from.dataset.from+'"]');if(b)b.classList.add('hl');}if(bub){document.querySelectorAll('[data-from="'+bub.dataset.idx+'"]').forEach(x=>x.classList.add('hl'));}});/* ═══════════ Tab 4: quiz ═══════════ */
function quizResp(btn,j){const q=btn.closest('.quiz-q');if(q.dataset.feito)return;q.dataset.feito='1';const ok=+q.dataset.ok;const bs=q.querySelectorAll('.btn');bs[ok].classList.add('certo');if(j!==ok)btn.classList.add('errado');q.dataset.acertou=j===ok?'1':'0';q.querySelector('.quiz-exp').style.display='block';const all=document.querySelectorAll('#tab4-quiz .quiz-q'),done=[...all].filter(x=>x.dataset.feito);if(done.length===all.length){const n=done.filter(x=>x.dataset.acertou==='1').length;const p=document.getElementById('quiz-placar');p.style.display='block';p.innerHTML='<strong>Placar: '+n+' de '+all.length+'.</strong> '+(n===all.length?'🏆 Perfeito!':n>=4?'👏 Muito bem — releia as que errou.':'📚 Vale reler as partes ③ e ⑤ e tentar de novo (recarregue a aba).');}}
/* ═══════════ Tab 4: decodificador de JWT ═══════════ */
const JWT_SECRET='segredo-da-aula-tab4';
const b64u={enc:s=>btoa(unescape(encodeURIComponent(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''),encB:buf=>btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''),dec:s=>{s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return decodeURIComponent(escape(atob(s)));}};
async function jwtAssinar(data){if(!(window.crypto&&crypto.subtle))return null;const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(JWT_SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign']);return b64u.encB(await crypto.subtle.sign('HMAC',k,new TextEncoder().encode(data)));}
async function jwtGerar(){const now=Math.floor(Date.now()/1000);const h=b64u.enc(JSON.stringify({alg:'HS256',typ:'JWT'})),p=b64u.enc(JSON.stringify({sub:'dev@loja.com.br',nome:'Dev da Loja',admin:false,iat:now,exp:now+3600}));const sig=await jwtAssinar(h+'.'+p);document.getElementById('jwt-in').value=h+'.'+p+'.'+(sig||'assinatura-indisponivel');jwtDecode();}
function jwtAdulterar(){const el=document.getElementById('jwt-in');const t=el.value.trim().split('.');if(t.length!==3){showToast('Gere ou cole um token primeiro','info');return;}try{const pl=JSON.parse(b64u.dec(t[1]));pl.admin=true;t[1]=b64u.enc(JSON.stringify(pl));el.value=t.join('.');jwtDecode();}catch(e){showToast('Payload não é JSON','error');}}
async function jwtDecode(){const out=document.getElementById('jwt-out');const t=document.getElementById('jwt-in').value.trim();const esc=x=>x.replace(/&/g,'&amp;').replace(/</g,'&lt;');if(!t){out.textContent='—';return;}const parts=t.split('.');if(parts.length!==3){out.innerHTML='⚠️ Um JWT tem <strong>3 partes</strong> separadas por ponto; este tem '+parts.length+'.';return;}let H,P;try{H=JSON.parse(b64u.dec(parts[0]));P=JSON.parse(b64u.dec(parts[1]));}catch(e){out.innerHTML='⚠️ Não consegui ler o header/payload como JSON (base64url inválido).';return;}
const dt=v=>typeof v==='number'?' <span class="text-muted">('+new Date(v*1000).toLocaleString('pt-BR')+')</span>':'';
const linhas=Object.entries(P).map(([k,v])=>'<div><code>'+esc(k)+'</code>: '+esc(JSON.stringify(v))+((k==='exp'||k==='iat')?dt(v):'')+'</div>').join('');
let selo='<span class="text-muted">🔒 Assinatura: só dá para conferir tendo a chave secreta de quem emitiu (este token não é o de aula).</span>';
const esperado=await jwtAssinar(parts[0]+'.'+parts[1]);
if(esperado===null)selo='<span class="text-muted">🔒 Seu navegador não permite conferir a assinatura aqui (abra o site por http://localhost ou https).</span>';
else if(esperado===parts[2])selo='<strong style="color:#22c55e">✅ Assinatura confere</strong> — o token não foi alterado desde que foi emitido.';
else if(P.sub==='dev@loja.com.br'&&'admin' in P)selo='<strong style="color:#ef4444">❌ Assinatura NÃO confere</strong> — alguém mexeu no payload. O servidor recusaria com 401.';
const venc=P.exp?(P.exp*1000<Date.now()?'<div style="color:#ef4444">⏰ Vencido.</div>':'<div style="color:#22c55e">⏰ Ainda válido.</div>'):'';
out.innerHTML='<div class="jwt-p"><span class="jwt-h">'+esc(parts[0])+'</span>.<span class="jwt-y">'+esc(parts[1])+'</span>.<span class="jwt-s">'+esc(parts[2])+'</span></div><div class="table-wrap" style="margin-top:8px"><table><tr><th class="jwt-h">header</th><th class="jwt-y">payload (as claims)</th></tr><tr><td><code>'+esc(JSON.stringify(H))+'</code></td><td>'+linhas+venc+'</td></tr></table></div><div style="margin-top:6px">'+selo+'</div>';}
