import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Eye, Lock, Database, Cookie, AlertTriangle, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '隐私政策',
  description: '传道AI隐私政策 - 了解我们如何收集、使用和保护您的个人信息',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 py-24 md:py-32">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-1/3 w-72 h-72 bg-pink-300 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8">
              <Shield className="w-4 h-4 text-blue-300" />
              <span>保护您的隐私是我们的责任</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              隐私政策
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              传道AI高度重视您的个人信息和隐私保护。本政策说明了我们如何收集、使用、存储和保护您的信息。
            </p>
            <p className="text-blue-200 text-sm mt-4">
              最后更新日期：2025年1月1日
            </p>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="py-12 bg-white dark:bg-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">目录</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {[
                  '信息收集与使用',
                  '我们收集的信息',
                  '信息使用目的',
                  'Cookies 与追踪技术',
                  '信息存储与保护',
                  '第三方服务',
                  '您的权利',
                  '儿童隐私',
                  '政策更新',
                  '联系我们',
                ].map((item, i) => (
                  <a key={i} href={`#section-${i + 1}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 py-1">
                    <ArrowRight className="w-3 h-3" />
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Overview */}
        <section id="section-1" className="py-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Eye className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">信息收集与使用</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                传道AI（以下简称「我们」）高度重视您的个人信息和隐私保护。我们承诺遵守相关法律法规，
                尊重并保护所有用户的个人隐私。本隐私政策说明了我们如何收集、使用和保护您的信息。
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                我们深知个人信息的重要性，并采用业界领先的安全措施来保护您的数据安全。
                请您在使用我们的服务前，仔细阅读本隐私政策，了解我们如何处理您的个人信息。
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: What we collect */}
        <section id="section-2" className="py-12 bg-white dark:bg-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">我们收集的信息</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                为向您提供更好的服务，我们可能会收集以下类型的信息：
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: '设备信息',
                    desc: '包括浏览器类型、操作系统、设备型号、屏幕分辨率等，用于优化网站兼容性和用户体验。',
                  },
                  {
                    title: '使用数据',
                    desc: '包括访问的页面、使用的工具、功能点击情况、访问时间和停留时长等，用于分析用户行为和改进服务。',
                  },
                  {
                    title: 'Cookies 数据',
                    desc: '用于记住您的偏好设置、实现登录状态维护、提供个性化推荐等，改善您的使用体验。',
                  },
                  {
                    title: '您主动提交的信息',
                    desc: '当您联系我们、提交反馈或使用特定工具时，您主动输入或上传的内容（这些内容仅在您明确授权的情况下才会被收集）。',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <strong>重要提示：</strong>我们的绝大部&#x5206;工具（如加密解密、编码解码等）采用<strong>纯客户端处理</strong>，
                    数据不会上传到我们的服务器。请放心使用这些工具。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Purpose */}
        <section id="section-3" className="py-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">信息使用目的</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                我们收集的信息仅用于以下目的：
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '提供服务', desc: '为您提供、维护和改进在线工具服务' },
                  { title: '优化体验', desc: '了解用户行为，优化网站设计和功能布局' },
                  { title: '安全防护', desc: '检测和预防安全威胁，防止欺诈和滥用' },
                  { title: '数据分析', desc: '分析服务使用情况，支持产品决策' },
                  { title: '个性化推荐', desc: '根据使用习惯推荐相关工具' },
                  { title: '沟通反馈', desc: '回应您的咨询，处理您的问题和反馈' },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Cookies */}
        <section id="section-4" className="py-12 bg-white dark:bg-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <Cookie className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Cookies 与追踪技术</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                我们使用 Cookies 和类似的追踪技术来收集和存储关于您访问服务的信息。
                Cookies 是存储在您设备上的小型文本文件，可以帮助网站记住您的偏好。
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>必要 Cookies：</strong>确保网站正常运行的必备 Cookies，如登录状态、购物车等
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>功能 Cookies：</strong>记住您的偏好设置，如语言、主题选择等
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 shrink-0" />
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>分析 Cookies：</strong>帮助我们了解网站访问量和使用情况，用于持续改进
                  </p>
                </div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-4">
                您可以通过浏览器设置拒绝或删除部分 Cookies，但这可能会影响网站的部分功能。
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Storage & Protection */}
        <section id="section-5" className="py-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">信息存储与保护</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                我们采用多层次的安全措施来保护您的个人信息：
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'SSL/TLS 加密传输',
                  '服务器防火墙保护',
                  '定期安全漏洞扫描',
                  '访问权限严格控制',
                  '数据备份与恢复机制',
                  '员工安全培训制度',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Shield className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-4">
                尽管我们已采取合理的安全措施，但互联网传输无法保证100%安全。请您也注意保护自己的账户信息。
              </p>
            </div>
          </div>
        </section>

        {/* Section 6-10 */}
        <section className="py-12 bg-white dark:bg-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Third-party */}
            <div id="section-6" className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 md:p-10 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">第三方服务</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                我们的服务可能包含第三方服务的链接或集成，包括：
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                {['Google Analytics（网站流量分析）', 'Google Search Console（搜索引擎优化）', 'CDN 服务（内容分发加速）', '第三方 API 服务（如天气预报、汇率查询等）'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-4">
                我们不对第三方服务的隐私实践负责。建议您在使用前查看相关服务的隐私政策。
              </p>
            </div>

            {/* Your Rights */}
            <div id="section-7" className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 md:p-10 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">您的权利</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                根据适用法律，您享有以下权利：
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {['知情权 - 了解我们如何处理您的数据', '访问权 - 请求获取您的个人数据', '更正权 - 要求更正不准确的个人数据', '删除权 - 要求删除您的个人数据', '限制处理权 - 限制我们对数据的使用', '数据可携权 - 获取您的数据结构化数据'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-white dark:bg-slate-800">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">{i + 1}</span>
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-4">
                如需行使上述权利，请通过邮件联系我们：<a href="mailto:support@openai2025.com" className="text-blue-600 hover:underline">support@openai2025.com</a>
              </p>
            </div>

            {/* Children Privacy */}
            <div id="section-8" className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 md:p-10 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">儿童隐私</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                我们的服务不面向13岁以下的儿童。我们不会故意收集13岁以下儿童的个人信息。
                如果您发现我们可能收集了儿童的个人信息，请立即联系我们，我们会采取措施删除相关信息。
              </p>
            </div>

            {/* Policy Updates */}
            <div id="section-9" className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 md:p-10 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">政策更新</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                我们可能会不时更新本隐私政策。任何更新将在本页面发布，并更新「最后更新日期」。
                对于重大变更，我们会通过网站公告或邮件通知您。建议您定期查看本页面以了解最新信息。
              </p>
            </div>

            {/* Contact */}
            <div id="section-10" className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-8 md:p-10 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">联系我们</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                如您对本隐私政策有任何疑问、意见或担忧，请通过以下方式联系我们：
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="mailto:support@openai2025.com" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
                  <FileText className="w-4 h-4" />
                  support@openai2025.com
                </a>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-white font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  访问联系页面
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
