'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, Hash } from 'lucide-react';
import CryptoJS from 'crypto-js';

export default function RIPEMD160Page() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const compute = () => {
    if (!input.trim()) return;
    const hash = CryptoJS.RIPEMD160(input).toString();
    setResult(hash);
    setHistory(prev => [hash, ...prev.filter(h => h !== hash)].slice(0, 9));
  };

  const copyResult = async () => {
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
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-orange-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Hash className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">RIPEMD160加密</h1>
            </div>
            <p className="text-orange-100 text-lg">RIPEMD-160哈希算法，产生160位（40字符）哈希值</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">输入文本</h3>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="输入要加密的文本..."
                className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-mono text-sm"
              />
            </div>

            <div className="flex gap-3 mb-6">
              <button onClick={compute} disabled={!input.trim()} className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50">
                计算哈希
              </button>
              <button onClick={() => { setInput(''); setResult(''); }} className="py-3 px-6 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                清空
              </button>
            </div>

            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">RIPEMD-160 哈希值</h3>
                  <button onClick={copyResult} className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${copied ? 'bg-green-100 text-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                    {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <code className="text-sm font-mono text-slate-800 dark:text-slate-200 break-all">{result}</code>
                </div>
                <div className="mt-2 text-xs text-slate-400">长度：{result.length} 字符（160位）</div>
              </div>
            )}

            {history.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">历史记录</h3>
                  <button onClick={() => setHistory([])} className="text-xs text-slate-400 hover:text-slate-600">清空</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {history.map((h, i) => (
                    <div key={i} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-center">
                      <code className="text-xs font-mono text-orange-500">{h}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-4">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">功能说明</h4>
              <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                <li>• RIPEMD-160 是欧洲 RIPE 项目设计的哈希算法，产生160位哈希值</li>
                <li>• 与 SHA-1 哈希长度相同，但设计原理不同</li>
                <li>• 比特币中使用 RIPEMD-160 作为地址生成的一部分</li>
                <li>• 不可逆加密，无法从密文还原原文</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
