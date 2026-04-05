'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Copy, Check, Eye, EyeOff, RefreshCw, Key } from 'lucide-react';
import CryptoJS from 'crypto-js';

// 简化的ElGamal加密实现
function elgamalEncrypt(text: string, publicKey: string): string {
  try {
    const p = parseInt(publicKey.split(':')[0] || '99991', 10) || 99991;
    const g = parseInt(publicKey.split(':')[1] || '2', 10) || 2;
    const y = parseInt(publicKey.split(':')[2] || '1', 10) || 1;
    
    const m = CryptoJS.SHA256(text).toString().substring(0, 8);
    const k = Math.floor(Math.random() * (p - 2)) + 1;
    const c1 = Math.pow(g, k) % p;
    const c2 = (parseInt(m, 16) * Math.pow(y, k)) % p;
    
    return btoa(JSON.stringify({ c1: c1.toString(), c2: c2.toString(), p: p.toString() }));
  } catch {
    throw new Error('加密失败');
  }
}

function elgamalDecrypt(ciphertext: string, privateKey: string): string {
  try {
    const data = JSON.parse(atob(ciphertext));
    const { c1, c2, p } = data;
    const x = parseInt(privateKey, 10) || 1;
    
    const m = (parseInt(c2, 10) * Math.pow(parseInt(c1, 10), p - 1 - x)) % parseInt(p, 10);
    return m.toString(16).padStart(8, '0');
  } catch {
    throw new Error('解密失败');
  }
}

function generateElGamalKeys(): { publicKey: string; privateKey: string } {
  const p = 99991; // 素数
  const g = 2;
  const x = Math.floor(Math.random() * (p - 2)) + 1;
  const y = Math.pow(g, x) % p;
  return { publicKey: `${p}:${g}:${y}`, privateKey: x.toString() };
}

export default function ElGamalPage() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [input, setInput] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPrivate, setShowPrivate] = useState(false);
  const [error, setError] = useState('');
  const [generatedKeys, setGeneratedKeys] = useState<{ publicKey: string; privateKey: string } | null>(null);

  const generateKeys = () => {
    const keys = generateElGamalKeys();
    setPublicKey(keys.publicKey);
    setPrivateKey(keys.privateKey);
    setGeneratedKeys(keys);
  };

  const process = () => {
    setError('');
    setResult('');
    if (!input.trim()) {
      setError('请输入文本');
      return;
    }
    try {
      if (mode === 'encrypt') {
        if (!publicKey.trim()) {
          setError('请先生成密钥对');
          return;
        }
        setResult(elgamalEncrypt(input, publicKey));
      } else {
        if (!privateKey.trim()) {
          setError('请输入私钥');
          return;
        }
        setResult(elgamalDecrypt(input, privateKey));
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
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-blue-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">ElGamal 加密解密</h1>
            </div>
            <p className="text-blue-100 text-lg">Taher ElGamal设计的公钥密码系统</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  密钥生成
                </h3>
                <button
                  onClick={generateKeys}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  生成密钥对
                </button>
              </div>
              {generatedKeys && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">公钥 (p:g:y)</label>
                    <input
                      type="text"
                      value={generatedKeys.publicKey}
                      readOnly
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-300 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">私钥 (x)</label>
                    <input
                      type="text"
                      value={generatedKeys.privateKey}
                      readOnly
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-300 font-mono text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="flex gap-2 mb-6">
                {(['encrypt', 'decrypt'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setResult(''); setError(''); }}
                    className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                      mode === m ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
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
                    placeholder={mode === 'encrypt' ? '输入要加密的文本...' : '输入要解密的密文...'}
                    className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    {mode === 'encrypt' ? '公钥' : '私钥'}
                  </label>
                  <input
                    type="text"
                    value={mode === 'encrypt' ? publicKey : privateKey}
                    onChange={e => mode === 'encrypt' ? setPublicKey(e.target.value) : setPrivateKey(e.target.value)}
                    placeholder={mode === 'encrypt' ? '输入公钥...' : '输入私钥...'}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={process}
                  disabled={!input.trim()}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50"
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
                <li>• ElGamal 是 Taher ElGamal 于1985年提出的公钥密码系统</li>
                <li>• 基于离散对数问题，安全性高</li>
                <li>• 加密后的密文长度是明文的两倍</li>
                <li>• 被广泛应用于加密和数字签名</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}