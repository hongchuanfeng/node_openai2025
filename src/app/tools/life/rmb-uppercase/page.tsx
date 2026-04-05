'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Coins, Copy, Check } from 'lucide-react';

const units = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
const scales = ['', '拾', '佰', '仟'];
const bigUnits = ['万', '亿'];

const toChinese = (num: number): string => {
  if (num === 0) return '零元整';
  const str = Math.round(num * 100) / 100;
  const [intPart, decPart] = str.toString().split('.');
  let result = '';

  // Process integer part
  let int = intPart.replace(/\b0+/, '') || '0';
  let len = int.length;

  for (let i = 0; i < len; i++) {
    const digit = parseInt(int[i]);
    const pos = len - i - 1;
    const unit = pos % 4;
    if (digit !== 0) {
      result += units[digit] + scales[unit];
    }
    if (unit === 0 && pos > 0) {
      result += bigUnits[Math.floor(pos / 4) - 1] || '';
    }
    if (digit === 0 && (unit !== 0 || int[i + 1] === '0' || pos === 0)) {
      result += '零';
    }
  }

  result = result.replace(/零+/g, '零').replace(/零万/g, '万').replace(/零亿/g, '亿').replace(/亿万/g, '亿').replace(/零元/g, '元').replace(/^元/, '').replace(/^零/, '') || '零';
  if (result.endsWith('零')) result = result.slice(0, -1);
  result += '元';

  // Process decimal part
  if (decPart) {
    const jiao = parseInt(decPart[0] || '0');
    const fen = parseInt(decPart[1] || '0');
    if (jiao > 0) result += units[jiao] + '角';
    if (fen > 0) result += units[fen] + '分';
    if (jiao === 0 && fen === 0) result += '整';
  } else {
    result += '整';
  }

  return result;
};

export default function RmbUppercasePage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = () => {
    const num = parseFloat(input);
    if (isNaN(num) || num < 0) { setResult('请输入有效的正数金额'); return; }
    if (num > 999999999999) { setResult('金额超出范围'); return; }
    setResult(toChinese(num));
  };

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-amber-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Coins className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">人民币转大写</h1>
            </div>
            <p className="text-amber-100 text-lg">数字金额转换为中文大写，用于收据和发票</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">输入数字金额</label>
                <input
                  type="number"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && convert()}
                  placeholder="例如：123456.78"
                  className="w-full px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-2xl font-mono"
                />
              </div>

              <button
                onClick={convert}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all text-lg mb-4"
              >
                转换为大写
              </button>

              {result && (
                <div className="mt-6 p-6 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-amber-500 mb-1">大写金额</div>
                      <div className="text-2xl font-bold text-amber-700 dark:text-amber-400 font-mono">{result}</div>
                    </div>
                    <button onClick={handleCopy} className={`flex items-center gap-1 text-sm px-4 py-2 rounded-lg transition-colors ${copied ? 'text-green-600' : 'text-slate-500 hover:text-slate-700'}`}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? '已复制' : '复制'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Examples */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { num: '1000.50', result: '壹仟元伍角整' },
                { num: '88888.88', result: '捌万捌仟捌佰捌拾捌元捌角捌分' },
                { num: '9999999', result: '玖佰玖拾玖万玖仟玖佰玖拾玖元整' },
              ].map((ex, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(ex.num); convert(); }}
                  className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow text-left"
                >
                  <div className="text-xs text-slate-400 mb-1">示例</div>
                  <div className="font-mono font-semibold text-slate-900 dark:text-white text-lg">¥{ex.num}</div>
                  <div className="text-xs text-amber-600 mt-1 truncate">{ex.result}</div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
