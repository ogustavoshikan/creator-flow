import React, { useState, useMemo, useCallback } from 'react';
import { COLUMNS, INITIAL_TASKS } from './constants';
import { EditModal } from './components/EditModal';
import { Task, Status, Platform } from './types';

// New Components
import { DragIndicator } from './components/DragIndicator';
import { TopFilters } from './components/TopFilters';
import { DetailsPanel } from './components/DetailsPanel';
import { KanbanBoard } from './components/KanbanBoard';
import { Sidebar } from './components/Sidebar';

export default function App() {
  // --- State ---
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [focusedTask, setFocusedTask] = useState<Task | null>(null);
  // Track collapse state instead of open/close. Default collapsed (true) creates the strip.
  const [isDetailsPanelCollapsed, setIsDetailsPanelCollapsed] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activePlatform, setActivePlatform] = useState<Platform | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dragSession, setDragSession] = useState<{
    isActive: boolean;
    sourceColumn: string;
    targetColumn: string;
  } | null>(null);

  // --- Handlers ---
  const handleCardClick = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  }, []);

  const handleTaskFocus = useCallback((task: Task) => {
    setFocusedTask(task);
    setIsDetailsPanelCollapsed(false); // Auto expand when focusing a task
  }, []);

  const toggleDetailsPanel = useCallback(() => {
    setIsDetailsPanelCollapsed(prev => !prev);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTask(null), 200);
  }, []);

  const handleCreateNewTask = useCallback(() => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Nova Ideia',
      platform: 'YouTube',
      priority: ['Draft'],
      status: 'Ideias',
      description: '',
      checklist: []
    };
    setTasks(prev => [newTask, ...prev]);
    handleTaskFocus(newTask); 
  }, [handleTaskFocus]);

  const handleUpdateTask = useCallback((updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    if (focusedTask?.id === updatedTask.id) setFocusedTask(updatedTask);
  }, [focusedTask]);

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (focusedTask?.id === taskId) setFocusedTask(null);
  }, [focusedTask]);

  const handleTaskMove = useCallback((taskId: string, newStatus: Status) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    if (focusedTask?.id === taskId) setFocusedTask(prev => prev ? { ...prev, status: newStatus } : null);
    setDragSession(null);
  }, [focusedTask]);

  // --- Drag Handlers ---
  const handleDragStart = useCallback((s: Status) => setDragSession({ isActive: true, sourceColumn: s, targetColumn: s }), []);
  const handleDragEnter = useCallback((t: Status) => setDragSession(prev => prev ? { ...prev, targetColumn: t } : null), []);
  const handleDragEnd = useCallback(() => setDragSession(null), []);

  // --- Derived State ---
  const tasksByColumn = useMemo(() => {
    const grouped: Record<string, Task[]> = { 'Ideias': [], 'Roteiro': [], 'Produção': [], 'Publicado': [] };
    const query = searchQuery.toLowerCase().trim();
    tasks.forEach(task => {
      if (activePlatform !== 'all' && task.platform !== activePlatform) return;
      if (query && !task.title.toLowerCase().includes(query)) return;
      if (grouped[task.status]) grouped[task.status].push(task);
    });
    return grouped;
  }, [tasks, activePlatform, searchQuery]);

  return (
    <div className={`flex h-screen w-full bg-background text-foreground font-display overflow-hidden selection:bg-primary/30 selection:text-white relative`}>
      {/* Sidebar Component */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(prev => !prev)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
        {/* Ambient Gradient Overlay */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-muted/20 to-transparent pointer-events-none z-0"></div>

        <TopFilters 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activePlatform={activePlatform}
          onPlatformChange={setActivePlatform}
          onCreateNew={handleCreateNewTask}
        />

        <div className="flex flex-1 overflow-hidden relative">
          <KanbanBoard 
            columns={COLUMNS}
            tasksByColumn={tasksByColumn}
            onCardClick={handleCardClick}
            onTaskMove={handleTaskMove}
            onTaskFocus={handleTaskFocus}
            focusedTaskId={focusedTask?.id}
            dragSession={dragSession}
            onDragStartSession={handleDragStart}
            onDragEnterColumn={handleDragEnter}
            onDragEndSession={handleDragEnd}
          />
          
          <DetailsPanel 
            isCollapsed={isDetailsPanelCollapsed}
            onToggle={toggleDetailsPanel}
            focusedTask={focusedTask}
            onEdit={handleCardClick}
            onDelete={handleDeleteTask}
            onUpdateTask={handleUpdateTask}
          />
        </div>
      </div>

      <DragIndicator 
        isActive={dragSession?.isActive || false}
        sourceColumn={dragSession?.sourceColumn || ''}
        targetColumn={dragSession?.targetColumn || ''}
      />

      <EditModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        task={selectedTask}
        onSave={handleUpdateTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}