export type Platform = 'YouTube' | 'Instagram' | 'TikTok' | 'Blog';

export type Priority = 'High Priority' | 'Low Priority' | 'Medium' | 'Sponsored' | 'Draft' | 'Editing' | 'Posted';

export type Status = 'Ideias' | 'Roteiro' | 'Produção' | 'Publicado';

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface Task {
  id: string;
  title: string;
  platform: Platform;
  priority: Priority[]; // Changed to Array
  status: Status;
  description?: string;
  dueDate?: string;
  checklist?: ChecklistItem[];
  isStagnant?: boolean;
  image?: string;
  date?: string;
  comments?: number;
  attachments?: number;
  tags?: string[];
  assigneeAvatar?: string;
}

export interface ColumnType {
  id: Status;
  title: string;
  color: string;
}