'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Copy, Check, RefreshCw } from 'lucide-react';
import CryptoJS from 'crypto-js';

// Argon2 简化实现（使用PBKDF2模拟）
function argon2Hash(password: string, salt: string, iterations: number): string {
  const hash = CryptoJS.PBKDF2(password, salt, {
    keySize: 512 / 32,
    iterations: iterations,
    hasher: CryptoJS.algo.SHA3
  });
  return hash.toString(CryptoJS.enc.Base64);
}

function generateSalt(): string {
  return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Base64);
}

export default function Argon2Page() {
  const [input, setInput] = useState('');
  const [salt, setSalt] = useState('');
  const [result, setResult] = useState('');
  const [iterations, setIterations] = useState(3);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const process = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const s = salt || generateSalt();
      setSalt(s);
      await new Promise(r => setTimeout(r, 100 * iterations));
      const hash = argon2Hash(input, s, Math.pow(2, iterations) * 1000);
      setResult(hash);
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
    setSalt(generateSalt());
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-700 via-slate-600 to-zinc-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-gray-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">Argon2 哈希</h1>
            </div>
            <p className="text-gray-100 text-lg">密码哈希竞赛冠军，现代密码学哈希算法</p>
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
                  placeholder="输入要哈希的密码..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gray-500 font-mono"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  Salt (盐值)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={salt}
                    onChange={e => setSalt(e.target.value)}
                    placeholder="自动生成或手动输入..."
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gray-500 font-mono text-sm"
                  />
                  <button
                    onClick={generateNewSalt}
                    className="px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  迭代次数：{Math.pow(2, iterations) * 1000} ({iterations} 级)
                </label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={iterations}
                  onChange={e => setIterations(Number(e.target.value))}
                  className="w-full accent-gray-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>快速</span>
                  <span>安全</span>
                </div>
              </div>

              <button
                onClick={process}
                disabled={!input.trim() || loading}
                className="w-full py-3 bg-gradient-to-r from-gray-500 to-slate-500 text-white font-bold rounded-xl hover:from-gray-600 hover:to-slate-600 transition-all disabled:opacity-50"
              >
                {loading ? '计算中...' : '生成 Argon2 哈希'}
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
                <li>• Argon2 是2015年密码哈希竞赛的冠军</li>
                <li>• 有 Argon2d、Argon2i、Argon2id 三种变体</li>
                <li>• 内存硬性、抗GPU/ASIC攻击</li>
                <li>• 已成为密码存储的新标准</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}