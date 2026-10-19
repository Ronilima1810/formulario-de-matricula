'use strict';
const GH='https://github.com/Ronilima1810/';
const DEMO_ROOT='https://ronilima1810.github.io/formulario-de-matricula/portfolio-demos/';
const PROJECTS=[
{id:'bi',code:'01',label:'RUBY BI',name:'Inteligência logística',desc:'Dashboard analítico com filtros globais, expedição, frete e indicadores, seguindo o design system visual do Ruby.',tags:['BI','Power BI / SQL','Gestão logística'],repo:'bi-logistica'},
{id:'frota',code:'02',label:'FLEET ADMIN',name:'Administração de frota',desc:'Sistema independente de gestão de agregados, motoristas, veículos, viagens, documentos e negociação de frete.',tags:['Frota','Última milha','Remuneração']},
{id:'pedidos',code:'03',label:'ORDER CONTROL',name:'Torre de pedidos',desc:'Gestão operacional com etapas, aging, prioridades, status de separação, faturamento e expedição.',tags:['WMS','Pedidos','Expedição']},
{id:'loja',code:'04',label:'WEB APP',name:'Loja de pedidos',desc:'Vitrine independente para o repositório PHP de produtos personalizados, preservando a distinção da Torre de Pedidos.',tags:['PHP','E-commerce'],repo:'sistema-pedidos'},
{id:'tradutor',code:'05',label:'DESKTOP APP',name:'Tradutor de arquivos',desc:'Prévia interativa do fluxo de uso do aplicativo desktop de tradução desenvolvido em Python.',tags:['Python','Desktop'],repo:'Sistemas'},
{id:'matricula',code:'06',label:'FRONT-END',name:'Formulário de matrícula',desc:'Projeto original de interface responsiva em HTML e CSS, hospedado em GitHub Pages.',tags:['HTML','CSS','UX'],repo:'formulario-de-matricula',external:'https://ronilima1810.github.io/formulario-de-matricula/'}
];
const $=id=>document.getElementById(id), app=$('app');
const qs=new URLSearchParams(location.search);
let selected=qs.get('demo')||'home';if(selected==='rota')selected='frota';
let section='visao', period='30', filial='Todas as unidades', carrier='Todas';
let orderStatus='Todos',searchTerm='',fleetTab='visao',tripKm=135,rateBase=180,threshold=100,extraRate=2,helper=65,usesHelper=true;
let theme='dark', routeStep=0, cart=[];
const fmt=(n,cur=false)=>new Intl.NumberFormat('pt-BR',cur?{style:'currency',currency:'BRL',maximumFractionDigits:2}:{maximumFractionDigits:0}).format(n);
function safe(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function el(tag,cls,html){return '<'+tag+(cls?' class="'+cls+'"':'')+'>'+html+'</'+tag+'>';}
function pill(text,kind=''){return '<span class="state '+kind+'">'+safe(text)+'</span>';}
function button(text,act,cls=''){return '<button class="btn '+cls+'" data-action="'+act+'">'+text+'</button>';}
function page(title,sub,eyebrow='PAINEL EXECUTIVO',actions=''){return '<div class="heading"><div><div class="eyebrow">'+eyebrow+'</div><h1>'+title+'</h1><p>'+sub+'</p></div><div class="headtools">'+actions+'</div></div>';}
function filters(entries){return '<div class="filterbar">'+entries.map(o=>'<div class="field '+(o.grow?'grow':'')+'"><label for="'+o.id+'">'+o.title+'</label>'+(o.input?'<input id="'+o.id+'" placeholder="'+o.placeholder+'" value="'+safe(o.value||'')+'">':'<select id="'+o.id+'">'+o.options.map(a=>'<option value="'+safe(a)+'" '+(a===o.value?'selected':'')+'>'+safe(a)+'</option>').join('')+'</select>')+'</div>').join('')+'</div>';}
function kpi(title,value,sub){return '<div class="kpi"><label>'+title+'</label><strong>'+value+'</strong><small>'+sub+'</small></div>';}
function panel(title,subtitle,body){return '<section class="panel"><div class="panelhead"><div><h2>'+title+'</h2>'+(subtitle?'<p>'+subtitle+'</p>':'')+'</div></div><div class="panelbody">'+body+'</div></section>';}
function table(head,rows){return '<div class="tablewrap"><table class="data"><thead><tr>'+head.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+rows.join('')+'</tbody></table></div>';}
function note(){return '<div class="notice"><strong>AMBIENTE DEMONSTRATIVO</strong><span>Dados, números, clientes, veículos e rotas totalmente fictícios. Sem APIs, credenciais ou conexões de produção.</span></div>';}
const cats=[['Operações','visao','Painel executivo','▦'],['Indicadores','fretes','Análise de frete','▤'],['Controle','expedicao','Expedição e SLA','⇥'],['Sistemas','frota','Gestão de frota','⌁'],['Operações','pedidos','Torre de pedidos','≡']];
function menu(){
 const relevant=selected==='bi'?[['ANÁLISE DE DADOS',[['visao','Visão executiva','◫'],['fretes','Eficiência de frete','▥'],['expedicao','Expedição e SLA','⇥']]]]:selected==='frota'?[['GESTÃO DE FROTA',[['visao','Visão geral','◫'],['motoristas','Motoristas e veículos','⌁'],['negociacao','Negociação e custos','≋'],['rotas','Controle de rotas','⇥']]]]:selected==='pedidos'?[['TORRE OPERACIONAL',[['visao','Visão consolidada','◫'],['fila','Fila de pedidos','☷'],['aging','Prioridades e aging','▥']]]]:[['PORTFÓLIO',[['visao','Visão geral','◫']]]];
 let brand=selected==='frota'?'FLEET<span>OPS</span>':selected==='bi'?'RUBY<span> BI</span>':selected==='pedidos'?'ORDER<span> CTRL</span>':'RONI<span> / LABS</span>';
 let rows=relevant.map(([t,items])=>'<div class="navlabel">'+t+'</div><div class="navlist">'+items.map(([id,label,icon])=>'<button class="navbutton '+(id===section?'selected':'')+'" data-nav="'+id+'" aria-pressed="'+(id===section)+'"><span class="glyph">'+icon+'</span>'+label+'</button>').join('')+'</div>').join('');
 return '<aside class="sidebar"><div class="brand"><div class="brandname">'+brand+'</div><span class="branddesc">'+(selected==='frota'?'FLEET MANAGEMENT PLATFORM':selected==='bi'?'LOGISTICS ANALYTICS':'OPERATIONAL CONTROL CENTER')+'</span></div>'+rows+'<div class="navlabel">NAVEGAÇÃO</div><div class="navlist"><a class="navlink" href="./"><span class="glyph">←</span>Todos os projetos</a><a class="navlink" href="'+GH+'" target="_blank" rel="noopener noreferrer"><span class="glyph">↗</span>Perfil GitHub</a></div><div class="navfoot"><strong>PORTFOLIO / DEMO</strong>Build independente de apresentação<br>Sem integração com produção</div></aside>';
}
function layout(body){const title=selected==='home'?'Projetos':selected==='bi'?'Ruby BI':selected==='frota'?'FleetOps':selected==='pedidos'?'Order Control':'Preview';return '<div class="app">'+menu()+'<div class="main"><header class="topbar"><div class="breadcrumbs"><span>PORTFÓLIO</span><span>/</span><strong>'+title+'</strong></div><div class="topactions"><span class="pill">DEMONSTRAÇÃO PÚBLICA</span>'+button('☼ Tema','theme','small')+'</div></header><div class="workspace">'+body+'</div><footer class="footer">PORTFÓLIO TÉCNICO · PRODUTOS CONCEITUAIS INDEPENDENTES · SEM DADOS REAIS</footer></div></div>';}
function home(){
 const blocks=PROJECTS.map(p=>'<article class="homecard"><div class="overline">'+p.code+' / '+p.label+'</div><h2>'+p.name+'</h2><p>'+p.desc+'</p><div class="chiprow">'+p.tags.map(t=>'<span class="chip">'+t+'</span>').join('')+'</div><div style="height:16px"></div><div style="display:flex;gap:7px;flex-wrap:wrap"><a class="btn primary" href="'+(p.external||'?demo='+p.id)+'" '+(p.external?'target="_blank" rel="noopener noreferrer"':'')+'>Abrir demonstração ↗</a>'+(p.repo?'<a class="btn" href="'+GH+p.repo+'" target="_blank" rel="noopener noreferrer">Repositório ↗</a>':'')+'</div></article>').join('');
 return '<div class="homeHero"><div class="eyebrow">SOFTWARE / ANALYTICS / OPERATIONAL SYSTEMS</div><h1>Produtos para operações reais.<br>Demonstrados com dados fictícios.</h1><p>Uma coleção de experiências de produto com foco em gestão logística, inteligência de dados e fluxos operacionais. Interfaces demonstrativas, sem exposição de dados empresariais.</p><span class="pill">6 EXPERIÊNCIAS NO PORTFÓLIO</span></div><div class="heading"><div><h1>Projetos em destaque</h1><p>Selecione um sistema para explorar a interface, filtros e fluxos disponíveis.</p></div></div><div class="homegrid">'+blocks+'</div>';
}
const carriers=['Todas','Transporte Alfa','Transportadora Beta','Operador Gama'];
const units=['Todas as unidades','Matriz SP','Matriz MG','Matriz PE','Matriz PR'];
const D=[
{name:'Transporte Alfa',uf:'SP',nf:388,vol:812,frete:25400,valor:592000,prazo:96.1},
{name:'Transportadora Beta',uf:'MG',nf:217,vol:490,frete:18450,valor:348000,prazo:91.7},
{name:'Operador Gama',uf:'PE',nf:176,vol:342,frete:16200,valor:299000,prazo:94.2},
{name:'Transporte Alfa',uf:'PR',nf:146,vol:298,frete:11600,valor:261000,prazo:97.0}
];
function scopeData(){let rows=D.filter(x=>filial==='Todas as unidades'||x.uf===filial.replace('Matriz ',''));if(carrier!=='Todas')rows=rows.filter(x=>x.name===carrier);return rows;}
function chart(vals,labels){
 let max=Math.max(...vals,1);let pts=vals.map((v,i)=>(40+i*80)+','+(184-140*v/max)).join(' ');
 return '<svg class="chart" viewBox="0 0 570 228" role="img" aria-label="Série ilustrativa dos últimos sete períodos">'+[0,1,2,3].map(i=>'<line class="axis" x1="35" y1="'+(38+i*49)+'" x2="547" y2="'+(38+i*49)+'"/>').join('')+'<polygon class="area" points="40,184 '+pts+' 520,184"/><polyline class="stroke" points="'+pts+'"/>'+vals.map((v,i)=>'<circle cx="'+(40+i*80)+'" cy="'+(184-140*v/max)+'" r="4.5" fill="var(--purple)" stroke="var(--surface)" stroke-width="2"/>').join('')+labels.map((v,i)=>'<text x="'+(40+i*80)+'" y="211" text-anchor="middle">'+v+'</text>').join('')+'</svg>';
}
function bi(){
 const rows=scopeData();let mult=period==='7'?0.27:period==='90'?2.8:1;
 const sum=k=>rows.reduce((s,x)=>s+x[k],0)*mult;
 const faturamento=sum('valor'), frete=sum('frete'),vol=sum('vol'),nf=sum('nf'),ef=faturamento?frete/faturamento*100:0;
 const title=section==='fretes'?'Eficiência de frete':section==='expedicao'?'Expedição e SLA':'Visão executiva';
 const header=page(title,'Inteligência operacional e desempenho logístico por unidade, período e transportador.','RUBY BI · LOGISTICS ANALYTICS',button('Exportar CSV','export-bi')+button('Restaurar filtros','reset-bi','quiet'));
 const filter=filters([{id:'branch',title:'Unidade / filial',options:units,value:filial},{id:'period',title:'Período',options:['7','30','90'],value:period},{id:'carrier',title:'Transportadora',options:carriers,value:carrier}]);
 const top='<div class="kpis">'+kpi('Faturamento (NF)',fmt(faturamento,true),'Base simulada · período selecionado')+kpi('Volumes embarcados',fmt(vol),'Unidades de volume')+kpi('Frete / faturamento',ef.toFixed(2).replace('.',',')+'%','Relação de custo sobre receita')+kpi('NFs expedidas',fmt(nf),'Notas vinculadas a romaneios')+'</div>';
 const weekly=[39,65,57,80,76,49,94].map(v=>v*(nf||120)/600);
 const series=chart(weekly,['Seg','Ter','Qua','Qui','Sex','Sáb','Dom']);
 const chartPanel=panel(section==='fretes'?'Evolução da despesa com frete':'Evolução operacional','Tendência simulada com base no recorte selecionado',series);
 const progress=rows.length?rows.map(x=>'<div class="progressItem"><div class="progressTitle"><span>'+x.name+' · '+x.uf+'</span><strong>'+x.prazo.toFixed(1).replace('.',',')+'% SLA</strong></div><div class="progressTrack"><div class="progressFill" style="width:'+x.prazo+'%"></div></div></div>').join(''):'<div class="empty">Nenhum parceiro no recorte escolhido.</div>';
 const carrierPanel=panel('Performance por parceiro','Entregas dentro do prazo',progress);
 const details=table(['Transportadora','UF','NFs','Volumes','Valor NF','Frete','Frete %','SLA'],rows.map(x=>'<tr><td><strong>'+x.name+'</strong></td><td>'+x.uf+'</td><td>'+fmt(x.nf*mult)+'</td><td>'+fmt(x.vol*mult)+'</td><td>'+fmt(x.valor*mult,true)+'</td><td>'+fmt(x.frete*mult,true)+'</td><td>'+fmt(100*x.frete/x.valor)+'%</td><td>'+pill(x.prazo.toFixed(1).replace('.',',')+'%','ok')+'</td></tr>'));
 const exp=panel('Aging de expedição','Tempo decorrido entre faturamento e romaneio: quadro demonstrativo','<div class="aging">'+['0–2h','2–4h','4–6h','6–8h','8–12h','12–18h','18–24h','24h+'].map((x,i)=>'<div class="heat '+(i>5?'hot':i>3?'warm':'')+'"><strong>'+([52,38,30,22,18,11,7,3][i]*(nf?1:0))+'</strong><br><span>'+x+'</span></div>').join('')+'</div><p class="tiny">Faixas de tempo ilustrativas; não correspondem a uma operação real.</p>');
 return header+note()+filter+top+'<div class="twocol">'+chartPanel+carrierPanel+'</div>'+panel('Resumo analítico por transportadora','Detalhamento agregado de NFs, volumes, custos e eficiência',details)+(section==='expedicao'?'<div style="margin-top:15px">'+exp+'</div>':'');
}
const drivers=[
{id:'M-001',name:'Motorista Exemplo 01',vehicle:'Fiorino',plate:'AAA-0A01',doc:'Válida',status:'Ativo',routes:18},
{id:'M-002',name:'Motorista Exemplo 02',vehicle:'Van utilitária',plate:'BBB-0B02',doc:'A revisar',status:'Pendente',routes:7},
{id:'M-003',name:'Motorista Exemplo 03',vehicle:'VUC 3/4',plate:'CCC-0C03',doc:'Válida',status:'Ativo',routes:15},
{id:'M-004',name:'Motorista Exemplo 04',vehicle:'Furgão',plate:'DDD-0D04',doc:'Válida',status:'Ativo',routes:12}
];
function fleet(){
 const tabs=[['visao','Visão geral'],['motoristas','Motoristas e veículos'],['negociacao','Negociação e custos'],['rotas','Controle de rotas']];
 const bar='<div class="tabs" style="margin-bottom:15px">'+tabs.map(([id,n])=>'<button class="tab" data-fleet="'+id+'" aria-pressed="'+(fleetTab===id)+'">'+n+'</button>').join('')+'</div>';
 const head=page('Gestão de frota e agregados','Sistema independente para administração de motoristas, veículos, rotas e remuneração.','FLEETOPS · FLEET MANAGEMENT',button('Exportar relação CSV','export-fleet')+button('Reiniciar simulação','reset-fleet'));
 const overview='<div class="kpis">'+kpi('Agregados cadastrados','12','Exemplo para demonstração')+kpi('Veículos disponíveis','09','Capacidade registrada')+kpi('Documentação pendente','03','Itens para revisão')+kpi('Rotas em andamento','07','Fluxo fictício')+'</div>';
 const list=table(['ID','Motorista','Veículo','Placa fictícia','Documentação','Status','Rotas'],drivers.map(x=>'<tr><td>'+x.id+'</td><td><strong>'+x.name+'</strong></td><td>'+x.vehicle+'</td><td>'+x.plate+'</td><td>'+pill(x.doc,x.doc==='Válida'?'ok':'warn')+'</td><td>'+pill(x.status,x.status==='Ativo'?'ok':'warn')+'</td><td>'+x.routes+'</td></tr>'));
 const tableDrivers=panel('Cadastro e documentação','Registros fictícios para apresentar navegação e governança',list);
 const pick=panel('Aprovação e acompanhamento','Resumo de pendências','<div class="metricline"><strong>Cadastros aguardando aprovação</strong>'+pill('2 pendentes','warn')+'</div><div class="metricline"><strong>Documentos em revisão</strong>'+pill('3 pendentes','warn')+'</div><div class="metricline"><strong>Veículos aguardando vistoria</strong>'+pill('1 pendente','warn')+'</div><p class="tiny">As aprovações não alteram cadastros reais.</p>');
 const negotiation=panel('Parâmetros de negociação','Modelo demonstrativo: valor base por saída + adicional por quilômetro acima da franquia + ajudante','<div class="pricing"><div><label for="trip-km">Distância percorrida (km)</label><input id="trip-km" type="number" min="0" max="2000" step="1" value="'+tripKm+'"></div><div><label for="base-rate">Valor por saída (R$)</label><input id="base-rate" type="number" min="0" max="10000" step=".01" value="'+rateBase+'"></div><div><label for="threshold">Franquia de km</label><input id="threshold" type="number" min="0" max="2000" value="'+threshold+'"></div><div><label for="extra-rate">Adicional por km excedente (R$)</label><input id="extra-rate" type="number" min="0" max="1000" step=".01" value="'+extraRate+'"></div><div><label for="helper-fee">Valor do ajudante (R$)</label><input id="helper-fee" type="number" min="0" max="10000" step=".01" value="'+helper+'"></div><div><label>Aplicar ajudante?</label><select id="helper-enabled"><option value="sim" '+(usesHelper?'selected':'')+'>Sim</option><option value="nao" '+(!usesHelper?'selected':'')+'>Não</option></select></div></div><div class="pricingoutput"><div><div class="tiny">Excedente: <strong id="over-km">0 km</strong> · Adicional: <strong id="over-value">R$ 0,00</strong></div><div class="tiny">Estimativa ilustrativa, sem efeito financeiro</div></div><strong id="total-price">R$ 0,00</strong></div>');
 const routes=['RT-2401 · Zona Norte · 14 entregas','RT-2402 · Região Oeste · 11 entregas','RT-2403 · Região Central · 9 entregas','RT-2404 · Região Sul · 12 entregas'];
 const dispatch=panel('Programação de viagens','Controle gerencial de saídas e rotas de demonstração','<div class="listcompact">'+routes.map((x,i)=>'<div class="listitem"><div><strong>'+x+'</strong><small>'+drivers[i%4].name+' · Operação de exemplo</small></div>'+pill(i===2?'Concluída':'Em rota',i===2?'ok':'warn')+'</div>').join('')+'</div>');
 const map='<div class="miniMap"><svg viewBox="0 0 450 210" aria-label="Fluxo de pontos fictícios, não é um mapa geográfico"><path d="M30 165L90 90 160 145 235 48 318 88 414 28" stroke="var(--purple)" stroke-width="4" fill="none" stroke-dasharray="9 7"/>'+[[30,165],[90,90],[160,145],[235,48],[318,88],[414,28]].map((p,i)=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="10" fill="var(--purple)" stroke="var(--surface)" stroke-width="4"/>').join('')+'</svg></div><div class="tiny" style="margin-top:9px">Diagrama ilustrativo. Não há rastreamento GPS nem coordenadas reais.</div>';
 let body=fleetTab==='motoristas'?tableDrivers+'<div style="margin-top:14px">'+pick+'</div>':fleetTab==='negociacao'?'<div class="twocol equal">'+negotiation+panel('Regras de cálculo','Exemplos de negociação','<div class="metricline"><strong>Até a franquia</strong><span>Somente valor por saída</span></div><div class="metricline"><strong>Acima da franquia</strong><span>Excedente × valor/km</span></div><div class="metricline"><strong>Ajudante</strong><span>Valor adicional configurável</span></div><div class="metricline"><strong>Liquidação</strong><span>Indisponível no preview</span></div>')+'</div>':fleetTab==='rotas'?'<div class="twocol">'+dispatch+panel('Visualização da malha','Representação conceitual de paradas',map)+'</div>':overview+'<div class="twocol">'+dispatch+pick+'</div><div style="margin-top:14px">'+negotiation+'</div><div style="margin-top:14px">'+tableDrivers+'</div>';
 return head+note()+bar+body;
}
const orders=[
{id:'PD-1041',client:'Cliente Exemplo A',company:'Unidade SP',lib:'08:10',age:2.3,units:32,step:'Liberados',separator:'Operador 01'},
{id:'PD-1042',client:'Cliente Exemplo B',company:'Unidade MG',lib:'07:35',age:6.7,units:18,step:'Aguardando impressão',separator:'—'},
{id:'PD-1043',client:'Cliente Exemplo C',company:'Unidade SP',lib:'06:20',age:9.1,units:61,step:'Separando',separator:'Operador 02'},
{id:'PD-1044',client:'Cliente Exemplo D',company:'Unidade PE',lib:'09:05',age:1.4,units:8,step:'Faturados',separator:'Operador 03'},
{id:'PD-1045',client:'Cliente Exemplo E',company:'Unidade PR',lib:'05:50',age:12.5,units:24,step:'Aguardando liberação',separator:'—'},
{id:'PD-1046',client:'Cliente Exemplo F',company:'Unidade MG',lib:'08:40',age:2.1,units:43,step:'Expedidos',separator:'Operador 04'},
{id:'PD-1047',client:'Cliente Exemplo G',company:'Unidade SP',lib:'07:00',age:8.2,units:21,step:'Reposição',separator:'Operador 01'},
{id:'PD-1048',client:'Cliente Exemplo H',company:'Unidade PE',lib:'08:20',age:4.2,units:12,step:'Geração de kit',separator:'Operador 02'}
];
const STAGES=['Aguardando liberação','Liberados','Aguardando impressão','Separando','Faturados','Expedidos','Geração de kit','Reposição'];
function ordersPage(){
 const head=page('Torre de Pedidos','Acompanhamento do fluxo do pedido, separação, faturamento e expedição.','ORDER CONTROL CENTER · OPERAÇÃO',button('Exportar CSV','export-orders')+button('Limpar filtros','reset-orders','quiet'));
 const flt=filters([{id:'order-branch',title:'Unidade',options:units,value:filial},{id:'order-status',title:'Situação',options:['Todos',...STAGES],value:orderStatus},{id:'order-search',title:'Buscar pedido / cliente',input:true,grow:true,placeholder:'Pedido ou cliente fictício',value:searchTerm}]);
 const selection=orders.filter(o=>(filial==='Todas as unidades'||o.company==='Unidade '+filial.replace('Matriz ',''))&&(orderStatus==='Todos'||o.step===orderStatus)&&(!searchTerm||[o.id,o.client,o.company].some(s=>s.toLowerCase().includes(searchTerm.toLowerCase()))));
 const summary='<div class="kpis">'+kpi('Pedidos no recorte',fmt(selection.length),'Fluxo simulado')+kpi('Unidades em processo',fmt(selection.reduce((s,x)=>s+x.units,0)),'Itens em pedidos selecionados')+kpi('Pedidos críticos',fmt(selection.filter(x=>x.age>=8).length),'Aging a partir de 8h')+kpi('Pedidos faturados',fmt(selection.filter(x=>x.step==='Faturados'||x.step==='Expedidos').length),'Faturados ou expedidos')+'</div>';
 const stages=panel('Pipeline de pedidos','Etapas conforme fluxo de operações','<div class="stagegrid">'+STAGES.map(s=>'<div class="stage"><strong>'+selection.filter(o=>o.step===s).length+'</strong><small>'+s+'</small></div>').join('')+'</div>');
 const details=panel('Fila operacional','Filtros por unidade, status e busca textual',table(['Pedido','Empresa','Cliente','Liberação','Separador','Unidades','Aging','Situação'],selection.slice().sort((a,b)=>b.age-a.age).map(o=>'<tr><td><strong>'+o.id+'</strong></td><td>'+o.company+'</td><td>'+o.client+'</td><td>'+o.lib+'</td><td>'+o.separator+'</td><td>'+o.units+'</td><td>'+o.age.toFixed(1).replace('.',',')+'h</td><td>'+pill(o.step,o.age>=8?'bad':o.age>=5?'warn':'ok')+'</td></tr>')));
 const risk=panel('Explosão de pedidos','Priorização baseada em tempo de permanência na operação','<div class="listcompact">'+selection.slice().sort((a,b)=>b.age-a.age).slice(0,5).map(o=>'<div class="listitem"><div><strong>'+o.id+' · '+o.client+'</strong><small>'+o.step+' · '+o.units+' unidades</small></div>'+pill(o.age.toFixed(1).replace('.',',')+'h',o.age>=8?'bad':o.age>=5?'warn':'ok')+'</div>').join('')+'</div>');
 const production=panel('Produtividade por colaborador','Total de unidades nos pedidos de demonstração',Object.entries(selection.reduce((acc,o)=>{if(o.separator!=='—')acc[o.separator]=(acc[o.separator]||0)+o.units;return acc;},{})).map(([n,v])=>'<div class="metricline"><strong>'+n+'</strong><span>'+v+' unidades</span></div>').join('')||'<div class="empty">Sem registros.</div>');
 let body=section==='aging'?'<div class="twocol">'+risk+production+'</div><div style="margin-top:14px">'+details+'</div>':section==='fila'?details+'<div style="margin-top:14px">'+risk+'</div>':stages+'<div class="twocol" style="margin-top:14px">'+risk+production+'</div><div style="margin-top:14px">'+details+'</div>';
 return head+note()+flt+summary+body;
}
function store(){
 const things=[['Camiseta personalizada',34.90],['Caneca personalizada',29.90],['Boné de tecido',39.90]];
 const total=cart.reduce((sum,i)=>sum+things[i][1],0);
 const products=things.map((x,i)=>'<div class="panel" style="padding:20px"><div class="eyebrow">PRODUTO '+String(i+1).padStart(2,'0')+'</div><div style="font-size:33px;color:var(--purple);padding:15px 0">▣</div><h2>'+x[0]+'</h2><p>Produto demonstrativo, sem estoque ou venda real.</p><h2>'+fmt(x[1],true)+'</h2><button class="btn primary" data-add="'+i+'">Adicionar ao carrinho</button></div>').join('');
 return page('Catálogo e pedidos personalizados','Demonstração da loja PHP, independente da Torre de Pedidos.','WEB APPLICATION · E-COMMERCE')+note()+'<div class="homegrid">'+products+'</div><div class="panel" style="padding:20px;margin-top:16px"><h2>Carrinho demonstrativo</h2><p>'+cart.length+' itens selecionados · '+fmt(total,true)+'</p>'+button('Esvaziar carrinho','clear-cart')+'</div>';
}
function translator(){
 return page('Tradutor de arquivos','Interface demonstrativa de um aplicativo desktop em Python.','DESKTOP SOFTWARE · UX')+note()+'<div class="twocol equal"><section class="panel" style="padding:18px"><h2>Texto de origem</h2><div class="field"><label for="text-from">Português</label><input id="text-from" style="height:120px" value="Olá mundo"></div></section><section class="panel" style="padding:18px"><h2>Tradução ilustrativa</h2><div class="field"><label for="text-to">Inglês</label><input id="text-to" style="height:120px" readonly value=""></div></section></div><div style="margin-top:15px">'+button('Simular tradução','translate','primary')+'</div><p class="tiny" style="margin-top:10px">Tradução local apenas de frases predefinidas. Não envia dados nem acessa APIs.</p>';
}
function render(){
 const body=selected==='bi'?bi():selected==='frota'?fleet():selected==='pedidos'?ordersPage():selected==='loja'?store():selected==='tradutor'?translator():home();
 app.innerHTML=layout(body); document.title=(PROJECTS.find(p=>p.id===selected)?.name||'Vitrine')+' — Roni Lima';
 document.documentElement.setAttribute('data-ui-theme',theme);
 updatePrice();
}
function updatePrice(){
 if(!$('total-price'))return;
 const n=Math.max(0,tripKm-threshold),val=rateBase+n*extraRate+(usesHelper?helper:0);
 $('over-km').textContent=fmt(n)+' km';$('over-value').textContent=fmt(n*extraRate,true);$('total-price').textContent=fmt(val,true);
}
function csv(name,head,rows){const csvdata='\uFEFF'+[head,...rows].map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(';')).join('\r\n');const blob=new Blob([csvdata],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');const link=URL.createObjectURL(blob);a.href=link;a.download=name;a.click();URL.revokeObjectURL(link);}
function go(sectionId){if(selected==='frota'){fleetTab=sectionId;}else{section=sectionId;}render();}
document.addEventListener('click',event=>{
 const nav=event.target.closest('[data-nav]');if(nav){go(nav.dataset.nav);return;}
 const fleetbtn=event.target.closest('[data-fleet]');if(fleetbtn){fleetTab=fleetbtn.dataset.fleet;render();return;}
 const buy=event.target.closest('[data-add]');if(buy){cart.push(+buy.dataset.add);render();return;}
 const btn=event.target.closest('[data-action]');if(!btn)return;
 switch(btn.dataset.action){
 case 'theme':theme=theme==='dark'?'light':'dark';render();break;
 case 'reset-bi':filial=units[0];carrier='Todas';period='30';render();break;
 case 'reset-orders':filial=units[0];orderStatus='Todos';searchTerm='';render();break;
 case 'reset-fleet':tripKm=135;rateBase=180;threshold=100;extraRate=2;helper=65;usesHelper=true;render();break;
 case 'clear-cart':cart=[];render();break;
 case 'translate':{const t=($('text-from')?.value||'').trim().toLowerCase();$('text-to').value=({'olá mundo':'Hello world','bom dia':'Good morning','obrigado':'Thank you','boa tarde':'Good afternoon'})[t]||'Amostra não disponível no modo offline.';break;}
 case 'export-bi':{const r=scopeData();csv('ruby-bi-demonstracao.csv',['Parceiro','UF','NF','Volumes','Valor NF','Frete'],r.map(x=>[x.name,x.uf,x.nf,x.vol,x.valor,x.frete]));break;}
 case 'export-fleet':csv('fleetops-demonstracao.csv',['ID','Motorista','Veículo','Placa','Status'],drivers.map(x=>[x.id,x.name,x.vehicle,x.plate,x.status]));break;
 case 'export-orders':csv('torre-pedidos-demonstracao.csv',['Pedido','Empresa','Cliente','Status','Aging'],orders.map(x=>[x.id,x.company,x.client,x.step,x.age]));break;
 }
});
document.addEventListener('change',e=>{
 const id=e.target.id,v=e.target.value;
 if(id==='branch'||id==='order-branch'){filial=v;render();}
 else if(id==='period'){period=v;render();}
 else if(id==='carrier'){carrier=v;render();}
 else if(id==='order-status'){orderStatus=v;render();}
 else if(id==='helper-enabled'){usesHelper=v==='sim';updatePrice();}
 else if(['trip-km','base-rate','threshold','extra-rate','helper-fee'].includes(id)){changeNumber(id,e.target.value);}
});
function changeNumber(id,val){const n=Math.min(10000,Math.max(0,Number(val)||0));if(id==='trip-km')tripKm=n;if(id==='base-rate')rateBase=n;if(id==='threshold')threshold=n;if(id==='extra-rate')extraRate=n;if(id==='helper-fee')helper=n;updatePrice();}
document.addEventListener('input',e=>{
 if(e.target.id==='order-search'){searchTerm=e.target.value;const at=e.target.selectionStart;render();if($('order-search')){$('order-search').focus();$('order-search').setSelectionRange(at,at);}}
 if(['trip-km','base-rate','threshold','extra-rate','helper-fee'].includes(e.target.id))changeNumber(e.target.id,e.target.value);
});
render();
