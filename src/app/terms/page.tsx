import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, AlertTriangle, Copyright, Shield, Globe, Scale, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '服务条款',
  description: '传道AI服务条款 - 使用我们的在线工具服务前，请仔细阅读以下条款和条件',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 py-24 md:py-32">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-pink-300 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8">
              <Scale className="w-4 h-4 text-blue-300" />
              <span>使用前请仔细阅读</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              服务条款
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              感谢您使用传道AI在线工具平台。使用我们的服务即表示您同意以下条款和条件。
              请在使用前仔细阅读，了解您的权利和义务。
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
                  '服务说明',
                  '服务使用规则',
                  '用户行为规范',
                  '知识产权',
                  '服务变更与终止',
                  '免责声明',
                  '责任限制',
                  '赔偿条款',
                  '法律适用与争议解决',
                  '联系我们',
                ].map((item, i) => (
                  <a key={i} href={`#terms-${i + 1}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 py-1">
                    <ArrowRight className="w-3 h-3" />
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Service Description */}
        <section id="terms-1" className="py-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Globe className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">服务说明</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                传道AI（以下简称「我们」或「平台」）向您提供在线工具服务，包括但不限于：
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {['生活工具', '图片处理工具', '加密解密工具', '编码解码工具', '开发工具', '其他在线工具'].map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 text-center text-sm text-slate-700 dark:text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                我们保留随时修改、暂停或终止任何服务的权利，恕不另行通知。
                我们会尽力保证服务的连续性和稳定性，但不对服务的中断承担任何责任。
              </p>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>免费使用：</strong>传道AI承诺大部分工具永久免费使用，无需注册账号，
                    打开浏览器即可使用全部免费工具。部分高级功能可能需要付费，我们会在相关页面明确标注。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Service Usage Rules */}
        <section id="terms-2" className="py-12 bg-white dark:bg-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Shield className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">服务使用规则</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                使用我们的服务即表示您同意遵守以下规则：
              </p>
              <div className="space-y-3">
                {[
                  { title: '合法使用', desc: '遵守所有适用的法律法规，不得利用服务从事任何违法活动' },
                  { title: '正当用途', desc: '将服务用于正当目的，不得用于欺诈、骚扰、诽谤或其他不当用途' },
                  { title: '安全操作', desc: '不得尝试破解、攻击、入侵、干扰或滥用我们的服务或相关系统' },
                  { title: '资源保护', desc: '不得以任何方式耗尽我们的网络带宽或服务器资源' },
                  { title: '账户安全', desc: '如需注册账户，应妥善保管账户信息，对账户下的所有活动负责' },
                  { title: '尊重他人', desc: '尊重他人的权利和隐私，不得侵犯任何第三方的合法权益' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-0.5">{item.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Prohibited Content */}
        <section id="terms-3" className="py-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">禁止行为</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                以下行为被严格禁止，违反者将被立即终止服务并可能面临法律追究：
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  '上传或传播恶意软件、病毒或任何有害代码',
                  '未经授权访问他人账户或系统',
                  '进行任何形式的网络攻击或DDoS攻击',
                  '传播儿童不宜内容或任何非法内容',
                  '侵犯他人知识产权或商业秘密',
                  '进行欺诈活动或诈骗行为',
                  '骚扰、威胁或诽谤他人',
                  '大规模自动化抓取或数据采集',
                  '创建虚假账户或进行身份伪装',
                  '干扰平台正常运营的其他行为',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                    <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      ✕
                    </div>
                    <span className="text-sm text-red-800 dark:text-red-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: IP */}
        <section id="terms-4" className="py-12 bg-white dark:bg-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Copyright className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">知识产权</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                传道AI平台上所有内容、设计、代码、商标等均受知识产权法律保护，未经授权不得使用。
              </p>
              <div className="space-y-4">
                {[
                  {
                    title: '平台内容',
                    desc: '我们的网站设计、布局、界面元素、图标、Logo、品牌名称「传道AI」及相关标识均为我们的财产，受版权法和商标法保护。',
                  },
                  {
                    title: '工具代码',
                    desc: '各工具的源代码、功能逻辑、算法实现等均为我们的知识产权，未经授权不得复制、反编译或进行逆向工程。',
                  },
                  {
                    title: '用户内容',
                    desc: '您在使用工具时输入或上传的内容（如需要服务器处理的场景），您保留该内容的知识产权。我们不会对您的内容主张任何权利。',
                  },
                  {
                    title: '授权使用',
                    desc: '您可以正常使用平台提供的工具和服务，以及合理引用公开信息。超出合理使用范围的使用需事先获得我们的书面授权。',
                  },
                ].map((item, i) => (
                  <div key={i} className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 5-8 */}
        <section className="py-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Service Changes */}
            <div id="terms-5" className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-10 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">服务变更与终止</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                我们保留随时修改、暂停或终止服务的权利，包括但不限于：
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300 mb-4">
                {['修改或调整任何工具的功能和特性', '暂时或永久停止提供某些工具或服务', '调整服务的定价（如适用）', '限制某些功能的使用频率或使用量'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                对于服务的重大变更，我们会尽可能提前通知用户。对于付费服务，我们会遵守相关退款政策。
                用户也可以随时停止使用我们的服务，无需特别通知。
              </p>
            </div>

            {/* Disclaimer */}
            <div id="terms-6" className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-10 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">免责声明</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                我们的服务按「原样」（AS IS）和「可用」（AS AVAILABLE）提供，不提供任何明示或暗示的保证。
                在法律允许的最大范围内：
              </p>
              <div className="space-y-3 mb-4">
                {[
                  '我们不对服务的准确性、完整性、可靠性做任何保证',
                  '我们不对工具输出的结果做任何保证，包括但不限于计算结果的准确性',
                  '我们不对服务在任何特定用途下的适用性做任何保证',
                  '我们不对第三方服务的可用性和可靠性承担责任',
                  '我们不对因使用服务而造成的任何直接或间接损失承担责任',
                  '我们不对因服务中断、数据丢失而造成的任何损失承担责任',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                    <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                某些司法管辖区不允许排除默示保证或限制责任，上述限制可能对您不适用。
              </p>
            </div>

            {/* Limitation of Liability */}
            <div id="terms-7" className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-10 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">责任限制</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                在适用法律允许的最大范围内，我们对您使用我们的服务所产生的任何损害承担的责任，
                不超过您在过去十二个月内为我们服务支付的金额（如有）。
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                我们特别不对以下损失承担责任：利润损失、收入损失、数据丢失、业务中断、预期 savings 损失、
                商誉损失、声誉损害等，无论这些损失是否由合同、侵权或其他原因引起，即使我们已被告知可能发生此类损失。
              </p>
            </div>

            {/* Indemnification */}
            <div id="terms-8" className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-10 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">赔偿条款</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                您同意赔偿、辩护并使我们（包括我们的关联方、许可方、服务提供商、董事、员工和代理人）
                免受因以下原因而产生或相关的任何索赔、诉讼、要求、损害、损失、责任和费用（包括合理的律师费）：
              </p>
              <ul className="mt-4 space-y-2 text-slate-600 dark:text-slate-300">
                {['您违反本服务条款或任何适用法律', '您滥用或不当使用我们的服务', '您侵犯任何第三方的权利', '您提交的内容或数据导致的索赔'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Applicable Law */}
            <div id="terms-9" className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-10 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">法律适用与争议解决</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                本服务条款受中华人民共和国法律管辖，并按其解释。
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                因本服务条款引起的或与之相关的任何争议，双方应首先通过友好协商解决。
                如协商不成，任何一方可将争议提交至深圳市龙华区人民法院管辖。
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                本条款不影响消费者根据适用法律享有的法定权利。
              </p>
            </div>

            {/* Contact */}
            <div id="terms-10" className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-8 md:p-10 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">联系我们</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                如您对本服务条款有任何疑问，请通过以下方式联系我们：
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
