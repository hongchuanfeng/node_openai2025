'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info, AlertTriangle, HelpCircle, ArrowLeftRight } from 'lucide-react';

type Mode = 'text-to-hex' | 'hex-to-text';

export default function HexPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<Mode>('text-to-hex');
  const [error, setError] = useState('');
  const [separator, setSeparator] = useState<'none' | 'space' | 'comma'>('space');

  const handleTransform = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    setError('');
    
    try {
      if (mode === 'text-to-hex') {
        const separatorChar = separator === 'none' ? '' : separator === 'space' ? ' ' : ', ';
        let hex = '';
        const encoder = new TextEncoder();
        const bytes = encoder.encode(input);
        hex = Array.from(bytes)
          .map(b => b.toString(16).padStart(2, '0'))
          .join(separatorChar);
        setOutput(hex);
      } else {
        const hex = input.replace(/\s/g, '').replace(/,/g, '');
        if (!/^[0-9a-fA-F]*$/.test(hex)) {
          throw new Error('无效的十六进制格式');
        }
        if (hex.length % 2 !== 0) {
          throw new Error('十六进制字符串长度必须为偶数');
        }
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
          bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        const decoder = new TextDecoder();
        setOutput(decoder.decode(bytes));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '转换错误');
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
    setMode(mode === 'text-to-hex' ? 'hex-to-text' : 'text-to-hex');
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
              HEX与字符转换工具
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              十六进制（Hex）与字符之间的相互转换，支持多种分隔符格式
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  onClick={() => setMode('text-to-hex')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    mode === 'text-to-hex'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  字符 → HEX
                </button>
                <button
                  onClick={() => setMode('hex-to-text')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    mode === 'hex-to-text'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  HEX → 字符
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    {mode === 'text-to-hex' ? '输入文本' : '输入HEX字符串'}
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
                  placeholder={mode === 'text-to-hex' ? '请输入需要转换的文本...' : '请输入十六进制字符串（如 48656C6C6F）...'}
                  className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                />
                {mode === 'text-to-hex' && (
                  <div className="mt-4">
                    <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">分隔符</label>
                    <div className="flex gap-4">
                      {[
                        { value: 'none', label: '无' },
                        { value: 'space', label: '空格' },
                        { value: 'comma', label: '逗号' },
                      ].map((opt) => (
                        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="separator"
                            value={opt.value}
                            checked={separator === opt.value}
                            onChange={() => setSeparator(opt.value as typeof separator)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
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
                    {mode === 'text-to-hex' ? 'HEX结果' : '字符结果'}
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
                { title: '英文字符', text: 'Hello', hex: '48 65 6c 6c 6f' },
                { title: '中文字符', text: '你好', hex: 'e4 b8 ad e5 a5 bd' },
                { title: '数字字符', text: '123', hex: '31 32 33' },
              ].map((example, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{example.title}</h3>
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="text-slate-500">文本：</span>
                      <code className="text-blue-600 dark:text-blue-400">{example.text}</code>
                    </div>
                    <div>
                      <span className="text-slate-500">HEX：</span>
                      <code className="text-green-600 dark:text-green-400">{example.hex}</code>
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
                HEX（十六进制）使用0-9和A-F来表示数值，是计算机中常用的表示方式
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                每个字节用两个十六进制字符表示，范围从00到FF
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                支持带分隔符（空格、逗号）或不带分隔符的HEX格式
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                中文等UTF-8编码字符会转换为多个字节的HEX值
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
                { q: 'HEX和字符之间如何转换？', a: '将每个字符转换为其对应的ASCII码（或UTF-8编码值），再将数值转换为十六进制格式。例如"A"的ASCII码是65，十进制转十六进制为41。' },
                { q: '为什么中文转换后有多个HEX值？', a: '因为中文字符在UTF-8编码中占用多个字节。例如"中"字是3字节UTF-8编码，转换后会显示为"E4 B8 AD"三个HEX值。' },
                { q: '分隔符有什么作用？', a: '分隔符用于美化输出格式，便于阅读。常用分隔符包括空格（如"48 65"）和逗号（如"48,65"）。解析时会自动忽略这些分隔符。' },
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
