import React from 'react';
import { Icon } from './Icon';
import { Task, Priority, Platform } from '../types';

interface DetailsPanelProps {
  isCollapsed: boolean;
  onToggle: () => void;
  focusedTask: Task | null;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onUpdateTask: (task: Task) => void;
}

export const DetailsPanel: React.FC<DetailsPanelProps> = ({
  isCollapsed,
  onToggle,
  focusedTask,
  onEdit,
  onDelete,
  onUpdateTask
}) => {
  
  // Helpers using Tailwind semantic classes for priorities
  const getPanelPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'High Priority': return 'bg-red-950/30 text-red-400 border-red-900/50 hover:bg-red-950/50';
      case 'Low Priority': return 'bg-green-950/30 text-green-400 border-green-900/50 hover:bg-green-950/50';
      case 'Medium': return 'bg-blue-950/30 text-blue-400 border-blue-900/50 hover:bg-blue-950/50';
      case 'Sponsored': return 'bg-yellow-950/30 text-yellow-400 border-yellow-900/50 hover:bg-yellow-950/50';
      case 'Editing': return 'bg-purple-950/30 text-purple-400 border-purple-900/50 hover:bg-purple-950/50';
      case 'Posted': return 'bg-muted text-muted-foreground border-border';
      case 'Draft': return 'bg-muted text-muted-foreground border-border hover:bg-accent';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPrioritiesForPlatform = (platform: Platform): Priority[] => {
    const base: Priority[] = ['High Priority', 'Medium', 'Low Priority'];
    if (platform === 'YouTube' || platform === 'TikTok') return [...base, 'Sponsored', 'Editing'];
    if (platform === 'Instagram') return [...base, 'Sponsored'];
    if (platform === 'Blog') return [...base, 'Draft', 'Sponsored'];
    return base;
  };

  const handleTogglePriority = (p: Priority) => {
    if (!focusedTask) return;
    const current = focusedTask.priority || [];
    let newPriorities: Priority[];
    
    if (current.includes(p)) {
      newPriorities = current.filter(item => item !== p);
    } else {
      newPriorities = [...current, p];
    }
    
    onUpdateTask({ ...focusedTask, priority: newPriorities });
  };

  const handleAddPriority = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as Priority;
    if (val) {
      handleTogglePriority(val);
      e.target.value = "";
    }
  };

  const actionButtonClass = "text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-accent flex items-center justify-center active:scale-95";

  return (
    <aside 
      className={`
        hidden xl:flex flex-col h-full shrink-0 z-10 bg-sidebar border-l border-sidebar-border
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-[400px]'}
      `}
    >
      <div className="flex-1 overflow-hidden relative w-full"> 
        {/* Content Container - Fades out when collapsed */}
        <div className={`absolute inset-0 w-[400px] flex flex-col transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            {focusedTask ? (
              <div className="flex flex-col gap-6 animate-fade-in">
                  
                  {/* Navbar / Actions */}
                  <div className="flex justify-end items-center pb-2">
                    <div className="flex items-center gap-1">
                        <button onClick={() => onEdit(focusedTask)} className={actionButtonClass} title="Editar">
                          <Icon name="edit" className="text-lg" />
                        </button>
                        <button onClick={() => onDelete(focusedTask.id)} className={`${actionButtonClass} hover:text-red-400 hover:bg-red-950/20`} title="Excluir">
                          <Icon name="delete" className="text-lg" />
                        </button>
                    </div>
                  </div>
                  
                  {/* Header Info */}
                  <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-foreground leading-tight">{focusedTask.title}</h2>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2">
                        {focusedTask.priority?.map(p => (
                          <button key={p} onClick={() => handleTogglePriority(p)} className={`group flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-all ${getPanelPriorityStyle(p)}`} title="Clique para remover">
                              {p}
                              <Icon name="close" className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                        <div className="relative group/add">
                          <button className="flex items-center justify-center w-6 h-6 rounded-full bg-accent hover:bg-muted border border-border text-muted-foreground transition-colors">
                              <Icon name="add" className="text-xs" />
                          </button>
                          <select onChange={handleAddPriority} value="" className="absolute inset-0 opacity-0 w-full h-full cursor-pointer">
                              <option value="" disabled>Adicionar Tag</option>
                              {getPrioritiesForPlatform(focusedTask.platform)
                                .filter(p => !focusedTask.priority?.includes(p))
                                .map(p => (
                                  <option key={p} value={p}>{p}</option>
                              ))}
                          </select>
                        </div>
                    </div>
                  </div>

                  {/* Media Placeholder */}
                  <div className="aspect-video w-full bg-card rounded-xl border border-border flex items-center justify-center relative overflow-hidden group cursor-pointer shadow-sm">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                      <div className="w-16 h-16 rounded-full bg-background/10 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                        <Icon name={focusedTask.platform === 'YouTube' ? 'play_arrow' : 'image'} className="text-3xl text-foreground/90" filled />
                      </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Platform</label>
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shadow-sm ${
                              focusedTask.platform === 'YouTube' ? 'bg-[#ff0000] text-white' : 
                              focusedTask.platform === 'Instagram' ? 'bg-[#e1306c] text-white' : 
                              focusedTask.platform === 'TikTok' ? 'bg-white text-black' :
                              focusedTask.platform === 'Blog' ? 'bg-indigo-600 text-white' :
                              'bg-gray-700 text-white'
                          }`}>
                              <Icon name={focusedTask.platform === 'YouTube' ? 'play_arrow' : focusedTask.platform === 'Instagram' ? 'photo_camera' : focusedTask.platform === 'TikTok' ? 'music_note' : 'public'} className="text-[12px]" />
                          </div>
                          <span className="font-bold text-sm text-foreground">{focusedTask.platform}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</label>
                        <div className="flex items-center gap-3">
                          <span className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)] ${
                              focusedTask.status === 'Ideias' ? 'bg-yellow-500' :
                              focusedTask.status === 'Roteiro' ? 'bg-blue-500' :
                              focusedTask.status === 'Produção' ? 'bg-purple-500' :
                              'bg-green-500'
                          }`}></span>
                          <span className="font-bold text-sm text-foreground">{focusedTask.status}</span>
                        </div>
                    </div>
                  </div>

                  <div className="h-px bg-border w-full"></div>

                  {/* Description */}
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Description</label>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                        {focusedTask.description || "No description provided for this task."}
                    </p>
                  </div>

                  {/* Checklist */}
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Checklist</label>
                    </div>
                    <div className="space-y-4 mt-1">
                        {focusedTask.checklist?.map(item => (
                            <div key={item.id} className="flex items-start gap-3 group">
                                <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${item.checked ? 'bg-primary border-primary' : 'border-input group-hover:border-muted-foreground'}`}>
                                    {item.checked && <Icon name="check" className="text-[14px] text-primary-foreground" />}
                                </div>
                                <span className={`text-sm font-medium ${item.checked ? 'text-muted-foreground line-through' : 'text-foreground/80'}`}>{item.text}</span>
                            </div>
                        ))}
                        {(!focusedTask.checklist || focusedTask.checklist.length === 0) && (
                          <p className="text-sm text-muted-foreground italic">No checklist items.</p>
                        )}
                    </div>
                  </div>
              </div>
            ) : (
              // Empty State
              <div className="h-full flex flex-col relative">
                  <div className="flex-1 flex flex-col justify-center items-center text-center opacity-40">
                      <div className="bg-card p-6 rounded-full mb-6 ring-1 ring-border grayscale">
                        <Icon name="touch_app" className="text-5xl text-muted-foreground" />
                      </div>
                      <h2 className="text-lg font-bold text-foreground mb-2">Selecione uma Tarefa</h2>
                      <p className="text-muted-foreground max-w-[200px] leading-relaxed text-sm">
                        Clique no ícone de olho em qualquer cartão para ver os detalhes aqui.
                      </p>
                  </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with Collapse Button - Matching Sidebar Style */}
      <div className="p-4 border-t border-sidebar-border mt-auto shrink-0 w-full overflow-hidden">
        <button 
          onClick={onToggle}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all w-full overflow-hidden group outline-none focus-visible:ring-2 focus-visible:ring-ring"
          title={isCollapsed ? "Expandir" : "Recolher"}
        >
          <div className="shrink-0 flex items-center justify-center w-5 h-5">
            {/* Logic: If expanded (on right), collapse to right (dock_to_right). If collapsed (on right), expand from right (dock_to_left) */}
            <Icon name={isCollapsed ? "dock_to_left" : "dock_to_right"} className="group-hover:text-foreground transition-colors text-[20px]" />
          </div>
          <span className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            Recolher
          </span>
        </button>
      </div>
    </aside>
  );
};