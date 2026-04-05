'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Copy, Check, RefreshCw } from 'lucide-react';
import bcrypt from 'bcryptjs';

export default function BcryptPage() {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<'hash' | 'verify'>('hash');
  const [rounds, setRounds] = useState(10);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const process = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      if (mode === 'hash') {
        const hashed = await bcrypt.hash(input, rounds);
        setResult(hashed);
      } else {
        if (!hash.trim()) return;
        const isValid = await bcrypt.compare(input, hash);
        setResult(isValid ? '✓ 验证成功' : '✗ 验证失败');
      }
    } catch (e) {
      setResult('操作失败');
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

  const generateRandom = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 16; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setInput(pass);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-emerald-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">bcrypt 哈希</h1>
            </div>
            <p className="text-emerald-100 text-lg">密码哈希算法，专为密码存储设计</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="flex gap-2 mb-6">
                {(['hash', 'verify'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setResult(''); }}
                    className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                      mode === m ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {m === 'hash' ? '🔐 生成哈希' : '✓ 验证密码'}
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  {mode === 'hash' ? '密码' : '待验证密码'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={mode === 'hash' ? '输入密码...' : '输入要验证的密码...'}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                  {mode === 'hash' && (
                    <button
                      onClick={generateRandom}
                      className="px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {mode === 'hash' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    计算轮数：{rounds} (2^{rounds} = {Math.pow(2, rounds)} 次迭代)
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="14"
                    value={rounds}
                    onChange={e => setRounds(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>快速 (4)</span>
                    <span>安全 (14)</span>
                  </div>
                </div>
              )}

              {mode === 'verify' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">哈希值</label>
                  <textarea
                    value={hash}
                    onChange={e => setHash(e.target.value)}
                    placeholder="粘贴之前生成的bcrypt哈希值..."
                    className="w-full h-20 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-mono text-xs"
                  />
                </div>
              )}

              <button
                onClick={process}
                disabled={!input.trim() || loading}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all disabled:opacity-50"
              >
                {loading ? '处理中...' : mode === 'hash' ? '生成哈希' : '验证密码'}
              </button>
            </div>

            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {mode === 'hash' ? '哈希结果' : '验证结果'}
                  </h3>
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
                <li>• bcrypt 是专门为密码哈希设计的算法</li>
                <li>• 内置盐值，防彩虹表攻击</li>
                <li>• 可通过轮数参数调整计算成本</li>
                <li>• 轮数每增加1，计算时间翻倍，建议 10-12 轮</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}