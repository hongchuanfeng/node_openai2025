import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import ToolCard from '@/components/ToolCard';
import { toolCategories, tools, ToolCategory } from '@/config/tools';
import { ArrowRight, Sparkles, Zap, Shield, Code, Image, Home, Star, TrendingUp, File, ChevronRight, Subtitles } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  life: <Home className="w-5 h-5" />,
  image: <Image className="w-5 h-5" />,
  pdf: <File className="w-5 h-5" />,
  encrypt: <Shield className="w-5 h-5" />,
  encode: <Code className="w-5 h-5" />,
  dev: <Zap className="w-5 h-5" />,
  'subtitle-audio': <Subtitles className="w-5 h-5" />,
};

const categoryGradients: Record<string, string> = {
  life: 'from-emerald-500 to-teal-500',
  image: 'from-pink-500 to-rose-500',
  pdf: 'from-red-500 to-orange-500',
  encrypt: 'from-violet-500 to-purple-500',
  encode: 'from-amber-500 to-orange-500',
  dev: 'from-blue-500 to-cyan-500',
  'subtitle-audio': 'from-indigo-500 to-blue-500',
};

export default function HomePage() {
  // 获取分类的所有工具
  const getCategoryTools = (categoryId: string) => {
    return tools.filter(t => t.category === categoryId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZlNzliYiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-40">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>200+ 实用在线工具</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
                <span className="block mb-2">传道AI</span>
                <span className="text-3xl md:text-5xl font-medium text-white/90">让工具改变生活</span>
              </h1>

              <p className="text-lg md:text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
                汇集生活、图片、PDF、加密、编码、开发等多种实用工具，
                <br className="hidden md:block" />
                助您高效完成日常工作
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <SearchBar />
              </div>

              <div className="flex items-center justify-center gap-8 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>每日10,000+次使用</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>永久免费</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories with Tools */}
        {toolCategories.map((category, categoryIndex) => {
          const categoryTools = getCategoryTools(category.id);
          const gradient = categoryGradients[category.id] || 'from-blue-500 to-cyan-500';

          return (
            <section
              key={category.id}
              className={`py-16 ${categoryIndex % 2 === 0 ? 'bg-slate-50 dark:bg-slate-900/50' : 'bg-white dark:bg-slate-800'}`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Category Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white`}>
                      {categoryIcons[category.id]}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {category.name}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/tools/${category.id}`}
                    className={`hidden sm:flex items-center gap-1 text-sm font-medium bg-gradient-to-r ${gradient} bg-clip-text text-transparent hover:opacity-80 transition-opacity`}
                  >
                    查看全部
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categoryTools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>

                {/* Mobile View All Button */}
                <div className="mt-6 text-center sm:hidden">
                  <Link
                    href={`/tools/${category.id}`}
                    className={`inline-flex items-center gap-1 px-5 py-2.5 rounded-xl bg-gradient-to-r ${gradient} text-white text-sm font-medium`}
                  >
                    查看全部 {category.name}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>
          );
        })}

        {/* Stats Section */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {[
                { label: '工具总数', value: '200+', color: 'text-blue-400' },
                { label: '分类数量', value: '7', color: 'text-emerald-400' },
                { label: '每日使用', value: '10,000+', color: 'text-purple-400' },
                { label: '用户好评', value: '99%', color: 'text-pink-400' },
              ].map((stat, i) => (
                <div key={i} className="text-center group">
                  <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-3 group-hover:scale-110 transition-transform`}>
                    {stat.value}
                  </div>
                  <div className="text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-36 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              开始使用传道AI工具箱
            </h2>
            <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
              免费的在线工具，无需下载安装，随时随地使用
            </p>
            <Link
              href="/tools/life"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:bg-blue-50 hover:scale-105 transition-all shadow-xl"
            >
              立即体验
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
