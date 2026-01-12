import React from 'react';
import { ColumnType, Task, Status } from '../types';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  columns: ColumnType[];
  tasksByColumn: Record<string, Task[]>;
  onCardClick: (task: Task) => void;
  onDuplicateTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onTaskMove: (taskId: string, newStatus: Status) => void;
  onTaskFocus: (task: Task) => void;
  focusedTaskId?: string;
  dragSession: { isActive: boolean; sourceColumn: string; targetColumn: string; } | null;
  onDragStartSession: (sourceStatus: Status) => void;
  onDragEnterColumn: (targetStatus: Status) => void;
  onDragEndSession: () => void;
  onBackgroundClick?: () => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  tasksByColumn,
  onCardClick,
  onDuplicateTask,
  onDeleteTask,
  onTaskMove,
  onTaskFocus,
  focusedTaskId,
  dragSession,
  onDragStartSession,
  onDragEnterColumn,
  onDragEndSession,
  onBackgroundClick
}) => {

  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Só fecha se clicar diretamente no main (não em cards)
    if (e.target === e.currentTarget && onBackgroundClick) {
      onBackgroundClick();
    }
  };

  return (
    <main
      className="flex-1 p-8 z-0 flex gap-4 overflow-x-auto custom-scrollbar transition-all duration-300"
      onClick={handleBackgroundClick}
    >
      {columns.map(col => (
        <KanbanColumn
          key={col.id}
          column={col}
          tasks={tasksByColumn[col.id] || []}
          onCardClick={onCardClick}
          onDuplicateTask={onDuplicateTask}
          onDeleteTask={onDeleteTask}
          onTaskMove={onTaskMove}
          onTaskFocus={onTaskFocus}
          focusedTaskId={focusedTaskId}
          isDragActive={dragSession?.isActive || false}
          onDragStartSession={onDragStartSession}
          onDragEnterColumn={onDragEnterColumn}
          onDragEndSession={onDragEndSession}
          onBackgroundClick={onBackgroundClick}
        />
      ))}
    </main>
  );
};