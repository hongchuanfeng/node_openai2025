'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info, AlertTriangle, Calendar, Clock } from 'lucide-react';

export default function TimeDiffPage() {
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('00:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('00:00');
  const [result, setResult] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalDays: number;
    totalHours: number;
    totalMinutes: number;
    totalSeconds: number;
  } | null>(null);

  const [copied, setCopied] = useState('');

  const calculate = () => {
    if (!startDate || !endDate) return;

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    if (end < start) {
      setResult(null);
      return;
    }

    const diff = end.getTime() - start.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setResult({
      days,
      hours,
      minutes,
      seconds,
      totalDays: diff / (1000 * 60 * 60 * 24),
      totalHours: diff / (1000 * 60 * 60),
      totalMinutes: diff / (1000 * 60),
      totalSeconds: diff / 1000,
    });
  };

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleClear = () => {
    setStartDate('');
    setStartTime('00:00');
    setEndDate('');
    setEndTime('00:00');
    setResult(null);
  };

  const setNow = () => {
    const now = new Date();
    setEndDate(now.toISOString().split('T')[0]);
    setEndTime(now.toTimeString().slice(0, 5));
  };

  const setYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setStartDate(yesterday.toISOString().split('T')[0]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              时间差计算器
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              计算两个日期时间之间的间隔，支持多种时间单位显示
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    开始时间
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">日期</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">时间</label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={setYesterday}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      设为昨天
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    结束时间
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">日期</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">时间</label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={setNow}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      设为现在
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <button
                  onClick={calculate}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  计算时间差
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
              <div className="mt-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">计算结果</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{result.days}</div>
                    <div className="text-sm text-slate-500 mt-1">天</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{result.hours}</div>
                    <div className="text-sm text-slate-500 mt-1">小时</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">{result.minutes}</div>
                    <div className="text-sm text-slate-500 mt-1">分钟</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
                    <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{result.seconds}</div>
                    <div className="text-sm text-slate-500 mt-1">秒</div>
                  </div>
                </div>

                <div className="mt-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
                  <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">总计</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: '总天数', value: result.totalDays.toFixed(2), key: 'days' },
                      { label: '总小时', value: result.totalHours.toFixed(2), key: 'hours' },
                      { label: '总分钟', value: result.totalMinutes.toFixed(0), key: 'minutes' },
                      { label: '总秒数', value: result.totalSeconds.toFixed(0), key: 'seconds' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <code className="text-sm text-blue-600 dark:text-blue-400">{item.value}</code>
                          <button
                            onClick={() => handleCopy(item.value, item.key)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            {copied === item.key ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              使用场景
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: '项目工期计算', desc: '计算项目开始到结束的准确时间' },
                { title: '工作时长统计', desc: '计算上班打卡到下班的时间间隔' },
                { title: '倒计时', desc: '计算距离某个重要日期的剩余时间' },
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
                结束时间必须晚于开始时间
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                日期格式为YYYY-MM-DD，时间格式为HH:MM
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                计算结果基于本地时区
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
