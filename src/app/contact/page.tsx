import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Globe, MessageSquare, Users, Briefcase, Heart, Phone, MapPin, Clock, ArrowRight, Send } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '联系我们',
  description: '联系传道AI团队，无论是问题反馈、合作建议还是技术支持，我们都期待与您沟通',
};

const contactMethods = [
  {
    icon: <Mail className="w-7 h-7" />,
    label: '电子邮箱',
    value: 'support@openai2025.com',
    desc: '日常咨询、问题反馈、合作洽谈',
    href: 'mailto:support@openai2025.com',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: <MessageSquare className="w-7 h-7" />,
    label: '在线反馈',
    value: '提交工单',
    desc: '通过工单系统提交，获得更快响应',
    href: '/contact',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: <Globe className="w-7 h-7" />,
    label: '官方网站',
    value: 'https://www.openai2025.com',
    desc: '访问我们的官方网站了解更多',
    href: 'https://www.openai2025.com',
    color: 'from-purple-500 to-purple-600',
  },
];

const faqItems = [
  {
    q: '工具使用过程中出现错误怎么办？',
    a: '请首先刷新页面重试。如果问题仍然存在，请通过邮箱或工单反馈具体工具名称、操作步骤和错误信息，我们会尽快排查并修复。',
  },
  {
    q: '你们提供技术支持服务吗？',
    a: '我们提供免费的基础技术支持。对于企业级用户或有特殊需求的用户，我们也提供付费的技术支持服务，请联系商务合作邮箱。',
  },
  {
    q: '如何申请工具收录？',
    a: '如果您希望将某个工具提交到传道AI，欢迎通过邮箱联系我们。请提供工具的功能描述、使用场景和开发计划，我们会认真评估。',
  },
  {
    q: '可以定制开发专属工具吗？',
    a: '可以的。我们提供工具定制开发服务，可以根据您的业务需求开发专属的在线工具。请发送邮件至 support@openai2025.com 了解详情。',
  },
];

const businessTypes = [
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: '工具定制开发',
    desc: '根据企业需求定制开发专属在线工具，支持私有化部署',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: '工具收录合作',
    desc: '如果您有优质的在线工具，欢迎提交收录，丰富传道AI工具库',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: '品牌合作',
    desc: '品牌联名、联合活动、内容合作等多种合作模式',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: '技术支持服务',
    desc: '为企业提供专业的技术支持、咨询和培训服务',
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 py-24 md:py-32">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-1/4 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-pink-300 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8">
              <MessageSquare className="w-4 h-4 text-blue-300" />
              <span>我们随时为您服务</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              联系我们
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              无论是遇到问题、提出建议，还是寻求合作，我们都期待与您沟通。
              选择最适合您的方式联系我们，我们会在24小时内回复。
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-20 bg-white dark:bg-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                联系方式
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                选择最适合您的方式与我们取得联系
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactMethods.map((method, i) => (
                <a
                  key={i}
                  href={method.href}
                  className="group p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-transparent transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform`}>
                    {method.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {method.label}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
                    {method.value}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {method.desc}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                联系方式详情
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="flex items-start gap-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">邮箱地址</div>
                    <div className="font-semibold text-slate-900 dark:text-white">support@openai2025.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">官方网站</div>
                    <div className="font-semibold text-slate-900 dark:text-white">www.openai2025.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">服务时间</div>
                    <div className="font-semibold text-slate-900 dark:text-white">周一至周五 9:00-18:00</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">公司地址</div>
                    <div className="font-semibold text-slate-900 dark:text-white">深圳市龙华区龙华大道130栋</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white mb-2">反馈响应说明</div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      我们重视每一位用户的反馈。一般情况下，工作日内的咨询会在24小时内回复。
                      如遇高峰期，回复可能稍有延迟，请耐心等待。如果问题紧急，请在邮件标题中注明「紧急」。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cooperation */}
        <section className="py-20 bg-white dark:bg-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                合作机会
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                我们欢迎多种形式的合作，共同为用户提供更优质的服务
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {businessTypes.map((item, i) => (
                <div
                  key={i}
                  className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-5">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <a
                href="mailto:support@openai2025.com"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
              >
                <Send className="w-5 h-5" />
                发送合作邮件
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                常见问题
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                在联系我们之前，您可以先看看这些常见问题
              </p>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <details
                  key={i}
                  className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors list-none">
                    <span>{item.q}</span>
                    <span className="ml-4 shrink-0 text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                没有找到您需要的答案？
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                查看更多帮助
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
