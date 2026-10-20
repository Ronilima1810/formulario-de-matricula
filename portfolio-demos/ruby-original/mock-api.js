/* Ruby Tower Control: adapter exclusivamente DEMO — nenhum endpoint corporativo é chamado. */
(function () {
  'use strict';
  const mockSystems = [
    {key:'bi',route:'/bi',label:'Dashboard'},
    {key:'inventario',route:'/inventario',label:'Inventário'},
    {key:'torre',route:'/torre',label:'Torre de Pedidos'},
    {key:'transporte',route:'/transporte',label:'Custos de Transporte'},
    {key:'central_financeira',route:'/central-financeira',label:'Central Financeira'},
    {key:'agregados',route:'/agregados',label:'Gestão de Agregados'},
    {key:'checkin',route:'/checkin',label:'Check-in de Entrada'},
    {key:'compras',route:'/compras',label:'Compras'},
    {key:'danfe_mg',route:'/danfe-mg',label:'DANFE MG'},
    {key:'admin',route:'/admin',label:'Administração'},
    {key:'portal',route:'/portal',label:'Portal'},
    {key:'conta',route:'/conta',label:'Conta'}
  ];
  const branches = [
    {inventory_empresa:1,uf:'SP',label:'Unidade Demonstrativa SP',key:'demo-sp'},
    {inventory_empresa:2,uf:'MG',label:'Unidade Demonstrativa MG',key:'demo-mg'},
    {inventory_empresa:3,uf:'PR',label:'Unidade Demonstrativa PR',key:'demo-pr'},
    {inventory_empresa:4,uf:'PE',label:'Unidade Demonstrativa PE',key:'demo-pe'}
  ];
  const bootstrap = {
    ok:true,
    user:{id:0,nome:'Usuário Demonstrativo',name:'Usuário Demonstrativo',email:'usuario@exemplo.invalid',role:'admin',is_admin:true},
    systems:mockSystems,
    branches
  };
  const emptyOptions={ufs:['SP','MG','PR','PE'],transportadoras:[],operacoes:[],status:[]};
  // Dashboard e subvisões BI: dados fixos inventados, não derivados do ERP da empresa.
  const demoDates=Array.from({length:30},(_,i)=>{
    const day=new Date(Date.UTC(2026,9,1+i));
    return day.toISOString().slice(0,10);
  });
  const demoOrders=Array.from({length:10},(_,i)=>({
    pedido:'PED-DEMO-'+String(i+1).padStart(3,'0'),
    nf:'NF-DEMO-'+String(i+1).padStart(3,'0'),
    cliente:'Cliente Fictício '+(i+1),
    filial:'Unidade Demonstrativa SP',uf:['SP','MG','PR','PE'][i%4],
    faturado_em:'2026-10-'+String(i%15+1).padStart(2,'0')+'T08:30:00',
    horas_pos_faturamento:6+i*2,horas_aguardando:6+i*2,horas_rota:2+i,
    romaneio:i%3?'ROM-DEMO-'+String(i+1).padStart(3,'0'):'',
    transportador:'Transporte Exemplo '+(i%3+1),valor:1250+i*85,
    status:i%3?'Em rota':'Aguardando romaneio',volumes:2+i%4,cisao:false
  }));
  const demoCarriers=['Transporte Exemplo A','Transporte Exemplo B','Transporte Exemplo C'];
  const demoBI={
    options:{ufs:['SP','MG','PR','PE'],transportadoras:demoCarriers,operacoes:['Expedição','Entrega']},
    generated_at:'2026-10-19T10:00:00',
    financial:{
      faturadas:{qtd:218,valor:428650},
      aguardando_romaneio:{qtd:34,valor:63490},
      em_rota:{qtd:102,valor:204180},
      entregues:{qtd:82,valor:160980}
    },
    logistics:{
      pos_faturamento:{qtd:34,regra:'Nota Emitida / Faturado',rows:demoOrders},
      expedicao_pendente:{qtd:34,maior_espera_h:52,aging:{ate_4h:3,'4_12h':9,'12_24h':12,'24_48h':8,mais_48h:2},rows:demoOrders,aging_heatmap:{pending_total:34,min_hour:8,max_hour:18,rows:[]}},
      em_rota:{qtd:102,rows:demoOrders},
      romaneio_coverage:true,transportadoras_ativas:3
    },
    metrics:{sla_sp_24h:0.936,sla_sp_atrasados:4},
    daily_billing:{labels:demoDates,values:demoDates.map((_,i)=>9200+(i%7)*1250),note_counts:demoDates.map((_,i)=>8+i%5)},
    transport:{carriers:{
      labels:demoCarriers,counts:[58,36,19],values:[83200,51280,23900],
      daily:{labels:demoDates,datasets:demoCarriers.map((carrier,j)=>({carrier,values:demoDates.map((_,i)=>(j+1)*340+i*22),counts:demoDates.map((_,i)=>1+(i+j)%4)}))}
    }},
    quality:{registros_ficticios:218,cobertura_de_exemplo:'100%',operacao_real:false,fontes_reais_conectadas:false},
    sources:{torre:{source:'Fixture sintética',rows:218,stale:false},transporte:{source:'Fixture sintética',rows:113,stale:false},inventario:{source:'Fixture sintética',rows:0,stale:false}},
    history:{labels:['Mai','Jun','Jul','Ago','Set','Out'],datasets:[{year:2025,values:[98000,112000,120000,116000,125000,134000],notes:[100,109,115,110,123,133]},{year:2026,values:[117000,123000,134000,130000,143000,151000],notes:[122,130,136,128,142,150]}],summary:{current_partial:true,current_label:'Out/2026',as_of:'19/10/2026'}},
    filters:{date_from:'2026-10-01',date_to:'2026-10-19'}
  };

  const mockFor = (path, method) => {
    if(path==='/api/bootstrap') return bootstrap;
    if(path==='/api/bi/dashboard') return {ok:true,data:demoBI,preview:true};
    if(path==='/api/bi/filters'||path==='/api/bi/options') return {ok:true,...emptyOptions};
    if(path==='/api/admin/summary') return {ok:true,kpis:{usuarios:0,ativos:0,bloqueados:0},roles:[],audit:[]};
    if(path.includes('/api/chat/')) return {ok:true,conversations:[],messages:[],message:{content:'Chat indisponível na demonstração.'}};
    return {ok:false,error:'Este módulo requer uma API de demonstração própria. Nenhum servidor da empresa foi consultado.',preview:true,requested:path,method};
  };
  const nativeFetch = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = function (input, init) {
    const url = typeof input==='string' ? input : (input && input.url) || '';
    const absolute = new URL(url,window.location.href);
    if (absolute.pathname === '/ruby/api/node.php') {
      const route = absolute.searchParams.get('path')||'';
      const result=mockFor(route,(init && init.method)||'GET');
      const status=result.ok===false?404:200;
      return Promise.resolve(new Response(JSON.stringify(result), {
        status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}
      }));
    }
    // Defende contra chamadas acidentais para APIs externas ou de produção.
    if (absolute.origin !== window.location.origin || /\/(api|auth)\//.test(absolute.pathname)) {
      return Promise.reject(new Error('Rede bloqueada no preview Ruby: sem conexão com serviços reais.'));
    }
    if (!nativeFetch) return Promise.reject(new Error('Sem Fetch API.'));
    return nativeFetch(input,init);
  };
  // Navegação padrão reproduz a rota solicitada pelo usuário.
  if (!location.hash || location.hash==='#') location.replace(location.pathname+location.search+'#/portal');
  // Iframes de módulos PHP não existem no GitHub Pages. Não carregar origens externas.
  new MutationObserver(()=>{
    document.querySelectorAll('iframe[src]').forEach(frame=>{
      const src=frame.getAttribute('src')||'';
      if (src.startsWith('/ruby/')) {
        frame.setAttribute('src',src.startsWith('/ruby/agregados/')?'../fleet/module.html':'./module-demo.html?source='+encodeURIComponent(src));
      }
    });
  }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
})();
