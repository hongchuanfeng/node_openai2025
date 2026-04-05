'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Languages, ArrowRight, Copy, Check, RefreshCw } from 'lucide-react';

const languages = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: '英语', flag: '🇬🇧' },
  { code: 'ja', name: '日语', flag: '🇯🇵' },
  { code: 'ko', name: '韩语', flag: '🇰🇷' },
  { code: 'fr', name: '法语', flag: '🇫🇷' },
  { code: 'de', name: '德语', flag: '🇩🇪' },
  { code: 'es', name: '西班牙语', flag: '🇪🇸' },
  { code: 'ru', name: '俄语', flag: '🇷🇺' },
  { code: 'ar', name: '阿拉伯语', flag: '🇸🇦' },
  { code: 'pt', name: '葡萄牙语', flag: '🇵🇹' },
];

const mockTranslations: Record<string, Record<string, string>> = {
  'zh-en': { input: '你好世界', output: 'Hello World' },
  'en-zh': { input: 'Good morning', output: '早上好' },
  'zh-ja': { input: '人工智能', output: '人工知能' },
  'ja-zh': { input: '東京', output: '东京' },
  'zh-ko': { input: '科技创新', output: '과학기술혁신' },
  'ko-zh': { input: '반갑습니다', output: '很高兴见到你' },
};

export default function TranslatePage() {
  const [input, setInput] = useState('');
  const [fromLang, setFromLang] = useState('zh');
  const [toLang, setToLang] = useState('en');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleTranslate = () => {
    const key = `${fromLang}-${toLang}`;
    if (mockTranslations[key]) {
      setOutput(mockTranslations[key].output);
    } else {
      setOutput(`[${languages.find(l => l.code === toLang)?.name}] 翻译结果将在此显示...`);
    }
  };

  const handleSwap = () => {
    const temp = fromLang;
    setFromLang(toLang);
    setToLang(temp);
    setInput(output);
    setOutput(input);
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-pink-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <Languages className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">翻译查询</h1>
            </div>
            <p className="text-violet-100 text-lg">多语言即时翻译，支持全球主流语言</p>
          </div>
        </section>

        {/* Translator */}
        <section className="py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Language selector */}
              <div className="flex items-center justify-center gap-4 p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <select
                  value={fromLang}
                  onChange={(e) => setFromLang(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map(l => (
                    <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
                  ))}
                </select>

                <button onClick={handleSwap} className="p-2 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>

                <select
                  value={toLang}
                  onChange={(e) => setToLang(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map(l => (
                    <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
                  ))}
                </select>
              </div>

              {/* Input/Output */}
              <div className="grid md:grid-cols-2">
                <div className="p-6 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {languages.find(l => l.code === fromLang)?.name}
                    </span>
                    <button onClick={() => { setInput(''); setOutput(''); }} className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> 清空
                    </button>
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="输入要翻译的文字..."
                    className="w-full h-48 resize-none p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="p-6 relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {languages.find(l => l.code === toLang)?.name}
                    </span>
                    <button onClick={handleCopy} className={`text-xs flex items-center gap-1 transition-colors ${copied ? 'text-green-600' : 'text-slate-400 hover:text-slate-600'}`}>
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? '已复制' : '复制'}
                    </button>
                  </div>
                  <textarea
                    value={output}
                    readOnly
                    placeholder="翻译结果..."
                    className="w-full h-48 resize-none p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Action */}
              <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700">
                <button
                  onClick={handleTranslate}
                  className="w-full py-3 px-6 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
                >
                  <Languages className="w-5 h-5" />
                  翻译
                </button>
              </div>
            </div>

            {/* Quick examples */}
            <div className="mt-8">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">常用翻译示例</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { from: 'zh-en', text: '你好', result: 'Hello' },
                  { from: 'zh-ja', text: '谢谢', result: 'ありがとう' },
                  { from: 'zh-ko', text: '再见', result: '안녕히 가세요' },
                  { from: 'en-zh', text: 'Thank you', result: '谢谢你' },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(item.text);
                      handleTranslate();
                    }}
                    className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow text-left"
                  >
                    <div className="text-sm text-slate-500 mb-1">原文</div>
                    <div className="font-medium text-slate-900 dark:text-white mb-2">{item.text}</div>
                    <div className="text-xs text-slate-400">结果：{item.result}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
