'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Copy, Check, RefreshCw, Key } from 'lucide-react';
import nacl from 'tweetnacl';
import { encodeBase64, decodeBase64 } from 'tweetnacl-util';

// Ed25519 签名实现
function ed25519Sign(message: string, privateKeyHex: string): string {
  const messageBytes = new TextEncoder().encode(message);
  const keyBytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    keyBytes[i] = parseInt(privateKeyHex.substr(i * 2, 2), 16);
  }
  const keyPair = nacl.sign.keyPair.fromSeed(keyBytes);
  const signature = nacl.sign(messageBytes, keyPair.secretKey);
  return encodeBase64(signature);
}

function ed25519Verify(message: string, signature: string, publicKeyHex: string): boolean {
  try {
    const messageBytes = new TextEncoder().encode(message);
    const sigBytes = decodeBase64(signature);
    const keyBytes = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      keyBytes[i] = parseInt(publicKeyHex.substr(i * 2, 2), 16);
    }
    return nacl.sign.open(sigBytes, keyBytes) !== null;
  } catch {
    return false;
  }
}

function generateEd25519Pair(): { publicKey: string; privateKey: string } {
  const keyPair = nacl.sign.keyPair();
  const toHex = (arr: Uint8Array) => Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  return {
    publicKey: toHex(keyPair.publicKey),
    privateKey: toHex(keyPair.secretKey)
  };
}

export default function Ed25519Page() {
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
    const keys = generateEd25519Pair();
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
        if (!privateKey.trim() || privateKey.length !== 64) {
          setError('Ed25519私钥需要64个十六进制字符');
          return;
        }
        const sig = ed25519Sign(input, privateKey);
        setSignature(sig);
        setResult(sig);
      } else {
        if (!publicKey.trim() || publicKey.length !== 64) {
          setError('Ed25519公钥需要64个十六进制字符');
          return;
        }
        if (!signature.trim()) {
          setError('请输入签名');
          return;
        }
        const isValid = ed25519Verify(input, signature, publicKey);
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
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-violet-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">Ed25519 签名验签</h1>
            </div>
            <p className="text-violet-100 text-lg">现代高性能椭圆曲线数字签名算法</p>
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
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  生成密钥对
                </button>
              </div>
              {generatedKeys && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">公钥 (64字符十六进制)</label>
                    <input
                      type="text"
                      value={generatedKeys.publicKey}
                      readOnly
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-300 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">私钥 (64字符十六进制)</label>
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
                {(['sign', 'verify'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setResult(''); setError(''); }}
                    className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                      mode === m ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
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
                    className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none font-mono text-sm"
                  />
                </div>

                {mode === 'verify' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">签名 (Base64)</label>
                    <input
                      type="text"
                      value={signature}
                      onChange={e => setSignature(e.target.value)}
                      placeholder="粘贴要验证的签名..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                    {mode === 'sign' ? '私钥 (64字符十六进制)' : '公钥 (64字符十六进制)'}
                  </label>
                  <input
                    type="text"
                    value={mode === 'sign' ? privateKey : publicKey}
                    onChange={e => mode === 'sign' ? setPrivateKey(e.target.value) : setPublicKey(e.target.value)}
                    placeholder={mode === 'sign' ? '输入私钥...' : '输入公钥...'}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono text-sm"
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
                  className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all disabled:opacity-50"
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
                <li>• Ed25519 是 Edwards-curve Digital Signature Algorithm</li>
                <li>• 由 Daniel J. Bernstein 等人设计的现代签名算法</li>
                <li>• 签名速度快、安全性高、密钥短（32字节）</li>
                <li>• 被 OpenSSH、TOR、Signal 等广泛采用</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}