'use strict';
const root=document.getElementById('root');
const stages=['Planejada','Liberada','Aguardando impressão','Em separação','Conferência','Concluída'];
const base=[
 ['ONDA-DEMO-001','E-commerce',48,430,'Em separação',69],
 ['ONDA-DEMO-002','Atacado',18,845,'Aguardando impressão',0],
 ['ONDA-DEMO-003','Marketplace',67,302,'Liberada',0],
 ['ONDA-DEMO-004','Varejo',32,282,'Conferência',94],
 ['ONDA-DEMO-005','E-commerce',52,410,'Concluída',100],
 ['ONDA-DEMO-006','Atacado',26,630,'Planejada',0]
].map(v=>({id:v[0],canal:v[1],pedidos:v[2],unidades:v[3],status:v[4],progress:v[5]}));
const s={items:base.map(v=>({...v})),view:'dashboard',theme:'dark',step:'Todas',search:''};
const nav=[['dashboard','Visão operacional'],['ondas','Gestão de ondas'],['performance','Produtividade'],['processos','Livro de processos']];
const num=v=>new Intl.NumberFormat('pt-BR').format(v);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sum=(a,k)=>a.reduce((z,x)=>z+x[k],0);
function tag(x){return '<span class="badge '+(x==='Concluída'?'done':x==='Planejada'?'warn':'')+'">'+esc(x)+'</span>'}
function bars(){
 const groups=[...new Set(s.items.map(x=>x.canal))].map(name=>({name,value:sum(s.items.filter(x=>x.canal===name),'pedidos')}));
 const max=Math.max(1,...groups.map(x=>x.value));
 return '<div class="columns"><section class="card"><div class="cardhead"><div><h2>Pedidos por canal</h2><p>Distribuição da carga de trabalho</p></div></div><div class="cardbody bars">'+groups.map(x=>'<div class="bar"><span>'+esc(x.name)+'</span><div class="track"><div class="fill" style="width:'+(100*x.value/max)+'%"></div></div><b>'+num(x.value)+'</b></div>').join('')+'</div></section><section class="card"><div class="cardhead"><div><h2>Etapas operacionais</h2><p>Status de processamento das ondas</p></div></div><div class="cardbody">'+stages.map(x=>'<div class="stage"><span>'+x+'</span><strong>'+s.items.filter(y=>y.status===x).length+'</strong></div>').join('')+'</div></section></div>';
}
function process(){return '<div class="process"><article><span>ETAPA 01</span><h3>Planejamento</h3><p>Consolidar pedidos por canal, prioridade e volumetria, definindo as ondas de separação.</p></article><article><span>ETAPA 02</span><h3>Execução</h3><p>Imprimir, liberar as ondas e acompanhar a produtividade por etapa.</p></article><article><span>ETAPA 03</span><h3>Conferência</h3><p>Validar divergências e concluir a expedição após conferência física.</p></article></div>'}
function table(){
 const items=s.items.filter(x=>(s.step==='Todas'||s.step===x.status)&&(x.id+' '+x.canal).toLowerCase().includes(s.search.toLowerCase()));
 return '<section class="card"><div class="cardhead"><div><h2>Fila operacional de ondas</h2><p>Simulação navegável de progressão por etapa</p></div><span>'+items.length+' registros</span></div><div class="filters"><label class="field">ETAPA<select id="stage">'+['Todas',...stages].map(x=>'<option '+(x===s.step?'selected':'')+'>'+x+'</option>').join('')+'</select></label><label class="field search">PESQUISAR<input id="search" value="'+esc(s.search)+'" placeholder="Código ou canal de operação"></label></div><div class="tablewrap"><table class="table"><thead><tr><th>Onda</th><th>Canal</th><th>Pedidos</th><th>Unidades</th><th>Status</th><th>Progresso</th><th>Ação</th></tr></thead><tbody>'+
 items.map(x=>'<tr><td><strong>'+esc(x.id)+'</strong></td><td>'+esc(x.canal)+'</td><td>'+num(x.pedidos)+'</td><td>'+num(x.unidades)+'</td><td>'+tag(x.status)+'</td><td><div class="progress"><span style="width:'+x.progress+'%"></span></div></td><td><button class="action" data-advance="'+esc(x.id)+'" '+(x.status==='Concluída'?'disabled':'')+'>Avançar →</button></td></tr>').join('')+
 (!items.length?'<tr><td colspan="7">Nenhuma onda corresponde aos filtros.</td></tr>':'')+'</tbody></table></div><div class="foot">Dados locais de demonstração · sem alteração de banco ou operação real</div></section>';
}
function render(){
 const view=nav.find(x=>x[0]===s.view)?.[1]||'Visão operacional';
 const metrics=[['Ondas monitoradas',s.items.length],['Pedidos agrupados',sum(s.items,'pedidos')],['Unidades de item',sum(s.items,'unidades')],['Ondas em andamento',s.items.filter(x=>!['Planejada','Concluída'].includes(x.status)).length]];
 root.innerHTML='<div class="app '+(s.theme==='light'?'light':'')+'"><aside class="rail"><div class="identity"><span class="symbol">W</span><div><b>WAVE <span>CONTROL</span></b><small>FULFILLMENT PLATFORM</small></div></div><div class="railcaption">WORKSPACE</div><nav aria-label="Módulos">'+nav.map(x=>'<button data-nav="'+x[0]+'" class="'+(s.view===x[0]?'current':'')+'">'+x[1]+'</button>').join('')+'</nav><div class="railfoot"><strong>ENGINEERING SANDBOX</strong>Dados fictícios sem conexão com a operação.<p><a href="../">← Portfólio</a></p><p><a href="https://github.com/Ronilima1810/ondas">Código Next.js ↗</a></p></div></aside><div class="shell"><header class="topbar"><div class="crumb">OPERAÇÃO / <strong>'+view+'</strong></div><div class="topright"><span class="environment">● AMBIENTE DEMO</span><button class="round" data-act="theme" aria-label="Alternar tema">'+(s.theme==='dark'?'☼':'☾')+'</button><a class="round" style="display:grid;place-items:center" href="../" aria-label="Voltar ao portfólio">↗</a></div></header><main class="work"><div class="head"><div><div class="overline">ENGINEERING / WAREHOUSE EXECUTION</div><h1>'+view+'</h1><p>Gestão de ondas, volumetria, separação e conferência de pedidos.</p></div><div class="buttons"><button class="btn" data-act="reset">Restaurar demo</button><button class="btn primary" data-act="export">Exportar CSV ↓</button></div></div><div class="callout"><strong>DEMONSTRAÇÃO INDEPENDENTE.</strong> Mudanças ficam nesta sessão e não acessam qualquer backend de produção.</div>'+
 (s.view==='processos'?process():'<div class="kpis">'+metrics.map(x=>'<article class="kpi"><small>'+x[0]+'</small><strong>'+num(x[1])+'</strong><span>Ambiente demonstrativo</span></article>').join('')+'</div>'+(s.view==='ondas'?'':bars())+table())+
 '</main><footer class="footer">WAVE CONTROL · NEXT.JS / TYPESCRIPT · PORTFÓLIO TÉCNICO</footer></div></div>';
}
function csv(){
 const rows=[['Onda','Canal','Pedidos','Unidades','Status','Progresso'],...s.items.map(x=>[x.id,x.canal,x.pedidos,x.unidades,x.status,x.progress+'%'])];
 const content='\uFEFF'+rows.map(r=>r.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(';')).join('\r\n');
 const url=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8'}));
 const link=document.createElement('a');link.href=url;link.download='ondas_ficticias.csv';link.click();URL.revokeObjectURL(url);
}
function toast(m){const d=document.createElement('div');d.className='toast';d.setAttribute('role','status');d.textContent=m;document.body.appendChild(d);setTimeout(()=>d.remove(),2100)}
document.addEventListener('click',e=>{
 const n=e.target.closest('[data-nav]');if(n){s.view=n.dataset.nav;render();return}
 const a=e.target.closest('[data-act]');if(a){if(a.dataset.act==='theme')s.theme=s.theme==='dark'?'light':'dark';if(a.dataset.act==='reset'){s.items=base.map(x=>({...x}));s.step='Todas';s.search='';toast('Dados de demonstração restaurados.')}if(a.dataset.act==='export'){csv();return}render();return}
 const b=e.target.closest('[data-advance]');if(b){const x=s.items.find(x=>x.id===b.dataset.advance);if(!x)return;const i=stages.indexOf(x.status);if(i<0||i===stages.length-1)return;x.status=stages[i+1];x.progress=[0,0,0,45,90,100][i+1];toast(x.id+' → '+x.status);render()}
});
document.addEventListener('change',e=>{if(e.target.id==='stage'){s.step=e.target.value;render()}});
document.addEventListener('input',e=>{if(e.target.id==='search'){const pos=e.target.selectionStart;s.search=e.target.value;render();const f=document.getElementById('search');if(f){f.focus();f.setSelectionRange(pos,pos)}}});
render();