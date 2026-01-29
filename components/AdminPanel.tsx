
import React, { useState, useEffect } from 'react';
import { TOOLS } from '../constants';
import { AdminUser, UsageLog } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminPanelProps {
  user: AdminUser | null;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'logs' | 'settings'>('tools');
  const [editingToolId, setEditingToolId] = useState<string | null>(null);

  // Mock usage logs
  const logs: UsageLog[] = [
    { id: '1', timestamp: '2023-10-25 14:30', toolId: 'comment-writer', toolName: '學生評語生成器', userEmail: 'chen.dw@school.edu.hk', inputData: '王小明, 85分', status: 'success' },
    { id: '2', timestamp: '2023-10-25 15:10', toolId: 'essay-grader', toolName: '作文批改助手', userEmail: 'lee.sm@school.edu.hk', inputData: '中三作文', status: 'success' },
    { id: '3', timestamp: '2023-10-25 15:45', toolId: 'tone-checker', toolName: '公文語氣檢查器', userEmail: 'admin@school.edu.hk', inputData: '校慶通知', status: 'success' },
  ];

  // Simulated Login logic if no user
  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
        <div className="bg-slate-800 p-12 rounded-3xl border border-slate-700 shadow-2xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-4xl text-white mx-auto mb-8 shadow-xl shadow-blue-500/20">
            🛡️
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">管理員身分驗證</h2>
          <p className="text-slate-400 mb-10">請使用學校 Google 帳號登入以進入管理後台</p>
          
          <div id="g_id_onload"
               data-client_id="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
               data-context="signin"
               data-ux_mode="popup"
               data-callback="handleCredentialResponse"
               data-auto_prompt="false">
          </div>
          <div className="g_id_signin"
               data-type="standard"
               data-shape="rectangular"
               data-theme="filled_blue"
               data-text="signin_with"
               data-size="large"
               data-logo_alignment="left">
          </div>

          <div className="mt-8 pt-8 border-t border-slate-700">
            <button 
              onClick={() => (window as any).google.accounts.id.prompt()}
              className="text-slate-500 hover:text-white text-sm transition-colors"
            >
              登入遇到問題？聯繫資訊組
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 text-white">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">系統管理控制台</h1>
          <p className="text-slate-400">歡迎回來，{user.name}。目前系統運行穩定。</p>
        </div>
        <button 
          onClick={onLogout}
          className="px-6 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold"
        >
          登出後台
        </button>
      </div>

      <div className="flex space-x-2 mb-8 bg-slate-800/50 p-1.5 rounded-2xl w-fit border border-slate-700">
        {[
          { id: 'tools', label: '工具管理', icon: '🛠️' },
          { id: 'logs', label: '使用日誌', icon: '📜' },
          { id: 'settings', label: '系統設定', icon: '⚙️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl transition-all font-bold ${activeTab === tab.id ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'tools' && (
        <div className="grid grid-cols-1 gap-6">
          {TOOLS.map(tool => (
            <div key={tool.id} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex items-center justify-between group hover:border-blue-500/50 transition-colors">
              <div className="flex items-center space-x-6">
                <div className="text-4xl bg-slate-800 p-4 rounded-xl">{tool.icon}</div>
                <div>
                  <h3 className="text-lg font-bold">{tool.name}</h3>
                  <p className="text-slate-400 text-sm max-w-xl">{tool.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right mr-6">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">使用率</p>
                  <p className="text-blue-400 font-mono font-bold">78%</p>
                </div>
                <button 
                  onClick={() => setEditingToolId(tool.id)}
                  className="px-4 py-2 bg-slate-700 hover:bg-blue-600 rounded-lg transition-colors font-bold text-sm"
                >
                  編輯配置
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <th className="px-6 py-4">時間</th>
                <th className="px-6 py-4">工具名稱</th>
                <th className="px-6 py-4">使用者</th>
                <th className="px-6 py-4">狀態</th>
                <th className="px-6 py-4">詳情</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-slate-400">{log.timestamp}</td>
                  <td className="px-6 py-4 font-bold">{log.toolName}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{log.userEmail}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 italic truncate max-w-xs">{log.inputData}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-6">API 配置</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Gemini Model</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-blue-500">
                  <option>gemini-3-flash-preview</option>
                  <option>gemini-3-pro-preview</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">每日限制 (Tokens)</label>
                <input type="number" defaultValue={1000000} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8">
             <h3 className="text-xl font-bold mb-6">資源監控</h3>
             <div className="h-48 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800">
                <p className="text-slate-600 font-mono text-xs">TOKEN USAGE REALTIME CHART PLACEHOLDER</p>
             </div>
          </div>
        </div>
      )}

      {/* Edit Modal Placeholder */}
      {editingToolId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 backdrop-blur-sm bg-black/60">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
            <div className="p-8 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold">編輯工具配置</h2>
              <button onClick={() => setEditingToolId(null)} className="text-slate-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8 space-y-6">
               <p className="text-slate-400 text-sm">正在編輯：<span className="text-blue-400 font-bold">{TOOLS.find(t => t.id === editingToolId)?.name}</span></p>
               <div className="grid grid-cols-1 gap-4">
                  <input placeholder="工具名稱" className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" defaultValue={TOOLS.find(t => t.id === editingToolId)?.name} />
                  <textarea placeholder="描述" className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white h-24" defaultValue={TOOLS.find(t => t.id === editingToolId)?.description} />
                  <textarea placeholder="AI Prompt 範本" className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono text-sm h-32" defaultValue={TOOLS.find(t => t.id === editingToolId)?.promptTemplate} />
               </div>
            </div>
            <div className="p-8 bg-slate-900/50 rounded-b-3xl flex justify-end space-x-4">
              <button onClick={() => setEditingToolId(null)} className="px-6 py-2 rounded-xl text-slate-400 hover:text-white font-bold">取消</button>
              <button onClick={() => { alert('已保存變更 (DEMO)'); setEditingToolId(null); }} className="px-8 py-2 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20">保存配置</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
