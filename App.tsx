import React, { useState, useMemo, useCallback } from 'react';
import { COLUMNS, DEFAULT_CHECKLIST } from './constants';
import { EditModal } from './components/EditModal';
import { Task, Status, Platform } from './types';

// New Components
import { DragIndicator } from './components/DragIndicator';
import { TopFilters } from './components/TopFilters';
import { DetailsPanel } from './components/DetailsPanel';
import { KanbanBoard } from './components/KanbanBoard';
import { Sidebar } from './components/Sidebar';

// Authentication
// Authentication & Data
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './components/LoginPage';
import { useTasks } from './hooks/useTasks';
import { ConfirmModal } from './components/ConfirmModal';

export default function App() {
  // --- Authentication ---
  const { user, loading: authLoading } = useAuth();

  // --- Data ---
  const { tasks, loading: tasksLoading, createTask, updateTask, deleteTask, duplicateTask, moveTask } = useTasks();

  // --- State ---
  // Tasks state is now managed by useTasks hook
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [focusedTask, setFocusedTask] = useState<Task | null>(null);
  // Track collapse state instead of open/close. Default collapsed (true) creates the strip.
  const [isDetailsPanelCollapsed, setIsDetailsPanelCollapsed] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [activePlatform, setActivePlatform] = useState<Platform | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
    // Toggle: se clicar no mesmo card, fecha o painel
    if (focusedTask?.id === task.id) {
      setIsDetailsPanelCollapsed(prev => !prev);
    } else {
      setFocusedTask(task);
      setIsDetailsPanelCollapsed(false);
    }
  }, [focusedTask?.id]);

  const toggleDetailsPanel = useCallback(() => {
    setIsDetailsPanelCollapsed(prev => !prev);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTask(null), 200);
  }, []);

  const handleCreateNewTask = useCallback(async () => {
    const newTaskTemplate = {
      title: 'Nova Ideia',
      platform: 'YouTube' as Platform,
      priority: ['Draft'],
      status: 'Ideias' as Status,
      description: '',
      checklist: DEFAULT_CHECKLIST
    };

    // Create task in DB
    const createdTask = await createTask(newTaskTemplate);

    if (createdTask) {
      // Abre o modal para edição imediata
      setSelectedTask(createdTask);
      setIsModalOpen(true);
      setFocusedTask(createdTask);
      setIsDetailsPanelCollapsed(false);
    }
  }, [createTask]);

  const handleUpdateTask = useCallback((updatedTask: Task) => {
    updateTask(updatedTask);
    if (focusedTask?.id === updatedTask.id) setFocusedTask(updatedTask);
  }, [focusedTask, updateTask]);

  const handleDuplicateTask = useCallback((taskId: string) => {
    duplicateTask(taskId);
  }, [duplicateTask]);

  const confirmDeleteTask = useCallback(() => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      if (focusedTask?.id === taskToDelete) setFocusedTask(null);
      if (selectedTask?.id === taskToDelete) {
        setIsModalOpen(false);
        setTimeout(() => setSelectedTask(null), 200);
      }
      setTaskToDelete(null); // Fecha modal via efeito ou manual se isOpen depender disso (mas depende de isDeleteModalOpen)
      setIsDeleteModalOpen(false);
    }
  }, [taskToDelete, deleteTask, focusedTask, selectedTask]);

  const handleDeleteTask = useCallback((taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteModalOpen(true);
  }, []);

  const handleTaskMove = useCallback((taskId: string, newStatus: Status) => {
    moveTask(taskId, newStatus);
    if (focusedTask?.id === taskId) setFocusedTask(prev => prev ? { ...prev, status: newStatus } : null);
    setDragSession(null);
  }, [focusedTask, moveTask]);

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


  // --- Authentication Guard ---
  if (authLoading || (user && tasksLoading)) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className={`flex h-screen w-full bg-background text-foreground font-display overflow-hidden selection:bg-primary/30 selection:text-white relative`}>
      {/* Sidebar Component */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(prev => !prev)}
        isZenMode={isZenMode}
        onZenModeToggle={() => setIsZenMode(prev => !prev)}
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
          isZenMode={isZenMode}
        />

        <div className="flex flex-1 overflow-hidden relative">
          <KanbanBoard
            columns={COLUMNS}
            tasksByColumn={tasksByColumn}
            onCardClick={handleCardClick}
            onDuplicateTask={handleDuplicateTask}
            onDeleteTask={handleDeleteTask}
            onTaskMove={handleTaskMove}
            onTaskFocus={handleTaskFocus}
            focusedTaskId={focusedTask?.id}
            dragSession={dragSession}
            onDragStartSession={handleDragStart}
            onDragEnterColumn={handleDragEnter}
            onDragEndSession={handleDragEnd}
            onBackgroundClick={() => {
              setIsDetailsPanelCollapsed(true);
              setFocusedTask(null);
            }}
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

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteTask}
        title="Excluir Tarefa"
        message="Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        variant="danger"
      />
    </div>
  );
}