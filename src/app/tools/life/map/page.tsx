'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Map, Search, Navigation, MapPin, Crosshair } from 'lucide-react';

const popularPlaces = [
  { name: '深圳市龙华区龙华大道130栋', lat: 22.73, lng: 114.03, type: '公司' },
  { name: '深圳市南山区科技园', lat: 22.54, lng: 113.93, type: '科技园' },
  { name: '深圳市福田区市民中心', lat: 22.54, lng: 114.06, type: '政府' },
  { name: '广州市天河区珠江新城', lat: 23.12, lng: 113.32, type: '商务' },
  { name: '北京市朝阳区国贸', lat: 39.91, lng: 116.46, type: '商务' },
  { name: '上海市浦东新区陆家嘴', lat: 31.24, lng: 121.51, type: '金融' },
];

export default function MapPage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(popularPlaces[0]);

  const filtered = popularPlaces.filter(p =>
    p.name.includes(query) || p.type.includes(query)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <Map className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">地图查询</h1>
            </div>
            <p className="text-emerald-100 text-lg">地理位置查询与导航服务</p>
          </div>
        </section>

        {/* Search */}
        <section className="py-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="输入地址搜索..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Map Display */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">

              {/* Map placeholder */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-blue-100 to-teal-100 dark:from-slate-800 dark:to-slate-700 rounded-3xl h-96 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <div className="grid grid-cols-8 gap-px h-full">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div key={i} className="bg-white/50 dark:bg-slate-600/50" />
                      ))}
                    </div>
                  </div>
                  <div className="text-center z-10">
                    <Map className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <p className="text-emerald-700 dark:text-emerald-400 font-medium mb-2">{selected.name}</p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-500">
                      坐标：{selected.lat.toFixed(4)}°N, {selected.lng.toFixed(4)}°E
                    </p>
                    <p className="text-xs text-emerald-500 dark:text-emerald-600 mt-1">
                      类型：{selected.type}
                    </p>
                  </div>
                  <button className="absolute bottom-4 right-4 p-3 rounded-full bg-white dark:bg-slate-700 shadow-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-600 transition-colors">
                    <Crosshair className="w-5 h-5" />
                  </button>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { icon: <Navigation className="w-5 h-5" />, label: '导航到这里' },
                    { icon: <MapPin className="w-5 h-5" />, label: '添加标记' },
                    { icon: <Crosshair className="w-5 h-5" />, label: '定位当前位置' },
                  ].map((item, i) => (
                    <button key={i} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors border border-slate-200 dark:border-slate-700">
                      {item.icon}
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Place list */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white">热门地点</h3>
                {filtered.map((place, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(place)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${selected.name === place.name ? 'bg-emerald-50 dark:bg-emerald-900/20 ring-2 ring-emerald-500' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${selected.name === place.name ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white text-sm">{place.name}</div>
                        <div className="text-xs text-slate-400 mt-1">{place.lat.toFixed(4)}°N, {place.lng.toFixed(4)}°E</div>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">{place.type}</span>
                      </div>
                    </div>
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
