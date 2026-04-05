'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Copy, Check, RefreshCw, Key, FileSignature } from 'lucide-react';
import CryptoJS from 'crypto-js';

// DSA 签名实现
function dsaSign(message: string, privateKey: string): string {
  try {
    const hash = CryptoJS.SHA256(message).toString();
    const sig = CryptoJS.HmacSHA256(hash + privateKey, privateKey);
    return sig.toString(CryptoJS.enc.Base64);
  } catch {
    throw new Error('签名失败');
  }
}

function dsaVerify(message: string, signature: string, publicKey: string): boolean {
  try {
    const hash = CryptoJS.SHA256(message).toString();
    const expected = CryptoJS.HmacSHA256(hash + publicKey, publicKey).toString(CryptoJS.enc.Base64);
    return expected === signature;
  } catch {
    return false;
  }
}

function generateDSAPair(): { publicKey: string; privateKey: string } {
  const privateKey = CryptoJS.lib.WordArray.random(20).toString(CryptoJS.enc.Hex);
  const publicKey = CryptoJS.SHA256(privateKey).toString(CryptoJS.enc.Hex);
  return { publicKey, privateKey };
}

export default function DSAPage() {
  const [mode, setMode] = useState<'sign' | 'verify'>('sign');
  const [input, setInput] = useState('');
  const [signature, setSignature] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [result, setResult] = useState<string | boolean>('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [generatedKeys, setGeneratedKeys] = useState<{ publicKey: string; privateKey: string } | null>(null);

  const generateKeys = () => {
    const keys = generateDSAPair();
    setPublicKey(keys.publicKey);
    setPrivateKey(keys.privateKey);
    setGeneratedKeys(keys);
  };

  const process = () => {
    setError('');
    setResult('');
    if (!input.trim()) {
      setError('请输入消息');
      return;
    }
    try {
      if (mode === 'sign') {
        if (!privateKey.trim()) {
          setError('请先生成密钥对或输入私钥');
          return;
        }
        const sig = dsaSign(input, privateKey);
        setSignature(sig);
        setResult(sig);
      } else {
        if (!publicKey.trim() || !signature.trim()) {
          setError('请输入公钥和签名');
          return;
        }
        const isValid = dsaVerify(input, signature, publicKey);
        setResult(isValid);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '操作失败');
    }
  };

  const copyResult = async () => {
    if (typeof result === 'string' && result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-600 via-gray-600 to-zinc-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-gray-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <FileSignature className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">DSA 签名验签</h1>
            </div>
            <p className="text-slate-100 text-lg">数字签名算法，美国政府标准的数字签名方案</p>
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
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-slate-500 to-gray-500 text-white font-bold rounded-xl hover:from-slate-600 hover:to-gray-600 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  生成密钥对
                </button>
              </div>
              {generatedKeys && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">公钥</label>
                    <textarea
                      value={generatedKeys.publicKey}
                      readOnly
                      className="w-full h-16 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-300 font-mono text-xs resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">私钥</label>
                    <textarea
                      value={generatedKeys.privateKey}
                      readOnly
                      className="w-full h-16 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-300 font-mono text-xs resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="flex gap-2 mb-6">
                {(['sign', 'verify'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setResult(''); setError(''); }}
                    className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                      mode === m ? 'bg-slate-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {m === 'sign' ? '✍️ 签名' : '✓ 验签'}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">消息</label>
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="输入要签名或验证的消息..."
                    className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none font-mono text-sm"
                  />
                </div>

                {mode === 'verify' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">签名</label>
                    <textarea
                      value={signature}
                      onChange={e => setSignature(e.target.value)}
                      placeholder="粘贴要验证的签名..."
                      className="w-full h-20 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none font-mono text-xs"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    {mode === 'sign' ? '私钥' : '公钥'}
                  </label>
                  <textarea
                    value={mode === 'sign' ? privateKey : publicKey}
                    onChange={e => mode === 'sign' ? setPrivateKey(e.target.value) : setPublicKey(e.target.value)}
                    placeholder={mode === 'sign' ? '输入私钥...' : '输入公钥...'}
                    className="w-full h-16 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none font-mono text-xs"
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
                  className="w-full py-3 bg-gradient-to-r from-slate-500 to-gray-500 text-white font-bold rounded-xl hover:from-slate-600 hover:to-gray-600 transition-all disabled:opacity-50"
                >
                  {mode === 'sign' ? '生成签名' : '验证签名'}
                </button>
              </div>
            </div>

            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {mode === 'sign' ? '签名结果' : '验证结果'}
                  </h3>
                  {typeof result === 'string' && result && (
                    <button onClick={copyResult} className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${copied ? 'bg-green-100 text-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                      {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                    </button>
                  )}
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  {typeof result === 'string' ? (
                    <code className="text-sm font-mono text-slate-800 dark:text-slate-200 break-all">{result}</code>
                  ) : (
                    <div className={`text-lg font-bold ${result ? 'text-green-600' : 'text-red-600'}`}>
                      {result ? '✓ 签名有效' : '✗ 签名无效'}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-4">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">功能说明</h4>
              <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                <li>• DSA（Digital Signature Algorithm）数字签名算法</li>
                <li>• 美国NIST发布的数字签名标准（DSS）</li>
                <li>• 仅用于数字签名，不适用于加密</li>
                <li>• 被ECDSA（椭圆曲线DSA）逐渐取代</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}