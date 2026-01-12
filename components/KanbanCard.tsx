import React from 'react';
import { Task, Priority } from '../types';
import { Icon } from './Icon';

interface KanbanCardProps {
  task: Task;
  isFocused?: boolean;
  onClick: () => void;
  onFocus?: () => void; // Handler for the select button
  onDragStartNotify?: () => void;
  onDragEndNotify?: () => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ 
  task, 
  isFocused = false,
  onClick,
  onFocus,
  onDragStartNotify,
  onDragEndNotify
}) => {
  
  // Drag handler
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    
    if (onDragStartNotify) {
      setTimeout(() => onDragStartNotify(), 0);
    }
  };

  const handleDragEnd = () => {
    if (onDragEndNotify) {
      onDragEndNotify();
    }
  };

  const handleFocusClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening modal
    if (onFocus) onFocus();
  };

  // Helper to determine platform color/icon
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'YouTube': return { bg: 'bg-red-600', icon: 'play_arrow', color: 'text-white' };
      case 'Instagram': return { bg: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500', icon: 'photo_camera', color: 'text-white' };
      case 'TikTok': return { bg: 'bg-white', icon: 'music_note', color: 'text-black' };
      case 'Blog': return { bg: 'bg-indigo-600', icon: 'article', color: 'text-white' };
      default: return { bg: 'bg-gray-600', icon: 'public', color: 'text-white' };
    }
  };

  const pConfig = getPlatformIcon(task.platform);

  // Helper for priority badges
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'High Priority': return 'bg-red-950/20 text-red-300 border-red-900/50';
      case 'Low Priority': return 'bg-green-950/20 text-green-300 border-green-900/50';
      case 'Medium': return 'bg-blue-950/20 text-blue-300 border-blue-900/50';
      case 'Sponsored': return 'bg-yellow-950/20 text-yellow-300 border-yellow-900/50';
      case 'Draft': return 'bg-gray-950/20 text-gray-300 border-gray-900/50';
      case 'Editing': return 'bg-purple-950/20 text-purple-300 border-purple-900/50';
      case 'Posted': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'High Priority': return 'Alta';
      case 'Low Priority': return 'Baixa';
      case 'Medium': return 'Média';
      case 'Sponsored': return 'Patrocinado';
      case 'Draft': return 'Rascunho';
      case 'Editing': return 'Edição';
      case 'Posted': return 'Publicado';
      default: return priority;
    }
  };

  const isPosted = task.status === 'Publicado'; // Simplified check based on status
  const isStagnant = task.isStagnant;
  
  // Dynamic classes for container
  const containerClasses = `
    group relative p-3 rounded-lg cursor-pointer transition-all duration-200 
    ${isStagnant 
      ? 'bg-foreground text-background opacity-90 hover:opacity-100 border border-dashed border-input shadow-sm' 
      : 'bg-card hover:bg-accent shadow-sm'
    }
    ${task.priority.includes('Editing') ? 'ring-1 ring-primary/50 bg-primary/5' : ''}
    ${isPosted ? 'opacity-60 hover:opacity-100' : ''}
    ${!isStagnant && !isPosted && !isFocused && 'hover:border-border border border-transparent'}
    ${isFocused && !isStagnant ? 'ring-2 ring-primary border-transparent z-10' : ''}
    active:cursor-grabbing hover:translate-y-[-2px] hover:shadow-md
    active:opacity-50
  `;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  // --- Render Stagnant Card ---
  if (isStagnant) {
    return (
      <div 
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick} 
        className={containerClasses}
      >
        <div className="flex items-center justify-between w-full mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
              {task.platform}
            </span>
            <Icon name="schedule" className="text-[18px] text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2">
             <button 
                onClick={handleFocusClick}
                className={`p-1 rounded-full transition-colors ${isFocused ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                title="Selecionar"
              >
                <Icon name="visibility" className="text-[16px]" />
              </button>
             <span className="inline-flex items-center rounded-full bg-muted border border-border px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground group-hover:text-foreground group-hover:border-input transition-colors">
              Resgatar
             </span>
          </div>
        </div>
        
        <div className="flex flex-col gap-1.5 mb-3">
          <h3 className="text-base font-bold leading-snug text-background group-hover:text-primary transition-colors">
            {task.title}
          </h3>
          <p className="text-sm font-normal text-muted-foreground leading-relaxed line-clamp-2">
            Rascunhar esboço inicial para os posts do blog do próximo trimestre focando em SEO.
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-muted">
           <div className="flex items-center">
             {task.assigneeAvatar && (
                <img src={task.assigneeAvatar} alt="Assignee" className="h-7 w-7 rounded-full object-cover ring-2 ring-background grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
             )}
           </div>
           <div className="flex items-center gap-3 text-muted-foreground">
             <div className="flex items-center gap-1 group/meta hover:text-foreground transition-colors">
                <Icon name="chat_bubble" className="text-[16px]" />
                <span className="text-xs font-medium">{task.comments}</span>
             </div>
             <div className="flex items-center gap-1 group/meta hover:text-foreground transition-colors">
                <Icon name="attach_file" className="text-[16px]" />
                <span className="text-xs font-medium">{task.attachments}</span>
             </div>
           </div>
        </div>
      </div>
    );
  }

  // --- Render Standard Dark Card ---
  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick} 
      className={containerClasses}
    >
      {/* Decorative Border Line on Left */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg 
        ${task.platform === 'YouTube' ? 'bg-red-500' : ''}
        ${task.platform === 'Instagram' ? 'bg-pink-500' : ''}
        ${task.platform === 'TikTok' ? 'bg-white' : ''}
        ${task.platform === 'Blog' ? 'bg-indigo-500' : ''}
        ${task.priority.includes('Sponsored') ? 'bg-yellow-500' : ''}
        ${task.priority.includes('Editing') ? 'bg-purple-500' : ''}
        ${isPosted ? 'bg-green-500' : ''}
      `}></div>

      <div className="flex justify-between items-start pl-2">
         {/* Title */}
        <h4 className={`font-bold text-sm mb-1 leading-snug tracking-tight flex-1 pr-2
          ${isPosted ? 'text-muted-foreground line-through decoration-muted-foreground/50 group-hover:text-foreground group-hover:no-underline' : 'text-card-foreground'}
        `}>
          {task.title}
        </h4>

        {/* Selection/Focus Button */}
        <button 
          onClick={handleFocusClick}
          className={`
            shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200
            ${isFocused 
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-100 opacity-100' 
              : 'bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground'
            }
          `}
          title="Ver Detalhes"
        >
          <Icon name="visibility" className="text-[14px]" />
        </button>
      </div>

      {/* Metadata Row */}
      <div className="flex flex-col gap-2 pl-2 mt-2">
        
        {/* Platform Line */}
        <div className="flex items-center gap-1.5">
           {isPosted ? (
            <div className="flex items-center gap-1.5 text-xs">
               <Icon name="check_circle" className="text-green-600 text-[14px]" />
               <span className="font-semibold uppercase tracking-wide text-muted-foreground">Publicado</span>
               {task.date && <span className="text-[10px] text-muted-foreground font-mono border-l border-border pl-2">{task.date}</span>}
            </div>
           ) : (
            <>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center shadow-sm ${pConfig.bg} ${pConfig.color}`}>
                <Icon name={pConfig.icon} className="text-[10px]" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{task.platform}</span>
            </>
           )}
        </div>

        {/* Priority Tags Row */}
        {!isPosted && task.priority.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {task.priority.map(p => (
              <span key={p} className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wide border ${getPriorityStyle(p)}`}>
                {getPriorityLabel(p)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};