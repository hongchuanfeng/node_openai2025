'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Search, MapPin } from 'lucide-react';

const provinces: Record<string, Record<string, string>> = {
  '北京': { '东城区': '100010', '西城区': '100032', '朝阳区': '100020', '海淀区': '100089', '丰台区': '100071' },
  '上海': { '黄浦区': '200001', '徐汇区': '200030', '静安区': '200040', '浦东新区': '200120' },
  '广东': { '广州市': '510000', '深圳市': '518000', '珠海市': '519000', '东莞市': '523000' },
  '浙江': { '杭州市': '310000', '宁波市': '315000', '温州市': '325000', '嘉兴市': '314000' },
  '江苏': { '南京市': '210000', '苏州市': '215000', '无锡市': '214000', '常州市': '213000' },
  '四川': { '成都市': '610000', '绵阳市': '621000', '宜宾市': '644000' },
  '湖北': { '武汉市': '430000', '宜昌市': '443000', '襄阳市': '441000' },
  '湖南': { '长沙市': '410000', '株洲市': '412000', '湘潭市': '411100' },
  '河南': { '郑州市': '450000', '洛阳市': '471000', '开封市': '475000' },
  '山东': { '济南市': '250000', '青岛市': '266000', '烟台市': '264000' },
};

export default function ZipCodePage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const allCodes: Array<{ province: string; city: string; code: string }> = [];
  Object.entries(provinces).forEach(([province, cities]) => {
    Object.entries(cities).forEach(([city, code]) => {
      allCodes.push({ province, city, code });
    });
  });

  const filtered = query
    ? allCodes.filter(c =>
        c.province.includes(query) || c.city.includes(query) || c.code.includes(query)
      )
    : allCodes;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-pink-600 via-rose-600 to-red-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-pink-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">邮政编码查询</h1>
            </div>
            <p className="text-pink-100 text-lg">查询全国主要城市邮政编码</p>
          </div>
        </section>

        {/* Search */}
        <section className="py-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索省份、城市或邮政编码..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>
        </section>

        {/* List */}
        <section className="py-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span className="text-sm text-slate-500">共 {filtered.length} 条结果</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((item, i) => (
                  <div
                    key={i}
                    className={`p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer ${selected === `${item.province}-${item.city}` ? 'bg-pink-50 dark:bg-pink-900/10' : ''}`}
                    onClick={() => setSelected(`${item.province}-${item.city}`)}
                  >
                    <div className="w-16 h-16 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center shrink-0">
                      <span className="text-pink-600 dark:text-pink-400 font-bold text-lg">{item.code.slice(0, 2)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-pink-500" />
                        <span className="font-semibold text-slate-900 dark:text-white">{item.province} {item.city}</span>
                      </div>
                      <div className="text-sm text-slate-500 mt-1">{item.code}</div>
                    </div>
                  </div>
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
