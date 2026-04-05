'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info, AlertTriangle, HelpCircle, ArrowLeftRight } from 'lucide-react';

type Mode = 'to-utf8' | 'from-utf8';

export default function Utf8ChinesePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<Mode>('to-utf8');
  const [error, setError] = useState('');

  const handleTransform = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    setError('');
    
    try {
      if (mode === 'to-utf8') {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(input);
        const hexArray = Array.from(bytes).map(b => b.toString(16).padStart(2, '0'));
        setOutput(hexArray.map(h => '\\x' + h).join(''));
      } else {
        const hexMatches = input.match(/\\x([0-9a-fA-F]{2})/g) || [];
        if (hexMatches.length === 0) {
          setOutput(input);
          return;
        }
        const bytes = new Uint8Array(hexMatches.map(m => parseInt(m.replace('\\x', ''), 16)));
        const decoder = new TextDecoder();
        setOutput(decoder.decode(bytes));
      }
    } catch (err) {
      setError('转换错误：无效的UTF-8格式');
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

  const handleSwap = () => {
    setMode(mode === 'to-utf8' ? 'from-utf8' : 'to-utf8');
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
              UTF8与中文互转工具
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              UTF-8编码与中文字符之间的相互转换，用于处理UTF-8字节序列
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  onClick={() => setMode('to-utf8')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    mode === 'to-utf8'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  中文 → UTF-8
                </button>
                <button
                  onClick={() => setMode('from-utf8')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    mode === 'from-utf8'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  UTF-8 → 中文
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    {mode === 'to-utf8' ? '输入中文文本' : '输入UTF-8编码'}
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
                  placeholder={mode === 'to-utf8' ? '请输入需要转换的中文文本...' : '请输入UTF-8编码（如 \\xe4\\xb8\\xad\\xe6\\x96\\x87）...'}
                  className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                />
                <button
                  onClick={handleTransform}
                  className="mt-4 w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  转换
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    {mode === 'to-utf8' ? 'UTF-8编码结果' : '中文文本结果'}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSwap}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
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
                  value={error || output}
                  readOnly
                  placeholder="结果将在此显示..."
                  className={`w-full h-64 p-4 rounded-xl border resize-none font-mono text-sm ${
                    error
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-600'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white'
                  }`}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              示例
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: '单个汉字', chinese: '中', utf8: '\\xe4\\xb8\\xad' },
                { title: '多个汉字', chinese: '中文', utf8: '\\xe4\\xb8\\xad\\xe6\\x96\\x87' },
                { title: '混合内容', chinese: 'A中', utf8: '\\x41\\xe4\\xb8\\xad' },
              ].map((example, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{example.title}</h3>
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="text-slate-500">中文：</span>
                      <code className="text-blue-600 dark:text-blue-400">{example.chinese}</code>
                    </div>
                    <div>
                      <span className="text-slate-500">UTF-8：</span>
                      <code className="text-green-600 dark:text-green-400 break-all">{example.utf8}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              注意事项
            </h2>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                UTF-8是一种变长编码，中文字符通常用3个字节表示
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                UTF-8编码格式为 \xXX，每个XX是两位十六进制数
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                UTF-8是互联网上最常用的字符编码，支持所有Unicode字符
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                这种格式常用于PHP、Python等编程语言中处理字节序列
              </li>
            </ul>
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white mb-6"
            >
              <HelpCircle className="w-5 h-5 text-purple-500" />
              常见问题
              <span className="text-sm font-normal text-slate-500">(展开)</span>
            </button>
            <div className="space-y-4">
              {[
                { q: 'UTF-8和UTF-16有什么区别？', a: 'UTF-8是变长编码（1-4字节），英文字符只需1字节，中文字符需3字节；UTF-16是定长编码（2或4字节），大多数字符用2字节表示。UTF-8更适合网络传输，UTF-16在某些操作系统中使用更方便。' },
                { q: '为什么中文字符在UTF-8中是3字节？', a: 'UTF-8使用1到4字节表示字符。中文等字符在Unicode中的码点范围为U+0800到U+FFFF，需要3字节编码。这使得UTF-8能高效处理ASCII字符同时支持全球文字。' },
                { q: '\\x格式和\\u格式有什么区别？', a: '\\x表示字节级的UTF-8编码，每个字节用2位十六进制表示；\\u表示Unicode码点，是字符的抽象编号。例如"中"的Unicode码点是U+4E2D，UTF-8编码是 E4 B8 AD（三个字节）。' },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Q: {faq.q}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    A: {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
