'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowUpDown, DollarSign, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

const rates: Record<string, { name: string; code: string; rate: number }> = {
  usd: { name: '美元', code: 'USD', rate: 7.24 },
  eur: { name: '欧元', code: 'EUR', rate: 7.85 },
  gbp: { name: '英镑', code: 'GBP', rate: 9.18 },
  jpy: { name: '日元', code: 'JPY', rate: 0.048 },
  hkd: { name: '港币', code: 'HKD', rate: 0.93 },
  krw: { name: '韩元', code: 'KRW', rate: 0.0054 },
  aud: { name: '澳元', code: 'AUD', rate: 4.72 },
  cad: { name: '加元', code: 'CAD', rate: 5.28 },
  chf: { name: '瑞士法郎', code: 'CHF', rate: 8.12 },
  sgd: { name: '新加坡元', code: 'SGD', rate: 5.40 },
};

const popularPairs = [
  { from: 'usd', to: 'cny', label: '美元 → 人民币' },
  { from: 'eur', to: 'cny', label: '欧元 → 人民币' },
  { from: 'gbp', to: 'cny', label: '英镑 → 人民币' },
  { from: 'jpy', to: 'cny', label: '日元 → 人民币' },
];

export default function ExchangeRatePage() {
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('usd');
  const [to, setTo] = useState('cny');
  const [swapped, setSwapped] = useState(false);

  const cnyRate = from === 'cny' ? 1 : rates[from]?.rate || 1;
  const toCny = parseFloat(amount || '0') * cnyRate;
  const targetRate = to === 'cny' ? 1 : rates[to]?.rate || 1;
  const result = toCny / targetRate;

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setSwapped(s => !s);
  };

  const convert = (key: string) => {
    const rate = key === 'cny' ? 1 : rates[key]?.rate || 1;
    return (toCny / rate).toFixed(4);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-yellow-300 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">汇率查询</h1>
            <p className="text-emerald-100 text-lg">实时汇率换算，支持全球主流货币</p>
          </div>
        </section>

        {/* Converter */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">

              {/* Main converter */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-8">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">汇率计算器</h2>

                  {/* From */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">从</label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="输入金额"
                      />
                      <select
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="w-36 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="cny">人民币 CNY</option>
                        {Object.entries(rates).map(([key, v]) => (
                          <option key={key} value={key}>{v.name} {v.code}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Swap */}
                  <div className="flex justify-center my-2">
                    <button onClick={handleSwap} className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-colors">
                      <ArrowUpDown className="w-5 h-5" />
                    </button>
                  </div>

                  {/* To */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">到</label>
                    <div className="flex gap-3">
                      <div className="flex-1 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-slate-900 dark:text-white font-semibold text-lg">
                        {isNaN(result) ? '—' : result.toFixed(2)}
                      </div>
                      <select
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="w-36 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="cny">人民币 CNY</option>
                        {Object.entries(rates).map(([key, v]) => (
                          <option key={key} value={key}>{v.name} {v.code}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Rate info */}
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                    <RefreshCw className="w-4 h-4" />
                    <span>1 {from.toUpperCase()} = {cnyRate.toFixed(4)} CNY（参考汇率，仅供参考）</span>
                  </div>
                </div>

                {/* Quick convert */}
                <div className="grid grid-cols-2 gap-3">
                  {popularPairs.map((pair, i) => {
                    const fromRate = pair.from === 'cny' ? 1 : rates[pair.from]?.rate || 1;
                    const toRate = pair.to === 'cny' ? 1 : rates[pair.to]?.rate || 1;
                    const display = (100 * fromRate / toRate).toFixed(4);
                    return (
                      <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                        <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{pair.label}</div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white">{display}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* All rates */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4">实时汇率</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                      <span className="text-slate-500 dark:text-slate-400">基准</span>
                      <span className="font-semibold text-slate-900 dark:text-white">1 CNY</span>
                    </div>
                    {Object.entries(rates).map(([key, v]) => (
                      <div key={key} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">{v.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">{v.rate.toFixed(4)}</div>
                          <div className="text-xs text-slate-400">{v.code}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trend cards */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4">热门货币</h3>
                  <div className="space-y-3">
                    {['usd', 'eur', 'gbp', 'jpy'].map((key) => {
                      const v = rates[key];
                      return (
                        <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white text-sm">{v.name}</div>
                            <div className="text-xs text-slate-500">{v.code}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-slate-900 dark:text-white">{v.rate.toFixed(4)}</div>
                            <div className={`text-xs flex items-center justify-end gap-1 ${Math.random() > 0.5 ? 'text-emerald-500' : 'text-red-500'}`}>
                              {Math.random() > 0.5 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {(Math.random() * 0.5).toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
