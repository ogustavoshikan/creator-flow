export const THEME = {
  colors: {
    background: 'bg-[#000000]',
    surface: 'bg-[#0F0F0F]',
    sidebar: 'bg-[#050505]',
    border: 'border-[#1a1a1a]',
    borderHighlight: 'border-white/10',
    text: {
      primary: 'text-white',
      secondary: 'text-gray-400',
      muted: 'text-slate-500',
    },
    primary: 'text-primary',
    bgPrimary: 'bg-primary',
  },
  components: {
    card: 'bg-surface hover:bg-[#161616] shadow-sm',
    panel: 'bg-[#050505] border-l border-[#1a1a1a]',
    input: 'bg-[#0f0f0f] border border-[#222] focus:border-primary/50 text-white text-sm rounded-lg',
    button: {
      icon: 'text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10',
      primary: 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25',
    },
    tag: {
      base: 'px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
    }
  },
  layout: {
    sidebarWidth: 'w-64',
    panelWidth: 'w-[400px]',
  }
};