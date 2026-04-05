'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Text, Copy, Check, ArrowRight } from 'lucide-react';

export default function ASCIIPage() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'toAscii' | 'toChar'>('toAscii');

  const handleConvert = () => {
    if (!input.trim()) return;
    if (mode === 'toAscii') {
      setInput(input.split('').map(c => c.charCodeAt(0)).join(' '));
    } else {
      setInput(String.fromCharCode(...input.trim().split(/\s+/).map(Number)));
    }
  };

  const copyResult = async () => {
    if (input) await navigator.clipboard.writeText(input);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-cyan-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Text className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">字符串/ASCII互换</h1>
            </div>
            <p className="text-teal-100 text-lg">字符与ASCII码之间的相互转换</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="flex gap-2 mb-6">
                <button onClick={() => { setMode('toAscii'); setInput(''); }} className={`flex-1 py-3 px-4 rounded-xl text-center transition-colors ${mode === 'toAscii' ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                  <div className="font-medium text-sm">字符 → ASCII</div>
                  <div className="text-xs opacity-70 mt-0.5">将文字转为ASCII码</div>
                </button>
                <button onClick={() => { setMode('toChar'); setInput(''); }} className={`flex-1 py-3 px-4 rounded-xl text-center transition-colors ${mode === 'toChar' ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                  <div className="font-medium text-sm">ASCII → 字符</div>
                  <div className="text-xs opacity-70 mt-0.5">将ASCII码转回文字</div>
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  {mode === 'toAscii' ? '输入字符' : '输入ASCII码（用空格分隔）'}
                </label>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={mode === 'toAscii' ? '输入要转换的字符，如：Hello' : '输入ASCII码，如：72 101 108 108 111'}
                  className="w-full h-40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none font-mono text-sm"
                />
              </div>

              <div className="flex gap-3 mb-4">
                <button onClick={handleConvert} className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2">
                  <ArrowRight className="w-5 h-5" /> 转换
                </button>
                <button onClick={copyResult} className="py-3 px-6 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2">
                  <Copy className="w-5 h-5" /> 复制
                </button>
              </div>
            </div>

            {/* ASCII Table */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">ASCII码对照表</h3>
              <div className="grid grid-cols-8 gap-1 text-xs">
                {Array.from({ length: 128 }, (_, i) => {
                  const char = i < 32 ? (
                    i === 9 ? 'Tab' : i === 10 ? 'LF' : i === 13 ? 'CR' : `0x${i.toString(16).toUpperCase().padStart(2,'0')}`
                  ) : String.fromCharCode(i);
                  return (
                    <div key={i} className={`p-1.5 rounded text-center ${i % 2 === 0 ? 'bg-slate-50 dark:bg-slate-900' : 'bg-white dark:bg-slate-800'}`}>
                      <div className="font-mono text-slate-400">{i.toString().padStart(3,' ')}</div>
                      <div className="font-mono text-slate-700 dark:text-slate-300 truncate" title={char}>{char || '·'}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-4">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">功能说明</h4>
              <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                <li>• ASCII（American Standard Code for Information Interchange）是字符编码标准</li>
                <li>• 共定义128个字符，包括英文字母、数字、标点符号和控制字符</li>
                <li>• 0-31和127是控制字符（如换行、退格等）</li>
                <li>• 字符→ASCII：显示每个字符对应的十进制码值</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
