'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, Hash, Upload } from 'lucide-react';

const algorithms = [
  { id: 'SHA-1', label: 'SHA-1', bits: 160 },
  { id: 'SHA-256', label: 'SHA-256', bits: 256 },
  { id: 'SHA-512', label: 'SHA-512', bits: 512 },
  { id: 'SHA-384', label: 'SHA-384', bits: 384 },
  { id: 'SHA-224', label: 'SHA-224', bits: 224 },
];

async function computeHash(input: string, alg: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  let hashBuffer: ArrayBuffer;
  switch (alg) {
    case 'SHA-1': hashBuffer = await crypto.subtle.digest('SHA-1', data); break;
    case 'SHA-256': hashBuffer = await crypto.subtle.digest('SHA-256', data); break;
    case 'SHA-512': hashBuffer = await crypto.subtle.digest('SHA-512', data); break;
    case 'SHA-384': hashBuffer = await crypto.subtle.digest('SHA-384', data); break;
    case 'SHA-224': hashBuffer = await crypto.subtle.digest('SHA-224', data); break;
    default: hashBuffer = await crypto.subtle.digest('SHA-256', data);
  }
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

const examples = [
  { input: 'hello', alg: 'SHA-256' },
  { input: '传道AI', alg: 'SHA-256' },
  { input: 'admin123', alg: 'SHA-512' },
];

export default function ShaPage() {
  const [input, setInput] = useState('');
  const [alg, setAlg] = useState('SHA-256');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ value: string; alg: string }[]>([]);

  const handleCompute = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const hash = await computeHash(input, alg);
    setResult(hash);
    setHistory(prev => [{ value: hash, alg }, ...prev.filter(h => h.value !== hash).slice(0, 9)]);
    setLoading(false);
  };

  const copyResult = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const loadExample = async (ex: typeof examples[0]) => {
    setInput(ex.input);
    setAlg(ex.alg);
    const hash = await computeHash(ex.input, ex.alg);
    setResult(hash);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-rose-600 via-pink-600 to-purple-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-pink-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Hash className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">SHA加密</h1>
            </div>
            <p className="text-pink-100 text-lg">SHA系列哈希算法，支持 SHA-1/224/256/384/512</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">输入文本</h3>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="输入要加密的文本..."
                className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none font-mono text-sm"
              />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">选择算法</h3>
              <div className="flex flex-wrap gap-2">
                {algorithms.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setAlg(a.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      alg === a.id
                        ? 'bg-pink-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {a.label} ({a.bits}位)
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={handleCompute}
                disabled={loading || !input.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all disabled:opacity-50"
              >
                {loading ? '计算中...' : '计算哈希'}
              </button>
              <button onClick={() => { setInput(''); setResult(''); }} className="py-3 px-6 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                清空
              </button>
            </div>

            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">加密结果（{alg}）</h3>
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
                      <span className="text-xs px-2 py-0.5 rounded bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 shrink-0">{h.alg}</span>
                      <code className="text-xs font-mono text-slate-500 truncate">{h.value}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">示例</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {examples.map((ex, i) => (
                  <button key={i} onClick={() => loadExample(ex)} className="text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-600 transition-colors">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{ex.alg}</div>
                    <code className="text-xs text-slate-500">{ex.input}</code>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-4">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">功能说明</h4>
              <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                <li>• SHA（Secure Hash Algorithm）是美国国家安全局设计的哈希算法</li>
                <li>• SHA-256 是最常用的版本，产生64位十六进制哈希值</li>
                <li>• 不可逆加密，无法从密文还原原文</li>
                <li>• 广泛用于数字签名、SSL/TLS证书、区块链等领域</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
