'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Activity, Info } from 'lucide-react';

export default function BmiPage() {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);
  const [result, setResult] = useState<{ bmi: number; category: string; color: string } | null>(null);

  const calculate = () => {
    const h = height / 100;
    const bmi = weight / (h * h);
    let category = '', color = '';
    if (bmi < 18.5) { category = '偏瘦'; color = 'text-blue-500'; }
    else if (bmi < 24) { category = '正常'; color = 'text-emerald-500'; }
    else if (bmi < 28) { category = '偏胖'; color = 'text-amber-500'; }
    else { category = '肥胖'; color = 'text-red-500'; }
    setResult({ bmi: parseFloat(bmi.toFixed(1)), category, color });
  };

  const categories = [
    { label: '偏瘦', range: '< 18.5', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
    { label: '正常', range: '18.5 - 24', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
    { label: '偏胖', range: '24 - 28', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
    { label: '肥胖', range: '>= 28', color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-emerald-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Activity className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">体重BMI计算器</h1>
            </div>
            <p className="text-emerald-100 text-lg">身体质量指数计算，评估健康体重</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                  身高（cm）
                </label>
                <div className="flex items-center gap-4">
                  <input type="range" min="100" max="220" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="flex-1 accent-emerald-600" />
                  <span className="w-16 text-center font-bold text-slate-900 dark:text-white text-xl">{height} cm</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                  体重（kg）
                </label>
                <div className="flex items-center gap-4">
                  <input type="range" min="30" max="200" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="flex-1 accent-emerald-600" />
                  <span className="w-16 text-center font-bold text-slate-900 dark:text-white text-xl">{weight} kg</span>
                </div>
              </div>

              <button
                onClick={calculate}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all text-lg"
              >
                计算BMI
              </button>
            </div>

            {result && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl border border-emerald-100 dark:border-emerald-900/20 p-8 text-center mb-6">
                <div className="text-sm text-emerald-500 font-medium mb-2">您的BMI指数</div>
                <div className={`text-7xl font-bold ${result.color} mb-4`}>{result.bmi}</div>
                <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-lg font-medium ${result.color.replace('text-', 'bg-').replace('500', '100 dark:bg-')}`}>
                  {result.category}
                </div>
              </div>
            )}

            {/* Reference */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">BMI参考标准</h3>
              <div className="grid grid-cols-2 gap-3">
                {categories.map(c => (
                  <div key={c.label} className={`p-4 rounded-xl text-center ${c.color}`}>
                    <div className="font-bold text-lg">{c.label}</div>
                    <div className="text-xs opacity-70">{c.range}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  BMI指数仅供参考，不适用于运动员、老年人、孕妇等特殊人群。真正的健康评估需要综合考虑多种因素。
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
