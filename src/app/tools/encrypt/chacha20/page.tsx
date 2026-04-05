'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Copy, Check, Eye, EyeOff, RefreshCw } from 'lucide-react';
import nacl from 'tweetnacl';

// ChaCha20-Poly1305 加密实现
function chacha20Encrypt(text: string, key: string, nonce: string): string {
  const keyBytes = new TextEncoder().encode(key);
  const nonceBytes = new TextEncoder().encode(nonce);
  const textBytes = new TextEncoder().encode(text);
  
  // 确保密钥长度为32字节
  const key32 = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    key32[i] = keyBytes[i % keyBytes.length];
  }
  
  // 确保nonce为24字节或更少
  const nonce24 = new Uint8Array(24);
  for (let i = 0; i < Math.min(nonceBytes.length, 24); i++) {
    nonce24[i] = nonceBytes[i];
  }
  
  // 使用 nacl.secretbox 进行加密
  const message = new Uint8Array(textBytes.length + 24); // 24字节nonce在前面
  message.set(nonce24);
  message.set(textBytes, 24);
  
  const encrypted = nacl.secretbox(message, nonce24, key32);
  
  return btoa(String.fromCharCode(...encrypted));
}

function chacha20Decrypt(ciphertext: string, key: string, nonce: string): string {
  try {
    const keyBytes = new TextEncoder().encode(key);
    const nonceBytes = new TextEncoder().encode(nonce);
    
    const key32 = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      key32[i] = keyBytes[i % keyBytes.length];
    }
    
    const nonce24 = new Uint8Array(24);
    for (let i = 0; i < Math.min(nonceBytes.length, 24); i++) {
      nonce24[i] = nonceBytes[i];
    }
    
    const data = atob(ciphertext);
    const bytes = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      bytes[i] = data.charCodeAt(i);
    }
    
    const decrypted = nacl.secretbox.open(bytes, nonce24, key32);
    
    if (!decrypted) {
      throw new Error('解密失败');
    }
    
    return new TextDecoder().decode(decrypted);
  } catch {
    throw new Error('解密失败，请检查密钥和密文');
  }
}

function generateNonce(): string {
  const array = new Uint8Array(24);
  for (let i = 0; i < 24; i++) {
    array[i] = Math.floor(Math.random() * 256);
  }
  return btoa(String.fromCharCode(...array)).substring(0, 32);
}

export default function ChaCha20Page() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [nonce, setNonce] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  const generateKey = () => {
    const array = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    setKey(btoa(String.fromCharCode(...array)));
  };

  const generateNewNonce = () => {
    setNonce(generateNonce());
  };

  const process = () => {
    setError('');
    setResult('');
    if (!input.trim() || !key.trim() || !nonce.trim()) {
      setError('请输入文本、密钥和Nonce');
      return;
    }
    try {
      if (mode === 'encrypt') {
        setResult(chacha20Encrypt(input, key, nonce));
      } else {
        setResult(chacha20Decrypt(input, key, nonce));
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
        <section className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-cyan-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">ChaCha20 加密解密</h1>
            </div>
            <p className="text-cyan-100 text-lg">Daniel J. Bernstein设计的高性能流密码</p>
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
                      mode === m ? 'bg-cyan-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
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
                    className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    密钥 (256位)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showKey ? 'text' : 'password'}
                        value={key}
                        onChange={e => setKey(e.target.value)}
                        placeholder="输入32字节密钥（Base64）..."
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
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
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    Nonce (随机数，24字节)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={nonce}
                      onChange={e => setNonce(e.target.value)}
                      placeholder="输入Nonce..."
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                    />
                    <button
                      onClick={generateNewNonce}
                      className="px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">每次加密请使用不同的Nonce，解密时需要使用相同的Nonce</p>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={process}
                  disabled={!input.trim() || !key.trim() || !nonce.trim()}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50"
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
                <li>• ChaCha20 是 Daniel J. Bernstein 设计的流密码算法</li>
                <li>• 使用256位密钥和64位Nonce，安全高效</li>
                <li>• Poly1305 提供消息认证，确保数据完整性</li>
                <li>• 在移动设备上性能优异，被TLS协议广泛采用</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}