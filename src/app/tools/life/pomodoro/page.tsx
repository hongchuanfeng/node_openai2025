'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Timer, Play, Pause, RotateCcw, Coffee } from 'lucide-react';

const presets = [
  { label: '专注 25分钟', work: 25 * 60, break: 5 * 60 },
  { label: '专注 45分钟', work: 45 * 60, break: 10 * 60 },
  { label: '短时 15分钟', work: 15 * 60, break: 3 * 60 },
];

export default function PomodoroPage() {
  const [preset, setPreset] = useState(presets[0]);
  const [timeLeft, setTimeLeft] = useState(preset.work);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (!isBreak) {
        setSessions(s => s + 1);
        setIsBreak(true);
        setTimeLeft(preset.break);
      } else {
        setIsBreak(false);
        setTimeLeft(preset.work);
      }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, timeLeft, isBreak, preset]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const progress = isBreak ? ((preset.break - timeLeft) / preset.break) : ((preset.work - timeLeft) / preset.work);
  const circumference = 2 * Math.PI * 120;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-orange-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Timer className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">番茄时钟</h1>
            </div>
            <p className="text-orange-100 text-lg">专注时间管理，提高工作效率</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
            {/* Presets */}
            <div className="flex gap-3 mb-10">
              {presets.map((p, i) => (
                <button
                  key={i}
                  onClick={() => { setPreset(p); if (!isRunning) { setTimeLeft(p.work); setIsBreak(false); } }}
                  className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors ${preset.label === p.label ? 'bg-orange-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Timer */}
            <div className="text-center mb-10">
              <div className="relative inline-flex items-center justify-center w-72 h-72 mx-auto">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 280 280">
                  <circle cx="140" cy="140" r="120" fill="none" stroke="currentColor" strokeWidth="12" className="text-slate-200 dark:text-slate-700" />
                  <circle cx="140" cy="140" r="120" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} className="transition-all duration-1000" style={{ color: isBreak ? '#22c55e' : '#f97316' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={`text-6xl font-bold tabular-nums ${isBreak ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                    {formatTime(timeLeft)}
                  </div>
                  <div className={`text-sm font-medium mt-2 ${isBreak ? 'text-emerald-500' : 'text-slate-500'}`}>
                    {isBreak ? '☕ 休息时间' : '🎯 专注时间'}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-10 py-4 rounded-2xl font-bold text-lg text-white transition-all shadow-lg ${isBreak ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-orange-500 hover:bg-orange-600'} hover:scale-105`}
              >
                {isRunning ? <><Pause className="w-5 h-5 inline mr-2" />暂停</> : <><Play className="w-5 h-5 inline mr-2" />开始</>}
              </button>
              <button
                onClick={() => { setIsRunning(false); setTimeLeft(isBreak ? preset.break : preset.work); }}
                className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Sessions */}
            <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
              <Coffee className="w-5 h-5 text-orange-500" />
              <span className="text-slate-600 dark:text-slate-400">今日已完成 <strong className="text-orange-600 dark:text-orange-400">{sessions}</strong> 个番茄钟</span>
            </div>

            {/* Tips */}
            <div className="mt-8 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-4 text-center">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                💡 建议：专注工作25分钟后，休息5分钟。这样可以保持高效且避免疲劳。
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
