'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BookOpen } from 'lucide-react';

const dynasties = [
  { name: '夏朝', period: '约前2070-前1600', capital: '阳城', founder: '大禹', color: 'from-red-500 to-orange-500' },
  { name: '商朝', period: '约前1600-前1046', capital: '亳/殷', founder: '成汤', color: 'from-orange-500 to-yellow-500' },
  { name: '西周', period: '前1046-前771', capital: '镐京', founder: '周武王', color: 'from-yellow-500 to-green-500' },
  { name: '东周', period: '前770-前256', capital: '洛邑', founder: '周平王', color: 'from-green-500 to-emerald-500' },
  { name: '秦朝', period: '前221-前207', capital: '咸阳', founder: '秦始皇', color: 'from-emerald-500 to-teal-500' },
  { name: '西汉', period: '前202-公元8', capital: '长安', founder: '刘邦', color: 'from-teal-500 to-cyan-500' },
  { name: '东汉', period: '25-220', capital: '洛阳', founder: '刘秀', color: 'from-cyan-500 to-blue-500' },
  { name: '三国', period: '220-280', capital: '魏/蜀/吴', founder: '曹丕/刘备/孙权', color: 'from-blue-500 to-indigo-500' },
  { name: '西晋', period: '265-317', capital: '洛阳', founder: '司马炎', color: 'from-indigo-500 to-violet-500' },
  { name: '东晋', period: '317-420', capital: '建康', founder: '司马睿', color: 'from-violet-500 to-purple-500' },
  { name: '南北朝', period: '420-589', capital: '南北多都', founder: '多人', color: 'from-purple-500 to-pink-500' },
  { name: '隋朝', period: '581-618', capital: '大兴/洛阳', founder: '杨坚', color: 'from-pink-500 to-rose-500' },
  { name: '唐朝', period: '618-907', capital: '长安', founder: '李渊', color: 'from-rose-500 to-red-500' },
  { name: '五代十国', period: '907-960', capital: '多都', founder: '多人', color: 'from-red-500 to-orange-400' },
  { name: '北宋', period: '960-1127', capital: '开封', founder: '赵匡胤', color: 'from-orange-400 to-amber-500' },
  { name: '南宋', period: '1127-1279', capital: '临安', founder: '赵构', color: 'from-amber-500 to-yellow-500' },
  { name: '元朝', period: '1271-1368', capital: '大都', founder: '忽必烈', color: 'from-yellow-500 to-lime-500' },
  { name: '明朝', period: '1368-1644', capital: '南京/北京', founder: '朱元璋', color: 'from-lime-500 to-green-500' },
  { name: '清朝', period: '1644-1912', capital: '北京', founder: '皇太极', color: 'from-green-500 to-emerald-500' },
];

export default function ChineseHistoryPage() {
  const [selected, setSelected] = useState(0);
  const d = dynasties[selected];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-yellow-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">中国历史朝代查询</h1>
            </div>
            <p className="text-amber-100 text-lg">从夏朝到清朝，探索中华五千年文明</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Timeline */}
            <div className="flex overflow-x-auto pb-4 mb-8 gap-2 scrollbar-hide">
              {dynasties.map((dyn, i) => (
                <button key={i} onClick={() => setSelected(i)} className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${selected === i ? `bg-gradient-to-r ${dyn.color} text-white shadow-lg` : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                  {dyn.name}
                </button>
              ))}
            </div>

            {/* Detail card */}
            <div className={`bg-gradient-to-br ${d.color} rounded-3xl p-8 md:p-12 text-white mb-8`}>
              <div className="text-5xl font-bold mb-2">{d.name}</div>
              <div className="text-white/80 text-lg mb-6">{d.period}</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-white/60 text-sm mb-1">都城</div>
                  <div className="font-bold text-lg">{d.capital}</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-white/60 text-sm mb-1">建立者</div>
                  <div className="font-bold text-lg">{d.founder}</div>
                </div>
              </div>
            </div>

            {/* All dynasties grid */}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">朝代总览</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {dynasties.map((dyn, i) => (
                  <button key={i} onClick={() => setSelected(i)} className={`p-3 rounded-xl text-left transition-all ${selected === i ? `bg-gradient-to-br ${dyn.color} text-white shadow-md` : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-sm'}`}>
                    <div className={`font-bold text-sm ${selected === i ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{dyn.name}</div>
                    <div className={`text-xs ${selected === i ? 'text-white/70' : 'text-slate-400'}`}>{dyn.period.split('-')[0].replace('前','').replace('约','')}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
