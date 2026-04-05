'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Signal, Copy, Check, RefreshCw } from 'lucide-react';

const morseCode: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', ' ': '/',
};

const reverseMorse: Record<string, string> = Object.fromEntries(
  Object.entries(morseCode).map(([k, v]) => [v, k])
);

export default function MorsePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'text-to-morse' | 'morse-to-text'>('text-to-morse');
  const [copied, setCopied] = useState(false);

  const convert = (text: string, toMorse: boolean): string => {
    if (toMorse) {
      return text.toUpperCase().split('').map(c => morseCode[c] || c).join(' ');
    } else {
      return text.split(' ').map(c => reverseMorse[c] || c).join('').replace(/\/+/g, ' ');
    }
  };

  const handleConvert = () => {
    setOutput(convert(input, mode === 'text-to-morse'));
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-zinc-900 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-slate-400 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <Signal className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">摩斯电码</h1>
            </div>
            <p className="text-slate-300 text-lg">文本与摩斯电码互相转换</p>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mode toggle */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => { setMode('text-to-morse'); setInput(''); setOutput(''); }}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-colors ${mode === 'text-to-morse' ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
              >
                文字 → 摩斯电码
              </button>
              <button
                onClick={() => { setMode('morse-to-text'); setInput(''); setOutput(''); }}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-colors ${mode === 'morse-to-text' ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
              >
                摩斯电码 → 文字
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  {mode === 'text-to-morse' ? '输入文字' : '输入摩斯电码（用空格分隔）'}
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === 'text-to-morse' ? '输入要转换的文字...' : '输入摩斯电码，如：... --- ...'}
                  className="w-full h-40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 font-mono resize-none"
                />
              </div>

              <button
                onClick={handleConvert}
                className="w-full py-3 px-6 bg-gradient-to-r from-slate-600 to-zinc-600 text-white font-semibold rounded-xl hover:from-slate-700 hover:to-zinc-700 transition-all flex items-center justify-center gap-2 mb-4"
              >
                <RefreshCw className="w-5 h-5" />
                转换
              </button>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">结果</label>
                  <button onClick={handleCopy} className={`flex items-center gap-1 text-sm transition-colors ${copied ? 'text-green-600' : 'text-slate-500 hover:text-slate-700'}`}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? '已复制' : '复制'}
                  </button>
                </div>
                <textarea
                  value={output}
                  readOnly
                  placeholder="转换结果..."
                  className="w-full h-40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 font-mono resize-none text-lg"
                />
              </div>
            </div>

            {/* Reference */}
            <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">摩斯电码对照表</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2 text-xs font-mono">
                {Object.entries(morseCode).filter(([k]) => k !== ' ').map(([k, v]) => (
                  <div key={k} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-center">
                    <div className="font-bold text-slate-900 dark:text-white">{k}</div>
                    <div className="text-slate-500 mt-0.5">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
