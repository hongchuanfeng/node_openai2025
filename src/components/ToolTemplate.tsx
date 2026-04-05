'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info, HelpCircle, AlertTriangle } from 'lucide-react';

interface ToolTemplateProps {
  name: string;
  description: string;
  inputLabel: string;
  inputPlaceholder: string;
  outputLabel: string;
  examples?: { title: string; input: string; output: string }[];
  notes?: string[];
  faqs?: { q: string; a: string }[];
  transform?: (input: string, ...args: unknown[]) => string;
}

export default function ToolTemplate({
  name,
  description,
  inputLabel,
  inputPlaceholder,
  outputLabel,
  examples = [],
  notes = [],
  faqs = [],
  transform = (input) => input,
}: ToolTemplateProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  const handleTransform = () => {
    try {
      const result = transform(input);
      setOutput(result);
    } catch (error) {
      setOutput(`错误: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {name}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {description}
            </p>
          </div>
        </section>

        {/* Tool Section */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    {inputLabel}
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
                  placeholder={inputPlaceholder}
                  className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                />
                <button
                  onClick={handleTransform}
                  className="mt-4 w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  转换
                </button>
              </div>

              {/* Output */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    {outputLabel}
                  </label>
                  <button
                    onClick={handleCopy}
                    className={`text-sm flex items-center gap-1 transition-colors ${
                      copied
                        ? 'text-green-600'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        复制
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  value={output}
                  readOnly
                  placeholder="转换结果将在此显示..."
                  className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Examples */}
        {examples.length > 0 && (
          <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                示例
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {examples.map((example, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
                  >
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      {example.title}
                    </h3>
                    <div className="text-sm space-y-2">
                      <div>
                        <span className="text-slate-500">输入：</span>
                        <code className="text-blue-600 dark:text-blue-400 break-all">
                          {example.input}
                        </code>
                      </div>
                      <div>
                        <span className="text-slate-500">输出：</span>
                        <code className="text-green-600 dark:text-green-400 break-all">
                          {example.output}
                        </code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Notes */}
        {notes.length > 0 && (
          <section className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                注意事项
              </h2>
              <ul className="space-y-3">
                {notes.map((note, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-slate-600 dark:text-slate-400"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <button
                onClick={() => setShowFaq(!showFaq)}
                className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white mb-6"
              >
                <HelpCircle className="w-5 h-5 text-purple-500" />
                常见问题
                <span className="text-sm font-normal text-slate-500">
                  ({showFaq ? '收起' : '展开'})
                </span>
              </button>
              {showFaq && (
                <div className="space-y-4">
                  {faqs.map((faq, i) => (
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
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
