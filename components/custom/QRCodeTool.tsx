
import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'https://esm.sh/qrcode';

const QRCodeTool: React.FC = () => {
  const [content, setContent] = useState('');
  const [qrGenerated, setQrGenerated] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQRCode = async () => {
    if (!content.trim()) return;
    try {
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, content, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'H'
        });
        setQrGenerated(true);
      }
    } catch (err) {
      console.error(err);
      alert('生成失敗');
    }
  };

  const downloadQRCode = () => {
    if (!canvasRef.current) return;
    const borderSize = 20;
    const canvas = canvasRef.current;
    const newCanvas = document.createElement('canvas');
    const newCtx = newCanvas.getContext('2d')!;

    newCanvas.width = canvas.width + borderSize * 2;
    newCanvas.height = canvas.height + borderSize * 2;
    newCtx.fillStyle = '#ffffff';
    newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);
    newCtx.drawImage(canvas, borderSize, borderSize);

    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = newCanvas.toDataURL('image/png');
    link.click();
  };

  const clearAll = () => {
    setContent('');
    setQrGenerated(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">QR Code 生成器</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">請輸入網址或文字：</label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 min-h-[150px] outline-none transition-all"
              placeholder="請輸入內容，例如：https://school.edu.hk"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) generateQRCode();
              }}
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={generateQRCode}
              className="flex-1 bg-blue-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>生成 QR Code</span>
            </button>
            <button
              onClick={clearAll}
              className="bg-slate-100 text-slate-700 font-bold py-3.5 px-6 rounded-xl hover:bg-slate-200 transition-all"
            >
              清空
            </button>
            <button
              onClick={downloadQRCode}
              disabled={!qrGenerated}
              className={`flex-1 font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 ${
                qrGenerated ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>下載 QR Code</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8 min-h-[350px]">
          {!qrGenerated ? (
            <div className="text-center">
              <div className="text-5xl opacity-20 mb-4">📱</div>
              <p className="text-slate-400 italic font-medium">二維碼將在此處顯示</p>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-xl border border-slate-100">
              <canvas ref={canvasRef}></canvas>
            </div>
          )}
          {qrGenerated && (
            <p className="mt-6 text-slate-500 text-sm font-medium">
              已生成二維碼，內容長度: {content.length} 字符
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeTool;
