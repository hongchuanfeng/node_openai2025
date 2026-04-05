'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Barcode, Copy, Check } from 'lucide-react';

const types = ['CODE128', 'EAN13', 'EAN8', 'UPC', 'CODE39'];

export default function BarcodePage() {
  const [input, setInput] = useState('');
  const [type, setType] = useState('CODE128');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!input) return;
    setResult(`[条形码模拟] ${type} - ${input}`);
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
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-700 via-zinc-700 to-gray-800 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-gray-400 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Barcode className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">条形码生成器</h1>
            </div>
            <p className="text-slate-300 text-lg">生成各种类型的条形码图片</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">条形码内容</label>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="输入条形码内容（如商品编号）"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 font-mono"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">条形码类型</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
                  {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <button onClick={generate} className="w-full py-3 bg-gradient-to-r from-slate-600 to-zinc-600 text-white font-semibold rounded-xl hover:from-slate-700 hover:to-zinc-700 transition-all">
                生成条形码
              </button>
            </div>

            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <Barcode className="w-64 h-32 text-slate-900" />
                  </div>
                </div>
                <button onClick={handleCopy} className={`flex items-center gap-1 text-sm mx-auto transition-colors ${copied ? 'text-green-600' : 'text-slate-500 hover:text-slate-700'}`}>
                  {copied ? <><Check className="w-4 h-4" />已复制</> : <><Copy className="w-4 h-4" />复制内容</>}
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
