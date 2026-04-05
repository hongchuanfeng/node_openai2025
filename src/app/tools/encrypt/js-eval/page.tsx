'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Code, Copy, Check, AlertTriangle } from 'lucide-react';

export default function JsEvalPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'eval' | 'obfuscate'>('eval');

  const handleEval = () => {
    if (!input.trim()) { setResult(''); setError(''); return; }
    try {
      // eslint-disable-next-line no-eval
      const out = eval(input);
      setResult(typeof out === 'object' ? JSON.stringify(out, null, 2) : String(out));
      setError('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '执行出错');
      setResult('');
    }
  };

  const handleObfuscate = () => {
    if (!input.trim()) return;
    // Simple character code obfuscation
    const chars = input.split('').map(c => {
      const code = c.charCodeAt(0);
      return code < 128 ? c : `\\u${code.toString(16).padStart(4, '0')}`;
    }).join('');
    setResult(`eval(\`${chars}\`)`);
    setError('');
  };

  const copyResult = async () => {
    if (result) { await navigator.clipboard.writeText(result); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-red-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Code className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">JS(eval)加密</h1>
            </div>
            <p className="text-red-100 text-lg">JavaScript代码执行与简易混淆工具</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="flex gap-2 mb-6">
                {([
                  { id: 'eval' as const, label: '🔧 JS执行', desc: '在浏览器中执行JS代码' },
                  { id: 'obfuscate' as const, label: '🔒 代码混淆', desc: '简易字符混淆' },
                ] as const).map(m => (
                  <button key={m.id} onClick={() => { setMode(m.id); setResult(''); setError(''); }} className={`flex-1 py-3 px-4 rounded-xl text-left transition-colors ${mode === m.id ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    <div className="font-medium text-sm">{m.label}</div>
                    <div className="text-xs opacity-70 mt-0.5">{m.desc}</div>
                  </button>
                ))}
              </div>

              {mode === 'eval' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">输入JavaScript代码</label>
                    <textarea
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      placeholder="输入JavaScript代码，如：2 + 2"
                      className="w-full h-40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none font-mono text-sm"
                    />
                  </div>
                  <button onClick={handleEval} className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all">
                    执行代码
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">输入要混淆的JavaScript代码</label>
                    <textarea
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      placeholder="输入JavaScript代码..."
                      className="w-full h-40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none font-mono text-sm"
                    />
                  </div>
                  <button onClick={handleObfuscate} className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all">
                    混淆代码
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400 font-mono">{error}</p>
              </div>
            )}

            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">结果</h3>
                  <button onClick={copyResult} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                    <Copy className="w-4 h-4" /> 复制
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre-wrap break-all">
                  {result}
                </pre>
              </div>
            )}

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-4">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">功能说明</h4>
              <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                <li>• JS执行：在浏览器沙箱中执行JavaScript代码片段</li>
                <li>• 代码混淆：将字符串转为Unicode转义形式，增加阅读难度</li>
                <li>• 注意：执行来源不明的代码可能存在安全风险</li>
                <li>• 此工具仅供学习和开发调试使用</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
