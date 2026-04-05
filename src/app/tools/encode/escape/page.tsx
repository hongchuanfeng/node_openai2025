'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info, AlertTriangle, HelpCircle } from 'lucide-react';

type Mode = 'encode' | 'decode';

export default function EscapePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<Mode>('encode');
  const [error, setError] = useState('');

  const handleTransform = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    setError('');
    
    try {
      if (mode === 'encode') {
        let result = '';
        for (let i = 0; i < input.length; i++) {
          const char = input[i];
          if (char === '\\') {
            result += '\\\\';
          } else if (char === '"') {
            result += '\\"';
          } else if (char === "'") {
            result += "\\'";
          } else if (char === '\n') {
            result += '\\n';
          } else if (char === '\r') {
            result += '\\r';
          } else if (char === '\t') {
            result += '\\t';
          } else if (char === '\b') {
            result += '\\b';
          } else if (char === '\f') {
            result += '\\f';
          } else {
            result += char;
          }
        }
        setOutput(result);
      } else {
        let result = input;
        result = result.replace(/\\n/g, '\n');
        result = result.replace(/\\r/g, '\r');
        result = result.replace(/\\t/g, '\t');
        result = result.replace(/\\b/g, '\b');
        result = result.replace(/\\f/g, '\f');
        result = result.replace(/\\"/g, '"');
        result = result.replace(/\\'/g, "'");
        result = result.replace(/\\\\/g, '\\');
        setOutput(result);
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
    setInput(output);
    setOutput('');
    setError('');
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Escape编码工具
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              JavaScript风格Escape字符串编码解码，用于处理字符串中的特殊字符
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
                    {mode === 'encode' ? '输入原文' : '输入Escape字符串'}
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
                  placeholder={mode === 'encode' ? '请输入需要编码的文本...' : '请输入需要解码的Escape字符串...'}
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
                    {mode === 'encode' ? 'Escape编码结果' : '解码结果'}
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
              支持的转义字符
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { char: '\\n', desc: '换行符' },
                { char: '\\r', desc: '回车符' },
                { char: '\\t', desc: '制表符' },
                { char: '\\\\', desc: '反斜杠' },
                { char: '\\"', desc: '双引号' },
                { char: "\\'", desc: '单引号' },
                { char: '\\b', desc: '退格符' },
                { char: '\\f', desc: '换页符' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-center"
                >
                  <code className="text-blue-600 dark:text-blue-400 font-mono">{item.char}</code>
                  <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
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
                Escape编码主要用于在字符串中表示特殊字符，避免语法错误
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                在JavaScript中，字符串字面量使用单引号或双引号时，其中的特殊字符需要转义
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                本工具使用JavaScript风格的转义规则
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                与JSON转义略有不同，注意区分使用场景
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
                { q: 'Escape编码和encodeURIComponent有什么区别？', a: 'Escape编码是较老的JavaScript全局函数，主要用于字符串转义；encodeURIComponent是现代方法，用于URL参数编码。两者都会编码特殊字符，但编码规则略有不同。建议使用encodeURIComponent处理URL。' },
                { q: '为什么需要转义字符？', a: '因为某些字符在特定上下文中有特殊含义。例如在JavaScript字符串中，直接使用双引号会提前终止字符串。转义让这些字符能作为普通字符使用。' },
                { q: '解码失败怎么办？', a: '请确保输入的转义序列格式正确。常见的错误包括：遗漏反斜杠、使用错误的转义序列等。如果不确定，可以尝试在浏览器控制台测试。' },
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
