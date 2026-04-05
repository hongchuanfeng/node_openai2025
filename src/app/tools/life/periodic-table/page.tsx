'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Atom } from 'lucide-react';

const elements = [
  { num: 1, symbol: 'H', name: '氢', weight: '1.008', category: '非金属', color: 'text-green-500' },
  { num: 2, symbol: 'He', name: '氦', weight: '4.003', category: '稀有气体', color: 'text-purple-500' },
  { num: 3, symbol: 'Li', name: '锂', weight: '6.941', category: '碱金属', color: 'text-red-500' },
  { num: 4, symbol: 'Be', name: '铍', weight: '9.012', category: '碱土金属', color: 'text-orange-500' },
  { num: 5, symbol: 'B', name: '硼', weight: '10.81', category: '类金属', color: 'text-yellow-600' },
  { num: 6, symbol: 'C', name: '碳', weight: '12.01', category: '非金属', color: 'text-green-500' },
  { num: 7, symbol: 'N', name: '氮', weight: '14.01', category: '非金属', color: 'text-green-500' },
  { num: 8, symbol: 'O', name: '氧', weight: '16.00', category: '非金属', color: 'text-green-500' },
  { num: 9, symbol: 'F', name: '氟', weight: '19.00', category: '卤素', color: 'text-emerald-500' },
  { num: 10, symbol: 'Ne', name: '氖', weight: '20.18', category: '稀有气体', color: 'text-purple-500' },
  { num: 11, symbol: 'Na', name: '钠', weight: '22.99', category: '碱金属', color: 'text-red-500' },
  { num: 12, symbol: 'Mg', name: '镁', weight: '24.31', category: '碱土金属', color: 'text-orange-500' },
  { num: 13, symbol: 'Al', name: '铝', weight: '26.98', category: '贫金属', color: 'text-slate-500' },
  { num: 14, symbol: 'Si', name: '硅', weight: '28.09', category: '类金属', color: 'text-yellow-600' },
  { num: 15, symbol: 'P', name: '磷', weight: '30.97', category: '非金属', color: 'text-green-500' },
  { num: 16, symbol: 'S', name: '硫', weight: '32.07', category: '非金属', color: 'text-green-500' },
  { num: 17, symbol: 'Cl', name: '氯', weight: '35.45', category: '卤素', color: 'text-emerald-500' },
  { num: 18, symbol: 'Ar', name: '氩', weight: '39.95', category: '稀有气体', color: 'text-purple-500' },
  { num: 19, symbol: 'K', name: '钾', weight: '39.10', category: '碱金属', color: 'text-red-500' },
  { num: 20, symbol: 'Ca', name: '钙', weight: '40.08', category: '碱土金属', color: 'text-orange-500' },
  { num: 26, symbol: 'Fe', name: '铁', weight: '55.85', category: '过渡金属', color: 'text-amber-600' },
  { num: 29, symbol: 'Cu', name: '铜', weight: '63.55', category: '过渡金属', color: 'text-amber-600' },
  { num: 30, symbol: 'Zn', name: '锌', weight: '65.38', category: '过渡金属', color: 'text-amber-600' },
  { num: 47, symbol: 'Ag', name: '银', weight: '107.87', category: '过渡金属', color: 'text-amber-600' },
  { num: 79, symbol: 'Au', name: '金', weight: '196.97', category: '过渡金属', color: 'text-amber-600' },
];

const categories = ['全部', '非金属', '稀有气体', '碱金属', '碱土金属', '卤素', '过渡金属', '类金属', '贫金属'];

export default function PeriodicTablePage() {
  const [selected, setSelected] = useState(elements[0]);
  const [filter, setFilter] = useState('全部');

  const filtered = filter === '全部' ? elements : elements.filter(e => e.category === filter);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-pink-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Atom className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">元素周期表</h1>
            </div>
            <p className="text-indigo-100 text-lg">化学元素周期表在线查询</p>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === cat ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Grid */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2">
                  {filtered.map((el, i) => (
                    <button
                      key={i}
                      onClick={() => setSelected(el)}
                      className={`p-3 rounded-xl text-center transition-all ${selected.num === el.num ? 'bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-500' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md'}`}
                    >
                      <div className="text-xs text-slate-400">{el.num}</div>
                      <div className={`text-2xl font-bold ${selected.num === el.num ? 'text-indigo-600 dark:text-indigo-400' : el.color}`}>{el.symbol}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{el.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Detail */}
              <div>
                <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl p-8 text-white mb-4">
                  <div className="text-6xl font-bold mb-2">{selected.symbol}</div>
                  <div className="text-2xl font-medium mb-1">{selected.name}</div>
                  <div className="text-white/70">第 {selected.num} 号元素</div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: '原子序数', value: selected.num },
                    { label: '相对原子质量', value: selected.weight },
                    { label: '元素分类', value: selected.category },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <div className="text-xs text-slate-500 mb-1">{item.label}</div>
                      <div className="font-bold text-slate-900 dark:text-white">{item.value}</div>
                    </div>
                  ))}
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
