import React from 'react';
import { Icon } from './Icon';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  return (
    <aside 
      className={`hidden md:flex flex-col border-r border-sidebar-border bg-sidebar h-full shrink-0 z-20 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      {/* User Profile */}
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} mb-2`}>
        <div className="relative shrink-0 group cursor-pointer">
           <div className="w-10 h-10 rounded-full bg-center bg-cover ring-2 ring-border transition-all duration-300 group-hover:ring-primary" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDcqBKo5YX3rWlx5U8_osfnf8bXN2LfP5EDJVXqeGzRcxDzrTl44sLKKMgVAk7HLlEb7zQya_ID6lg10FmQFo2XzI0esl69afuhlIKejFK0DFzS5YBxPX56ZkhSOec2fA6Q1mcwOi6KXWlfOiHpIQeZ1AMniiAEvZ0D-Q0C92HZaqFCkjLbYmincV9Osa9Q9gPOuaSCMmO91rAChxusKeV8lfVCk8hXNyiUx97iCkjjSrg4u1sjd-0viIucRdve35Jh5_XzKsXsFupI")' }}></div>
           <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-sidebar"></div>
        </div>
        
        <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
          <div className="whitespace-nowrap pl-1">
            <p className="text-sm font-bold truncate text-foreground">Alex Creator</p>
            <p className="text-xs text-muted-foreground truncate">Conta Pro</p>
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

      {/* Collapse Trigger */}
      <div className="p-4 border-t border-sidebar-border mt-auto">
        <button 
          onClick={onToggle}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all w-full overflow-hidden group outline-none focus-visible:ring-2 focus-visible:ring-ring"
          title={isCollapsed ? "Expandir" : "Recolher"}
        >
          <div className="shrink-0 flex items-center justify-center w-5 h-5">
             <Icon name={isCollapsed ? "dock_to_right" : "dock_to_left"} className="group-hover:text-foreground transition-colors text-[20px]" />
          </div>
          <span className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
             Recolher
          </span>
        </button>
      </div>
    </aside>
  );
};