import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copyright, FileText, Shield, AlertTriangle, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '版权声明',
  description: '传道AI版权声明 - 了解网站内容的版权保护、使用限制和侵权处理方式',
};

export default function CopyrightPage() {
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
              <Copyright className="w-4 h-4 text-blue-300" />
              <span>尊重知识产权是我们的原则</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              版权声明
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              传道AI致力于保护知识产权。本页面说明了我们网站内容的版权归属、使用规则以及侵权举报流程。
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
                  '版权保护范围',
                  '版权归属说明',
                  '许可使用范围',
                  '商标保护',
                  '用户内容版权',
                  '侵权举报流程',
                  '滥用举报的后果',
                  '法律适用',
                  '联系我们',
                ].map((item, i) => (
                  <a key={i} href={`#copyright-${i + 1}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 py-1">
                    <ArrowRight className="w-3 h-3" />
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Protection Scope */}
        <section id="copyright-1" className="py-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Shield className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">版权保护范围</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                传道AI网站的所有内容，均受中华人民共和国著作权法及国际著作权相关法律的保护。
                受版权保护的内容包括但不限于：
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  '文字内容（文章、说明、提示等）',
                  '图片、图标和图形元素',
                  '视觉设计和界面布局',
                  '源代码和程序代码',
                  '数据库结构和内容',
                  '视频、音频内容',
                  '商标、品牌名称和标识',
                  '文档和表格模板',
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Ownership */}
        <section id="copyright-2" className="py-12 bg-white dark:bg-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Copyright className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">版权归属说明</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                本网站的版权及相关权利归属情况如下：
              </p>
              <div className="space-y-4">
                {[
                  {
                    title: '网站整体内容',
                    desc: '传道AI网站整体设计、内容编排、功能架构等，由传道AI团队独立开发，版权归传道AI所有。',
                  },
                  {
                    title: '工具源代码',
                    desc: '各工具的源代码、功能逻辑、算法实现等，均为传道AI的原创开发，受著作权法保护。',
                  },
                  {
                    title: '第三方开源组件',
                    desc: '网站开发中使用的开源组件（如 Tailwind CSS、Next.js、Lucide 等），其版权归属各开源项目作者所有，我们遵守各开源协议的许可条款。',
                  },
                  {
                    title: '第三方素材',
                    desc: '如网站上使用任何第三方图片、图标或素材，我们已获得相应授权或使用符合开源协议的素材。任何第三方内容的版权仍归其原始权利人所有。',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: License */}
        <section id="copyright-3" className="py-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">许可使用范围</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                我们授权您在遵守以下条件的前提下，有限地访问和使用本网站的服务：
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  { allowed: true, text: '正常使用网站提供的所有工具' },
                  { allowed: true, text: '将工具输出结果用于个人或商业用途' },
                  { allowed: true, text: '在遵守服务条款的前提下引用公开信息' },
                  { allowed: true, text: '合理分享网站链接和工具介绍' },
                  { allowed: false, text: '复制或镜像网站整体内容' },
                  { allowed: false, text: '修改、反编译或逆向工程工具代码' },
                  { allowed: false, text: '未经授权使用品牌名称或商标' },
                  { allowed: false, text: '大规模自动化数据采集或爬取' },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border ${item.allowed ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20' : 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20'}`}>
                    {item.allowed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                    )}
                    <span className={`text-sm ${item.allowed ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300'}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    如需超出上述「允许」范围的使用，例如在商业项目中大量引用我们的工具或代码，
                    请提前联系我们获取书面授权。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Trademark */}
        <section id="copyright-4" className="py-12 bg-white dark:bg-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Shield className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">商标保护</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                以下商标是传道AI的注册商标，受法律保护，未经授权不得使用：
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {['传道AI', 'ChuanDao AI', 'openai2025.com', '网站 Logo 图形', '相关图标标识'].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 text-center text-sm font-medium text-amber-800 dark:text-amber-300">
                    {item}
                  </div>
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                任何未经授权使用上述商标的行为均构成商标侵权，我们将依法追究其法律责任。
                如需在合作或引用场景中使用我们的商标，请事先获得书面授权。
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: User Content */}
        <section id="copyright-5" className="py-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">用户内容版权</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                关于您在使用我们的服务时创建或提交的内容：
              </p>
              <div className="space-y-4">
                {[
                  {
                    title: '内容所有权',
                    desc: '您通过我们的工具处理、生成或创建的内容（如转换后的图片、加密后的字符串等），您保留对该内容的所有权。我们不对您的内容主张任何权利。',
                  },
                  {
                    title: '自动生成内容',
                    desc: '由工具自动生成的内容（如哈希值、随机密码等），您可自由使用，无需获得我们的授权。',
                  },
                  {
                    title: '数据安全',
                    desc: '绝大部&#x5206;工具采用纯客户端处理，数据不会上传到我们的服务器。请放心使用。',
                  },
                ].map((item, i) => (
                  <div key={i} className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Report Infringement */}
        <section id="copyright-6" className="py-12 bg-white dark:bg-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">侵权举报流程</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                如果您认为本网站上的任何内容侵犯了您的知识产权，请按以下步骤提交侵权举报：
              </p>

              <div className="space-y-4 mb-6">
                {[
                  {
                    step: 'Step 1',
                    title: '准备举报材料',
                    items: ['权利证明文件（如版权证书、商标注册证等）', '涉嫌侵权内容的具体描述和链接', '您的联系方式（邮箱、电话）', '您的签名或盖章的声明'],
                  },
                  {
                    step: 'Step 2',
                    title: '发送举报邮件',
                    items: ['将上述材料发送至 support@openai2025.com', '邮件标题请注明「版权侵权举报」', '请使用权利人实名举报'],
                  },
                  {
                    step: 'Step 3',
                    title: '等待处理',
                    items: ['我们会在收到完整材料后 3-5 个工作日内回复', '确认侵权后，我们将尽快移除相关内容', '如需进一步沟通，我们会在回复中告知'],
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-sm">{item.step}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                      <ul className="space-y-1">
                        {item.items.map((subItem, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <div className="w-1 h-1 rounded-full bg-slate-400 mt-2 shrink-0" />
                            {subItem}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white mb-1">侵权举报邮箱</div>
                    <a href="mailto:support@openai2025.com" className="text-blue-600 hover:underline text-sm">
                      support@openai2025.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7-9 */}
        <section className="pb-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Abuse */}
            <div id="copyright-7" className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-10 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">滥用举报的后果</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                请勿滥用侵权举报机制。如经核实您提交虚假举报材料或恶意举报：
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                {['我们保留追究您法律责任的权利', '您可能需要承担我们的合理律师费用', '恶意举报将影响您的信誉记录'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div id="copyright-8" className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-10 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">法律适用</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                本版权声明的解释和执行均适用中华人民共和国法律。
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                如有任何争议，双方应首先通过友好协商解决；协商不成的，
                提交深圳市龙华区人民法院管辖。
              </p>
            </div>

            {/* Contact */}
            <div id="copyright-9" className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-8 md:p-10 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">联系我们</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                如您对本版权声明有任何疑问，或需获取授权，请通过以下方式联系我们：
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
