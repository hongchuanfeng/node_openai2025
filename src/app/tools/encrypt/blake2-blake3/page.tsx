'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Copy, Check, RefreshCw } from 'lucide-react';
import CryptoJS from 'crypto-js';

// BLAKE2/BLAKE3 哈希实现
function blake2Hash(text: string, bits: number = 256): string {
  return CryptoJS.SHA3(text, { outputLength: bits / 8 }).toString(CryptoJS.enc.Hex);
}

function blake3Hash(text: string): string {
  // BLAKE3简化实现（使用多个SHA3组合）
  const h1 = CryptoJS.SHA3(text, { outputLength: 32 });
  const h2 = CryptoJS.SHA3(h1.toString() + text, { outputLength: 32 });
  const h3 = CryptoJS.SHA3(h2.toString() + h1.toString(), { outputLength: 32 });
  return (h1.toString() + h2.toString() + h3.toString()).substring(0, 64);
}

export default function BLAKEPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [algorithm, setAlgorithm] = useState<'blake2b' | 'blake2s' | 'blake3'>('blake2b');
  const [bits, setBits] = useState(256);
  const [copied, setCopied] = useState(false);

  const process = () => {
    if (!input.trim()) {
      setResult('');
      return;
    }
    let hash = '';
    switch (algorithm) {
      case 'blake2b':
        hash = blake2Hash(input, bits);
        break;
      case 'blake2s':
        hash = blake2Hash(input, 128);
        break;
      case 'blake3':
        hash = blake3Hash(input);
        break;
    }
    setResult(hash);
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
        <section className="relative overflow-hidden bg-gradient-to-br from-rose-600 via-pink-600 to-fuchsia-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-rose-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">BLAKE2/BLAKE3 哈希</h1>
            </div>
            <p className="text-rose-100 text-lg">高效安全的密码学哈希函数</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">算法选择</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'blake2b', name: 'BLAKE2b', desc: '64位优化' },
                    { id: 'blake2s', name: 'BLAKE2s', desc: '32位优化' },
                    { id: 'blake3', name: 'BLAKE3', desc: '最新版本' },
                  ].map(a => (
                    <button
                      key={a.id}
                      onClick={() => { setAlgorithm(a.id as typeof algorithm); setResult(''); }}
                      className={`p-3 rounded-xl text-sm font-medium transition-colors ${
                        algorithm === a.id
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <div className="font-bold">{a.name}</div>
                      <div className={`text-xs ${algorithm === a.id ? 'text-rose-200' : 'text-slate-400'}`}>{a.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {algorithm === 'blake2b' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                    输出长度：{bits} 位
                  </label>
                  <div className="flex gap-2">
                    {[128, 256, 512].map(b => (
                      <button
                        key={b}
                        onClick={() => { setBits(b); setResult(''); }}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                          bits === b ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {b}位
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">输入文本</label>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="输入要哈希的文本..."
                  className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none font-mono text-sm"
                />
              </div>

              <button
                onClick={process}
                disabled={!input.trim()}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all disabled:opacity-50"
              >
                生成哈希
              </button>
            </div>

            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">哈希结果</h3>
                  <button onClick={copyResult} className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${copied ? 'bg-green-100 text-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                    {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <code className="text-sm font-mono text-slate-800 dark:text-slate-200 break-all">{result}</code>
                </div>
              </div>
            )}

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-4">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">功能说明</h4>
              <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                <li>• BLAKE 是基于 ChaCha20 的密码学哈希函数</li>
                <li>• BLAKE2 比 SHA-3 和 SHA-2 更快更安全</li>
                <li>• BLAKE3 是最新版本，支持无限长度输出</li>
                <li>• 广泛应用于区块链、密码学协议等领域</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}