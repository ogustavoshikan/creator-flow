import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isZenMode: boolean;
  onZenModeToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, isZenMode, onZenModeToggle }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  // Largura inicial um pouco menor que w-64 (256px), conforme solicitado
  const [width, setWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        // Limites mínimo e máximo
        const newWidth = Math.max(200, Math.min(mouseMoveEvent.clientX, 480));
        setWidth(newWidth);
      }
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
      // Evita seleção de texto durante resize
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, resize, stopResizing]);

  // Fechar menu de configurações ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };

    if (isSettingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSettingsOpen]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <aside
      ref={sidebarRef}
      className={`hidden md:flex flex-col border-r border-sidebar-border bg-sidebar h-full shrink-0 z-20 transition-all duration-normal relative`}
      style={{ width: isCollapsed ? '5rem' : width }}
    >
      {/* User Profile */}
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} mb-2`}>
        <div className="relative shrink-0 group cursor-pointer">
          <div
            className="w-10 h-10 rounded-full bg-center bg-cover ring-2 ring-border transition-all duration-300 group-hover:ring-primary"
            style={{ backgroundImage: `url("${user?.user_metadata?.avatar_url || 'https://via.placeholder.com/40'}")` }}
          ></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-sidebar"></div>
        </div>

        <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 flex-1'}`}>
          <div className="whitespace-nowrap pl-1">
            <p className="text-sm font-bold truncate text-foreground">
              {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário'}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-2 px-4 flex-1">
        <a href="#" className={`flex items-center gap-3 px-3 py-2.5 rounded-md bg-primary text-primary-foreground shadow-md shadow-primary/20 overflow-hidden group relative hover:bg-primary/90 transition-all`}>
          <div className="shrink-0 flex items-center justify-center w-5 h-5">
            <Icon name="dashboard" />
          </div>
          <span className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            Painel
          </span>
          {isCollapsed && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-popover border border-border text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg animate-fade-in">
              Painel
            </div>
          )}
        </a>
      </nav>

      {/* Settings Button with Dropdown */}
      <div className={`p-4 border-t mt-auto transition-colors duration-200 ${isSettingsOpen ? 'border-transparent' : 'border-sidebar-border'}`} ref={settingsRef}>
        <div className="relative">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all w-full overflow-hidden group outline-none focus-visible:ring-2 focus-visible:ring-ring ${isSettingsOpen ? 'bg-accent text-foreground' : ''}`}
            title="Configurações"
          >
            <div className="shrink-0 flex items-center justify-center w-5 h-5">
              <Icon name="settings" className={`transition-colors text-[20px] ${isSettingsOpen ? 'text-foreground' : 'group-hover:text-foreground'}`} />
            </div>
            <span className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
              Configurações
            </span>
            {!isCollapsed && (
              <Icon
                name={isSettingsOpen ? "expand_less" : "expand_more"}
                className="ml-auto text-[18px] transition-transform"
              />
            )}
          </button>

          {/* Dropdown Menu */}
          {isSettingsOpen && (
            <div className={`${isCollapsed ? 'absolute left-full bottom-0 ml-2 min-w-[160px]' : 'absolute bottom-full left-0 right-0 mb-2'} bg-popover border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 z-50`}>
              <div className="p-1 space-y-1">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all w-full overflow-hidden group outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  title={theme === 'dark' ? "Modo Claro" : "Modo Escuro"}
                >
                  <div className="shrink-0 flex items-center justify-center w-5 h-5">
                    <Icon name={theme === 'dark' ? "light_mode" : "dark_mode"} className="group-hover:text-foreground transition-colors text-[20px]" />
                  </div>
                  <span className="text-sm font-medium whitespace-nowrap">
                    {theme === 'dark' ? "Claro" : "Escuro"}
                  </span>
                </button>

                {/* Zen Mode Toggle */}
                <button
                  onClick={() => {
                    onZenModeToggle();
                    setIsSettingsOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all w-full overflow-hidden group outline-none focus-visible:ring-2 focus-visible:ring-ring ${isZenMode ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
                  title={isZenMode ? "Desativar Zen" : "Modo Zen"}
                >
                  <div className="shrink-0 flex items-center justify-center w-5 h-5">
                    <Icon name={isZenMode ? "fullscreen_exit" : "fullscreen"} className={`${isZenMode ? 'text-primary' : 'group-hover:text-foreground'} transition-colors text-[20px]`} />
                  </div>
                  <span className="text-sm font-medium whitespace-nowrap">
                    {isZenMode ? "Sair do Zen" : "Modo Zen"}
                  </span>
                </button>

                {/* Collapse Toggle */}
                <button
                  onClick={() => {
                    onToggle();
                    setIsSettingsOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all w-full overflow-hidden group outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  title={isCollapsed ? "Expandir" : "Recolher"}
                >
                  <div className="shrink-0 flex items-center justify-center w-5 h-5">
                    <Icon name={isCollapsed ? "dock_to_right" : "dock_to_left"} className="group-hover:text-foreground transition-colors text-[20px]" />
                  </div>
                  <span className="text-sm font-medium whitespace-nowrap">
                    {isCollapsed ? "Expandir" : "Recolher"}
                  </span>
                </button>

                {/* Divider */}
                <div className="h-px bg-border my-1" />

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all w-full overflow-hidden group outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  title="Sair"
                >
                  <div className="shrink-0 flex items-center justify-center w-5 h-5">
                    <Icon name="logout" className="group-hover:text-destructive transition-colors text-[20px]" />
                  </div>
                  <span className="text-sm font-medium whitespace-nowrap">
                    Sair
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resize Handle */}
      {!isCollapsed && (
        <div
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/50 active:bg-primary transition-colors z-30"
          onMouseDown={startResizing}
        ></div>
      )}
    </aside>
  );
};