'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Globe, Clock, Search } from 'lucide-react';

const timezones = [
  { city: '北京', tz: 'GMT+8', offset: 8, country: '中国' },
  { city: '上海', tz: 'GMT+8', offset: 8, country: '中国' },
  { city: '香港', tz: 'GMT+8', offset: 8, country: '中国' },
  { city: '东京', tz: 'GMT+9', offset: 9, country: '日本' },
  { city: '首尔', tz: 'GMT+9', offset: 9, country: '韩国' },
  { city: '新加坡', tz: 'GMT+8', offset: 8, country: '新加坡' },
  { city: '伦敦', tz: 'GMT+0', offset: 0, country: '英国' },
  { city: '巴黎', tz: 'GMT+1', offset: 1, country: '法国' },
  { city: '柏林', tz: 'GMT+1', offset: 1, country: '德国' },
  { city: '莫斯科', tz: 'GMT+3', offset: 3, country: '俄罗斯' },
  { city: '迪拜', tz: 'GMT+4', offset: 4, country: '阿联酋' },
  { city: '孟买', tz: 'GMT+5:30', offset: 5.5, country: '印度' },
  { city: '曼谷', tz: 'GMT+7', offset: 7, country: '泰国' },
  { city: '悉尼', tz: 'GMT+10', offset: 10, country: '澳大利亚' },
  { city: '纽约', tz: 'GMT-5', offset: -5, country: '美国' },
  { city: '洛杉矶', tz: 'GMT-8', offset: -8, country: '美国' },
  { city: '多伦多', tz: 'GMT-5', offset: -5, country: '加拿大' },
  { city: '旧金山', tz: 'GMT-8', offset: -8, country: '美国' },
];

const getTime = (offset: number) => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + offset * 3600000);
};

const formatTime = (d: Date) => d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
const formatDate = (d: Date) => d.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' });

export default function WorldTimePage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);

  const now = getTime(8);
  const filtered = query
    ? timezones.filter(t => t.city.includes(query) || t.country.includes(query))
    : timezones;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-cyan-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">世界时间表</h1>
            </div>
            <p className="text-blue-100 text-lg">全球主要城市实时时间对照</p>
          </div>
        </section>

        {/* Local time */}
        <section className="py-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">当前本地时间</div>
                  <div className="font-bold text-slate-900 dark:text-white text-xl">{formatTime(now)}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500">{formatDate(now)}</div>
                <div className="text-sm text-slate-400">GMT+8 北京时间</div>
              </div>
            </div>
          </div>
        </section>

        {/* World clock grid */}
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
                  placeholder="搜索城市或国家..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filtered.map((city, i) => {
                const time = getTime(city.offset);
                const diff = city.offset - 8;
                const isSelected = selected === i;
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    className={`p-5 rounded-2xl text-left transition-all ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md'}`}
                  >
                    <div className="text-xs text-slate-400 mb-1">{city.country}</div>
                    <div className={`font-bold mb-2 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>{city.city}</div>
                    <div className={`text-2xl font-bold mb-1 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>{formatTime(time).slice(0, 5)}</div>
                    <div className="text-xs text-slate-400">{city.tz}</div>
                    {diff !== 0 && (
                      <div className={`text-xs mt-1 ${diff > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                        {diff > 0 ? `+${diff}` : diff}小时
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
