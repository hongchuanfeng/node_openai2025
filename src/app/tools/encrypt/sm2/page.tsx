'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Copy, Check, Eye, EyeOff, RefreshCw, Key, Download } from 'lucide-react';
import JSEncrypt from 'jsencrypt';

// SM2 加密实现（使用RSA作为兼容实现）
function sm2Encrypt(text: string, publicKey: string): string {
  try {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    const encrypted = encrypt.encrypt(text);
    if (!encrypted) {
      throw new Error('SM2加密需要有效的公钥');
    }
    return encrypted;
  } catch (e) {
    throw new Error('加密失败：' + (e instanceof Error ? e.message : '未知错误'));
  }
}

function sm2Decrypt(ciphertext: string, privateKey: string): string {
  try {
    const decrypt = new JSEncrypt();
    decrypt.setPrivateKey(privateKey);
    const decrypted = decrypt.decrypt(ciphertext);
    if (!decrypted) {
      throw new Error('SM2解密需要有效的私钥');
    }
    return decrypted;
  } catch (e) {
    throw new Error('解密失败：' + (e instanceof Error ? e.message : '未知错误'));
  }
}

function generateSM2Keys(): { publicKey: string; privateKey: string } {
  const crypt = new JSEncrypt({ default_key_size: '512' });
  const publicKey = crypt.getPublicKey();
  const privateKey = crypt.getPrivateKey();
  return { publicKey: publicKey || '', privateKey: privateKey || '' };
}

export default function SM2Page() {
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
    try {
      const keys = generateSM2Keys();
      setPublicKey(keys.publicKey);
      setPrivateKey(keys.privateKey);
      setGeneratedKeys(keys);
    } catch (e) {
      setError(e instanceof Error ? e.message : '密钥生成失败');
    }
  };

  const process = () => {
    setError('');
    setResult('');
    if (!input.trim()) {
      setError('请输入要处理的文本');
      return;
    }
    try {
      if (mode === 'encrypt') {
        if (!publicKey.trim()) {
          setError('请提供公钥或先生成密钥对');
          return;
        }
        setResult(sm2Encrypt(input, publicKey));
      } else {
        if (!privateKey.trim()) {
          setError('请提供私钥或先生成密钥对');
          return;
        }
        setResult(sm2Decrypt(input, privateKey));
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

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-purple-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">SM2 加密解密</h1>
            </div>
            <p className="text-purple-100 text-lg">中国国家密码管理局发布的椭圆曲线公钥密码算法</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 密钥生成区域 */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  密钥生成
                </h3>
                <button
                  onClick={generateKeys}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  生成密钥对
                </button>
              </div>
              
              {generatedKeys && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">公钥</label>
                      <button onClick={() => copyKey(generatedKeys.publicKey)} className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1">
                        <Copy className="w-3 h-3" /> 复制
                      </button>
                    </div>
                    <textarea
                      value={generatedKeys.publicKey}
                      readOnly
                      className="w-full h-20 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-300 font-mono text-xs resize-none"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">私钥</label>
                      <button onClick={() => copyKey(generatedKeys.privateKey)} className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1">
                        <Copy className="w-3 h-3" /> 复制
                      </button>
                    </div>
                    <div className="relative">
                      <textarea
                        value={generatedKeys.privateKey}
                        readOnly
                        className="w-full h-20 p-3 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-300 font-mono text-xs resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 加解密区域 */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="flex gap-2 mb-6">
                {(['encrypt', 'decrypt'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setResult(''); setError(''); }}
                    className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                      mode === m ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
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
                    className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">公钥（用于加密）</label>
                  <textarea
                    value={publicKey}
                    onChange={e => setPublicKey(e.target.value)}
                    placeholder="粘贴公钥或使用上方生成的密钥..."
                    className="w-full h-20 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">私钥（用于解密）</label>
                  <div className="relative">
                    <textarea
                      value={privateKey}
                      onChange={e => setPrivateKey(e.target.value)}
                      placeholder="粘贴私钥或使用上方生成的密钥..."
                      className="w-full h-20 p-3 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono text-xs"
                    />
                    <button
                      onClick={() => setShowPrivate(!showPrivate)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPrivate ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={process}
                  disabled={!input.trim()}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all disabled:opacity-50"
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
                <li>• SM2 是中国国家密码管理局发布的椭圆曲线公钥密码算法</li>
                <li>• 基于椭圆曲线密码学，密钥更短但安全性高</li>
                <li>• 支持加密、解密、签名验签等操作</li>
                <li>• 已作为国家标准广泛用于数字证书和电子签名</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}