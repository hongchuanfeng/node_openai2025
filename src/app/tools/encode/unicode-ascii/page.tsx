'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info, AlertTriangle, HelpCircle, ArrowLeftRight } from 'lucide-react';

type Mode = 'unicode-to-ascii' | 'ascii-to-unicode';

export default function UnicodeAsciiPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<Mode>('unicode-to-ascii');
  const [error, setError] = useState('');

  const handleTransform = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    setError('');
    
    try {
      if (mode === 'unicode-to-ascii') {
        const matches = input.match(/&#(\d+);/g) || [];
        if (matches.length === 0) {
          let result = '';
          for (let i = 0; i < input.length; i++) {
            result += `&#${input.charCodeAt(i)};`;
          }
          setOutput(result);
        } else {
          let result = '';
          const parts = input.split(/&#(\d+);/);
          for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 1) {
              result += String.fromCharCode(parseInt(parts[i], 10));
            } else {
              for (let j = 0; j < parts[i].length; j++) {
                result += `&#${parts[i].charCodeAt(j)};`;
              }
            }
          }
          setOutput(result);
        }
      } else {
        const matches = input.match(/&#(\d+);/g) || [];
        if (matches.length === 0) {
          setOutput(input);
        } else {
          let result = '';
          for (const match of matches) {
            const code = parseInt(match.replace(/&#|;/g, ''), 10);
            result += String.fromCharCode(code);
          }
          setOutput(result);
        }
      }
    } catch (err) {
      setError('转换错误');
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
    setMode(mode === 'unicode-to-ascii' ? 'ascii-to-unicode' : 'unicode-to-ascii');
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
              Unicode/ASCII转换工具
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Unicode与ASCII码之间的相互转换，用于处理HTML实体编码
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  onClick={() => setMode('unicode-to-ascii')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    mode === 'unicode-to-ascii'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Unicode → ASCII
                </button>
                <button
                  onClick={() => setMode('ascii-to-unicode')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    mode === 'ascii-to-unicode'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  ASCII → Unicode
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    {mode === 'unicode-to-ascii' ? '输入字符' : '输入ASCII码'}
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
                  placeholder={mode === 'unicode-to-ascii' ? '请输入需要转换的字符...' : '请输入ASCII码（如 &#65;&#66;&#67;）...'}
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
                    {mode === 'unicode-to-ascii' ? 'ASCII码结果' : '字符结果'}
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
                { title: '英文字母', char: 'ABC', ascii: '&#65;&#66;&#67;' },
                { title: '中文字符', char: '中', ascii: '&#20013;' },
                { title: '混合内容', char: 'A中', ascii: '&#65;&#20013;' },
              ].map((example, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{example.title}</h3>
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="text-slate-500">字符：</span>
                      <code className="text-blue-600 dark:text-blue-400">{example.char}</code>
                    </div>
                    <div>
                      <span className="text-slate-500">ASCII：</span>
                      <code className="text-green-600 dark:text-green-400 break-all">{example.ascii}</code>
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
                ASCII码格式为 &#数字; ，如 &#65; 表示字符 A
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                ASCII码可表示0-127范围内的字符，主要包括英文字母、数字和常用符号
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                此工具常用于处理网页源码中的HTML实体编码
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                支持批量转换，可一次转换多个字符
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
                { q: '什么是ASCII码？', a: 'ASCII（American Standard Code for Information Interchange）是一种字符编码标准，使用7位二进制数表示128个字符，包括英文字母、数字、标点符号和控制字符。' },
                { q: 'Unicode和ASCII有什么区别？', a: 'ASCII只支持128个字符（主要是英文字母），而Unicode支持超过14万个字符，包括世界各国文字、表情符号等。Unicode是ASCII的超级集合。' },
                { q: '为什么网页中要使用ASCII码？', a: '在HTML中，某些特殊字符（如 <、>、&）有特殊含义，直接使用会造成解析错误。使用ASCII码（如 &lt; 表示 <）可以安全地在网页中显示这些字符。' },
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
