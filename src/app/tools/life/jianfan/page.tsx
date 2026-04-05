'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RefreshCw, Copy, Check } from 'lucide-react';

export default function SimplifiedTraditionalPage() {
  const [input, setInput] = useState('');
  const [toTraditional, setToTraditional] = useState(true);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const map: Record<string, string> = {
    '开': '開', '关': '關', '门': '門', '车': '車', '马': '馬', '书': '書',
    '电': '電', '网': '網', '学': '學', '国': '國', '时': '時', '为': '為',
    '发': '發', '会': '會', '经': '經', '动': '動', '机': '機', '员': '員',
    '无': '無', '见': '見', '长': '長', '点': '點', '里': '裡', '面': '麵',
    '干': '幹', '后': '後', '只': '隻', '台': '臺', '么': '麼',
    '回': '迴', '厂': '廠', '广': '廣', '术': '術', '汇': '匯',
    '板': '闆', '表': '錶', '卜': '蔔', '范': '範', '阜': '輔',
  };

  const reverseMap: Record<string, string> = Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k]));

  const convert = () => {
    if (!input) return;
    if (toTraditional) {
      let out = '';
      for (const char of input) {
        out += map[char] || char;
      }
      setResult(out);
    } else {
      let out = '';
      for (const char of input) {
        out += reverseMap[char] || char;
      }
      setResult(out);
    }
  };

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-pink-600 via-rose-600 to-orange-500 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-pink-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <RefreshCw className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">中文繁简体转换</h1>
            </div>
            <p className="text-pink-100 text-lg">简体与繁体中文一键互转</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mode toggle */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => { setToTraditional(true); setResult(''); }}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-colors ${toTraditional ? 'bg-pink-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
              >
                简体 → 繁体
              </button>
              <button
                onClick={() => { setToTraditional(false); setResult(''); }}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-colors ${!toTraditional ? 'bg-pink-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
              >
                繁体 → 简体
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  {toTraditional ? '输入简体文字' : '输入繁体文字'}
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="请输入文字..."
                  className="w-full h-40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                />
              </div>

              <button
                onClick={convert}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all mb-4"
              >
                转换
              </button>

              {result && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {toTraditional ? '繁体结果' : '简体结果'}
                    </label>
                    <button onClick={handleCopy} className={`flex items-center gap-1 text-xs transition-colors ${copied ? 'text-green-600' : 'text-slate-400 hover:text-slate-600'}`}>
                      {copied ? <><Check className="w-3 h-3" />已复制</> : <><Copy className="w-3 h-3" />复制</>}
                    </button>
                  </div>
                  <div className="text-lg text-slate-900 dark:text-white leading-relaxed">{result}</div>
                </div>
              )}
            </div>

            <div className="bg-pink-50 dark:bg-pink-900/20 rounded-2xl border border-pink-100 dark:border-pink-900/20 p-4 text-sm text-pink-800 dark:text-pink-300">
              本工具支持常用汉字的简繁体转换。部分生僻字或特殊字符可能无法转换，请以实际结果为准。
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
