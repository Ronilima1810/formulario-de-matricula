'use strict';
/* Desktop portfolio build. NO live API, no real payments, no personal records. */
const KEY='lumus-pdv-demo-v1';
const demoCatalog=[
{id:'PRD-001',name:'Camiseta algodão',category:'Vestuário',price:49.9,stock:46},
{id:'PRD-002',name:'Caneca personalizada',category:'Presentes',price:29.9,stock:71},
{id:'PRD-003',name:'Boné premium',category:'Vestuário',price:65,stock:23},
{id:'PRD-004',name:'Garrafa térmica',category:'Utilidades',price:89,stock:36},
{id:'PRD-005',name:'Ecobag de lona',category:'Acessórios',price:35,stock:52},
{id:'PRD-006',name:'Agenda corporativa',category:'Papelaria',price:28.5,stock:44}
];
function initial(){return {products:demoCatalog.map(p=>({...p})),sales:[],counter:1};}
let data;
try{let saved=JSON.parse(localStorage.getItem(KEY)||'null');data=saved&&Array.isArray(saved.products)&&Array.isArray(saved.sales)&&Number.isInteger(saved.counter)?saved:initial();}catch{data=initial();}
let page='pdv',query='',category='Todas',cart=[],payment='Pix (simulado)';
const root=document.getElementById('app'),toast=document.getElementById('toast');
const BRL=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(n)||0);
const int=n=>new Intl.NumberFormat('pt-BR').format(n);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>Math.round((Number(n)||0)*100)/100;
function persist(){localStorage.setItem(KEY,JSON.stringify(data));}
function inform(s){toast.textContent=s;toast.classList.add('show');toast.dataset.shown=String(Date.now());setTimeout(()=>{if(Date.now()-Number(toast.dataset.shown)>=2200)toast.classList.remove('show');},2400);}
function head(title,sub,actions=''){return '<div class="head"><div><div class="overline">LUMUS / WORKSPACE</div><h1>'+title+'</h1><p>'+sub+'</p></div><div class="buttons">'+actions+'</div></div>';}
function button(text,action,cls=''){return '<button class="btn '+cls+'" data-act="'+action+'">'+text+'</button>';}
function panel(title,body,right=''){return '<div class="card"><div class="ctitle"><h2>'+title+'</h2>'+right+'</div>'+body+'</div>';}
function table(cols,rows){return '<div class="tablewrap"><table class="table"><thead><tr>'+cols.map(s=>'<th>'+s+'</th>').join('')+'</tr></thead><tbody>'+rows.join('')+'</tbody></table></div>';}
function getProduct(id){return data.products.find(p=>p.id===id);}
function total(){return money(cart.reduce((sum,row)=>sum+(getProduct(row.id)?.price||0)*row.qty,0));}
function cartQty(id){return cart.find(x=>x.id===id)?.qty||0;}
function pdv(){
 const cats=['Todas',...new Set(data.products.map(x=>x.category))];
 const available=data.products.filter(p=>(category==='Todas'||p.category===category)&&[p.name,p.id].some(t=>t.toLowerCase().includes(query.toLowerCase())));
 const cards=available.map(p=>'<div class="product"><span class="sku">'+esc(p.id)+' / '+esc(p.category.toUpperCase())+'</span><strong>'+esc(p.name)+'</strong><div class="price">'+BRL(p.price)+'</div><div class="stock">Disponível: '+int(p.stock-cartQty(p.id))+'</div><button class="btn primary" data-add="'+esc(p.id)+'" '+(p.stock<=cartQty(p.id)?'disabled':'')+'>Adicionar à venda</button></div>').join('');
 const items=cart.length?cart.map(it=>{const p=getProduct(it.id);if(!p)return '';return '<div class="cartrow"><div><strong>'+esc(p.name)+'</strong><small>'+esc(p.id)+' · '+BRL(p.price)+' un. · '+BRL(p.price*it.qty)+'</small></div><div class="qty"><button data-dec="'+esc(p.id)+'" aria-label="Diminuir '+esc(p.name)+'">−</button><span>'+it.qty+'</span><button data-add="'+esc(p.id)+'" '+(p.stock<=it.qty?'disabled':'')+' aria-label="Aumentar '+esc(p.name)+'">+</button></div></div>';}).join(''):'<div class="empty"><strong>Venda ainda não iniciada</strong>Selecione produtos do catálogo.</div>';
 return head('Frente de Caixa','Ponto de venda com fluxo de atendimento inspirado em sistemas ERP.',button('Nova venda','reset-cart')+button('Exportar vendas CSV','export-sales'))+
 '<div class="notice"><strong>DEMONSTRAÇÃO</strong> Caixa local sem autorização fiscal, integração financeira ou emissão de NF-e.</div>'+
 '<div class="layout2"><section>'+panel('Catálogo de produtos','<div class="body"><div class="filters"><input class="input search" id="search" placeholder="Pesquisar por produto ou código" value="'+esc(query)+'" aria-label="Pesquisar catálogo"><select id="category" class="category" aria-label="Categoria">'+cats.map(c=>'<option '+(c===category?'selected':'')+'>'+esc(c)+'</option>').join('')+'</select></div><div class="catalog">'+(cards||'<div class="empty">Nenhum item para este filtro.</div>')+'</div></div>','<span class="info">'+available.length+' produtos</span>')+'</section>'+
 '<section>'+panel('Venda em andamento','<div class="body">'+items+'</div><div class="summary"><div class="moneyline"><span>Subtotal</span><strong>'+BRL(total())+'</strong></div><div class="moneyline"><span>Descontos</span><span>'+BRL(0)+'</span></div><div class="moneyline total"><span>Total</span><strong>'+BRL(total())+'</strong></div></div><div class="method"><label for="payment">Método de pagamento (simulação)</label><select id="payment">'+['Pix (simulado)','Dinheiro (simulado)','Crédito (simulado)','Débito (simulado)'].map(x=>'<option '+(payment===x?'selected':'')+'>'+x+'</option>').join('')+'</select></div><button class="btn primary checkout" data-act="finish" '+(!cart.length?'disabled':'')+'>Concluir venda demonstrativa</button>')+'</section></div>';
}
function products(){
 const rows=data.products.map(p=>'<tr><td>'+esc(p.id)+'</td><td><strong>'+esc(p.name)+'</strong></td><td>'+esc(p.category)+'</td><td>'+BRL(p.price)+'</td><td>'+int(p.stock)+'</td><td><span class="tag">Ativo</span></td></tr>');
 const form='<div class="body"><form id="add-product"><div class="formline"><div class="field"><label for="new-name">Nome do item</label><input class="input" id="new-name" maxlength="70" required placeholder="Produto de demonstração"></div><div class="field"><label for="new-category">Categoria</label><input class="input" id="new-category" maxlength="30" required placeholder="Acessórios"></div><div class="field"><label for="new-price">Preço (R$)</label><input class="input" id="new-price" type="number" min=".01" step=".01" max="100000" required placeholder="49.90"></div></div><div class="formline"><div class="field"><label for="new-stock">Estoque inicial</label><input class="input" id="new-stock" type="number" min="0" max="1000000" step="1" value="10" required></div></div><button class="btn primary" type="submit">Adicionar produto fictício</button></form></div>';
 return head('Produtos e estoque','Catálogo fictício local da estação PDV.',button('Restaurar dados de exemplo','restore-demo'))+'<div class="notice">Os produtos ficam armazenados apenas neste dispositivo, sem banco corporativo.</div><div style="margin-bottom:16px">'+panel('Cadastro rápido de produto',form)+'</div>'+panel('Base de produtos',table(['Código','Produto','Categoria','Preço unitário','Estoque disponível','Situação'],rows),'<span class="info">'+rows.length+' produtos</span>');
}
function sales(){
 const list=data.sales.slice().reverse().map(s=>'<tr><td><strong>'+esc(s.id)+'</strong></td><td>'+esc(new Date(s.date).toLocaleString('pt-BR'))+'</td><td>'+s.items.reduce((z,v)=>z+v.qty,0)+'</td><td>'+BRL(s.total)+'</td><td>'+esc(s.payment)+'</td><td><span class="tag">Simulado</span></td></tr>');
 return head('Histórico de vendas','Registros de venda salvos localmente nesta instalação.',button('Exportar CSV','export-sales'))+panel('Vendas registradas',list.length?table(['Venda','Data/hora','Itens','Total','Pagamento','Situação'],list):'<div class="empty"><strong>Nenhuma venda registrada</strong>Utilize a Frente de Caixa para simular uma venda.</div>');
}
function reports(){
 const count=data.sales.length,quantity=data.sales.reduce((s,x)=>s+x.items.reduce((z,i)=>z+i.qty,0),0),sum=data.sales.reduce((s,x)=>s+x.total,0);
 const sold={};for(const sale of data.sales){for(const item of sale.items){sold[item.name]=(sold[item.name]||0)+item.qty;}}
 const ranked=Object.entries(sold).sort((a,b)=>b[1]-a[1]).slice(0,6);const max=Math.max(1,...ranked.map(x=>x[1]));
 return head('Relatórios gerenciais','Indicadores calculados a partir de vendas simuladas da estação.',button('Exportar CSV','export-sales'))+'<div class="kpis">'+[['Total de vendas',int(count)],['Valor movimentado',BRL(sum)],['Itens vendidos',int(quantity)],['Ticket médio',BRL(count?sum/count:0)]].map(([label,value])=>'<div class="kpi"><label>'+label+'</label><strong>'+value+'</strong><small>Simulação local</small></div>').join('')+'</div><div class="split">'+panel('Itens mais vendidos','<div class="body">'+(ranked.length?ranked.map(([name,n])=>'<div class="barrow"><span>'+esc(name)+'</span><div class="track"><div class="fill" style="width:'+(100*n/max)+'%"></div></div><strong>'+n+'</strong></div>').join(''):'<div class="empty">Ainda não existem vendas simuladas.</div>')+'</div>')+panel('Diagnóstico da estação','<div class="body"><p><strong>Modo:</strong> operação local de demonstração</p><p><strong>Armazenamento:</strong> navegador incorporado ao aplicativo desktop</p><p><strong>Backend SaaS:</strong> não conectado</p><p><strong>Impressora fiscal / PIX:</strong> não integrados</p><p><strong>Exigência para produção:</strong> API autenticada, autorização comercial, segurança e integrações fiscais</p></div>')+'</div>';
}
function render(){
 for(const btn of document.querySelectorAll('[data-page]')){btn.classList.toggle('active',btn.dataset.page===page);btn.setAttribute('aria-current',btn.dataset.page===page?'page':'false');}
 const pages={pdv:['Frente de caixa',pdv],products:['Produtos e estoque',products],sales:['Histórico de vendas',sales],reports:['Relatórios',reports]};
 document.getElementById('crumb').textContent=pages[page][0];
 root.innerHTML=pages[page][1]();
}
document.addEventListener('click',e=>{
 const nav=e.target.closest('[data-page]');if(nav){page=nav.dataset.page;render();return;}
 const add=e.target.closest('[data-add]');if(add){const id=add.dataset.add,p=getProduct(id);if(!p||p.stock<=cartQty(id))return;let x=cart.find(z=>z.id===id);if(x)x.qty++;else cart.push({id,qty:1});render();return;}
 const dec=e.target.closest('[data-dec]');if(dec){const i=cart.find(x=>x.id===dec.dataset.dec);if(i){i.qty--;if(i.qty<=0)cart=cart.filter(x=>x.qty>0);render();}return;}
 const action=e.target.closest('[data-act]');if(!action)return;
 switch(action.dataset.act){
 case 'reset-cart':cart=[];render();break;
 case 'finish':{
  if(!cart.length)return;
  for(const item of cart){const p=getProduct(item.id);if(!p||p.stock<item.qty){inform('Estoque insuficiente. Revise a venda.');return;}}
  const sale={id:'VND-'+String(data.counter++).padStart(6,'0'),date:new Date().toISOString(),payment,total:total(),items:cart.map(x=>({id:x.id,name:getProduct(x.id).name,qty:x.qty,price:getProduct(x.id).price}))};
  for(const item of cart)getProduct(item.id).stock-=item.qty;
  data.sales.push(sale);persist();cart=[];render();inform('Venda '+sale.id+' registrada apenas nesta demonstração.');break;
 }
 case 'restore-demo':{if(confirm('Restaurar catálogo fictício e apagar vendas locais da demonstração?')){data=initial();cart=[];persist();render();inform('Dados de exemplo restaurados.');}break;}
 case 'export-sales':exportCSV();break;
 }
});
document.addEventListener('change',e=>{if(e.target.id==='category'){category=e.target.value;render();}if(e.target.id==='payment')payment=e.target.value;});
document.addEventListener('input',e=>{if(e.target.id==='search'){query=e.target.value;const at=e.target.selectionStart;render();const el=document.getElementById('search');if(el){el.focus();el.setSelectionRange(at,at);}}});
document.addEventListener('submit',e=>{
 if(e.target.id!=='add-product')return;e.preventDefault();
 let name=document.getElementById('new-name').value.trim(),cat=document.getElementById('new-category').value.trim(),price=Number(document.getElementById('new-price').value),stock=Number(document.getElementById('new-stock').value);
 if(!name||!cat||price<=0||price>100000||!Number.isInteger(stock)||stock<0||stock>1000000){inform('Preencha os campos com valores válidos.');return;}
 const id='PRD-'+String(Date.now());
 data.products.push({id,name:name.slice(0,70),category:cat.slice(0,30),price:money(price),stock});persist();render();inform('Produto de demonstração adicionado.');
});
function exportCSV(){
 const columns=['Venda','Data','Pagamento','Total','Itens'];const rows=data.sales.map(s=>[s.id,s.date,s.payment,s.total.toFixed(2),s.items.map(i=>i.name+' x'+i.qty).join(' | ')]);
 const csv='\uFEFF'+[columns,...rows].map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(';')).join('\r\n');
 const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='vendas_pdv_demonstracao.csv';a.click();URL.revokeObjectURL(url);
}
function clock(){document.getElementById('clock').textContent=new Date().toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'});}
clock();setInterval(clock,60000);render();
