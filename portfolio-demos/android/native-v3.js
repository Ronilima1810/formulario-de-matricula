'use strict';
/* UNION AGREGADOS | Compose-sourced browser simulator.
   Colors, shell, icon paths and screen text refer to real Kotlin sources.
   All app data, navigation, photos, GPS, signature and finance are strictly local mocks. */
const root=document.getElementById('mobile-root');
const phone=document.querySelector('.phone');
const ic=(n,cls='')=>'<svg class="ico '+cls+'" aria-hidden="true"><use href="assets/native-icons.svg#'+n+'"></use></svg>';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])); 
const brl=v=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(v);
const logo='<img class="union-logo" alt="UNION" src="assets/union_brand.png">';
const statusNames={planejada:'Planejada',em_rota:'Em rota',pausada:'Pausada',finalizada:'Finalizada',entregue:'Entregue',pendente:'Pendente',nao_entregue:'Ocorrência'};
const tone=(s)=>s==='finalizada'||s==='entregue'?'green':s==='em_rota'?'blue':s==='nao_entregue'?'danger':'yellow';
const badge=(s)=>'<span class="n-badge '+tone(s)+'">'+esc(statusNames[s]||s)+'</span>';
const btn=(label,action,kind='outline',icon='')=>'<button type="button" data-act="'+action+'" class="'+(kind==='primary'?'n-cta':kind==='yellow'?'n-cta yellow':'n-outline')+'">'+(icon?ic(icon):'')+esc(label)+'</button>';
const field=(label,id,placeholder='',type='text',value='',extra='')=>'<label class="n-field">'+esc(label)+'<input id="'+esc(id)+'" name="'+esc(id)+'" type="'+type+'" placeholder="'+esc(placeholder)+'" value="'+esc(value)+'" '+extra+'></label>';
const textarea=(label,id,placeholder='')=>'<label class="n-field">'+esc(label)+'<textarea id="'+id+'" placeholder="'+esc(placeholder)+'"></textarea></label>';
const seedStops=()=>[
 {id:'ST-001',sequence:1,nfe:'NF-DEMO-101',client:'Cliente Modelo A',address:'Rua Exemplo, 120 · Cidade Demo, SP',status:'entregue',order:'PED-DEMO-101',volumes:2,proof:'Canhoto de demonstração'},
 {id:'ST-002',sequence:2,nfe:'NF-DEMO-102',client:'Comércio Fictício B',address:'Av. das Palmeiras, 450 · Cidade Demo, SP',status:'pendente',order:'PED-DEMO-102',volumes:4},
 {id:'ST-003',sequence:3,nfe:'NF-DEMO-103',client:'Loja Fictícia C',address:'Rua do Parque, 89 · Cidade Demo, SP',status:'pendente',order:'PED-DEMO-103',volumes:1},
 {id:'ST-004',sequence:4,nfe:'NF-DEMO-104',client:'Distribuidora Demo D',address:'Praça Central, 30 · Cidade Demo, SP',status:'pendente',order:'PED-DEMO-104',volumes:3}
];
const seed=()=>({page:'login',authenticated:false,drawer:false,modal:'',section:'',selected:'DEMO-ROTA-001',stopIndex:1,search:'',historySearch:'',routeStarted:false,showPw:false,regPhotos:{},proofs:{},signatureSaved:{},routeMode:'romaneios',newStep:0,manifests:[{id:1,number:'',branch:'Ruby Rose SP'}],keys:'',routeName:'',notice:'',gpsAccuracy:null,expenseTotal:37.5,expenseValue:'',occurrenceReason:'Loja fechada',occurrenceDescription:'',occurrencePhoto:false,selectedProof:'canhoto',historyLimit:2,updateVersion:'1.0.0',routes:[
{id:'DEMO-ROTA-001',title:'Saída demonstrativa · Zona Norte',status:'em_rota',km:68.4,realKm:42.1,delivered:1,stops:seedStops(),manifest:'ROM-DEMO-742'},
{id:'DEMO-ROTA-002',title:'Rota planejada · Zona Sul',status:'planejada',km:41.2,realKm:0,delivered:0,manifest:'ROM-DEMO-753',stops:[{id:'ST-005',sequence:1,nfe:'NF-DEMO-201',client:'Cliente Demo E',address:'Av. Modelo, 450 · Cidade Demo, SP',status:'pendente',order:'PED-DEMO-201',volumes:2},{id:'ST-006',sequence:2,nfe:'NF-DEMO-202',client:'Parceiro Fictício F',address:'Rua Exemplo, 50 · Cidade Demo, SP',status:'pendente',order:'PED-DEMO-202',volumes:1}]},
{id:'DEMO-ROTA-000',title:'Rota concluída · Exemplo',status:'finalizada',km:32.8,realKm:34.1,delivered:2,manifest:'ROM-DEMO-715',finishedAt:'19/10/2026 às 08:10',stops:[{id:'ST-000A',sequence:1,nfe:'NF-DEMO-091',client:'Cliente Exemplo Histórico',address:'Rua Fictícia, 5 · Cidade Demo, SP',status:'entregue',order:'PED-DEMO-091',volumes:1},{id:'ST-000B',sequence:2,nfe:'NF-DEMO-092',client:'Cliente Exemplo Histórico B',address:'Rua Fictícia, 6 · Cidade Demo, SP',status:'entregue',order:'PED-DEMO-092',volumes:2}]}
]});
let s=seed();
const activeRoute=()=>s.routes.find(r=>r.id===s.selected)||s.routes[0];
const activeStop=()=>activeRoute().stops[s.stopIndex]||activeRoute().stops[0];
const activeRoutes=()=>s.routes.filter(r=>r.status!=='finalizada');
function popup(message){s.notice=message;render();setTimeout(()=>{if(s.notice===message){s.notice='';document.querySelector('.n-toast')?.remove();}},2500);}
function go(page,keepModal=false){s.page=page;s.drawer=false;if(!keepModal)s.modal='';s.search='';render();}
function login(){s.authenticated=true;s.page='home';s.modal='';s.notice='';render();}
function iconButton(name,action,title=''){return '<button type="button" class="n-icon-btn" data-act="'+action+'" aria-label="'+esc(title||action)+'">'+ic(name)+'</button>';}
function header(){return '<header class="n-header">'+iconButton('menu','drawer','Abrir menu')+logo+iconButton('bell','notifications','Notificações')+'<button type="button" class="n-avatar" aria-label="Meu perfil" data-go="profile">'+ic('user')+'</button></header>';}
function bottom(){const page=s.page;
 const nav=[['home','home','Início'],['routes','route','Rotas'],['new','plus','Nova rota'],['expenses','box','Despesas'],['profile','user','Perfil']];
 return '<nav class="n-bottom" aria-label="Navegação do app">'+nav.map(x=>x[0]==='new'?'<button class="n-fab" data-go="new" aria-label="Nova rota">'+ic('plus')+'</button>':'<button data-go="'+x[0]+'" class="'+(page===x[0]||page==='detail'&&x[0]==='routes'?'active':'')+'">'+ic(x[1])+'<span>'+x[2]+'</span></button>').join('')+'</nav>';
}
function backTitle(title,subtitle=''){return '<div class="n-row" style="margin-bottom:12px">'+iconButton('arrowLeft','back','Voltar')+'<div class="n-grow"><h2 class="n-h1">'+esc(title)+'</h2>'+(subtitle?'<div class="n-sub">'+esc(subtitle)+'</div>':'')+'</div>'+iconButton('refresh','refresh','Atualizar')+'</div>';}
function stats(){const data=[['2','Rotas hoje','truck','#59d0ff'],['6','Entregas','box','#c1a4ff'],['110 km','KM previsto','route','#9d60ff'],[brl(s.expenseTotal),'Despesas','coins','#ffd52a']];return '<div class="n-stats">'+data.map(x=>'<article class="n-stat"><span style="color:'+x[3]+'">'+ic(x[2])+'</span><strong>'+x[0]+'</strong><small>'+x[1]+'</small></article>').join('')+'</div>';}
function mapVisual(stops){return '<div class="n-map" data-leaflet-stops="'+(stops?.length||0)+'" aria-label="Mapa interativo Leaflet com paradas fictícias"></div>';}
let previewMaps=[];
function initLeafletPreview(){previewMaps.forEach(m=>m.remove());previewMaps=[];if(typeof L==='undefined')return;document.querySelectorAll('.n-map[data-leaflet-stops]').forEach((el,index)=>{const n=Number(el.dataset.leafletStops)||0;const stopList=activeRoute().stops.slice(0,n);const map=L.map(el,{zoomControl:true,scrollWheelZoom:false}).setView([-23.55,-46.63],11);previewMaps.push(map);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);const pts=stopList.map((stop,i)=>{const ll=[-23.55+Math.sin(i*2.1+index)*0.035,-46.63+Math.cos(i*1.7+index)*0.05];L.marker(ll).addTo(map).bindPopup('<b>'+esc(stop.client)+'</b><br>NF '+esc(stop.nfe)+' · Parada '+(i+1));return ll;});if(pts.length>1){L.polyline(pts,{color:'#3179ce',weight:4,dashArray:'7 5'}).addTo(map);map.fitBounds(pts,{padding:[24,24],maxZoom:12});}setTimeout(()=>map.invalidateSize(),60);});}
function routeCard(r){const delivered=r.stops.filter(x=>x.status==='entregue').length,percent=Math.round(100*delivered/Math.max(1,r.stops.length));return '<article class="n-panel"><button type="button" class="n-tap" data-route="'+esc(r.id)+'"><div class="n-row"><span class="n-circle">'+ic('truck')+'</span><div class="n-grow"><h3>'+esc(r.title)+'</h3><p>'+delivered+'/'+r.stops.length+' entregas · '+r.km.toFixed(1).replace('.',',')+' km</p></div>'+ic('arrowRight')+'</div></button><div class="n-progress"><span style="width:'+percent+'%"></span></div><div class="n-row n-between">'+badge(r.status)+'<button type="button" class="n-outline compact" data-route="'+esc(r.id)+'">'+ic('navigation')+(r.status==='em_rota'?'Continuar rota':'Abrir rota')+'</button></div></article>';}
function home(){const list=activeRoutes().filter(r=>(r.title+r.id+r.stops.map(x=>x.client+' '+x.address+' '+x.nfe).join(' ')).toLowerCase().includes(s.search.toLowerCase()));return '<div class="n-scroll"><input class="n-search" id="route-search" placeholder="Buscar pedidos, clientes ou endereços..." value="'+esc(s.search)+'">'+stats()+
'<div class="n-panel" style="padding:9px"><div class="n-row n-between" style="margin:2px 4px 11px"><strong style="font-size:13px">MINHAS ROTAS</strong><button class="n-outline compact" data-go="map" style="min-height:30px;background:#8c52ff55;border:none">Ver mapa '+ic('arrowRight')+'</button></div><button type="button" class="n-tap" data-go="map">'+mapVisual(activeRoute().stops)+'</button></div>'+
'<div class="n-title"><h2>Segunda-feira, 19 de outubro</h2><span class="n-muted n-minor">'+list.length+' rotas</span></div>'+
(list.map(routeCard).join('')||'<div class="n-panel">Nenhuma rota corresponde à busca.</div>')+
'<button class="n-outline" data-go="routes" style="width:100%;margin-bottom:12px">'+ic('refresh')+' Atualizar painel</button></div>';}
function routes(){const routes=activeRoutes().filter(r=>(r.title+r.manifest).toLowerCase().includes(s.search.toLowerCase()));return '<div class="n-scroll">'+backTitle('Minhas rotas','Saídas pendentes e em andamento')+'<input class="n-search" id="route-search" placeholder="Buscar rota ou romaneio..." value="'+esc(s.search)+'">'+
'<div class="n-row n-between" style="margin-bottom:12px"><span class="n-badge">'+ic('route')+' '+routes.length+' rotas</span>'+btn('Nova rota','new','outline','plus')+'</div>'+
(routes.map(routeCard).join('')||'<div class="n-panel"><p>Nenhuma rota pendente.</p></div>')+'</div>';}
function history(){const records=s.routes.filter(x=>x.status==='finalizada').filter(x=>(x.title+x.id+x.finishedAt).toLowerCase().includes(s.historySearch.toLowerCase()));return '<div class="n-scroll">'+backTitle('Histórico de corridas','Rotas finalizadas · Arquivo de entregas')+
'<span class="n-badge">'+records.length+' carregadas</span><div style="height:12px"></div><input class="n-search" id="history-search" placeholder="Pesquisar corrida, rota ou data" value="'+esc(s.historySearch)+'">'+
(records.slice(0,s.historyLimit).map(x=>'<article class="n-panel"><div class="n-row">'+ic('packageCheck')+'<div class="n-grow"><h3>'+esc(x.title)+'</h3><p>'+x.stops.length+'/'+x.stops.length+' entregas · '+x.km+' km</p></div></div><div class="n-row n-between"><span class="n-minor n-muted">Finalizada: '+esc(x.finishedAt||'19/10/2026 às 09:20')+'</span>'+badge('entregue')+'</div><div style="margin-top:10px">'+btn('Consultar corrida','route:'+x.id,'outline','file')+'</div></article>').join('')||'<div class="n-panel">Nenhuma corrida finalizada ainda.</div>')+
'<button class="n-outline" data-act="history-more" style="width:100%">'+ic('down')+' Carregar corridas anteriores</button></div>';}
function loginPage(){
 return '<div class="n-scroll">'+logo+'<div class="login-caption">TOWER CONTROL · AGREGADOS</div>'+
 '<div class="login-hero" aria-label="UNION Tower Control"><div class="login-hero-glow"></div><img src="assets/union_brand.png" alt="UNION" class="login-hero-brand"><div class="login-hero-rule"></div><span>TECNOLOGIA PARA A ÚLTIMA MILHA</span></div>'+
 '<div class="login-title">Acesse sua conta</div><p class="login-desc">Utilize o mesmo e-mail e senha do PWA.</p>'+
 '<form id="login-form" class="login-card">'+field('E-mail','login-email','agregado@exemplo.invalid','email','')+
 '<label class="n-field">Senha<div style="position:relative"><input type="'+(s.showPw?'text':'password')+'" id="login-password" placeholder="Senha fictícia" style="padding-right:81px"><button type="button" data-act="show-password" style="position:absolute;right:6px;top:5px;border:0;background:transparent;color:#6848d8;padding:10px;font-size:11px">'+(s.showPw?'Ocultar':'Mostrar')+'</button></div></label>'+
 '</form><button form="login-form" type="submit" class="login-submit">Entrar</button>'+
 '<button class="login-text-btn" data-go="forgot">Esqueci minha senha</button>'+
 '<button class="login-text-btn secondary" data-go="register">Criar cadastro de agregado</button>'+
 '<div class="login-actions-divider"></div><button class="login-text-btn" data-act="updates">↻ Verificar atualização do aplicativo</button>'+
 '<p style="font-size:10px;color:#626b7c;text-align:center;margin-top:6px">UNION · Versão demonstrativa</p></div>';
}
function registerPage(){
const fields=[['E-mail','reg-email','email'],['Senha','reg-password','password'],['Nome completo','reg-name'],['Data de nascimento (AAAA-MM-DD)','reg-birth'],['RG','reg-rg'],['CPF','reg-cpf'],['CNPJ / MEI','reg-cnpj'],['Conta bancária PJ','reg-bank'],['Chave PIX','reg-pix'],['Placa do veículo','reg-plate'],['Modelo do veículo','reg-model']];
return '<div class="n-scroll"><button data-go="login" class="login-text-btn secondary" style="text-align:left">← Voltar</button><h2 class="n-h1">Cadastro de agregado</h2><p class="n-sub">Envie os dados para aprovação administrativa.</p><div class="n-panel" style="margin-top:14px"><div class="n-stack">'+fields.map(x=>field(x[0]+(x[1]==='reg-bank'||x[1]==='reg-pix'?'':' *'),x[1],x[1].includes('cpf')?'000.000.000-00':x[1].includes('cnpj')?'00.000.000/0000-00':'',x[2]||'text')).join('')+
'<div class="n-note">Selfie para identificação e foto de perfil *</div><p class="n-note">Tire uma selfie nítida do próprio rosto para a administração identificar o agregado.</p><div class="n-actions">'+btn(s.regPhotos.cnh?'CNH ✓':'Foto da CNH','demo-cnh','outline','file')+btn(s.regPhotos.face?'Selfie ✓':'Tirar selfie *','demo-face','outline','user')+'</div>'+
'<div class="n-note">A câmera é simulada neste preview. Não envie documentos reais.</div>'+btn('Enviar cadastro fictício','reg-submit','primary','send')+'<small class="n-muted">* campos obrigatórios no aplicativo original</small></div></div></div>';
}
function forgotPage(){return '<div class="n-scroll"><button class="login-text-btn secondary" data-go="login" style="text-align:left">← Voltar</button><h2 class="n-h1">Esqueci minha senha</h2><p class="n-sub">Recuperação simulada, sem envio real de e-mail.</p><div class="n-panel" style="margin-top:15px"><div class="n-stack">'+field('E-mail','forgot-email','email@exemplo.invalid','email')+btn('Enviar código','forgot-code','outline','send')+field('Código de 6 dígitos','forgot-code-value','123456')+field('Nova senha','forgot-password','','password')+btn('Redefinir senha fictícia','forgot-save','primary','check')+'</div></div></div>';}
function approvalPage(){return '<div class="n-scroll"><div class="n-panel" style="margin-top:60px;text-align:center"><span style="display:inline-block;color:#ffd52a">'+ic('clock')+'</span><h2 style="margin-top:15px">Cadastro em aprovação</h2><p>Seu cadastro demonstrativo foi recebido. Você será avisado quando houver aprovação no aplicativo original.</p><div class="n-badge yellow">EM APROVAÇÃO</div><div style="margin-top:19px">'+btn('Voltar ao login','login','outline','arrowLeft')+'</div></div></div>';}
function profile(){return '<div class="n-scroll"><div class="n-panel"><div class="n-row"><span class="n-circle">'+ic('user')+'</span><div class="n-grow"><h2 class="n-h1">Motorista Demonstrativo</h2><div class="n-sub">agregado@exemplo.invalid</div></div></div><div style="margin-top:12px">'+badge('entregue')+'</div><p>Cadastro: APROVADO</p><p>Conta integrada ao PWA. Os comprovantes e o GPS são utilizados durante as rotas.</p></div><div class="n-panel"><h3>Meu perfil</h3><div class="n-stack" style="margin-top:12px"><div class="n-row n-between"><span class="n-muted">Veículo</span><strong>Veículo Demo 2026</strong></div><div class="n-row n-between"><span class="n-muted">Placa</span><strong>DEMO123</strong></div><div class="n-row n-between"><span class="n-muted">Documento</span><strong>Somente exemplo</strong></div></div></div><div class="n-panel"><h3>Aplicativo</h3><p>Versão demonstrativa · código fictício</p>'+btn('Verificar atualização','updates','outline','refresh')+'</div>'+btn('Sair da conta','logout','outline','close')+'</div>';}
function newRoute(){
const manifestFields=s.manifests.map((x,i)=>'<div class="n-card"><div class="n-row n-between"><h4>Romaneio '+String(i+1).padStart(2,'0')+'</h4>'+(i>0?'<button class="n-icon-btn" data-remove-manifest="'+i+'">'+ic('close')+'</button>':'')+'</div>'+field('Nº do Romaneio','manifest-'+i,'Ex.: ROM-DEMO-742','text',x.number)+
'<label class="n-field">Filial<select id="branch-'+i+'">'+['Ruby Rose SP','Union Medic / Glass','Midday Cosmic / Melu','A Gente Cosmetics','New Cosmic','Party Cosméticos'].map(v=>'<option '+(x.branch===v?'selected':'')+'>'+esc(v)+'</option>').join('')+'</select></label></div>').join('');
return '<div class="n-scroll"><div class="n-row" style="margin-bottom:14px">'+iconButton('arrowLeft','back')+'<div class="n-grow"><h2 class="n-h1">Nova Rota</h2><p class="n-sub">Adicione os romaneios para gerar a rota</p></div></div>'+
'<div class="n-row n-between" style="margin-bottom:13px"><span class="n-badge">'+ic('file')+' 1 Romaneios</span><span class="n-badge">'+ic('check')+' 2 Revisão</span><span class="n-badge">'+ic('route')+' 3 Rota</span></div>'+
'<div class="n-panel"><div class="n-row">'+ic('file')+'<div><h3>Romaneios da Rota</h3><p>Adicione os números e selecione a filial de cada entrega.</p></div></div></div>'+
'<div class="n-segment" style="margin-bottom:13px"><button data-mode="romaneios" class="'+(s.routeMode==='romaneios'?'selected':'')+'">Romaneios SP</button><button data-mode="chaves" class="'+(s.routeMode==='chaves'?'selected':'')+'">Chaves NF-e</button></div>'+
'<div class="n-stack">'+field('Nome da rota (opcional)','new-route-name','Ex.: Rota Norte Demo','text',s.routeName)+
(s.routeMode==='romaneios'?manifestFields+btn('Adicionar outro romaneio','add-manifest','outline','plus')+'<p class="n-note">'+s.manifests.length+'/10 romaneios · Filial por linha</p>':textarea('Inserir chaves de NF-e','manual-keys','Chaves demonstrativas de 44 dígitos, uma por linha'))+
btn('Revisar romaneios →','review-route','primary','route')+'</div></div>';}
function reviewRoute(){
 const mf=s.manifests.filter(x=>x.number.trim()),keys=s.keys.split(/\s+/).filter(x=>/^\d{44}$/.test(x));
 return '<div class="n-scroll">'+backTitle('Revisão da rota','Etapa 2 de 3 · Conferir antes de gerar')+
 '<div class="n-panel"><h3>Resumo da operação</h3><div class="n-stack" style="margin-top:11px"><div class="n-row n-between"><span class="n-muted">Nome da rota</span><strong>'+esc(s.routeName||'Nova Rota Fictícia')+'</strong></div><div class="n-row n-between"><span class="n-muted">Romaneios</span><strong>'+mf.length+'</strong></div><div class="n-row n-between"><span class="n-muted">Chaves NF-e</span><strong>'+keys.length+'</strong></div></div></div>'+
 (s.routeMode==='romaneios'?mf.map((m,i)=>'<div class="n-card"><h4>Romaneio '+(i+1)+'</h4><p>'+esc(m.number)+' · '+esc(m.branch)+'</p></div>').join(''):keys.map((k,i)=>'<div class="n-card"><h4>Chave NF-e '+(i+1)+'</h4><p>'+esc(k.slice(0,12))+'…'+esc(k.slice(-8))+'</p></div>').join(''))+
 '<div class="n-panel"><h3>Conferindo NF-e...</h3><p>Esta revisão é local. Não há consulta ao Ruby nem a documentos fiscais reais.</p>'+btn('Gerar rota demonstrativa','create-route','primary','route')+'</div>'+
 btn('Editar romaneios','back','outline','arrowLeft')+'</div>';
}
function routeDetail(){
const r=activeRoute(),deliver=r.stops.filter(x=>x.status==='entregue').length;
return '<div class="n-scroll">'+backTitle(r.title,'TOWER CONTROL · Detalhes da saída')+
'<div class="n-row" style="flex-wrap:wrap;margin-bottom:13px">'+badge(r.status)+'<span class="n-badge">'+ic('navigation')+' '+r.stops.length+' entregas</span><span class="n-badge blue">'+ic('route')+' '+r.km.toFixed(1)+' km</span></div>'+
(r.status==='planejada'?'<div class="n-panel"><p>Ponto de partida: localização GPS atual do seu celular. Ao iniciar, o roteiro será calculado a partir de onde você estiver.</p>'+btn('Iniciar rota do meu GPS','start-route','primary','play')+'</div>':'')+
'<div class="n-panel"><h3>Mapa inteligente · '+r.stops.length+' paradas</h3><p>Abra o roteiro numerado com visualização das entregas e navegação.</p>'+mapVisual(r.stops)+'<div style="margin-top:12px">'+btn('Abrir mapa da rota','map','primary','map')+'</div></div>'+
(r.status==='em_rota'?'<div class="n-panel"><div class="n-row">'+ic('navigation')+'<div class="n-grow"><h3>Rota em andamento</h3><p>O GPS está ativo enquanto esta rota estiver iniciada (simulado no preview).</p></div></div><div style="margin-top:12px">'+btn('Lançar pedágio / estacionamento / despesa','expense-form','outline','receipt')+'</div><div style="margin-top:10px">'+btn('Finalizar rota','finish-route','yellow','check')+'</div></div>':'')+
'<div class="n-title"><h2>Paradas da rota</h2><span class="n-badge">'+deliver+'/'+r.stops.length+' concluídas</span></div>'+
r.stops.map((x,i)=>stopCard(x,i)).join('')+'</div>';}
function stopCard(x,i){return '<article class="n-panel"><div class="n-row"><span class="n-circle">'+(i+1)+'</span><div class="n-grow"><h3>'+esc(x.client)+'</h3><p>NF-e '+esc(x.nfe)+' · '+x.volumes+' volumes</p></div>'+badge(x.status)+'</div><p>'+ic('pin')+' '+esc(x.address)+'</p><div class="n-actions" style="margin-top:11px">'+btn('Detalhes','stop:'+i,'outline','file')+btn('Navegar','map-stop:'+i,'outline','navigation')+'</div></article>';}
function stopDetail(){
const x=activeStop(),r=activeRoute();return '<div class="n-scroll">'+backTitle('Entrega '+x.sequence+' de '+r.stops.length,'NF-e '+x.nfe)+
'<div class="n-panel"><div class="n-row n-between"><h3>'+esc(x.client)+'</h3>'+badge(x.status)+'</div><p>'+ic('pin')+' '+esc(x.address)+'</p><p>Pedido '+esc(x.order)+' · '+x.volumes+' volumes</p><div class="n-actions">'+btn('Editar endereço','address','outline','pin')+btn('Abrir mapa','map','outline','map')+'</div></div>'+
'<div class="n-panel"><h3>Comprovantes · NF-e '+esc(x.nfe)+'</h3><p>Registrar evidências de entrega. No APK, fotos, assinatura e dados GPS ficam vinculados à nota.</p>'+
'<div class="n-stack">'+btn((s.proofs[x.id+':canhoto']?'Canhoto registrado ✓':'Fotografar canhoto'),'photo:canhoto','outline','scan')+btn((s.proofs[x.id+':fachada']?'Fachada registrada ✓':'Foto da fachada'),'photo:fachada','outline','warehouse')+
btn((s.signatureSaved[x.id]?'Assinatura registrada ✓':'Capturar assinatura'),'signature','outline','clipboard')+
btn('Registrar ocorrência','occurrence','outline','alert')+btn('Vídeo da entrega (simulado)','video-demo','outline','play')+
(x.status==='entregue'?'<span class="n-badge green">Entrega confirmada</span>':btn('Confirmar entrega','confirm-stop','yellow','check'))+'</div></div></div>';}
function routeMap(){
const r=activeRoute(),stops=r.stops;return '<div class="n-scroll">'+backTitle(r.title,'Mapa de paradas · UNION')+
'<div class="n-stats" style="grid-template-columns:repeat(3,1fr)">'+[[''+stops.length,'Entregas','truck'],[r.km.toFixed(1)+' km','Percurso','route'],[''+stops.length,'Localizadas','pin']].map(x=>'<div class="n-stat">'+ic(x[2])+'<strong>'+x[0]+'</strong><small>'+x[1]+'</small></div>').join('')+'</div>'+
'<div class="n-panel"><div class="n-row">'+ic('compass')+'<div><h3>Bússola indisponível</h3><p>Orientação depende dos sensores do celular.</p></div></div></div>'+
'<div class="n-panel" style="padding:10px">'+mapVisual(stops)+'</div>'+
btn('Abrir roteiro no Maps ou Waze','external-map','primary','navigation')+
'<div style="height:12px"></div>'+stops.map((x,i)=>'<div class="n-card"><div class="n-row"><span class="n-circle">'+(i+1)+'</span><div class="n-grow"><h4>Entrega '+(i+1)+' de '+stops.length+'</h4><p>NF-e '+x.nfe+'</p></div>'+badge(x.status)+'</div><p>'+esc(x.client)+' · '+esc(x.address)+'</p><div class="n-actions">'+btn('Navegar','external-map','outline','navigation')+btn('Abrir entrega','stop:'+i,'outline','file')+'</div></div>').join('')+'</div>';}
function expense(){return '<div class="n-scroll">'+backTitle('Despesas da rota','Pedágio, estacionamento e outras despesas')+
'<div class="n-panel"><h3>Rota '+esc(activeRoute().id)+'</h3><p>Despesas de exemplo acumuladas</p><div class="n-big-number" style="color:#ffd52a">'+brl(s.expenseTotal)+'</div></div>'+
'<div class="n-panel"><h3>Lançar despesa fictícia</h3><div class="n-stack" style="margin-top:13px"><label class="n-field">Tipo de despesa<select id="expense-type"><option>Pedágio</option><option>Estacionamento</option><option>Combustível</option><option>Outros</option></select></label>'+
field('Valor (R$)','expense-value','22,50','number','','min="0" step="0.01"')+
btn('Registrar despesa','expense-save','primary','receipt')+'</div></div>'+
'<div class="n-panel"><h3>Despesas simuladas</h3><p>Pedágio · 18/10/2026 · R$ 22,50</p><p>Estacionamento · 18/10/2026 · R$ 15,00</p></div></div>';}
function photo(){
const x=activeStop(),kind=s.selectedProof,labels={canhoto:'Canhoto / comprovante',fachada:'Foto da fachada',ocorrencia:'Foto da ocorrência'};
return '<div class="n-scroll">'+backTitle(labels[kind]||'Comprovante','NF-e '+x.nfe+' · registro demonstrativo')+
'<div class="n-panel"><h3>'+esc(labels[kind])+'</h3><p>No Android, a câmera registra evidências com hora, GPS e a marca Union.</p>'+
'<div style="border-radius:13px;overflow:hidden;margin:12px 0;background:#111a29;border:1px solid #48587a">'+
'<div style="min-height:194px;background:linear-gradient(145deg,#253b50,#111b33);display:grid;place-items:center">'+ic(kind==='fachada'?'warehouse':kind==='canhoto'?'file':'alert')+'</div>'+
'<div style="padding:10px;background:#0a1121"><img src="assets/union_brand.png" alt="Union" style="width:98px;height:27px;object-fit:contain"><div class="n-minor" style="margin-top:5px;color:#d9e0ff">NF-e '+esc(x.nfe)+' · Motorista Demonstrativo</div><div class="n-minor n-muted">'+esc(new Date().toLocaleString('pt-BR'))+' · GPS SIMULADO · Cidade Demo / SP</div></div></div>'+
btn('Simular captura de foto','photo-save','yellow','check')+'<p class="n-note" style="margin-top:9px">Imagem ilustrativa, sem câmera real nem localização do usuário.</p></div></div>';}
function signature(){const x=activeStop();return '<div class="n-scroll">'+backTitle('Assinatura do recebedor','NF-e '+x.nfe)+
'<div class="n-panel"><h3>Assinatura digital</h3><p>Assine com o mouse ou o dedo nesta área de demonstração.</p><canvas id="signature-canvas" width="326" height="198" style="width:100%;height:198px;background:#eaf0f5;border-radius:12px;touch-action:none"></canvas><div class="n-actions" style="margin-top:12px">'+btn('Limpar','signature-clear','outline','refresh')+btn('Salvar assinatura','signature-save','primary','check')+'</div></div></div>';}
function occurrence(){
const x=activeStop(),reasons=['Canhoto retido','Loja fechada','Endereço incorreto','Recusa de recebimento'];
return '<div class="n-scroll">'+backTitle('Registrar ocorrência','NF-e '+x.nfe)+
'<div class="n-panel"><h3>Justificativa obrigatória</h3><div class="n-stack" style="margin:12px 0">'+reasons.map(r=>'<label class="n-row" style="font-size:12px"><input type="radio" class="n-radio" name="reason" value="'+esc(r)+'" '+(s.occurrenceReason===r?'checked':'')+'>'+esc(r)+'</label>').join('')+'</div>'+textarea('Detalhes adicionais (opcional)','occurrence-extra','Descreva o ocorrido...')+
'<h3 style="margin:16px 0 10px">Fotografia obrigatória da ocorrência</h3><div class="n-note">Registro com marca Union, GPS e horário, simulados.</div>'+
btn(s.occurrencePhoto?'Foto de demonstração ✓':'Simular foto da ocorrência','occurrence-photo','outline','scan')+(s.occurrencePhoto?'<div class="n-panel" style="margin-top:9px"><img src="assets/union_brand.png" alt="Union" style="width:92px;height:30px;object-fit:contain"><div class="n-minor">FOTO DA OCORRÊNCIA · ENTREGA</div><p class="n-note">'+esc(new Date().toLocaleString('pt-BR'))+' · GPS FICTÍCIO · NF-e '+esc(x.nfe)+'</p></div>':'')+
'<div style="height:10px"></div>'+btn('Salvar ocorrência','occurrence-save','yellow','check')+'</div></div>';}
function address(){const x=activeStop();return '<div class="n-scroll">'+backTitle('Editar endereço de entrega','NF-e '+x.nfe)+
'<div class="n-panel"><h3>Destinatário</h3><div class="n-stack" style="margin-top:12px">'+field('Endereço de entrega','delivery-address',esc(x.address),'text',x.address)+
textarea('Observação de entrega','delivery-note','Referência do endereço...')+
btn('Salvar endereço fictício','address-save','primary','check')+'</div></div></div>';}
function updates(){return '<div class="n-scroll">'+backTitle('Atualização do aplicativo','UNION Agregados · Versão demonstrativa')+
'<div class="n-panel"><div class="n-row">'+ic('refresh')+'<div class="n-grow"><h3>Você está na versão demonstrativa</h3><p>Uma nova versão é disponibilizada pelo administrador no aplicativo real.</p></div></div><p>Aqui nenhuma versão é instalada, pois este é um navegador e não o Android Package Manager.</p>'+btn('Verificar atualização','update-check','outline','refresh')+'</div></div>';}
function screenBody(){
 if(s.page==='login')return loginPage();
 if(s.page==='register')return registerPage();
 if(s.page==='forgot')return forgotPage();
 if(s.page==='approval')return approvalPage();
 if(s.page==='home')return home();
 if(s.page==='routes')return routes();
 if(s.page==='history')return history();
 if(s.page==='profile')return profile();
 if(s.page==='new')return newRoute();
 if(s.page==='review')return reviewRoute();
 if(s.page==='detail')return routeDetail();
 if(s.page==='stop')return stopDetail();
 if(s.page==='map')return routeMap();
 if(s.page==='expenses')return expense();
 if(s.page==='photo')return photo();
 if(s.page==='signature')return signature();
 if(s.page==='occurrence')return occurrence();
 if(s.page==='address')return address();
 if(s.page==='updates')return updates();
 return home();
}
function drawer(){return '<div class="n-drawer-bg" id="drawer-backdrop"><aside class="n-drawer">'+logo+'<p>TOWER CONTROL • AGREGADOS</p><div class="n-divider"></div><strong>Olá, Motorista</strong>'+
[['home','home','Início'],['routes','route','Minhas rotas'],['history','clock','Histórico de corridas'],['new','plus','Nova rota'],['expenses','receipt','Despesas'],['profile','user','Perfil'],['updates','refresh','Verificar atualização'],['logout','close','Sair da conta']].map(x=>'<button class="n-drawer-action" data-go="'+x[0]+'">'+ic(x[1])+x[2]+'</button>').join('')+
'<div class="n-note" style="margin-top:auto">UNION Agregados · Versão demo</div></aside></div>';}
function modal(){
const name=s.modal;
const messages={notifications:['Notificações','As notificações de novas entregas aparecerão aqui em uma atualização futura.'],expenseNotice:['Despesas da rota','Para lançar pedágio, estacionamento ou outras despesas, abra uma rota ativa em Minhas rotas.'],externalMap:['Navegação externa · Demo','Google Maps e Waze só são abertos no aplicativo real. Este preview não envia localizações para serviços externos.'],updateCheck:['Verificar atualização','Seu aplicativo demonstrativo já está na versão mais recente.'],confirm:['Confirmar entrega','Para confirmar uma entrega no APK, registre as evidências da NF-e. Aqui a confirmação é simulada.'],finish:['Finalizar rota','Finalizar uma saída após conferir todos os volumes e comprovantes vinculados à rota.']};
const data=messages[name]||['Aviso do aplicativo','Operação disponível apenas no Android real.'];
return '<div class="n-modal-bg" data-act="close-modal"><div class="n-modal" role="dialog" aria-modal="true" aria-label="'+esc(data[0])+'"><h3>'+esc(data[0])+'</h3><p>'+esc(data[1])+'</p><div class="n-actions" style="margin-top:16px">'+btn('Fechar','close-modal','outline')+(name==='expenseNotice'?btn('Minhas rotas','go-routes','primary','route'):'')+'</div></div></div>';}
function render(){
 const isWhite=['login','register','forgot','approval'].includes(s.page);
 phone.classList.toggle('login-mode',isWhite);
 document.querySelector('.android-status')?.classList.toggle('white',isWhite);
 document.querySelector('.android-gesture')?.classList.toggle('white',isWhite);
 const headerShown=s.authenticated&&['home','routes','history','profile'].includes(s.page);
 root.innerHTML='<div class="n-page '+(isWhite?'n-login':'')+'">'+(headerShown?header():'')+screenBody()+(s.authenticated&&!isWhite?bottom():'')+
 (s.drawer?drawer():'')+(s.modal?modal():'')+(s.notice?'<div class="n-toast" role="status">'+esc(s.notice)+'</div>':'')+'</div>';
 if(s.page==='signature')initSignature();
 initLeafletPreview();
}
function initSignature(){
 const canvas=document.getElementById('signature-canvas');if(!canvas)return;
 const ctx=canvas.getContext('2d');ctx.strokeStyle='#251a52';ctx.lineWidth=3;ctx.lineCap='round';ctx.lineJoin='round';let drawing=false;
 const getPos=e=>{const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height};};
 canvas.onpointerdown=e=>{drawing=true;canvas.setPointerCapture(e.pointerId);const p=getPos(e);ctx.beginPath();ctx.moveTo(p.x,p.y);};
 canvas.onpointermove=e=>{if(!drawing)return;const p=getPos(e);ctx.lineTo(p.x,p.y);ctx.stroke();};
 canvas.onpointerup=()=>drawing=false;canvas.onpointercancel=()=>drawing=false;
}
function persistFields(){
 const n=document.getElementById('new-route-name');if(n)s.routeName=n.value;
 s.manifests.forEach((x,i)=>{const el=document.getElementById('manifest-'+i),branch=document.getElementById('branch-'+i);if(el)x.number=el.value;if(branch)x.branch=branch.value;});
 const m=document.getElementById('manual-keys');if(m)s.keys=m.value;
}
function handleAction(action){
 if(action==='drawer'){s.drawer=true;render();return;}
 if(action==='notifications'){s.modal='notifications';render();return;}
 if(action==='close-modal'){s.modal='';render();return;}
 if(action==='show-password'){s.showPw=!s.showPw;render();return;}
 if(action==='logout'){s=seed();render();return;}
 if(action==='back'){const page=s.page;if(['map','stop','expenses'].includes(page))go('detail');else if(['photo','occurrence','signature','address'].includes(page))go('stop');else if(page==='detail')go('routes');else if(page==='review')go('new');else if(['new','history','routes','profile','updates'].includes(page))go('home');else go('login');return;}
 if(action==='refresh'){popup('Atualizado localmente · dados apenas de demonstração.');return;}
 if(action==='new'){go('new');return;}
 if(action==='login'){go('login');return;}
 if(action==='notifications'){s.modal='notifications';render();return;}
 if(action==='updates'){go('updates');return;}
 if(action==='go-routes'){go('routes');return;}
 if(action==='external-map'){s.modal='externalMap';render();return;}
 if(action==='expense-form'){go('expenses');return;}
 if(action==='start-route'){activeRoute().status='em_rota';s.routeStarted=true;popup('Rota iniciada de GPS fictício — nenhum tracking real.');return;}
 if(action==='finish-route'){const r=activeRoute();if(r.stops.some(x=>!['entregue','nao_entregue'].includes(x.status))){popup('Conclua as entregas ou registre ocorrências nas paradas pendentes.');return;}r.status='finalizada';r.finishedAt='19/10/2026 às 09:41';go('history');return;}
 if(action==='confirm-stop'){const x=activeStop();if(!s.proofs[x.id+':canhoto']&&!s.signatureSaved[x.id]){popup('Registre um canhoto ou assinatura fictícia antes de confirmar.');return;}x.status='entregue';go('detail');popup('Entrega fictícia confirmada.');return;}
 if(action==='photo-save'){const x=activeStop();s.proofs[x.id+':'+s.selectedProof]=true;go('stop');popup('Evidência ilustrativa registrada apenas no navegador.');return;}
 if(action==='signature-clear'){initSignature();const el=document.getElementById('signature-canvas');el?.getContext('2d')?.clearRect(0,0,el.width,el.height);return;}
 if(action==='signature-save'){s.signatureSaved[activeStop().id]=true;go('stop');popup('Assinatura demonstrativa registrada.');return;}
 if(action==='video-demo'){popup('Vídeo ilustrativo. Nenhum arquivo de câmera ou galeria é acessado.');return;}
 if(action==='occurrence-photo'){s.occurrencePhoto=true;popup('Foto simulada adicionada — sem câmera real.');return;}
 if(action==='occurrence-save'){if(!s.occurrencePhoto){popup('É necessária uma foto fictícia da ocorrência.');return;}activeStop().status='nao_entregue';s.occurrencePhoto=false;go('detail');popup('Ocorrência fictícia registrada.');return;}
 if(action==='address-save'){activeStop().address=document.getElementById('delivery-address')?.value||activeStop().address;go('stop');popup('Endereço alterado somente na demonstração.');return;}
 if(action==='expense-save'){const value=Math.max(0,Number(document.getElementById('expense-value')?.value)||0);s.expenseTotal+=value;popup('Despesa fictícia registrada: '+brl(value));return;}
 if(action==='reg-submit'){go('approval');return;}
 if(action==='demo-cnh'||action==='demo-face'){s.regPhotos[action==='demo-cnh'?'cnh':'face']=true;popup('Captura de exemplo concluída. Não use documentos reais.');return;}
 if(action==='forgot-code'){popup('Código de demonstração: 123456 (não enviado por e-mail).');return;}
 if(action==='forgot-save'){go('login');popup('Senha fictícia atualizada apenas nesta sessão.');return;}
 if(action==='update-check'){s.modal='updateCheck';render();return;}
 if(action==='history-more'){s.historyLimit+=2;popup('Histórico fictício atualizado.');return;}
 if(action==='add-manifest'){persistFields();if(s.manifests.length<10)s.manifests.push({id:s.manifests.length+1,number:'',branch:'Ruby Rose SP'});render();return;}
 if(action==='review-route'){persistFields();const okay=s.routeMode==='romaneios'?s.manifests.some(x=>x.number.trim()):s.keys.split(/\s+/).some(x=>/^\d{44}$/.test(x));if(!okay){popup('Informe romaneio ou chave NF-e fictícios antes da revisão.');return;}go('review');return;}
 if(action==='create-route'){persistFields();const manifest=s.manifests.filter(x=>x.number.trim()).map(x=>x.number.trim());const keys=s.keys.split(/\s+/).filter(x=>/^\d{44}$/.test(x));if(s.routeMode==='romaneios'&&!manifest.length){popup('Informe ao menos um número de romaneio fictício.');return;}if(s.routeMode==='chaves'&&!keys.length){popup('Informe uma chave fictícia de 44 dígitos.');return;}const id='DEMO-ROTA-'+String(s.routes.length+102).padStart(3,'0');s.routes.unshift({id,title:s.routeName||'Nova Rota Fictícia',status:'planejada',km:35.8,realKm:0,delivered:0,manifest:manifest[0]||'NFE-DEMO',stops:seedStops().slice(1,4).map((x,i)=>({...x,id:'CREATED-'+i,sequence:i+1,status:'pendente'}))});s.selected=id;go('detail');popup('Rota de demonstração criada sem chamar a API.');return;}
 if(action.startsWith('route:')){s.selected=action.slice(6);go('detail');return;}
 if(action.startsWith('stop:')){s.stopIndex=Number(action.slice(5))||0;go('stop');return;}
 if(action.startsWith('map-stop:')){s.stopIndex=Number(action.slice(9))||0;go('map');return;}
 if(action.startsWith('photo:')){s.selectedProof=action.slice(6);go('photo');return;}
 const destinations={map:'map',signature:'signature',occurrence:'occurrence',address:'address',expenses:'expenses',profile:'profile',home:'home',routes:'routes',history:'history',new:'new',forgot:'forgot',register:'register',approval:'approval'};
 if(destinations[action]){go(destinations[action]);return;}
 s.modal='notification';render();
}
document.addEventListener('click',e=>{
 const quick=e.target.closest('[data-quick]');if(quick){const p=quick.dataset.quick;if(p!=='login'&&!s.authenticated)s.authenticated=true;if(['detail','map','stop','photo','occurrence','signature','address','expenses'].includes(p))s.selected='DEMO-ROTA-001';go(p);return;}
 const mode=e.target.closest('[data-mode]');if(mode){persistFields();s.routeMode=mode.dataset.mode;render();return;}
 const remove=e.target.closest('[data-remove-manifest]');if(remove){persistFields();s.manifests.splice(Number(remove.dataset.removeManifest),1);render();return;}
 const route=e.target.closest('[data-route]');if(route){s.selected=route.dataset.route;go('detail');return;}
 const stop=e.target.closest('[data-stop]');if(stop){s.stopIndex=Number(stop.dataset.stop)||0;go('stop');return;}
 const nav=e.target.closest('[data-go]');if(nav){const p=nav.dataset.go;if(p==='expenses'&&!['detail','stop'].includes(s.page)){s.modal='expenseNotice';render();return;}handleAction(p);return;}
 const act=e.target.closest('[data-act]');if(act){if(act.dataset.act==='close-modal'&&e.target.closest('.n-modal')&&!e.target.closest('button'))return;handleAction(act.dataset.act);return;}
 if(e.target.id==='drawer-backdrop'){s.drawer=false;render();}
});
document.addEventListener('submit',e=>{if(e.target.id==='login-form'){e.preventDefault();login();}});
document.addEventListener('change',e=>{if(e.target.name==='reason')s.occurrenceReason=e.target.value;});
document.addEventListener('input',e=>{
 if(e.target.id==='route-search'){s.search=e.target.value;const pos=e.target.selectionStart;render();const next=document.getElementById('route-search');if(next){next.focus();next.setSelectionRange(pos,pos);}}
 if(e.target.id==='history-search'){s.historySearch=e.target.value;const pos=e.target.selectionStart;render();const next=document.getElementById('history-search');if(next){next.focus();next.setSelectionRange(pos,pos);}}
});
document.getElementById('reset').addEventListener('click',()=>{s=seed();render();});
document.getElementById('demo-login').addEventListener('click',()=>login());
document.getElementById('fullscreen').addEventListener('click',()=>{const el=document.querySelector('.preview');if(document.fullscreenElement)document.exitFullscreen?.();else el.requestFullscreen?.();});
const quick=[['login','Login'],['register','Cadastro'],['forgot','Recuperação'],['approval','Em aprovação'],['home','Início'],['routes','Minhas rotas'],['new','Nova rota'],['detail','Detalhe da rota'],['map','Mapa'],['stop','Entrega'],['photo','Comprovante'],['signature','Assinatura'],['occurrence','Ocorrência'],['expenses','Despesas'],['history','Histórico'],['profile','Perfil'],['updates','Atualização']];
document.getElementById('quick-sections').innerHTML=quick.map(x=>'<button type="button" data-quick="'+x[0]+'">'+x[1]+'</button>').join('');
const initialScreen=new URL(location.href).searchParams.get('screen');
if(initialScreen&&quick.some(x=>x[0]===initialScreen)){s.page=initialScreen;s.authenticated=!['login','register','forgot','approval'].includes(initialScreen);if(['detail','stop','map','photo','occurrence','signature','address','expenses'].includes(initialScreen))s.selected='DEMO-ROTA-001';}
render();