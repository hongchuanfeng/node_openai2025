'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calculator, Delete, RotateCcw } from 'lucide-react';

export default function OnlineCalcPage() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const ops = ['+', '-', '×', '÷', '%'];
  const digits = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', '±'];

  const handleDigit = (d: string) => {
    if (d === '±') {
      if (display !== '0') {
        setDisplay(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev);
      }
    } else {
      setDisplay(prev => prev === '0' && d !== '.' ? d : prev + d);
    }
  };

  const handleOp = (op: string) => {
    const opMap: Record<string, string> = { '×': '*', '÷': '/', '%': '/100' };
    const realOp = opMap[op] || op;
    if (realOp === '/100') {
      setExpression(prev => prev + display + realOp);
      try {
        const result = Function('"use strict"; return (' + expression + display + realOp + ')')();
        const formatted = Number.isInteger(result) ? result.toString() : result.toFixed(8).replace(/\.?0+$/, '');
        setDisplay(formatted);
        setHistory(h => [...h, `${display}% = ${formatted}`]);
        setExpression('');
      } catch { setDisplay('Error'); }
    } else {
      setExpression(prev => prev + display + realOp);
      setDisplay('0');
    }
  };

  const handleEquals = () => {
    try {
      const result = Function('"use strict"; return (' + expression + display + ')')();
      const formatted = Number.isInteger(result) ? result.toString() : result.toFixed(8).replace(/\.?0+$/, '');
      setHistory(h => [...h, `${expression}${display} = ${formatted}`]);
      setDisplay(formatted);
      setExpression('');
    } catch { setDisplay('Error'); }
  };

  const handleClear = () => { setDisplay('0'); setExpression(''); };
  const handleBackspace = () => setDisplay(prev => prev.length === 1 ? '0' : prev.slice(0, -1));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-purple-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Calculator className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">在线计算器</h1>
            </div>
            <p className="text-blue-100 text-lg">多功能计算器，支持基础运算</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-sm mx-auto px-4">
            {/* Display */}
            <div className="bg-slate-900 rounded-3xl p-6 mb-4">
              <div className="text-right mb-2">
                <div className="text-slate-500 text-sm h-6">{expression}</div>
              </div>
              <div className="text-right">
                <div className="text-white text-5xl font-bold font-mono tabular-nums overflow-hidden text-ellipsis">
                  {display}
                </div>
              </div>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'C', type: 'op', action: handleClear },
                { label: '⌫', type: 'op', action: handleBackspace },
                { label: '%', type: 'op', action: () => handleOp('%') },
                { label: '÷', type: 'op', action: () => handleOp('÷') },
                { label: '7', type: 'digit', action: () => handleDigit('7') },
                { label: '8', type: 'digit', action: () => handleDigit('8') },
                { label: '9', type: 'digit', action: () => handleDigit('9') },
                { label: '×', type: 'op', action: () => handleOp('×') },
                { label: '4', type: 'digit', action: () => handleDigit('4') },
                { label: '5', type: 'digit', action: () => handleDigit('5') },
                { label: '6', type: 'digit', action: () => handleDigit('6') },
                { label: '-', type: 'op', action: () => handleOp('-') },
                { label: '1', type: 'digit', action: () => handleDigit('1') },
                { label: '2', type: 'digit', action: () => handleDigit('2') },
                { label: '3', type: 'digit', action: () => handleDigit('3') },
                { label: '+', type: 'op', action: () => handleOp('+') },
                { label: '±', type: 'digit', action: () => handleDigit('±') },
                { label: '0', type: 'digit', action: () => handleDigit('0') },
                { label: '.', type: 'digit', action: () => handleDigit('.') },
                { label: '=', type: 'equals', action: handleEquals },
              ].map((key, i) => (
                <button
                  key={i}
                  onClick={key.action}
                  className={`h-14 rounded-2xl text-xl font-bold transition-all active:scale-95 ${
                    key.type === 'equals' ? 'bg-blue-600 hover:bg-blue-700 text-white col-span-1' :
                    key.type === 'op' ? 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white' :
                    'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                  }`}
                >
                  {key.label}
                </button>
              ))}
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-slate-500 mb-3">历史记录</h3>
                <div className="space-y-1">
                  {history.slice(-5).reverse().map((h, i) => (
                    <div key={i} className="text-sm text-slate-400 text-right font-mono">{h}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
