'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar, Gift, Star, Cherry } from 'lucide-react';

const holidays = [
  { name: '元旦', date: '1月1日', month: 1, day: 1, type: 'holiday', desc: '新年第一天，全民放假' },
  { name: '春节', date: '农历正月初一', month: 1, day: 29, type: 'holiday', desc: '中华民族最隆重的传统节日' },
  { name: '元宵节', date: '农历正月十五', month: 2, day: 12, type: 'traditional', desc: '赏花灯、吃元宵的节日' },
  { name: '清明节', date: '4月5日左右', month: 4, day: 5, type: 'holiday', desc: '祭祖扫墓的传统节日' },
  { name: '劳动节', date: '5月1日', month: 5, day: 1, type: 'holiday', desc: '国际劳动节' },
  { name: '端午节', date: '农历五月初五', month: 6, day: 10, type: 'traditional', desc: '赛龙舟、吃粽子的节日' },
  { name: '中秋节', date: '农历八月十五', month: 9, day: 17, type: 'traditional', desc: '赏月、吃月饼的传统节日' },
  { name: '国庆节', date: '10月1日', month: 10, day: 1, type: 'holiday', desc: '中华人民共和国国庆' },
  { name: '重阳节', date: '农历九月初九', month: 10, day: 29, type: 'traditional', desc: '登高望远、敬老节日' },
  { name: '冬至', date: '12月21日左右', month: 12, day: 21, type: 'solar', desc: '二十四节气之一' },
];

const upcoming = () => {
  const now = new Date();
  const thisYear = now.getFullYear();
  return holidays
    .filter(h => new Date(thisYear, h.month - 1, h.day) >= now)
    .slice(0, 3);
};

export default function HolidayPage() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? holidays
    : holidays.filter(h => h.type === filter);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-yellow-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">中国节日查询</h1>
            </div>
            <p className="text-red-100 text-lg">传统节日、法定假日，一目了然</p>
          </div>
        </section>

        {/* Upcoming */}
        <section className="py-8 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">即将到来</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcoming().map((h, i) => (
                <div key={i} className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-100 dark:border-red-900/20 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-red-500 flex items-center justify-center text-white">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{h.name}</div>
                    <div className="text-sm text-slate-500">{h.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* List */}
        <section className="py-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter */}
            <div className="flex gap-2 mb-8">
              {[
                { id: 'all', label: '全部节日' },
                { id: 'holiday', label: '法定假日', icon: <Star className="w-4 h-4" /> },
                { id: 'traditional', label: '传统节日', icon: <Cherry className="w-4 h-4" /> },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f.id ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                >
                  {f.icon}
                  {f.label}
                </button>
              ))}
            </div>

            {/* Cards */}
            <div className="space-y-4">
              {filtered.map((h, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${h.type === 'holiday' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-lg">{h.name}</div>
                        <div className="text-sm text-slate-500">{h.date}</div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${h.type === 'holiday' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>
                      {h.type === 'holiday' ? '法定假日' : '传统节日'}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 ml-16">{h.desc}</p>
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
