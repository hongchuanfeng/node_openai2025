'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Car } from 'lucide-react';

export default function CarLoanPage() {
  const [price, setPrice] = useState(200000);
  const [downRate, setDownRate] = useState(30);
  const [years, setYears] = useState(3);
  const [rate, setRate] = useState(4.5);
  const [result, setResult] = useState<{ down: number; loan: number; monthly: number; total: number; interest: number } | null>(null);

  const calculate = () => {
    const down = price * downRate / 100;
    const loan = price - down;
    const monthlyRate = rate / 100 / 12;
    const n = years * 12;
    const monthly = loan * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1);
    const total = monthly * n;
    setResult({ down, loan, monthly, total, interest: total - loan });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-purple-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Car className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">车贷计算器</h1>
            </div>
            <p className="text-blue-100 text-lg">计算购车贷款月供和总利息</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              {[
                { label: '车辆价格', value: price, min: 50000, max: 2000000, suffix: '元' },
                { label: '首付比例', value: downRate, min: 0, max: 80, suffix: '%' },
                { label: '贷款年限', value: years, min: 1, max: 10, suffix: '年' },
                { label: '年利率', value: rate, min: 1, max: 15, suffix: '%', step: 0.1 },
              ].map((item, i) => (
                <div key={i} className="mb-6">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                    {item.label}：{item.value}{item.suffix}
                  </label>
                  <input
                    type="range"
                    min={item.min}
                    max={item.max}
                    step={item.step || 1}
                    value={item.value}
                    onChange={e => {
                      if (item.label === '车辆价格') setPrice(Number(e.target.value));
                      else if (item.label === '首付比例') setDownRate(Number(e.target.value));
                      else if (item.label === '贷款年限') setYears(Number(e.target.value));
                      else setRate(Number(e.target.value));
                    }}
                    className="w-full accent-blue-600"
                  />
                </div>
              ))}

              <button
                onClick={calculate}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all text-lg"
              >
                计算月供
              </button>
            </div>

            {result && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl border border-blue-100 dark:border-blue-900/20 p-8 mb-6">
                <div className="text-center mb-6">
                  <div className="text-sm text-blue-500 font-medium mb-2">每月月供</div>
                  <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">¥{Math.round(result.monthly).toLocaleString()}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: '首付金额', value: `¥${Math.round(result.down).toLocaleString()}` },
                    { label: '贷款总额', value: `¥${Math.round(result.loan).toLocaleString()}` },
                    { label: '总利息', value: `¥${Math.round(result.interest).toLocaleString()}` },
                    { label: '还款总额', value: `¥${Math.round(result.total).toLocaleString()}` },
                  ].map((item, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white dark:bg-slate-800 text-center">
                      <div className="text-xs text-slate-500 mb-1">{item.label}</div>
                      <div className="font-bold text-slate-900 dark:text-white">{item.value}</div>
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
