#!/usr/bin/env node
import {existsSync, readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

const base=resolve(process.cwd(),'portfolio-demos');
const pages=[
 ['Ruby', 'ruby/index.html','system/app.js','system/styles.css'],
 ['FleetOps Admin','fleet/index.html','system/app.js','system/styles.css'],
 ['Android simulator','android/index.html','android/app.js','android/styles-v2.css'],
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
for(const file of ['assets/ruby-showcase-v6.js','system/app.js','android/app.js','pdv/app.js','ondas/app.js']){
 const path=resolve(base,file);
 check(existsSync(path),'JS disponível: '+file);
 if(existsSync(path)){
   try{execFileSync(process.execPath,['--check',path],{stdio:'pipe'});console.log('OK   JS syntax:',file)}
   catch(e){issues++;console.error('FAIL JS syntax',file,e.message)}
 }
}
const index=readFileSync(resolve(base,'index.html'),'utf8');
check(index.includes('ruby-showcase-v6.js'),'Vitrine aponta para arquivo versionado v6');
const catalog=readFileSync(resolve(base,'assets/ruby-showcase-v6.js'),'utf8');
check(catalog.includes("external:'./ondas/'"),'Ondas na vitrine');
check(catalog.includes("external:'./android/'"),'Simulador Android na vitrine');
check(catalog.includes("external:'./fleet/'"),'FleetOps na vitrine');
console.log('\nVerificação:',issues?'FALHOU':'APROVADA');
process.exitCode=issues?1:0;
