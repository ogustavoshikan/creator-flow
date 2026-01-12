import React from 'react';
import { Icon } from './Icon';
import { Platform } from '../types';

interface TopFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activePlatform: Platform | 'all';
  onPlatformChange: (platform: Platform | 'all') => void;
  onCreateNew: () => void;
}

export const TopFilters: React.FC<TopFiltersProps> = ({ 
  searchQuery, 
  onSearchChange, 
  activePlatform, 
  onPlatformChange,
  onCreateNew
}) => {
  
  const getFilterBtnClass = (isActive: boolean) => 
    `px-4 py-1.5 rounded-full text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${
      isActive 
        ? 'bg-foreground text-background font-bold shadow-md hover:shadow-lg' 
        : 'bg-accent border border-input hover:border-muted-foreground text-muted-foreground hover:text-foreground font-medium'
    }`;

  return (
    <header className={`w-full px-8 py-6 border-b border-border flex flex-col gap-6 shrink-0 z-10 bg-background/95 backdrop-blur-md`}>
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Meu Fluxo de Trabalho</h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium">Gerencie seu funil de conteúdo de forma eficiente.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={onCreateNew} className={`group flex items-center justify-center gap-2 rounded-md h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 text-sm font-bold transition-all active:scale-95 ring-offset-2 ring-offset-background focus:ring-2 focus:ring-ring`}>
              <Icon name="add" className="text-[20px] group-hover:rotate-90 transition-transform duration-300" />
              <span>Nova Ideia</span>
          </button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between mt-1">
        <div className="relative w-full max-w-md group/search">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground group-focus-within/search:text-primary transition-colors">
            <Icon name="search" />
          </div>
          <input 
            type="text" 
            value={searchQuery} 
            onChange={(e) => onSearchChange(e.target.value)} 
            className={`block w-full pl-10 p-2.5 bg-input border border-input text-foreground text-sm rounded-md placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-input transition-all outline-none font-medium`} 
            placeholder="Busque por nome, tag ou plataforma..." 
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 max-w-full custom-scrollbar">
          <button onClick={() => onPlatformChange('all')} className={getFilterBtnClass(activePlatform === 'all')}>Todas</button>
          <button onClick={() => onPlatformChange('YouTube')} className={getFilterBtnClass(activePlatform === 'YouTube')}><span className="w-2 h-2 rounded-full bg-red-500"></span> YouTube</button>
          <button onClick={() => onPlatformChange('Instagram')} className={getFilterBtnClass(activePlatform === 'Instagram')}><span className="w-2 h-2 rounded-full bg-pink-500"></span> Instagram</button>
          <button onClick={() => onPlatformChange('TikTok')} className={getFilterBtnClass(activePlatform === 'TikTok')}><span className="w-2 h-2 rounded-full bg-white border border-slate-600"></span> TikTok</button>
          <button onClick={() => onPlatformChange('Blog')} className={getFilterBtnClass(activePlatform === 'Blog')}><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Blog</button>
        </div>
      </div>
    </header>
  );
};