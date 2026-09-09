# ODR Empresarial — protótipo funcional fiel ao refinamento

Este protótipo prioriza regras, fluxos, perfis e casos de uso. O visual é deliberadamente simples.

## Entradas principais

### 1. Portal do Cliente
- reclamação externa;
- pedido de providência;
- protocolo;
- chat pelo caso;
- proposta de solução;
- decisão do cliente;
- acordo / nova tentativa;
- relatório final.

### 2. Portal do Colaborador
- reclamação ou denúncia interna;
- modalidades identificada, confidencial e anônima;
- cofre de identidade;
- formulário guiado;
- pessoas envolvidas;
- anexos;
- protocolo/chave;
- WHO-5 opcional;
- acompanhamento por linha do tempo;
- canal seguro;
- retirada/reabertura sem exclusão do histórico;
- retorno sobre resolução, retaliação e segurança para reutilizar o canal.

### 3. Painel de Gestão / Auditoria
Subperfis independentes:
- Gestor / Responsável;
- RH / Ouvidoria;
- Auditor;
- Administrador técnico;
- Direção / visão estratégica.

## Regras representadas
- IA auxilia; humano valida; sistema registra.
- Original do relato nunca é substituído pela versão padronizada.
- Gravidade e recorrência são separadas.
- Recorrência pode elevar atenção mesmo quando a gravidade individual é baixa.
- Conflito de interesse impede tratamento por pessoa envolvida.
- Administrador técnico não tem acesso automático ao conteúdo sigiloso.
- Identidade confidencial fica separada do conteúdo.
- Ações sensíveis geram trilha de auditoria.
- Retirada não apaga o relato.
- Reabertura e encerramento preservam motivo/histórico.
- Retaliação gera nova avaliação.
- Direção recebe somente indicadores agregados/anonimizados.

## Como abrir
Extraia o ZIP e abra `index.html` no navegador.

Não há backend, banco de dados ou autenticação real.

## Regra de visibilidade para Cliente e Colaborador

Cliente e colaborador **não visualizam** prioridade, gravidade, recorrência, classificação da IA,
responsável interno, conflito de interesse ou o caminho completo de tratamento.

Esses perfis recebem somente estados simplificados, como:
- Recebida;
- Em tratamento;
- Aguardando sua informação;
- Resposta disponível;
- Concluída;
- Não resolvida;
- Retirada;
- Reaberta.

As informações detalhadas permanecem restritas aos perfis de gestão autorizados.


## Revisão de experiência — v3
- Cliente com menu reduzido a Início, Nova reclamação, Meus protocolos e Meu perfil.
- Colaborador com menu reduzido a Início, Novo relato, Meus protocolos, WHO-5 e Meu perfil.
- Comunicação e respostas ficam dentro do próprio protocolo.
- Protocolo é o centro da experiência para cliente e colaborador.
- Formulário interno mais guiado.
- RH/Ouvidoria ganhou fila de ação imediata.
- Recorrência ganhou tela própria.
- Conflito de interesse gera bloqueio explícito.
- Auditoria ganhou linha do tempo visual.


## Versão mobile
A interface foi adaptada para smartphones:
- menu lateral substituído por navegação inferior;
- cabeçalho compacto;
- cards em uma coluna;
- protocolos de cliente e colaborador exibidos como cartões;
- formulários com campos maiores para toque;
- etapas e chips com rolagem horizontal;
- tabelas administrativas continuam com rolagem horizontal;
- suporte a safe area em iPhone.


## Correção mobile — v5
- menu lateral substituído por drawer/hambúrguer;
- menu inferior limitado aos atalhos principais;
- perfis administrativos não exibem dezenas de opções espremidas;
- cards de protocolo agora mostram rótulos de cada informação;
- login não recebe espaço vazio do menu inferior;
- breakpoint ampliado para 820 px;
- botões, campos e formulários ajustados para toque;
- tabelas internas continuam roláveis sem quebrar o layout.
