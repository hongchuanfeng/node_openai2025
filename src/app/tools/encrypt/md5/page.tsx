'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Hash, Copy, Check } from 'lucide-react';

function md5Cycle(x: number[]): number[] {
  const s = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
  ];
  const K = Array.from({ length: 64 }, (_, i) =>
    Math.floor(Math.abs(Math.sin(i + 1) * 4294967296))
  );
  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
  const X = Array.from({ length: 16 }, (_, i) =>
    (x[i * 4] | (x[i * 4 + 1] << 8) | (x[i * 4 + 2] << 16) | (x[i * 4 + 3] << 24))
  );
  for (let i = 0; i < 64; i++) {
    let F: number, g: number;
    if (i < 16) { F = (b & c) | ((~b) & d); g = i; }
    else if (i < 32) { F = (d & b) | ((~d) & c); g = (5 * i + 1) % 16; }
    else if (i < 48) { F = b ^ c ^ d; g = (3 * i + 5) % 16; }
    else { F = c ^ (b | (~d)); g = (7 * i) % 16; }
    const temp = d; d = c; c = b;
    b = (b + (((a + F + K[i] + X[g]) << s[i]) | ((a + F + K[i] + X[g]) >>> (32 - s[i])))) >>> 0;
    a = temp;
  }
  return [a, b, c, d];
}

function md5(str: string): string {
  const utf8 = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode(parseInt(p1, 16))
  );
  const x: number[] = [];
  for (let i = 0; i < utf8.length; i++) x[i] = utf8.charCodeAt(i);
  x[utf8.length >> 2] |= 0x80 << ((utf8.length % 4) << 3);
  x[(((utf8.length + 8) >> 6) << 4) + 15] = utf8.length * 8;
  const [a, b, c, d] = md5Cycle(x);
  return [a, b, c, d].map(v => ('00000000' + v.toString(16)).slice(-8)).join('');
}

export default function MD5Page() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<{ value: string; input: string }[]>([]);

  const handleEncrypt = () => {
    if (!input.trim()) return;
    const hash = md5(input);
    setResult(hash);
    setHistory(prev => [{ value: hash, input }, ...prev.filter(h => h.value !== hash).slice(0, 9)]);
  };

  const copyResult = async () => {
    if (result) { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-blue-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Hash className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">MD5加密</h1>
            </div>
            <p className="text-blue-100 text-lg">将任意字符串转换为32位十六进制的MD5哈希值</p>
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
                className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
              />
            </div>

            <div className="flex gap-3 mb-6">
              <button onClick={handleEncrypt} disabled={!input.trim()} className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50">
                计算MD5
              </button>
              <button onClick={() => { setInput(''); setResult(''); }} className="py-3 px-6 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                清空
              </button>
            </div>

            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">MD5 哈希值</h3>
                  <button onClick={copyResult} className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${copied ? 'bg-green-100 text-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                    {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <code className="text-sm font-mono text-slate-800 dark:text-slate-200 break-all">{result}</code>
                </div>
                <div className="mt-2 text-xs text-slate-400">长度：{result.length} 字符（128位）</div>
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
                      <code className="text-xs font-mono text-slate-500 truncate">{h.input}</code>
                      <code className="text-xs font-mono text-blue-500 shrink-0">{h.value}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">示例</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { label: 'hello', val: '5d41402abc4b2a76b9719d911017c592' },
                  { label: '传道AI', val: '' },
                  { label: 'admin123', val: '0192023a3bbcdcbf76cedef798afabf8' },
                ].map((ex, i) => (
                  <button key={i} onClick={() => { setInput(ex.label); setResult(md5(ex.label)); }} className="text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{ex.label}</div>
                    <code className="text-xs text-blue-500">{ex.val || md5(ex.label)}</code>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-4">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">功能说明</h4>
              <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                <li>• MD5是一种不可逆的哈希算法，无法从哈希值还原原始数据</li>
                <li>• 相同的输入始终产生相同的MD5值</li>
                <li>• MD5已被证实存在碰撞漏洞，不建议用于安全敏感场景</li>
                <li>• 适用于数据完整性校验、密码存储等场景</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
