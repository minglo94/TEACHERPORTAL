
import React, { useState, useEffect, useRef } from 'react';

interface TimeLog {
  time: string;
  totalSeconds: number;
  timestamp: string;
}

const TimerTool: React.FC = () => {
  // Timer State
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Add Time State
  const [addH, setAddH] = useState(0);
  const [addM, setAddM] = useState(0);
  const [addS, setAddS] = useState(0);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  
  // UI State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timerStatus, setTimerStatus] = useState<'stopped' | 'running' | 'paused' | 'ended'>('stopped');

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const timeTimer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timeTimer);
  }, []);

  const formatTime = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (isRunning && !isPaused) return;
    
    if (isPaused) {
      setIsPaused(false);
      setTimerStatus('running');
      return;
    }

    const total = hours * 3600 + minutes * 60 + seconds;
    if (total <= 0) {
      alert("請輸入有效的計時時間！");
      return;
    }

    setRemainingSeconds(total);
    setIsRunning(true);
    setIsPaused(false);
    setTimerStatus('running');
  };

  useEffect(() => {
    if (isRunning && !isPaused && remainingSeconds > 0) {
      intervalRef.current = window.setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            setTimerStatus('ended');
            playEndSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isPaused, remainingSeconds]);

  const pauseResumeTimer = () => {
    if (!isRunning && remainingSeconds <= 0) return;
    setIsPaused(!isPaused);
    setTimerStatus(isPaused ? 'running' : 'paused');
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setRemainingSeconds(0);
    setTimerStatus('stopped');
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setTimeLogs([]);
    setIsFullscreen(false);
  };

  const addTime = (h = addH, m = addM, s = addS) => {
    const total = h * 3600 + m * 60 + s;
    if (total <= 0) {
      if (h === addH && m === addM && s === addS) alert("請輸入有效的補時時間！");
      return;
    }

    setRemainingSeconds(prev => prev + total);
    
    const log: TimeLog = {
      time: formatTime(total),
      totalSeconds: total,
      timestamp: new Date().toLocaleTimeString()
    };
    setTimeLogs(prev => [...prev, log]);
    
    setAddH(0);
    setAddM(0);
    setAddS(0);
  };

  const playEndSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) { console.error(e); }
  };

  const timerColorClass = () => {
    if (remainingSeconds <= 30 && remainingSeconds > 0) return 'text-red-500 animate-pulse';
    if (remainingSeconds <= 60 && remainingSeconds > 0) return 'text-orange-500 animate-pulse';
    return 'text-slate-800';
  };

  const totalAddedSecs = timeLogs.reduce((acc, curr) => acc + curr.totalSeconds, 0);

  return (
    <div className="space-y-8">
      {/* Normal View */}
      {!isFullscreen && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
                  <span>🕒 當前時間</span>
                </h2>
                <div className="text-5xl font-mono text-center py-6 bg-slate-50 rounded-2xl border border-slate-100 text-slate-800">
                  {currentTime.toLocaleTimeString('zh-TW', { hour12: false })}
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
                <h2 className="text-xl font-bold text-slate-900 mb-6">計時器設定</h2>
                <div className="flex justify-center space-x-4 mb-8">
                  {[
                    { label: '時', value: hours, max: 23, set: setHours },
                    { label: '分', value: minutes, max: 59, set: setMinutes },
                    { label: '秒', value: seconds, max: 59, set: setSeconds }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <span className="text-sm font-bold text-slate-500 mb-2">{item.label}</span>
                      <input
                        type="number"
                        min="0"
                        max={item.max}
                        value={item.value}
                        onChange={(e) => item.set(parseInt(e.target.value) || 0)}
                        disabled={isRunning && !isPaused}
                        className="w-20 h-20 text-3xl font-bold text-center border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:bg-slate-50"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4">
                  <button onClick={startTimer} className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all">
                    {isPaused ? '恢復計時' : '開始計時'}
                  </button>
                  <button onClick={pauseResumeTimer} className="flex-1 bg-slate-100 text-slate-700 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all">
                    {isPaused ? '恢復' : '暫停'}
                  </button>
                  <button onClick={resetTimer} className="flex-1 bg-slate-100 text-slate-700 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all">
                    重置
                  </button>
                  <button onClick={() => setIsFullscreen(true)} className="w-full bg-blue-500 text-white font-bold py-4 rounded-2xl hover:bg-blue-600 shadow-md transition-all">
                    全螢幕顯示
                  </button>
                </div>

                <div className="mt-10 p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                  <div className={`text-7xl font-mono mb-4 ${timerColorClass()}`}>
                    {formatTime(remainingSeconds)}
                  </div>
                  <div className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    timerStatus === 'running' ? 'bg-emerald-100 text-emerald-700' : 
                    timerStatus === 'paused' ? 'bg-orange-100 text-orange-700' :
                    timerStatus === 'ended' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {timerStatus === 'running' ? '運行中' : timerStatus === 'paused' ? '已暫停' : timerStatus === 'ended' ? '計時結束' : '未啟動'}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl border-dashed border-2 border-blue-200 bg-blue-50/30">
                <h2 className="text-xl font-bold text-slate-900 mb-6">🕒 補時功能</h2>
                <div className="flex justify-center space-x-4 mb-8">
                  {[
                    { label: '時', value: addH, set: setAddH },
                    { label: '分', value: addM, set: setAddM },
                    { label: '秒', value: addS, set: setAddS }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <span className="text-sm font-bold text-slate-500 mb-2">{item.label}</span>
                      <input
                        type="number"
                        min="0"
                        value={item.value}
                        onChange={(e) => item.set(parseInt(e.target.value) || 0)}
                        className="w-20 h-20 text-3xl font-bold text-center border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>
                <button onClick={() => addTime()} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg mb-6">
                  添加補時
                </button>

                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                  <div className="text-sm font-bold text-slate-700 mb-4 flex justify-between">
                    <span>補時記錄</span>
                    <span className="text-blue-600">總計: {formatTime(totalAddedSecs)}</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto space-y-2 text-sm text-slate-500">
                    {timeLogs.length === 0 ? '無補時記錄' : timeLogs.map((log, idx) => (
                      <div key={idx} className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="font-bold text-slate-700">+{log.time}</span>
                        <span>{log.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-slate-900 flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
          <div className="absolute top-10 text-slate-500 text-lg uppercase tracking-widest font-bold">
            剩餘時間
          </div>
          <div className={`text-[25vw] font-mono leading-none font-light tracking-tighter ${timerColorClass()}`}>
            {formatTime(remainingSeconds)}
          </div>
          
          <div className="flex flex-col items-center mt-10 space-y-4">
            <div className={`text-2xl font-bold ${timerStatus === 'paused' ? 'text-orange-400' : 'text-slate-400'}`}>
              {timerStatus === 'running' ? '計時器運行中...' : timerStatus === 'paused' ? '計時已暫停' : timerStatus === 'ended' ? '計時結束！' : '計時器未啟動'}
            </div>
            {totalAddedSecs > 0 && (
              <div className="text-emerald-400 text-2xl font-bold flex items-center space-x-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                <span>累計補時: {formatTime(totalAddedSecs)}</span>
              </div>
            )}
          </div>

          <div className="absolute bottom-16 flex space-x-6">
            <button 
              onClick={() => setIsFullscreen(false)}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl font-bold backdrop-blur-xl transition-all"
            >
              退出全螢幕
            </button>
            <button 
              onClick={pauseResumeTimer}
              className="px-12 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl font-bold backdrop-blur-xl transition-all"
            >
              {isPaused ? '恢復' : '暫停'}
            </button>
            <button 
              onClick={() => addTime(0, 1, 0)}
              className="px-8 py-4 bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/40 rounded-2xl font-bold text-emerald-400 backdrop-blur-xl transition-all"
            >
              快速補時 1 分鐘
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerTool;
