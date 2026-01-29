
import React, { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ToolCard from './components/ToolCard';
import ToolExecution from './components/ToolExecution';
import AdminPanel from './components/AdminPanel';
import { Department, ToolMetadata, AdminUser } from './types';
import { TOOLS, MENU_ITEMS } from './constants';

const App: React.FC = () => {
  const [activeDept, setActiveDept] = useState<string>('dashboard');
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Initialize Google SSO
  useEffect(() => {
    // Only attempt if window.google is defined (loaded by index.html script)
    if ((window as any).google) {
      (window as any).google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com", // Replace with real ID
        callback: handleCredentialResponse,
      });
    }
  }, []);

  const handleCredentialResponse = (response: any) => {
    // In a real app, you would decode the JWT and verify the payload
    // We'll simulate a successful admin login for demo purposes
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    setAdminUser({
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
      role: payload.email.includes('admin') ? 'superadmin' : 'admin'
    });
  };

  const handleLogout = () => {
    setAdminUser(null);
    setActiveDept('dashboard');
  };

  const selectedTool = useMemo(() => 
    TOOLS.find(t => t.id === selectedToolId), 
    [selectedToolId]
  );

  const filteredTools = useMemo(() => {
    let result = TOOLS;
    if (activeDept !== 'dashboard' && activeDept !== 'sysadmin') {
      if (activeDept.startsWith('academic-')) {
        const sub = activeDept.replace('academic-', '');
        result = result.filter(t => t.department === Department.ACADEMIC && t.tags.some(tag => tag.includes(sub === 'chinese' ? '中文' : sub === 'english' ? '英文' : '理科')));
      } else {
        const menuItem = MENU_ITEMS.find(m => m.id === activeDept);
        if (menuItem?.department) {
          result = result.filter(t => t.department === menuItem.department);
        }
      }
    }
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

  const handleDeptChange = (id: string) => {
    setActiveDept(id);
    setSelectedToolId(null);
  };

  const renderContent = () => {
    if (activeDept === 'sysadmin') {
      return <AdminPanel user={adminUser} onLogout={handleLogout} />;
    }

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
          <p className="text-slate-500">瀏覽並啟動最適合您的 AI 教學助手</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} onLaunch={id => setSelectedToolId(id)} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex ${activeDept === 'sysadmin' ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <Sidebar activeDept={activeDept} onDeptChange={handleDeptChange} />
      <main className="flex-grow ml-64 p-8 min-h-screen">
        <header className="flex justify-between items-center mb-10">
          <div className="relative w-96 group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="搜尋工具、功能或分類..."
              className={`w-full pl-12 pr-4 py-3 border rounded-2xl shadow-sm outline-none transition-all placeholder-slate-400 ${activeDept === 'sysadmin' ? 'bg-slate-800 border-slate-700 text-white focus:ring-slate-600' : 'bg-white border-slate-200 focus:ring-blue-500'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
             {adminUser ? (
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur rounded-full px-4 py-2 border border-white/10">
                  <img src={adminUser.picture} className="w-8 h-8 rounded-full" alt="avatar" />
                  <span className="text-sm font-medium text-slate-300">{adminUser.name} (Admin)</span>
                </div>
             ) : (
                <div className="flex items-center space-x-2 text-slate-500 text-sm">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  <span>系統已連線</span>
                </div>
             )}
          </div>
        </header>
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
