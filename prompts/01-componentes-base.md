# 01 · Componentes base

```
# CONTEXTO
MVP "Coach" (treino e nutrição) em React 19 + Vite + Tailwind 4, TypeScript. Backend: Supabase.
Tokens do projeto no @theme do Tailwind: primary #5938db, accent #006b8e, bg #f5f3ff, ink #201d31,
muted #625e75, line #e5e1f1, ok/warn/danger com versão "soft".

# TAREFA
Gere os componentes base reutilizáveis:
- Button: variants primary, secondary, ghost, danger; size md/sm; foco visível
- Input, Textarea, Select: controlados, com label, mensagem de erro e dica; aria-invalid e aria-describedby
- Card e CardButton (card inteiro clicável, hover com elevação)
- Badge: success, warning, neutral
- LoadingState (skeleton), EmptyState (ícone, título, descrição, CTA), ErrorState (mensagem + tentar novamente)
- Modal com <dialog> nativo; bottom sheet no celular

# QUEM
Desenvolvedor front-end sênior em React + Tailwind e acessibilidade.

# FORMATO
Um arquivo .tsx por componente em src/components/ui, tipos explícitos, sem default export.
```
