'use strict';
const base='https://github.com/Ronilima1810/';
const demos=[
 {id:'bi',icon:'📊',name:'BI Logístico',label:'CONCEITO INTERATIVO',desc:'Indicadores de frete, expedição, pedidos e eficiência operacional com dados inteiramente fictícios.',repo:'bi-logistica'},
 {id:'rota',icon:'🚚',name:'Roteirizador de Entregas',label:'SIMULAÇÃO MOBILE',desc:'Experiência de última milha: entregas, sequência de paradas e conclusão simulada de rota.',repo:null},
 {id:'pedidos',icon:'🛒',name:'Sistema de Pedidos',label:'VITRINE INTERATIVA',desc:'Explore produtos fictícios, adicione ao carrinho e simule o fluxo visual de pedidos.',repo:'sistema-pedidos'},
 {id:'tradutor',icon:'🌐',name:'Tradutor de Arquivos',label:'SIMULAÇÃO DESKTOP',desc:'Visualização da interface de um aplicativo de tradução criado em Python/PyQt.',repo:'Sistemas'},
 {id:'matricula',icon:'📝',name:'Formulário de Matrícula',label:'PROJETO REAL',desc:'Abra o frontend HTML e CSS original, publicado no GitHub Pages.',repo:'formulario-de-matricula',external:'https://ronilima1810.github.io/formulario-de-matricula/'}
];
const app=document.getElementById('app');
const query=new URLSearchParams(location.search);
const selected=query.get('demo');
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function shell(title,subtitle,body){return '<div class="shell"><div class="appbar"><strong>'+title+'</strong><span class="muted">'+subtitle+'</span></div>'+body+'</div>';}
function pageHome(){
 let cards=demos.map(d=>'<article class="project"><div class="emoji" aria-hidden="true">'+d.icon+'</div><h3>'+d.name+'</h3><span class="tag">'+d.label+'</span><p>'+d.desc+'</p><div class="actions"><a class="btn primary" href="'+(d.external||'?demo='+d.id)+'" '+(d.external?'target="_blank" rel="noopener noreferrer"':'')+'>Abrir preview ↗</a>'+(d.repo?'<a class="btn soft" href="'+base+d.repo+'" target="_blank" rel="noopener noreferrer">Código ↗</a>':'')+'</div></article>').join('');
 return '<section class="hero"><div class="eyebrow">Roni Lima / Software Showcase</div><h1>Projetos que você pode <em>explorar.</em></h1><p class="lead">Uma vitrine de interfaces, dados e automações. Navegue por demonstrações isoladas dos projetos do portfólio, sem acessar sistemas reais.</p><div class="notice">🔒 Sem credenciais, dados de clientes ou conexões com produção</div></section><div class="section-title"><h2>Escolha uma demonstração</h2><small>5 experiências</small></div><section class="projects">'+cards+'</section><p class="preview-label">Nota: os previews identificados como simulação ou conceito foram desenvolvidos apenas para portfólio e não representam o código-fonte integral dos sistemas. A página de matrícula abre a aplicação HTML/CSS original.</p>';
}
function bi(){
 const vals={'7':['R$ 215 mil','1.284','93,8%','4,1%'], '30':['R$ 892 mil','5.163','95,2%','3,8%'], '90':['R$ 2,51 mi','14.908','94,6%','3,9%']};
 let k=['Faturamento (exemplo)','Pedidos expedidos','Entregas no prazo','Frete / faturamento'];
 let kpis=k.map((label,i)=>'<div class="kpi"><small>'+label+'</small><strong id="k'+i+'">'+vals['7'][i]+'</strong><span>Dados simulados</span></div>').join('');
 let days=['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
 let bars=[45,76,60,91,73,44,59].map((v,i)=>'<div class="baritem"><div class="bar" id="b'+i+'" style="--h:'+v+'%"></div><small>'+days[i]+'</small></div>').join('');
 let performance=[['Separação de pedidos',88],['Expedição dentro do SLA',93],['Comprovantes recebidos',79]];
 let progress=performance.map(x=>'<div class="progressrow"><span>'+x[0]+'<b>'+x[1]+'%</b></span><div class="progress"><i style="--w:'+x[1]+'%"></i></div></div>').join('');
 return shell('◈ Torre de BI • Demonstração','INDICADORES FICTÍCIOS','<div class="demo-body"><div class="toolbar"><div><strong>Visão operacional</strong><div class="subtle">Unidade fictícia • Painel demonstrativo</div></div><label>Período <select id="period"><option value="7">7 dias</option><option value="30">30 dias</option><option value="90">90 dias</option></select></label></div><div class="kpis">'+kpis+'</div><div class="grid2"><div class="card"><h3>📦 Volumetria por dia</h3><p>Distribuição simulada de embarques na semana</p><div class="bars">'+bars+'</div></div><div class="card"><h3>🎯 Eficiência operacional</h3><p>Percentuais ilustrativos</p>'+progress+'</div></div><div class="preview-label">Protótipo visual independente: o repositório de BI consultado contém arquivos-base vazios; este dashboard não é uma versão executável do backend original.</div></div>');
}
function rota(){
 let stops=[['CD Exemplo','Saída programada'],['Cliente Exemplo A','Rua Alfa, 120 — endereço fictício'],['Cliente Exemplo B','Av. Beta, 88 — endereço fictício'],['Cliente Exemplo C','Praça Gama, 15 — endereço fictício'],['Base Exemplo','Retorno simulado']];
 let list=stops.map((s,i)=>'<div class="stop" id="stop'+i+'"><div class="num">'+(i+1)+'</div><div><strong>'+s[0]+'</strong><small>'+s[1]+'</small></div></div>').join('');
 let map='<svg viewBox="0 0 640 440" role="img" aria-label="Mapa ilustrativo de uma rota fictícia" preserveAspectRatio="xMidYMid meet"><path d="M30 390L115 305 255 345 365 220 470 190 570 55" fill="none" stroke="#59b2ef" stroke-width="14" opacity=".15" stroke-linecap="round"/><path d="M30 390L115 305 255 345 365 220 470 190 570 55" fill="none" stroke="#70f3d2" stroke-width="5" stroke-linecap="round" stroke-dasharray="10 10"/>'+[[30,390],[115,305],[255,345],[365,220],[570,55]].map((p,i)=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="17" fill="#0b3147" stroke="#63e8d2" stroke-width="4"/><text x="'+p[0]+'" y="'+(p[1]+5)+'" text-anchor="middle" fill="white" font-size="15" font-weight="bold">'+(i+1)+'</text>').join('')+'</svg>';
 return shell('↗ Entregas • App do motorista','SIMULAÇÃO SEM GPS OU LOGIN','<div class="route-layout"><div class="route-left"><h3>Rota DEMO-001</h3><p>Paradas de demonstração. Não há localização real nem dados de destinatários.</p><div class="toolbar"><span class="badge" id="route-state">Aguardando início</span><button id="route-next" class="primary">Iniciar rota</button></div><div id="route-stops">'+list+'</div><p class="subtle" id="route-progress">0 de 5 etapas concluídas</p></div><div class="route-map">'+map+'<div class="map-note">🗺️ Mapa ilustrativo, sem geolocalização, dados de clientes ou API de roteirização.</div></div></div>');
}
function pedidos(){
 let items=[['👕','Camiseta personalizada','34,90'],['☕','Caneca personalizada','29,90'],['🧢','Boné promocional','39,90']];
 let list=items.map((x,i)=>'<article class="item"><div class="picture" aria-hidden="true">'+x[0]+'</div><strong>'+x[1]+'</strong><small>Produto ilustrativo</small><div class="price">R$ '+x[2]+'</div><button data-buy="'+i+'">Adicionar ao carrinho</button></article>').join('');
 return shell('◇ Pedidos • Loja de demonstração','SEM PAGAMENTOS OU CADASTROS','<div class="demo-body"><div class="toolbar"><strong>Produtos personalizados</strong><span class="badge">Loja fictícia</span></div><div class="products">'+list+'</div><div class="cart"><div><strong>🛒 Meu carrinho</strong><div class="subtle" id="cart-desc">Nenhum item adicionado</div></div><div><strong id="cart-total">R$ 0,00</strong> <button id="cart-reset">Limpar</button></div></div><div class="preview-label">Simulação estática. Não realiza pagamentos, pedidos, upload de arquivos ou envio de informações.</div></div>');
}
function tradutor(){
 return shell('▣ Tradutor • Protótipo de desktop','DEMO LOCAL SEM API','<div class="demo-body"><div class="toolbar"><strong>Tradutor de textos</strong><span class="badge">Interface inspirada no projeto PyQt</span></div><div class="translate"><div><label for="from">Texto de origem</label><div class="primaryrow"><select id="from"><option value="pt">Português</option><option value="en">Inglês</option></select></div><textarea id="original" placeholder="Digite: Olá mundo">Olá mundo</textarea></div><div><label for="to">Tradução de demonstração</label><div class="primaryrow"><select id="to"><option value="en">Inglês</option><option value="pt">Português</option></select></div><textarea id="translated" readonly placeholder="O resultado será exibido aqui"></textarea></div></div><div class="primaryrow"><button class="primary" id="do-translate">Simular tradução</button><button id="swap-translate">Inverter idiomas</button></div><div class="preview-label">Prévia do fluxo visual do aplicativo, não o executável de desktop. A tradução usa apenas frases pré-programadas e não acessa nenhum serviço externo.</div></div>');
}
let d=demos.find(x=>x.id===selected);
let inner=!selected?pageHome():d?'<div class="subnav"><a href="./">← Voltar a todos os projetos</a></div><section class="demo-head"><div><div class="eyebrow">Live preview / '+d.label+'</div><h1>'+d.icon+' '+d.name+'</h1><p>'+d.desc+'</p></div><span class="badge">Dados fictícios</span></section>'+(selected==='bi'?bi():selected==='rota'?rota():selected==='pedidos'?pedidos():selected==='tradutor'?tradutor():'<p class="empty">Use o link de acesso à aplicação original.</p>')+'<div class="primaryrow">'+(d.repo?'<a class="btn" href="'+base+d.repo+'" target="_blank" rel="noopener noreferrer">Ver repositório no GitHub ↗</a>':'<a class="btn" href="https://github.com/Ronilima1810" target="_blank" rel="noopener noreferrer">Ver perfil no GitHub ↗</a>')+'<a class="btn soft" href="./">Outros previews</a></div>':'<div class="hero"><h1>Preview não encontrado</h1><p class="lead">Selecione um projeto da vitrine.</p><a class="btn" href="./">Voltar</a></div>';
app.innerHTML=inner;
document.title=(d?d.name+' | ':'')+'Roni Lima — Previews de projetos';
if(selected==='bi'){
 let sel=document.getElementById('period');
 sel.addEventListener('change',()=>{let v={'7':['R$ 215 mil','1.284','93,8%','4,1%'],'30':['R$ 892 mil','5.163','95,2%','3,8%'],'90':['R$ 2,51 mi','14.908','94,6%','3,9%']}[sel.value];v.forEach((x,i)=>document.getElementById('k'+i).textContent=x);[45,76,60,91,73,44,59].forEach((x,i)=>document.getElementById('b'+i).style.setProperty('--h',Math.max(15,Math.min(96,x*({'7':1,'30':0.88,'90':1.06}[sel.value])))+'%'));});
}
if(selected==='rota'){
 let n=0, btn=document.getElementById('route-next');
 btn.addEventListener('click',()=>{if(n>=5){n=0;document.querySelectorAll('.stop').forEach(x=>x.classList.remove('done'));}else{document.getElementById('stop'+n).classList.add('done');n++;}
 document.getElementById('route-state').textContent=n===5?'Rota concluída':n===0?'Aguardando início':'Em andamento';
 document.getElementById('route-progress').textContent=n+' de 5 etapas concluídas';btn.textContent=n===5?'Reiniciar simulação':'Concluir próxima etapa';});
}
if(selected==='pedidos'){
 let cart=[];let products=[['Camiseta',34.9],['Caneca',29.9],['Boné',39.9]];
 const update=()=>{document.getElementById('cart-desc').textContent=cart.length?cart.length+' item(ns) em simulação':'Nenhum item adicionado';document.getElementById('cart-total').textContent=cart.reduce((s,i)=>s+products[i][1],0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});};
 document.querySelectorAll('[data-buy]').forEach(b=>b.addEventListener('click',()=>{cart.push(+b.dataset.buy);update();}));
 document.getElementById('cart-reset').addEventListener('click',()=>{cart=[];update();});
}
if(selected==='tradutor'){
 document.getElementById('do-translate').addEventListener('click',()=>{
 let txt=document.getElementById('original').value.trim().toLowerCase();let fr=document.getElementById('from').value, to=document.getElementById('to').value;
 let words={'olá mundo':'hello world','bom dia':'good morning','boa tarde':'good afternoon','obrigado':'thank you','hello world':'olá mundo','good morning':'bom dia','good afternoon':'boa tarde','thank you':'obrigado'};
 document.getElementById('translated').value=fr===to?document.getElementById('original').value:words[txt]||'Esta versão demonstra apenas frases pré-programadas.';
 });
 document.getElementById('swap-translate').addEventListener('click',()=>{let a=document.getElementById('from'),b=document.getElementById('to');let v=a.value;a.value=b.value;b.value=v;});
}
