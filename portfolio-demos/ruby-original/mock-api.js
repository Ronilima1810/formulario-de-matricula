/* Ruby Tower Control: adapter exclusivamente DEMO — nenhum endpoint corporativo é chamado. */
(function () {
  'use strict';
  const mockSystems = [
    {key:'bi',route:'/bi',label:'Dashboard'},
    {key:'inventario',route:'/inventario/resumo',label:'Inventário'},
    {key:'torre',route:'/torre/pedidos',label:'Torre de Pedidos'},
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
  const mockFor = (path, method) => {
    if(path==='/api/bootstrap') return bootstrap;
    if(path==='/api/bi/dashboard') return {ok:true,data:null,message:'Indicadores reais indisponíveis no preview; todos os dados de produção foram excluídos.'};
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
        frame.setAttribute('src','./module-demo.html?source='+encodeURIComponent(src));
      }
    });
  }).observe(document.documentElement,{childList:true,subtree:true});
})();
