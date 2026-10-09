/* ═══════════ OS / SELETORES ═══════════ */
const baseOsContent={
win:`<div class="code-editor-wrap"><span class="code-filepath">terminal</span><button class="copy-btn" onclick="copyCode(this)">📋 Copiar</button><pre class="code-editor"># Habilita WSL2 (kernel Linux real p/ Docker)
wsl --install
# Docker Desktop (gerencia contêineres)
winget install --id Docker.DockerDesktop -e --silent
# Git (controle de versão)
winget install --id Git.Git -e --silent
# IDEs
winget install --id JetBrains.IntelliJIDEA.Community -e --silent
winget install --id Microsoft.VisualStudioCode -e --silent
# Validação
wsl --list --verbose && docker --version</pre></div>`,
linux:`<div class="code-editor-wrap"><span class="code-filepath">terminal</span><button class="copy-btn" onclick="copyCode(this)">📋 Copiar</button><pre class="code-editor"># Atualiza e instala utilitários
sudo apt-get update && sudo apt-get install -y curl wget git jq build-essential
# Docker Engine (script oficial) + grupo docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER && newgrp docker
sudo apt-get install -y docker-compose-plugin
# IDEs via snap
sudo snap install intellij-idea-community --classic
sudo snap install code --classic
# Validação
docker --version && docker compose version && groups</pre></div>`};
function switchBaseOs(os){document.getElementById('btn-os-win').className='os-btn'+(os==='win'?' active':'');document.getElementById('btn-os-linux').className='os-btn'+(os==='linux'?' active':'');document.getElementById('base-os-content').innerHTML=baseOsContent[os];}
function updateJdkVersion(){const v=document.getElementById('select-jdk-ver').value;const t={'19':'19.0.2-tem','21':'21.0.4-tem','22':'22.0.2-tem','25':'25.0.0-open'};document.getElementById('sdkmanrc-preview').textContent='# .sdkmanrc - Version Pinning da Equipe\n# Para aplicar: sdk env | Para instalar: sdk env install\n\njava='+t[v];}
function updateDotnetVersion(){const v=document.getElementById('select-dotnet-ver').value;document.getElementById('globaljson-preview').textContent=JSON.stringify({sdk:{version:v,rollForward:'latestFeature'}},null,2);}
/* ═══════════ SIMULADOR INITIALIZR (GUIADO) ═══════════ */
const PRESETS={
'sim-lab':{proj:'maven-project',boot:'4.1.1',pack:'jar',conf:'yaml',java:'21',group:'com.example',artifact:'hello-spring',deps:['web']},
'sim-proj':{proj:'maven-project',boot:'4.1.1',pack:'jar',conf:'yaml',java:'21',group:'com.loja',artifact:'loja-api',deps:['web','data-jpa','security','validation','lombok']}
};
const SIM_FORM=`
<div class="initz-grid">
 <div class="initz-field"><strong>Project</strong><label><input type="radio" name="proj" value="maven-project" checked> Maven <span class="rec">✅ rec</span></label><label><input type="radio" name="proj" value="gradle-project"> Gradle-Groovy</label><label><input type="radio" name="proj" value="gradle-project-kotlin"> Gradle-Kotlin</label></div>
 <div class="initz-field"><strong>Language</strong><label><input type="radio" name="lang" value="java" checked> Java <span class="rec">✅ rec</span></label><label><input type="radio" name="lang" value="kotlin"> Kotlin</label></div>
 <div class="initz-field"><strong>Spring Boot</strong><label><input type="radio" name="boot" value="4.2.0-SNAPSHOT"> 4.2.0 SNAPSHOT</label><label><input type="radio" name="boot" value="4.2.0-M1"> 4.2.0 M1</label><label><input type="radio" name="boot" value="4.1.1" checked> 4.1.1 <span class="rec">✅ rec</span></label><label><input type="radio" name="boot" value="4.0.8"> 4.0.8</label></div>
 <div class="initz-field"><strong>Group / Artifact</strong><label>Group <input type="text" data-f="group"></label><label>Artifact <input type="text" data-f="artifact"></label><label>Package (auto) <input type="text" data-f="pkg" readonly></label></div>
 <div class="initz-field"><strong>Packaging / Configuration</strong><label><input type="radio" name="pack" value="jar" checked> Jar <span class="rec">✅ rec</span></label><label><input type="radio" name="pack" value="war"> War</label><label><input type="radio" name="conf" value="yaml" checked> YAML <span class="rec">✅ rec</span></label><label><input type="radio" name="conf" value="properties"> Properties</label></div>
 <div class="initz-field"><strong>Java</strong><label><input type="radio" name="javaver" value="26"> 26</label><label><input type="radio" name="javaver" value="25"> 25</label><label><input type="radio" name="javaver" value="21" checked> 21 <span class="rec">✅ rec</span></label><label><input type="radio" name="javaver" value="17"> 17</label></div>
 <div class="initz-field"><strong>Dependencies</strong><label><input type="checkbox" name="dep" value="web"> Spring Web <span class="rec">✅ rec</span></label><label><input type="checkbox" name="dep" value="data-jpa"> Data JPA</label><label><input type="checkbox" name="dep" value="security"> Security</label><label><input type="checkbox" name="dep" value="validation"> Validation</label><label><input type="checkbox" name="dep" value="lombok"> Lombok</label></div>
</div>
<div data-el="warn"></div>
<div class="flex gap-sm mt-2"><button class="btn btn-primary" data-act="curl">🔧 Mostrar curl equivalente</button><button class="btn" data-act="reset">↺ Voltar ao recomendado</button><a class="btn btn-zip" data-act="dl" href="#" target="_blank" rel="noopener">⬇️ Baixar ZIP real</a></div>
<div class="code-editor-wrap mt-2" data-el="curlwrap" style="display:none"><span class="code-filepath">curl equivalente (start.spring.io)</span><button class="copy-btn" onclick="copyCode(this)">📋 Copiar</button><pre class="code-editor" data-el="curl"></pre></div>`;
function makeInitz(rootId){
const preset=PRESETS[rootId];const root=document.getElementById(rootId);if(!root)return;root.innerHTML=SIM_FORM;
root.querySelector('[data-f=group]').value=preset.group;root.querySelector('[data-f=artifact]').value=preset.artifact;
preset.deps.forEach(d=>{const c=root.querySelector('[name=dep][value="'+d+'"]');if(c)c.checked=true;});
const refresh=()=>{const s=read(root);root.querySelector('[data-f=pkg]').value=pkg(s);warn(root,s);};
root.querySelectorAll('input').forEach(i=>i.addEventListener('change',refresh));
root.querySelectorAll('input[type=text]').forEach(i=>i.addEventListener('input',refresh));
root.querySelector('[data-act=curl]').addEventListener('click',()=>curl(root));
root.querySelector('[data-act=reset]').addEventListener('click',()=>makeInitz(rootId));
refresh();
}
function read(root){return{proj:root.querySelector('[name=proj]:checked').value,boot:root.querySelector('[name=boot]:checked').value,pack:root.querySelector('[name=pack]:checked').value,conf:root.querySelector('[name=conf]:checked').value,java:root.querySelector('[name=javaver]:checked').value,group:root.querySelector('[data-f=group]').value,artifact:root.querySelector('[data-f=artifact]').value,deps:[...root.querySelectorAll('[name=dep]:checked')].map(d=>d.value)};}
function pkg(s){return (s.group+'.'+s.artifact).toLowerCase().replace(/[^a-z0-9.]/g,'').replace(/\.{2,}/g,'.');}
function warn(root,s){const w=[];if(/SNAPSHOT|-M\d/.test(s.boot))w.push('⚠️ Versão pré-release (SNAPSHOT/M): instável — não use em curso/produção.');if(s.java!=='21')w.push('ℹ️ O guia fixa Java 21 via .sdkmanrc; escolher '+s.java+' diverge do time.');if(s.conf==='properties')w.push('ℹ️ O guia usa YAML; o application.yml já vem no ZIP.');if(s.pack==='war')w.push('ℹ️ O lab usa Jar (Tomcat embutido); War só p/ servlet externo.');if(!s.deps.length)w.push('⚠️ Sem dependências não há endpoint nem Tomcat: adicione Spring Web.');root.querySelector('[data-el=warn]').innerHTML=w.map(x=>'<div class="warning-banner"><strong>'+x+'</strong></div>').join('');}
function url(s){const p=new URLSearchParams({type:s.proj,language:'java',bootVersion:s.boot,baseDir:s.artifact,groupId:s.group,artifactId:s.artifact,name:s.artifact,packageName:pkg(s),packaging:s.pack,javaVersion:s.java});if(s.deps.length)p.set('dependencies',s.deps.join(','));return 'https://start.spring.io/starter.zip?'+p;}
function curl(root){const s=read(root);const u=url(s);root.querySelector('[data-el=curl]').textContent='# Baixa o ZIP já configurado (equivale ao Generate / botão "…" do site)\ncurl -o '+s.artifact+'.zip "'+u+'"\n# descompacte e abra na IDE';root.querySelector('[data-el=curlwrap]').style.display='block';const dl=root.querySelector('[data-act=dl]');dl.href=u;dl.setAttribute('download',s.artifact+'.zip');}
