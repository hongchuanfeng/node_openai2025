'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Eye, Info } from 'lucide-react';

const plates = [
  { id: 1, text: '12', bg: '#c62828', fg: '#fff', hint: '如果你看到"12"，则为正常。' },
  { id: 2, text: '3', bg: '#1565c0', fg: '#fff', hint: '正常视力看到数字3，全色盲看不到数字。' },
  { id: 3, text: '8', bg: '#2e7d32', fg: '#fff', hint: '正常视力看到数字8，红色盲看不到数字。' },
  { id: 4, text: '5', bg: '#6a1b9a', fg: '#fff', hint: '正常视力看到数字5，绿色盲看不到数字。' },
  { id: 5, text: '29', bg: '#00695c', fg: '#fff', hint: '正常视力看到"29"，红色盲看到"70"，绿色盲看到"20"。' },
  { id: 6, text: '74', bg: '#e65100', fg: '#fff', hint: '正常视力看到"74"，蓝色盲看不到数字。' },
  { id: 7, text: '6', bg: '#4527a0', fg: '#fff', hint: '正常视力看到数字6，全色盲看不到数字。' },
  { id: 8, text: '45', bg: '#ad1457', fg: '#fff', hint: '正常视力看到"45"，红色弱看到"42"，绿色弱看到"45"。' },
];

export default function ColorblindTestPage() {
  const [current, setCurrent] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const plate = plates[current];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-cyan-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Eye className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">色盲测试</h1>
            </div>
            <p className="text-teal-100 text-lg">通过石原色觉测试图初步检测色觉</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
            {/* Progress */}
            <div className="flex items-center gap-3 mb-8">
              {plates.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrent(i); setShowHint(false); }}
                  className={`h-2 flex-1 rounded-full transition-all ${i === current ? 'bg-teal-600 w-6' : 'bg-slate-200 dark:bg-slate-700'}`}
                />
              ))}
            </div>

            {/* Plate */}
            <div className="text-center mb-6">
              <div
                className="inline-flex items-center justify-center rounded-3xl w-64 h-64 text-6xl font-bold shadow-lg mx-auto"
                style={{ backgroundColor: plate.bg, color: plate.fg }}
              >
                {plate.text}
              </div>
            </div>

            {/* Hint */}
            <button
              onClick={() => setShowHint(h => !h)}
              className="w-full py-3 px-6 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm mb-6"
            >
              {showHint ? '收起提示' : '显示提示'}
            </button>

            {showHint && (
              <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/20 text-center mb-6">
                <p className="text-sm text-teal-800 dark:text-teal-300">{plate.hint}</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => { setCurrent(c => Math.max(0, c - 1)); setShowHint(false); }}
                disabled={current === 0}
                className="flex-1 py-3 px-6 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium rounded-xl disabled:opacity-50 transition-colors"
              >
                上一张
              </button>
              <button
                onClick={() => { setCurrent(c => Math.min(plates.length - 1, c + 1)); setShowHint(false); }}
                disabled={current === plates.length - 1}
                className="flex-1 py-3 px-6 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 disabled:opacity-50 transition-colors"
              >
                下一张
              </button>
            </div>

            {/* Progress text */}
            <div className="text-center text-sm text-slate-500 mb-6">
              第 {current + 1} / {plates.length} 张
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div className="text-sm text-amber-800 dark:text-amber-300 space-y-1">
                  <p>⚠️ 免责声明：</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>本测试仅供参考，不能替代专业医学诊断</li>
                    <li>如果你在任何一张图片上看到与大多数人不一样的结果，建议咨询专业眼科医生</li>
                    <li>石原色觉测试是一种初步筛查方法，完整色觉检查需要专业设备</li>
                  </ul>
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
