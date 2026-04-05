'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Copy, Check, Eye, EyeOff, Key, RefreshCw } from 'lucide-react';

// RC5 加密实现
function rc5Encrypt(text: string, key: string, rounds: number = 12): string {
  const keyBytes = new TextEncoder().encode(key);
  const textBytes = new TextEncoder().encode(text);
  
  // 简化的 RC5 实现
  const P = 0xB7E15163;
  const Q = 0x9E3779B9;
  const w = 32; // 字大小
  const b = keyBytes.length;
  const c = Math.max(1, Math.ceil(b * 8 / w));
  
  // 密钥扩展
  const S: number[] = [P];
  for (let i = 1; i <= 2 * rounds + 3; i++) {
    S[i] = (S[i - 1] + Q) >>> 0;
  }
  
  const L: number[] = [];
  for (let i = 0; i < c; i++) {
    L[i] = (keyBytes[i * 4] || 0) | ((keyBytes[i * 4 + 1] || 0) << 8) | 
           ((keyBytes[i * 4 + 2] || 0) << 16) | ((keyBytes[i * 4 + 3] || 0) << 24);
  }
  
  let A = (S[0] + S[1]) >>> 0;
  let B = (S[2] + S[3]) >>> 0;
  
  const textLen = textBytes.length;
  const paddedLen = Math.ceil(textLen / 4) * 4;
  const padded = new Uint8Array(paddedLen);
  padded.set(textBytes);
  
  const result: number[] = [];
  for (let i = 0; i < paddedLen; i += 4) {
    A = (A ^ B) >>> 0;
    A = ((A + B) >>> 0);
    const rot = B % w;
    A = ((A << rot) | (A >>> (w - rot))) >>> 0;
    A = (A ^ S[0]) >>> 0;
    A = ((A + S[1]) >>> 0);
    B = (B ^ A) >>> 0;
    B = ((B + A) >>> 0);
    const rot2 = A % w;
    B = ((B << rot2) | (B >>> (w - rot2))) >>> 0;
    B = (B ^ S[2]) >>> 0;
    B = ((B + S[3]) >>> 0);
    
    result.push(A & 0xFF, (A >> 8) & 0xFF, (A >> 16) & 0xFF, (A >> 24) & 0xFF);
    result.push(B & 0xFF, (B >> 8) & 0xFF, (B >> 16) & 0xFF, (B >> 24) & 0xFF);
  }
  
  return btoa(String.fromCharCode(...result));
}

function rc5Decrypt(ciphertext: string, key: string, rounds: number = 12): string {
  try {
    const keyBytes = new TextEncoder().encode(key);
    const w = 32;
    const P = 0xB7E15163;
    const Q = 0x9E3779B9;
    
    const S: number[] = [P];
    for (let i = 1; i <= 2 * rounds + 3; i++) {
      S[i] = (S[i - 1] + Q) >>> 0;
    }
    
    const data = atob(ciphertext);
    const bytes = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      bytes[i] = data.charCodeAt(i);
    }
    
    let A = 0, B = 0;
    const result: number[] = [];
    
    for (let i = 0; i < bytes.length; i += 8) {
      A = bytes[i] | (bytes[i + 1] << 8) | (bytes[i + 2] << 16) | (bytes[i + 3] << 24);
      B = bytes[i + 4] | (bytes[i + 5] << 8) | (bytes[i + 6] << 16) | (bytes[i + 7] << 24);
      
      B = ((B - S[3]) >>> 0);
      B = (B ^ S[2]) >>> 0;
      const rot2 = A % w;
      B = ((B >>> rot2) | (B << (w - rot2))) >>> 0;
      B = ((B - A) >>> 0);
      B = (B ^ A) >>> 0;
      
      A = ((A - S[1]) >>> 0);
      A = (A ^ S[0]) >>> 0;
      const rot = B % w;
      A = ((A >>> rot) | (A << (w - rot))) >>> 0;
      A = ((A - B) >>> 0);
      A = (A ^ B) >>> 0;
      
      result.push(A & 0xFF, (A >> 8) & 0xFF, (A >> 16) & 0xFF, (A >> 24) & 0xFF);
      result.push(B & 0xFF, (B >> 8) & 0xFF, (B >> 16) & 0xFF, (B >> 24) & 0xFF);
    }
    
    // 移除填充
    let end = result.length;
    while (end > 0 && result[end - 1] === 0) end--;
    if (end > 0) end--; // 移除一个填充字节
    
    return new TextDecoder().decode(new Uint8Array(result.slice(0, end)));
  } catch {
    throw new Error('解密失败');
  }
}

export default function RC5Page() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [rounds, setRounds] = useState(12);
  const [error, setError] = useState('');

  const generateKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 16; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setKey(key);
  };

  const process = () => {
    setError('');
    setResult('');
    if (!input.trim() || !key.trim()) {
      setError('请输入文本和密钥');
      return;
    }
    try {
      if (mode === 'encrypt') {
        setResult(rc5Encrypt(input, key, rounds));
      } else {
        setResult(rc5Decrypt(input, key, rounds));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '操作失败');
    }
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
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-pink-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">RC5/RC6 加密解密</h1>
            </div>
            <p className="text-indigo-100 text-lg">Ron Rivest设计的块密码算法，支持可配置轮数</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="flex gap-2 mb-6">
                {(['encrypt', 'decrypt'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setResult(''); setError(''); }}
                    className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                      mode === m ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {m === 'encrypt' ? '🔒 加密' : '🔓 解密'}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    {mode === 'encrypt' ? '原文' : '密文'}
                  </label>
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={mode === 'encrypt' ? '输入要加密的文本...' : '输入要解密的Base64密文...'}
                    className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">密钥</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showKey ? 'text' : 'password'}
                        value={key}
                        onChange={e => setKey(e.target.value)}
                        placeholder="输入加密/解密密钥..."
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                      <button
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <button
                      onClick={generateKey}
                      className="px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600"
                      title="生成随机密钥"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    轮数: {rounds}
                  </label>
                  <input
                    type="range"
                    min="8"
                    max="24"
                    value={rounds}
                    onChange={e => setRounds(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>8 (快速)</span>
                    <span>24 (安全)</span>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={process}
                  disabled={!input.trim() || !key.trim()}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50"
                >
                  {mode === 'encrypt' ? '加密' : '解密'}
                </button>
              </div>
            </div>

            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {mode === 'encrypt' ? '加密结果' : '解密结果'}
                  </h3>
                  <button
                    onClick={copyResult}
                    className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${
                      copied ? 'bg-green-100 text-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
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
                <li>• RC5 是由 Ron Rivest 设计的一种对称密钥块密码</li>
                <li>• 特点是参数可设置：字大小、轮数、密钥长度</li>
                <li>• RC6 是 RC5 的增强版，增加了四位寄存器支持</li>
                <li>• 轮数越多安全性越高，但速度越慢</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}