import { Task, ColumnType } from './types';

export const COLUMNS: ColumnType[] = [
  { id: 'Ideias', title: 'Ideias', color: 'yellow-400' },
  { id: 'Roteiro', title: 'Roteiro', color: 'blue-400' },
  { id: 'Produção', title: 'Produção', color: 'purple-400' },
  { id: 'Publicado', title: 'Publicado', color: 'green-400' },
];

const DEFAULT_CHECKLIST = [
  { id: 'c1', text: 'Gancho (Hook)', checked: false },
  { id: 'c2', text: 'Chamada para Ação (CTA)', checked: false },
  { id: 'c3', text: 'Legenda Revisada', checked: false },
  { id: 'c4', text: 'Hashtags Estratégicas', checked: false },
];

export const INITIAL_TASKS: Task[] = [
  // Ideias
  {
    id: '1',
    title: 'Review: iPhone 15 Pro Max vs S24 Ultra',
    platform: 'YouTube',
    priority: ['High Priority', 'Sponsored'],
    status: 'Ideias',
    description: 'Comparativo detalhado focando em câmeras, bateria e usabilidade no dia a dia para criadores de conteúdo.',
    checklist: DEFAULT_CHECKLIST,
  },
  {
    id: '2',
    title: 'Top 5 Apps de Produtividade 2024',
    platform: 'Instagram',
    priority: ['Low Priority'],
    status: 'Ideias',
    description: 'Carrossel rápido mostrando apps essenciais: Notion, Linear, Arc Browser, cron, e Raycast.',
    checklist: DEFAULT_CHECKLIST,
  },
  {
    id: '3',
    title: 'Sessão Q&A: Respondendo Perguntas',
    platform: 'TikTok',
    priority: ['Medium'],
    status: 'Ideias',
    description: 'Responder perguntas da caixinha do Instagram em formato de vídeo curto.',
    checklist: DEFAULT_CHECKLIST,
  },
  
  // Roteiro
  {
    id: '4',
    title: 'Tour do Setup 2024 - Upgrade',
    platform: 'YouTube',
    priority: ['Sponsored', 'High Priority'],
    status: 'Roteiro',
    description: 'Vídeo patrocinado pela marca de periféricos. Mostrar o antes e depois do setup.',
    checklist: DEFAULT_CHECKLIST,
  },
  {
    id: '5',
    title: 'Como começar um blog em 2024',
    platform: 'Blog',
    priority: ['Draft'],
    status: 'Roteiro',
    description: 'Artigo longo (2000 palavras) sobre CMS, SEO básico e nicho.',
    checklist: DEFAULT_CHECKLIST,
  },
  // The Stagnant Card
  {
    id: '99',
    title: 'Revisão de Estratégia Q3',
    platform: 'Blog',
    priority: [],
    status: 'Roteiro',
    isStagnant: true,
    comments: 3,
    attachments: 1,
    description: 'Revisão trimestral de métricas e planejamento de pautas para o próximo trimestre.',
    checklist: DEFAULT_CHECKLIST,
    assigneeAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy5wsL6O8Pwbco7uSBwsVvMCMRwm_vkpmJAbRlwoIK_TbdAjVR1wfjRiAEY-le7D2aw2C1CiDpY4mbcJ7HLG8ygpDzq5i-oR6fTD41WPO4OuaClMfS3D8JDmUwQIwzRXN2Uf2tE8deywy8B6i8PnrXVJMYwq-DHv9WkpVtQsUyvV1X909-h-09QdCQCbtAvE43Hr7I40zaHASyNPuZZFYeQsq-aIsz8HLKaiErdTSypBaWnaKoME-nIHp9rxWu3HNBzaTKGVP7lQjm'
  },

  // Produção
  {
    id: '6',
    title: 'Codando um Portfólio em 1 Hora',
    platform: 'YouTube',
    priority: ['Editing'],
    status: 'Produção',
    description: 'Tutorial "Speedrun" codando um portfólio minimalista usando React e Tailwind.',
    checklist: DEFAULT_CHECKLIST,
  },

  // Publicado
  {
    id: '7',
    title: 'Um dia na vida de um Designer',
    platform: 'YouTube',
    priority: ['Posted'],
    status: 'Publicado',
    date: 'há 2d',
    description: 'Vlog mostrando a rotina de trabalho remoto e projetos pessoais.',
    checklist: DEFAULT_CHECKLIST,
  },
  {
    id: '8',
    title: 'Meu Setup de Mesa 2023',
    platform: 'YouTube',
    priority: ['Posted'],
    status: 'Publicado',
    date: 'há 5d',
    description: 'Versão anterior do setup tour.',
    checklist: DEFAULT_CHECKLIST,
  },
];