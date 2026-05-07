# Case Técnico: Portal de Ofertas e Contratação (PJ)

Este projeto implementa um módulo web voltado para o aumento de conversão (_growth_) de clientes PJ através de ofertas personalizadas. A solução foca em resiliência de dados, segurança server-side e arquitetura escalável.

## 🏗 Desenho da Solução (Arquitetura)

```mermaid
graph TD
    User([Usuário]) --> Proxy[Next.js Proxy /proxy.ts]
    Proxy --> Auth{JWT Check / Refresh}
    Auth --> App[Next.js App Router]

    subgraph "Camadas do Front-end"
        App --> Pages[Páginas /app]
        Pages --> Feature[Features /feature]

        subgraph "Módulo de Negócio"
            Feature --> Components[Componentes UI]
            Feature --> Hooks[Custom Hooks / React Query]
            Hooks --> API[Services / API / Fetch]
            Hooks --> Store[Zustand Store / Persistence]
        end
    end

    API --> BFF[API Routes /api/portal]
    Store --> Persistence[(LocalStorage)]
```

### Decisões de Arquitetura

- **React 19 + Next.js 16 (App Router)**: Escolha baseada em performance (Server Components) e na robustez do novo padrão de Proxy para segurança.
- **Next.js 16 Proxy Pattern**: Autenticação transparente via servidor. O `proxy.ts` gerencia o ciclo de vida do JWT (refresh automático) sem expor lógica de renovação ao cliente.
- **Zustand + Persistência**: Gerenciamento de rascunhos de simulação. Implementado via _Factory Pattern_ para suportar múltiplos rascunhos isolados por oferta e por usuário.
- **TanStack Query v5**: Gestão eficiente de _Server State_, cache e sincronização.

## 🛠 Funcionalidades Entregues

1.  **Lista de Ofertas**: Grid de cards com filtros por categoria e tratamento de estados (Loading, Empty, Error).
2.  **Detalhe da Oferta**: Visão aprofundada com justificativa personalizada ("Por que esta oferta é para você").
3.  **Fluxo de Simulação (3 Etapas)**:
    - **Dados**: Seleção de valores e prazos.
    - **Revisão**: Verificação de taxas e parcelas.
    - **Confirmação**: Aceite de termos e geração de protocolo.
4.  **Resiliência (Retomada)**: Se o usuário sair no meio da simulação, o estado é recuperado automaticamente ao retornar para a mesma oferta e modifica componente pai.

## 🔐 Estratégias de Qualidade

- **Refresh Token Transparente**: Implementado no `proxy.ts` garantindo que a sessão seja renovada sem interrupções de UX.
- **Feature Flags**: Lógica de segmentação (VAREJO, PRIVATE) integrada diretamente na visibilidade de CTAs e acesso a rotas.
- **Estratégia de Testes**: Foco em testes unitários para Feature Flags e testes de integração para o fluxo de persistência (Simulation Store).

## 🔧 Como Executar

1.  `npm install`
2.  Configurar `.env.local`: `JWT_SECRET=sua_chave`
3.  `npm run dev`

---

_Este projeto demonstra competências técnicas em arquitetura front-end moderna._
