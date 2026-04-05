'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info } from 'lucide-react';

export default function Base32Page() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

  const encodeBase32 = (str: string): string => {
    const bytes = new TextEncoder().encode(str);
    let bits = '';
    for (const byte of bytes) {
      bits += byte.toString(2).padStart(8, '0');
    }
    while (bits.length % 5 !== 0) bits += '0';
    let result = '';
    for (let i = 0; i < bits.length; i += 5) {
      const idx = parseInt(bits.slice(i, i + 5), 2);
      result += CHARSET[idx];
    }
    while (result.length % 8 !== 0) result += '=';
    return result;
  };

  const decodeBase32 = (str: string): string => {
    const clean = str.toUpperCase().replace(/=+$/, '');
    let bits = '';
    for (const char of clean) {
      const idx = CHARSET.indexOf(char);
      if (idx === -1) throw new Error('Invalid character');
      bits += idx.toString(2).padStart(5, '0');
    }
    while (bits.length % 8 !== 0) bits = bits.slice(0, -1);
    const bytes: number[] = [];
    for (let i = 0; i < bits.length; i += 8) {
      bytes.push(parseInt(bits.slice(i, i + 8), 2));
    }
    return new TextDecoder().decode(new Uint8Array(bytes));
  };

  const handleConvert = () => {
    if (!input.trim()) return;
    try {
      if (mode === 'encode') {
        setOutput(encodeBase32(input));
      } else {
        setOutput(decodeBase32(input));
      }
      setError('');
    } catch (err) {
      setError(mode === 'decode' ? '无效的Base32字符串' : '编码失败');
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
        <section className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-cyan-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Base32 编码/解码</h1>
            <p className="text-slate-600 dark:text-slate-400">Base32是一种使用32个可打印字符表示二进制数据的编码方式</p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  onClick={() => { setMode('encode'); setOutput(''); setError(''); }}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'encode' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  编码
                </button>
                <button
                  onClick={() => { setMode('decode'); setOutput(''); setError(''); }}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'decode' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  解码
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    {mode === 'encode' ? '输入原文' : '输入Base32编码'}
                  </label>
                  <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1">
                    <RefreshCw className="w-4 h-4" /> 清空
                  </button>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === 'encode' ? '输入要编码的文本...' : '输入Base32字符串...'}
                  className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
                />
                <button onClick={handleConvert} className="mt-4 w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all">
                  {mode === 'encode' ? '编码' : '解码'}
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    {mode === 'encode' ? 'Base32编码结果' : '解码结果'}
                  </label>
                  <div className="flex gap-2">
                    <button onClick={handleSwap} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1">
                      <RefreshCw className="w-4 h-4" /> 交换
                    </button>
                    <button onClick={handleCopy} className={`text-sm flex items-center gap-1 transition-colors ${copied ? 'text-green-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                      {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                    </button>
                  </div>
                </div>
                <textarea
                  value={error || output}
                  readOnly
                  placeholder="结果将在此显示..."
                  className={`w-full h-64 p-4 rounded-xl border resize-none font-mono ${error ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-600' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white'}`}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" /> Base32 编码说明
            </h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-slate-600 dark:text-slate-400">
              <ul className="list-disc list-inside space-y-2">
                <li>Base32使用A-Z（26个字母）和2-7（6个数字）共32个字符表示数据</li>
                <li>每个Base32字符表示5个二进制位</li>
                <li>编码后数据量增加约60%，比Base64增加更多</li>
                <li>常用于DNS记录、SPF邮件验证等场景</li>
                <li>与Base64相比，Base32更易人工读写（无大小写混合问题）</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
