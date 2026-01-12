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

// Authentication Types
export interface User {
  id: string;
  email: string;
  user_metadata: {
    avatar_url?: string;
    full_name?: string;
    name?: string;
  };
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Database Types
export interface DatabaseTask {
  id: string;
  user_id: string;
  title: string;
  platform: Platform;
  priority: string[]; // Supabase stores arrays as strings/arrays
  status: Status;
  description: string;
  checklist: ChecklistItem[];
  is_stagnant: boolean;
  comments: number;
  attachments: number;
  tags: string[];
  assignee_avatar: string;
  created_at: string;
  updated_at: string;
  // Optional/Nullable fields from API
  image?: string;
  date?: string;
  due_date?: string;
}