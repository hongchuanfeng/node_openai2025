'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info } from 'lucide-react';

const UU_CHARS = '`!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_';

export default function UuencodePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const encodeUuencode = (str: string, filename = 'data.txt'): string => {
    const bytes = new TextEncoder().encode(str);
    let result = `begin 644 ${filename}\n`;
    for (let i = 0; i < bytes.length; i += 45) {
      const chunk = bytes.slice(i, i + 45);
      const len = chunk.length;
      let line = UU_CHARS[len];
      for (let j = 0; j < chunk.length; j += 3) {
        const b1 = chunk[j] || 0;
        const b2 = chunk[j + 1] || 0;
        const b3 = chunk[j + 2] || 0;
        line += UU_CHARS[(b1 >> 2) & 0x3F];
        line += UU_CHARS[((b1 << 4) | (b2 >> 4)) & 0x3F];
        line += UU_CHARS[((b2 << 2) | (b3 >> 6)) & 0x3F];
        line += UU_CHARS[b3 & 0x3F];
      }
      result += line + '\n';
    }
    result += UU_CHARS[0] + '\nend\n';
    return result;
  };

  const decodeUuencode = (str: string): string => {
    const lines = str.split('\n');
    const bytes: number[] = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === 'end' || trimmed.startsWith('begin')) continue;
      const len = UU_CHARS.indexOf(trimmed[0]);
      if (len < 0 || len > 45) continue;
      let i = 1;
      let result = '';
      while (i < trimmed.length && result.length < len) {
        const c1 = UU_CHARS.indexOf(trimmed[i++] || '`');
        const c2 = UU_CHARS.indexOf(trimmed[i++] || '`');
        const c3 = UU_CHARS.indexOf(trimmed[i++] || '`');
        const c4 = UU_CHARS.indexOf(trimmed[i++] || '`');
        if (c1 < 0 || c2 < 0) break;
        result += String.fromCharCode((c1 << 2) | (c2 >> 4));
        if (result.length < len && c3 >= 0) {
          result += String.fromCharCode(((c2 << 4) | (c3 >> 2)) & 0xFF);
        }
        if (result.length < len && c4 >= 0) {
          result += String.fromCharCode(((c3 << 6) | c4) & 0xFF);
        }
      }
      bytes.push(...new TextEncoder().encode(result.slice(0, len)));
    }
    return new TextDecoder().decode(new Uint8Array(bytes.slice(0, bytes.length)));
  };

  const handleConvert = () => {
    if (!input.trim()) return;
    try {
      if (mode === 'encode') setOutput(encodeUuencode(input));
      else setOutput(decodeUuencode(input));
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
        <section className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-indigo-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">UUEncode / UUDecode 编码/解码</h1>
            <p className="text-slate-600 dark:text-slate-400">Unix传统的二进制文件编码方式</p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button onClick={() => { setMode('encode'); setOutput(''); setError(''); }} className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'encode' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500'}`}>编码</button>
                <button onClick={() => { setMode('decode'); setOutput(''); setError(''); }} className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'decode' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500'}`}>解码</button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">{mode === 'encode' ? '输入原文' : '输入UUEncode编码'}</label>
                  <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="text-sm text-slate-500 flex items-center gap-1"><RefreshCw className="w-4 h-4" /> 清空</button>
                </div>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encode' ? '输入要编码的文本...' : '输入UUEncode字符串...'} className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 resize-none font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <button onClick={handleConvert} className="mt-4 w-full py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold rounded-xl">{mode === 'encode' ? '编码' : '解码'}</button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">{mode === 'encode' ? 'UUEncode编码结果' : '解码结果'}</label>
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
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Info className="w-5 h-5 text-indigo-500" /> UUEncode 编码说明</h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-slate-600 dark:text-slate-400">
              <ul className="list-disc list-inside space-y-2">
                <li>UUEncode使用可打印ASCII字符编码二进制数据</li>
                <li>Unix系统早期用于邮件传输二进制文件</li>
                <li>编码结果以"begin"开头，"end"结尾</li>
                <li>已被Base64编码广泛取代</li>
                <li>多用于新闻组和电子邮件附件</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
