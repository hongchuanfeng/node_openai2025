import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, AlertTriangle, Info, FileText, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '免责声明',
  description: '传道AI免责声明 - 了解使用传道AI在线工具服务时的责任与限制',
};

export default function DisclaimerPage() {
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
              <Shield className="w-4 h-4 text-blue-300" />
              <span>请在使用前仔细阅读</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              免责声明
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              感谢您使用传道AI在线工具平台。使用我们的服务即表示您已阅读、理解并同意接受本免责声明的约束。
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
                  '一般免责声明',
                  '服务准确性声明',
                  '第三方内容声明',
                  '使用限制与风险',
                  '用户责任',
                  '服务可用性',
                  '信息变更',
                  '政策更新',
                  '联系我们',
                ].map((item, i) => (
                  <a key={i} href={`#disclaimer-${i + 1}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 py-1">
                    <ArrowRight className="w-3 h-3" />
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: General Disclaimer */}
        <section id="disclaimer-1" className="py-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Shield className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">一般免责声明</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                传道AI（以下简称「我们」）在此明确声明：对于您访问或使用本网站及其提供的任何在线工具、
                服务、内容或信息，我们不承担任何形式的责任。
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                本网站及所有工具均按「原样」（AS IS）和「可用」（AS AVAILABLE）提供，
                不附带任何明示或暗示的保证，包括但不限于对适销性、特定用途适用性、
                权利或无侵权的暗示保证。
              </p>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <strong>重要提示：</strong>在使用传道AI的任何工具之前，请确保您已充分理解该工具的功能、
                    用途和局限性。因使用工具而产生的任何后果，由您自行承担。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Service Accuracy */}
        <section id="disclaimer-2" className="py-12 bg-white dark:bg-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">服务准确性声明</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                我们尽力确保网站上提供的工具和信息准确、完整和及时，但不保证以下内容：
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { icon: <XCircle className="w-4 h-4" />, text: '工具输出结果的100%准确性' },
                  { icon: <XCircle className="w-4 h-4" />, text: '信息描述与实际功能的完全一致' },
                  { icon: <XCircle className="w-4 h-4" />, text: '网站内容在任何时候都是最新版本' },
                  { icon: <XCircle className="w-4 h-4" />, text: '工具在不同环境下的兼容性表现' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                    <span className="text-red-500 shrink-0">{item.icon}</span>
                    <span className="text-sm text-red-800 dark:text-red-300">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    对于涉及重要数据处理（如加密重要文件、转换关键数据等），建议您先在非重要数据上测试，
                    确认结果符合预期后再进行正式使用。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Third-party Content */}
        <section id="disclaimer-3" className="py-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">第三方内容声明</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                本网站可能包含指向第三方网站的链接（「第三方内容」），我们对这些第三方内容不承担责任：
              </p>
              <div className="space-y-4">
                {[
                  {
                    title: '链接外部网站',
                    desc: '我们的网站可能包含指向第三方网站的链接，包括但不限于：工具中引用的外部API、版权证明中的相关链接、工具中引用的资源网站',
                  },
                  {
                    title: '第三方服务',
                    desc: '部分工具可能调用第三方服务（如天气预报API、汇率查询API等），第三方服务的准确性、可用性不在我们的控制范围内',
                  },
                  {
                    title: '第三方内容观点',
                    desc: '第三方网站上展示的观点、信息和声明，均由各自的作者或发布者负责，不代表传道AI的观点或立场',
                  },
                  {
                    title: '广告与推广',
                    desc: '我们的网站可能显示第三方广告或推广内容，我们不对广告内容的真实性、合法性或适当性负责',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
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

        {/* Section 4: Usage Limits */}
        <section id="disclaimer-4" className="py-12 bg-white dark:bg-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">使用限制与风险</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                对于因使用或无法使用本网站服务而造成的任何直接或间接损失，我们不承担责任。
                这包括但不限于以下损失类型：
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {[
                  '利润损失',
                  '收入损失',
                  '数据丢失',
                  '业务中断',
                  '预期 savings 损失',
                  '商誉损失',
                  '声誉损害',
                  '机会损失',
                  '合同损失',
                  '信息安全损失',
                  '精神损失',
                  '其他间接损失',
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-center text-sm text-red-700 dark:text-red-300">
                    {item}
                  </div>
                ))}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                上述限制适用于无论损害是基于合同、侵权（包括过失）还是其他法律理论，
                即使我们已被告知可能发生此类损害或损失。
              </p>
            </div>
          </div>
        </section>

        {/* Section 5-8 */}
        <section className="pb-12 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* User Responsibility */}
            <div id="disclaimer-5" className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-10 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">用户责任</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                您同意对自己的行为负责。在使用我们的工具时，请确保：
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  '遵守当地法律法规',
                  '不从事任何违法活动',
                  '妥善保管重要数据的备份',
                  '在使用前了解工具的功能限制',
                  '不将工具用于危害公共安全的目的',
                  '对工具输出结果进行必要的验证',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Availability */}
            <div id="disclaimer-6" className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-10 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">服务可用性</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                我们不保证服务始终可用、不中断或无错误。在法律允许的最大范围内：
              </p>
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {['我们不对因计划内或计划外的维护导致的停机负责', '我们不对因网络攻击、硬件故障等不可抗力导致的不可用负责', '我们不对因用户设备问题或网络环境问题导致的使用障碍负责', '我们保留随时修改、暂停或终止任何服务的权利'].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Information Changes */}
            <div id="disclaimer-7" className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-10 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">信息变更</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                本网站上的信息、工具和功能可能随时变更，恕不另行通知。我们会尽力保持信息的准确性，
                但不对因信息滞后或变更导致的任何不便或损失负责。工具的功能描述、界面设计和操作流程
                均以实际版本为准。
              </p>
            </div>

            {/* Policy Updates */}
            <div id="disclaimer-8" className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-10 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">政策更新</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                我们保留随时修改本免责声明的权利。修改后的声明将发布在本页面，
                并更新「最后更新日期」。对于重大变更，我们会通过网站公告通知您。
                在变更生效后继续使用我们的服务，即表示您接受修改后的声明。
                建议您定期查看本页面以了解最新信息。
              </p>
            </div>

            {/* Contact */}
            <div id="disclaimer-9" className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-8 md:p-10 border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">联系我们</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                如您对本免责声明有任何疑问，请通过以下方式联系我们：
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
