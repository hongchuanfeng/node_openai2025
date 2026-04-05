'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info, AlertTriangle, Database } from 'lucide-react';

type Unit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB';

const units: Unit[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
const multipliers: Record<Unit, number> = {
  'B': 1,
  'KB': 1024,
  'MB': 1024 * 1024,
  'GB': 1024 * 1024 * 1024,
  'TB': 1024 * 1024 * 1024 * 1024,
  'PB': 1024 * 1024 * 1024 * 1024 * 1024,
};

export default function DataSizePage() {
  const [input, setInput] = useState('');
  const [fromUnit, setFromUnit] = useState<Unit>('MB');
  const [results, setResults] = useState<Record<Unit, string>>({
    'B': '',
    'KB': '',
    'MB': '',
    'GB': '',
    'TB': '',
    'PB': '',
  });
  const [copied, setCopied] = useState('');

  const convert = () => {
    if (!input.trim()) {
      setResults({
        'B': '', 'KB': '', 'MB': '', 'GB': '', 'TB': '', 'PB': ''
      });
      return;
    }

    const value = parseFloat(input);
    if (isNaN(value)) return;

    const bytes = value * multipliers[fromUnit];
    const newResults: Record<Unit, string> = {
      'B': '',
      'KB': '',
      'MB': '',
      'GB': '',
      'TB': '',
      'PB': '',
    };

    for (const unit of units) {
      const converted = bytes / multipliers[unit];
      if (converted >= 0.0001 || unit === 'B') {
        newResults[unit] = formatNumber(converted);
      }
    }

    setResults(newResults);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return num.toLocaleString('zh-CN', { maximumFractionDigits: 0 });
    } else if (num >= 1) {
      return num.toLocaleString('zh-CN', { maximumFractionDigits: 2 });
    } else if (num >= 0.0001) {
      return num.toLocaleString('zh-CN', { maximumFractionDigits: 6 });
    } else {
      return num.toExponential(4);
    }
  };

  const handleCopy = async (value: string, unit: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(unit);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleClear = () => {
    setInput('');
    setResults({
      'B': '', 'KB': '', 'MB': '', 'GB': '', 'TB': '', 'PB': ''
    });
  };

  const handleSwap = (unit: Unit) => {
    const value = results[unit];
    if (value) {
      setInput(value);
      setFromUnit(unit);
      const bytes = parseFloat(value) * multipliers[unit];
      const newResults: Record<Unit, string> = {
        'B': '', 'KB': '', 'MB': '', 'GB': '', 'TB': '', 'PB': ''
      };
      for (const u of units) {
        const converted = bytes / multipliers[u];
        if (converted >= 0.0001 || u === 'B') {
          newResults[u] = formatNumber(converted);
        }
      }
      setResults(newResults);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              数据大小转换工具
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              字节(B)、KB、MB、GB、TB、PB之间的相互转换
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">输入数值</label>
                  <input
                    type="number"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="请输入数值..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-sm text-slate-600 dark:text-slate-400 mb-2">单位</label>
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value as Unit)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {units.map((unit) => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={convert}
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

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {units.map((unit) => (
                <div
                  key={unit}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {unit}
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSwap(unit)}
                        className="text-xs text-blue-600 hover:text-blue-700"
                        title="设为输入值"
                      >
                        交换
                      </button>
                      {results[unit] && (
                        <button
                          onClick={() => handleCopy(results[unit], unit)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          {copied === unit ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                    {results[unit] || '-'}
                  </div>
                </div>
              ))}
            </div>

            {input && (
              <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">转换公式</h3>
                <div className="space-y-2 text-slate-600 dark:text-slate-400 font-mono text-sm">
                  <div>1 KB = 1,024 B</div>
                  <div>1 MB = 1,024 KB = 1,048,576 B</div>
                  <div>1 GB = 1,024 MB = 1,073,741,824 B</div>
                  <div>1 TB = 1,024 GB = 1,099,511,627,776 B</div>
                  <div>1 PB = 1,024 TB = 1,125,899,906,842,624 B</div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              常见换算
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { from: '1', unit: 'MB', to: '1024 KB' },
                { from: '1', unit: 'GB', to: '1024 MB' },
                { from: '1', unit: 'MB', to: '1048576 B' },
                { from: '1', unit: 'GB', to: '1073741824 B' },
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {item.from} {item.unit}
                  </div>
                  <div className="text-slate-500 mt-1">=</div>
                  <div className="text-lg text-slate-700 dark:text-slate-300">
                    {item.to}
                  </div>
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
                本工具使用二进制换算（1024进制），常用于计算机存储计算
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                部分厂商使用十进制换算（1000进制），这会导致标称容量与实际容量有差异
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                点击"交换"按钮可以将该单位设为主单位进行转换
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
