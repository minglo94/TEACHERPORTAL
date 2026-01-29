
import React from 'react';
import { ToolMetadata, Department } from '../types';
import { DEPT_COLORS } from '../constants';

interface ToolCardProps {
  tool: ToolMetadata;
  onLaunch: (toolId: string) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onLaunch }) => {
  const colors = DEPT_COLORS[tool.department] || DEPT_COLORS[Department.ACADEMIC];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full">
      <div className={`h-1.5 w-full ${colors.primary}`} />
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-6">
          <div className={`w-14 h-14 ${colors.light} rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-300`}>
            {tool.icon}
          </div>
          <button className="text-slate-300 hover:text-red-500 transition-colors p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
          {tool.name}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
          {tool.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {tool.tags.map(tag => (
            <span key={tag} className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${colors.light} ${colors.text} border border-slate-100`}>
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => onLaunch(tool.id)}
          className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2 text-white shadow-lg transition-all active:scale-95 ${colors.primary} hover:opacity-90 hover:shadow-xl`}
        >
          <span>啟動工具</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
      
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
        <span className="text-xs text-slate-400 font-medium">本月使用 23 次</span>
        {tool.isBatchSupported && (
          <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">BATCH</span>
        )}
      </div>
    </div>
  );
};

export default ToolCard;
