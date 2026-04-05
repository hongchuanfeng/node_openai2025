'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CreditCard, Search, Info } from 'lucide-react';

const provinces: Record<string, string> = {
  11: '北京市', 12: '天津市', 13: '河北省', 14: '山西省', 15: '内蒙古',
  21: '辽宁省', 22: '吉林省', 23: '黑龙江省', 31: '上海市', 32: '江苏省',
  33: '浙江省', 34: '安徽省', 35: '福建省', 36: '江西省', 37: '山东省',
  41: '河南省', 42: '湖北省', 43: '湖南省', 44: '广东省', 45: '广西壮族自治区',
  46: '海南省', 50: '重庆市', 51: '四川省', 52: '贵州省', 53: '云南省',
  54: '西藏自治区', 61: '陕西省', 62: '甘肃省', 63: '青海省', 64: '宁夏回族自治区',
  65: '新疆维吾尔自治区', 71: '台湾省', 81: '香港特别行政区', 82: '澳门特别行政区',
};

const genderMap: Record<string, string> = { '0': '女', '1': '男', '2': '女', '3': '男', '4': '女', '5': '男', '6': '男', '7': '女', '8': '男', '9': '女' };

export default function IdCardPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState('');

  const validate = () => {
    const v = input.trim();
    if (!/^\d{17}[\dXx]$/.test(v)) {
      setError('身份证号码格式不正确，应为18位数字');
      setResult(null);
      return;
    }
    setError('');
    const province = provinces[v.slice(0, 6)] || '未知';
    const birth = `${v.slice(6, 10)}年${v.slice(10, 12)}月${v.slice(12, 14)}日`;
    const gender = genderMap[v.slice(16, 17)] || '未知';
    setResult({
      '省份': province,
      '出生日期': birth,
      '性别': gender,
      '行政区代码': v.slice(0, 6),
      '出生地': province,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-purple-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">身份证查询</h1>
            </div>
            <p className="text-blue-100 text-lg">验证身份证号码，获取基本信息</p>
          </div>
        </section>

        {/* Form */}
        <section className="py-10">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">身份证号码</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="输入18位身份证号码..."
                      maxLength={18}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-mono"
                    />
                  </div>
                  <button
                    onClick={validate}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all flex items-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    查询
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}

              {result && (
                <div className="mt-6">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4">查询结果</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(result).map(([key, val]) => (
                      <div key={key} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                        <div className="text-xs text-slate-500 mb-1">{key}</div>
                        <div className="font-semibold text-slate-900 dark:text-white">{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <p>本工具仅用于身份证号码格式验证，信息仅供参考。</p>
                  <p>身份证号码前6位为行政区划代码，第7-14位为出生日期，第15-17位为顺序码，第18位为校验码。</p>
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
