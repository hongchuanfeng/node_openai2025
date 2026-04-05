'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, TrendingUp, TrendingDown, Star, RefreshCw } from 'lucide-react';

const mockStocks = [
  { code: '600519', name: '贵州茅台', price: 1688.00, change: 25.50, changeRate: 1.53, vol: '3.2亿', market: '上证' },
  { code: '000858', name: '五粮液', price: 148.50, change: -2.30, changeRate: -1.52, vol: '1.8亿', market: '深证' },
  { code: '601318', name: '中国平安', price: 45.80, change: 0.65, changeRate: 1.44, vol: '2.5亿', market: '上证' },
  { code: '000001', name: '平安银行', price: 11.25, change: -0.15, changeRate: -1.32, vol: '0.9亿', market: '深证' },
  { code: '600036', name: '招商银行', price: 35.60, change: 0.80, changeRate: 2.30, vol: '2.1亿', market: '上证' },
  { code: '000333', name: '美的集团', price: 62.40, change: 1.20, changeRate: 1.96, vol: '1.4亿', market: '深证' },
];

export default function StockPage() {
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['600519', '601318']);

  const filtered = mockStocks.filter(s =>
    s.name.includes(query) || s.code.includes(query)
  );

  const toggleFav = (code: string) => {
    setFavorites(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-yellow-300 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">股票查询</h1>
            </div>
            <p className="text-orange-100 text-lg">沪深两市实时行情参考</p>
          </div>
        </section>

        {/* Market overview */}
        <section className="py-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: '上证指数', value: '3,268.52', up: true, change: '+12.35 +0.38%' },
                { label: '深证成指', value: '10,456.82', up: false, change: '-28.15 -0.27%' },
                { label: '创业板指', value: '2,088.67', up: true, change: '+8.42 +0.40%' },
                { label: '沪深300', value: '4,012.35', up: true, change: '+15.20 +0.38%' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{item.label}</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">{item.value}</div>
                  <div className={`text-xs font-medium ${item.up ? 'text-emerald-500' : 'text-red-500'}`}>{item.change}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stock list */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索股票代码或名称..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Stock table */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white">股票列表</h3>
                    <button className="text-xs text-slate-500 flex items-center gap-1 hover:text-blue-600">
                      <RefreshCw className="w-3 h-3" /> 刷新
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {filtered.map((stock) => {
                      const isUp = stock.change >= 0;
                      return (
                        <div key={stock.code} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                          <div className="flex items-center gap-3">
                            <button onClick={() => toggleFav(stock.code)} className="text-lg">
                              {favorites.includes(stock.code) ? <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" /> : <Star className="w-5 h-5 text-slate-300" />}
                            </button>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-white">{stock.name}</div>
                              <div className="text-xs text-slate-500">{stock.code} · {stock.market}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-slate-900 dark:text-white">{stock.price.toFixed(2)}</div>
                            <div className={`text-xs font-medium flex items-center justify-end gap-1 ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                              {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {isUp ? '+' : ''}{stock.change.toFixed(2)} ({isUp ? '+' : ''}{stock.changeRate.toFixed(2)}%)
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* My favorites */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4">自选股</h3>
                  <div className="space-y-2">
                    {mockStocks.filter(s => favorites.includes(s.code)).map(s => {
                      const isUp = s.change >= 0;
                      return (
                        <div key={s.code} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white text-sm">{s.name}</div>
                            <div className="text-xs text-slate-500">{s.code}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-slate-900 dark:text-white text-sm">{s.price.toFixed(2)}</div>
                            <div className={`text-xs ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                              {isUp ? '+' : ''}{s.changeRate.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {favorites.length === 0 && (
                      <p className="text-sm text-slate-400 text-center py-4">点击 ☆ 添加自选股</p>
                    )}
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-4">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                      本工具数据仅供参考，非真实行情，不构成投资建议。股市有风险，投资需谨慎。
                    </p>
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
