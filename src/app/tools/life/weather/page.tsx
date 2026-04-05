'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Cloud, Droplets, Wind, Thermometer, Eye, Sun, Moon } from 'lucide-react';
import { AlertTriangle, Copy, Check } from 'lucide-react';

const weatherData: Record<string, { city: string; temp: string; desc: string; humidity: string; wind: string; icon: string }> = {
  beijing: { city: '北京', temp: '28°C', desc: '晴', humidity: '45%', wind: '3级', icon: '☀️' },
  shanghai: { city: '上海', temp: '26°C', desc: '多云', humidity: '62%', wind: '2级', icon: '⛅' },
  guangzhou: { city: '广州', temp: '33°C', desc: '雷阵雨', humidity: '78%', wind: '4级', icon: '⛈️' },
  shenzhen: { city: '深圳', temp: '32°C', desc: '阵雨', humidity: '80%', wind: '3级', icon: '🌧️' },
  hangzhou: { city: '杭州', temp: '27°C', desc: '阴', humidity: '68%', wind: '2级', icon: '☁️' },
  chengdu: { city: '成都', temp: '24°C', desc: '小雨', humidity: '85%', wind: '1级', icon: '🌦️' },
  wuhan: { city: '武汉', temp: '29°C', desc: '晴转多云', humidity: '55%', wind: '2级', icon: '🌤️' },
  xian: { city: '西安', temp: '31°C', desc: '晴', humidity: '40%', wind: '3级', icon: '☀️' },
};

const cities = Object.keys(weatherData);

export default function WeatherPage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('beijing');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const current = weatherData[selected];

  const searchCity = (q: string) => {
    setQuery(q);
    const found = cities.find(c => c.includes(q.toLowerCase()) || weatherData[c].city.includes(q));
    if (found) setSelected(found);
  };

  const toggleFavorite = (key: string) => {
    setFavorites(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const handleCopy = async () => {
    const text = `${current.city} ${current.desc} ${current.temp} 湿度${current.humidity} 风速${current.wind}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-yellow-300 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">天气预报</h1>
            <p className="text-blue-100 text-lg">查询全国主要城市实时天气信息</p>
          </div>
        </section>

        {/* Search */}
        <section className="py-8 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => searchCity(e.target.value)}
                placeholder="输入城市名称搜索..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">

              {/* Weather Display */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white mb-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-5xl font-bold mb-2">{current.temp}</h2>
                      <p className="text-xl text-blue-100 mb-1">{current.city}</p>
                      <p className="text-blue-200">{current.desc}</p>
                    </div>
                    <div className="text-8xl">{current.icon}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="text-center">
                      <Droplets className="w-5 h-5 mx-auto mb-1 opacity-80" />
                      <div className="text-sm text-blue-200">湿度</div>
                      <div className="font-semibold">{current.humidity}</div>
                    </div>
                    <div className="text-center">
                      <Wind className="w-5 h-5 mx-auto mb-1 opacity-80" />
                      <div className="text-sm text-blue-200">风速</div>
                      <div className="font-semibold">{current.wind}</div>
                    </div>
                    <div className="text-center">
                      <Eye className="w-5 h-5 mx-auto mb-1 opacity-80" />
                      <div className="text-sm text-blue-200">能见度</div>
                      <div className="font-semibold">10km</div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-sm">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? '已复制' : '复制天气'}
                    </button>
                    <button onClick={() => toggleFavorite(selected)} className={`px-4 py-2 rounded-lg text-sm transition-colors ${favorites.includes(selected) ? 'bg-yellow-400/80 text-yellow-900' : 'bg-white/20 hover:bg-white/30'}`}>
                      {favorites.includes(selected) ? '★ 已收藏' : '☆ 收藏'}
                    </button>
                  </div>
                </div>

                {/* City Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {cities.map((key) => {
                    const data = weatherData[key];
                    const isActive = selected === key;
                    return (
                      <button
                        key={key}
                        onClick={() => { setSelected(key); setQuery(''); }}
                        className={`p-4 rounded-xl text-left transition-all ${isActive ? 'bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500' : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                      >
                        <div className="text-2xl mb-1">{data.icon}</div>
                        <div className={`font-semibold text-sm ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>{data.city}</div>
                        <div className="text-xs text-slate-500">{data.temp} · {data.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Favorites */}
                {favorites.length > 0 && (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">我的收藏</h3>
                    <div className="space-y-2">
                      {favorites.map(key => {
                        const data = weatherData[key];
                        return (
                          <button key={key} onClick={() => setSelected(key)} className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <span className="text-2xl">{data.icon}</span>
                            <div className="text-left">
                              <div className="font-medium text-slate-900 dark:text-white text-sm">{data.city}</div>
                              <div className="text-xs text-slate-500">{data.temp}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tips */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4">生活指数</h3>
                  <div className="space-y-3">
                    {[
                      { label: '紫外线', value: '中等', icon: <Sun className="w-4 h-4 text-yellow-500" />, color: 'text-yellow-600' },
                      { label: '穿衣指数', value: '舒适', icon: <Cloud className="w-4 h-4 text-blue-500" />, color: 'text-blue-600' },
                      { label: '运动指数', value: '适宜', icon: <Wind className="w-4 h-4 text-green-500" />, color: 'text-green-600' },
                      { label: '洗车指数', value: '较不宜', icon: <Moon className="w-4 h-4 text-slate-500" />, color: 'text-slate-600' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                        <div className="flex items-center gap-2">
                          {item.icon}
                          <span className="text-sm text-slate-600 dark:text-slate-400">{item.label}</span>
                        </div>
                        <span className={`text-sm font-medium ${item.color}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                      数据仅供参考，实际天气以当地气象部门发布为准。本工具提供主流城市天气查询服务。
                    </p>
                  </div>
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
