'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Baby, Ruler, Info } from 'lucide-react';

export default function HeightPredictPage() {
  const [fatherHeight, setFatherHeight] = useState(170);
  const [motherHeight, setMotherHeight] = useState(160);
  const [gender, setGender] = useState<'boy' | 'girl'>('boy');
  const [result, setResult] = useState<{ min: number; max: number; avg: number } | null>(null);

  const calculate = () => {
    const avgParent = (fatherHeight + motherHeight) / 2;
    let min: number, max: number, avg: number;
    if (gender === 'boy') {
      avg = avgParent * 1.08;
      min = avg - 5;
      max = avg + 5;
    } else {
      avg = avgParent * 1.02;
      min = avg - 5;
      max = avg + 5;
    }
    setResult({ min: Math.round(min), max: Math.round(max), avg: Math.round(avg) });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-cyan-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Baby className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">孩子身高预测</h1>
            </div>
            <p className="text-blue-100 text-lg">根据父母身高预测孩子未来身高</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
            {/* Gender */}
            <div className="flex gap-3 mb-8">
              {[
                { id: 'boy' as const, label: '男孩', icon: '👦' },
                { id: 'girl' as const, label: '女孩', icon: '👧' },
              ].map(g => (
                <button
                  key={g.id}
                  onClick={() => setGender(g.id)}
                  className={`flex-1 py-4 px-6 rounded-2xl font-medium text-lg transition-all ${gender === g.id ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                >
                  <span className="mr-2">{g.icon}</span>{g.label}
                </button>
              ))}
            </div>

            {/* Inputs */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                  <Ruler className="w-4 h-4" />
                  父亲身高（cm）
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="150"
                    max="200"
                    value={fatherHeight}
                    onChange={(e) => setFatherHeight(Number(e.target.value))}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="w-16 text-center font-bold text-slate-900 dark:text-white text-xl">{fatherHeight} cm</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                  <Ruler className="w-4 h-4" />
                  母亲身高（cm）
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="140"
                    max="190"
                    value={motherHeight}
                    onChange={(e) => setMotherHeight(Number(e.target.value))}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="w-16 text-center font-bold text-slate-900 dark:text-white text-xl">{motherHeight} cm</span>
                </div>
              </div>

              <button
                onClick={calculate}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all text-lg"
              >
                预测身高
              </button>
            </div>

            {/* Result */}
            {result && (
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-3xl border border-blue-100 dark:border-blue-900/20 p-8 text-center">
                <h3 className="text-sm text-blue-500 mb-4 font-medium">预测结果</h3>
                <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                  {result.avg} cm
                </div>
                <div className="text-sm text-slate-500">
                  预测范围：{result.min} cm ~ {result.max} cm
                </div>
                <div className="mt-4 h-2 bg-blue-200 dark:bg-blue-900/50 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${((result.avg - 140) / 60) * 100}%` }} />
                </div>
              </div>
            )}

            {/* Info */}
            <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  此预测基于遗传学公式计算，实际身高受营养、运动、睡眠等多种因素影响，仅供参考。
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
