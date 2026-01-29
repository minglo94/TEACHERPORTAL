
import React, { useState } from 'react';
import { ToolMetadata } from '../types';
import { generateAIResponse } from '../services/gemini';
import { DEPT_COLORS } from '../constants';
import QRCodeTool from './custom/QRCodeTool';
import TimerTool from './custom/TimerTool';

interface ToolExecutionProps {
  tool: ToolMetadata;
  onBack: () => void;
}

const ToolExecution: React.FC<ToolExecutionProps> = ({ tool, onBack }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const colors = DEPT_COLORS[tool.department];

  // Custom tool rendering logic
  if (tool.id === 'qr-generator-tool') {
    return (
      <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
        <button onClick={onBack} className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors mb-8 group">
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">返回工具清單</span>
        </button>
        <QRCodeTool />
      </div>
    );
  }

  if (tool.id === 'class-timer-tool') {
    return (
      <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
        <button onClick={onBack} className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors mb-8 group">
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">返回工具清單</span>
        </button>
        <TimerTool />
      </div>
    );
  }

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const executeTool = async () => {
    const missingFields = tool.inputs.filter(input => !formData[input.key]);
    if (missingFields.length > 0) {
      setError(`請填寫所有必要欄位: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    let prompt = tool.promptTemplate;
    Object.entries(formData).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), value?.toString() || '');
    });

    try {
      const response = await generateAIResponse(prompt);
      setResult(response);
    } catch (err: any) {
      setError(err.message || '執行失敗，請檢查 API Key 或網路連線。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors mb-8 group"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">返回工具清單</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 h-fit">
          <div className="flex items-center space-x-4 mb-8">
            <div className={`w-16 h-16 ${colors.light} rounded-2xl flex items-center justify-center text-4xl shadow-inner`}>
              {tool.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{tool.name}</h2>
              <p className="text-slate-500 text-sm">{tool.description}</p>
            </div>
          </div>

          <div className="space-y-6">
            {tool.inputs.map((input) => (
              <div key={input.key} className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">{input.label}</label>
                {input.type === 'textarea' ? (
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all min-h-[150px] text-slate-800"
                    placeholder={input.placeholder}
                    value={formData[input.key] || ''}
                    onChange={(e) => handleInputChange(input.key, e.target.value)}
                  />
                ) : input.type === 'select' ? (
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none bg-no-repeat bg-[right_1rem_center] text-slate-800"
                    value={formData[input.key] || ''}
                    onChange={(e) => handleInputChange(input.key, e.target.value)}
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")' }}
                  >
                    <option value="">請選擇...</option>
                    {input.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={input.type}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-800"
                    placeholder={input.placeholder}
                    value={formData[input.key] || ''}
                    onChange={(e) => handleInputChange(input.key, e.target.value)}
                  />
                )}
              </div>
            ))}

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center space-x-2 animate-in slide-in-from-top-1">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={executeTool}
              disabled={loading}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2 ${colors.primary} hover:opacity-90`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>AI 處理中...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>執行 AI 生成</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 flex-grow shadow-2xl min-h-[500px] border border-slate-800 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold flex items-center space-x-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span>AI 輸出結果</span>
              </h3>
              {result && (
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(result);
                    alert('內容已複製！');
                  }}
                  className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center space-x-1 bg-slate-800 px-3 py-1.5 rounded-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span>複製</span>
                </button>
              )}
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex flex-col space-y-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-slate-800 rounded w-1/2 animate-pulse"></div>
                    <div className="h-4 bg-slate-800 rounded w-5/6 animate-pulse"></div>
                  </div>
                  <div className="space-y-3 pt-6">
                    <div className="h-4 bg-slate-800 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-slate-800 rounded w-4/5 animate-pulse"></div>
                    <div className="h-4 bg-slate-800 rounded w-2/3 animate-pulse"></div>
                  </div>
                </div>
              ) : result ? (
                <div className="text-slate-200 whitespace-pre-wrap leading-relaxed prose prose-invert max-w-none">
                  {result}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-4">
                  <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <p className="text-sm font-medium">填寫左側資訊並點擊「執行 AI 生成」</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolExecution;
