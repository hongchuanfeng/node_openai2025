'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Hash, Copy, Check } from 'lucide-react';

export default function GuidPage() {
  const [count, setCount] = useState(1);
  const [guids, setGuids] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = () => {
    const arr: string[] = [];
    for (let i = 0; i < count; i++) {
      const hex = '0123456789abcdef';
      let guid = '';
      for (let j = 0; j < 36; j++) {
        if (j === 8 || j === 13 || j === 18 || j === 23) guid += '-';
        else guid += hex[Math.floor(Math.random() * 16)];
      }
      arr.push(guid.toUpperCase());
    }
    setGuids(arr);
  };

  const handleCopy = async (guid: string, idx: number) => {
    await navigator.clipboard.writeText(guid);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(guids.join('\n'));
    setCopied(-1);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-purple-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Hash className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">GUID生成工具</h1>
            </div>
            <p className="text-violet-100 text-lg">生成全球唯一标识符，用于各种应用场景</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                  生成数量：{count} 个
                </label>
                <input type="range" min="1" max="20" value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full accent-violet-600" />
              </div>

              <button
                onClick={generate}
                className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all text-lg flex items-center justify-center gap-2 mb-4"
              >
                <Hash className="w-5 h-5" />
                生成 GUID
              </button>
            </div>

            {guids.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-sm text-slate-500">{guids.length} 个 GUID</span>
                  <button onClick={copyAll} className="flex items-center gap-1 text-sm text-violet-600 hover:text-violet-700">
                    {copied === -1 ? <><Check className="w-4 h-4" />已复制</> : <><Copy className="w-4 h-4" />复制全部</>}
                  </button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {guids.map((guid, i) => (
                    <div key={i} className="p-4 flex items-center justify-between">
                      <code className="font-mono text-sm text-slate-900 dark:text-white flex-1 break-all">{guid}</code>
                      <button onClick={() => handleCopy(guid, i)} className={`ml-4 shrink-0 flex items-center gap-1 text-xs px-3 py-1 rounded-lg transition-colors ${copied === i ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-slate-400 hover:text-slate-600'}`}>
                        {copied === i ? <><Check className="w-3 h-3" />已复制</> : <><Copy className="w-3 h-3" />复制</>}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
