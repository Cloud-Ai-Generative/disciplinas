/* ═══════════ SALA DE CONTRATO V2 (MULTI-CONTEXTOS) — Tab 8 ═══════════
   Usa PERSONAS de sala-contrato.js. Sem roles: só "está logado?" (ADR-010).
   O YAML gerado aqui é o MESMO que a parte ⑤ mostra e que o ZIP leva. */
const BEATS2=[
{a:1,s:'neg',t:'A loja cresceu: além de produtos, agora temos pedidos e clientes. Se tudo ficar num bolo só, ninguém mais entende o contrato.',fx:{op:'req',v:'Separar a API por assunto'}},
{a:1,s:'back',t:'Proponho 3 contextos de negócio — 📦 Catálogo, 🛒 Pedidos e 🧾 Clientes — mais o 🔑 Auth para o login. Cada um com o seu prefixo de rota.',fx:{op:'ctx',v:['🔑 Auth','📦 Catálogo','🛒 Pedidos','🧾 Clientes']}},
{a:1,s:'front',t:'Um contrato só ou um arquivo por contexto? Eu preciso saber onde procurar.',fx:null},
{a:1,s:'back',t:'Um arquivo só, com uma tag por contexto: 1 Prism, 1 Swagger organizado por seções (ADR-009).',fx:{op:'req',v:'1 openapi-multicontexto.yaml com tags (ADR-009)'}},
{a:2,s:'back',t:'Catálogo: listar e ver produto é público; criar, editar e excluir exigem login.',fx:{op:'eps',v:[['GET','/api/catalogo/produtos','público'],['GET','/api/catalogo/produtos/{id}','público'],['POST','/api/catalogo/produtos','🔒 login'],['PUT','/api/catalogo/produtos/{id}','🔒 login'],['DELETE','/api/catalogo/produtos/{id}','🔒 login']]}},
{a:2,s:'neg',t:'E perfis, tipo "admin do catálogo"? Por enquanto não: a regra continua a da Tab 4 — só "está logado?" (ADR-010).',fx:{op:'req',v:'Só autenticação, sem perfis (ADR-010)'}},
{a:2,s:'qa',t:'O estoque é do Catálogo. Quem compra pede uma reserva; se a compra cair, devolve.',fx:{op:'eps',v:[['POST','/api/catalogo/produtos/{id}/reservar','🔒 login · interno'],['POST','/api/catalogo/produtos/{id}/liberar','🔒 login · interno']]}},
{a:3,s:'qa',t:'Pedidos: criar, listar os meus e cancelar. Pedido não se edita nem se apaga — se cancela (ADR-013).',fx:{op:'eps',v:[['POST','/api/pedidos','🔒 login'],['GET','/api/pedidos','🔒 login'],['POST','/api/pedidos/{id}/cancelar','🔒 login']]}},
{a:3,s:'front',t:'No card do pedido eu mostro o preço de cada item. Mas e se o preço do produto mudar amanhã?',fx:{op:'poll',id:'snap',q:'⚖️ Decisão de fronteira: o pedido de hoje muda se o preço do produto mudar amanhã? (ADR-014)',opts:[{v:'sim',l:'Não muda: o pedido guarda uma cópia do preço (snapshot) — recomendado'},{v:'nao',l:'Muda: o pedido guarda só o produtoId e consulta o Catálogo'}]}},
{a:3,s:'back',t:'Mesma pergunta para o endereço de entrega.',fx:{op:'poll',id:'end',q:'⚖️ Decisão de fronteira: o pedido guarda o quê do endereço? (ADR-014)',opts:[{v:'id',l:'Só o enderecoId (Clientes é o dono do endereço) — recomendado, igual à Tab 9'},{v:'copia',l:'Uma cópia do endereço no momento da compra'}]}},
{a:4,s:'back',t:'Clientes: cadastro, consulta, edição e desativar. Os endereços ficam aqui; Pedidos só consulta.',fx:{op:'eps',v:[['POST','/api/clientes','🔒 login'],['GET','/api/clientes/{id}','🔒 login'],['PUT','/api/clientes/{id}','🔒 login'],['POST','/api/clientes/{id}/desativar','🔒 login'],['GET','/api/clientes/{id}/enderecos','🔒 login · interno']]}},
{a:4,s:'qa',t:'Por que "desativar" e não DELETE? Porque pedidos antigos apontam para o cliente: apagar quebraria o histórico.',fx:{op:'req',v:'Cliente se desativa, não se apaga'}},
{a:5,s:'back',t:'No checkout, Pedidos precisa do Catálogo (reservar) e de Clientes (endereço). Como eles conversam?',fx:{op:'poll',id:'sync',q:'⚖️ Decisão: como Pedidos conversa com os outros contextos? (ADR-012)',opts:[{v:'sync',l:'Chamada HTTP na hora (síncrona) + desfazer se falhar — recomendado, igual à Tab 9'},{v:'events',l:'Mensagens/eventos (assíncrono): o pedido nasce "CRIADO" e confirma depois'}]}},
{a:5,s:'qa',t:'Se for síncrono: espera no máximo 2s, e os erros 409 (sem estoque) e 503 (contexto fora do ar) ficam no contrato.',fx:{op:'req',v:'Timeout 2s · 409 e 503 no contrato'}},
{a:5,s:'front',t:'E se um dia mudarmos o contrato? Meu app quebra?',fx:{op:'poll',id:'ver',q:'⚖️ Decisão: como versionar o contrato? (ADR-011)',opts:[{v:'additive',l:'Sem prefixo agora; só mudança que não quebra. Se precisar quebrar, nasce /v2 — recomendado'},{v:'now',l:'Prefixo /v1 em todas as rotas desde já'}]}},
{a:5,s:'neg',t:'Consenso: 4 contextos, só login, fronteiras decididas. Aprovado!',fx:null},
{a:5,s:'back',t:'Gero o openapi-multicontexto.yaml e as ADRs. Contrato v2 fechado!',fx:{op:'freeze'}}
];
const REACT2={
snap:{sim:'💬 🧕🏾 Juliana: ótimo, o recibo do cliente nunca muda. ✔\n💬 🧔 Rafael: o Catálogo devolve o preço na reserva e o pedido guarda.',nao:'💬 🧔 Rafael: risco — um aumento de preço mudaria pedidos já pagos.\n💬 👨🏿 Diego: vou criar teste para isso (ressalva).'},
end:{id:'💬 🧔 Rafael: o endereço tem um dono só: Clientes. ✔\n💬 👨🏿 Diego: fácil de testar.',copia:'💬 👩🏻 Mariana: a nota sai com o endereço da época, mesmo se o cliente mudar.\n💬 🧔 Rafael: aceito; o contrato ganha o objeto enderecoEntrega.'},
sync:{sync:'💬 🧔 Rafael: o cliente já sai sabendo se deu certo. ✔\n💬 👨🏿 Diego: vou simular 409 e 503 no mock.',events:'💬 👨🏿 Diego: menos dependência entre contextos.\n💬 🧔 Rafael: o POST passa a responder 202 (aceito) e o pedido nasce CRIADO.'},
ver:{additive:'💬 🧔 Rafael: sem cerimônia enquanto só nós consumimos. ✔\n💬 🧕🏾 Juliana: ok — mudança que quebra vira /v2.',now:'💬 🧕🏾 Juliana: fica claro desde o começo.\n💬 🧔 Rafael: atenção: a Tab 9 não usa /v1, vai precisar ajustar.'}
};
const DEC_META2={
snap:{sim:{adv:'🧕🏾 Juliana',con:'—'},nao:{adv:'—',con:'🧔 Rafael'}},
end:{id:{adv:'🧔 Rafael',con:'—'},copia:{adv:'👩🏻 Mariana',con:'🧔 Rafael'}},
sync:{sync:{adv:'🧔 Rafael',con:'👨🏿 Diego'},events:{adv:'👨🏿 Diego',con:'🧔 Rafael'}},
ver:{additive:{adv:'🧔 Rafael',con:'🧕🏾 Juliana'},now:{adv:'🧕🏾 Juliana',con:'🧔 Rafael'}}
};
const LBL2={snap:'preço no pedido',end:'endereço no pedido',sync:'integração',ver:'versão'};
const DEF2={snap:'sim',end:'id',sync:'sync',ver:'additive'};
let M2={i:0,st:{ctx:[],reqs:[],eps:[],dec:{}},auto:null,done:false,filter:null};
function renderRoster2(){document.getElementById('roster2').innerHTML=Object.entries(PERSONAS).map(([k,P])=>'<span class="roster-chip'+(M2.filter===k?' on':'')+'" style="--rc:'+P.c+'" onclick="setFilter2(\''+k+'\')" title="Filtrar falas de '+P.n+'"><span class="pav">'+P.p+'</span>'+P.n+' · '+P.ri+' '+P.r+'</span>').join('');}
function setFilter2(k){M2.filter=(M2.filter===k?null:k);renderRoster2();document.querySelectorAll('#meet-room2 .bubble').forEach(applyDim2);}
function applyDim2(d){if(M2.filter&&d.dataset.s!==M2.filter)d.classList.add('dim');else d.classList.remove('dim');}
function meet2Reset(){stopAuto2();M2={i:0,st:{ctx:[],reqs:[],eps:[],dec:{}},auto:null,done:false,filter:null};document.getElementById('meet-room2').innerHTML='';document.getElementById('meet2-out').style.display='none';document.querySelectorAll('#phase-bar2 .phase').forEach(p=>p.classList.toggle('on',p.dataset.a==='1'));renderRoster2();renderCanvas2();meet2Status();const y=document.getElementById('contract2-yaml');if(y&&!CONTRACT2_YAML)y.textContent=currentContract2();}
function meet2Status(){document.getElementById('meet2-status').textContent='Ato '+(BEATS2[Math.min(M2.i,BEATS2.length-1)].a)+' · fala '+M2.i+'/'+BEATS2.length;}
function meet2Next(){if(M2.done)return;if(document.querySelector('#meet-room2 .poll:not(.answered)'))return;const b=BEATS2[M2.i];addBubble2(M2.i,b);applyFx2(b);M2.i++;document.querySelectorAll('#phase-bar2 .phase').forEach(p=>p.classList.toggle('on',+p.dataset.a<=b.a));renderCanvas2();meet2Status();if(b.fx&&b.fx.op==='poll'){stopAuto2();renderPoll2(b.fx);return;}if(M2.i>=BEATS2.length){M2.done=true;stopAuto2();finishMeeting2();}}
function meet2ToggleAuto(){if(M2.auto){stopAuto2();return;}M2.auto=setInterval(()=>{if(M2.done){stopAuto2();return;}if(document.querySelector('#meet-room2 .poll:not(.answered)')){stopAuto2();return;}meet2Next();},1400);document.getElementById('meet2-auto').textContent='⏸ Pausar';}
function stopAuto2(){if(M2.auto){clearInterval(M2.auto);M2.auto=null;}const b=document.getElementById('meet2-auto');if(b)b.textContent='▶ Auto';}
function addBubble2(i,b){const P=PERSONAS[b.s];const room=document.getElementById('meet-room2');const d=document.createElement('div');d.className='bubble';d.style.setProperty('--bc',P.c);d.dataset.idx=i;d.dataset.s=b.s;d.innerHTML='<span class="av">'+P.p+'</span><div><div class="who" style="color:'+P.c+'">'+P.p+' '+P.n+' · '+P.ri+' '+P.r+'</div><div class="txt">'+b.t+'</div></div>';room.appendChild(d);applyDim2(d);room.scrollTop=room.scrollHeight;}
function applyFx2(b){const f=b.fx;if(!f)return;const s=M2.st;if(f.op==='ctx')f.v.forEach(v=>{if(!s.ctx.includes(v))s.ctx.push(v);});if(f.op==='req')s.reqs.push({v:f.v,from:M2.i});if(f.op==='eps')f.v.forEach(e=>s.eps.push({m:e[0],p:e[1],a:e[2],from:M2.i}));}
function renderPoll2(f){const room=document.getElementById('meet-room2');const d=document.createElement('div');d.className='poll';d.innerHTML='<div class="q">'+f.q+'</div>'+f.opts.map(o=>'<label><input type="radio" name="poll2-'+f.id+'" value="'+o.v+'"> '+o.l+'</label>').join('')+'<div class="react" style="display:none"></div>';d.querySelectorAll('input').forEach(inp=>inp.addEventListener('change',()=>{if(d.classList.contains('answered'))return;d.classList.add('answered');d.querySelectorAll('input').forEach(x=>x.disabled=true);M2.st.dec[f.id]=inp.value;const rec=d.querySelector('.react');rec.style.display='block';rec.textContent=REACT2[f.id][inp.value];renderCanvas2();setTimeout(meet2Next,900);}));room.appendChild(d);room.scrollTop=room.scrollHeight;}

/* ── emissor YAML mínimo (objetos → YAML em bloco) ── */
function yq(v){if(typeof v!=='string')return String(v);if(v===''||/^[\s\-?:,\[\]{}#&*!|>'"%@`]|: | #|^(true|false|null|yes|no|~)$|^[\d.+-]+$|[:#]$/i.test(v))return "'"+v.replace(/'/g,"''")+"'";return v;}
function yk(k){return /^\d+$/.test(k)||/[:#\s]/.test(k)&&!/^\//.test(k)?"'"+k+"'":k;}
function toYaml(o,ind){ind=ind||0;const sp=' '.repeat(ind);let out='';
 if(Array.isArray(o)){if(!o.length)return sp+'[]\n';o.forEach(v=>{if(v!==null&&typeof v==='object'){const inner=toYaml(v,ind+2);out+=sp+'- '+inner.slice(ind+2);}else out+=sp+'- '+yq(v)+'\n';});return out;}
 for(const [k,v] of Object.entries(o)){if(v===undefined)continue;if(v!==null&&typeof v==='object'){if(Array.isArray(v)&&v.length&&v.every(x=>typeof x!=='object'))out+=sp+yk(k)+': ['+v.map(yq).join(', ')+']\n';else if(Array.isArray(v)&&!v.length)out+=sp+yk(k)+': []\n';else if(!Array.isArray(v)&&!Object.keys(v).length)out+=sp+yk(k)+': {}\n';else out+=sp+yk(k)+':\n'+toYaml(v,ind+2);}else out+=sp+yk(k)+': '+yq(v)+'\n';}
 return out;}

/* ── o contrato multi-contexto, montado a partir das decisões ── */
function buildYaml2(dec){const d=Object.assign({},DEF2,dec||{});const pre=d.ver==='now'?'/v1':'';const sync=d.sync==='sync';
const R=n=>({$ref:'#/components/schemas/'+n}),E=n=>({$ref:'#/components/responses/'+n});
const json=(desc,schema)=>({description:desc,content:{'application/json':{schema}}});
const body=n=>({required:true,content:{'application/json':{schema:R(n)}}});
const id=(nome)=>({name:nome||'id',in:'path',required:true,schema:{type:'integer',format:'int32',minimum:1}});
const pub={security:[]},lock={security:[{bearerAuth:[]}]};
const P={};const p=x=>pre+x;
P[p('/api/auth/login')]={post:{tags:['Auth'],summary:'Login (público): devolve o token JWT',...pub,requestBody:body('LoginRequest'),responses:{'200':json('Token emitido',R('LoginResponse')),'400':E('Validacao'),'401':E('NaoAutenticado')}}};
P[p('/api/catalogo/produtos')]={
 get:{tags:['Catalogo'],summary:'Lista produtos (público)',...pub,parameters:[{name:'page',in:'query',schema:{type:'integer',minimum:0,default:0}},{name:'size',in:'query',schema:{type:'integer',minimum:1,maximum:100,default:20}}],responses:{'200':json('OK',{type:'array',items:R('Produto')}),'400':E('Validacao')}},
 post:{tags:['Catalogo'],summary:'Cadastra produto (exige login)',...lock,requestBody:body('ProdutoRequest'),responses:{'201':json('Criado',R('Produto')),'400':E('Validacao'),'401':E('NaoAutenticado')}}};
P[p('/api/catalogo/produtos/{id}')]={
 get:{tags:['Catalogo'],summary:'Busca produto (público)',...pub,parameters:[id()],responses:{'200':json('OK',R('Produto')),'400':E('Validacao'),'404':E('NaoEncontrado')}},
 put:{tags:['Catalogo'],summary:'Atualiza produto (exige login)',...lock,parameters:[id()],requestBody:body('ProdutoRequest'),responses:{'200':json('Atualizado',R('Produto')),'400':E('Validacao'),'401':E('NaoAutenticado'),'404':E('NaoEncontrado')}},
 delete:{tags:['Catalogo'],summary:'Exclui produto (exige login)',...lock,parameters:[id()],responses:{'204':{description:'Excluído (sem corpo)'},'401':E('NaoAutenticado'),'404':E('NaoEncontrado')}}};
if(sync){
P[p('/api/catalogo/produtos/{id}/reservar')]={post:{tags:['Interno'],summary:'Reserva estoque (chamado por Pedidos no checkout)',...lock,parameters:[id()],requestBody:body('ReservaRequest'),responses:{'200':json('Reservado',R('Reserva')),'400':E('Validacao'),'401':E('NaoAutenticado'),'404':E('NaoEncontrado'),'409':E('EstoqueInsuficiente')}}};
P[p('/api/catalogo/produtos/{id}/liberar')]={post:{tags:['Interno'],summary:'Devolve estoque reservado (desfaz a reserva se o checkout falhar)',...lock,parameters:[id()],requestBody:body('ReservaRequest'),responses:{'204':{description:'Liberado (sem corpo)'},'400':E('Validacao'),'401':E('NaoAutenticado')}}};}
P[p('/api/clientes')]={post:{tags:['Clientes'],summary:'Cadastra cliente (exige login)',...lock,requestBody:body('ClienteRequest'),responses:{'201':json('Criado',R('Cliente')),'400':E('Validacao'),'401':E('NaoAutenticado')}}};
P[p('/api/clientes/{id}')]={
 get:{tags:['Clientes'],summary:'Busca cliente (exige login)',...lock,parameters:[id()],responses:{'200':json('OK',R('Cliente')),'400':E('Validacao'),'401':E('NaoAutenticado'),'404':E('NaoEncontrado')}},
 put:{tags:['Clientes'],summary:'Atualiza nome e e-mail (exige login)',...lock,parameters:[id()],requestBody:body('AtualizarClienteRequest'),responses:{'200':json('Atualizado',R('Cliente')),'400':E('Validacao'),'401':E('NaoAutenticado'),'404':E('NaoEncontrado')}}};
P[p('/api/clientes/{id}/desativar')]={post:{tags:['Clientes'],summary:'Desativa o cliente (em vez de apagar)',...lock,parameters:[id()],responses:{'200':json('Desativado',R('Cliente')),'401':E('NaoAutenticado'),'404':E('NaoEncontrado'),'409':E('Conflito')}}};
P[p('/api/clientes/{id}/enderecos')]={get:{tags:['Interno'],summary:'Endereços do cliente (chamado por Pedidos no checkout)',...lock,parameters:[id()],responses:{'200':json('OK',{type:'array',items:R('Endereco')}),'400':E('Validacao'),'401':E('NaoAutenticado')}}};
const criar=sync?{'201':json('Criado e com estoque reservado',R('Pedido')),'400':E('Validacao'),'401':E('NaoAutenticado'),'409':E('EstoqueInsuficiente'),'503':E('DependenciaIndisponivel')}
 :{'202':json('Aceito: o pedido nasce CRIADO e é confirmado depois, por evento',R('Pedido')),'400':E('Validacao'),'401':E('NaoAutenticado')};
P[p('/api/pedidos')]={
 post:{tags:['Pedidos'],summary:sync?'Checkout: reserva estoque e cria o pedido (exige login)':'Checkout: registra o pedido; a reserva acontece depois (exige login)',...lock,requestBody:body('PedidoRequest'),responses:criar},
 get:{tags:['Pedidos'],summary:'Lista os MEUS pedidos (exige login)',...lock,responses:{'200':json('OK',{type:'array',items:R('Pedido')}),'401':E('NaoAutenticado')}}};
P[p('/api/pedidos/{id}/cancelar')]={post:{tags:['Pedidos'],summary:'Cancela um pedido meu (exige login)',...lock,parameters:[id()],responses:{'204':{description:'Cancelado (sem corpo)'},'401':E('NaoAutenticado'),'404':E('NaoEncontrado'),'409':E('Conflito')}}};
/* respostas de erro (RFC 7807) */
const prob=(desc,slug,title,status,detail)=>({description:desc,content:{'application/problem+json':{schema:R('ProblemDetails'),example:{type:'https://example.com/erros/'+slug,title,status,detail}}}});
const responses={Validacao:prob('Dados inválidos','validacao','Requisição inválida',400,'O campo quantidade deve ser maior que zero.'),
 NaoAutenticado:prob('Token ausente, inválido ou vencido','nao-autenticado','Não autenticado',401,'Envie o header Authorization: Bearer <token>.'),
 NaoEncontrado:prob('Não encontrado','nao-encontrado','Não encontrado',404,'O recurso 999 não existe.'),
 Conflito:prob('A operação não vale no estado atual','conflito','Conflito de estado',409,'Este pedido já foi enviado e não pode ser cancelado.')};
if(sync){responses.EstoqueInsuficiente=prob('Sem estoque para reservar','estoque-insuficiente','Estoque insuficiente',409,'Produto 101: pedido 999, disponível 8.');
 responses.DependenciaIndisponivel=prob('Outro contexto não respondeu a tempo (2s)','dependencia-indisponivel','Contexto indisponível',503,'O Catálogo não respondeu em 2 segundos. Tente de novo.');}
const money={type:'number',minimum:0.01,description:'Reais; no banco é DECIMAL(10,2), nunca float',example:249.9};
const S={
 LoginRequest:{type:'object',required:['login','password'],properties:{login:{type:'string',minLength:1,example:'admin'},password:{type:'string',format:'password',minLength:1,example:'admin123'}}},
 LoginResponse:{type:'object',required:['token','user'],properties:{token:{type:'string',example:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiJ9.assinatura'},user:{type:'object',properties:{id:{type:'integer',example:1},name:{type:'string',example:'Administrador'},login:{type:'string',example:'admin'}}}}},
 ProdutoRequest:{type:'object',description:'O que se ENVIA no POST/PUT (sem id: quem cria é o servidor)',required:['nome','preco','estoque'],additionalProperties:false,properties:{nome:{type:'string',minLength:2,maxLength:120,example:'Teclado Mecânico RGB'},preco:money,estoque:{type:'integer',minimum:0,example:50}}},
 Produto:{type:'object',required:['id','nome','preco','estoque'],properties:{id:{type:'integer',example:101},nome:{type:'string',example:'Teclado Mecânico RGB'},preco:money,estoque:{type:'integer',example:50},reservado:{type:'integer',description:'Unidades reservadas por pedidos em andamento',example:2},disponivel:{type:'integer',description:'estoque − reservado',example:48}}}};
if(sync){S.ReservaRequest={type:'object',required:['quantidade','pedidoOrigem'],additionalProperties:false,properties:{quantidade:{type:'integer',minimum:1,example:2},pedidoOrigem:{type:'string',example:'PED-2026-0001'}}};
 S.Reserva={type:'object',required:['reservaId','status','precoUnitario'],properties:{reservaId:{type:'string',example:'a1b2c3d4'},status:{type:'string',enum:['RESERVADO'],example:'RESERVADO'},precoUnitario:Object.assign({},money,{description:'Preço no momento da reserva (o pedido guarda essa cópia)'})}};}
S.EnderecoRequest={type:'object',required:['logradouro','cidade','uf','cep'],properties:{logradouro:{type:'string',example:'Rua das Flores, 100'},cidade:{type:'string',example:'São Paulo'},uf:{type:'string',minLength:2,maxLength:2,example:'SP'},cep:{type:'string',pattern:'^\\d{5}-?\\d{3}$',example:'01001-000'}}};
S.Endereco={allOf:[{type:'object',required:['id'],properties:{id:{type:'integer',example:3}}},R('EnderecoRequest')]};
S.ClienteRequest={type:'object',required:['nome','email'],properties:{nome:{type:'string',minLength:2,example:'Ana Souza'},email:{type:'string',format:'email',example:'ana@example.com'},enderecos:{type:'array',items:R('EnderecoRequest')}}};
S.AtualizarClienteRequest={type:'object',required:['nome','email'],additionalProperties:false,properties:{nome:{type:'string',minLength:2,example:'Ana Souza Lima'},email:{type:'string',format:'email',example:'ana.lima@example.com'}}};
S.Cliente={type:'object',required:['id','nome','email','ativo'],properties:{id:{type:'integer',example:7},nome:{type:'string',example:'Ana Souza'},email:{type:'string',example:'ana@example.com'},ativo:{type:'boolean',example:true},enderecos:{type:'array',items:R('Endereco')}}};
S.ItemRequest={type:'object',required:['produtoId','quantidade'],properties:{produtoId:{type:'integer',example:101},quantidade:{type:'integer',minimum:1,example:2}}};
S.PedidoRequest={type:'object',required:['clienteId','enderecoId','itens'],additionalProperties:false,properties:{clienteId:{type:'integer',example:7},enderecoId:{type:'integer',example:3},itens:{type:'array',minItems:1,items:R('ItemRequest')}}};
const itemProps={produtoId:{type:'integer',example:101},quantidade:{type:'integer',example:2}};
if(d.snap==='sim')itemProps.precoUnitario=Object.assign({},money,{description:'CÓPIA do preço no dia da compra (snapshot): não muda se o Catálogo mudar'});
S.ItemPedido={type:'object',description:d.snap==='sim'?'Item com o preço copiado (snapshot)':'Item só com o produtoId: o preço é consultado no Catálogo',required:Object.keys(itemProps),properties:itemProps};
const pedProps={id:{type:'integer',example:5001},usuario:{type:'string',description:'login de quem comprou (vem do token)',example:'admin'},clienteId:{type:'integer',example:7}};
if(d.end==='copia')pedProps.enderecoEntrega=Object.assign({description:'CÓPIA do endereço no dia da compra'},R('EnderecoRequest'));else pedProps.enderecoId={type:'integer',description:'Referência ao endereço, que é de Clientes',example:3};
pedProps.status={type:'string',enum:['CRIADO','RESERVADO','CONFIRMADO','ENVIADO','CANCELADO'],example:sync?'RESERVADO':'CRIADO'};
pedProps.itens={type:'array',items:R('ItemPedido')};
if(d.snap==='sim')pedProps.total=Object.assign({},money,{description:'Soma de precoUnitario × quantidade',example:499.8});
S.Pedido={type:'object',required:['id','clienteId','status','itens'],properties:pedProps};
S.ProblemDetails={type:'object',description:'Erro no padrão RFC 7807',properties:{type:{type:'string'},title:{type:'string'},status:{type:'integer'},detail:{type:'string'}}};
const tags=[{name:'Auth',description:'Login'},{name:'Catalogo',description:'📦 Produtos e estoque'},{name:'Pedidos',description:'🛒 Checkout e ciclo de vida do pedido'},{name:'Clientes',description:'🧾 Cadastro e endereços'}];
if(true)tags.push({name:'Interno',description:'Rotas que um contexto chama no outro (exigem login, como as demais)'});
const doc={openapi:'3.1.0',info:{title:'Loja REST API — Multi-Contextos',version:d.ver==='now'?'1.0.0':'0.2.0',description:'Contrato da Sala v2 (Tab 8). 4 contextos (Auth, Catálogo, Pedidos, Clientes) num arquivo só, separados por tags. Segurança: só autenticação — leitura do catálogo é pública; o resto exige login (sem perfis/roles).'},
 servers:[{url:'http://localhost:4011',description:'Mock (Prism, Tab 8)'},{url:'http://localhost:5000',description:'API real (Tab 9, dotnet run)'},{url:'http://localhost:8080',description:'API real (Tab 9, Docker)'}],
 security:[{bearerAuth:[]}],tags,paths:P,
 components:{securitySchemes:{bearerAuth:{type:'http',scheme:'bearer',bearerFormat:'JWT'}},responses,schemas:S}};
return '# Gerado pela Sala de Contrato v2 (Tab 8). Decisões: '+Object.entries(d).map(([k,v])=>LBL2[k]+'='+v).join(' · ')+'\n'+toYaml(doc);}

function renderCanvas2(){const s=M2.st;
document.getElementById('cv2-ctx').innerHTML=s.ctx.length?s.ctx.map(c=>'<span class="roster-chip" style="cursor:default">'+c+'</span>').join(' '):'—';
document.getElementById('cv2-req').innerHTML=s.reqs.length?s.reqs.map(r=>'<div data-from="'+r.from+'">• '+r.v+'</div>').join(''):'—';
document.getElementById('cv2-eps').innerHTML=s.eps.length?'<table><tr><th>Método</th><th>Rota</th><th>Acesso</th></tr>'+s.eps.map(e=>'<tr data-from="'+e.from+'"><td>'+e.m+'</td><td>'+e.p+'</td><td>'+e.a+'</td></tr>').join('')+'</table>':'—';
const decs=Object.keys(LBL2).filter(k=>s.dec[k]);document.getElementById('cv2-dec').innerHTML=decs.length?decs.map(k=>{const v=s.dec[k],m=DEC_META2[k][v];return '<div>⚖️ '+LBL2[k]+' = <strong>'+v+'</strong> · defendeu: '+m.adv+(m.con!=='—'?' · cedeu: '+m.con:'')+'</div>';}).join(''):'—';
document.getElementById('cv2-yaml').textContent=buildYaml2(s.dec);}
let CONTRACT2_YAML=null;
function finishMeeting2(){CONTRACT2_YAML=buildYaml2(M2.st.dec);const y=document.getElementById('contract2-yaml');if(y)y.textContent=CONTRACT2_YAML;document.getElementById('meet2-out').style.display='flex';showToast('🎉 Contrato v2 fechado! A parte ⑤ já mostra o seu YAML.');}
function currentContract2(){return CONTRACT2_YAML||buildYaml2(DEF2);}
function copyContract2(){navigator.clipboard.writeText(currentContract2()).then(()=>showToast('📋 openapi-multicontexto.yaml copiado!'));}
function downloadContract2(){const b=new Blob([currentContract2()],{type:'text/yaml'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='openapi-multicontexto.yaml';a.click();URL.revokeObjectURL(a.href);}
function ataContent2(){const s=M2.st,d=Object.assign({},DEF2,s.dec);const part=Object.values(PERSONAS).map(P=>'- '+P.p+' '+P.n+' — '+P.ri+' '+P.r).join('\n');
const decs=Object.keys(LBL2).map(k=>{const v=d[k],m=DEC_META2[k][v];return '- '+LBL2[k]+' = '+v+(s.dec[k]?'':' (padrão)')+' · defendeu: '+m.adv+(m.con!=='—'?' · cedeu: '+m.con:'');}).join('\n');
return '# Ata — Sala de Contrato v2 (multi-contextos)\n\n## Participantes\n'+part+'\n\n## Contextos\n'+(s.ctx.length?s.ctx.map(c=>'- '+c).join('\n'):'- 🔑 Auth\n- 📦 Catálogo\n- 🛒 Pedidos\n- 🧾 Clientes')+'\n\n## Requisitos\n'+(s.reqs.length?s.reqs.map(r=>'- '+r.v).join('\n'):'- (padrão)')+'\n\n## Endpoints\n'+(s.eps.length?s.eps.map(e=>'- '+e.m+' '+e.p+' ('+e.a+')').join('\n'):'- (veja o openapi-multicontexto.yaml)')+'\n\n## Decisões (defendeu/cedeu)\n'+decs+'\n- Formato: 1 YAML com tags (ADR-009) · Segurança: só autenticação (ADR-010)\n';}
function downloadAta2(){const b=new Blob([ataContent2()],{type:'text/markdown'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='ata-v2.md';a.click();URL.revokeObjectURL(a.href);showToast('📄 ata-v2.md baixada!');}

/* ═══════════ Mapa de contextos clicável (Tab 8, parte ②) ═══════════ */
const CTX_MAP={
auth:{t:'🔑 Auth',c:'#f59e0b',o:'Quem é você? Recebe login e senha e devolve o token (JWT).',db:'🐬 MySQL <code>auth_db</code> (tabela <code>usuarios</code>)',r:[['POST','/api/auth/login','público']],fala:'Ninguém chama o Auth no meio de uma compra: o token já carrega quem é o usuário.',quem:'É usado por todos: o cliente faz login uma vez e manda o token nos outros contextos.'},
catalogo:{t:'📦 Catálogo',c:'#22c55e',o:'Os produtos, o preço e o estoque. É o <strong>dono do estoque</strong>: ninguém mais altera esse número.',db:'🐬 MySQL <code>catalogo_db</code>',r:[['GET','/api/catalogo/produtos','público'],['GET','/api/catalogo/produtos/{id}','público'],['POST','/api/catalogo/produtos','🔒'],['PUT','/api/catalogo/produtos/{id}','🔒'],['DELETE','/api/catalogo/produtos/{id}','🔒'],['POST','/api/catalogo/produtos/{id}/reservar','🔒 interno'],['POST','/api/catalogo/produtos/{id}/liberar','🔒 interno']],quem:'<strong>Recebe</strong> chamadas de Pedidos (reservar / liberar). Não chama ninguém.'},
pedidos:{t:'🛒 Pedidos',c:'#38bdf8',o:'O checkout e a vida do pedido (CRIADO → RESERVADO → CONFIRMADO → ENVIADO, ou CANCELADO). Pedido não se edita: se cancela.',db:'🐬 MySQL <code>pedidos_db</code>',r:[['POST','/api/pedidos','🔒'],['GET','/api/pedidos','🔒 (só os meus)'],['POST','/api/pedidos/{id}/cancelar','🔒']],quem:'<strong>Chama</strong> o Catálogo (reservar estoque e receber o preço) e Clientes (conferir o endereço). É o "maestro" do checkout.'},
clientes:{t:'🧾 Clientes',c:'#c084fc',o:'Cadastro de clientes e seus endereços. Cliente não se apaga: se desativa (os pedidos antigos dependem dele).',db:'🐬 MySQL <code>clientes_db</code>',r:[['POST','/api/clientes','🔒'],['GET','/api/clientes/{id}','🔒'],['PUT','/api/clientes/{id}','🔒'],['POST','/api/clientes/{id}/desativar','🔒'],['GET','/api/clientes/{id}/enderecos','🔒 interno']],quem:'<strong>Recebe</strong> chamadas de Pedidos (endereços). Não chama ninguém.'}};
function mapaCtx(k){document.querySelectorAll('#ctx-map .ctx-card').forEach(b=>b.classList.toggle('on',b.dataset.k===k));const c=CTX_MAP[k];const el=document.getElementById('ctx-detail');
el.style.borderColor=c.c;el.innerHTML='<h4 style="margin-top:0;color:'+c.c+'">'+c.t+'</h4><p>'+c.o+'</p><p><strong>Banco próprio:</strong> '+c.db+' — nenhum outro contexto lê esse banco direto.</p><p><strong>Conversa com quem:</strong> '+c.quem+'</p><div class="table-wrap"><table><tr><th>Verbo</th><th>Rota</th><th>Acesso</th></tr>'+c.r.map(r=>'<tr><td><code>'+r[0]+'</code></td><td><code>'+r[1]+'</code></td><td>'+r[2]+'</td></tr>').join('')+'</table></div>';}
