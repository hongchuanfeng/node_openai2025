'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Calculator as CalcIcon } from 'lucide-react';

export default function CalculatorPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const buttons = [
    { label: 'C', className: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
    { label: '(', className: 'bg-slate-100 dark:bg-slate-700' },
    { label: ')', className: 'bg-slate-100 dark:bg-slate-700' },
    { label: '/', className: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
    { label: '7', className: 'bg-white dark:bg-slate-700' },
    { label: '8', className: 'bg-white dark:bg-slate-700' },
    { label: '9', className: 'bg-white dark:bg-slate-700' },
    { label: '*', className: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
    { label: '4', className: 'bg-white dark:bg-slate-700' },
    { label: '5', className: 'bg-white dark:bg-slate-700' },
    { label: '6', className: 'bg-white dark:bg-slate-700' },
    { label: '-', className: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
    { label: '1', className: 'bg-white dark:bg-slate-700' },
    { label: '2', className: 'bg-white dark:bg-slate-700' },
    { label: '3', className: 'bg-white dark:bg-slate-700' },
    { label: '+', className: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
    { label: '0', className: 'bg-white dark:bg-slate-700' },
    { label: '.', className: 'bg-white dark:bg-slate-700' },
    { label: '=', className: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' },
  ];

  const handleInput = (value: string) => {
    if (value === 'C') {
      setInput('');
      setResult('');
      setError('');
    } else if (value === '=') {
      calculate();
    } else {
      setInput(prev => prev + value);
    }
  };

  const calculate = () => {
    if (!input.trim()) return;
    try {
      const evalResult = Function('"use strict"; return (' + input + ')')();
      const formattedResult = Number.isInteger(evalResult)
        ? evalResult.toString()
        : evalResult.toFixed(8).replace(/\.?0+$/, '');
      setResult(formattedResult);
      setHistory(prev => [...prev.slice(-9), `${input} = ${formattedResult}`]);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : '计算错误');
      setResult('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              在线计算器
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              支持加减乘除、括号等基本运算的科学计算器
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-md mx-auto px-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xl">
              <div className="mb-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="0"
                  className="w-full p-4 text-right text-3xl font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {result && (
                  <div className="text-right mt-2 text-xl text-slate-500">
                    = {result}
                  </div>
                )}
                {error && (
                  <div className="text-right mt-2 text-sm text-red-500">
                    {error}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {buttons.map((btn, i) => (
                  <button
                    key={i}
                    onClick={() => handleInput(btn.label)}
                    className={`p-4 rounded-xl text-xl font-semibold transition-all hover:scale-105 active:scale-95 ${btn.className}`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-md mx-auto px-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">计算历史</h2>
            <div className="space-y-2">
              {history.length === 0 ? (
                <p className="text-slate-500 text-center py-4">暂无历史记录</p>
              ) : (
                history.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-800 rounded-lg p-3 text-slate-600 dark:text-slate-400 font-mono"
                  >
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
