'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info, AlertTriangle, Clock } from 'lucide-react';

export default function UnixTimestampPage() {
  const [input, setInput] = useState('');
  const [currentTimestamp, setCurrentTimestamp] = useState('');
  const [result, setResult] = useState<{
    unix: string;
    iso: string;
    local: string;
    utc: string;
    relative: string;
  } | null>(null);
  const [mode, setMode] = useState<'timestamp-to-date' | 'date-to-timestamp'>('timestamp-to-date');
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('00:00:00');
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCurrentTimestamp(Math.floor(now / 1000).toString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timestampToDate = (timestamp: string) => {
    const ts = parseInt(timestamp, 10);
    if (isNaN(ts)) return null;

    const ms = ts > 9999999999 ? ts : ts * 1000;
    const date = new Date(ms);

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const absDiff = Math.abs(diff);
    let relative = '';

    if (diff > 0) {
      if (absDiff < 60000) relative = '刚刚';
      else if (absDiff < 3600000) relative = `${Math.floor(absDiff / 60000)}分钟前`;
      else if (absDiff < 86400000) relative = `${Math.floor(absDiff / 3600000)}小时前`;
      else if (absDiff < 2592000000) relative = `${Math.floor(absDiff / 86400000)}天前`;
      else relative = `${Math.floor(absDiff / 2592000000)}个月前`;
    } else {
      if (absDiff < 60000) relative = '刚刚';
      else if (absDiff < 3600000) relative = `${Math.floor(absDiff / 60000)}分钟后`;
      else if (absDiff < 86400000) relative = `${Math.floor(absDiff / 3600000)}小时后`;
      else if (absDiff < 2592000000) relative = `${Math.floor(absDiff / 86400000)}天后`;
      else relative = `${Math.floor(absDiff / 2592000000)}个月后`;
    }

    return {
      unix: Math.floor(ms / 1000).toString(),
      iso: date.toISOString(),
      local: date.toLocaleString('zh-CN'),
      utc: date.toUTCString(),
      relative,
    };
  };

  const dateToTimestamp = (dateStr: string, timeStr: string) => {
    const dateTime = new Date(`${dateStr}T${timeStr}`);
    if (isNaN(dateTime.getTime())) return null;
    return Math.floor(dateTime.getTime() / 1000).toString();
  };

  const handleConvert = () => {
    if (mode === 'timestamp-to-date') {
      if (!input.trim()) return;
      const result = timestampToDate(input.trim());
      setResult(result);
    } else {
      if (!dateInput) return;
      const timestamp = dateToTimestamp(dateInput, timeInput);
      if (timestamp) {
        setResult({
          unix: timestamp,
          iso: new Date(parseInt(timestamp) * 1000).toISOString(),
          local: new Date(parseInt(timestamp) * 1000).toLocaleString('zh-CN'),
          utc: new Date(parseInt(timestamp) * 1000).toUTCString(),
          relative: '',
        });
      }
    }
  };

  const handleCopy = async (value: string, type: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleClear = () => {
    setInput('');
    setDateInput('');
    setTimeInput('00:00:00');
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Unix时间戳转换
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Unix时间戳与日期时间之间的相互转换
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 mb-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-80 mb-1">当前时间戳（秒）</div>
                  <div className="text-4xl font-bold font-mono">{currentTimestamp}</div>
                </div>
                <button
                  onClick={() => {
                    setInput(currentTimestamp);
                    setMode('timestamp-to-date');
                  }}
                  className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
                >
                  使用当前时间
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
              <div className="flex justify-center mb-6">
                <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-700 p-1">
                  <button
                    onClick={() => { setMode('timestamp-to-date'); setResult(null); }}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      mode === 'timestamp-to-date'
                        ? 'bg-white dark:bg-slate-600 text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    时间戳 → 日期
                  </button>
                  <button
                    onClick={() => { setMode('date-to-timestamp'); setResult(null); }}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      mode === 'date-to-timestamp'
                        ? 'bg-white dark:bg-slate-600 text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    日期 → 时间戳
                  </button>
                </div>
              </div>

              {mode === 'timestamp-to-date' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                      输入时间戳（秒或毫秒）
                    </label>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="例如：1704067200 或 1704067200000"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                      选择日期
                    </label>
                    <input
                      type="date"
                      value={dateInput}
                      onChange={(e) => setDateInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                      选择时间
                    </label>
                    <input
                      type="time"
                      value={timeInput}
                      onChange={(e) => setTimeInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4 mt-6">
                <button
                  onClick={handleConvert}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  转换
                </button>
                <button
                  onClick={handleClear}
                  className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  清空
                </button>
              </div>
            </div>

            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">转换结果</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { label: 'Unix时间戳（秒）', value: result.unix, key: 'unix' },
                    { label: 'ISO 8601格式', value: result.iso, key: 'iso' },
                    { label: '本地时间', value: result.local, key: 'local' },
                    { label: 'UTC时间', value: result.utc, key: 'utc' },
                    ...(result.relative ? [{ label: '相对时间', value: result.relative, key: 'relative' }] : []),
                  ].map((item) => (
                    <div key={item.key} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-500">{item.label}</span>
                        <button
                          onClick={() => handleCopy(item.value, item.key)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          {copied === item.key ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="text-slate-900 dark:text-white font-mono text-sm break-all">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              时间戳说明
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: '秒级时间戳', desc: '10位数字，如1704067200，表示从1970年1月1日起的秒数' },
                { title: '毫秒级时间戳', desc: '13位数字，如1704067200000，表示从1970年1月1日起的毫秒数' },
                { title: '常见应用', desc: 'Unix时间戳广泛应用于编程、数据库、日志系统等领域' },
                { title: '时区说明', desc: '转换结果默认使用本地时区，可通过UTC时间换算其他时区' },
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              注意事项
            </h2>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                工具会自动识别秒级和毫秒级时间戳
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                当前时间戳每秒自动更新
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                所有转换在浏览器本地完成，不会上传数据
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
