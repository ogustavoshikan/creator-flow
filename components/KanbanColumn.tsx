import React, { useCallback, useState } from 'react';
import { ColumnType, Task, Status } from '../types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  column: ColumnType;
  tasks: Task[];
  onCardClick: (task: Task) => void;
  onDuplicateTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onTaskMove: (taskId: string, newStatus: Status) => void;

  // Selection/Focus Props
  onTaskFocus: (task: Task) => void;
  focusedTaskId?: string;

  // Feedback props
  isDragActive: boolean;
  onDragStartSession: (sourceStatus: Status) => void;
  onDragEnterColumn: (targetStatus: Status) => void;
  onDragEndSession: () => void;
  onBackgroundClick?: () => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = React.memo(({
  column,
  tasks,
  onCardClick,
  onDuplicateTask,
  onDeleteTask,
  onTaskMove,
  onTaskFocus,
  focusedTaskId,
  isDragActive,
  onDragStartSession,
  onDragEnterColumn,
  onDragEndSession,
  onBackgroundClick
}) => {

  const [isOver, setIsOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
    onDragEnterColumn(column.id);
  }, [column.id, onDragEnterColumn]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setIsOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onTaskMove(taskId, column.id);
    } else {
      onDragEndSession();
    }
  }, [column.id, onTaskMove, onDragEndSession]);

  return (
    <div
      className={`
        flex flex-col w-[21rem] shrink-0 h-full transition-all duration-300 pr-4 border-r border-white/5 last:border-r-0 rounded-lg
        ${isOver ? 'bg-white/[0.03]' : 'bg-transparent'}
        ${isDragActive && !isOver ? 'opacity-60 grayscale-[0.5]' : 'opacity-100'} 
      `}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={(e) => {
        // Se clicar no espaço vazio da coluna e não estiver arrastando
        if (e.target === e.currentTarget && onBackgroundClick) {
          onBackgroundClick();
        }
      }}
    >
      {/* Column Header */}
      <h3 className="text-muted-foreground font-bold text-sm tracking-wider uppercase flex items-center gap-2 mb-4 px-2 pt-2">
        <span className={`w-2.5 h-2.5 rounded-full bg-${column.color} shadow-[0_0_8px_rgba(255,255,255,0.2)] transition-transform ${isOver ? 'scale-125' : ''}`}></span>
        {column.title}
        <span className={`bg-secondary text-muted-foreground text-[10px] px-1.5 py-0.5 rounded ml-1 font-mono transition-colors ${isOver ? 'text-foreground bg-accent' : ''}`}>
          {tasks.length}
        </span>
      </h3>

      {/* Task List */}
      <div
        className="flex flex-col gap-3 overflow-y-auto pr-2 pl-2 custom-scrollbar pb-10 min-h-[150px] flex-1"
        onClick={(e) => {
          if (e.target === e.currentTarget && onBackgroundClick) {
            onBackgroundClick();
          }
        }}
      >
        {tasks.map(task => (
          <KanbanCard
            key={task.id}
            task={task}
            isFocused={focusedTaskId === task.id}
            onClick={() => onCardClick(task)}
            onFocus={() => onTaskFocus(task)}
            onDuplicate={onDuplicateTask}
            onDelete={onDeleteTask}
            onDragStartNotify={() => onDragStartSession(column.id)}
            onDragEndNotify={onDragEndSession}
          />
        ))}
      </div>
    </div>
  );
});