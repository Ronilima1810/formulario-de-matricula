#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

const base=resolve(process.cwd(),'portfolio-demos');
const pages=[
 ['Ruby', 'ruby/index.html','system/app.js','system/styles.css'],
 ['Ruby original', 'ruby-original/index.html','ruby-original/mock-api.js','ruby-original/module-demo.html','ruby-original/module-demo.js','ruby-original/module-demo.css','ruby-original/assets/ruby-theme.css','ruby-original/assets/index-original-portal.js','ruby-original/assets/index-BhmzTfeJ.css','ruby-original/assets/ruby-responsive-100.css','ruby-original/assets/union.png'],
 ['FleetOps Admin','fleet/index.html','fleet/fleet-original.js','fleet/fleet-original.css','fleet/native/ruby-theme.css','fleet/native/agregados.css','fleet/native/financeiro_admin.css','fleet/native/ruby_admin_standard.css','fleet/native/admin_legibilidade_0322.css','fleet/native/admin_dispatch_0321.css'],
 ['Android simulator','android/index.html','android/native-v3.js','android/native-v3.css','android/assets/native-icons.svg','android/assets/union_brand.png','android/assets/login_bg.mp4'],
 ['PDV Electron preview','pdv/index.html','pdv/app.js','pdv/styles.css'],
 ['Wave Control','ondas/index.html','ondas/app.js','ondas/styles.css']
];
let issues=0;
const check=(ok,label)=>{if(!ok){issues++;console.error('FAIL',label);}else console.log('OK  ',label)};
for(const [label,...files] of pages){
 for(const path of files)check(existsSync(resolve(base,path)),label+': '+path);
 const html=readFileSync(resolve(base,files[0]),'utf8');
 check(/<meta[^>]+Content-Security-Policy/i.test(html),label+': CSP definida');
 check(/<meta[^>]+viewport/i.test(html),label+': viewport responsivo');
}
for(const file of ['assets/ruby-showcase-v7.js','ruby-original/mock-api.js','ruby-original/module-demo.js','ruby-original/assets/index-original-portal.js','system/app.js','fleet/fleet-original.js','android/native-v3.js','pdv/app.js','ondas/app.js']){
 const path=resolve(base,file);
 check(existsSync(path),'JS disponível: '+file);
 if(existsSync(path)){
   try{execFileSync(process.execPath,['--check',path],{stdio:'pipe'});console.log('OK   JS syntax:',file)}
   catch(e){issues++;console.error('FAIL JS syntax',file,e.message)}
 }
}
const index=readFileSync(resolve(base,'index.html'),'utf8');
check(index.includes('ruby-showcase-v7.js'),'Vitrine aponta para arquivo versionado v7');
const catalog=readFileSync(resolve(base,'assets/ruby-showcase-v7.js'),'utf8');
check(catalog.includes("external:'./ruby-original/#/portal'"),'Frontend Ruby original na vitrine');
check(catalog.includes("external:'./ruby-original/#/bi'"),'BI usa shell React do Ruby original');
check(catalog.includes("external:'./ondas/'"),'Ondas na vitrine');
check(catalog.includes("external:'./android/'"),'Simulador Android na vitrine');
const kotlinPreview=readFileSync(resolve(base,'android/native-v3.js'),'utf8');
const kotlinCss=readFileSync(resolve(base,'android/native-v3.css'),'utf8');
for(const screen of ['login','register','forgot','approval','home','routes','history','profile','new','detail','stop','map','expenses','photo','signature','occurrence','address','updates']){
  check(kotlinPreview.includes("s.page==='"+screen+"'")||kotlinPreview.includes("['"+screen+"'"),'Tela nativa Android: '+screen);
}
for(const token of ['#060d1c','#0e1a33','#9d60ff','#ffd52a','#35e08a']){
  check(kotlinCss.includes(token),'Token Compose original: '+token);
}
check(kotlinPreview.includes('native-icons.svg'),'Ícones Android extraídos de TechIcons');
check(kotlinPreview.includes('union_brand.png'),'Logo Union original na navegação e login');
check(kotlinPreview.includes('union-login-card') && kotlinPreview.includes('login_bg.mp4'),'Login roxo UNION com mídia original e formulário');

check(catalog.includes("external:'./fleet/'"),'FleetOps na vitrine');
const fleetHtml=readFileSync(resolve(base,'fleet/index.html'),'utf8');
const fleetModule=readFileSync(resolve(base,'fleet/module.html'),'utf8');
const fleetApp=readFileSync(resolve(base,'fleet/fleet-original.js'),'utf8');
check(fleetHtml.includes('../ruby-original/#/agregados')&&fleetModule.includes('fleet-original.js')&&!fleetModule.includes('../system/app.js'),'FleetOps está integrado ao workspace Ruby e usa frontend próprio');
check(fleetModule.includes('native/ruby_admin_standard.css')&&fleetModule.includes('native/agregados.css'),'CSS Ruby/Agregados originais presentes');
for(const section of ['visao-geral','alertas','rastreamento','atribuicao','canhotos','acertos','cadastros','tarifas','tarifa-individual']){
 check(fleetApp.includes(section),'Painel FleetOps: '+section);
}
check(fleetApp.includes('example.invalid'),'Cadastros FleetOps são fictícios');
check(!fleetApp.includes('fetch(')&&!fleetApp.includes('XMLHttpRequest')&&!fleetApp.includes('WebSocket('),'FleetOps sem conexões a APIs reais');

const native=readFileSync(resolve(base,'ruby-original/assets/index-original-portal.js'),'utf8');
check(native.includes('Central de operações'),'Ruby original inclui a tela Command Center');
check(native.includes('launcher-card'),'Ruby original usa cards reais');
const mock=readFileSync(resolve(base,'ruby-original/mock-api.js'),'utf8');
check(mock.includes("usuario@exemplo.invalid"),'Preview usa identidade fictícia');
check(mock.includes("absolute.pathname === '/ruby/api/node.php'"),'API real interceptada localmente');

check(mock.includes('data:demoBI'),'BI recebe resposta sintética');
check(mock.includes("attributes:true,attributeFilter:['src']"),'Submenus PHP interceptados após mudar iframe');
const modules=readFileSync(resolve(base,'ruby-original/module-demo.js'),'utf8');
const requiredModules=['inventario','torre','transporte','central_financeira','agregados','checkin','compras','danfe_mg','admin','conta','about'];
for(const name of requiredModules){
 check(modules.split('\n').some(line=>line.trimStart().startsWith(name+':[')),'Módulo navegável: '+name);
}
check(modules.includes('Dev log|devlog'),'Inventário inclui subvisões completas');
check(modules.includes('Processos|processos'),'Compras inclui processos');
check(modules.includes('Negociação por agregado|negociacao'),'Agregados inclui negociação');
check(modules.includes('dados locais, sem API'),'Dados demonstrativos sem backend');

console.log('\nVerificação:',issues?'FALHOU':'APROVADA');
process.exitCode=issues?1:0;
