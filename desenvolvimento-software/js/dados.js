/* ═══════════ SIMULADOR INITIALIZR (GUIADO) ═══════════
   Usado pela Tab 2 (#sim-lab) e pela Tab 6 (#sim-proj).
   'pkg' é o Package name RECOMENDADO: é nele que mora o código das abas.
   (Removidos em B.27: switchBaseOs, updateJdkVersion, updateDotnetVersion —
    a instalação da Tab 1 antiga, o .sdkmanrc e o global.json saíram do guia.) */
const PRESETS={
'sim-lab':{proj:'maven-project',boot:'4.1.1',pack:'jar',conf:'yaml',java:'21',group:'com.example',artifact:'hello-spring',pkg:'com.example.hello',deps:['web']},
'sim-proj':{proj:'maven-project',boot:'4.1.1',pack:'jar',conf:'yaml',java:'21',group:'com.loja',artifact:'loja-api',pkg:'com.loja',deps:['web','data-jpa','security','validation','lombok']}
};
const SIM_FORM=`
<div class="initz-grid">
 <div class="initz-field"><strong>Project</strong><label><input type="radio" name="proj" value="maven-project" checked> Maven <span class="rec">✅ rec</span></label><label><input type="radio" name="proj" value="gradle-project"> Gradle-Groovy</label><label><input type="radio" name="proj" value="gradle-project-kotlin"> Gradle-Kotlin</label></div>
 <div class="initz-field"><strong>Language</strong><label><input type="radio" name="lang" value="java" checked> Java <span class="rec">✅ rec</span></label><label><input type="radio" name="lang" value="kotlin"> Kotlin</label></div>
 <div class="initz-field"><strong>Spring Boot</strong><label><input type="radio" name="boot" value="4.2.0-SNAPSHOT"> 4.2.0 SNAPSHOT</label><label><input type="radio" name="boot" value="4.2.0-M1"> 4.2.0 M1</label><label><input type="radio" name="boot" value="4.1.1" checked> 4.1.1 <span class="rec">✅ rec</span></label><label><input type="radio" name="boot" value="4.0.8"> 4.0.8</label></div>
 <div class="initz-field"><strong>Group / Artifact / Package name</strong><label>Group <input type="text" data-f="group"></label><label>Artifact <input type="text" data-f="artifact"></label><label>Package name <span class="rec">🔴 confira</span> <input type="text" data-f="pkg"></label></div>
 <div class="initz-field"><strong>Packaging / Configuration</strong><label><input type="radio" name="pack" value="jar" checked> Jar <span class="rec">✅ rec</span></label><label><input type="radio" name="pack" value="war"> War</label><label><input type="radio" name="conf" value="yaml" checked> YAML <span class="rec">✅ rec</span></label><label><input type="radio" name="conf" value="properties"> Properties</label></div>
 <div class="initz-field"><strong>Java</strong><label><input type="radio" name="javaver" value="26"> 26</label><label><input type="radio" name="javaver" value="25"> 25</label><label><input type="radio" name="javaver" value="21" checked> 21 <span class="rec">✅ rec</span></label><label><input type="radio" name="javaver" value="17"> 17</label></div>
 <div class="initz-field"><strong>Dependencies</strong><label><input type="checkbox" name="dep" value="web"> Spring Web <span class="rec">✅ rec</span></label><label><input type="checkbox" name="dep" value="data-jpa"> Data JPA</label><label><input type="checkbox" name="dep" value="security"> Security</label><label><input type="checkbox" name="dep" value="validation"> Validation</label><label><input type="checkbox" name="dep" value="lombok"> Lombok</label></div>
</div>
<div data-el="warn"></div>
<div class="flex gap-sm mt-2"><button class="btn btn-primary" data-act="curl">🔧 Mostrar curl equivalente</button><button class="btn" data-act="reset">↺ Voltar ao recomendado</button><a class="btn btn-zip" data-act="dl" href="#" target="_blank" rel="noopener">⬇️ Baixar ZIP real</a></div>
<div class="code-editor-wrap mt-2" data-el="curlwrap" style="display:none"><span class="code-filepath">curl equivalente (start.spring.io)</span><button class="copy-btn" onclick="copyCode(this)">📋 Copiar</button><pre class="code-editor" data-el="curl"></pre></div>`;
function makeInitz(rootId){
const preset=PRESETS[rootId];const root=document.getElementById(rootId);if(!root)return;root.innerHTML=SIM_FORM;root.dataset.recPkg=preset.pkg;
root.querySelector('[data-f=group]').value=preset.group;root.querySelector('[data-f=artifact]').value=preset.artifact;root.querySelector('[data-f=pkg]').value=preset.pkg;
preset.deps.forEach(d=>{const c=root.querySelector('[name=dep][value="'+d+'"]');if(c)c.checked=true;});
const refresh=()=>{const s=read(root);warn(root,s);atualizarLink(root,s);};
// Como no site: mexer em Group/Artifact recalcula o Package name sozinho.
root.querySelectorAll('[data-f=group],[data-f=artifact]').forEach(i=>i.addEventListener('input',()=>{const s=read(root);root.querySelector('[data-f=pkg]').value=pkgAuto(s);refresh();}));
root.querySelector('[data-f=pkg]').addEventListener('input',refresh);
root.querySelectorAll('input[type=radio],input[type=checkbox]').forEach(i=>i.addEventListener('change',refresh));
root.querySelector('[data-act=curl]').addEventListener('click',()=>curl(root));
root.querySelector('[data-act=reset]').addEventListener('click',()=>makeInitz(rootId));
refresh();
}
function read(root){return{proj:root.querySelector('[name=proj]:checked').value,boot:root.querySelector('[name=boot]:checked').value,pack:root.querySelector('[name=pack]:checked').value,conf:root.querySelector('[name=conf]:checked').value,java:root.querySelector('[name=javaver]:checked').value,group:root.querySelector('[data-f=group]').value.trim(),artifact:root.querySelector('[data-f=artifact]').value.trim(),pkg:root.querySelector('[data-f=pkg]').value.trim(),deps:[...root.querySelectorAll('[name=dep]:checked')].map(d=>d.value)};}
// O que o site sugere sozinho: Group + "." + Artifact, sem caracteres inválidos (o hífen some).
function pkgAuto(s){return (s.group+'.'+s.artifact).toLowerCase().replace(/[^a-z0-9.]/g,'').replace(/\.{2,}/g,'.');}
function warn(root,s){const w=[];const rec=root.dataset.recPkg;
if(s.pkg!==rec)w.push('🔴 Package name = '+(s.pkg||'(vazio)')+'. O código da aba fica em '+rec+' (e subpacotes). Com outro pacote, o Spring não encontra o controller e as rotas respondem 404. Escreva '+rec+'.');
if(/SNAPSHOT|-M\d/.test(s.boot))w.push('⚠️ Versão pré-release (SNAPSHOT/M): instável — não use em curso/produção.');
if(s.java!=='21')w.push('ℹ️ O guia usa Java 21 (o JDK que o IntelliJ baixou na Tab 2); com '+s.java+' o projeto pode não abrir com esse JDK.');
if(s.conf==='properties')w.push('ℹ️ O guia usa YAML (application.yml).');
if(s.pack==='war')w.push('ℹ️ O lab usa Jar (Tomcat embutido); War só para servidor externo.');
if(!s.deps.includes('web'))w.push('⚠️ Sem Spring Web não há endpoint nem Tomcat: marque Spring Web.');
root.querySelector('[data-el=warn]').innerHTML=w.map(x=>'<div class="warning-banner"><strong>'+x+'</strong></div>').join('');}
function url(s){const p=new URLSearchParams({type:s.proj,language:'java',bootVersion:s.boot,baseDir:s.artifact,groupId:s.group,artifactId:s.artifact,name:s.artifact,packageName:s.pkg,packaging:s.pack,javaVersion:s.java,configurationFileFormat:s.conf});if(s.deps.length)p.set('dependencies',s.deps.join(','));return 'https://start.spring.io/starter.zip?'+p;}
function atualizarLink(root,s){const dl=root.querySelector('[data-act=dl]');dl.href=url(s);dl.setAttribute('download',s.artifact+'.zip');}
function curl(root){const s=read(root);const u=url(s);root.querySelector('[data-el=curl]').textContent='# Baixa o ZIP já configurado (equivale ao botão GENERATE do site)\ncurl -o '+s.artifact+'.zip "'+u+'"\n# descompacte e abra no IntelliJ (File → Open)';root.querySelector('[data-el=curlwrap]').style.display='block';atualizarLink(root,s);}
