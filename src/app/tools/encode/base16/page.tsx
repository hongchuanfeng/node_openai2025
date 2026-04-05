'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info } from 'lucide-react';

export default function Base16Page() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const encodeBase16 = (str: string): string => {
    const bytes = new TextEncoder().encode(str);
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join('');
  };

  const decodeBase16 = (str: string): string => {
    const clean = str.replace(/\s/g, '');
    if (!/^[0-9A-Fa-f]*$/.test(clean) || clean.length % 2 !== 0) {
      throw new Error('Invalid Hex string');
    }
    const bytes = new Uint8Array(clean.length / 2);
    for (let i = 0; i < clean.length; i += 2) {
      bytes[i / 2] = parseInt(clean.slice(i, i + 2), 16);
    }
    return new TextDecoder().decode(bytes);
  };

  const handleConvert = () => {
    if (!input.trim()) return;
    try {
      if (mode === 'encode') {
        setOutput(encodeBase16(input));
      } else {
        setOutput(decodeBase16(input));
      }
      setError('');
    } catch {
      setError('无效的十六进制字符串');
      setOutput('');
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    setInput(output);
    setOutput('');
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-teal-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Base16 编码/解码</h1>
            <p className="text-slate-600 dark:text-slate-400">Base16（HEX）使用16个十六进制字符表示二进制数据</p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button onClick={() => { setMode('encode'); setOutput(''); setError(''); }} className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'encode' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-500'}`}>
                  编码
                </button>
                <button onClick={() => { setMode('decode'); setOutput(''); setError(''); }} className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'decode' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-500'}`}>
                  解码
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    {mode === 'encode' ? '输入原文' : '输入Hex编码'}
                  </label>
                  <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="text-sm text-slate-500 flex items-center gap-1">
                    <RefreshCw className="w-4 h-4" /> 清空
                  </button>
                </div>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encode' ? '输入要编码的文本...' : '输入十六进制字符串...'} className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 resize-none font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <button onClick={handleConvert} className="mt-4 w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl">
                  {mode === 'encode' ? '编码' : '解码'}
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">{mode === 'encode' ? 'Hex编码结果' : '解码结果'}</label>
                  <div className="flex gap-2">
                    <button onClick={handleSwap} className="text-sm text-slate-500 flex items-center gap-1"><RefreshCw className="w-4 h-4" /> 交换</button>
                    <button onClick={handleCopy} className={`text-sm flex items-center gap-1 ${copied ? 'text-green-600' : 'text-slate-500'}`}>
                      {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                    </button>
                  </div>
                </div>
                <textarea value={error || output} readOnly placeholder="结果将在此显示..." className={`w-full h-64 p-4 rounded-xl border resize-none font-mono ${error ? 'border-red-300 bg-red-50 text-red-600' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'}`} />
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-500" /> Base16 编码说明
            </h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-slate-600 dark:text-slate-400">
              <ul className="list-disc list-inside space-y-2">
                <li>Base16使用0-9和A-F共16个字符表示数据</li>
                <li>每个十六进制字符表示4个二进制位</li>
                <li>编码后数据量是原始数据的2倍</li>
                <li>常用于调试、内存地址显示、颜色值表示</li>
                <li>也被称为HEX编码，是最常见的编码格式之一</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
