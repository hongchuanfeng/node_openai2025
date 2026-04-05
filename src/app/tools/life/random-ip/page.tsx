'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shuffle, Copy, Check } from 'lucide-react';

export default function RandomIpPage() {
  const [count, setCount] = useState(5);
  const [ips, setIps] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [type, setType] = useState<'ipv4' | 'ipv6'>('ipv4');

  const generate = () => {
    const arr: string[] = [];
    for (let i = 0; i < count; i++) {
      if (type === 'ipv4') {
        arr.push(`${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`);
      } else {
        const hex = () => Math.floor(Math.random()*65535).toString(16).padStart(4,'0');
        arr.push(`${hex()}:${hex()}:${hex()}:${hex()}:${hex()}:${hex()}:${hex()}:${hex()}`);
      }
    }
    setIps(arr);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(ips.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-500 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-yellow-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Shuffle className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">随机IP地址生成器</h1>
            </div>
            <p className="text-orange-100 text-lg">批量生成随机IP地址，用于测试和开发</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">IP地址类型</label>
                <div className="flex gap-3 mb-4">
                  {[{ id: 'ipv4' as const, label: 'IPv4' }, { id: 'ipv6' as const, label: 'IPv6' }].map(t => (
                    <button key={t.id} onClick={() => setType(t.id)} className={`flex-1 py-3 rounded-xl font-medium transition-colors ${type === t.id ? 'bg-orange-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">生成数量：{count} 个</label>
                <input type="range" min="1" max="50" value={count} onChange={e => setCount(Number(e.target.value))} className="w-full accent-orange-600" />
              </div>
              <button onClick={generate} className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all flex items-center justify-center gap-2">
                <Shuffle className="w-5 h-5" />
                生成
              </button>
            </div>

            {ips.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-sm text-slate-500">{ips.length} 个IP地址</span>
                  <button onClick={handleCopy} className={`flex items-center gap-1 text-sm transition-colors ${copied ? 'text-green-600' : 'text-slate-500 hover:text-slate-700'}`}>
                    {copied ? <><Check className="w-4 h-4" />已复制</> : <><Copy className="w-4 h-4" />复制全部</>}
                  </button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {ips.map((ip, i) => (
                    <div key={i} className="p-4 flex items-center justify-between">
                      <code className="font-mono text-sm text-slate-900 dark:text-white">{ip}</code>
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
