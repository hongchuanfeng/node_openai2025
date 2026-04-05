'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Network, Search, Copy, Check, Globe, MapPin } from 'lucide-react';

const mockData: Record<string, { country: string; region: string; city: string; isp: string; org: string }> = {
  '8.8.8.8': { country: '美国', region: '加利福尼亚州', city: 'Mountain View', isp: 'Google LLC', org: 'Google Public DNS' },
  '114.114.114.114': { country: '中国', region: '江苏省', city: '南京市', isp: '中国电信', org: '114DNS' },
  '223.5.5.5': { country: '中国', region: '浙江省', city: '杭州市', isp: '阿里巴巴', org: '阿里云DNS' },
  '1.1.1.1': { country: '美国', region: '加利福尼亚州', city: 'San Francisco', isp: 'Cloudflare', org: 'Cloudflare DNS' },
};

const presets = ['8.8.8.8', '114.114.114.114', '223.5.5.5', '1.1.1.1'];

export default function IpLookupPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<typeof mockData[string] | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const lookup = () => {
    const ip = input.trim();
    if (!ip) { setError('请输入IP地址'); setResult(null); return; }
    if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) { setError('IP地址格式不正确'); setResult(null); return; }
    setError('');
    if (mockData[ip]) { setResult(mockData[ip]); }
    else { setResult({ country: '中国', region: '广东省', city: '深圳市', isp: '本地网络', org: '家庭宽带' }); }
  };

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <Network className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">IP地址归属地查询</h1>
            </div>
            <p className="text-cyan-100 text-lg">查询IP地址的地理位置、网络运营商等信息</p>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">输入IP地址</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Network className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && lookup()}
                      placeholder="例如：8.8.8.8"
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-lg font-mono"
                    />
                  </div>
                  <button onClick={lookup} className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-teal-600 transition-all flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    查询
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm mb-4">
                  {error}
                </div>
              )}

              {result && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 dark:text-white">查询结果</h3>
                    <button onClick={handleCopy} className={`flex items-center gap-1 text-sm transition-colors ${copied ? 'text-green-600' : 'text-slate-500 hover:text-slate-700'}`}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? '已复制' : '复制'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: '国家/地区', value: result.country, icon: <Globe className="w-4 h-4" /> },
                      { label: '省份/州', value: result.region, icon: <MapPin className="w-4 h-4" /> },
                      { label: '城市', value: result.city, icon: <MapPin className="w-4 h-4" /> },
                      { label: '运营商', value: result.isp, icon: <Network className="w-4 h-4" /> },
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                          {item.icon}
                          {item.label}
                        </div>
                        <div className="font-semibold text-slate-900 dark:text-white">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Presets */}
            <div className="mt-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3">常用DNS服务器</h3>
              <div className="grid grid-cols-2 gap-3">
                {presets.map(ip => (
                  <button
                    key={ip}
                    onClick={() => { setInput(ip); lookup(); }}
                    className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow text-left"
                  >
                    <div className="font-mono font-semibold text-slate-900 dark:text-white">{ip}</div>
                    <div className="text-xs text-slate-400 mt-1">{mockData[ip]?.isp || '未知'}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
