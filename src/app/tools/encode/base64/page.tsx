'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw } from 'lucide-react';

export default function Base64Page() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const handleTransform = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setOutput('错误：无效的输入格式');
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
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Base64编码/解码
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Base64是一种基于64个可打印字符来表示二进制数据的编码方式
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  onClick={() => setMode('encode')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    mode === 'encode'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  编码
                </button>
                <button
                  onClick={() => setMode('decode')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    mode === 'decode'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  解码
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    {mode === 'encode' ? '输入文本' : 'Base64字符串'}
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
                  placeholder={mode === 'encode' ? '请输入需要编码的文本...' : '请输入需要解码的Base64字符串...'}
                  className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                />
                <button
                  onClick={handleTransform}
                  className="mt-4 w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  {mode === 'encode' ? '编码' : '解码'}
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    {mode === 'encode' ? 'Base64编码结果' : '解码结果'}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSwap}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      交换
                    </button>
                    <button
                      onClick={handleCopy}
                      className={`text-sm flex items-center gap-1 transition-colors ${
                        copied
                          ? 'text-green-600'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                    </button>
                  </div>
                </div>
                <textarea
                  value={output}
                  readOnly
                  placeholder="结果将在此显示..."
                  className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">示例</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: '英文字符', input: 'Hello', output: 'SGVsbG8=' },
                { title: '中文字符', input: '你好', output: '5L2g5aW9' },
                { title: '混合内容', input: '传道AI 2025', output: '5pmu5pmuQUkgMjAyNQ==' },
              ].map((example, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{example.title}</h3>
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="text-slate-500">输入：</span>
                      <code className="text-blue-600 dark:text-blue-400">{example.input}</code>
                    </div>
                    <div>
                      <span className="text-slate-500">输出：</span>
                      <code className="text-green-600 dark:text-green-400 break-all">{example.output}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">注意事项</h2>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                Base64不是加密算法，只是编码方式，任何人都可以解码
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                常用于在URL、Cookie中传输少量二进制数据
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                编码后数据量会增加约33%
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                不适合用于密码加密，仅用于数据编码传输
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
