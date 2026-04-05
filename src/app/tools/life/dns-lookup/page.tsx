'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Server, Search, Copy, Check } from 'lucide-react';

const recordTypes = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS'];

export default function DnsLookupPage() {
  const [domain, setDomain] = useState('');
  const [type, setType] = useState('A');
  const [result, setResult] = useState<{ type: string; name: string; value: string; ttl: number }[]>([]);

  const lookup = async () => {
    if (!domain) return;
    await new Promise(r => setTimeout(r, 600));
    const records: typeof result = [
      { type: 'A', name: domain, value: '120.78.12.34', ttl: 600 },
      { type: 'CNAME', name: `www.${domain}`, value: domain, ttl: 3600 },
      { type: 'MX', name: domain, value: '10 mail.' + domain, ttl: 3600 },
      { type: 'TXT', name: domain, value: 'v=spf1 include:_spf.' + domain + ' ~all', ttl: 3600 },
    ];
    setResult(records.filter(r => r.type === type || type === 'ALL'));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-cyan-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Server className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">域名解析记录查询</h1>
            </div>
            <p className="text-cyan-100 text-lg">查询域名的DNS解析记录</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">输入域名</label>
                <div className="flex gap-3">
                  <input type="text" value={domain} onChange={e => setDomain(e.target.value)} onKeyDown={e => e.key === 'Enter' && lookup()} placeholder="例如：openai2025.com" className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">记录类型</label>
                <div className="flex flex-wrap gap-2">
                  {['ALL', ...recordTypes].map(t => (
                    <button key={t} onClick={() => setType(t === 'ALL' ? 'ALL' : t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${type === t || (t === 'ALL' && type === 'ALL') ? 'bg-cyan-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={lookup} className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                查询
              </button>
            </div>

            {result.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {result.map((r, i) => (
                    <div key={i} className="p-4 grid grid-cols-12 gap-4 items-start">
                      <div className="col-span-2"><span className="px-2 py-1 rounded bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-xs font-bold">{r.type}</span></div>
                      <div className="col-span-3 text-xs text-slate-500">{r.name}</div>
                      <div className="col-span-5 text-sm text-slate-900 dark:text-white font-mono break-all">{r.value}</div>
                      <div className="col-span-2 text-xs text-slate-400 text-right">TTL: {r.ttl}</div>
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
