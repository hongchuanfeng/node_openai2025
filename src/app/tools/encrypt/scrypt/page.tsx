'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Copy, Check, RefreshCw } from 'lucide-react';
import { scrypt } from 'scrypt-js';
import CryptoJS from 'crypto-js';

export default function ScryptPage() {
  const [input, setInput] = useState('');
  const [salt, setSalt] = useState('');
  const [result, setResult] = useState('');
  const [N, setN] = useState(16384);
  const [r, setR] = useState(8);
  const [p, setP] = useState(1);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const process = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const s = salt || CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
      setSalt(s);
      
      const encoder = new TextEncoder();
      const password = encoder.encode(input);
      const saltBytes = CryptoJS.enc.Hex.parse(s).toString(CryptoJS.enc.Latin1).split('').map(c => c.charCodeAt(0));
      
      const derivedKey = await scrypt(
        password,
        new Uint8Array(saltBytes),
        N,
        r,
        p,
        32
      );
      
      const hex = Array.from(derivedKey).map(b => b.toString(16).padStart(2, '0')).join('');
      setResult(hex);
    } catch (e) {
      setResult('计算失败');
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
    setSalt(CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex));
  };

  const getMemoryEstimate = () => {
    const memory = (N * r * 128) / (1024 * 1024);
    return memory.toFixed(2);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-orange-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">scrypt 密钥派生</h1>
            </div>
            <p className="text-orange-100 text-lg">内存硬性的密钥派生函数</p>
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Salt (十六进制)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={salt}
                    onChange={e => setSalt(e.target.value)}
                    placeholder="自动生成或手动输入(十六进制)..."
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                  />
                  <button
                    onClick={generateNewSalt}
                    className="px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 mb-6">
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">参数设置</div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">N (迭代次数)</label>
                    <input
                      type="number"
                      value={N}
                      onChange={e => setN(Number(e.target.value))}
                      min="1024"
                      max="131072"
                      step="1024"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">r (块大小)</label>
                    <input
                      type="number"
                      value={r}
                      onChange={e => setR(Number(e.target.value))}
                      min="1"
                      max="32"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">p (并行度)</label>
                    <input
                      type="number"
                      value={p}
                      onChange={e => setP(Number(e.target.value))}
                      min="1"
                      max="32"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
                    />
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  预计内存使用：{getMemoryEstimate()} MB | 公式：N × r × 128 bytes
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" onChange={e => {
                    if (e.target.checked) {
                      setN(16384); setR(8); setP(1);
                    }
                  }} className="w-4 h-4 accent-orange-500" />
                  <span className="text-slate-600 dark:text-slate-400">使用推荐参数 (N=16384, r=8, p=1)</span>
                </label>
              </div>

              <button
                onClick={process}
                disabled={!input.trim() || loading}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50"
              >
                {loading ? '计算中...' : '生成密钥'}
              </button>
            </div>

            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">派生密钥 (256位)</h3>
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
                <li>• scrypt 是 Colin Percival 于2009年设计的密钥派生函数</li>
                <li>• 内存硬性，需要大量RAM才能计算</li>
                <li>• 有效防止GPU、FPGA、ASIC攻击</li>
                <li>• 适用于密码存储和密钥派生</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}