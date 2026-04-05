'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Baby, Info } from 'lucide-react';

export default function GenderPredictPage() {
  const [method, setMethod] = useState<'age' | 'month'>('age');
  const [motherAge, setMotherAge] = useState(25);
  const [conceptionMonth, setConceptionMonth] = useState(4);
  const [result, setResult] = useState('');

  const predict = () => {
    if (method === 'age') {
      const factor = (motherAge + conceptionMonth) % 2;
      setResult(factor === 0 ? '男孩' : '女孩');
    } else {
      const factor = (conceptionMonth + motherAge) % 2;
      setResult(factor === 0 ? '女孩' : '男孩');
    }
  };

  const facts = [
    { icon: '🔬', text: '科学表明，婴儿性别由精子中的X或Y染色体决定' },
    { icon: '⚖️', text: '父亲年龄可能会影响携带X或Y染色体精子的比例' },
    { icon: '🌡️', text: '研究显示，受孕时的季节和温度可能对性别比例有轻微影响' },
    { icon: '💡', text: '这些方法均基于民间经验，无科学依据，请勿当真' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-pink-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Baby className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">生男生女预测</h1>
            </div>
            <p className="text-pink-100 text-lg">趣味预测，仅供娱乐</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
            {/* Method toggle */}
            <div className="flex gap-3 mb-8">
              {[
                { id: 'age' as const, label: '母亲年龄法' },
                { id: 'month' as const, label: '受孕月份法' },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-colors ${method === m.id ? 'bg-pink-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              {method === 'age' ? (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                    母亲年龄（岁）
                  </label>
                  <div className="flex items-center gap-4">
                    <input type="range" min="18" max="45" value={motherAge} onChange={(e) => setMotherAge(Number(e.target.value))} className="flex-1 accent-pink-500" />
                    <span className="w-12 text-center font-bold text-slate-900 dark:text-white text-xl">{motherAge}</span>
                  </div>
                </div>
              ) : null}

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                  {method === 'age' ? '受孕月份' : '母亲年龄（岁）'}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={method === 'age' ? conceptionMonth : motherAge}
                    onChange={(e) => method === 'age' ? setConceptionMonth(Number(e.target.value)) : setMotherAge(Number(e.target.value))}
                    className="flex-1 accent-pink-500"
                  />
                  <span className="w-16 text-center font-bold text-slate-900 dark:text-white text-xl">
                    {method === 'age' ? `${conceptionMonth}月` : motherAge}
                  </span>
                </div>
              </div>

              <button
                onClick={predict}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all text-lg"
              >
                开始预测
              </button>
            </div>

            {result && (
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{result === '男孩' ? '👦' : '👧'}</div>
                <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">{result}</div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-4 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  ⚠️ 这是一个趣味测试，仅供娱乐。婴儿性别由生物学因素决定，与任何计算方法无关，请勿当真！
                </p>
              </div>
            </div>

            {/* Facts */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3">关于生男生女</h3>
              {facts.map((fact, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <span className="text-2xl shrink-0">{fact.icon}</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{fact.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
