'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldCheck, Copy, Check, Eye, EyeOff } from 'lucide-react';
import CryptoJS from 'crypto-js';

export default function TripleDESPage() {
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const process = () => {
    if (!input.trim() || !key.trim()) return;
    try {
      let out: string;
      if (mode === 'encrypt') {
        const encrypted = CryptoJS.TripleDES.encrypt(input, CryptoJS.enc.Utf8.parse(key), { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        out = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
      } else {
        const decrypted = CryptoJS.TripleDES.decrypt(input, CryptoJS.enc.Utf8.parse(key), { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        out = decrypted.toString(CryptoJS.enc.Utf8);
        if (!out) { setResult('解密失败，密钥或密文不正确'); return; }
      }
      setResult(out);
    } catch {
      setResult('操作失败，请检查输入格式');
    }
  };

  const copyResult = async () => {
    if (result) { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-yellow-600 via-amber-600 to-orange-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-yellow-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <ShieldCheck className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">TripleDES加密</h1>
            </div>
            <p className="text-yellow-100 text-lg">三重DES加密，增强版DES算法</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="flex gap-2 mb-6">
                {(['encrypt', 'decrypt'] as const).map(m => (
                  <button key={m} onClick={() => { setMode(m); setResult(''); }} className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors ${mode === m ? 'bg-yellow-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    {m === 'encrypt' ? '🔒 加密' : '🔓 解密'}
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">{mode === 'encrypt' ? '原文' : '密文'}</label>
                  <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={mode === 'encrypt' ? '输入要加密的文本...' : '输入要解密的Base64密文...'} className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">密钥（16或24字符）</label>
                  <div className="relative">
                    <input type={showKey ? 'text' : 'password'} value={key} onChange={e => setKey(e.target.value.slice(0, 24))} placeholder="输入密钥（16或24字符）..." className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 font-mono" />
                    <button onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">密钥长度：{key.length} 字符（TripleDES支持16或24字节密钥）</p>
                </div>
                <button onClick={process} disabled={!input.trim() || !key.trim()} className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold rounded-xl hover:from-yellow-600 hover:to-amber-600 transition-all disabled:opacity-50">
                  {mode === 'encrypt' ? '加密' : '解密'}
                </button>
              </div>
            </div>

            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">{mode === 'encrypt' ? '加密结果' : '解密结果'}</h3>
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
                <li>• TripleDES（三重DES）对数据执行三次DES加密操作</li>
                <li>• 使用两个或三个不同的密钥，密钥长度可达168位（实际112位有效）</li>
                <li>• 比原始DES更安全，但仍比AES慢，已逐渐被淘汰</li>
                <li>• 支持16字节（双倍长）或24字节（三倍长）密钥</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
