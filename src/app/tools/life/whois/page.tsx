'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Globe, Server } from 'lucide-react';

export default function WhoIsPage() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);

  const lookup = async () => {
    if (!domain) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const d = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
    setResult({
      '域名': d,
      '注册状态': '已注册 (active)',
      '注册商': 'Alibaba Cloud Computing (Beijing) Co., Ltd.',
      '注册日期': '2023-01-15',
      '过期日期': '2028-01-15',
      'DNS服务器': 'vip1.alidns.com\nvip2.alidns.com',
      ' registrant Name': '隐私保护',
      ' registrant Organization': '隐私保护',
      ' registrant Country': 'CN',
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-violet-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Globe className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">域名WHOIS查询</h1>
            </div>
            <p className="text-blue-100 text-lg">查询域名注册信息和DNS记录</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">输入域名</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && lookup()}
                      placeholder="例如：openai2025.com"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={lookup}
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <Search className="w-5 h-5" />
                    查询
                  </button>
                </div>
              </div>
            </div>

            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">WHOIS 查询结果</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {Object.entries(result).map(([key, val]) => (
                    <div key={key} className="p-4 grid grid-cols-3 gap-4">
                      <div className="text-sm text-slate-500">{key}</div>
                      <div className="col-span-2 text-sm text-slate-900 dark:text-white whitespace-pre-wrap">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-4 text-sm text-amber-800 dark:text-amber-300">
              本工具提供模拟WHOIS查询结果。实际域名信息受注册商隐私保护政策影响，部分信息可能已隐藏。
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
