'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Newspaper, ExternalLink, Clock } from 'lucide-react';

const newsCategories = ['全部', '国内', '国际', '科技', '财经', '体育', '娱乐'];
const mockNews = [
  { id: 1, title: '人工智能技术持续突破，新应用场景不断涌现', category: '科技', source: '科技日报', time: '10分钟前', desc: '随着大模型技术的快速发展，AI在各行各业的应用场景正在快速扩展...' },
  { id: 2, title: '国内消费市场回暖，多项数据超预期增长', category: '财经', source: '经济观察', time: '30分钟前', desc: '最新统计数据显示，我国消费市场呈现持续回暖态势...' },
  { id: 3, title: '国际油价波动加剧，能源市场面临新挑战', category: '国际', source: '环球时报', time: '1小时前', desc: '受地缘政治因素影响，国际原油市场近期波动明显...' },
  { id: 4, title: '全民健身计划深入推进，体育产业蓬勃发展', category: '体育', source: '体育周报', time: '2小时前', desc: '随着全民健身国家战略的深入实施，体育产业迎来快速发展期...' },
  { id: 5, title: '数字经济成为增长新引擎，科技创新受关注', category: '科技', source: '科技前沿', time: '3小时前', desc: '数字经济蓬勃发展，成为推动经济高质量发展的重要力量...' },
  { id: 6, title: '新能源汽车销量创新高，产业链加速升级', category: '财经', source: '汽车财经', time: '4小时前', desc: '在政策支持和市场需求双重驱动下，新能源汽车市场持续火热...' },
];

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockNews.filter(n =>
    (activeCategory === '全部' || n.category === activeCategory) &&
    (n.title.includes(searchQuery) || n.desc.includes(searchQuery))
  );

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
              <Newspaper className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">新闻查询</h1>
            </div>
            <p className="text-orange-100 text-lg">实时资讯浏览，掌握最新动态</p>
          </div>
        </section>

        {/* Categories */}
        <section className="py-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {newsCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                >
                  {cat}
                </button>
              ))}
              <div className="ml-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索新闻..."
                    className="pl-9 pr-4 py-2 rounded-full text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* News List */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <article key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">{item.category}</span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" /> {item.time}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 hover:text-blue-600 cursor-pointer line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-3">
                      {item.desc}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                      <span className="text-xs text-slate-400">{item.source}</span>
                      <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                        <ExternalLink className="w-3 h-3" /> 阅读全文
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-400">暂无相关新闻</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
