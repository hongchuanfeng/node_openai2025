'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Scale, RefreshCw } from 'lucide-react';

const categories = [
  { id: 'length', name: '长度', units: ['米', '厘米', '毫米', '千米', '英寸', '英尺', '码', '英里'] },
  { id: 'weight', name: '重量', units: ['千克', '克', '毫克', '吨', '磅', '盎司'] },
  { id: 'temp', name: '温度', units: ['摄氏度', '华氏度', '开尔文'] },
  { id: 'area', name: '面积', units: ['平方米', '平方千米', '公顷', '亩', '平方英尺'] },
  { id: 'volume', name: '体积', units: ['升', '毫升', '立方米', '加仑', '夸脱'] },
  { id: 'speed', name: '速度', units: ['米/秒', '千米/时', '英里/时', '节'] },
];

const convFactors: Record<string, Record<string, number>> = {
  length: { '米': 1, '厘米': 0.01, '毫米': 0.001, '千米': 1000, '英寸': 0.0254, '英尺': 0.3048, '码': 0.9144, '英里': 1609.344 },
  weight: { '千克': 1, '克': 0.001, '毫克': 0.000001, '吨': 1000, '磅': 0.453592, '盎司': 0.0283495 },
  area: { '平方米': 1, '平方千米': 1000000, '公顷': 10000, '亩': 666.667, '平方英尺': 0.092903 },
  volume: { '升': 1, '毫升': 0.001, '立方米': 1000, '加仑': 3.78541, '夸脱': 0.946353 },
  speed: { '米/秒': 1, '千米/时': 0.277778, '英里/时': 0.44704, '节': 0.514444 },
};

const tempConvert = (val: number, from: string, to: string): number => {
  if (from === to) return val;
  const celsius = from === '摄氏度' ? val : from === '华氏度' ? (val - 32) * 5 / 9 : val - 273.15;
  if (to === '摄氏度') return celsius;
  if (to === '华氏度') return celsius * 9 / 5 + 32;
  return celsius + 273.15;
};

export default function UnitConvertPage() {
  const [activeCat, setActiveCat] = useState('length');
  const [input, setInput] = useState('1');
  const [fromUnit, setFromUnit] = useState('米');
  const [toUnit, setToUnit] = useState('厘米');

  const cat = categories.find(c => c.id === activeCat)!;

  const convert = (): string => {
    const val = parseFloat(input);
    if (isNaN(val)) return '—';
    if (activeCat === 'temp') {
      return tempConvert(val, fromUnit, toUnit).toFixed(6).replace(/\.?0+$/, '');
    }
    const factors = convFactors[activeCat];
    if (!factors) return '—';
    const base = val * (factors[fromUnit] || 1);
    const result = base / (factors[toUnit] || 1);
    return result.toFixed(6).replace(/\.?0+$/, '');
  };

  const handleCatChange = (id: string) => {
    setActiveCat(id);
    const c = categories.find(x => x.id === id)!;
    setFromUnit(c.units[0]);
    setToUnit(c.units[1]);
    setInput('1');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-emerald-600 to-green-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-green-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <Scale className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">单位转换</h1>
            </div>
            <p className="text-teal-100 text-lg">长度、重量、温度、面积、体积、速度一键换算</p>
          </div>
        </section>

        {/* Converter */}
        <section className="py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleCatChange(c.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeCat === c.id ? 'bg-teal-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Converter card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
              {/* From */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">从</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-xl font-semibold"
                    placeholder="输入数值"
                  />
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-40 px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {cat.units.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              {/* Result */}
              <div className="flex items-center justify-center my-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-teal-600 dark:text-teal-400 rotate-90" />
                </div>
              </div>

              {/* To */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">到</label>
                <div className="flex gap-3">
                  <div className="flex-1 px-4 py-4 rounded-xl bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-200 dark:border-teal-800 text-slate-900 dark:text-white text-xl font-bold">
                    {convert()}
                  </div>
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-40 px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {cat.units.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              {/* Common conversions */}
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-center">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {input || '0'} {fromUnit} = {convert()} {toUnit}
                </span>
              </div>
            </div>

            {/* All units */}
            <div className="mt-8">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">支持的单位</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {cat.units.map(u => (
                  <button
                    key={u}
                    onClick={() => setToUnit(u)}
                    className={`p-3 rounded-lg text-sm transition-colors ${toUnit === u ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                  >
                    {u}
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
