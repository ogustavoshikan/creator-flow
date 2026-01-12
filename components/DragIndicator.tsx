import React from 'react';
import { Icon } from './Icon';

interface DragIndicatorProps {
  isActive: boolean;
  sourceColumn: string;
  targetColumn: string;
}

export const DragIndicator: React.FC<DragIndicatorProps> = ({ isActive, sourceColumn, targetColumn }) => {
  if (!isActive) return null;

  return (
    <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in pointer-events-none">
      <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md text-white px-5 py-2.5 rounded-full border border-white/10 shadow-2xl">
          <span className="text-xs font-mono font-medium text-gray-400 uppercase tracking-wider">{sourceColumn}</span>
          <Icon name="arrow_forward" className="text-gray-500 text-sm" />
          <span className={`text-xs font-mono font-bold uppercase tracking-wider transition-colors duration-200 ${
            targetColumn !== sourceColumn ? 'text-white' : 'text-gray-400'
          }`}>
            {targetColumn}
          </span>
      </div>
    </div>
  );
};