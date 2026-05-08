# Design System — Portal de Ofertas PJ

## Escolha: Shadcn UI + Tailwind CSS 4

Shadcn UI foi escolhido por ser **não-opinionated no estilo, mas sólido na estrutura**. Cada componente é copiado diretamente para o projeto (`src/components/ui/`), permitindo customização total sem depender de overrides de biblioteca.

## Tokens (CSS Variables)

Todos os tokens de cor ficam em `src/app/globals.css`. Para mapear a identidade visual do banco, basta criar valores ou atualizar os valores de:

```css
--primary         /* cor de ação principal (botão, link, destaque) */
--secondary       /* fundo de sidebar e paineis secundários */
--background      /* fundo geral da aplicação */
--foreground      /* texto principal */
--muted           /* texto e fundo de estados neutros */
--destructive     /* erros e alertas */
```

## Governança

| Regra                         | Detalhe                                                                     |
| ----------------------------- | --------------------------------------------------------------------------- |
| **Onde ficam os componentes** | `src/components/ui/` (Shadcn) e `src/components/shared/` (customizados)     |
| **Novos componentes**         | Discutidos em PR antes de criados; devem usar os tokens acima               |
| **Não sobrescrever Tailwind** | Preferir variáveis CSS; evitar cores hardcoded (`text-blue-500`)            |
| **Dark mode**                 | Suportado via `prefers-color-scheme` nas variáveis CSS                      |
| **Acessibilidade**            | Todos os botões interativos devem ter `aria-label` quando sem texto visível |
| **Transições (React 19)**     | Usar `useTransition` para filtros e navegação interna para manter a UI responsiva |
| **Feedback Otimista**         | Usar `useOptimistic` em ações de contratação/favorito para percepção de velocidade |

## Checklist a11y (antes de subir)

- [ ] Contraste de texto ≥ 4.5:1 (WCAG AA)
- [ ] Navegação por teclado testada nos fluxos de simulação e login
- [ ] Botões com ícone apenas têm `aria-label`
- [ ] Ícones puramente visuais marcados com `aria-hidden="true"`
- [ ] Estados de seleção (filtros) indicados via `aria-pressed` ou `aria-current`
- [ ] Estados de loading não bloqueiam leitores de tela e usam indicadores visuais sutis
- [ ] Inputs de range (sliders) possuem `aria-valuenow` e rótulos claros
