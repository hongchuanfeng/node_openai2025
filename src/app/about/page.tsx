import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Sparkles, Heart, Users, Globe, Zap, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '关于我们',
  description: '了解传道AI的故事、使命和价值观，为您提供最好的在线工具服务',
};

const features = [
  {
    icon: <Sparkles className="w-7 h-7" />,
    title: '持续更新',
    desc: '我们不断添加新工具和功能，确保您始终拥有最新、最实用的在线工具。',
  },
  {
    icon: <Heart className="w-7 h-7" />,
    title: '用户至上',
    desc: '一切设计以用户为中心，追求简洁易用的体验，让每个人都能轻松上手。',
  },
  {
    icon: <Shield className="w-7 h-7" />,
    title: '安全可靠',
    desc: '所有工具均采用客户端处理，数据不上传服务器，您的隐私安全有保障。',
  },
  {
    icon: <Globe className="w-7 h-7" />,
    title: '永久免费',
    desc: '传道AI承诺永久免费使用，无需注册登录，打开浏览器即可使用全部工具。',
  },
];

const timeline = [
  { year: '2023', event: '传道AI项目正式启动，首批上线20+工具' },
  { year: '2024', event: '工具数量突破100+，新增图片处理和开发工具分类' },
  { year: '2025', event: '全面优化用户体验，支持深色模式，月活跃用户超过50万' },
];

const stats = [
  { value: '112+', label: '在线工具' },
  { value: '5', label: '工具分类' },
  { value: '50万+', label: '月活跃用户' },
  { value: '1000万+', label: '累计使用次数' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 py-24 md:py-32">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-1/4 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-pink-300 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8">
              <Heart className="w-4 h-4 text-pink-400" />
              <span>了解我们的故事</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              关于传道AI
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              我们是一个专注于打造优质在线工具的平台，致力于让复杂的技术变得简单，
              让每个人都能轻松完成日常工作和生活中的各种任务。
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-white dark:bg-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                我们的使命
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                通过简洁、高效、免费的在线工具，帮助用户更轻松地完成工作和生活中的各种任务
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                  <Zap className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    让技术触手可及
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    在这个数字化时代，我们每天都要处理大量的信息转换、编码解码、图片处理等工作。
                    传道AI的使命，就是将这些复杂的技术需求，变成每个人都能轻松完成的简单操作。
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    我们相信，好的工具不应该需要复杂的配置或昂贵的费用。每一个工具都经过精心设计，
                    界面简洁直观，让您打开浏览器就能立即使用，无需注册、无需下载、无需安装任何软件。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white dark:bg-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                我们的核心价值
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                四大核心价值，贯穿每一个工具的设计与开发
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-5">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                发展历程
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                从一个小工具网站，到如今服务数十万用户的平台
              </p>
            </div>

            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{item.year}</span>
                    </div>
                  </div>
                  <div className="flex-1 pt-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                      <p className="text-slate-700 dark:text-slate-300 text-lg">
                        {item.event}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              准备好开始使用了吗？
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              立即体验我们的在线工具，告别繁琐的操作，让工作和生活更高效
            </p>
            <Link
              href="/tools"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              浏览全部工具
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
