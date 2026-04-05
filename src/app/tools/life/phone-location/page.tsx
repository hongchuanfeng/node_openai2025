'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Smartphone, Search } from 'lucide-react';

const phoneData: Record<string, { operator: string; region: string; city: string; type: string }> = {
  '134': { operator: '中国移动', region: '广东', city: '深圳', type: 'GSM' },
  '135': { operator: '中国移动', region: '广东', city: '广州', type: 'GSM' },
  '136': { operator: '中国移动', region: '北京', city: '北京', type: 'GSM' },
  '137': { operator: '中国移动', region: '上海', city: '上海', type: 'GSM' },
  '138': { operator: '中国移动', region: '江苏', city: '南京', type: 'GSM' },
  '139': { operator: '中国移动', region: '浙江', city: '杭州', type: 'GSM' },
  '147': { operator: '中国移动', region: '广东', city: '广州', type: 'TD-LTE' },
  '150': { operator: '中国移动', region: '北京', city: '北京', type: 'GSM' },
  '151': { operator: '中国移动', region: '天津', city: '天津', type: 'GSM' },
  '152': { operator: '中国移动', region: '河北', city: '石家庄', type: 'GSM' },
  '186': { operator: '中国联通', region: '北京', city: '北京', type: 'WCDMA' },
  '187': { operator: '中国联通', region: '上海', city: '上海', type: 'WCDMA' },
  '188': { operator: '中国电信', region: '广东', city: '广州', type: 'CDMA' },
  '189': { operator: '中国电信', region: '上海', city: '上海', type: 'CDMA' },
  '199': { operator: '中国电信', region: '北京', city: '北京', type: '4G' },
};

export default function PhoneLocationPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<typeof phoneData[string] | null>(null);

  const lookup = () => {
    const phone = input.trim();
    if (!phone) return;
    const prefix = phone.slice(0, 3);
    setResult(phoneData[prefix] || { operator: '未知运营商', region: '未知地区', city: '未知城市', type: '未知' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-purple-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Smartphone className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">手机号归属地查询</h1>
            </div>
            <p className="text-violet-100 text-lg">查询手机号段归属地和运营商</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">输入手机号</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && lookup()}
                      placeholder="请输入手机号（至少前3位）"
                      maxLength={11}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 text-lg font-mono"
                    />
                  </div>
                  <button onClick={lookup} className="px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    查询
                  </button>
                </div>
              </div>

              {result && (
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {[
                    { label: '运营商', value: result.operator },
                    { label: '归属地区', value: result.region },
                    { label: '城市', value: result.city },
                    { label: '网络类型', value: result.type },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
                      <div className="text-xs text-slate-500 mb-1">{item.label}</div>
                      <div className="font-semibold text-slate-900 dark:text-white">{item.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-violet-50 dark:bg-violet-900/20 rounded-2xl border border-violet-100 dark:border-violet-900/20 p-4">
              <p className="text-sm text-violet-800 dark:text-violet-300">
                💡 提示：本工具根据手机号前3位号段判断运营商和归属地，结果仅供参考。实际归属地以运营商数据为准。
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
