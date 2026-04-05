'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info } from 'lucide-react';

const B85_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~';

export default function Base85Page() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const encodeBase85 = (str: string): string => {
    const bytes = new TextEncoder().encode(str);
    let result = '<~';
    for (let i = 0; i < bytes.length; i += 4) {
      let n = 0;
      for (let j = 0; j < 4; j++) {
        n = n * 256 + (bytes[i + j] || 0);
      }
      if (i + 4 > bytes.length) {
        const chunk = bytes.slice(i);
        let temp = 0;
        for (const b of chunk) temp = temp * 256 + b;
        const padding = 4 - chunk.length;
        let div = Math.pow(85, 4 - padding);
        let rem = temp;
        let chars = '';
        for (let j = 0; j < 5 - padding; j++) {
          chars = B85_CHARS[Math.floor(rem / div)] + chars;
          rem = rem % div;
          if (j < 4 - padding) div = div / 85;
        }
        result += chars;
      } else {
        let div = 85 * 85 * 85 * 85;
        let rem = n;
        let chars = '';
        for (let j = 0; j < 5; j++) {
          chars = B85_CHARS[Math.floor(rem / div)] + chars;
          rem = rem % div;
          if (j < 4) div = div / 85;
        }
        result += chars;
      }
    }
    result += '~>';
    return result;
  };

  const decodeBase85 = (str: string): string => {
    const clean = str.replace(/^[<~]+|[>~]+$/g, '');
    const bytes: number[] = [];
    for (let i = 0; i < clean.length; i += 5) {
      const chunk = clean.slice(i, i + 5);
      if (chunk.length < 5) {
        let n = 0;
        let div = Math.pow(85, chunk.length - 1);
        for (const c of chunk) {
          n += B85_CHARS.indexOf(c) * div;
          div = div / 85;
        }
        const fullLen = Math.ceil(chunk.length * Math.log(85) / Math.log(256));
        for (let j = 0; j < fullLen; j++) {
          bytes.unshift(n & 0xff);
          n = n >> 8;
        }
      } else {
        let n = 0;
        let div = 85 * 85 * 85 * 85;
        for (const c of chunk) {
          n += B85_CHARS.indexOf(c) * div;
          div = div / 85;
        }
        for (let j = 0; j < 4; j++) {
          bytes.push(n & 0xff);
          n = n >> 8;
        }
      }
    }
    return new TextDecoder().decode(new Uint8Array(bytes));
  };

  const handleConvert = () => {
    if (!input.trim()) return;
    try {
      if (mode === 'encode') setOutput(encodeBase85(input));
      else setOutput(decodeBase85(input));
      setError('');
    } catch {
      setError('处理失败');
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
        <section className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Base85 / Ascii85 编码/解码</h1>
            <p className="text-slate-600 dark:text-slate-400">Base85是一种高效的编码方式，比Base64压缩率更高</p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button onClick={() => { setMode('encode'); setOutput(''); setError(''); }} className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'encode' ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-sm' : 'text-slate-500'}`}>编码</button>
                <button onClick={() => { setMode('decode'); setOutput(''); setError(''); }} className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'decode' ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-sm' : 'text-slate-500'}`}>解码</button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">{mode === 'encode' ? '输入原文' : '输入Base85编码'}</label>
                  <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="text-sm text-slate-500 flex items-center gap-1"><RefreshCw className="w-4 h-4" /> 清空</button>
                </div>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encode' ? '输入要编码的文本...' : '输入Base85字符串...'} className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 resize-none font-mono focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <button onClick={handleConvert} className="mt-4 w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl">{mode === 'encode' ? '编码' : '解码'}</button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">{mode === 'encode' ? 'Base85编码结果' : '解码结果'}</label>
                  <div className="flex gap-2">
                    <button onClick={handleSwap} className="text-sm text-slate-500 flex items-center gap-1"><RefreshCw className="w-4 h-4" /> 交换</button>
                    <button onClick={handleCopy} className={`text-sm flex items-center gap-1 ${copied ? 'text-green-600' : 'text-slate-500'}`}>{copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}</button>
                  </div>
                </div>
                <textarea value={error || output} readOnly placeholder="结果将在此显示..." className={`w-full h-64 p-4 rounded-xl border resize-none font-mono ${error ? 'border-red-300 bg-red-50 text-red-600' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'}`} />
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Info className="w-5 h-5 text-purple-500" /> Base85 编码说明</h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-slate-600 dark:text-slate-400">
              <ul className="list-disc list-inside space-y-2">
                <li>Base85使用85个可打印ASCII字符表示数据</li>
                <li>每个Base85字符表示约5.8个二进制位</li>
                <li>编码效率比Base64高约25%</li>
                <li>Adobe PostScript和PDF文件使用Ascii85编码</li>
                <li>Git二进制差异也使用Base85编码</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
