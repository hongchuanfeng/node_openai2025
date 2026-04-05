'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info, AlertTriangle, HelpCircle, ArrowLeftRight } from 'lucide-react';

type Mode = 'base64-to-hex' | 'hex-to-base64';

export default function Base64HexPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<Mode>('base64-to-hex');
  const [error, setError] = useState('');

  const handleTransform = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    setError('');
    
    try {
      if (mode === 'base64-to-hex') {
        const binary = atob(input);
        let hex = '';
        for (let i = 0; i < binary.length; i++) {
          hex += binary.charCodeAt(i).toString(16).padStart(2, '0');
        }
        setOutput(hex);
      } else {
        const hex = input.replace(/\s/g, '');
        if (!/^[0-9a-fA-F]*$/.test(hex)) {
          throw new Error('无效的十六进制格式');
        }
        if (hex.length % 2 !== 0) {
          throw new Error('十六进制字符串长度必须为偶数');
        }
        let binary = '';
        for (let i = 0; i < hex.length; i += 2) {
          binary += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        setOutput(btoa(binary));
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
    setMode(mode === 'base64-to-hex' ? 'hex-to-base64' : 'base64-to-hex');
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
              Base64/Hex互转工具
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Base64与十六进制格式之间的相互转换工具
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  onClick={() => setMode('base64-to-hex')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    mode === 'base64-to-hex'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Base64 → Hex
                </button>
                <button
                  onClick={() => setMode('hex-to-base64')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    mode === 'hex-to-base64'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Hex → Base64
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    {mode === 'base64-to-hex' ? '输入Base64字符串' : '输入十六进制字符串'}
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
                  placeholder={mode === 'base64-to-hex' ? '请输入Base64字符串...' : '请输入十六进制字符串（如 48656C6C6F）...'}
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
                    {mode === 'base64-to-hex' ? '十六进制结果' : 'Base64结果'}
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
                { title: '英文字符', base64: 'SGVsbG8=', hex: '48656c6c6f' },
                { title: '中文字符', base64: '5L2g5aW9', hex: 'e4b8ade69687' },
                { title: '数字字符', base64: 'MTIzNA==', hex: '31323334' },
              ].map((example, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{example.title}</h3>
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="text-slate-500">Base64：</span>
                      <code className="text-blue-600 dark:text-blue-400">{example.base64}</code>
                    </div>
                    <div>
                      <span className="text-slate-500">Hex：</span>
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
                Base64和Hex都是可打印字符的编码格式，便于传输和存储
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                Hex编码使用0-9和a-f（或A-F）表示每个字节
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                相同的原始数据，Base64编码后比Hex编码更紧凑
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                输入Hex格式时可以使用或不使用空格分隔
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
                { q: 'Base64和Hex有什么区别？', a: 'Base64使用64个字符（A-Za-z0-9+/）编码，效率更高，3个字节编码为4个字符；Hex使用16个字符（0-9A-F）编码，2个字符表示1个字节。' },
                { q: '为什么需要互转这两种格式？', a: '不同系统或协议可能使用不同的编码格式。例如某些API要求Hex格式，而有些则要求Base64格式。' },
                { q: '转换失败怎么办？', a: '请检查输入格式是否正确。Base64必须是有效的Base64字符串；Hex必须是有效的十六进制字符且长度为偶数。' },
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
