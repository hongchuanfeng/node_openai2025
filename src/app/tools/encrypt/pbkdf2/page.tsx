'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Copy, Check, RefreshCw } from 'lucide-react';
import CryptoJS from 'crypto-js';

export default function PBKDF2Page() {
  const [input, setInput] = useState('');
  const [salt, setSalt] = useState('');
  const [result, setResult] = useState('');
  const [iterations, setIterations] = useState(10000);
  const [keySize, setKeySize] = useState(256);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const process = () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const s = salt || CryptoJS.lib.WordArray.random(16).toString();
      setSalt(s);
      const hash = CryptoJS.PBKDF2(input, s, {
        keySize: keySize / 32,
        iterations: iterations,
        hasher: CryptoJS.algo.SHA256
      });
      setResult(hash.toString(CryptoJS.enc.Hex));
    } catch (e) {
      setResult('哈希失败');
    } finally {
      setLoading(false);
    }
  };

  const copyResult = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generateNewSalt = () => {
    setSalt(CryptoJS.lib.WordArray.random(16).toString());
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-blue-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">PBKDF2 密钥派生</h1>
            </div>
            <p className="text-blue-100 text-lg">基于密码的密钥派生函数</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">密码</label>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="输入密码或密钥材料..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Salt (盐值)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={salt}
                    onChange={e => setSalt(e.target.value)}
                    placeholder="自动生成或手动输入..."
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                  <button
                    onClick={generateNewSalt}
                    className="px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    迭代次数：{iterations.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="1000"
                    value={iterations}
                    onChange={e => setIterations(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1000</span>
                    <span>100000</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    密钥长度：{keySize} 位
                  </label>
                  <div className="flex gap-2">
                    {[128, 256, 512].map(s => (
                      <button
                        key={s}
                        onClick={() => setKeySize(s)}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                          keySize === s ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {s}位
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={process}
                disabled={!input.trim() || loading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50"
              >
                {loading ? '计算中...' : '生成密钥'}
              </button>
            </div>

            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">派生密钥</h3>
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
                <li>• PBKDF2（Password-Based Key Derivation Function 2）</li>
                <li>• 通过多次迭代增加计算成本</li>
                <li>• 盐值防彩虹表攻击</li>
                <li>• 广泛用于加密软件和WiFi安全（WPA）</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}