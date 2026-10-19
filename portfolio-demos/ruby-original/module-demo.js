'use strict';
/* UI de demonstração isolada: módulos originais da VPS, somente registros inventados. */
const root=document.getElementById('demo-module-root');
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const brl=x=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(x);
const fmt=x=>new Intl.NumberFormat('pt-BR').format(x);
const query=new URL(location.href).searchParams;
const source=query.get('source')||'/ruby/'+(query.get('module')||'inventario')+'/';
const src=new URL(source,'https://demo.invalid');
const parts=src.pathname.split('/').filter(Boolean);
const key=parts[1]||'inventario';
const sub=parts[2]||'';
const hashed=new URLSearchParams(src.hash.substring(1));
const groups={
 inventario:['Painel de Inventário','Conferência de estoque, divergências por endereço e fechamento de contagem','Resumo|resumo','Executivo|executivo','Contagens finalizadas|balancos','Aguardando processamento|pendentes','Desempenho por hora|desempenho','Por endereço|enderecos','Resultado real × ERP|referencia','Conferência do ciclo|conferencia','Fila de contagem|fila','Fechamento|fechamento','Por produto|produtos','Perdas e sobras|divergencias','Acertos no ERP|acertos','Trilha|trilha','Monitor consumo|monitor','Dev log|devlog'],
 torre:['Torre de Pedidos','Separação, faturamento, status, volumetria e produtividade do WMS','Pedidos por etapa|pedidos','Produtividade do WMS|produtividade','Ocorrências|ocorrencias','Funil operacional|funil'],
 transporte:['Custos de Transporte','Auditoria de frete e despesas por romaneio e transportadora','Visão operacional|visao','Fornecedores|fornecedores'],
 central_financeira:['Central Financeira','Conferência de NF-es, agregados, contas a pagar e consolidado por saída','Visão geral|inicio','NF-es para conferência|notas','Agregados|agregados','Contas a pagar|pagar','Consolidado por dia|consolidado'],
 agregados:['Gestão de agregados','Operação de última milha, rotas, comprovantes, rastreamento e negociação','Visão geral|visao','Cadastros|cadastro','Operação ao vivo|rotas','Montar e atribuir rota|atribuicao','Rastreamento GPS|tracking','Canhotos NF-e|canhotos','Ocorrências|ocorrencias','Financeiro por saída|financeiro','Negociação por agregado|negociacao','Análise dos agregados|analise'],
 checkin:['Check-in de Entrada','Recebimento de produtos, conferência documental e liberação de armazenagem','Fila de entrada|fila','Não conformidades|avisos','Armazenagem|armazenagem','Configurações|config'],
 compras:['Compras Futura','Planejamento de compra, estoque, aprovações e análise comercial','Início|inicio','Estoque|estoque','Pedidos de compra|pedidos','Aprovações|aprovacoes','Pendências|pendencias','Fora de linha|fora','Preços|precos','Devoluções|devolucoes','Fiscal|fiscal','Consolidado|consolidado','Indicadores|indicadores','Verba|verba','Matriz|matriz','Fila|fila','Processos|processos'],
 danfe_mg:['DANFE Simplificada · MG','Etiquetas por chave da NF-e, romaneio e histórico de impressões','Chave NF-e|chave','Por romaneio|romaneio','Histórico|historico'],
 admin:['Administração','Usuários, acessos, equipes e governança da plataforma','Visão geral|inicio','Usuários|usuarios','Acessos|acessos','Equipes|equipes','Novo acesso|novo','Configurações|configuracoes'],
 conta:['Minha Conta','Perfil demonstrativo e permissões de acesso','Perfil de acesso|perfil','Alterar senha|senha','Acessos efetivos|permissoes'],
 about:['About · Ruby Tower Control','Livro de processos, tecnologias, política de segurança e autoria','Visão geral|geral','Livro de processos|processos','Tecnologias|tecnologias','Segurança|seguranca','Criadores|criadores']
};
const spec=groups[key]||groups.about;
const tabs=spec.slice(2).map(x=>{const a=x.split('|');return {name:a[0],id:a[1]}});
const tabRequest=src.searchParams.get('v')||src.searchParams.get('aba')||hashed.get('painel')||hashed.get('aba')||({'usuarios.php':'usuarios','acessos.php':'acessos','equipes.php':'equipes','novo_usuario.php':'novo','configuracoes.php':'configuracoes'}[sub]||sub);
const defaults=tabRequest&&tabs.some(x=>x.id===tabRequest)?tabRequest:tabs[0].id;
const state={tab:defaults,search:'',filter:'Todos',sort:false,iterations:0,printed:0};
const cols={
 inventario:['Produto','Endereço','Saldo ERP','Contagem','Divergência','Status'],
 torre:['Pedido','Cliente','Unidades','Liberação','Operação','Status'],
 transporte:['Romaneio','Transportadora','UF','Volumes','Frete','Status'],
 central_financeira:['Documento','Parceiro','NF-e','Valor','Frete','Status'],
 agregados:['Saída','Motorista','Placa','NF-e','KM','Status'],
 checkin:['Entrada','Fornecedor','SKU','Esperado','Recebido','Status'],
 compras:['Pedido compra','SKU','Fornecedor','Itens','Valor','Status'],
 danfe_mg:['NF-e','Série','Destinatário','Romaneio','Volumes','Status'],
 admin:['Usuário','Perfil','Equipe','Permissões','Último acesso','Status'],
 conta:['Módulo','Permissão','Escopo','Perfil','Autorização','Status'],
 about:['Processo','Área','Equipe','Versão','Etapas','Status']
};
const kpis={
 inventario:[['Produtos contados','1.284'],['Endereços conferidos','418'],['Em apuração','32'],['Resultado líquido',brl(18620.45)]],
 torre:[['Pedidos liberados','148'],['Aguardando impressão','36'],['Separados','84'],['Expedidos','62']],
 transporte:[['Fretes auditados','236'],['Frete total',brl(28450.92)],['Eficiência','3,18%'],['Divergências','7']],
 central_financeira:[['NF-es para conferir','96'],['Faturamento',brl(317840)],['A pagar',brl(14920.65)],['Saídas aprovadas','42']],
 agregados:[['Agregados cadastrados','24'],['Rotas em andamento','8'],['Entregas concluídas','63'],['Ocorrências abertas','3']],
 checkin:[['Entradas previstas','38'],['Na doca','12'],['Conferidos','24'],['Não conformes','2']],
 compras:[['SKUs em estoque','4.218'],['Pedidos compra','27'],['Aprovações pendentes','5'],['Valor previsto',brl(72840)]],
 danfe_mg:[['NF-es disponíveis','18'],['Etiquetas previstas','62'],['Volumes conferidos','51'],['Impressões demonstrativas','0']],
 admin:[['Usuários fictícios','12'],['Ativos','10'],['Bloqueados','2'],['Equipes','4']],
 conta:[['Módulos','12'],['Perfil','Admin demo'],['Segurança','Simulada'],['Sessão','Somente navegador']],
 about:[['Plataforma','Ruby'],['Backend','PHP / Node'],['Frontend','React'],['Ambiente','Demo']]
};
const status=['Concluído','Em andamento','Aguardando','Concluído','Em análise','Pendente','Concluído','Em andamento','Aguardando','Concluído','Em análise','Pendente'];
function record(i){
 const n=i+1,id=String(n).padStart(3,'0'),st=status[i];
 const table={
  inventario:['SKU-DEMO-'+id,'RUA A-'+id,100+i*7,101+i*6,1-i,st],
  torre:['PED-DEMO-'+id,'Cliente Exemplo '+id,10+i*3,'19/10/2026','Separação',st],
  transporte:['ROM-DEMO-'+id,'Transporte Exemplo '+(i%3+1),['SP','MG','PE','PR'][i%4],8+i*2,brl(160+i*39),st],
  central_financeira:['NF-DEMO-'+id,'Parceiro Demo '+(i%4+1),'NF-DEMO-'+id,brl(1120+i*75),brl(75+i*9),st],
  agregados:['SAIDA-DEMO-'+id,'Motorista Exemplo '+(i%5+1),'DEMO1A23','NF-DEMO-'+id,65+i*6,st],
  checkin:['REC-DEMO-'+id,'Fornecedor Exemplo '+(i%4+1),'SKU-DEMO-'+id,250+i*20,i%4?250+i*20:190+i*20,st],
  compras:['PC-DEMO-'+id,'SKU-DEMO-'+id,'Fornecedor Exemplo '+(i%4+1),90+i*5,brl(680+i*96),st],
  danfe_mg:['NFE-DEMO-'+id,'001','Cliente Exemplo '+id,'ROM-DEMO-'+id,1+i%6,st],
  admin:['Usuário Demo '+id,i%4?'Operacional':'Admin demo','Equipe Demo '+(i%4+1),(3+i%5)+' módulos','19/10/2026',st],
  conta:['Permissão Demo '+id,['Inventário','Torre','Dashboard','Compras'][i%4],'Visualização','Admin demo','Sistema Demo',st],
  about:['Processo Demo '+id,['Expedição','Inventário','Recebimento','Compras'][i%4],'Equipe Demo '+(i%4+1),'1.0',3+i%5,st]
 };
 return table[key]||table.about;
}
const rows=Array.from({length:12},(_,i)=>record(i));
function extra(){
 if(key==='agregados'&&state.tab==='negociacao')return '<section class="demo-panel"><div class="demo-panel-head"><div><h2>Negociação por saída e KM excedente</h2><p>Somente simulação; não altera pagamentos.</p></div></div><div class="demo-panel-content"><div class="demo-forms"><label class="demo-form-item">Valor por saída (R$)<input type="number" min="0" id="d-base" value="180"></label><label class="demo-form-item">KM percorridos<input type="number" min="0" id="d-km" value="135"></label><label class="demo-form-item">Franquia de KM<input type="number" min="0" id="d-franquia" value="100"></label><label class="demo-form-item">Adicional por KM (R$)<input type="number" min="0" id="d-taxa" value="2"></label><button class="demo-btn main" data-action="calculate">Calcular frete fictício</button></div><p class="demo-note" id="d-result">Exemplo: 135 km × franquia 100 km = R$ 250,00 por saída.</p></div></section>';
 if(key==='danfe_mg'&&state.tab==='chave')return '<section class="demo-panel"><div class="demo-panel-head"><h2>Impressão de etiquetas DANFE</h2></div><div class="demo-panel-content"><div class="demo-forms"><label class="demo-form-item">Chave fictícia (44 dígitos)<input maxlength="44" inputmode="numeric" id="d-chave" placeholder="Digite 44 dígitos de demonstração"></label><label class="demo-form-item">Volumes<input type="number" min="1" max="50" value="3" id="d-volumes"></label><button class="demo-btn main" data-action="etiqueta">Simular etiquetas</button></div></div></section>';
 if(key==='conta'&&state.tab==='senha')return '<section class="demo-panel"><div class="demo-panel-head"><h2>Alteração de senha</h2></div><div class="demo-panel-content"><p>O perfil é demonstrativo. Nenhuma senha real é solicitada nem modificada neste preview.</p></div></section>';
 if(key==='about'&&state.tab==='criadores')return '<section class="demo-panel"><div class="demo-panel-head"><h2>Autoria e desenvolvimento</h2></div><div class="demo-panel-content"><p>Roni e Leandro — criação e desenvolvimento conjuntos da plataforma Ruby Tower Control.</p></div></section>';
 if(key==='about'&&state.tab==='seguranca')return '<section class="demo-panel"><div class="demo-panel-head"><h2>Segurança e LGPD</h2></div><div class="demo-panel-content"><p>O sistema original possui autenticação e segregação de módulos. Esta cópia pública não contém senhas, tokens, bases empresariais ou dados operacionais.</p></div></section>';
 return '';
}
function map(){
 return '<div class="demo-mini-map" aria-label="Mapa esquemático, sem posições reais"><span class="demo-map-pin">ROTA DEMO A</span><span class="demo-map-pin">ROTA DEMO B</span><span class="demo-map-pin">ROTA DEMO C</span></div><p class="demo-note">Mapa ilustrativo. Não mostra motoristas nem geolocalização real.</p>';
}
function show(){
 const tab=tabs.find(x=>x.id===state.tab)?.name||tabs[0].name;
 const filtered=rows.filter(r=>(state.filter==='Todos'||r.at(-1)===state.filter)&&r.join(' ').toLowerCase().includes(state.search.toLowerCase()));
 if(state.sort)filtered.reverse();
 const progress=[['Concluídos',68],['Em andamento',52],['Aguardando',27],['Pendências',12]];
 let html='<section class="demo-head"><div><span class="demo-kicker">'+esc(key.replaceAll('_',' ').toUpperCase())+' · RUBY TOWER CONTROL</span><h1>'+esc(spec[0])+'</h1><p>'+esc(spec[1])+'</p></div><div class="demo-head-tools"><span class="demo-flag">DADOS FICTÍCIOS</span><button class="demo-btn" data-action="reset">Restaurar</button><button class="demo-btn main" data-action="csv">Exportar CSV ↓</button></div></section>';
 html+='<div class="demo-banner"><strong>'+esc(tab)+'</strong> — módulo demonstrativo com estilo original Ruby. Nomes, pedidos, placas, documentos e valores são inventados, sem conexão com banco empresarial.</div>';
 html+='<div class="demo-tabs" role="tablist" aria-label="Abas do módulo">'+tabs.map(x=>'<button class="demo-tab '+(state.tab===x.id?'active':'')+'" data-tab="'+esc(x.id)+'">'+esc(x.name)+'</button>').join('')+'</div>';
 html+='<section class="demo-kpis">'+(kpis[key]||kpis.about).map((x,i)=>'<article class="demo-kpi"><small>'+esc(x[0])+'</small><strong>'+esc(x[0]==='Impressões demonstrativas'?state.printed:x[1])+'</strong><span>'+(i%2?'Visão fictícia':'Indicador de demonstração')+'</span></article>').join('')+'</section>';
 html+=extra();
 html+='<div class="demo-columns"><section class="demo-panel"><div class="demo-panel-head"><div><h2>Distribuição operacional · '+esc(tab)+'</h2><p>Indicadores simulados por etapa</p></div><span class="demo-flag">PREVIEW LOCAL</span></div><div class="demo-panel-content demo-bars">'+progress.map(x=>'<div class="demo-bar"><span>'+x[0]+'</span><div class="demo-track"><div class="demo-fill" style="width:'+Math.min(100,x[1]+state.iterations)+'%"></div></div><strong>'+x[1]+'%</strong></div>').join('')+'</div></section>';
 html+='<section class="demo-panel"><div class="demo-panel-head"><div><h2>'+(key==='agregados'&&state.tab==='tracking'?'Mapa ilustrativo de rotas':'Resumo da operação')+'</h2><p>Visão exclusivamente fictícia</p></div></div>';
 html+=key==='agregados'&&['tracking','rotas'].includes(state.tab)?'<div class="demo-panel-content">'+map()+'</div>':'<div class="demo-panel-content">'+[['Conferidos',84],['Aguardando',28],['Com pendência',5],['Concluídos',69]].map(x=>'<div class="demo-legend"><span>'+x[0]+'</span><strong>'+fmt(x[1]+state.iterations)+'</strong></div>').join('')+'</div>';
 html+='</section></div>';
 html+='<section class="demo-panel"><div class="demo-panel-head"><div><h2>Registros · '+esc(tab)+'</h2><p>Listagem demonstrativa navegável, baseada nas áreas existentes da VPS</p></div><span>'+filtered.length+' registros</span></div>';
 html+='<div class="demo-filters"><label class="demo-search">PESQUISA<input id="d-search" value="'+esc(state.search)+'" placeholder="Buscar código, cliente, documento..."></label><label>STATUS<select id="d-status">'+['Todos','Concluído','Em andamento','Aguardando','Em análise','Pendente'].map(x=>'<option '+(state.filter===x?'selected':'')+'>'+x+'</option>').join('')+'</select></label><button class="demo-btn" data-action="sort">Ordenar '+(state.sort?'↑':'↓')+'</button><button class="demo-btn" data-action="refresh">Atualizar ↻</button></div>';
 html+='<div class="demo-table-scroll"><table class="demo-table"><thead><tr>'+(cols[key]||cols.about).map(x=>'<th>'+esc(x)+'</th>').join('')+'<th>Detalhes</th></tr></thead><tbody>';
 html+=filtered.map((r,i)=>'<tr>'+r.map((value,j)=>'<td>'+(j===r.length-1?'<span class="demo-state '+(['Pendente','Aguardando'].includes(value)?'wait':value==='Em análise'?'fail':'')+'">'+esc(value)+'</span>':esc(value))+'</td>').join('')+'<td><button class="demo-miniaction" data-view="'+esc(r[0])+'">Abrir</button></td></tr>').join('')||'<tr><td colspan="7" class="demo-empty">Nenhum resultado nos filtros aplicados.</td></tr>';
 html+='</tbody></table></div><div class="demo-bottom">'+filtered.length+' registros fictícios · Matriz Demo '+(['SP','MG','PR','PE'][Number(src.searchParams.get('filial')||1)%4]||'SP')+' · dados locais, sem API</div></section>';
 root.innerHTML=html;
}
function toast(message){const el=document.createElement('div');el.className='demo-toast';el.setAttribute('role','status');el.textContent=message;document.body.appendChild(el);setTimeout(()=>el.remove(),2600);}
function exportCsv(){const table=[cols[key]||cols.about,...rows];const csv='\ufeff'+table.map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(';')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='ruby-'+key+'-'+state.tab+'-DEMO.csv';a.click();URL.revokeObjectURL(url);}
document.addEventListener('click',e=>{
 const tab=e.target.closest('[data-tab]');if(tab){state.tab=tab.dataset.tab;state.filter='Todos';state.search='';history.replaceState(null,'','#tab='+encodeURIComponent(state.tab));show();return;}
 const row=e.target.closest('[data-view]');if(row){toast('Registro '+row.dataset.view+' · somente demonstração.');return;}
 const act=e.target.closest('[data-action]');if(!act)return;
 const cmd=act.dataset.action;
 if(cmd==='csv'){exportCsv();toast('CSV fictício preparado para download.');return;}
 if(cmd==='reset'){state.filter='Todos';state.search='';state.sort=false;state.iterations=0;show();toast('Dados demonstrativos restaurados.');return;}
 if(cmd==='sort'){state.sort=!state.sort;show();return;}
 if(cmd==='refresh'){state.iterations=(state.iterations+1)%6;show();toast('Indicadores atualizados localmente.');return;}
 if(cmd==='calculate'){
  const n=id=>Math.max(0,Number(document.getElementById(id)?.value)||0);
  const base=n('d-base'),km=n('d-km'),fr=n('d-franquia'),rate=n('d-taxa');
  const r=base+Math.max(0,km-fr)*rate;
  document.getElementById('d-result').textContent='Cálculo fictício: '+brl(base)+' + '+fmt(Math.max(0,km-fr))+' km × '+brl(rate)+' = '+brl(r);
  return;
 }
 if(cmd==='etiqueta'){
  const keyValue=document.getElementById('d-chave')?.value||'',vol=Number(document.getElementById('d-volumes')?.value);
  if(!/^\d{44}$/.test(keyValue)||!Number.isInteger(vol)||vol<1||vol>50){toast('Use uma chave fictícia de 44 dígitos e de 1 a 50 volumes.');return;}
  state.printed+=vol;show();toast('Simulação de '+vol+' etiquetas, sem impressora ou NF real.');return;
 }
});
document.addEventListener('change',e=>{if(e.target.id==='d-status'){state.filter=e.target.value;show();}});
document.addEventListener('input',e=>{if(e.target.id!=='d-search')return;const cursor=e.target.selectionStart;state.search=e.target.value;show();const item=document.getElementById('d-search');item.focus();item.setSelectionRange(cursor,cursor);});
try{
 const ancestor=window.parent.document.documentElement;
 const update=()=>{document.documentElement.dataset.rubyTheme=ancestor.dataset.theme||ancestor.dataset.rubyTheme||'light';};
 update();new MutationObserver(update).observe(ancestor,{attributes:true,attributeFilter:['data-theme','data-ruby-theme']});
}catch{document.documentElement.dataset.rubyTheme='light';}
const tabHash=new URLSearchParams(location.hash.slice(1)).get('tab');
if(tabHash&&tabs.some(x=>x.id===tabHash))state.tab=tabHash;
show();
