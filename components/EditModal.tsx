import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from './Icon';
import { Task, Platform, Status, ChecklistItem, Priority } from '../types';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
}

export const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, task, onSave, onDelete }) => {
  // Local state for form fields
  const [formData, setFormData] = useState<Partial<Task>>({});
  const [isClosing, setIsClosing] = useState(false);

  // Sync state when task changes or modal opens
  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        priority: task.priority || [], // Ensure array
        description: task.description || '',
        checklist: task.checklist || [],
        dueDate: task.dueDate || ''
      });
    } else {
      setFormData({});
    }
  }, [task, isOpen]);

  // Logic to filter available priorities based on Platform
  const availablePriorities = useMemo<Priority[]>(() => {
    const base: Priority[] = ['High Priority', 'Medium', 'Low Priority'];
    const currentPlatform = formData.platform;

    if (currentPlatform === 'YouTube' || currentPlatform === 'TikTok') {
      return [...base, 'Sponsored', 'Editing'];
    }
    if (currentPlatform === 'Instagram') {
      return [...base, 'Sponsored'];
    }
    if (currentPlatform === 'Blog') {
      return [...base, 'Draft', 'Sponsored'];
    }
    return base;
  }, [formData.platform]);

  if (!isOpen || !task) return null;
  
  // Prevent rendering empty form before state sync
  if (formData.id !== task.id) return null;

  const handleChange = (field: keyof Task, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePriority = (p: Priority) => {
    const current = formData.priority || [];
    if (current.includes(p)) {
      handleChange('priority', current.filter(item => item !== p));
    } else {
      handleChange('priority', [...current, p]);
    }
  };

  const handleChecklistToggle = (itemId: string) => {
    if (!formData.checklist) return;
    const updatedChecklist = formData.checklist.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    handleChange('checklist', updatedChecklist);
  };

  const handleSubmit = () => {
    if (task && formData.id) {
      onSave({ ...task, ...formData } as Task);
      handleClose();
    }
  };

  const handleDelete = () => {
    if (task) {
      onDelete(task.id);
      handleClose();
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200); // Animation duration
  };

  const getTagStyle = (isActive: boolean) => 
    isActive 
      ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' 
      : 'bg-secondary text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm transition-all duration-300 ${isClosing ? 'animate-fade-out opacity-0' : 'animate-fade-in opacity-100'}`}>
      <div className={`w-full max-w-[900px] bg-card text-card-foreground border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transition-all duration-300 ${isClosing ? 'scale-95 opacity-0' : 'animate-zoom-in scale-100 opacity-100'}`}>
        
        {/* Header */}
        <div className="px-8 pt-8 pb-4 shrink-0">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 group">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2" htmlFor="title-input">
                Título do Conteúdo
              </label>
              <input 
                id="title-input"
                type="text" 
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full text-2xl sm:text-3xl font-bold text-foreground placeholder:text-muted-foreground border-0 border-b border-transparent focus:border-primary px-0 py-1 focus:ring-0 bg-transparent transition-all"
                placeholder="Digite um título..."
              />
            </div>
            <button 
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground hover:bg-accent p-2 rounded-full transition-colors outline-none"
            >
              <Icon name="close" className="font-semibold" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-4 space-y-8 custom-scrollbar modal-content">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Channel/Platform */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon name="public" className="text-lg text-muted-foreground" />
                Plataforma
              </label>
              <div className="relative">
                <select 
                  value={formData.platform || 'YouTube'}
                  onChange={(e) => {
                    handleChange('platform', e.target.value as Platform);
                    // Reset priority to avoid incompatible tags when platform changes
                    handleChange('priority', []);
                  }}
                  className="w-full appearance-none bg-input border border-border text-foreground text-sm rounded-lg focus:ring-1 focus:ring-primary focus:border-primary block p-3 pr-10 hover:border-foreground/20 transition-colors cursor-pointer outline-none"
                >
                  <option value="YouTube">YouTube</option>
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Blog">Blog</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                  <Icon name="expand_more" />
                </div>
              </div>
            </div>

            {/* Priority (Multi-Select Tags) */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon name="loyalty" className="text-lg text-muted-foreground" />
                Tags & Prioridade
              </label>
              <div className="flex flex-wrap gap-2">
                 {availablePriorities.map(p => {
                   const isActive = formData.priority?.includes(p) || false;
                   return (
                     <button
                        key={p}
                        onClick={() => togglePriority(p)}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide border transition-all duration-200 select-none ${getTagStyle(isActive)}`}
                     >
                       {p}
                     </button>
                   )
                 })}
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon name="view_kanban" className="text-lg text-muted-foreground" />
                Status
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                  <span className={`h-2.5 w-2.5 rounded-full ${
                    formData.status === 'Ideias' ? 'bg-yellow-500' :
                    formData.status === 'Roteiro' ? 'bg-blue-500' :
                    formData.status === 'Produção' ? 'bg-purple-500' :
                    'bg-green-500'
                  }`}></span>
                </div>
                <select 
                  value={formData.status || 'Ideias'}
                  onChange={(e) => handleChange('status', e.target.value as Status)}
                  className="w-full appearance-none bg-input border border-border text-foreground text-sm rounded-lg focus:ring-1 focus:ring-primary focus:border-primary block p-3 pl-8 pr-10 hover:border-foreground/20 transition-colors cursor-pointer outline-none"
                >
                  <option value="Ideias">Ideias</option>
                  <option value="Roteiro">Roteiro</option>
                  <option value="Produção">Produção</option>
                  <option value="Publicado">Publicado</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                  <Icon name="expand_more" />
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2 hidden md:block"></div>
          </div>

          {/* Text Area */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Icon name="description" className="text-lg text-muted-foreground" />
              Descrição / Roteiro
            </label>
            <textarea 
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className="block p-4 w-full text-base text-foreground bg-input rounded-lg border border-border focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground leading-relaxed shadow-sm resize-y min-h-[150px] outline-none" 
              placeholder="Escreva aqui o roteiro, legenda e notas sobre o conteúdo..."
              rows={8}
            ></textarea>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            
            {/* Checklist */}
            <div className="bg-secondary/50 rounded-xl p-5 border border-border">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
                <Icon name="check_circle" className="text-sm" />
                Checklist de Qualidade
              </h3>
              <div className="space-y-3">
                {formData.checklist && formData.checklist.length > 0 ? (
                  formData.checklist.map((item) => (
                    <label key={item.id} className="flex items-center gap-3 cursor-pointer group select-none">
                      <input 
                        type="checkbox" 
                        checked={item.checked}
                        onChange={() => handleChecklistToggle(item.id)}
                        className="w-5 h-5 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2 focus:ring-offset-1 focus:ring-offset-card transition-all" 
                      />
                      <span className={`text-sm font-medium transition-colors ${item.checked ? 'text-muted-foreground line-through' : 'text-foreground/80 group-hover:text-foreground'}`}>
                        {item.text}
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic">Nenhum item no checklist.</p>
                )}
              </div>
            </div>

            {/* Date Info */}
            <div className="flex flex-col gap-5 justify-start">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Icon name="event" className="text-lg text-muted-foreground" />
                  Data de Postagem
                </label>
                <input 
                  type="date" 
                  value={formData.dueDate || ''}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  className="bg-input border border-border text-foreground text-sm rounded-lg focus:ring-1 focus:ring-primary focus:border-primary block w-full p-3 shadow-sm outline-none [color-scheme:dark]" 
                />
              </div>
              
              <div className="mt-auto p-4 bg-primary/10 text-primary-foreground/80 rounded-lg text-xs leading-relaxed flex gap-3 border border-primary/20">
                <Icon name="info" className="text-lg shrink-0 text-primary" />
                <p>Alterar o status ou a data pode afetar a ordenação do quadro Kanban. Certifique-se de salvar suas alterações.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex justify-between items-center bg-card shrink-0">
          <button 
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors group"
          >
            <Icon name="delete" className="text-[18px] group-hover:text-red-400 transition-colors" />
            Excluir
          </button>
          <div className="flex items-center gap-3">
            <button onClick={handleClose} className="px-6 py-2.5 text-sm font-medium text-foreground bg-transparent border border-border rounded-lg hover:bg-accent hover:text-foreground transition-all">
              Cancelar
            </button>
            <button onClick={handleSubmit} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              <Icon name="save" className="text-[18px]" />
              Salvar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};