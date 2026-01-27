# Product Requirements Document (PRD) — Creator Flow

## 1. Introdução e Visão Geral
O **Creator Flow** é um sistema de gerenciamento de tarefas baseado na metodologia **Kanban**, desenvolvido com foco em alta fidelidade visual e experiência de usuário (UX) premium para criadores de conteúdo.

### 1.1 Objetivo
Permitir o gerenciamento fluido do ciclo de vida de conteúdos (Ideia -> Roteiro -> Produção -> Publicado), eliminando fricções operacionais através de uma interface estética, minimalista e altamente funcional.

### 1.2 Diferenciais
- **Design Premium**: Visual moderno com foco em densidade de informação inteligente.
- **Interatividade**: Uso intensivo de micro-animações e feedback visual instantâneo.
- **Modo Zen**: Interface focada para minimizar distrações.
- **Performance**: Atualizações otimistas e transições suaves.

---

## 2. Design System & Identidade Visual

### 2.1 Tipografia
- **Fonte Principal**: `Inter` (sans-serif) para legibilidade superior.
- **Headings**: `font-weight: 800/900` (Black/ExtraBold) para uma hierarquia visual forte.
- **Body**: `font-weight: 400/500` para textos de leitura.
- **Display**: Uso estratégico de `font-display` para elementos de impacto.

### 2.2 Cores & Tema (Dark Mode Default)
A aplicação utiliza o ecossistema `shadcn/ui` aliado ao Tailwind CSS.
- **Fundo (Background)**: `bg-background` (Tons de cinza muito escuro/preto).
- **Cards**: `bg-card` com transparência sutil e bordas finas.
- **Acento Primário**: Dinâmico ou fixo para botões e anéis de foco.

#### Cores de Status
- **Ideias**: `Yellow-500`
- **Roteiro**: `Blue-500`
- **Produção**: `Purple-500`
- **Publicado**: `Green-500`

#### Cores de Plataforma
- **YouTube**: `#EF4444` (Vermelho)
- **Instagram**: `#EC4899` (Rosa/Gradiente)
- **TikTok**: `#FFFFFF` (Branco/Preto)
- **Blog**: `#3B82F6` (Azul)

### 2.3 Efeitos Visuais
- **Glassmorphism**: Aplicação de `backdrop-blur-md` e opacidades (`bg-background/95`) no cabeçalho.
- **Animações**:
    - `animate-fade-in`: Entrada suave de elementos.
    - `animate-zoom-in`: Transição de escala para modais.
    - `transition-all`: Suavidade em hover, redimensionamento e colapso (200ms a 300ms).
- **Sombras**: Camadas de `shadow-md` e `shadow-lg` com cor de acento (`shadow-primary/20`) para profundidade.

---

## 3. Estrutura de Layout e Navegação

### 3.1 Sidebar (Barra Lateral)
- **Comportamento**: Redimensionável via drag na borda direita, colapsável e 100% responsiva.
- **Componentes**:
    - **Perfil do Usuário**: Avatar com anel de hover, nome e email. Colapsa para modo apenas ícone. Indicador de status "Online" (ponto verde).
    - **Navegação**: Links com ícones, estados `active` e `hover` distintos.
    - **Ações de Rodapé**: Botão de "Configurações" que abre um Pop-up customizado com:
        - Troca de Tema (Light/Dark).
        - Ativação do Modo Zen.
        - Alternância de expansão da barra.
        - Logout.

### 3.2 Top Bar (Cabeçalho)
- **Estilo**: Fixa no topo com efeito de desfoque (blur). Ocultada automaticamente no Modo Zen.
- **Elementos**:
    - **Título Dinâmico**: "Meu Fluxo de Trabalho" em H1 Bold.
    - **Botão "Nova Ideia"**: Destaque com `bg-primary`, sombra projetada e ícone que rotaciona no hover.
    - **Filtros de Plataforma**: Sistema de "Pills" arredondados com cores indicativas.
    - **Busca Inteligente**: Input com ícone de lupa e filtro em tempo real por título/tags.

---

## 4. Funcionalidades do Kanban (Board)

### 4.1 Colunas de Fluxo
- **Workflow**: 4 colunas fixas (Ideias, Roteiro, Produção, Publicado).
- **Cabeçalho da Coluna**: Título em caixa alta, contador de tarefas (badge) e indicador visual de status.
- **Drag & Drop**:
    - Feedback visual "Ghost" do item arrastado.
    - Destaque da coluna de destino (`bg-white/[0.03]`).

### 4.2 Card da Tarefa (Task Card)
- **Estrutura**: Borda arredondada, fundo `bg-card` e separador lateral com a cor da plataforma.
- **Interações**:
    - **Hover**: Elevação suave (`-translate-y-1`) e sombra.
    - **Estados Visuais**:
        - **Estagnado**: Borda tracejada e opacidade reduzida.
        - **Publicado**: Ícone de checklist verde e data visível.
- **Ações Rápidas**: Conjunto de ícones que surgem no hover para visualizar detalhes, duplicar ou remover.

---

## 5. Painel de Detalhes (Details Panel)
Área de foco para edição profunda que desliza da borda direita.

### 5.1 UX do Painel
- **Redimensionamento**: Largura ajustável pelo usuário (300px a 800px).
- **Persistência**: Edições são salvas automaticamente ou via gatilhos de desfoco (blur).
- **Estado Vazio**: Feedback visual amigável quando nenhuma tarefa está selecionada.

### 5.2 Edição e Dados
- **Edição Inline**: Título e descrição editáveis diretamente na interface (transforma texto em input/textarea).
- **Gestão de Metadados**:
    - **Popovers Customizados**: Seleção de Plataforma e Status via menus flutuantes que respeitam o posicionamento da janela.
    - **Checklists**: Itens interativos com estilo focado e riscado ao concluir.
    - **Tags Dinâmicas**: Sugestões de tags baseadas na plataforma selecionada.
- **Anexos e Datas**: Seletor de data estilizado para o tema escuro.

---

## 6. Modais e Diálogos

- **EditModal**: Versão em janela para edição, focada em dispositivos menores ou fluxos específicos.
- **ConfirmModal**: Diálogo de segurança para ações destrutivas (Exclusão), com variantes de cores semânticas (ex: Dark/Destructive).
- **Animações de Feedback**: Uso de `Icon` wrappers para suavizar a transição de estados.

---

## 7. Arquitetura e Stack Técnica

- **Frontend**: `React 19` + `Vite` para inicialização rápida.
- **Linguagem**: `TypeScript` para robustez e tipagem estática.
- **Estilização**: `Tailwind CSS` como motor de design.
- **Ícones**: `Google Material Symbols`.
- **Backend/DB**: `Supabase` (PostgreSQL) para persistência e autenticação.
- **Estado**: Hooks customizados (`useTasks`), Context API para autenticação e atualizações otimistas.

---

## 8. Detalhes de Polimento ("O Toque Alice")
1. **Definição de Bordas**: Uso sistemático de `border-white/5` para garantir contraste em fundos escuros.
2. **Scrollbars**: Estilização via `.custom-scrollbar` para não poluir o visual.
3. **Acessibilidade**: Foco visível (`ring-2`) e navegação por teclado nos elementos principais.
4. **Atmosfera**: Gradientes sutis (`bg-gradient-to-b`) para criar profundidade no topo da aplicação.

---
> *Este documento é o guia definitivo para a implementação e evolução do Creator Flow.*
