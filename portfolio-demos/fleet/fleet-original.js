'use strict';
/**
 * FleetOps / UNION Aggregados — demonstrativo do frontend PHP hospedado.
 * Preserva as classes, painéis e CSS da página /ruby/agregados/index.php.
 * Dados artificiais; nenhuma comunicação de rede, PHP, GPS ou banco.
 */
const app=document.getElementById('ag-app');
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(n)||0);
const number=n=>new Intl.NumberFormat('pt-BR').format(Number(n)||0);
const today='2026-10-20';
const driversInit=[
 {id:'AG-DEMO-001',name:'Agregado Exemplo 01',email:'agregado01@example.invalid',vehicle:'Fiorino · modelo fictício',plate:'DEM1A23',status:'pendente',birth:'12/05/1990',cpf:'***.***.***-**',cnpj:'**.***.***/****-**',routes:0,region:'SP',cnh:false,face:false},
 {id:'AG-DEMO-002',name:'Agregado Exemplo 02',email:'agregado02@example.invalid',vehicle:'Van demonstrativa',plate:'DEM2B45',status:'aprovado',birth:'15/09/1988',cpf:'***.***.***-**',cnpj:'**.***.***/****-**',routes:7,region:'SP',cnh:true,face:true},
 {id:'AG-DEMO-003',name:'Agregado Exemplo 03',email:'agregado03@example.invalid',vehicle:'VUC de exemplo',plate:'DEM3C67',status:'aprovado',birth:'18/10/1985',cpf:'***.***.***-**',cnpj:'**.***.***/****-**',routes:5,region:'MG',cnh:true,face:true},
 {id:'AG-DEMO-004',name:'Agregado Exemplo 04',email:'agregado04@example.invalid',vehicle:'Van demonstrativa',plate:'DEM4D89',status:'reprovado',birth:'25/03/1992',cpf:'***.***.***-**',cnpj:'**.***.***/****-**',routes:1,region:'PR',cnh:false,face:true}
];
const routesInit=[
 {id:'ROTA-DEMO-1001',driver:'AG-DEMO-002',manifest:'ROM-DEMO-1001',date:'20/10/2026',status:'em_rota',plannedKm:128,actualKm:94,stops:14,done:8,started:'08:10',gps:'há 22 s',base:185,pedagio:23,parking:12,helper:0,approved:false,paid:false},
 {id:'ROTA-DEMO-1002',driver:'AG-DEMO-003',manifest:'ROM-DEMO-1002',date:'20/10/2026',status:'em_rota',plannedKm:92,actualKm:71,stops:9,done:7,started:'08:42',gps:'há 35 s',base:185,pedagio:9,parking:0,helper:65,approved:false,paid:false},
 {id:'ROTA-DEMO-1003',driver:'AG-DEMO-002',manifest:'ROM-DEMO-1003',date:'20/10/2026',status:'finalizada',plannedKm:77,actualKm:79,stops:7,done:7,started:'07:50',gps:'encerrada',base:185,pedagio:14,parking:0,helper:0,approved:true,paid:false},
 {id:'ROTA-DEMO-1004',driver:'AG-DEMO-003',manifest:'ROM-DEMO-1004',date:'19/10/2026',status:'finalizada',plannedKm:155,actualKm:163,stops:16,done:16,started:'06:40',gps:'encerrada',base:185,pedagio:32,parking:10,helper:65,approved:true,paid:true}
];
const branches=['Ruby Rose · SP','Union · SP','Midiway · SP','A Gente · SP','Ruby Rose · MG','Ruby Rose · PR','Ruby Rose · PE'];
const state={
 drivers:driversInit.map(x=>({...x})),routes:routesInit.map(x=>({...x})),filter:'pendente',financeFilter:'todas',
 manifests:[{number:'',branch:''}],dispatchDriver:'',dispatchTitle:'',selected:'',theme:'light',mapStyle:'light',
 rate:{base:185,kmIncluded:100,extra:2,helper:65,toll:true,parking:true},
 indiv:{driver:'',base:185,kmIncluded:100,extra:2,helper:65},
 alertHistory:false,notice:'',canhotoSearch:'',driverSearch:'',expenseModal:'',period:'20/10/2026',
 detailRoute:null,mapFollow:false
};
const driver=id=>state.drivers.find(x=>x.id===id);
const driverName=id=>driver(id)?.name||'Agregado Exemplo';
const activeCount=()=>state.routes.filter(x=>x.status==='em_rota').length;
const financeFor=r=>{const rate=state.rate;const over=Math.max(0,r.actualKm-rate.kmIncluded)*rate.extra;return r.base+over+(rate.toll?r.pedagio:0)+(rate.parking?r.parking:0)+r.helper;};
const nav=[
 ['visao-geral','Visão geral','<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'],
 ['alertas','Alertas','<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v5m0 3h.01"/>'],
 ['rastreamento','Rastreamento','<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15m6-12v15"/>'],
 ['atribuicao','Atribuir rotas','<path d="M8 4h8M8 8h8M8 12h6"/><rect x="3" y="2" width="18" height="20" rx="3"/><path d="M12 16v4m-2-2h4"/>'],
 ['canhotos','Canhotos','<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8m-8 4h5"/>'],
 ['acertos','Financeiro','<rect x="2" y="6" width="20" height="15" rx="2"/><path d="M2 11h20M7 16h4"/>'],
 ['cadastros','Cadastros','<circle cx="9" cy="8" r="3"/><path d="M3 21v-2a6 6 0 0 1 12 0v2M18 8v6m-3-3h6"/>'],
 ['tarifas','Tarifas','<path d="M4 5h16v4H4zM4 15h16v4H4z"/><path d="M9 9v6"/>']
];
function icon(data){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+data+'</svg>';}
function head(kicker,title,sub){return '<div class="ag-panel-head"><div><span>'+kicker+'</span><h2>'+title+'</h2></div>'+(sub?'<small>'+sub+'</small>':'')+'</div>';}
function selDrivers(selected='',placeholder='Selecione o agregado responsável...'){return '<option value="">'+placeholder+'</option>'+state.drivers.filter(d=>d.status==='aprovado').map(d=>'<option value="'+d.id+'" '+(selected===d.id?'selected':'')+'>'+esc(d.name)+'</option>').join('');}
function selectBranch(name='',index=0){return '<option value="">Selecionar filial...</option>'+branches.map(b=>'<option '+(b===name?'selected':'')+'>'+esc(b)+'</option>').join('');}
function KPIs(){return '<section class="ag-kpis" id="visao-geral">'+[
 ['EM APROVAÇÃO',state.drivers.filter(x=>x.status==='pendente').length,'cadastros'],
 ['APROVADOS',state.drivers.filter(x=>x.status==='aprovado').length,'agregados'],
 ['EM ROTA AGORA',activeCount(),'rastreamento ativo'],
 ['SAÍDAS HOJE',state.routes.filter(r=>r.date===state.period).length,'rotas iniciadas']
 ].map(a=>'<article><small>'+a[0]+'</small><strong>'+a[1]+'</strong><span>'+a[2]+'</span></article>').join('')+'</section>';}
function alerts(){return '<section class="ag-panel" id="alertas">'+head('CENTRAL DE ALERTAS','Agregados parados e sem sinal','Parado: GPS atualizado + 10 min sem movimento. Sem sinal: mais de 3 min sem GPS.')+
'<div id="agAlerts" class="ag-alert-list"><div class="ag-empty">'+icon('<path d="m8 12 3 3 5-6"/><circle cx="12" cy="12" r="9"/>')+' Nenhum alerta de rastreamento ativo nesta demonstração.</div></div>'+
'<details class="ag-alert-history" '+(state.alertHistory?'open':'')+'><summary>Histórico de alertas dos últimos 7 dias</summary><div id="agAlertHistory" class="ag-history-list"><div class="fleet-history">19/10/2026, 14:10 · GPS de exemplo normalizado · Agregado Exemplo 02</div><div class="fleet-history">18/10/2026, 10:22 · Alerta fictício de imobilidade encerrado</div></div></details></section>';}
function mapMarkup(){const selected=state.selected;const items=state.routes.filter(x=>x.status==='em_rota');return '<div class="fleet-map-surface '+(state.mapStyle==='dark'?'fleet-map-dark':'')+'"><svg class="fleet-map-lines" viewBox="0 0 650 390" preserveAspectRatio="none" aria-hidden="true"><path d="M60 370L160 220L205 245L310 105L430 190L580 54" /><path d="M120 40L160 220L350 340L550 245" /><path d="M20 210L150 180L265 90L480 310L650 325" /><path class="route-line" d="M160 220L205 245L310 105L430 190L580 54"/></svg>'+
items.map((r,i)=>'<button type="button" class="fleet-map-pin '+(selected===r.id?'active':'')+'" data-route="'+esc(r.id)+'" style="left:'+(i?65:38)+'%;top:'+(i?35:62)+'%" aria-label="Selecionar '+esc(driverName(r.driver))+'"><span>➤</span></button>').join('')+
'<div class="fleet-map-legend">Mapa demonstrativo · posições ilustrativas · sem GPS real</div><div class="fleet-map-controls"><button type="button" data-action="map-zoom" aria-label="Aumentar zoom">+</button><button type="button" data-action="map-zoom" aria-label="Reduzir zoom">−</button></div></div>';}
function tracking(){const items=state.routes.filter(x=>x.status==='em_rota');return '<section class="ag-panel" id="rastreamento">'+head('RASTREAMENTO','Operação ao vivo','')+
'<div class="ag-live-toolbar"><label><input type="checkbox" id="agFollow" '+(state.mapFollow?'checked':'')+'> Seguir agregado selecionado</label><button type="button" data-action="fit">Enquadrar mapa</button><button type="button" class="ag-map-tv-link" data-action="tv">⛶ Tela cheia · Modo TV ↗</button><button type="button" id="agMapTheme" data-action="map-theme">Mapa '+(state.mapStyle==='light'?'escuro':'claro')+'</button><small>GPS recebido na rota ativa · demonstração sem conexão</small></div>'+
'<div class="ag-live-grid"><div id="agMap" class="ag-map" role="img" aria-label="Mapa demonstrativo dos agregados ativos">'+mapMarkup()+'</div><div class="ag-live-list" id="liveList">'+items.map(r=>'<button type="button" class="ag-live-item '+(r.id===state.selected?'ag-selected':'')+'" data-route="'+esc(r.id)+'"><strong>'+esc(driverName(r.driver))+'</strong><span>'+esc(r.id)+' · '+r.done+'/'+r.stops+' paradas entregues</span><div class="ag-live-meta"><b>'+esc(r.gps)+'</b><b>'+r.actualKm+' km percorridos</b></div><span class="fleet-status is-live">● Em rota</span></button>').join('')+'</div></div></section>';}
function dispatch(){return '<section class="ag-panel" id="atribuicao">'+head('PLANEJAMENTO ADMINISTRATIVO','Montar e atribuir rota ao agregado','Selecione o motorista e informe cada romaneio com sua empresa. A rota aparece no APK como planejada.')+
'<form id="agAdminDispatch"><div class="ag-dispatch-top"><label>Agregado aprovado<select id="dispatch-driver" required>'+selDrivers(state.dispatchDriver)+'</select></label><label>Nome da rota (opcional)<input id="dispatch-title" maxlength="255" placeholder="Ex.: Entregas SP · turno manhã" value="'+esc(state.dispatchTitle)+'"></label></div>'+
'<div class="ag-dispatch-caption">ROMANEIOS · SELECIONE A FILIAL DE CADA LINHA</div><div id="agManifestRows" class="ag-dispatch-rows">'+state.manifests.map((m,i)=>'<div class="ag-dispatch-row"><label>Nº do romaneio<input data-manifest="'+i+'" required pattern="[A-Za-z0-9._/-]{1,40}" placeholder="ROM-DEMO-0001" maxlength="40" value="'+esc(m.number)+'"></label><label>Empresa/Filial<select data-branch="'+i+'" required>'+selectBranch(m.branch,i)+'</select></label><button type="button" class="ag-remove-manifest" data-remove="'+i+'" aria-label="Remover romaneio" '+(state.manifests.length===1?'disabled':'')+'>×</button></div>').join('')+'</div>'+
'<div class="ag-dispatch-actions"><button id="agAddManifest" type="button" data-action="add-manifest">+ Acrescentar romaneio</button><button id="agSubmitDispatch" type="submit">Validar NF-e e atribuir rota</button></div><p class="ag-fin-help">Na VPS, a atribuição valida até oito romaneios e 60 NF-e. Aqui os documentos são inventados e o envio é somente local.</p><div id="agDispatchFeedback" role="status" aria-live="polite"></div></form></section>';}
function canhotos(){return '<section class="ag-panel" id="canhotos">'+head('ARQUIVO DE COMPROVANTES','Canhotos das NF-e · Fotos armazenadas','Fotos por NF-e, romaneio, agregado, data e comprovante, com download e auditoria.')+
'<form id="agProofLookup" class="fleet-proof-form"><label><small>Buscar número ou chave da NF-e</small><input type="search" id="proof-search" placeholder="Número da NF-e, chave, romaneio ou agregado" value="'+esc(state.canhotoSearch)+'"></label><button type="submit">Consultar fotos e comprovantes</button><button type="button" class="ag-btn" data-action="proof-all">Abrir arquivo completo de canhotos ↗</button></form>'+
'<div class="fleet-proof-output">'+(state.canhotoSearch?'<div class="ag-driver-card"><strong>NF-DEMO-1024 · Canhoto ilustrativo</strong><p>Motorista Exemplo 02 · ROM-DEMO-1001 · 20/10/2026</p><button type="button" data-action="proof-example">Ver comprovante fictício</button></div>':'')+'</div>'+
'<p class="ag-fin-help">A aplicação real guarda fotos na VPS. Este preview não contém documentos, fotos de clientes nem comprovantes verdadeiros.</p></section>';}
function finance(){
 const rr=state.routes.filter(r=>state.financeFilter==='todas'||r.status===state.financeFilter);
 const preview=state.routes.filter(r=>!r.approved).reduce((s,r)=>s+financeFor(r),0),approved=state.routes.filter(r=>r.approved&&!r.paid).reduce((s,r)=>s+financeFor(r),0),paid=state.routes.filter(r=>r.paid).reduce((s,r)=>s+financeFor(r),0);
 return '<section class="ag-panel" id="acertos">'+head('CONTROLE DE SAÍDAS','Gestão de agregados · Financeiro por saída','Multimarcas: remuneração por saída, não multiplicada por romaneio/NF-e.')+
'<div class="ag-fin-kpis">'+[['Saídas listadas',state.routes.length],['Prévia em conferência',money(preview)],['APROVADO A PAGAR',money(approved)],['Pago (registrado)',money(paid)]].map(x=>'<article><small>'+x[0]+'</small><strong>'+x[1]+'</strong></article>').join('')+'</div>'+
'<div class="ag-fin-help">A prévia não é dívida aprovada. Custos só entram após aprovação. KM extra é calculado por tarifa vigente, sem cobrança duplicada por NF-e.</div>'+
'<h3 class="ag-fin-subtitle">Consolidado por agregado e dia</h3><div class="ag-table-wrap"><table class="ag-fin-table"><thead><tr><th>Agregado</th><th>Dia</th><th>Saídas</th><th>Base</th><th>KM extra</th><th>A pagar</th></tr></thead><tbody>'+
state.drivers.filter(d=>d.status==='aprovado').map(d=>{const r=state.routes.filter(x=>x.driver===d.id);return '<tr><td>'+esc(d.name)+'</td><td>20/10/2026</td><td>'+r.length+'</td><td>'+money(r.reduce((s,x)=>s+x.base,0))+'</td><td>'+money(r.reduce((s,x)=>s+Math.max(0,x.actualKm-state.rate.kmIncluded)*state.rate.extra,0))+'</td><td><strong>'+money(r.reduce((s,x)=>s+financeFor(x),0))+'</strong></td></tr>'}).join('')+'</tbody></table></div>'+
'<h3 class="ag-fin-subtitle">Detalhe de cada saída e aprovação dos custos</h3><div class="ag-fin-filters"><label>Status <select id="finance-filter"><option value="todas">Todas as saídas</option><option value="em_rota" '+(state.financeFilter==='em_rota'?'selected':'')+'>Em rota</option><option value="finalizada" '+(state.financeFilter==='finalizada'?'selected':'')+'>Finalizadas</option></select></label><button type="button" data-action="export-finance">Exportar CSV fictício ↓</button></div>'+
'<div class="ag-table-wrap"><table class="ag-fin-table"><thead><tr><th>Rota / romaneio</th><th>Agregado</th><th>Data</th><th>KM previstos</th><th>KM rodados</th><th>Pedágio</th><th>Estacionamento</th><th>Ajudante</th><th>Valor da saída</th><th>Status</th><th>Ações</th></tr></thead><tbody>'+
rr.map(r=>'<tr><td><strong>'+esc(r.id)+'</strong><div class="fleet-small">'+esc(r.manifest)+'</div></td><td>'+esc(driverName(r.driver))+'</td><td>'+esc(r.date)+'</td><td>'+r.plannedKm+'</td><td>'+r.actualKm+'</td><td>'+money(r.pedagio)+'</td><td>'+money(r.parking)+'</td><td>'+money(r.helper)+'</td><td><strong>'+money(financeFor(r))+'</strong></td><td><span class="fleet-status '+(r.paid?'is-paid':r.approved?'is-approved':'is-pending')+'">'+(r.paid?'Pago':r.approved?'Aprovado':'Conferir')+'</span></td><td><button type="button" data-detail="'+esc(r.id)+'">Abrir detalhe</button></td></tr>').join('')+'</tbody></table></div>'+
(state.detailRoute?detailPanel(state.routes.find(r=>r.id===state.detailRoute)):'')+'</section>';}
function detailPanel(r){if(!r)return '';return '<div class="fleet-detail-box"><div class="ag-panel-head"><div><span>DETALHE DA SAÍDA</span><h2>'+esc(r.id)+' · '+esc(driverName(r.driver))+'</h2></div><button type="button" data-action="close-detail">Fechar ×</button></div>'+
'<div class="ag-detail-content"><h4>Referência operacional</h4><p>'+esc(r.manifest)+' · '+r.stops+' paradas · '+r.done+' entregues · '+r.actualKm+' km</p><h4>Custos extras enviados pelo agregado</h4><div class="ag-expense-line"><span>Pedágio fictício</span><strong>'+money(r.pedagio)+'</strong><span>Estacionamento fictício</span><strong>'+money(r.parking)+'</strong></div><h4>Configurar valores desta saída</h4><p>Prévia total da saída: <strong>'+money(financeFor(r))+'</strong></p><div class="fleet-detail-actions">'+(r.status==='em_rota'?'<button type="button" class="ag-btn-red" data-action="finish:'+r.id+'">Forçar encerramento administrativo</button>':'')+(r.approved?'<button type="button" data-action="toggle-approved:'+r.id+'">Reabrir conferência</button>':'<button type="button" data-action="toggle-approved:'+r.id+'">Aprovar custos fictícios</button>')+'</div></div></div>';}
function driverCard(d){
 const status=d.status==='pendente'?'Em aprovação':d.status==='aprovado'?'Aprovado':'Correção necessária';
 return '<article class="ag-driver-card"><div class="ag-driver-top"><div class="ag-avatar">'+d.name[0]+'</div><div class="ag-driver-name"><strong>'+esc(d.name)+'</strong><span>'+esc(d.email)+'</span></div><span class="ag-status '+d.status+'">'+status+'</span></div>'+
 '<div class="ag-driver-data">'+[['NASCIMENTO',d.birth],['CPF',d.cpf],['CNPJ / MEI',d.cnpj],['VEÍCULO',d.vehicle],['PLACA',d.plate],['SAÍDAS',d.routes]].map(x=>'<div><small>'+x[0]+'</small><b>'+esc(x[1])+'</b></div>').join('')+'</div>'+
 '<div class="ag-docs"><button type="button" data-action="fake-doc">Ver CNH fictícia</button><button type="button" data-action="fake-doc">Ver foto do rosto fictícia</button></div>'+
 (d.status!=='aprovado'?'<div class="ag-actions"><button type="button" class="approve" data-approve="'+d.id+'">Aprovar cadastro</button><details><summary>Reprovar / pedir correção</summary><form class="ag-reject-form" data-reject="'+d.id+'"><textarea placeholder="Motivo fictício de correção" required></textarea><div class="ag-checks">'+['Dados pessoais','CPF/CNPJ','Dados bancários/PIX','CNH','Foto do rosto','Veículo/placa'].map(x=>'<label><input type="checkbox">'+x+'</label>').join('')+'</div><button class="reject" type="submit">Reprovar e liberar correção</button></form></details></div>':'')+'</article>';
}
function cadastros(){const counts={pendente:'Em aprovação',aprovado:'Aprovados',reprovado:'Reprovados',todos:'Todos'};
const list=state.drivers.filter(d=>(state.filter==='todos'||d.status===state.filter)&&(d.name.toLowerCase().includes(state.driverSearch.toLowerCase())||d.vehicle.toLowerCase().includes(state.driverSearch.toLowerCase())));
return '<section class="ag-panel" id="cadastros"><div class="ag-panel-head"><div><span>CADASTROS</span><h2>Análise dos agregados</h2></div><nav class="ag-filters">'+Object.entries(counts).map(([k,v])=>'<button type="button" data-filter="'+k+'" class="'+(state.filter===k?'active':'')+'">'+v+'</button>').join('')+'</nav></div>'+
'<div class="fleet-filter-row"><label>Buscar agregado<input id="driver-search" type="search" placeholder="Nome ou veículo fictício" value="'+esc(state.driverSearch)+'"></label><span>'+list.length+' registro(s)</span></div>'+
(list.length?'<div class="ag-cards">'+list.map(driverCard).join('')+'</div>':'<div class="ag-empty">Nenhum cadastro nesta situação.</div>')+'</section>';}
function tariffFields(prefix,rate){return [
 ['R$ por saída / rota iniciada','base',rate.base],
 ['KM incluídos na saída (limite X)','kmIncluded',rate.kmIncluded],
 ['R$ por KM acima do limite','extra',rate.extra],
 ['R$ por ajudante','helper',rate.helper]
].map(([label,key,val])=>'<label><small>'+label+'</small><input type="number" step="0.01" min="0" data-tariff="'+prefix+':'+key+'" value="'+esc(val)+'"></label>').join('');}
function tariffs(){return '<section class="ag-panel" id="tarifas">'+head('VALORES','Tabela padrão dos agregados','Aplicada quando não houver tabela individual')+
'<form class="ag-pricing" id="agDefaultTariff">'+tariffFields('default',state.rate)+
'<label><small>Início vigência</small><input type="date" value="'+today+'"></label><label class="ag-toggle"><input id="toll-enabled" type="checkbox" '+(state.rate.toll?'checked':'')+'><span>Reembolsar pedágio com comprovante</span></label><label class="ag-toggle"><input id="parking-enabled" type="checkbox" '+(state.rate.parking?'checked':'')+'><span>Reembolsar estacionamento com comprovante</span></label><button type="submit">Salvar tabela fictícia</button></form></section>'+
'<section class="ag-panel" id="tarifa-individual">'+head('TABELA INDIVIDUAL','Negociação por agregado','Sobrepõe a tabela padrão quando vigente.')+
'<form class="ag-pricing ag-pricing-negociacao" id="agIndividualTariff"><label><small>Agregado</small><select id="individual-driver">'+selDrivers(state.indiv.driver,'Selecionar...')+'</select></label>'+
tariffFields('individual',state.indiv)+'<label><small>Início vigência</small><input type="date" value="'+today+'"></label>'+
'<label class="ag-toggle"><input type="checkbox" checked><span>Reembolso pedágio</span></label><label class="ag-toggle"><input type="checkbox" checked><span>Reembolso estacionamento</span></label>'+
'<div class="ag-rule-preview" id="agRulePreview">Exemplo fictício: saída '+money(state.indiv.base)+' + '+Math.max(0,135-state.indiv.kmIncluded)+' km excedentes × '+money(state.indiv.extra)+' = <strong>'+money(state.indiv.base+Math.max(0,135-state.indiv.kmIncluded)*state.indiv.extra)+'</strong> (sem custos adicionais).</div><button type="submit">Salvar tarifa individual</button></form></section>';}
function banner(){return '<div class="fleet-topline"><div><strong>UNION · TOWER CONTROL</strong><span>Espelho visual do módulo Agregados — HTML/CSS originais, dados fictícios</span></div><div class="fleet-top-actions"><span class="fleet-demo-badge">AMBIENTE DEMO · SEM API</span><button type="button" data-action="theme">☾ Alternar tema</button><a href="../">← Portfólio</a></div></div>';}
function modal(){if(!state.expenseModal)return '';const name=state.expenseModal;const contents={
 tv:['Modo TV · Operação ao vivo','A visão de TV está representada pela própria seção Rastreamento do preview.'],
 proof:['Comprovante demonstrativo','Nenhum arquivo real de canhoto, CNH ou foto é disponibilizado. A ação é ilustrativa.'],
 zoom:['Mapa de demonstração','Posições e trajetos são ilustrativos. A aplicação original usa Leaflet/MapLibre com GPS autenticado.']
};const [title,message]=contents[name]||['Demonstração','Ação simulada localmente, sem banco de dados.'];return '<div class="fleet-modal-backdrop" data-action="dismiss-modal"><div class="fleet-modal" role="dialog" aria-modal="true" aria-label="'+title+'"><h2>'+title+'</h2><p>'+message+'</p><button type="button" data-action="dismiss-modal">Entendi</button></div></div>';}
function render(){
 document.documentElement.dataset.theme=state.theme;
 app.innerHTML=banner()+'<main class="ag-page"><header class="ag-head"><div><span>RUBY TOWER CONTROL · OPERAÇÃO DE ÚLTIMA MILHA</span><h1>Gestão de agregados</h1><p>Cadastros, rastreamento em tempo real, comprovantes por NF-e e financeiro por saída.</p></div><div class="ag-live-pill"><i></i><span id="liveCounter">'+activeCount()+' em rota</span></div></header>'+
 '<nav class="ag-quick-nav" aria-label="Navegação interna de Agregados">'+nav.map(([id,label,svg])=>'<a href="#'+id+'">'+icon(svg)+label+'</a>').join('')+'</nav>'+
 KPIs()+alerts()+tracking()+dispatch()+canhotos()+finance()+cadastros()+tariffs()+
 '<div class="fleet-footer">UNION · TOWER CONTROL — Simulação offline. Todos os registros são fictícios. Nenhum envio à VPS ou ao GitHub.</div></main>'+modal()+
 (state.notice?'<div class="fleet-toast" role="status">'+esc(state.notice)+'</div>':'');
}
function toast(message){state.notice=message;render();setTimeout(()=>{if(state.notice===message){state.notice='';document.querySelector('.fleet-toast')?.remove();}},2500);}
function rememberForms(){const d=document.getElementById('dispatch-driver'),t=document.getElementById('dispatch-title');if(d)state.dispatchDriver=d.value;if(t)state.dispatchTitle=t.value;state.manifests.forEach((m,i)=>{const n=document.querySelector('[data-manifest="'+i+'"]'),b=document.querySelector('[data-branch="'+i+'"]');if(n)m.number=n.value;if(b)m.branch=b.value;});}
function rerender(anchor){const before=window.scrollY;render();if(anchor){const el=document.getElementById(anchor);el?.scrollIntoView({block:'start',behavior:'instant'});}else window.scrollTo(0,before);}
function csvExport(){const head=['Rota','Motorista','Dia','KM','Pedágio','Estacionamento','Valor fictício','Status'];
 const rows=state.routes.map(r=>[r.id,driverName(r.driver),r.date,r.actualKm,r.pedagio,r.parking,financeFor(r),r.paid?'Pago fictício':r.approved?'Aprovado fictício':'Em conferência']);
 const blob=new Blob(['\uFEFF'+[head,...rows].map(row=>row.map(s=>'"'+String(s).replaceAll('"','""')+'"').join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='fleetops-financeiro-DEMO.csv';a.click();URL.revokeObjectURL(url);
}
document.addEventListener('click',event=>{
 const target=event.target;
 const button=target.closest('button[data-action],button[data-route],button[data-filter],button[data-remove],button[data-approve],button[data-detail]');
 if(!button)return;
 const action=button.dataset.action||'';
 if(button.dataset.route){state.selected=button.dataset.route;rerender('rastreamento');return;}
 if(button.dataset.detail){state.detailRoute=button.dataset.detail;rerender('acertos');return;}
 if(button.dataset.filter){state.filter=button.dataset.filter;rerender('cadastros');return;}
 if(button.dataset.approve){const d=driver(button.dataset.approve);if(d)d.status='aprovado';rerender('cadastros');return;}
 if(button.dataset.remove!==undefined){rememberForms();state.manifests.splice(Number(button.dataset.remove),1);rerender('atribuicao');return;}
 if(action==='add-manifest'){rememberForms();if(state.manifests.length<8)state.manifests.push({number:'',branch:''});rerender('atribuicao');return;}
 if(action==='theme'){state.theme=state.theme==='light'?'dark':'light';rerender();return;}
 if(action==='map-theme'){state.mapStyle=state.mapStyle==='light'?'dark':'light';rerender('rastreamento');return;}
 if(action==='close-detail'){state.detailRoute=null;rerender('acertos');return;}
 if(action==='fit'||action==='map-zoom'){state.expenseModal='zoom';rerender('rastreamento');return;}
 if(action==='tv'){state.expenseModal='tv';rerender('rastreamento');return;}
 if(action==='proof-all'||action==='proof-example'||action==='fake-doc'){state.expenseModal='proof';rerender(action==='fake-doc'?'cadastros':'canhotos');return;}
 if(action==='dismiss-modal'){state.expenseModal='';rerender();return;}
 if(action==='export-finance'){csvExport();return;}
 if(action.startsWith('toggle-approved:')){const r=state.routes.find(x=>x.id===action.slice(16));if(r)r.approved=!r.approved;rerender('acertos');return;}
 if(action.startsWith('finish:')){const r=state.routes.find(x=>x.id===action.slice(7));if(r){r.status='finalizada';r.done=r.stops;r.actualKm=r.plannedKm;}rerender('acertos');return;}
});
document.addEventListener('input',event=>{
 const target=event.target;
 if(target.id==='driver-search'){const pos=target.selectionStart;state.driverSearch=target.value;rerender('cadastros');const input=document.getElementById('driver-search');input?.focus();input?.setSelectionRange(pos,pos);return;}
 if(target.id==='proof-search'){state.canhotoSearch=target.value;return;}
 if(target.dataset.tariff){const [group,key]=target.dataset.tariff.split(':');state[group==='default'?'rate':'indiv'][key]=Math.max(0,Number(target.value)||0);if(group==='individual'){const x=document.getElementById('agRulePreview');if(x)x.textContent='Saída '+money(state.indiv.base)+' + '+Math.max(0,135-state.indiv.kmIncluded)+' km excedentes × '+money(state.indiv.extra)+' = '+money(state.indiv.base+Math.max(0,135-state.indiv.kmIncluded)*state.indiv.extra);}return;}
});
document.addEventListener('change',event=>{
 const x=event.target;
 if(x.id==='finance-filter'){state.financeFilter=x.value;rerender('acertos');}
 if(x.id==='agFollow'){state.mapFollow=x.checked;}
 if(x.id==='individual-driver'){state.indiv.driver=x.value;}
 if(x.id==='toll-enabled'){state.rate.toll=x.checked;}
 if(x.id==='parking-enabled'){state.rate.parking=x.checked;}
});
document.addEventListener('submit',event=>{
 const form=event.target;
 if(!['agAdminDispatch','agProofLookup','agDefaultTariff','agIndividualTariff'].includes(form.id)&&!form.dataset.reject)return;
 event.preventDefault();
 if(form.id==='agAdminDispatch'){
   rememberForms();
   const nr=state.manifests.filter(m=>m.number.trim()&&m.branch);
   if(!state.dispatchDriver||!nr.length){toast('Selecione um agregado e informe um romaneio com filial fictícios.');return;}
   nr.forEach((m,i)=>state.routes.unshift({id:'ROTA-DEMO-'+(1005+state.routes.length),driver:state.dispatchDriver,manifest:m.number,date:'20/10/2026',status:'planejada',plannedKm:56,actualKm:0,stops:4,done:0,started:'--:--',gps:'aguardando',base:state.rate.base,pedagio:0,parking:0,helper:0,approved:false,paid:false}));
   state.manifests=[{number:'',branch:''}];state.dispatchTitle='';rerender('atribuicao');const fb=document.getElementById('agDispatchFeedback');if(fb)fb.textContent='Rota fictícia atribuída localmente. Nenhuma API ou NF-e consultada.';return;
 }
 if(form.id==='agProofLookup'){state.canhotoSearch=document.getElementById('proof-search')?.value||'';rerender('canhotos');return;}
 if(form.id==='agDefaultTariff'||form.id==='agIndividualTariff'){toast('Tarifa alterada apenas nesta sessão de demonstração.');return;}
 if(form.dataset.reject){const d=driver(form.dataset.reject);if(d)d.status='reprovado';rerender('cadastros');return;}
});
render();
