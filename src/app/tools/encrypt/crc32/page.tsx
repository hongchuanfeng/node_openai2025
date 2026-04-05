'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, Hash } from 'lucide-react';

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(str: string): string {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < str.length; i++) {
    crc = (CRC32_TABLE[(crc ^ str.charCodeAt(i)) & 0xFF] ^ (crc >>> 8)) >>> 0;
  }
  return ((crc ^ 0xFFFFFFFF) >>> 0).toString(16).toUpperCase().padStart(8, '0');
}

export default function CRC32Page() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [hexOutput, setHexOutput] = useState(true);
  const [history, setHistory] = useState<string[]>([]);

  const handleCompute = () => {
    if (!input.trim()) return;
    const hash = crc32(input);
    setResult(hash);
    setHistory(prev => [hash, ...prev.filter(h => h !== hash)].slice(0, 9));
  };

  const copyResult = async () => {
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
        <section className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-cyan-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Hash className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">CRC32加密</h1>
            </div>
            <p className="text-cyan-100 text-lg">CRC32校验算法，常用于数据完整性校验</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">输入数据</h3>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="输入要计算CRC32的数据..."
                className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none font-mono text-sm"
              />
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={handleCompute}
                disabled={!input.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-teal-600 transition-all disabled:opacity-50"
              >
                计算CRC32
              </button>
              <button onClick={() => { setInput(''); setResult(''); }} className="py-3 px-6 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                清空
              </button>
            </div>

            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">CRC32 校验值</h3>
                  <button onClick={copyResult} className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${copied ? 'bg-green-100 text-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                    {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                  </button>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="text-xs text-slate-400 mb-1">HEX</div>
                    <code className="text-lg font-mono text-slate-800 dark:text-slate-200">{result}</code>
                  </div>
                  <div className="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="text-xs text-slate-400 mb-1">DEC</div>
                    <code className="text-lg font-mono text-slate-800 dark:text-slate-200">{parseInt(result, 16).toString()}</code>
                  </div>
                </div>
              </div>
            )}

            {history.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">历史记录</h3>
                  <button onClick={() => setHistory([])} className="text-xs text-slate-400 hover:text-slate-600">清空</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {history.map((h, i) => (
                    <div key={i} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-center">
                      <code className="text-xs font-mono text-cyan-600 dark:text-cyan-400">{h}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">示例</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { label: 'hello', val: '3610A686' },
                  { label: '123456', val: 'D6D1823F' },
                  { label: '传道AI', val: '' },
                ].map((ex, i) => (
                  <button key={i} onClick={() => { setInput(ex.label); setResult(crc32(ex.label)); }} className="text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-600 transition-colors">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{ex.label}</div>
                    <code className="text-xs text-cyan-500">{ex.val || crc32(ex.label)}</code>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-4">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">功能说明</h4>
              <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                <li>• CRC32（Cyclic Redundancy Check）是常用的循环冗余校验算法</li>
                <li>• 产生32位（4字节）的校验值，用于检测数据传输或存储错误</li>
                <li>• 速度快，常用于压缩文件（ZIP/RAR）、网络协议等领域</li>
                <li>• 无法加密，仅用于校验数据完整性</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
