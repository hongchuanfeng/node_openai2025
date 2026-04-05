'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Cigarette, Info } from 'lucide-react';

export default function SmokingCostPage() {
  const [price, setPrice] = useState(30);
  const [perDay, setPerDay] = useState(1);
  const [years, setYears] = useState(1);
  const [result, setResult] = useState<{ daily: number; monthly: number; yearly: number; total: number } | null>(null);

  const calculate = () => {
    const daily = price * perDay;
    const monthly = daily * 30;
    const yearly = daily * 365;
    const total = yearly * years;
    setResult({ daily, monthly, yearly, total });
  };

  const formatMoney = (n: number) => `¥${n.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

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
              <Cigarette className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">吸烟成本计算器</h1>
            </div>
            <p className="text-slate-300 text-lg">算算吸烟花了多少钱</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                  每包香烟价格（元）
                </label>
                <div className="flex items-center gap-4">
                  <input type="range" min="5" max="100" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="flex-1 accent-slate-600" />
                  <span className="w-16 text-center font-bold text-slate-900 dark:text-white text-xl">¥{price}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                  每天吸烟量（包）
                </label>
                <div className="flex items-center gap-4">
                  <input type="range" min="0.5" max="5" step="0.5" value={perDay} onChange={(e) => setPerDay(Number(e.target.value))} className="flex-1 accent-slate-600" />
                  <span className="w-16 text-center font-bold text-slate-900 dark:text-white text-xl">{perDay}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                  吸烟年限
                </label>
                <div className="flex items-center gap-4">
                  <input type="range" min="1" max="50" value={years} onChange={(e) => setYears(Number(e.target.value))} className="flex-1 accent-slate-600" />
                  <span className="w-16 text-center font-bold text-slate-900 dark:text-white text-xl">{years}年</span>
                </div>
              </div>

              <button
                onClick={calculate}
                className="w-full py-4 bg-gradient-to-r from-slate-600 to-zinc-600 text-white font-bold rounded-xl hover:from-slate-700 hover:to-zinc-700 transition-all text-lg"
              >
                计算成本
              </button>
            </div>

            {result && (
              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-3xl border border-red-100 dark:border-red-900/20 p-8 mb-6">
                <h3 className="text-sm text-red-500 font-medium mb-6 text-center">吸烟成本统计</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: '每天花费', value: formatMoney(result.daily) },
                    { label: '每月花费', value: formatMoney(result.monthly) },
                    { label: '每年花费', value: formatMoney(result.yearly) },
                    { label: `${years}年总花费`, value: formatMoney(result.total), highlight: true },
                  ].map((item, i) => (
                    <div key={i} className={`p-4 rounded-xl text-center ${item.highlight ? 'bg-red-100 dark:bg-red-900/30 col-span-2' : 'bg-white dark:bg-slate-800'}`}>
                      <div className="text-xs text-slate-500 mb-1">{item.label}</div>
                      <div className={`font-bold text-lg ${item.highlight ? 'text-red-600 dark:text-red-400 text-2xl' : 'text-slate-900 dark:text-white'}`}>{item.value}</div>
                    </div>
                  ))}
                </div>
                {result.yearly > 10000 && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center">
                    <p className="text-sm text-slate-500 mb-2">如果把这笔钱存起来</p>
                    <p className="text-lg font-bold text-emerald-600">
                      10年后您会有 <strong>{formatMoney(result.yearly * 10 * 1.05)}</strong>（按年利率5%计算）
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  🚭 吸烟有害健康。每年的吸烟费用可以用于更好的投资或健康消费。戒烟不仅能省下这笔钱，还能改善健康状况。
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
