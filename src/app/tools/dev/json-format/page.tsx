'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw } from 'lucide-react';

export default function JSONFormatPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'format' | 'compress'>('format');
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState('');

  const handleTransform = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      if (mode === 'format') {
        setOutput(JSON.stringify(parsed, null, indent));
      } else {
        setOutput(JSON.stringify(parsed));
      }
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'JSON格式错误');
      setOutput('');
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
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              JSON格式化/压缩
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              将JSON数据格式化（美化）或压缩（最小化）
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  onClick={() => setMode('format')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    mode === 'format'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  格式化
                </button>
                <button
                  onClick={() => setMode('compress')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    mode === 'compress'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  压缩
                </button>
              </div>

              {mode === 'format' && (
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-600 dark:text-slate-400">缩进：</label>
                  <select
                    value={indent}
                    onChange={(e) => setIndent(Number(e.target.value))}
                    className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  >
                    <option value={2}>2空格</option>
                    <option value={4}>4空格</option>
                    <option value={0}>无缩进</option>
                  </select>
                </div>
              )}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    输入JSON
                  </label>
                  <button
                    onClick={handleClear}
                    className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    清空
                  </button>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='{"name": "传道AI", "tools": 112}'
                  className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                />
                <button
                  onClick={handleTransform}
                  className="mt-4 w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  {mode === 'format' ? '格式化' : '压缩'}
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    {mode === 'format' ? '格式化结果' : '压缩结果'}
                  </label>
                  <button
                    onClick={handleCopy}
                    className={`text-sm flex items-center gap-1 transition-colors ${
                      copied ? 'text-green-600' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                  </button>
                </div>
                <textarea
                  value={error || output}
                  readOnly
                  placeholder="结果将在此显示..."
                  className={`w-full h-64 p-4 rounded-xl border ${
                    error ? 'border-red-300 dark:border-red-700' : 'border-slate-200 dark:border-slate-700'
                  } bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none font-mono text-sm ${
                    error ? 'text-red-600 dark:text-red-400' : ''
                  }`}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">示例</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">格式化前</h3>
                <pre className="text-sm text-slate-600 dark:text-slate-400 font-mono overflow-x-auto">
                  {`{"name":"传道AI","tools":112}`}
                </pre>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">格式化后</h3>
                <pre className="text-sm text-green-600 dark:text-green-400 font-mono overflow-x-auto">
{`{
  "name": "传道AI",
  "tools": 112
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">使用场景</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">格式化</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>阅读和调试JSON数据</li>
                  <li>格式化API返回的数据</li>
                  <li>整理配置文件</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">压缩</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>减少数据传输体积</li>
                  <li>优化存储空间</li>
                  <li>代码混淆</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
