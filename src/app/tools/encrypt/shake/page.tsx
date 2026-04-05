'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, Hash, Vibrate } from 'lucide-react';

async function shake128(input: string, outputBits: number = 256): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-3-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const bytes = Math.ceil(outputBits / 8);
  return hashArray.slice(0, bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function shake256(input: string, outputBits: number = 512): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-3-512', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const bytes = Math.ceil(outputBits / 8);
  return hashArray.slice(0, bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function ShakePage() {
  const [input, setInput] = useState('');
  const [alg, setAlg] = useState('SHAKE-128');
  const [bits, setBits] = useState(256);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCompute = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const hash = alg === 'SHAKE-128' ? await shake128(input, bits) : await shake256(input, bits);
    setResult(hash);
    setLoading(false);
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
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-700 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-violet-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Vibrate className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">Shake加密</h1>
            </div>
            <p className="text-violet-100 text-lg">SHA-3家族的可调输出长度哈希算法</p>
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
                className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none font-mono text-sm"
              />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">算法与输出长度</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">算法</label>
                  <div className="flex gap-2">
                    {['SHAKE-128', 'SHAKE-256'].map(a => (
                      <button key={a} onClick={() => { setAlg(a); setBits(a === 'SHAKE-128' ? 256 : 512); }} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${alg === a ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">输出位数：{bits}</label>
                  <input type="range" min="8" max={alg === 'SHAKE-128' ? 256 : 512} step="8" value={bits} onChange={e => setBits(Number(e.target.value))} className="w-full accent-violet-600" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <button onClick={handleCompute} disabled={loading || !input.trim()} className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all disabled:opacity-50">
                {loading ? '计算中...' : '计算哈希'}
              </button>
              <button onClick={() => { setInput(''); setResult(''); }} className="py-3 px-6 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                清空
              </button>
            </div>

            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">加密结果（{alg}-{bits}）</h3>
                  <button onClick={copyResult} className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${copied ? 'bg-green-100 text-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                    {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <code className="text-sm font-mono text-slate-800 dark:text-slate-200 break-all">{result}</code>
                </div>
                <div className="mt-2 text-xs text-slate-400">长度：{result.length} 字符（{bits}位）</div>
              </div>
            )}

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-4">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">功能说明</h4>
              <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                <li>• SHAKE 是 SHA-3 标准中定义的可扩展输出函数（XOF）</li>
                <li>• 与传统固定长度哈希不同，可以生成任意长度的输出</li>
                <li>• SHAKE-128 和 SHAKE-256 分别基于 Keccak-128 和 Keccak-256</li>
                <li>• 适用于流式加密、确定性随机数生成等场景</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
