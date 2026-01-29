
import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ToolCard from './components/ToolCard';
import ToolExecution from './components/ToolExecution';
import { Department, ToolMetadata } from './types';
import { TOOLS, MENU_ITEMS } from './constants';

const App: React.FC = () => {
  const [activeDept, setActiveDept] = useState<string>('dashboard');
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Find current tool metadata
  const selectedTool = useMemo(() => 
    TOOLS.find(t => t.id === selectedToolId), 
    [selectedToolId]
  );

  // Filter tools based on search and active department
  const filteredTools = useMemo(() => {
    let result = TOOLS;

    // Filter by department if not dashboard
    if (activeDept !== 'dashboard') {
      // Handle sub-departments like academic-chinese
      if (activeDept.startsWith('academic-')) {
        const sub = activeDept.replace('academic-', '');
        result = result.filter(t => t.department === Department.ACADEMIC && t.tags.some(tag => tag.includes(sub === 'chinese' ? '中文' : sub === 'english' ? '英文' : '理科')));
      } else {
        // Find if activeDept maps to a main department
        const menuItem = MENU_ITEMS.find(m => m.id === activeDept);
        if (menuItem?.department) {
          result = result.filter(t => t.department === menuItem.department);
        }
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.name.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    return result;
  }, [activeDept, searchQuery]);

  const handleLaunchTool = (id: string) => {
    setSelectedToolId(id);
  };

  const handleDeptChange = (id: string) => {
    setActiveDept(id);
    setSelectedToolId(null); // Clear tool selection when changing departments
  };

  const renderContent = () => {
    if (selectedTool) {
      return (
        <ToolExecution 
          tool={selectedTool} 
          onBack={() => setSelectedToolId(null)} 
        />
      );
    }

    if (activeDept === 'dashboard') {
      return <Dashboard />;
    }

    return (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {MENU_ITEMS.find(m => m.id === activeDept)?.label || 
             MENU_ITEMS.find(m => m.children?.some(c => c.id === activeDept))?.children?.find(c => c.id === activeDept)?.label ||
             '所有工具'}
          </h1>
          <p className="text-slate-500">
            瀏覽並啟動最適合您的 AI 教學助手
          </p>
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} onLaunch={handleLaunchTool} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-slate-400 font-medium">找不到符合條件的工具</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-blue-600 font-bold hover:underline"
            >
              清除所有搜尋過濾
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar activeDept={activeDept} onDeptChange={handleDeptChange} />
      
      <main className="flex-grow ml-64 p-8 min-h-screen">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-10">
          <div className="relative w-96 group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="搜尋工具、功能或分類... (Ctrl + K)"
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 hover:shadow-md transition-all relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-3 rounded-2xl hover:bg-slate-800 transition-all font-medium shadow-lg shadow-slate-900/10">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span>系統連線中</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
