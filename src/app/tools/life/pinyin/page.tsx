'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Type, Copy, Check } from 'lucide-react';

export default function PinyinPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'tone' | 'notone'>('tone');

  const pinyinMap: Record<string, string[]> = {
    '中': ['zhōng', 'zhóng'], '国': ['guó', 'guo'], '人': ['rén', 'rèn'], '我': ['wǒ'],
    '爱': ['ài'], '你': ['nǐ', 'nì'], '好': ['hǎo', 'hào'], '是': ['shì'],
    '文': ['wén'], '汉': ['hàn'], '字': ['zì'],
    '传': ['chuán', 'zhuàn'], '道': ['dào'], '智': ['zhì'], '能': ['néng', 'nài'],
  };

  const toPinyin = (text: string): string => {
    let out = '';
    for (const char of text) {
      const p = pinyinMap[char];
      if (p) {
        out += mode === 'tone' ? p[0] : p[0].replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, m => m[0]) + ' ';
      } else {
        out += char + ' ';
      }
    }
    return out.trim();
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
        <section className="relative overflow-hidden bg-gradient-to-br from-pink-600 via-rose-600 to-red-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-pink-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Type className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">汉字拼音在线转换</h1>
            </div>
            <p className="text-pink-100 text-lg">中文文字转拼音拼音</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mode */}
            <div className="flex gap-2 mb-6">
              {[
                { id: 'tone', label: '带声调' },
                { id: 'notone', label: '不带声调' },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as 'tone' | 'notone')}
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${mode === m.id ? 'bg-pink-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">输入汉字</label>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="请输入要转换的汉字..."
                  className="w-full h-40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                />
              </div>

              <button
                onClick={() => setResult(toPinyin(input))}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all mb-4"
              >
                转换为拼音
              </button>

              {result && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">拼音结果</label>
                    <button onClick={handleCopy} className={`flex items-center gap-1 text-xs transition-colors ${copied ? 'text-green-600' : 'text-slate-400 hover:text-slate-600'}`}>
                      {copied ? <><Check className="w-3 h-3" />已复制</> : <><Copy className="w-3 h-3" />复制</>}
                    </button>
                  </div>
                  <div className="text-xl font-medium text-pink-600 dark:text-pink-400 leading-loose">{result}</div>
                </div>
              )}
            </div>

            {/* Examples */}
            <div className="grid grid-cols-2 gap-3">
              {['传道AI智能工具', '中国汉字拼音转换', '多音字测试', '常用汉字'].map((text, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(text); setResult(toPinyin(text)); }}
                  className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow text-left"
                >
                  <div className="font-medium text-slate-900 dark:text-white mb-1">{text}</div>
                  <div className="text-xs text-pink-500">{toPinyin(text)}</div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
