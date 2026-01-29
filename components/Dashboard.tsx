
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TOOLS } from '../constants';

const data = [
  { name: '一月', usage: 120, tokens: 45000 },
  { name: '二月', usage: 150, tokens: 52000 },
  { name: '三月', usage: 220, tokens: 68000 },
  { name: '四月', usage: 180, tokens: 59000 },
  { name: '五月', usage: 260, tokens: 82000 },
  { name: '六月', usage: 310, tokens: 95000 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: '本月總使用次數', value: '310', delta: '+15%', color: 'blue' },
          { label: '累計節省時間', value: '42 hrs', delta: '+12%', color: 'emerald' },
          { label: 'API Token 消耗', value: '95k', delta: '+8%', color: 'amber' },
          { label: '我的收藏工具', value: '8', delta: '穩定', color: 'indigo' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              <span className={`text-xs font-bold ${stat.delta.startsWith('+') ? 'text-emerald-500' : 'text-slate-400'}`}>
                {stat.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-8">使用趨勢分析</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-8">最受歡迎工具</h3>
          <div className="space-y-4">
            {TOOLS.slice(0, 3).map((tool, i) => (
              <div key={tool.id} className="flex items-center p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <span className="text-2xl mr-4">{tool.icon}</span>
                <div className="flex-grow">
                  <p className="text-sm font-bold text-slate-900">{tool.name}</p>
                  <p className="text-xs text-slate-500">{tool.tags[0]}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{Math.floor(Math.random() * 50) + 20}次</p>
                  <p className="text-[10px] text-emerald-500 font-bold">熱門</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
