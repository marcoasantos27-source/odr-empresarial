
const state = {
  portal: null,          // cliente | colaborador | gestao
  role: null,            // cliente | colaborador | gestor | ouvidoria | auditor | admin | direcao
  page: null,
  employeeMode: "confidencial",
  who: [2,2,2,2,2],
  clientDecision: null,
  selectedCase: "#1045"
};

const CASES = [
  {id:"#1048", origin:"Cliente", kind:"Reclamação externa", subject:"Cobrança divergente", sector:"Financeiro", category:"Atendimento/Financeiro", gravity:"Média", recurrence:"Baixa", priority:"Média", status:"Em análise"},
  {id:"#1047", origin:"Colaborador", kind:"Denúncia interna", subject:"Possível assédio moral", sector:"RH/Ouvidoria", category:"Conduta / Risco psicossocial", gravity:"Alta", recurrence:"Alta", priority:"Crítica", status:"Aguardando validação"},
  {id:"#1046", origin:"Cliente", kind:"Reclamação externa", subject:"Demora no atendimento", sector:"Atendimento", category:"Atendimento", gravity:"Baixa", recurrence:"Alta", priority:"Média", status:"Respondida"},
  {id:"#1045", origin:"Colaborador", kind:"Denúncia interna", subject:"Conduta inadequada de liderança", sector:"RH", category:"Conduta / Risco psicossocial", gravity:"Alta", recurrence:"Média", priority:"Alta", status:"Em análise"},
  {id:"#1044", origin:"Colaborador", kind:"Reclamação interna", subject:"Falha recorrente de comunicação", sector:"Operações", category:"Processo interno", gravity:"Baixa", recurrence:"Alta", priority:"Média", status:"Encaminhada"},
  {id:"#1043", origin:"Cliente", kind:"Sugestão", subject:"Melhoria no canal de suporte", sector:"TI", category:"Sugestão", gravity:"Baixa", recurrence:"Baixa", priority:"Baixa", status:"Resolvida"}
];

const ALL_STATUSES = ["Recebida","Em triagem","Aguardando validação","Encaminhada","Em análise","Aguardando informações","Respondida","Resolvida","Não resolvida","Retirada","Reaberta"];

const ROLE_INFO = {
  cliente:{name:"Carlos Souza", label:"Cliente"},
  colaborador:{name:"Mariana Lima", label:"Colaborador"},
  gestor:{name:"Paulo Mendes", label:"Gestor / Responsável"},
  ouvidoria:{name:"Ana Ribeiro", label:"RH / Ouvidoria"},
  auditor:{name:"Roberto Silva", label:"Auditor"},
  admin:{name:"Lucas Tavares", label:"Administrador técnico"},
  direcao:{name:"Fernanda Costa", label:"Direção / visão estratégica"}
};

function defaultPage(){
  if(state.role==="cliente") return "clientHome";
  if(state.role==="colaborador") return "employeeHome";
  if(state.role==="gestor") return "managerDashboard";
  if(state.role==="ouvidoria") return "ombudsmanDashboard";
  if(state.role==="auditor") return "auditDashboard";
  if(state.role==="admin") return "adminDashboard";
  return "strategyDashboard";
}
function go(page){ state.page=page; render(); }
function logout(){ state.portal=null; state.role=null; state.page=null; render(); }
function openCase(id, page="caseDetail"){ state.selectedCase=id; state.page=page; render(); }
function setRole(role){ state.role=role; state.page=defaultPage(); render(); }

function tagPriority(v){
  const map={Baixa:"green",Média:"yellow",Alta:"red",Crítica:"purple"};
  return `<span class="tag ${map[v]||'gray'}">${v}</span>`;
}
function tagStatus(v){
  const map={"Resolvida":"green","Respondida":"blue","Em análise":"yellow","Aguardando validação":"purple","Encaminhada":"blue","Retirada":"gray","Reaberta":"red","Não resolvida":"red"};
  return `<span class="tag ${map[v]||'gray'}">${v}</span>`;
}
function metric(value,label,icon){return `<div class="card metric"><div><small>${label}</small><strong>${value}</strong></div><div class="metric-icon">${icon}</div></div>`}
function caseById(){return CASES.find(c=>c.id===state.selectedCase)||CASES[0]}

function portalNavigation(){
  if(state.role==="cliente"){
    return [
      ["clientHome","⌂","Início"],
      ["clientNew","✚","Nova reclamação"],
      ["clientProtocols","▦","Meus protocolos"],
      ["clientProfile","◌","Meu perfil"]
    ];
  }
  if(state.role==="colaborador"){
    return [
      ["employeeHome","⌂","Início"],
      ["employeeNew","✚","Novo relato"],
      ["employeeProtocols","▦","Meus protocolos"],
      ["who5","♡","WHO-5 opcional"],
      ["employeeProfile","◌","Meu perfil"]
    ];
  }
  if(state.role==="gestor"){
    return [["managerDashboard","⌂","Dashboard"],["assignedCases","▦","Casos atribuídos"],["caseDetail","✓","Tratamento"],["managementMessages","✉","Comunicação"]];
  }
  if(state.role==="ouvidoria"){
    return [["ombudsmanDashboard","⌂","Dashboard"],["sensitiveQueue","⚠","Casos sensíveis"],["triage","✦","Validação da IA"],["recurrenceView","↻","Recorrência"],["caseDetail","▦","Tratamento"],["identityVault","🔒","Cofre de identidade"],["whoAggregate","♡","WHO-5 agregado"]];
  }
  if(state.role==="auditor"){
    return [["auditDashboard","⌂","Dashboard"],["auditCases","▦","Casos auditáveis"],["auditTrail","⌘","Trilha de auditoria"],["accessLogs","◉","Logs de acesso"]];
  }
  if(state.role==="admin"){
    return [["adminDashboard","⌂","Administração"],["companies","▣","Empresas"],["sectors","◫","Setores"],["users","👤","Usuários e perfis"],["permissions","🔑","Permissões"],["systemSettings","⚙","Configurações"]];
  }
  return [["strategyDashboard","⌂","Visão estratégica"],["strategyIndicators","▥","Indicadores agregados"],["whoAggregate","♡","Bem-estar agregado"],["trendReport","↗","Tendências"]];
}

function shell(content){
  const info=ROLE_INFO[state.role];
  const nav=portalNavigation();
  return `<div class="portal-layout">
    <aside class="sidebar">
      <div class="brand"><div class="logo">O</div><span>ODR<small>Ouvidoria & Auditoria Empresarial</small></span></div>
      <div class="portal-label">${info.label}</div>
      <div class="nav">
        ${nav.map(([p,i,l])=>`<button class="${state.page===p?'active':''}" onclick="go('${p}')">${i}<span>${l}</span></button>`).join("")}
        ${state.portal==="gestao" ? `
          <div class="nav-sep"></div><div class="nav-title">Trocar visão administrativa</div>
          ${["gestor","ouvidoria","auditor","admin","direcao"].map(r=>`<button onclick="setRole('${r}')">${r==="gestor"?"G":r==="ouvidoria"?"RH":r==="auditor"?"A":r==="admin"?"TI":"D"}<span>${ROLE_INFO[r].label}</span></button>`).join("")}
        `:""}
      </div>
    </aside>
    <main class="main">
      <header class="topbar">
        <input class="search" placeholder="${state.role==='cliente'||state.role==='colaborador'?'Buscar protocolo ou assunto...':'Buscar protocolo, assunto ou setor...'}" />
        <div class="userbox"><div class="avatar">${info.name[0]}</div><div><strong>${info.name}</strong><div style="font-size:10px;color:var(--muted)">${info.label}</div></div><button class="btn btn-light" onclick="logout()">Sair</button></div>
      </header>
      <section class="content">${content}</section>
    </main>
  </div>`;
}

function casesTable(rows, clickable=true){
  return `<div class="card"><div class="table-wrap"><table>
  <thead><tr><th>Protocolo</th><th>Origem</th><th>Assunto</th><th>Setor</th><th>Gravidade</th><th>Recorrência</th><th>Prioridade</th><th>Status</th></tr></thead>
  <tbody>${rows.map(r=>`<tr class="${clickable?'clickable':''}" ${clickable?`onclick="openCase('${r.id}')"`:""}>
    <td><strong>${r.id}</strong></td><td>${r.origin}</td><td>${r.subject}</td><td>${r.sector}</td>
    <td>${r.gravity}</td><td>${r.recurrence}</td><td>${tagPriority(r.priority)}</td><td>${tagStatus(r.status)}</td>
  </tr>`).join("")}</tbody></table></div></div>`;
}


// Cliente e colaborador não visualizam classificação interna, prioridade,
// gravidade, recorrência, responsável, triagem ou encaminhamento.
function publicStatus(status){
  const map = {
    "Recebida":"Recebida",
    "Em triagem":"Em tratamento",
    "Aguardando validação":"Em tratamento",
    "Encaminhada":"Em tratamento",
    "Em análise":"Em tratamento",
    "Aguardando informações":"Aguardando sua informação",
    "Respondida":"Resposta disponível",
    "Resolvida":"Concluída",
    "Não resolvida":"Não resolvida",
    "Retirada":"Retirada",
    "Reaberta":"Reaberta"
  };
  return map[status] || "Em tratamento";
}

function publicStatusTag(status){
  const visible = publicStatus(status);
  const cls = visible==="Concluída" ? "green"
    : visible==="Resposta disponível" ? "blue"
    : visible==="Aguardando sua informação" ? "yellow"
    : visible==="Não resolvida" ? "red"
    : visible==="Retirada" ? "gray"
    : visible==="Reaberta" ? "purple"
    : visible==="Recebida" ? "blue" : "yellow";
  return `<span class="tag ${cls}">${visible}</span>`;
}

function userCasesTable(rows, detailPage){
  return `<div class="card"><div class="table-wrap"><table>
    <thead><tr><th>Protocolo</th><th>Tipo</th><th>Assunto</th><th>Status</th><th>Atualização</th></tr></thead>
    <tbody>${rows.map((r,i)=>`<tr class="clickable" onclick="state.selectedCase='${r.id}';go('${detailPage}')">
      <td><strong>${r.id}</strong></td>
      <td>${r.kind}</td>
      <td>${r.subject}</td>
      <td>${publicStatusTag(r.status)}</td>
      <td>${i===0?"Hoje":"Recentemente"}</td>
    </tr>`).join("")}</tbody>
  </table></div></div>`;
}

function userProgressCard(kind){
  const steps = kind==="cliente"
    ? [["Recebido","Sua manifestação foi registrada com sucesso."],
       ["Em tratamento","A organização está analisando seu protocolo."],
       ["Resposta disponível","Quando houver retorno ou proposta, ela aparecerá aqui."]]
    : [["Recebido","Seu relato foi registrado e protegido conforme a modalidade escolhida."],
       ["Em tratamento","O protocolo está sendo tratado internamente."],
       ["Retorno","Se for necessário falar com você, a solicitação aparecerá no canal seguro."]];
  return `<div class="timeline">${steps.map((x,i)=>`<div class="timeline-item">
    <div class="dot"></div><div><strong>${x[0]}</strong><p>${x[1]}</p></div>
  </div>`).join("")}</div>`;
}

/* ----------------------------- LOGIN / ENTRADAS ----------------------------- */
function login(){
  document.getElementById("app").innerHTML=`<div class="login-page">
    <section class="login-side">
      <div class="brand"><div class="logo">O</div><span>ODR<small>Empresarial</small></span></div>
      <div>
        <h1>Uma única plataforma, com áreas diferentes para quem registra, trata, audita e administra.</h1>
        <p>Protótipo acadêmico navegável baseado nos fluxos discutidos pela squad: proteção do denunciante, IA supervisionada, recorrência e rastreabilidade.</p>
      </div>
      <div class="notice">Demonstração sem backend. Dados, protocolos e integrações são simulados.</div>
    </section>
    <section class="login-box">
      <div class="login-card">
        <h2>Escolha a entrada</h2>
        <p>Cada portal possui permissões e objetivos diferentes.</p>
        <div class="portal-cards">
          <button class="portal-card" onclick="enterPortal('cliente')"><strong>Portal do Cliente</strong><small>Reclamações externas, acompanhamento, chat e decisão sobre propostas de solução.</small></button>
          <button class="portal-card" onclick="enterPortal('colaborador')"><strong>Portal do Colaborador</strong><small>Reclamações/denúncias internas, sigilo, protocolo, WHO-5 opcional e canal seguro.</small></button>
          <button class="portal-card" onclick="enterPortal('gestao')"><strong>Painel de Gestão / Auditoria</strong><small>Gestor, RH/Ouvidoria, Auditor, Administração técnica e visão estratégica.</small></button>
        </div>
      </div>
    </section>
  </div>`;
}
function enterPortal(portal){
  state.portal=portal;
  if(portal==="cliente"){state.role="cliente";state.page="clientHome";render();return;}
  if(portal==="colaborador"){state.role="colaborador";state.page="employeeHome";render();return;}
  managementLogin();
}
function managementLogin(){
  document.getElementById("app").innerHTML=`<div class="login-page">
    <section class="login-side">
      <div class="brand"><div class="logo">O</div><span>ODR<small>Painel de Gestão / Auditoria</small></span></div>
      <div><h1>Acesso administrativo por função.</h1><p>Administrar tecnicamente a plataforma não concede acesso automático ao conteúdo sigiloso.</p></div>
      <div class="notice">Escolha um perfil para demonstrar os dashboards e permissões diferentes.</div>
    </section>
    <section class="login-box"><div class="login-card">
      <button class="back" onclick="logout()">← Voltar</button>
      <h2>Perfil de demonstração</h2><p>As visões abaixo representam funções distintas.</p>
      <div class="portal-cards">
        <button class="portal-card" onclick="setRole('gestor')"><strong>Gestor / Responsável</strong><small>Trata casos atribuídos, quando não houver conflito de interesse.</small></button>
        <button class="portal-card" onclick="setRole('ouvidoria')"><strong>RH / Ouvidoria</strong><small>Casos internos, sensíveis, confidenciais, reincidência e conflitos de interesse.</small></button>
        <button class="portal-card" onclick="setRole('auditor')"><strong>Auditor</strong><small>Histórico, prazos, alterações, justificativas e acessos; identidade não é necessária por padrão.</small></button>
        <button class="portal-card" onclick="setRole('admin')"><strong>Administrador técnico</strong><small>Empresas, setores, usuários e permissões, sem acesso automático aos relatos sigilosos.</small></button>
        <button class="portal-card" onclick="setRole('direcao')"><strong>Direção / visão estratégica</strong><small>Indicadores agregados e anonimizados.</small></button>
      </div>
    </div></section>
  </div>`;
}

/* ----------------------------- CLIENTE ----------------------------- */
function clientHome(){
  return shell(`<div class="page-head">
    <div><h1>Portal do Cliente</h1><p>Registre reclamações externas e acompanhe seus protocolos de forma simples.</p></div>
    <button class="btn btn-primary" onclick="go('clientNew')">+ Nova reclamação</button>
  </div>

  <div class="grid g3">
    ${metric("2","Protocolos em andamento","▦")}
    ${metric("1","Precisa da sua ação","!")}
    ${metric("4","Protocolos concluídos","✓")}
  </div>

  <div class="section-head"><h2>Acesso rápido</h2></div>
  <div class="quick">
    <button onclick="go('clientNew')">✚<strong>Registrar reclamação</strong></button>
    <button onclick="go('clientProtocols')">▦<strong>Acompanhar protocolos</strong></button>
    <button onclick="state.selectedCase='#1046';go('clientProtocolDetail')">!<strong>Ver protocolo com resposta</strong></button>
    <button onclick="go('clientProfile')">◌<strong>Meu perfil</strong></button>
  </div>

  <div class="section-head"><h2>Protocolos recentes</h2></div>
  ${userCasesTable(CASES.filter(c=>c.origin==="Cliente"),"clientProtocolDetail")}`);
}
function clientNew(){
  return shell(`<div class="page-head"><div><h1>Registrar reclamação externa</h1><p>Formulário guiado para informar o problema e a providência esperada.</p></div></div>
  <div class="card">
    <div class="form-grid">
      <div class="field"><label>Empresa / organização</label><select><option>Empresa de demonstração</option></select></div>
      <div class="field"><label>Área relacionada</label><select><option>Atendimento</option><option>Financeiro</option><option>Produto/Serviço</option><option>Outro</option></select></div>
      <div class="field full"><label>Assunto</label><input placeholder="Resumo do problema"></div>
      <div class="field full"><label>O que aconteceu?</label><textarea placeholder="Descreva os fatos de forma objetiva..."></textarea></div>
      <div class="field full"><label>Qual providência você espera?</label><textarea placeholder="Ex.: correção da cobrança, retorno do setor, revisão do atendimento..."></textarea></div>
      <div class="field"><label>Data aproximada do ocorrido</label><input type="date"></div>
      <div class="field"><label>Canal onde ocorreu</label><select><option>Presencial</option><option>Telefone</option><option>Site/App</option><option>WhatsApp</option><option>Outro</option></select></div>
      <div class="field full"><label>Anexos comprobatórios</label><input type="file"><span class="help">Formatos e limites ainda serão definidos pela squad.</span></div>
    </div>
    <div class="notice" style="margin-top:14px">Após o envio, o sistema gera um protocolo para acompanhamento. O tratamento interno da ocorrência não fica exposto ao cliente.</div>
    <div class="actions" style="justify-content:flex-end;margin-top:15px"><button class="btn btn-light">Salvar rascunho</button><button class="btn btn-primary" onclick="go('clientProtocols')">Enviar e gerar protocolo</button></div>
  </div>`);
}
function clientProtocols(){
  return shell(`<div class="page-head"><div><h1>Meus protocolos</h1><p>Consulte somente o andamento que precisa ser comunicado a você.</p></div></div>
  ${userCasesTable(CASES.filter(c=>c.origin==="Cliente"),"clientProtocolDetail")}
  <div class="card" style="margin-top:16px">
    <h3>Acompanhamento simplificado</h3>
    ${userProgressCard("cliente")}
    <div class="notice" style="margin-top:12px">Etapas internas como triagem, prioridade, responsáveis e encaminhamentos não são exibidas neste portal.</div>
  </div>`);
}

function clientProtocolDetail(){
  const c=caseById();
  const hasResponse = c.status==="Respondida" || c.status==="Resolvida";
  return shell(`<div class="page-head">
    <div><h1>${c.id} — ${c.subject}</h1><p>${c.kind} • ${publicStatusTag(c.status)}</p></div>
    <button class="btn btn-light" onclick="go('clientProtocols')">← Voltar</button>
  </div>

  <div class="grid g2">
    <div class="card">
      <h3>Resumo do protocolo</h3>
      <div class="info-list">
        <div class="info"><small>Protocolo</small><strong>${c.id}</strong></div>
        <div class="info"><small>Assunto</small><strong>${c.subject}</strong></div>
        <div class="info"><small>Situação atual</small>${publicStatusTag(c.status)}</div>
      </div>
    </div>
    <div class="card">
      <h3>Acompanhamento</h3>
      ${userProgressCard("cliente")}
    </div>
  </div>

  <div class="card" style="margin-top:16px">
    <h3>Interações do protocolo</h3>
    <div class="timeline">
      <div class="timeline-item"><div class="dot"></div><div><strong>Manifestação registrada</strong><p>Seu protocolo foi criado com sucesso.</p></div></div>
      <div class="timeline-item"><div class="dot"></div><div><strong>Em tratamento</strong><p>A organização está tratando a ocorrência internamente.</p></div></div>
      ${hasResponse?`<div class="timeline-item"><div class="dot"></div><div><strong>Resposta disponível</strong><p>Existe um retorno da empresa para você.</p></div></div>`:""}
    </div>
  </div>

  ${hasResponse?`
  <div class="card" style="margin-top:16px">
    <h3>Resposta da empresa</h3>
    <p style="color:var(--muted);line-height:1.65">O setor responsável analisou sua manifestação e disponibilizou uma resposta para continuidade do protocolo.</p>
    <div class="actions">
      <button class="btn btn-success">Considerar resolvido</button>
      <button class="btn btn-light">Informar que não resolveu</button>
      <button class="btn btn-light">Enviar informação adicional</button>
    </div>
  </div>`:`
  <div class="card" style="margin-top:16px">
    <h3>Precisa enviar algo?</h3>
    <div class="notice">Quando a organização precisar de uma informação adicional, a solicitação aparecerá aqui. Você poderá responder ou anexar um arquivo diretamente neste protocolo.</div>
  </div>`}

  <div class="notice" style="margin-top:16px">O cliente não visualiza prioridade, classificação, responsáveis internos nem encaminhamentos realizados pela organização.</div>`);
}
function clientSolution(){
  return shell(`<div class="page-head"><div><h1>Proposta de solução</h1><p>Protocolo #1046 • etapa de decisão do cliente.</p></div></div>
  <div class="grid g2">
    <div class="card"><h3>Resposta da empresa</h3><p style="color:var(--muted);line-height:1.6">O setor responsável revisou o atendimento e propõe novo contato prioritário, com acompanhamento por um responsável até a conclusão.</p></div>
    <div class="card"><h3>Sua decisão</h3>
      <div class="choice-grid" style="grid-template-columns:1fr">
        <button class="choice ${state.clientDecision==='accept'?'selected':''}" onclick="state.clientDecision='accept';render()"><strong>Aceitar proposta</strong><p>O sistema registra o aceite e pode gerar o termo/registro de acordo.</p></button>
        <button class="choice ${state.clientDecision==='retry'?'selected':''}" onclick="state.clientDecision='retry';render()"><strong>Solicitar nova tentativa</strong><p>O caso volta ao fluxo para uma nova proposta.</p></button>
        <button class="choice ${state.clientDecision==='reject'?'selected':''}" onclick="state.clientDecision='reject';render()"><strong>Não resolveu</strong><p>O sistema registra a insatisfação e mantém o histórico.</p></button>
      </div>
    </div>
  </div>
  <div class="card" style="margin-top:16px"><h3>Após a decisão</h3><div class="notice">${state.clientDecision==="accept"?"Aceite registrado no protótipo. O próximo passo seria formalizar o acordo e depois emitir o relatório final.":state.clientDecision==="retry"?"O caso seria reencaminhado para nova tentativa de solução, preservando todo o histórico.":state.clientDecision==="reject"?"O caso seria marcado como não resolvido ou encaminhado para nova tratativa, conforme regra validada pela squad.":"Escolha uma decisão para simular a próxima etapa."}</div></div>`);
}
function clientMessages(){return shell(chatScreen("Canal do protocolo #1046",[
  ["system","A empresa solicitou uma informação complementar: em qual horário ocorreu o atendimento?"],
  ["me","Foi por volta das 14h30."],
  ["system","Obrigado. A informação foi anexada ao protocolo."]
]));}
function clientReports(){
  return shell(`<div class="page-head"><div><h1>Relatórios finais</h1><p>Resumo dos casos concluídos, respostas e resultado final.</p></div></div>
  <div class="card"><h3>Protocolo #1038 — concluído</h3>
    <div class="info-list">
      <div class="info"><small>Resultado</small><strong>Acordo aceito pelo cliente</strong></div>
      <div class="info"><small>Resumo</small><strong>Problema tratado pelo setor responsável e providência confirmada.</strong></div>
      <div class="info"><small>Histórico</small><strong>Preservado no sistema para rastreabilidade.</strong></div>
    </div>
  </div>`);
}

function clientProfile(){
  return shell(`<div class="page-head"><div><h1>Meu perfil</h1><p>Dados usados para contato e acompanhamento dos seus protocolos.</p></div></div>
  <div class="card"><div class="form-grid">
    <div class="field"><label>Nome</label><input value="Carlos Souza"></div>
    <div class="field"><label>E-mail</label><input value="carlos@email.com"></div>
    <div class="field"><label>Telefone</label><input value="(79) 99999-9999"></div>
    <div class="field"><label>Identificação</label><input value="***.***.***-**" disabled></div>
  </div><div class="actions" style="justify-content:flex-end;margin-top:14px"><button class="btn btn-primary">Salvar alterações</button></div></div>`);
}

/* ----------------------------- COLABORADOR ----------------------------- */
function employeeHome(){
  return shell(`<div class="page-head"><div><h1>Portal do Colaborador</h1><p>Registre reclamações ou denúncias internas e acompanhe apenas as informações necessárias sobre o seu protocolo.</p></div><button class="btn btn-primary" onclick="go('employeeNew')">+ Novo relato</button></div>
  <div class="grid g3">
    ${metric("2","Protocolos em andamento","▦")}
    ${metric("1","Solicitação de informação","✉")}
    ${metric("1","Pesquisa opcional disponível","♡")}
  </div>

  <div class="section-head"><h2>Acesso rápido</h2></div>
  <div class="quick">
    <button onclick="go('employeeNew')">✚<strong>Registrar relato</strong></button>
    <button onclick="go('employeeProtocols')">▦<strong>Acompanhar protocolos</strong></button>
    <button onclick="go('who5')">♡<strong>WHO-5 opcional</strong></button>
    <button onclick="go('employeeProfile')">◌<strong>Meu perfil</strong></button>
  </div>

  <div class="section-head"><h2>Seus protocolos</h2></div>
  ${userCasesTable(CASES.filter(c=>c.origin==="Colaborador"),"employeeProtocolDetail")}`);
}
function employeeNew(){
  return shell(`<div class="page-head"><div><h1>Novo relato interno</h1><p>Registro guiado de reclamação ou denúncia interna.</p></div></div>
  <div class="card">
    <div class="status-flow" style="margin-bottom:18px">
      <span class="status-step current">1. Tipo e sigilo</span>
      <span class="status-step">2. O que aconteceu</span>
      <span class="status-step">3. Pessoas envolvidas</span>
      <span class="status-step">4. Recorrência e retaliação</span>
      <span class="status-step">5. Evidências</span>
      <span class="status-step">6. Revisão</span>
    </div>

    <h3>Tipo do relato</h3>
    <div class="form-grid">
      <div class="field"><label>Tipo</label><select><option>Denúncia interna</option><option>Reclamação interna</option></select></div>
      <div class="field"><label>Setor relacionado</label><select><option>RH</option><option>Operações</option><option>Financeiro</option><option>TI</option><option>Outro</option></select></div>
    </div>

    <h3 style="margin-top:22px">Sigilo</h3>
    <div class="choice-grid">
      ${[
        ["identificada","Identificada","Sua identidade poderá ser acessada por perfis autorizados."],
        ["confidencial","Confidencial","Sua identidade fica protegida e não aparece automaticamente para quem trata o caso."],
        ["anonima","Anônima","O relato é acompanhado por protocolo/chave, sem associação direta exibida."]
      ].map(x=>`<button class="choice ${state.employeeMode===x[0]?'selected':''}" onclick="state.employeeMode='${x[0]}';render()"><strong>${x[1]}</strong><p>${x[2]}</p></button>`).join("")}
    </div>
    <div class="locked" style="margin-top:12px"><strong>🔒 Proteção de identidade</strong><p>${state.employeeMode==="anonima"?"O acompanhamento será feito pelo protocolo/chave.":state.employeeMode==="confidencial"?"A identidade ficará separada do conteúdo do relato e protegida por permissão específica.":"A identidade será usada somente conforme as permissões do sistema."}</p></div>

    <h3 style="margin-top:22px">O que aconteceu?</h3>
    <div class="form-grid">
      <div class="field full"><label>Relato</label><textarea placeholder="Descreva os fatos, quando aconteceram e o contexto..."></textarea></div>
      <div class="field"><label>Data aproximada</label><input type="date"></div>
      <div class="field"><label>Local / contexto</label><input placeholder="Ex.: setor, reunião, unidade..."></div>
    </div>

    <h3 style="margin-top:22px">Pessoas envolvidas</h3>
    <div class="notice">A busca deve exibir apenas o mínimo necessário, como nome e setor.</div>
    <div class="inline-form" style="margin-top:10px"><input placeholder="Pesquisar funcionário por nome..." style="flex:1"><button class="btn btn-light">Pesquisar</button></div>
    <div class="pill-row" style="margin-top:10px"><span class="pill">Não sei quem é</span><span class="pill">Prefiro não informar</span><span class="pill">Pessoa externa à empresa</span></div>

    <h3 style="margin-top:22px">Recorrência e possível retaliação</h3>
    <div class="form-grid">
      <div class="field"><label>Isso já aconteceu antes?</label><select><option>Não sei</option><option>Não</option><option>Sim, uma vez</option><option>Sim, várias vezes</option></select></div>
      <div class="field"><label>Você sofreu ou teme alguma retaliação?</label><select><option>Não</option><option>Sim</option><option>Tenho receio que aconteça</option></select></div>
    </div>

    <h3 style="margin-top:22px">Evidências</h3>
    <div class="field"><label>Anexos comprobatórios</label><input type="file"><span class="help">Formatos e limites ainda serão definidos pela squad.</span></div>

    <div class="notice warning" style="margin-top:16px">Após o envio, o sistema gera um protocolo. O tratamento interno poderá usar apoio de IA com validação humana, sem expor ao colaborador classificações internas como prioridade ou encaminhamento.</div>
    <div class="actions" style="justify-content:flex-end;margin-top:15px"><button class="btn btn-light">Salvar rascunho</button><button class="btn btn-primary" onclick="go('employeeProtocols')">Revisar e enviar</button></div>
  </div>`);
}
function employeeProtocols(){
  return shell(`<div class="page-head"><div><h1>Meus protocolos</h1><p>O acompanhamento mostra apenas informações necessárias ao denunciante, inclusive em relatos anônimos ou confidenciais.</p></div></div>
  ${userCasesTable(CASES.filter(c=>c.origin==="Colaborador"),"employeeProtocolDetail")}
  <div class="grid g2" style="margin-top:16px">
    <div class="card">
      <h3>Acompanhamento simplificado</h3>
      ${userProgressCard("colaborador")}
      <div class="notice" style="margin-top:12px">Triagem, prioridade, gravidade, recorrência, responsável e encaminhamentos são informações internas.</div>
    </div>
    <div class="card"><h3>Ações disponíveis</h3>
      <div class="actions"><button class="btn btn-light" onclick="go('employeeMessages')">Responder solicitação</button><button class="btn btn-danger">Solicitar retirada</button><button class="btn btn-light">Solicitar reabertura</button></div>
      <div class="notice" style="margin-top:12px">Retirar não apaga o relato. O registro continua preservado no histórico interno.</div>
    </div>
  </div>`);
}

function employeeProtocolDetail(){
  const c=caseById();
  return shell(`<div class="page-head">
    <div><h1>${c.id} — ${c.subject}</h1><p>${c.kind} • ${publicStatusTag(c.status)}</p></div>
    <button class="btn btn-light" onclick="go('employeeProtocols')">← Voltar</button>
  </div>

  <div class="grid g2">
    <div class="card">
      <h3>Resumo do protocolo</h3>
      <div class="info-list">
        <div class="info"><small>Protocolo</small><strong>${c.id}</strong></div>
        <div class="info"><small>Tipo</small><strong>${c.kind}</strong></div>
        <div class="info"><small>Situação atual</small>${publicStatusTag(c.status)}</div>
      </div>
    </div>
    <div class="card">
      <h3>Acompanhamento</h3>
      ${userProgressCard("colaborador")}
    </div>
  </div>

  <div class="card" style="margin-top:16px">
    <h3>Canal seguro deste protocolo</h3>
    <div class="bubble-list">
      <div class="bubble">Seu relato foi recebido e está em tratamento.</div>
      <div class="bubble">Se precisarmos de alguma informação, a solicitação aparecerá aqui.</div>
      <div class="bubble me">Entendido.</div>
    </div>
    <div class="chat-input"><input placeholder="Responder ou complementar informação..."><button class="btn btn-primary">Enviar</button></div>
  </div>

  <div class="actions" style="margin-top:16px">
    <button class="btn btn-danger">Solicitar retirada</button>
    <button class="btn btn-light">Solicitar reabertura</button>
  </div>

  <div class="notice" style="margin-top:16px">O colaborador não visualiza prioridade, gravidade, recorrência, responsáveis internos, validação da IA ou encaminhamentos. Quando alguma ação sua for necessária, ela aparecerá neste protocolo.</div>`);
}
function employeeMessages(){return shell(chatScreen("Canal seguro — protocolo #1045",[
  ["system","Precisamos confirmar se o comportamento relatado ocorreu mais de uma vez."],
  ["me","Sim, ocorreu em pelo menos três ocasiões."],
  ["system","Obrigado. A informação foi adicionada sem exigir exposição adicional da identidade."]
]));}
function employeeFollowup(){
  return shell(`<div class="page-head"><div><h1>Acompanhamento e retorno</h1><p>Feedback posterior ao tratamento do caso.</p></div></div>
  <div class="card">
    <div class="field"><label>De 0 a 10, quanto o problema foi resolvido?</label><div class="score-row">${[0,1,2,3,4,5,6,7,8,9,10].map(v=>`<button class="btn btn-light">${v}</button>`).join("")}</div></div>
    <div class="form-grid" style="margin-top:18px">
      <div class="field"><label>Você percebeu retaliação, perseguição ou isolamento após o relato?</label><select><option>Não</option><option>Sim</option><option>Prefiro não responder</option></select></div>
      <div class="field"><label>Você se sentiria seguro(a) para usar este canal novamente?</label><select><option>Sim</option><option>Não</option><option>Não sei</option></select></div>
    </div>
    <div class="notice danger" style="margin-top:15px">No sistema real, uma indicação de retaliação deve gerar nova avaliação do caso, e não ser tratada apenas como estatística.</div>
  </div>`);
}

function employeeProfile(){
  return shell(`<div class="page-head"><div><h1>Meu perfil</h1><p>Informações da sua conta de colaborador.</p></div></div>
  <div class="card"><div class="form-grid">
    <div class="field"><label>Nome</label><input value="Mariana Lima"></div>
    <div class="field"><label>E-mail corporativo</label><input value="mariana@empresa.com"></div>
    <div class="field"><label>Setor</label><input value="Operações" disabled></div>
    <div class="field"><label>Matrícula</label><input value="***245" disabled></div>
  </div><div class="actions" style="justify-content:flex-end;margin-top:14px"><button class="btn btn-primary">Salvar alterações</button></div></div>`);
}

function who5(){
  const qs=["Tenho me sentido alegre e de bom humor.","Tenho me sentido calmo(a) e relaxado(a).","Tenho me sentido ativo(a) e com energia.","Acordo me sentindo descansado(a).","Meu dia a dia tem coisas que me interessam."];
  return shell(`<div class="page-head"><div><h1>WHO-5 — opcional</h1><p>Pesquisa breve de bem-estar vinculada ao fluxo de acolhimento, sem substituir avaliação profissional.</p></div></div>
  <div class="card">
    <div class="notice">Pense nas últimas duas semanas. No produto final, a squad deverá validar como armazenar, proteger e exibir esses dados.</div>
    ${qs.map((q,i)=>`<div style="padding:14px 0;border-bottom:1px solid var(--line)"><strong>${i+1}. ${q}</strong>
      <div class="score-row" style="margin-top:9px">${[0,1,2,3,4,5].map(v=>`<button class="btn ${state.who[i]===v?'btn-primary':'btn-light'}" onclick="state.who[${i}]=${v};render()">${v}</button>`).join("")}</div>
    </div>`).join("")}
    <div class="notice" style="margin-top:14px">Pontuação de demonstração: <strong>${state.who.reduce((a,b)=>a+b,0)*4}/100</strong>. Resultado individual não é mostrado em dashboards estratégicos.</div>
  </div>`);
}

/* ----------------------------- GESTOR / RESPONSÁVEL ----------------------------- */
function managerDashboard(){
  const rows=CASES.filter(c=>["Atendimento","Financeiro","Operações","RH"].includes(c.sector));
  return shell(`<div class="page-head"><div><h1>Dashboard do Gestor / Responsável</h1><p>Casos atribuídos, prioridades, andamento e conflitos de interesse.</p></div></div>
    <div class="grid g4">${metric("6","Casos atribuídos","▦")}${metric("2","Alta prioridade","⚠")}${metric("1","Aguardando informação","✉")}${metric("1","Conflito bloqueado","⛔")}</div>
    <div class="section-head"><h2>Casos atribuídos</h2></div>${casesTable(rows)}
    <div class="notice danger" style="margin-top:15px">Regra: pessoa envolvida no caso não pode analisar, responder ou encerrar a própria denúncia.</div>`);
}
function assignedCases(){return shell(`<div class="page-head"><div><h1>Casos atribuídos</h1><p>Somente casos necessários para sua função.</p></div></div>${casesTable(CASES.filter(c=>c.sector!=="RH/Ouvidoria"))}`)}
function managementMessages(){return shell(chatScreen("Comunicação do caso #1048",[["system","Ouvidoria encaminhou o caso para seu setor."],["me","Recebido. Iniciaremos a análise."],["system","Lembrete: registre toda decisão relevante no histórico."]]));}

/* ----------------------------- RH / OUVIDORIA ----------------------------- */
function ombudsmanDashboard(){
  return shell(`<div class="page-head"><div><h1>Dashboard RH / Ouvidoria</h1><p>Fila operacional de casos sensíveis, recorrências, conflitos de interesse e retaliação.</p></div></div>

  <div class="grid g4">
    ${metric("5","Casos sensíveis","⚠")}
    ${metric("3","Precisam de validação","✦")}
    ${metric("2","Conflitos de interesse","⛔")}
    ${metric("1","Retaliação em avaliação","!")}
  </div>

  <div class="section-head"><h2>Exigem ação agora</h2></div>
  <div class="grid g3">
    <div class="card">
      <h3>#1047 — Possível assédio moral</h3>
      <p style="color:var(--muted)">A análise automatizada foi concluída e aguarda validação humana.</p>
      <div class="actions"><button class="btn btn-primary" onclick="go('triage')">Validar triagem</button></div>
    </div>
    <div class="card">
      <h3>#1045 — Conflito de interesse</h3>
      <p style="color:var(--muted)">O gestor citado no relato não pode tratar o próprio caso.</p>
      <div class="actions"><button class="btn btn-danger" onclick="openCase('#1045')">Revisar encaminhamento</button></div>
    </div>
    <div class="card">
      <h3>#1044 — Recorrência alta</h3>
      <p style="color:var(--muted)">Relatos semelhantes vêm se repetindo no setor Operações.</p>
      <div class="actions"><button class="btn btn-light" onclick="go('recurrenceView')">Ver recorrência</button></div>
    </div>
  </div>

  <div class="section-head"><h2>Fila sensível</h2></div>
  ${casesTable(CASES.filter(c=>c.origin==="Colaborador"))}`);
}
function sensitiveQueue(){return shell(`<div class="page-head"><div><h1>Casos sensíveis</h1><p>Fila específica da Ouvidoria/RH.</p></div><button class="btn btn-light" onclick="go('triage')">Ir para validação da IA</button></div>${casesTable(CASES.filter(c=>c.origin==="Colaborador"))}`)}
function identityVault(){
  return shell(`<div class="page-head"><div><h1>Cofre de identidade</h1><p>Identidade separada logicamente do conteúdo do relato.</p></div></div>
  <div class="card">
    <div class="notice danger">Acesso simulado restrito. Toda consulta de identidade sensível deve gerar log de acesso.</div>
    <div class="table-wrap" style="margin-top:14px"><table><thead><tr><th>Protocolo</th><th>Modalidade</th><th>Identidade</th><th>Motivo de acesso</th><th>Ação</th></tr></thead>
    <tbody>
      <tr><td>#1045</td><td>Confidencial</td><td>Protegida</td><td><input placeholder="Justifique o acesso"></td><td><button class="btn btn-danger">Solicitar acesso</button></td></tr>
      <tr><td>#1047</td><td>Anônima</td><td>Sem associação direta</td><td>—</td><td><button class="btn btn-light" disabled>Indisponível</button></td></tr>
    </tbody></table></div>
  </div>`);
}
function triage(){
  return shell(`<div class="page-head"><div><h1>Validação humana da triagem</h1><p>Protocolo #1047 • a IA auxilia, o humano valida e o sistema registra.</p></div></div>
  <div class="ai-panel">
    <div class="compare">
      <div><h3>Relato original</h3><div class="box">“Meu gestor tem me exposto na frente dos colegas e isso já aconteceu várias vezes. Tenho receio de sofrer represália se ele souber que fui eu.”</div></div>
      <div><h3>Versão padronizada pela IA</h3><div class="box">Relato de possível conduta abusiva recorrente envolvendo liderança direta, com receio de retaliação e potencial impacto psicossocial.</div></div>
    </div>
    <div class="grid g4" style="margin-top:14px">
      <div class="info"><small>Categoria sugerida</small><strong>Conduta / risco psicossocial</strong></div>
      <div class="info"><small>Gravidade individual</small><strong>Alta</strong></div>
      <div class="info"><small>Recorrência</small><strong>Alta</strong></div>
      <div class="info"><small>Prioridade sugerida</small>${tagPriority("Crítica")}</div>
    </div>
    <div class="info" style="margin-top:12px"><small>Possíveis casos semelhantes</small><strong>#1045 • mesmo tema e relação hierárquica; #1036 • padrão semelhante no setor</strong></div>
  </div>

  <div class="card" style="margin-top:16px">
    <h3>Decisão humana</h3>
    <div class="form-grid">
      <div class="field"><label>Categoria final</label><select><option>Conduta / risco psicossocial</option><option>Processo interno</option><option>Outro</option></select></div>
      <div class="field"><label>Prioridade final</label><select><option>Crítica</option><option>Alta</option><option>Média</option><option>Baixa</option></select><span class="help">Níveis usados apenas para demonstração; a squad ainda precisa validar a escala oficial.</span></div>
      <div class="field"><label>Encaminhar para</label><select><option>RH / Ouvidoria</option><option>Superior hierárquico autorizado</option><option>Compliance</option></select></div>
      <div class="field"><label>Conflito de interesse detectado?</label><select><option>Sim — gestor citado no relato</option><option>Não</option></select></div>
      <div class="field full"><label>Justificativa da validação / alteração</label><textarea placeholder="Obrigatória para decisões sensíveis ou alteração da sugestão da IA..."></textarea></div>
    </div>
    <div class="notice warning" style="margin-top:13px">A análise da IA e a decisão humana ficam preservadas na trilha de auditoria.</div>
    <div class="actions" style="justify-content:flex-end;margin-top:14px"><button class="btn btn-primary" onclick="openCase('#1047')">Validar e encaminhar</button></div>
  </div>`);
}

function recurrenceView(){
  return shell(`<div class="page-head"><div><h1>Recorrência de relatos</h1><p>Visão para identificar padrões sem depender apenas da gravidade individual.</p></div><button class="btn btn-light" onclick="go('ombudsmanDashboard')">← Voltar</button></div>

  <div class="grid g3">
    ${metric("7","Relatos semelhantes","↻")}
    ${metric("60 dias","Período observado","◷")}
    ${metric("Operações","Setor com maior repetição","◫")}
  </div>

  <div class="card" style="margin-top:16px">
    <h3>Padrão identificado</h3>
    <div class="notice warning"><strong>Falha recorrente de comunicação — Operações</strong><br>Ocorrências individualmente simples aparecem com frequência suficiente para exigir nova avaliação.</div>
    <div class="table-wrap" style="margin-top:14px"><table>
      <thead><tr><th>Protocolo</th><th>Assunto</th><th>Gravidade</th><th>Data</th><th>Relação</th></tr></thead>
      <tbody>
        <tr><td>#1044</td><td>Falha recorrente de comunicação</td><td>Baixa</td><td>09/09/2026</td><td><span class="tag purple">Muito semelhante</span></td></tr>
        <tr><td>#1036</td><td>Informações divergentes entre equipes</td><td>Baixa</td><td>22/08/2026</td><td><span class="tag yellow">Semelhante</span></td></tr>
        <tr><td>#1029</td><td>Falta de retorno entre setores</td><td>Média</td><td>10/08/2026</td><td><span class="tag yellow">Semelhante</span></td></tr>
      </tbody>
    </table></div>
    <div class="actions" style="justify-content:flex-end;margin-top:14px"><button class="btn btn-primary">Solicitar nova avaliação de prioridade</button></div>
  </div>`);
}

function whoAggregate(){
  return shell(`<div class="page-head"><div><h1>Indicadores agregados de bem-estar</h1><p>Visão coletiva, sem exposição individual desnecessária.</p></div></div>
  <div class="grid g3">${metric("68","Índice agregado demonstrativo","♡")}${metric("74%","Participação","▦")}${metric("3","Setores com atenção","⚠")}</div>
  <div class="card" style="margin-top:16px">
    <h3>Resumo por setor</h3><div class="kpi-list">
      <div class="kpi"><span>RH</span><strong>61</strong></div><div class="kpi"><span>Financeiro</span><strong>73</strong></div><div class="kpi"><span>Operações</span><strong>65</strong></div><div class="kpi"><span>TI</span><strong>78</strong></div>
    </div>
  </div><div class="notice" style="margin-top:14px">A finalidade, política de retenção e regras de acesso desses dados ainda devem ser validadas oficialmente.</div>`);
}

/* ----------------------------- CASO / TRATAMENTO ----------------------------- */
function caseDetail(){
  const c=caseById();
  const isAdmin=state.role==="admin";
  const isAuditor=state.role==="auditor";
  return shell(`<div class="page-head">
    <div><h1>${c.id} — ${c.subject}</h1><p>${c.kind} • ${c.sector} • ${tagPriority(c.priority)} ${tagStatus(c.status)}</p></div>
    <div class="actions">${!isAdmin&&!isAuditor?`<button class="btn btn-primary">Registrar andamento</button>`:""}</div>
  </div>

  ${isAdmin?`<div class="notice danger">Como Administrador técnico, você não possui acesso automático ao conteúdo sigiloso. Esta tela mostra somente metadados administrativos.</div>`:""}

  ${c.id==="#1045" && (state.role==="gestor" || state.role==="ouvidoria") ? `<div class="notice danger" style="margin-bottom:16px"><strong>⛔ Encaminhamento bloqueado por possível conflito de interesse.</strong><br>O gestor citado no relato não pode analisar, responder ou encerrar este caso. O tratamento deve seguir para RH/Ouvidoria ou outro nível autorizado.</div>`:""}

  <div class="grid g2" style="margin-top:${isAdmin?'14px':'0'}">
    <div class="card"><h3>Dados do caso</h3><div class="info-list">
      <div class="info"><small>Origem</small><strong>${c.origin}</strong></div>
      <div class="info"><small>Categoria</small><strong>${c.category}</strong></div>
      <div class="info"><small>Gravidade</small><strong>${c.gravity}</strong></div>
      <div class="info"><small>Recorrência</small><strong>${c.recurrence}</strong></div>
      <div class="info"><small>Prioridade</small>${tagPriority(c.priority)}</div>
    </div></div>
    <div class="card"><h3>Conteúdo</h3>
      ${isAdmin?`<div class="locked"><strong>🔒 Conteúdo sigiloso indisponível</strong><p>Administração técnica não significa acesso irrestrito ao relato.</p></div>`:
      `<p style="color:var(--muted);line-height:1.65">Relato registrado no sistema. A versão original é preservada, mesmo quando existe versão padronizada pela IA.</p>
       <div class="locked"><strong>Identidade</strong><p>${state.role==="ouvidoria"?"Acesso condicionado à modalidade de sigilo e autorização específica.":"Não necessária para esta função."}</p></div>`}
    </div>
  </div>

  <div class="card" style="margin-top:16px"><h3>Status e histórico</h3>
    <div class="status-flow">${ALL_STATUSES.map(s=>`<span class="status-step ${s===c.status?'current':''}">${s}</span>`).join("")}</div>
    <div class="timeline" style="margin-top:16px">
      <div class="timeline-item"><div class="dot"></div><div><strong>Relato registrado</strong><p>Registro original preservado.</p></div></div>
      <div class="timeline-item"><div class="dot"></div><div><strong>IA realizou triagem</strong><p>Categoria, prioridade e recorrência sugeridas.</p></div></div>
      <div class="timeline-item"><div class="dot"></div><div><strong>Validação humana</strong><p>Decisão e justificativa registradas.</p></div></div>
      <div class="timeline-item"><div class="dot"></div><div><strong>Encaminhamento</strong><p>Responsável atual definido sem conflito de interesse.</p></div></div>
    </div>
  </div>

  ${!isAdmin&&!isAuditor?`<div class="card" style="margin-top:16px"><h3>Tratamento</h3>
    <div class="form-grid">
      <div class="field"><label>Novo status</label><select>${ALL_STATUSES.map(s=>`<option ${s===c.status?'selected':''}>${s}</option>`).join("")}</select></div>
      <div class="field"><label>Responsável</label><select><option>Responsável atual</option><option>RH / Ouvidoria</option><option>Superior autorizado</option></select></div>
      <div class="field full"><label>Observação / justificativa</label><textarea placeholder="Registre a ação tomada e o motivo..."></textarea></div>
      <div class="field full"><label>Motivo de encerramento / reabertura</label><input placeholder="Obrigatório quando aplicável"></div>
    </div>
    <div class="notice" style="margin-top:13px">Alterações de prioridade, categoria, responsável, status e encerramento são auditadas.</div>
  </div>`:""}`);
}

/* ----------------------------- AUDITOR ----------------------------- */
function auditDashboard(){
  return shell(`<div class="page-head"><div><h1>Dashboard do Auditor</h1><p>Histórico, prazos, alterações, justificativas e registros de acesso.</p></div></div>
  <div class="grid g4">${metric("142","Eventos auditáveis","⌘")}${metric("9","Alterações sensíveis","⚠")}${metric("3","Acessos a identidade","🔒")}${metric("2","Casos sem justificativa completa","! ")}</div>
  <div class="section-head"><h2>Verificações recentes</h2></div>
  <div class="audit-log">[09/09/2026 17:54] VISUALIZAÇÃO | protocolo #1045 | perfil: RH/Ouvidoria<br>
[09/09/2026 17:48] PRIORIDADE | #1047 | Alta → Crítica | justificativa registrada<br>
[09/09/2026 17:47] IA | #1047 | sugestão: categoria Conduta/Risco psicossocial<br>
[09/09/2026 17:45] ACESSO_IDENTIDADE | #1045 | autorizado | motivo registrado<br>
[09/09/2026 16:20] RESPONSÁVEL | #1044 | Operações → Ouvidoria | recorrência alta</div>`);
}
function auditCases(){return shell(`<div class="page-head"><div><h1>Casos auditáveis</h1><p>Metadados necessários para verificar o tratamento, sem exigir identidade por padrão.</p></div></div>${casesTable(CASES)}`)}
function auditTrail(){
  return shell(`<div class="page-head"><div><h1>Trilha de auditoria</h1><p>Histórico legível das decisões e ações relevantes do caso.</p></div></div>

  <div class="card">
    <div class="timeline">
      <div class="timeline-item"><div class="dot"></div><div><strong>18:02 — Status alterado</strong><p>#1045: Encaminhada → Em análise • por Mariana Lima • motivo registrado</p></div></div>
      <div class="timeline-item"><div class="dot"></div><div><strong>17:59 — Responsável alterado</strong><p>#1045: RH Central → Mariana Lima • por Ana Ribeiro</p></div></div>
      <div class="timeline-item"><div class="dot"></div><div><strong>17:57 — Prioridade alterada</strong><p>#1045: Média → Alta • justificativa: recorrência e relação hierárquica</p></div></div>
      <div class="timeline-item"><div class="dot"></div><div><strong>17:56 — Validação humana</strong><p>Sugestão da IA confirmada parcialmente e decisão preservada.</p></div></div>
      <div class="timeline-item"><div class="dot"></div><div><strong>17:55 — Triagem automatizada</strong><p>Categoria sugerida: Conduta / risco psicossocial.</p></div></div>
      <div class="timeline-item"><div class="dot"></div><div><strong>17:54 — Caso criado</strong><p>Relato original preservado no sistema.</p></div></div>
    </div>
  </div>

  <div class="notice" style="margin-top:14px">A trilha mantém quem realizou a ação, quando, valor anterior, valor posterior e justificativa quando aplicável.</div>`);
}
function accessLogs(){
  return shell(`<div class="page-head"><div><h1>Logs de acesso</h1><p>Quem visualizou informações sensíveis, quando e por qual motivo.</p></div></div>
  <div class="card"><div class="table-wrap"><table><thead><tr><th>Data/hora</th><th>Usuário</th><th>Perfil</th><th>Recurso</th><th>Motivo</th></tr></thead><tbody>
    <tr><td>09/09 17:45</td><td>Ana Ribeiro</td><td>RH/Ouvidoria</td><td>Identidade #1045</td><td>Validação de conflito de interesse</td></tr>
    <tr><td>09/09 16:40</td><td>Roberto Silva</td><td>Auditor</td><td>Histórico #1044</td><td>Verificação de alteração de prioridade</td></tr>
  </tbody></table></div></div>`);
}

/* ----------------------------- ADMIN TÉCNICO ----------------------------- */
function adminDashboard(){
  return shell(`<div class="page-head"><div><h1>Administração técnica</h1><p>Configuração da plataforma, sem acesso automático ao conteúdo sigiloso.</p></div></div>
  <div class="grid g4">${metric("3","Empresas","▣")}${metric("18","Setores","◫")}${metric("86","Usuários","👤")}${metric("6","Perfis de acesso","🔑")}</div>
  <div class="notice danger" style="margin-top:16px">Este perfil administra a plataforma. Ele não recebe, por padrão, permissão para abrir relatos confidenciais ou identidades protegidas.</div>
  <div class="section-head"><h2>Configurações rápidas</h2></div>
  <div class="quick"><button onclick="go('companies')">▣<strong>Empresas</strong></button><button onclick="go('sectors')">◫<strong>Setores</strong></button><button onclick="go('users')">👤<strong>Usuários</strong></button><button onclick="go('permissions')">🔑<strong>Permissões</strong></button></div>`);
}
function companies(){return shell(`<div class="page-head"><div><h1>Empresas</h1><p>Estrutura preparada para múltiplas organizações.</p></div><button class="btn btn-primary">+ Nova empresa</button></div><div class="card"><div class="table-wrap"><table><thead><tr><th>Empresa</th><th>Status</th><th>Setores</th><th>Usuários</th></tr></thead><tbody><tr><td>Empresa de demonstração</td><td>${tagStatus("Em análise").replace("Em análise","Ativa")}</td><td>6</td><td>38</td></tr><tr><td>Organização B</td><td><span class="tag green">Ativa</span></td><td>5</td><td>29</td></tr></tbody></table></div></div>`)}
function sectors(){return shell(`<div class="page-head"><div><h1>Setores e responsáveis</h1><p>Cadastro usado no encaminhamento dos casos.</p></div><button class="btn btn-primary">+ Novo setor</button></div><div class="grid g3">${["RH","Ouvidoria","Financeiro","Atendimento","Operações","TI"].map(x=>`<div class="card"><h3>${x}</h3><p style="color:var(--muted)">Responsáveis configuráveis por empresa.</p><button class="btn btn-light">Gerenciar</button></div>`).join("")}</div>`)}
function users(){return shell(`<div class="page-head"><div><h1>Usuários</h1><p>Cadastro de contas e associação a perfis.</p></div><button class="btn btn-primary">+ Novo usuário</button></div><div class="card"><div class="table-wrap"><table><thead><tr><th>Usuário</th><th>Perfil</th><th>Setor</th><th>Status</th></tr></thead><tbody><tr><td>Ana Ribeiro</td><td>RH/Ouvidoria</td><td>Ouvidoria</td><td><span class="tag green">Ativo</span></td></tr><tr><td>Paulo Mendes</td><td>Gestor</td><td>Operações</td><td><span class="tag green">Ativo</span></td></tr><tr><td>Roberto Silva</td><td>Auditor</td><td>Auditoria</td><td><span class="tag green">Ativo</span></td></tr></tbody></table></div></div>`)}
function permissions(){
  return shell(`<div class="page-head"><div><h1>Perfis e permissões</h1><p>Aplicação da regra de acesso mínimo.</p></div></div>
  <div class="grid g3">
    <div class="card"><h3>Gestor</h3><p style="color:var(--muted)">Casos atribuídos ao setor, exceto conflito de interesse.</p></div>
    <div class="card"><h3>RH/Ouvidoria</h3><p style="color:var(--muted)">Casos sensíveis e confidenciais conforme autorização.</p></div>
    <div class="card"><h3>Auditor</h3><p style="color:var(--muted)">Histórico e logs, sem identidade por padrão.</p></div>
    <div class="card"><h3>Administrador técnico</h3><p style="color:var(--muted)">Configurações, sem leitura automática de conteúdo sigiloso.</p></div>
    <div class="card"><h3>Direção</h3><p style="color:var(--muted)">Indicadores agregados e anonimizados.</p></div>
    <div class="card"><h3>Cliente/Colaborador</h3><p style="color:var(--muted)">Somente seus próprios protocolos e canais de retorno.</p></div>
  </div>`);
}
function systemSettings(){
  return shell(`<div class="page-head"><div><h1>Configurações gerais</h1><p>Itens de demonstração que ainda precisam de validação oficial.</p></div></div>
  <div class="card"><div class="form-grid">
    <div class="field"><label>Níveis oficiais de prioridade</label><input value="A validar pela squad" disabled></div>
    <div class="field"><label>Política de prazos / SLA</label><input value="A validar pela squad" disabled></div>
    <div class="field"><label>Retenção de anexos</label><input value="A definir" disabled></div>
    <div class="field"><label>Quem pode reabrir/encerrar</label><input value="A validar" disabled></div>
    <div class="field"><label>Triagem com IA</label><select><option>Ativa com validação humana obrigatória</option></select></div>
    <div class="field"><label>Denúncia anônima</label><select><option>Disponível no protótipo</option></select></div>
  </div></div>`);
}

/* ----------------------------- DIREÇÃO ----------------------------- */
function strategyDashboard(){
  return shell(`<div class="page-head"><div><h1>Visão estratégica</h1><p>Indicadores agregados e anonimizados, sem exposição desnecessária de identidades.</p></div></div>
  <div class="grid g4">${metric("142","Manifestações no período","▦")}${metric("28%","Temas recorrentes","↻")}${metric("76%","Casos resolvidos","✓")}${metric("4","Setores com alerta","⚠")}</div>
  <div class="grid g2" style="margin-top:16px">
    <div class="card"><h3>Volume mensal</h3><div class="bar-chart">${[70,92,88,120,105,145,132,170].map(v=>`<div class="bar" style="height:${v}px"></div>`).join("")}</div></div>
    <div class="card"><h3>Tendências</h3><div class="kpi-list"><div class="kpi"><span>Conduta / risco psicossocial</span><strong>↑</strong></div><div class="kpi"><span>Atendimento ao cliente</span><strong>→</strong></div><div class="kpi"><span>Processos internos</span><strong>↑</strong></div><div class="kpi"><span>Financeiro</span><strong>↓</strong></div></div></div>
  </div>
  <div class="notice" style="margin-top:15px">Esta visão não exibe nomes de denunciantes, pessoas envolvidas ou conteúdo individual de relatos.</div>`);
}
function strategyIndicators(){return shell(`<div class="page-head"><div><h1>Indicadores agregados</h1><p>Distribuição sem dados pessoais desnecessários.</p></div></div><div class="grid g3">${metric("41%","Reclamações externas","▦")}${metric("27%","Denúncias internas","⚠")}${metric("32%","Outros registros","◉")}</div>`)}
function trendReport(){return shell(`<div class="page-head"><div><h1>Tendências e recorrência</h1><p>Problemas repetidos ganham visibilidade mesmo quando cada ocorrência isolada é de baixa gravidade.</p></div></div><div class="card"><div class="kpi-list"><div class="kpi"><span>Falha de comunicação — Operações</span><strong>Recorrência alta</strong></div><div class="kpi"><span>Demora no atendimento — Cliente</span><strong>Recorrência alta</strong></div><div class="kpi"><span>Conduta de liderança — RH</span><strong>Gravidade + recorrência elevadas</strong></div></div></div>`)}

/* ----------------------------- HELPERS ----------------------------- */
function chatScreen(title,messages){
  return `<div class="page-head"><div><h1>${title}</h1><p>Mensagens ficam vinculadas ao protocolo e preservadas no histórico.</p></div></div>
  <div class="card"><div class="bubble-list">${messages.map(([who,text])=>`<div class="bubble ${who==="me"?"me":""}">${text}</div>`).join("")}</div>
  <div class="chat-input"><input placeholder="Digite uma mensagem..."><button class="btn btn-primary">Enviar</button></div></div>`;
}

function render(){
  if(!state.portal){login();return;}
  if(state.portal==="gestao" && !state.role){managementLogin();return;}
  const pages={
    clientHome,clientNew,clientProtocols,clientProtocolDetail,clientSolution,clientMessages,clientReports,clientProfile,
    employeeHome,employeeNew,employeeProtocols,employeeProtocolDetail,employeeMessages,employeeFollowup,employeeProfile,who5,
    managerDashboard,assignedCases,managementMessages,
    ombudsmanDashboard,sensitiveQueue,identityVault,triage,recurrenceView,whoAggregate,
    caseDetail,
    auditDashboard,auditCases,auditTrail,accessLogs,
    adminDashboard,companies,sectors,users,permissions,systemSettings,
    strategyDashboard,strategyIndicators,trendReport
  };
  document.getElementById("app").innerHTML=(pages[state.page]||pages[defaultPage()])();
}
render();
