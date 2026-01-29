
import React from 'react';
import { MENU_ITEMS, DEPT_COLORS } from '../constants';
import { Department } from '../types';

interface SidebarProps {
  activeDept: string;
  onDeptChange: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeDept, onDeptChange }) => {
  return (
    <aside className="w-64 h-screen bg-slate-900 text-slate-300 fixed left-0 top-0 z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/20">
            A
          </div>
          <span className="text-xl font-bold text-white tracking-tight">EduAI Hub</span>
        </div>

        <nav className="space-y-1">
          {MENU_ITEMS.map((item) => (
            <div key={item.id} className="mb-4">
              <button
                onClick={() => onDeptChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  activeDept === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {item.children && (
                  <svg className={`ml-auto w-4 h-4 transition-transform ${activeDept.startsWith(item.id) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>

              {item.children && activeDept.startsWith(item.id) && (
                <div className="mt-2 ml-4 space-y-1 border-l border-slate-700 pl-4">
                  {item.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => onDeptChange(child.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                        activeDept === child.id 
                          ? 'text-white font-semibold' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 w-full p-6 border-t border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="flex items-center space-x-3 text-sm">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
            陳
          </div>
          <div>
            <p className="text-white font-medium">陳大文 老師</p>
            <p className="text-slate-500 text-xs">教務組-中文科</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
