/* ═══════════ SALA DE CONTRATO DA PAGUAI (Sprint 2, API First) ═══════════
   Evolução da Sala de Contrato v2 (disciplina Desenvolvimento de Software).
   O aluno conduz a reunião como arquiteto(a): cada decisão é dele, o time reage com
   os trade-offs, o YAML do contrato muda ao vivo e a ata vira o rascunho do ADR 0004.
   No fim, as escolhas são comparadas, item a item, com o contrato aprovado pela Helena
   (o mesmo arquivo contratos/extrato.openapi.yaml do repositório). */
(function(){
const P={
  livia:{av:'👩🏾‍🦱',nome:'Lívia',papel:'Front-end, pelos consumidores da API'},
  joana:{av:'👩🏻‍🦰',nome:'Joana',papel:'Product Owner'},
  rafa:{av:'🧔🏻',nome:'Rafa',papel:'Tech Lead'},
  helena:{av:'👩‍💼',nome:'Helena',papel:'Coordenadora de Arquitetura'},
  voce:{av:null,nome:null,papel:'arquiteto(a) recém-contratado(a), conduz a sala'}
};
const ATOS=['① Necessidades','② Formato dos dados','③ Navegação e período','④ Erros','⑤ Evolução e segurança','⑥ Aprovação'];

/* Decisões: tipo "time" = o que a Helena aprovou; "alt" = válida, mas o time não adotou; "errada" = quebra algo agora. */
const DEC={
 dinheiro:{tema:'Valores em dinheiro',q:'Como o contrato representa valores em dinheiro?',opts:[
  {v:'numero',tipo:'time',l:'Número com duas casas decimais (150.00), como o app já lê',por:'mantém o formato que o app já usa; a precisão fica garantida no servidor com decimal, e o app formata para exibir',r:[['livia','Ótimo, nada muda na minha tela.'],['rafa','Registro no ADR: texto fica como candidato para uma versão nova, na Sprint 7.']]},
  {v:'texto',tipo:'errada',l:'Texto ("150.00"), como muitas APIs financeiras fazem',por:'é uma boa prática para dinheiro, mas trocar o tipo de um campo existente quebra o app hoje; numa extração Strangler Fig, o contrato só pode acrescentar',r:[['livia','Isso quebra o app hoje: ele lê número. Precisaríamos lançar uma versão nova do app junto.'],['helena','Boa prática, momento errado. Escolha de novo, pensando na regra da sala.']]},
  {v:'ambos',tipo:'alt',l:'Manter o número e acrescentar um campo novo em texto (valorTexto)',por:'é aditivo e não quebra ninguém; o custo é ter dois campos com a mesma informação para manter em sincronia',r:[['rafa','Funciona e não quebra nada. Mas são dois campos para manter iguais para sempre.'],['helena','Alternativa válida. O time preferiu não duplicar agora; fica registrada.']]}]},
 saldo:{tema:'Saldo no extrato',q:'Onde o app encontra o saldo?',opts:[
  {v:'junto',tipo:'time',l:'Dentro do extrato, com o momento da consulta (saldoEm)',por:'uma chamada só para a tela inteira, e o app sabe de que momento é o saldo',r:[['livia','Uma chamada só para montar a tela. E com a hora, eu mostro "saldo às 14h07".'],['rafa','Deixa claro que o saldo pode ter mudado depois: é uma fotografia.']]},
  {v:'semMomento',tipo:'alt',l:'Dentro do extrato, como hoje, sem dizer de quando é o saldo',por:'não quebra nada e é como o monólito faz hoje; mas o saldo vem de outra chamada a Pagamentos e pode não bater com os lançamentos, sem que ninguém perceba',r:[['rafa','Não quebra nada. Mas o saldo vem de outra chamada: o lojista pode ver saldo e lançamentos de momentos diferentes e achar que é erro.'],['helena','Válida. O time preferiu deixar explícito o momento do saldo.']]},
  {v:'separado',tipo:'errada',l:'Tirar o saldo do extrato e deixá-lo só em GET /saldos/{contaId}',por:'separa responsabilidades, mas remove um campo que o app usa hoje; numa extração Strangler Fig, o contrato só pode acrescentar',r:[['livia','O app lê o saldoAtual do extrato hoje. Se ele sumir, a tela quebra.'],['helena','Contraria a regra da sala. Escolha de novo.']]}]},
 paginacao:{tema:'Paginação',q:'Como o app navega por milhares de lançamentos?',opts:[
  {v:'cursor',tipo:'time',l:'Cursor opcional (limite e cursor); sem limite, até 100 itens',por:'lançamentos novos chegam enquanto a pessoa navega, e o cursor não repete nem pula itens; sendo opcional, o app atual continua funcionando',r:[['livia','O "ver mais" usa o proximoCursor e pronto. Sem limite, nada muda para a tela atual.'],['rafa','E o Pagamentos pagina pelo índice, sem contar a tabela inteira.']]},
  {v:'pagina',tipo:'alt',l:'Por página (page e size)',por:'é simples e permite pular para a página 5, mas um lançamento novo empurra os itens e a próxima página repete um',r:[['rafa','Simples, mas se entrar um PIX enquanto a pessoa navega, a página 2 repete o último item da página 1.'],['helena','Válida e muito comum. Para extrato, que recebe itens novos o tempo todo, o time preferiu cursor.']]},
  {v:'nenhuma',tipo:'errada',l:'Sem paginação: devolve tudo do período',por:'um lojista com milhares de lançamentos recebe uma resposta enorme, lenta para todos',r:[['joana','O Seu Geraldo em dezembro tem milhares de lançamentos. A tela não abre.'],['helena','Não atende ao requisito da Joana. Escolha de novo.']]}]},
 periodo:{tema:'Período',q:'Qual período o extrato aceita?',opts:[
  {v:'30-90',tipo:'time',l:'Padrão de 30 dias e máximo de 90, com erro 422 acima disso',por:'cobre o uso do app (30 dias) e protege o Pagamentos de consultas enormes',r:[['livia','O app usa 30 dias. Noventa sobra.'],['rafa','E quem precisar de mais pede em partes. Vai como 422 no contrato.']]},
  {v:'30-365',tipo:'alt',l:'Padrão de 30 dias e máximo de 1 ano',por:'atende relatórios anuais, ao custo de consultas mais pesadas no Pagamentos',r:[['joana','Ajudaria no relatório anual do lojista.'],['rafa','Mas uma consulta de um ano pesa no Pagamentos. O time preferiu 90 dias agora.']]},
  {v:'livre',tipo:'errada',l:'Sem limite: o app pede o período que quiser',por:'uma consulta de cinco anos varre o Pagamentos inteiro e deixa o PIX lento para todos',r:[['rafa','Uma consulta de cinco anos varre o Pagamentos inteiro, o mesmo que processa o PIX.'],['helena','Risco para o subdomínio central. Escolha de novo.']]}]},
 erros:{tema:'Formato dos erros',q:'Como o contrato descreve os erros?',opts:[
  {v:'problemType',tipo:'time',l:'Problem Details (RFC 9457) com um type próprio para cada erro',por:'formato padrão, e o app decide o que mostrar pelo type, sem ler o texto da mensagem',r:[['livia','Eu faço um switch pelo type: conta-nao-encontrada, periodo-invalido... Sem ler texto.'],['rafa','E é o mesmo formato que o monólito já usa.']]},
  {v:'problem',tipo:'alt',l:'Problem Details, só com status e título',por:'segue o padrão, mas o app só distingue os erros pelo código HTTP ou pelo texto',r:[['livia','Dá para usar, mas dois erros 422 diferentes viram a mesma mensagem na tela.'],['helena','Válida. O type por erro dá mais precisão ao app.']]},
  {v:'proprio',tipo:'errada',l:'Formato próprio: {"erro": "mensagem"}',por:'cada serviço inventaria o seu formato, e o app teria um tratamento para cada um',r:[['livia','Cada serviço com um formato de erro? Eu teria um tratamento para cada um.'],['helena','Já temos um padrão na PagUai. Escolha de novo.']]}]},
 versao:{tema:'Versão',q:'Como o contrato vai evoluir?',opts:[
  {v:'aditivo',tipo:'time',l:'Sem prefixo de versão: só mudanças que não quebram',por:'a rota continua a mesma que o app usa hoje, condição para o Strangler Fig; quebrar exigiria uma versão nova (Sprint 7)',r:[['livia','A rota continua /contas/{id}/extrato. Meu app nem percebe a troca de serviço.'],['rafa','Quando precisar quebrar, decidimos a estratégia de versão. É a Sprint 7.']]},
  {v:'cabecalho',tipo:'alt',l:'Versão por cabeçalho (api-version), sem mudar a rota',por:'permite várias versões na mesma rota, ao custo de mais regras no gateway e no serviço desde já',r:[['rafa','Funciona sem mudar a rota, mas o gateway e o serviço passam a tratar versões desde o primeiro dia.'],['helena','Válida. O time preferiu não pagar esse custo antes de precisar.']]},
  {v:'v1',tipo:'errada',l:'Prefixo /v1 na rota desde já (/v1/contas/{id}/extrato)',por:'a rota muda, e o app, que chama a rota antiga, quebra; o gateway deixaria de ser transparente',r:[['livia','Meu app chama /contas/{id}/extrato. Com /v1, ele quebra no dia da troca.'],['helena','Contraria o Strangler Fig: a troca tem de ser invisível. Escolha de novo.']]}]},
 seguranca:{tema:'Segurança',q:'Hoje qualquer pessoa com o id vê o extrato. O que o contrato diz?',opts:[
  {v:'registrar',tipo:'time',l:'Declarar que ainda não há autenticação, como vulnerabilidade proposital, até a Sprint 11',por:'o contrato é honesto sobre o risco e quem consome sabe o que esperar; a correção tem data',r:[['joana','Fica visível para todos, com data para resolver.'],['helena','Contrato honesto. A Sprint 11 traz o login com Keycloak.']]},
  {v:'tokenJa',tipo:'errada',l:'Exigir token desde já',por:'é o destino certo, mas hoje quebraria o app: a PagUai ainda não tem um provedor de identidade, e o app não teria como obter o token',r:[['livia','Eu adoraria, mas de onde o app tira o token? Ainda não temos login: o app pararia de funcionar.'],['helena','Correto como destino, momento errado: fica para a Sprint 11. Escolha de novo.']]},
  {v:'omitir',tipo:'errada',l:'Não dizer nada no contrato',por:'esconde um risco conhecido de quem consome a API',r:[['joana','Se der problema, vão perguntar por que ninguém avisou.'],['helena','Contrato não esconde risco. Escolha de novo.']]}]}
};
const ORDEM=['dinheiro','saldo','paginacao','periodo','erros','versao','seguranca'];

const FALAS=[
 {a:0,s:'helena',t:'Bem-vindos à Sala de Contrato. O Extrato vai sair do monólito, e o serviço novo nasce do contrato, antes de qualquer código. {nome} conduz; eu aprovo no fim.'},
 {a:0,s:'voce',t:'Antes de decidir qualquer coisa, quero ouvir quem consome o extrato e saber o que não pode quebrar.'},
 {a:0,s:'livia',t:'Falo pelo app e pelo portal do lojista, a pedido do líder de Front-end. O app já chama GET /contas/{id}/extrato e mostra saldo e, para cada lançamento, data, tipo, valor e descrição.',fx:{req:'Manter a rota GET /contas/{id}/extrato e todos os campos atuais'}},
 {a:0,s:'joana',t:'Um lojista grande, como o Seu Geraldo em dezembro, tem milhares de lançamentos no mês. A tela precisa abrir rápido.',fx:{req:'Abrir rápido mesmo com milhares de lançamentos'}},
 {a:0,s:'rafa',t:'E o serviço novo não tem banco: cada consulta vira chamadas ao monólito. Quanto menos dado por chamada, melhor.',fx:{req:'Limitar o volume de dados por resposta'}},
 {a:0,s:'voce',t:'Então a regra desta sala é: o contrato novo só acrescenta. Nada do que o app usa hoje muda.',fx:{req:'Regra da sala: só mudanças aditivas (Strangler Fig)'}},
 {a:1,s:'livia',t:'Hoje o valor vem como número, 150.00. Em JavaScript, conta com decimal às vezes vira 149.99999.'},
 {a:1,s:'rafa',t:'Muitas APIs financeiras mandam dinheiro como texto. Mas trocar o tipo de um campo quebra quem já lê número.'},
 {a:1,s:'helena',dec:'dinheiro'},
 {a:1,s:'joana',t:'O lojista quer ver o saldo no topo do extrato.'},
 {a:1,s:'helena',dec:'saldo'},
 {a:2,s:'livia',t:'Na tela, mostro 50 lançamentos e um botão "ver mais".'},
 {a:2,s:'joana',dec:'paginacao'},
 {a:2,s:'rafa',t:'E se alguém pedir o extrato de cinco anos?'},
 {a:2,s:'rafa',dec:'periodo'},
 {a:3,s:'livia',t:'Quando dá erro, o app precisa saber o que mostrar: conta que não existe, período inválido, sistema fora do ar.'},
 {a:3,s:'livia',dec:'erros'},
 {a:3,s:'rafa',t:'E se o monólito cair? O Extrato está no ar, mas não consegue responder.',fx:{req:'Responder 503 quando Contas ou Pagamentos estiverem fora do ar',r503:true}},
 {a:4,s:'livia',dec:'versao'},
 {a:4,s:'joana',dec:'seguranca'},
 {a:5,s:'voce',t:'Resumo: {resumo}'},
 {a:5,s:'helena',fim:true}
];

let st=null;
function novoEstado(){return{i:0,esc:{},req:[],r503:false,auto:null,filtro:null};}
function nome(){return typeof nomeAluno==='function'?nomeAluno():'Arquiteto(a)';}
function av(){return typeof avatarAluno==='function'?avatarAluno():'🧑‍💻';}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function el(id){return document.getElementById(id);}

/* ── YAML ao vivo: o contrato muda conforme as escolhas ── */
function contrato(){
  const e=st.esc,num=e.dinheiro!=='texto';
  const valor=num?{type:'number',multipleOf:0.01}:{type:'string',pattern:'^\\d+\\.\\d{2}$'};
  const lanc={type:'object',required:['data','tipo','valor','descricao'],additionalProperties:false,properties:{data:{type:'string',format:'date-time'},tipo:{type:'string',enum:['Credito','Debito']},valor:Object.assign({},valor,{description:'Valor em reais, sempre positivo; o sentido está em tipo.'}),descricao:{type:'string'}}};
  if(e.dinheiro==='ambos'){lanc.properties.valorTexto={type:'string',pattern:'^\\d+\\.\\d{2}$'};lanc.required.push('valorTexto');}
  const ext={type:'object',required:['contaId','titular','de','ate','lancamentos'],additionalProperties:false,properties:{contaId:{type:'string',format:'uuid'},titular:{type:'string'}}};
  if(e.saldo!=='separado'){ext.properties.saldoAtual=Object.assign({},valor);ext.required.splice(2,0,'saldoAtual');}
  if(e.saldo==='junto'){ext.properties.saldoEm={type:'string',format:'date-time',description:'Momento em que o saldo foi consultado.'};ext.required.splice(3,0,'saldoEm');}
  ext.properties.de={type:'string',format:'date-time'};ext.properties.ate={type:'string',format:'date-time'};
  ext.properties.lancamentos={type:'array',items:{$ref:'#/components/schemas/Lancamento'}};
  const params=[{name:'contaId',in:'path',required:true,description:'Id da conta.',schema:{type:'string',format:'uuid'}},
    {name:'de',in:'query',required:false,description:'Início do período (ISO 8601).',schema:{type:'string',format:'date-time'}},
    {name:'ate',in:'query',required:false,description:'Fim do período (ISO 8601).',schema:{type:'string',format:'date-time'}}];
  if(e.paginacao==='cursor'){params.push({name:'limite',in:'query',required:false,description:'Lançamentos por página (1 a 200). Padrão, 100.',schema:{type:'integer',minimum:1,maximum:200,default:100}},{name:'cursor',in:'query',required:false,description:'Valor de proximoCursor da página anterior.',schema:{type:'string'}});ext.properties.proximoCursor={type:['string','null']};ext.required.push('proximoCursor');}
  if(e.paginacao==='pagina'){params.push({name:'page',in:'query',required:false,description:'Página, a partir de 1.',schema:{type:'integer',minimum:1,default:1}},{name:'size',in:'query',required:false,description:'Itens por página (1 a 200).',schema:{type:'integer',minimum:1,maximum:200,default:100}});ext.properties.total={type:'integer'};ext.required.push('total');}
  if(e.versao==='cabecalho')params.push({name:'api-version',in:'header',required:false,description:'Versão do contrato. Padrão, 1.',schema:{type:'string',default:'1'}});
  const tipoErro=e.erros==='proprio'?'application/json':'application/problem+json';
  const erro=d=>({description:d,content:{[tipoErro]:{schema:{$ref:'#/components/schemas/'+(e.erros==='proprio'?'Erro':'Problema')}}}});
  const resp={'200':{description:'Extrato do período.',content:{'application/json':{schema:{$ref:'#/components/schemas/Extrato'}}}},'404':erro('Conta não encontrada.')};
  if(e.periodo!=='livre'||e.paginacao)resp['422']=erro(e.periodo&&e.periodo!=='livre'?'Período ou parâmetro inválido (máximo de '+(e.periodo==='30-365'?'365':'90')+' dias).':'Parâmetro inválido.');
  if(st.r503)resp['503']=erro('Contas ou Pagamentos indisponível.');
  const op={tags:['Extrato'],operationId:'consultarExtrato',summary:'Consulta o extrato de uma conta',parameters:params,responses:resp};
  if(e.seguranca==='tokenJa')op.security=[{bearer:[]}];
  const caminho=(e.versao==='v1'?'/v1':'')+'/contas/{contaId}/extrato';
  const schemas={Extrato:ext,Lancamento:lanc};
  if(e.erros==='proprio')schemas.Erro={type:'object',required:['erro'],properties:{erro:{type:'string'}}};
  else{schemas.Problema={type:'object',description:'Problem Details (RFC 9457).',required:e.erros==='problemType'?['type','title','status','detail']:['title','status'],properties:{}};
    if(e.erros==='problemType')schemas.Problema.properties.type={type:'string',format:'uri'};
    Object.assign(schemas.Problema.properties,{title:{type:'string'},status:{type:'integer'},detail:{type:'string'}});}
  const doc={openapi:'3.1.0',info:{title:'PagUai · Serviço de Extrato',version:'1.0.0',description:'Gerado na Sala de Contrato (ODA, Sprint 2), conduzida por '+nome()+'.'},
    servers:[{url:'http://localhost:8080',description:'Pelo gateway'}],tags:[{name:'Extrato',description:'Consulta do extrato de uma conta.'}]};
  if(e.seguranca==='registrar'){doc.security=[];doc['x-paguai-vulnerabilidade-proposital']='Sem autenticação e sem verificação de dono da conta até a Sprint 11.';}
  doc.paths={[caminho]:{get:op}};
  doc.components={schemas};
  if(e.seguranca==='tokenJa')doc.components.securitySchemes={bearer:{type:'http',scheme:'bearer'}};
  return doc;
}
function yq(s){s=String(s);return /^[\w./{}()-][\w ./{}(),:-]*$/.test(s)&&!/^(true|false|null|yes|no|\d[\d.]*)$/i.test(s)&&!/: |#/.test(s)&&!/:$/.test(s)?s:JSON.stringify(s);}
function yaml(v,n){n=n||0;const pad='  '.repeat(n);
  if(Array.isArray(v)){if(!v.length)return ' []';if(v.every(x=>x===null||typeof x!=='object'))return ' ['+v.map(x=>x===null?'"null"':yq(x)).join(', ')+']';
    return '\n'+v.map(x=>{const s=yaml(x,n+1).replace(/^\n/,'');return pad+'- '+s.replace(new RegExp('^'+'  '.repeat(n+1)),'');}).join('\n');}
  if(v&&typeof v==='object'){const ks=Object.keys(v);if(!ks.length)return ' {}';return '\n'+ks.map(k=>pad+yq(k)+':'+yaml(v[k],n+1)).join('\n');}
  if(v===null)return ' null';if(typeof v==='number'||typeof v==='boolean')return ' '+v;return ' '+yq(v);}
function yamlTexto(){return '# Contrato gerado na Sala de Contrato da PagUai (ODA, Sprint 2).\n'+yaml(contrato(),0).replace(/^\n/,'')+'\n';}

/* ── Checklist do contrato, ao vivo ── */
function checklist(){
  const e=st.esc,c=contrato(),op=Object.values(c.paths)[0].get;
  return [
   ['Operação com operationId e resumo',!!(op.operationId&&op.summary)],
   ['Todo parâmetro tem descrição',op.parameters.every(p=>p.description)],
   ['Rota atual preservada (o app não quebra)',e.versao!=='v1'],
   ['Campos atuais preservados com o mesmo tipo',e.dinheiro!=='texto'&&e.saldo!=='separado'],
   ['Volume por resposta limitado',!!e.paginacao&&e.paginacao!=='nenhuma'&&e.periodo!=='livre'],
   ['Erros no formato Problem Details (RFC 9457)',!!e.erros&&e.erros!=='proprio'],
   ['Falha de dependência prevista (503)',st.r503],
   ['Segurança declarada no contrato',!!e.seguranca&&e.seguranca!=='omitir']
  ];
}

/* ── Desenho ── */
function render(){
  const raiz=el('sala-contrato');if(!raiz)return;
  el('sala-roster').innerHTML=Object.entries(P).map(([k,p])=>'<span class="sala-chip"><span class="av">'+(k==='voce'?av():p.av)+'</span> '+esc(k==='voce'?nome()+' (você)':p.nome)+' · '+esc(p.papel)+'</span>').join('');
  el('sala-atos').innerHTML=ATOS.map((a,i)=>'<button class="btn sala-ato'+(st.filtro===i?' active':'')+'" onclick="salaFiltro('+i+')">'+a+'</button>').join('')+(st.filtro!==null?'<button class="btn" onclick="salaFiltro(null)">Todos</button>':'');
  const atual=FALAS[Math.min(st.i,FALAS.length-1)];
  el('sala-status').textContent=st.i>=FALAS.length?'Reunião encerrada':ATOS[atual.a]+' · fala '+(st.i+1)+' de '+FALAS.length;
  el('sala-proxima').disabled=st.i>=FALAS.length||aguardando();
  el('sala-auto').textContent=st.auto?'⏸ Pausar':'▶ Auto';
  const ch=checklist();
  el('sala-quadro').innerHTML=
   '<h5>📌 Requisitos</h5>'+(st.req.length?'<ul>'+st.req.map(r=>'<li>'+esc(r)+'</li>').join('')+'</ul>':'<p class="text-muted text-sm">Aparecem conforme o time fala.</p>')+
   '<h5>⚖️ Decisões (viram o ADR 0004)</h5>'+(Object.keys(st.esc).length?'<ul>'+ORDEM.filter(k=>st.esc[k]).map(k=>{const o=opc(k);return '<li><span class="sala-tag '+o.tipo+'">'+rot(o.tipo)+'</span> <strong>'+esc(DEC[k].tema)+':</strong> '+esc(o.l)+'</li>';}).join('')+'</ul>':'<p class="text-muted text-sm">Você decide; o time reage.</p>')+
   '<h5>✅ Checklist do contrato</h5><ul class="sala-check">'+ch.map(([t,ok])=>'<li class="'+(ok?'ok':'pend')+'">'+(ok?'✔':'○')+' '+esc(t)+'</li>').join('')+'</ul>'+
   '<h5>🧾 YAML ao vivo</h5><pre class="sala-yaml">'+esc(yamlTexto())+'</pre>';
  el('sala-fim').style.display=st.i>=FALAS.length?'block':'none';
}
function rot(t){return t==='time'?'escolha do time':t==='alt'?'alternativa':'reprovada';}
function opc(k){return DEC[k].opts.find(o=>o.v===st.esc[k]);}
function aguardando(){const f=FALAS[st.i];return f&&f.dec&&!st.esc[f.dec];}
function balao(s,html,cls){const p=P[s];const d=document.createElement('div');d.className='msg'+(cls?' '+cls:'');d.dataset.ato=FALAS[Math.min(st.i,FALAS.length-1)].a;
  d.innerHTML='<span class="av">'+(s==='voce'?av():p.av)+'</span><div><div class="who">'+esc(s==='voce'?nome()+' (você · arquiteto(a) recém-contratado(a))':p.nome+' ('+p.papel+')')+'</div><div class="txt">'+html+'</div></div>';
  const c=el('sala-conversa');c.appendChild(d);aplicarFiltro();c.scrollTop=c.scrollHeight;}
function texto(t){return esc(t.replace('{nome}',nome()).replace('{resumo}',resumo()));}
function resumo(){return ORDEM.filter(k=>st.esc[k]).map(k=>DEC[k].tema.toLowerCase()+': '+opc(k).l).join('; ')+'.';}

function salaProxima(){
  if(st.i>=FALAS.length||aguardando())return;
  const f=FALAS[st.i];
  if(f.dec){mostrarDecisao(f);return;}
  if(f.fim){finalizar(f);st.i++;render();return;}
  balao(f.s,texto(f.t));
  if(f.fx){if(f.fx.req)st.req.push(f.fx.req);if(f.fx.r503)st.r503=true;}
  st.i++;render();mostrarSeForDecisao();
}
/* Quando a próxima fala é uma decisão, a pergunta aparece sozinha. */
function mostrarSeForDecisao(){const f=FALAS[st.i];if(f&&f.dec&&!st.esc[f.dec])mostrarDecisao(f);}
function mostrarDecisao(f){
  const d=DEC[f.dec];
  if(el('sala-poll-'+f.dec))return;
  const opts=d.opts.map(o=>'<button class="quiz-opt" data-v="'+o.v+'" onclick="salaEscolher(\''+f.dec+'\',\''+o.v+'\',this)">'+esc(o.l)+'</button>').join('');
  balao(f.s,'<strong>'+esc(nome())+', '+esc(d.q.charAt(0).toLowerCase()+d.q.slice(1))+'</strong><div class="sala-poll" id="sala-poll-'+f.dec+'">'+opts+'</div>','sala-pergunta');
  pararAuto();render();
}
window.salaEscolher=function(k,v,btn){
  const o=DEC[k].opts.find(x=>x.v===v);const box=el('sala-poll-'+k);
  if(st.esc[k])return;
  btn.disabled=true;btn.classList.add('escolhida',o.tipo==='time'?'ok':o.tipo==='alt'?'alt':'bad');
  balao('voce',esc(o.l)+'.');
  o.r.forEach(([s,t])=>balao(s,esc(t)));
  if(o.tipo==='errada'){render();return;}
  st.esc[k]=v;box.querySelectorAll('.quiz-opt').forEach(b=>b.disabled=true);
  st.i++;render();mostrarSeForDecisao();
};
function finalizar(){
  const dif=ORDEM.filter(k=>opc(k).tipo!=='time');
  const txt=dif.length?'Aprovado com ressalvas, '+esc(nome())+'. Em '+dif.length+' '+(dif.length>1?'pontos':'ponto')+' você seguiu uma alternativa válida que o time não adotou. Veja a comparação abaixo e registre no ADR 0004 por que escolheu assim.':'Aprovado, '+esc(nome())+'. As suas decisões são as mesmas do contrato que o time adotou. Agora escreva o ADR 0004 a partir da ata.';
  balao('helena',txt);
  el('sala-comparacao').innerHTML='<table><thead><tr><th>Tema</th><th>Sua escolha</th><th>Contrato aprovado</th></tr></thead><tbody>'+
   ORDEM.map(k=>{const o=opc(k),t=DEC[k].opts.find(x=>x.tipo==='time');return '<tr class="'+(o.tipo==='time'?'igual':'difere')+'"><td>'+esc(DEC[k].tema)+'</td><td>'+(o.tipo==='time'?'✔ ':'≠ ')+esc(o.l)+'</td><td>'+esc(t.l)+'<br><span class="text-muted text-sm">Por quê: '+esc(t.por)+'</span></td></tr>';}).join('')+'</tbody></table>';
}
function aplicarFiltro(){document.querySelectorAll('#sala-conversa .msg').forEach(m=>m.style.display=st.filtro===null||+m.dataset.ato===st.filtro?'':'none');}
window.salaFiltro=function(i){st.filtro=i;aplicarFiltro();render();};
window.salaProxima=salaProxima;
function pararAuto(){if(st.auto){clearInterval(st.auto);st.auto=null;}}
window.salaAuto=function(){if(st.auto){pararAuto();render();return;}st.auto=setInterval(()=>{if(st.i>=FALAS.length||aguardando()){pararAuto();render();return;}salaProxima();},2600);render();};
window.salaRecomecar=function(){pararAuto();st=novoEstado();el('sala-conversa').innerHTML='';el('sala-comparacao').innerHTML='';render();};
function baixar(nomeArq,conteudo,tipo){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([conteudo],{type:tipo}));a.download=nomeArq;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);}
window.salaBaixarYaml=function(){baixar('extrato.openapi.yaml',yamlTexto(),'application/yaml');};
window.salaCopiarYaml=function(){navigator.clipboard.writeText(yamlTexto()).then(()=>{if(typeof showToast==='function')showToast('📋 YAML copiado');});};
window.salaBaixarAta=function(){
  const hoje=new Date().toISOString().slice(0,10);
  const linhas=ORDEM.map(k=>{const o=opc(k);return '| '+DEC[k].tema+' | '+o.l+' | '+o.por+' |';}).join('\n');
  const md='# ADR 0004: Como extrair o Extrato (Strangler Fig, gateway e contrato)\n\n'+
  '> Rascunho gerado pela Sala de Contrato (ODA, Sprint 2). Complete as seções Contexto, Decisão, Alternativas e Consequências com as perguntas-guia do modelo em docs/adr/0004-como-extrair-o-extrato.md.\n\n'+
  '- **Status:** proposta\n- **Proposto por:** '+nome()+', arquiteto(a)\n- **Participantes:** Lívia Andrade (front-end, representante dos consumidores da API), Joana Lima (Product Owner), Rafa Souza (Tech Lead)\n- **Revisão e aprovação:** Helena Rocha, Coordenadora de Arquitetura\n- **Data:** '+hoje+'\n\n'+
  '## Requisitos levantados na sala\n\n'+st.req.map(r=>'- '+r).join('\n')+'\n\n## Decisões do contrato\n\n| Tema | Decisão | Por quê |\n| --- | --- | --- |\n'+linhas+'\n\n## Alternativas consideradas\n\n'+
  ORDEM.map(k=>'- **'+DEC[k].tema+':** '+DEC[k].opts.filter(o=>o.v!==st.esc[k]).map(o=>o.l+' ('+o.por+')').join('; ')).join('\n')+'\n';
  baixar('0004-como-extrair-o-extrato.md',md,'text/markdown');
};
window.iniciarSalas=function(c){if(!(c||document).querySelector('#sala-contrato'))return;pararAutoSeguro();st=novoEstado();el('sala-conversa').innerHTML='';render();};
function pararAutoSeguro(){if(st&&st.auto)clearInterval(st.auto);}
})();
