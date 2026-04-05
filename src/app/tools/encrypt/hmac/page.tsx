'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, Key } from 'lucide-react';
import CryptoJS from 'crypto-js';

const algorithms = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512'];

export default function HMACPage() {
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [alg, setAlg] = useState('SHA-256');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<{ value: string; alg: string; input: string }[]>([]);

  const computeHMAC = () => {
    if (!input.trim()) return;
    const wordArray = CryptoJS.HmacMD5 ? CryptoJS.HmacMD5(input, key) : CryptoJS.HmacSHA256(input, key);
    let hash: string;
    switch (alg) {
      case 'MD5': hash = CryptoJS.HmacMD5(input, key).toString(); break;
      case 'SHA-1': hash = CryptoJS.HmacSHA1(input, key).toString(); break;
      case 'SHA-256': hash = CryptoJS.HmacSHA256(input, key).toString(); break;
      case 'SHA-512': hash = CryptoJS.HmacSHA512(input, key).toString(); break;
      default: hash = CryptoJS.HmacSHA256(input, key).toString();
    }
    setResult(hash);
    setHistory(prev => [{ value: hash, alg, input }, ...prev.filter(h => h.value !== hash).slice(0, 9)]);
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
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-blue-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Key className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">HMAC在线加密</h1>
            </div>
            <p className="text-blue-100 text-lg">基于密钥的消息认证码，支持多种哈希算法</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">输入消息</h3>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="输入要加密的消息..."
                className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
              />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">密钥</h3>
              <input
                type="text"
                value={key}
                onChange={e => setKey(e.target.value)}
                placeholder="输入密钥..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">选择哈希算法</h3>
              <div className="flex flex-wrap gap-2">
                {algorithms.map(a => (
                  <button key={a} onClick={() => setAlg(a)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${alg === a ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                    HMAC-{a}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <button onClick={computeHMAC} disabled={!input.trim()} className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50">
                计算HMAC
              </button>
              <button onClick={() => { setInput(''); setKey(''); setResult(''); }} className="py-3 px-6 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                清空
              </button>
            </div>

            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">HMAC-{alg} 结果</h3>
                  <button onClick={copyResult} className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${copied ? 'bg-green-100 text-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                    {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <code className="text-sm font-mono text-slate-800 dark:text-slate-200 break-all">{result}</code>
                </div>
                <div className="mt-2 text-xs text-slate-400">长度：{result.length} 字符</div>
              </div>
            )}

            {history.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">历史记录</h3>
                  <button onClick={() => setHistory([])} className="text-xs text-slate-400 hover:text-slate-600">清空</button>
                </div>
                <div className="space-y-2">
                  {history.map((h, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center gap-3">
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0">{h.alg}</span>
                      <code className="text-xs font-mono text-slate-500 truncate">{h.value}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-4">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">功能说明</h4>
              <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                <li>• HMAC（Hash-based Message Authentication Code）是带密钥的消息认证码</li>
                <li>• 需要同时知道密钥和消息才能生成或验证HMAC值</li>
                <li>• 比普通哈希多了密钥参数，安全性更高</li>
                <li>• 常用于API签名、消息完整性验证等场景</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
