'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info } from 'lucide-react';

export default function JsonPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'format' | 'minify' | 'validate'>('format');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [valid, setValid] = useState<boolean | null>(null);

  const handleProcess = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      if (mode === 'format') {
        setOutput(JSON.stringify(parsed, null, 2));
      } else if (mode === 'minify') {
        setOutput(JSON.stringify(parsed));
      } else {
        setOutput('JSON格式有效');
      }
      setError('');
      setValid(true);
    } catch (err) {
      if (mode === 'validate') {
        setOutput('');
        setError((err as Error).message);
      } else {
        setError('无效的JSON格式');
        setOutput('');
      }
      setValid(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setValid(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-green-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">JSON 编码/解码</h1>
            <p className="text-slate-600 dark:text-slate-400">JSON格式化、压缩和验证工具</p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                {(['format', 'minify', 'validate'] as const).map(m => (
                  <button key={m} onClick={() => { setMode(m); setOutput(''); setError(''); }} className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === m ? 'bg-white dark:bg-slate-700 text-green-600 shadow-sm' : 'text-slate-500'}`}>
                    {m === 'format' ? '格式化' : m === 'minify' ? '压缩' : '验证'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">输入JSON</label>
                  <button onClick={handleClear} className="text-sm text-slate-500 flex items-center gap-1"><RefreshCw className="w-4 h-4" /> 清空</button>
                </div>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder='{"key": "value"}' className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 resize-none font-mono focus:outline-none focus:ring-2 focus:ring-green-500" />
                <button onClick={handleProcess} className="mt-4 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl">处理</button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    {mode === 'format' ? '格式化结果' : mode === 'minify' ? '压缩结果' : '验证结果'}
                    {valid === true && <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">有效</span>}
                    {valid === false && <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">无效</span>}
                  </label>
                  {output && <button onClick={handleCopy} className={`text-sm flex items-center gap-1 ${copied ? 'text-green-600' : 'text-slate-500'}`}>{copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}</button>}
                </div>
                <textarea value={error || output} readOnly placeholder="结果将在此显示..." className={`w-full h-64 p-4 rounded-xl border resize-none font-mono ${error ? 'border-red-300 bg-red-50 text-red-600' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'}`} />
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Info className="w-5 h-5 text-green-500" /> JSON 说明</h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-slate-600 dark:text-slate-400">
              <ul className="list-disc list-inside space-y-2">
                <li>JSON（JavaScript Object Notation）是一种轻量级数据交换格式</li>
                <li>完全独立于语言的文本格式，易于阅读和编写</li>
                <li>支持多种数据类型：对象、数组、字符串、数字、布尔值、null</li>
                <li>广泛用于Web API数据传输和配置文件</li>
                <li>是XML的轻量级替代方案</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
