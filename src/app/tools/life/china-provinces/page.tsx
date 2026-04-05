'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin } from 'lucide-react';

const provinces = [
  { name: '北京市', abbr: '京', capital: '北京', pop: '2189万', area: '1.6万km²' },
  { name: '天津市', abbr: '津', capital: '天津', pop: '1387万', area: '1.1万km²' },
  { name: '河北省', abbr: '冀', capital: '石家庄', pop: '7461万', area: '19万km²' },
  { name: '山西省', abbr: '晋', capital: '太原', pop: '3492万', area: '16万km²' },
  { name: '内蒙古', abbr: '蒙', capital: '呼和浩特', pop: '2405万', area: '118万km²' },
  { name: '辽宁省', abbr: '辽', capital: '沈阳', pop: '4229万', area: '15万km²' },
  { name: '吉林省', abbr: '吉', capital: '长春', pop: '2369万', area: '19万km²' },
  { name: '黑龙江', abbr: '黑', capital: '哈尔滨', pop: '3125万', area: '47万km²' },
  { name: '上海市', abbr: '沪', capital: '上海', pop: '2487万', area: '0.6万km²' },
  { name: '江苏省', abbr: '苏', capital: '南京', pop: '8475万', area: '10万km²' },
  { name: '浙江省', abbr: '浙', capital: '杭州', pop: '6540万', area: '10万km²' },
  { name: '安徽省', abbr: '皖', capital: '合肥', pop: '6103万', area: '14万km²' },
  { name: '福建省', abbr: '闽', capital: '福州', pop: '4154万', area: '12万km²' },
  { name: '江西省', abbr: '赣', capital: '南昌', pop: '4518万', area: '17万km²' },
  { name: '山东省', abbr: '鲁', capital: '济南', pop: '10153万', area: '16万km²' },
  { name: '河南省', abbr: '豫', capital: '郑州', pop: '9872万', area: '17万km²' },
  { name: '湖北省', abbr: '鄂', capital: '武汉', pop: '5745万', area: '19万km²' },
  { name: '湖南省', abbr: '湘', capital: '长沙', pop: '6622万', area: '21万km²' },
  { name: '广东省', abbr: '粤', capital: '广州', pop: '12601万', area: '18万km²' },
  { name: '广西', abbr: '桂', capital: '南宁', pop: '5037万', area: '24万km²' },
  { name: '海南省', abbr: '琼', capital: '海口', pop: '1008万', area: '3.4万km²' },
  { name: '重庆市', abbr: '渝', capital: '重庆', pop: '3213万', area: '8.2万km²' },
  { name: '四川省', abbr: '川/蜀', capital: '成都', pop: '8367万', area: '49万km²' },
  { name: '贵州省', abbr: '黔/贵', capital: '贵阳', pop: '3830万', area: '18万km²' },
  { name: '云南省', abbr: '滇/云', capital: '昆明', pop: '4690万', area: '39万km²' },
  { name: '西藏', abbr: '藏', capital: '拉萨', pop: '364万', area: '123万km²' },
  { name: '陕西省', abbr: '陕/秦', capital: '西安', pop: '3953万', area: '21万km²' },
  { name: '甘肃省', abbr: '甘/陇', capital: '兰州', pop: '2502万', area: '43万km²' },
  { name: '青海省', abbr: '青', capital: '西宁', pop: '595万', area: '72万km²' },
  { name: '宁夏', abbr: '宁', capital: '银川', pop: '720万', area: '6.6万km²' },
  { name: '新疆', abbr: '新', capital: '乌鲁木齐', pop: '2589万', area: '166万km²' },
  { name: '台湾省', abbr: '台', capital: '台北', pop: '2357万', area: '3.6万km²' },
  { name: '香港', abbr: '港', capital: '香港', pop: '741万', area: '0.11万km²' },
  { name: '澳门', abbr: '澳', capital: '澳门', pop: '68万', area: '0.003万km²' },
];

export default function ChinaProvincesPage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(provinces[0]);

  const filtered = query
    ? provinces.filter(p => p.name.includes(query) || p.abbr.includes(query) || p.capital.includes(query))
    : provinces;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-yellow-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <MapPin className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">中国省份简称及省会大全</h1>
            </div>
            <p className="text-red-100 text-lg">全国省份、直辖市的简称、省会城市信息</p>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Province grid */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filtered.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setSelected(p)}
                      className={`p-3 rounded-xl text-center transition-all ${selected.name === p.name ? 'bg-red-50 dark:bg-red-900/20 ring-2 ring-red-500' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md'}`}
                    >
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">{p.abbr}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{p.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Detail */}
              <div>
                <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl p-8 text-white mb-4">
                  <div className="text-4xl font-bold mb-1">{selected.abbr}</div>
                  <div className="text-xl font-medium">{selected.name}</div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: '省会城市', value: selected.capital },
                    { label: '常住人口', value: selected.pop },
                    { label: '行政区面积', value: selected.area },
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
