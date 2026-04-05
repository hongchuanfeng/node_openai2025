'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info, AlertTriangle, Calculator } from 'lucide-react';

type Base = 2 | 8 | 10 | 16 | 32 | 36 | 58 | 62 | 64;

const baseNames: Record<Base, string> = {
  2: '二进制',
  8: '八进制',
  10: '十进制',
  16: '十六进制',
  32: '32进制',
  36: '36进制',
  58: '58进制',
  62: '62进制',
  64: '64进制',
};

const baseChars: Record<Base, string> = {
  2: '01',
  8: '01234567',
  10: '0123456789',
  16: '0123456789ABCDEF',
  32: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  36: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  58: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
  62: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  64: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
};

export default function BaseConvertPage() {
  const [input, setInput] = useState('255');
  const [fromBase, setFromBase] = useState<Base>(10);
  const [toBase, setToBase] = useState<Base>(16);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const isValidChar = (char: string, base: Base): boolean => {
    const chars = baseChars[base].toUpperCase();
    return chars.includes(char.toUpperCase());
  };

  const charToValue = (char: string, base: Base): number => {
    const chars = baseChars[base].toUpperCase();
    const upperChar = char.toUpperCase();
    return chars.indexOf(upperChar);
  };

  const valueToChar = (value: number, base: Base): string => {
    return baseChars[base][value] || '';
  };

  const convert = () => {
    if (!input.trim()) {
      setResult('');
      setError('');
      return;
    }

    setError('');
    try {
      const decimal = parseToDecimal(input, fromBase);
      if (decimal === null) {
        setError(`无效的${baseNames[fromBase]}格式`);
        setResult('');
        return;
      }
      const converted = decimalToBase(decimal, toBase);
      setResult(converted);
    } catch (err) {
      setError('转换错误');
      setResult('');
    }
  };

  const parseToDecimal = (str: string, base: Base): number | null => {
    const chars = str.toUpperCase().split('');
    for (const char of chars) {
      if (!isValidChar(char, base)) {
        return null;
      }
    }
    return parseInt(str, base);
  };

  const decimalToBase = (decimal: number, base: Base): string => {
    if (decimal === 0) return '0';
    let num = Math.abs(decimal);
    let result = '';
    while (num > 0) {
      result = valueToChar(num % base, base) + result;
      num = Math.floor(num / base);
    }
    return decimal < 0 ? '-' + result : result;
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setResult('');
    setError('');
  };

  const handleSwap = () => {
    const tempBase = fromBase;
    setFromBase(toBase);
    setToBase(tempBase);
    setInput(result);
    setResult('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              全进制转换工具
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              支持2进制到64进制之间的任意进制数字转换
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    输入数值
                  </label>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="请输入数字..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    {baseNames[fromBase]} ({fromBase}进制)
                  </label>
                  <select
                    value={fromBase}
                    onChange={(e) => setFromBase(Number(e.target.value) as Base)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {(Object.keys(baseNames) as unknown as Base[]).map((base) => (
                      <option key={base} value={base}>
                        {baseNames[base]} ({base}进制)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <button
                  onClick={handleSwap}
                  className="px-6 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  交换源/目标进制
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  {baseNames[toBase]} ({toBase}进制)
                </label>
                <select
                  value={toBase}
                  onChange={(e) => setToBase(Number(e.target.value) as Base)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {(Object.keys(baseNames) as unknown as Base[]).map((base) => (
                    <option key={base} value={base}>
                      {baseNames[base]} ({base}进制)
                    </option>
                  ))}
                </select>
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

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-8">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    转换结果
                  </h3>
                  <button
                    onClick={handleCopy}
                    className={`text-sm flex items-center gap-1 transition-colors ${
                      copied ? 'text-green-600' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                  </button>
                </div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 font-mono">
                  {result}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              常用进制转换示例
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { title: '二进制', from: '11111111', to: '255', base: 2 },
                { title: '十六进制', from: 'FF', to: '255', base: 16 },
                { title: '八进制', from: '377', to: '255', base: 8 },
                { title: '十进制', from: '255', to: 'FF', base: 10 },
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                    <div>{item.base === 10 ? '十进制' : '二进制'}: {item.from}</div>
                    <div>转换结果: <span className="text-blue-600">{item.to}</span></div>
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
                支持2进制到64进制之间的任意进制转换
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                不同进制使用不同的字符集，请确保输入包含有效的字符
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                点击交换按钮可以快速切换源和目标进制
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
