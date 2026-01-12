import { Task, ColumnType } from './types';

export const COLUMNS: ColumnType[] = [
  { id: 'Ideias', title: 'Ideias', color: 'yellow-400' },
  { id: 'Roteiro', title: 'Roteiro', color: 'blue-400' },
  { id: 'Produção', title: 'Produção', color: 'purple-400' },
  { id: 'Publicado', title: 'Publicado', color: 'green-400' },
];

// Priority Translations
export const PRIORITY_LABELS: Record<string, string> = {
  'High Priority': 'Alta',
  'Low Priority': 'Baixa',
  'Medium': 'Média',
  'Sponsored': 'Patrocinado',
  'Draft': 'Rascunho',
  'Editing': 'Edição',
  'Posted': 'Publicado'
};

export const DEFAULT_CHECKLIST = [
  { id: 'c1', text: 'Gancho (Hook)', checked: false },
  { id: 'c2', text: 'Chamada para Ação (CTA)', checked: false },
  { id: 'c3', text: 'Legenda Revisada', checked: false },
  { id: 'c4', text: 'Hashtags Estratégicas', checked: false },
];

// Initial tasks removed - using Supabase DB