import React, { useRef, useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Icon } from './Icon';
import { Task, Priority, Platform, Status } from '../types';
import { PRIORITY_LABELS, COLUMNS } from '../constants';

// Constantes para plataformas disponíveis
const PLATFORMS: Platform[] = ['YouTube', 'Instagram', 'TikTok', 'Blog'];

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
  // Estado para redimensionamento
  const [width, setWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);

  // Estados para edição inline
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  // Refs para scroll container e popovers
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const platformRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const platformButtonRef = useRef<HTMLButtonElement>(null);
  const statusButtonRef = useRef<HTMLButtonElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  // Scroll para o topo quando abrir o painel ou mudar de task
  useEffect(() => {
    if (!isCollapsed && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [isCollapsed, focusedTask?.id]);

  // Lógica de Redimensionamento
  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      // Para o painel direito, a largura é (largura da janela - posição do mouse)
      const newWidth = window.innerWidth - e.clientX;
      // Limites: min 300px, max 800px
      setWidth(Math.max(300, Math.min(newWidth, 800)));
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, resize, stopResizing]);

  // Reset editing states when task changes
  useEffect(() => {
    setIsEditingTitle(false);
    setIsEditingDescription(false);
    setIsPlatformOpen(false);
    setIsStatusOpen(false);
    if (focusedTask) {
      setEditedTitle(focusedTask.title);
      setEditedDescription(focusedTask.description || '');
    }
  }, [focusedTask?.id]);

  // Focus input when editing title
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  // Focus textarea when editing description
  useEffect(() => {
    if (isEditingDescription && descriptionRef.current) {
      descriptionRef.current.focus();
    }
  }, [isEditingDescription]);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (platformRef.current && !platformRef.current.contains(e.target as Node)) {
        setIsPlatformOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setIsStatusOpen(false);
      }
    };

    if (isPlatformOpen || isStatusOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPlatformOpen, isStatusOpen]);

  // Handlers para edição inline
  const handleSaveTitle = () => {
    if (focusedTask && editedTitle.trim() !== focusedTask.title) {
      onUpdateTask({ ...focusedTask, title: editedTitle.trim() || focusedTask.title });
    }
    setIsEditingTitle(false);
  };

  const handleSaveDescription = () => {
    if (focusedTask && editedDescription !== focusedTask.description) {
      onUpdateTask({ ...focusedTask, description: editedDescription });
    }
    setIsEditingDescription(false);
  };

  const handleOpenPlatformPopover = () => {
    if (platformButtonRef.current) {
      const rect = platformButtonRef.current.getBoundingClientRect();
      setPopoverPosition({ top: rect.bottom + 4, left: rect.left });
    }
    setIsStatusOpen(false);
    setIsPlatformOpen(!isPlatformOpen);
  };

  const handleOpenStatusPopover = () => {
    if (statusButtonRef.current) {
      const rect = statusButtonRef.current.getBoundingClientRect();
      setPopoverPosition({ top: rect.bottom + 4, left: rect.left });
    }
    setIsPlatformOpen(false);
    setIsStatusOpen(!isStatusOpen);
  };

  const handlePlatformChange = (platform: Platform) => {
    if (focusedTask) {
      onUpdateTask({ ...focusedTask, platform });
    }
    setIsPlatformOpen(false);
  };

  const handleStatusChange = (status: Status) => {
    if (focusedTask) {
      onUpdateTask({ ...focusedTask, status });
    }
    setIsStatusOpen(false);
  };

  const handleChecklistToggle = (itemId: string) => {
    if (focusedTask && focusedTask.checklist) {
      const updatedChecklist = focusedTask.checklist.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      );
      onUpdateTask({ ...focusedTask, checklist: updatedChecklist });
    }
  };

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
        hidden xl:flex flex-col h-full shrink-0 z-10 bg-sidebar border-l border-sidebar-border relative
        ${isResizing ? 'transition-none' : 'transition-all duration-slow ease-in-out'}
        ${isCollapsed ? 'border-l-0' : ''}
      `}
      style={{ width: isCollapsed ? 0 : width }}
    >
      {/* Resize Handle */}
      {!isCollapsed && (
        <div
          className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-primary active:bg-primary transition-colors z-50"
          onMouseDown={startResizing}
        ></div>
      )}

      <div className="flex-1 overflow-hidden relative w-full">
        {/* Content Container - Fades out when collapsed */}
        <div className={`absolute inset-0 w-full flex flex-col transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar p-8">
            {focusedTask ? (
              <div className="flex flex-col gap-6 animate-fade-in">

                {/* Header: Título + Ações na mesma linha */}
                <div className="flex items-start justify-between gap-4">
                  {isEditingTitle ? (
                    <input
                      ref={titleInputRef}
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      onBlur={handleSaveTitle}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveTitle();
                        if (e.key === 'Escape') {
                          setEditedTitle(focusedTask.title);
                          setIsEditingTitle(false);
                        }
                      }}
                      className="text-2xl font-bold text-foreground leading-tight flex-1 bg-transparent border-b-2 border-primary outline-none"
                    />
                  ) : (
                    <h2
                      className="text-2xl font-bold text-foreground leading-tight flex-1 cursor-text hover:bg-accent/50 rounded px-1 -mx-1 transition-colors"
                      onClick={() => {
                        setEditedTitle(focusedTask.title);
                        setIsEditingTitle(true);
                      }}
                      title="Clique para editar"
                    >
                      {focusedTask.title}
                    </h2>
                  )}
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => onEdit(focusedTask)} className={actionButtonClass} title="Editar no Modal">
                      <Icon name="open_in_new" className="text-lg" />
                    </button>
                    <button onClick={() => onDelete(focusedTask.id)} className={`${actionButtonClass} hover:text-red-400 hover:bg-red-950/20`} title="Excluir">
                      <Icon name="delete" className="text-lg" />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-col gap-4">

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    {focusedTask.priority?.map(p => (
                      <button key={p} onClick={() => handleTogglePriority(p)} className={`group flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-all ${getPanelPriorityStyle(p)}`} title="Clique para remover">
                        {PRIORITY_LABELS[p] || p}
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
                            <option key={p} value={p}>{PRIORITY_LABELS[p] || p}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Media por Plataforma */}
                <div className="aspect-video w-full bg-card rounded-xl border border-border relative overflow-hidden group cursor-pointer shadow-sm">
                  {focusedTask.platform === 'YouTube' && (
                    <img src="/images/youtube-img.jpg" alt="YouTube" className="w-full h-full object-cover" />
                  )}
                  {focusedTask.platform === 'Instagram' && (
                    <img src="/images/instagram-img.jpg" alt="Instagram" className="w-full h-full object-cover" />
                  )}
                  {focusedTask.platform === 'Blog' && (
                    <img src="/images/blog-img.jpg" alt="Blog" className="w-full h-full object-cover" />
                  )}
                  {focusedTask.platform === 'TikTok' && (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00f2ea] via-black to-[#ff0050]">
                      <Icon name="music_note" className="text-5xl text-white" filled />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Plataforma - Editable Popover */}
                  <div className="flex flex-col gap-2" ref={platformRef}>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Plataforma</label>
                    <button
                      ref={platformButtonRef}
                      onClick={handleOpenPlatformPopover}
                      className="flex items-center gap-3 p-2 -m-2 rounded-lg hover:bg-accent transition-colors group"
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shadow-sm ${focusedTask.platform === 'YouTube' ? 'bg-[#ff0000] text-white' :
                        focusedTask.platform === 'Instagram' ? 'bg-[#e1306c] text-white' :
                          focusedTask.platform === 'TikTok' ? 'bg-white text-black' :
                            focusedTask.platform === 'Blog' ? 'bg-indigo-600 text-white' :
                              'bg-gray-700 text-white'
                        }`}>
                        <Icon name={focusedTask.platform === 'YouTube' ? 'play_arrow' : focusedTask.platform === 'Instagram' ? 'photo_camera' : focusedTask.platform === 'TikTok' ? 'music_note' : 'public'} className="text-[12px]" />
                      </div>
                      <span className="font-bold text-sm text-foreground">{focusedTask.platform}</span>
                      <Icon name="expand_more" className="text-muted-foreground group-hover:text-foreground transition-colors ml-auto text-sm" />
                    </button>
                  </div>

                  {/* Status - Editable Popover */}
                  <div className="flex flex-col gap-2" ref={statusRef}>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</label>
                    <button
                      ref={statusButtonRef}
                      onClick={handleOpenStatusPopover}
                      className="flex items-center gap-3 p-2 -m-2 rounded-lg hover:bg-accent transition-colors group"
                    >
                      <span className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)] ${focusedTask.status === 'Ideias' ? 'bg-yellow-500' :
                        focusedTask.status === 'Roteiro' ? 'bg-blue-500' :
                          focusedTask.status === 'Produção' ? 'bg-purple-500' :
                            'bg-green-500'
                        }`}></span>
                      <span className="font-bold text-sm text-foreground">{focusedTask.status}</span>
                      <Icon name="expand_more" className="text-muted-foreground group-hover:text-foreground transition-colors ml-auto text-sm" />
                    </button>
                  </div>
                </div>

                {/* Platform Popover - Fixed Position */}
                {isPlatformOpen && ReactDOM.createPortal(
                  <div
                    className="fixed inset-0 z-[9999]"
                    onMouseDown={() => setIsPlatformOpen(false)}
                  >
                    <div
                      className="fixed w-48 rounded-lg shadow-2xl z-[10000] overflow-hidden"
                      style={{
                        top: popoverPosition.top,
                        left: popoverPosition.left,
                        backgroundColor: '#18181b',
                        border: '1px solid #27272a'
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <div className="p-1">
                        {PLATFORMS.map(platform => (
                          <button
                            key={platform}
                            type="button"
                            onClick={() => handlePlatformChange(platform)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${focusedTask.platform === platform ? 'bg-primary/10 text-primary' : 'hover:bg-accent text-foreground'}`}
                          >
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${platform === 'YouTube' ? 'bg-[#ff0000] text-white' :
                              platform === 'Instagram' ? 'bg-[#e1306c] text-white' :
                                platform === 'TikTok' ? 'bg-white text-black' :
                                  'bg-indigo-600 text-white'
                              }`}>
                              <Icon name={platform === 'YouTube' ? 'play_arrow' : platform === 'Instagram' ? 'photo_camera' : platform === 'TikTok' ? 'music_note' : 'public'} className="text-[10px]" />
                            </div>
                            <span className="font-medium">{platform}</span>
                            {focusedTask.platform === platform && (
                              <Icon name="check" className="ml-auto text-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>,
                  document.body
                )}

                {/* Status Popover - Fixed Position */}
                {isStatusOpen && ReactDOM.createPortal(
                  <div
                    className="fixed inset-0 z-[9999]"
                    onMouseDown={() => setIsStatusOpen(false)}
                  >
                    <div
                      className="fixed w-48 rounded-lg shadow-2xl z-[10000] overflow-hidden"
                      style={{
                        top: popoverPosition.top,
                        left: popoverPosition.left,
                        backgroundColor: '#18181b',
                        border: '1px solid #27272a'
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <div className="p-1">
                        {COLUMNS.map(column => (
                          <button
                            key={column.id}
                            type="button"
                            onClick={() => handleStatusChange(column.id as Status)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${focusedTask.status === column.id ? 'bg-primary/10 text-primary' : 'hover:bg-accent text-foreground'}`}
                          >
                            <span className={`w-2.5 h-2.5 rounded-full ${column.id === 'Ideias' ? 'bg-yellow-500' :
                              column.id === 'Roteiro' ? 'bg-blue-500' :
                                column.id === 'Produção' ? 'bg-purple-500' :
                                  'bg-green-500'
                              }`}></span>
                            <span className="font-medium">{column.title}</span>
                            {focusedTask.status === column.id && (
                              <Icon name="check" className="ml-auto text-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>,
                  document.body
                )}

                <div className="h-px bg-border w-full"></div>

                {/* Description - Editable */}
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Descrição</label>
                  {isEditingDescription ? (
                    <textarea
                      ref={descriptionRef}
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      onBlur={handleSaveDescription}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setEditedDescription(focusedTask.description || '');
                          setIsEditingDescription(false);
                        }
                      }}
                      placeholder="Adicione uma descrição..."
                      className="text-sm text-foreground leading-relaxed font-medium bg-transparent border border-border rounded-lg p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y min-h-[100px]"
                    />
                  ) : (
                    <p
                      className="text-sm text-muted-foreground leading-relaxed font-medium cursor-text hover:bg-accent/50 rounded-lg p-3 -m-3 transition-colors"
                      onClick={() => {
                        setEditedDescription(focusedTask.description || '');
                        setIsEditingDescription(true);
                      }}
                      title="Clique para editar"
                    >
                      {focusedTask.description || <span className="italic text-muted-foreground/60">Clique para adicionar uma descrição...</span>}
                    </p>
                  )}
                </div>

                {/* Checklist - Clickable */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Checklist</label>
                  </div>
                  <div className="space-y-2 mt-1">
                    {focusedTask.checklist?.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleChecklistToggle(item.id)}
                        className="w-full flex items-start gap-3 group p-2 -mx-2 rounded-lg hover:bg-accent/50 transition-colors text-left"
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${item.checked ? 'bg-primary border-primary' : 'border-input group-hover:border-muted-foreground'}`}>
                          {item.checked && <Icon name="check" className="text-[14px] text-primary-foreground" />}
                        </div>
                        <span className={`text-sm font-medium ${item.checked ? 'text-muted-foreground line-through' : 'text-foreground/80'}`}>{item.text}</span>
                      </button>
                    ))}
                    {(!focusedTask.checklist || focusedTask.checklist.length === 0) && (
                      <p className="text-sm text-muted-foreground italic">Nenhum item no checklist.</p>
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