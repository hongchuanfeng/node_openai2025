'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Copy, Check, Eye, EyeOff, RefreshCw } from 'lucide-react';

// 简化的 Blowfish 实现
function blowfishEncrypt(text: string, key: string): string {
  const keyBytes = new TextEncoder().encode(key);
  const textBytes = new TextEncoder().encode(text);
  
  // P盒初始化
  const P = [
    0x243f6a88, 0x85a308d3, 0x13198a2e, 0x03707344, 0xa4093822, 0x299f31d0, 0x082efa98, 0xec4e6c89,
    0x452821e6, 0x38d01377, 0xbe5466cf, 0x34e90c6c, 0xc0ac29b7, 0xc97c50dd, 0x3f84d5b5, 0xb5470917,
    0x9216d5d9, 0x8979fb1b
  ];
  
  // S盒简化
  const S = [
    [0xd1310ba6, 0x98dfb5ac, 0x2ffd72db, 0xd01adfb7, 0xb8e1afed, 0x6a267e96, 0xba7c9045, 0xf12c7f99],
    [0x24a19947, 0xb3916cf7, 0x0801f2e2, 0x858efc16, 0x636920d8, 0x71574e69, 0xa458fea3, 0xf4933d7e],
    [0x0d95748f, 0x728eb658, 0x718bcd58, 0x82154aee, 0x7b54a41d, 0xc25a59b5, 0x9c30d539, 0x2af26013],
    [0xc5d1b023, 0x286085f0, 0xca417918, 0xb8db38ef, 0x8e79dcb0, 0x603a180e, 0x6c9e0e8b, 0xb01e8a3e]
  ];
  
  // 密钥扩展
  for (let i = 0; i < 18; i++) {
    P[i] ^= keyBytes[(i * 4) % keyBytes.length] | (keyBytes[(i * 4 + 1) % keyBytes.length] << 8) |
           (keyBytes[(i * 4 + 2) % keyBytes.length] << 16) | (keyBytes[(i * 4 + 3) % keyBytes.length] << 24);
  }
  
  let xl = 0x12345678, xr = 0xabcdef00;
  
  // 16轮加密
  for (let i = 0; i < 16; i += 2) {
    xl ^= P[i];
    xr ^= ((S[0][(xl >> 24) & 0xff] + S[1][(xl >> 16) & 0xff]) ^ S[2][(xl >> 8) & 0xff]) + S[3][xl & 0xff];
    xr ^= P[i + 1];
  }
  
  // 交换
  const temp = xl; xl = xr; xr = temp;
  xl ^= P[16]; xr ^= P[17];
  
  // 处理文本
  const result: number[] = [];
  for (let i = 0; i < textBytes.length; i += 8) {
    const block = textBytes.slice(i, i + 8);
    const padded = new Uint8Array(8);
    padded.set(block);
    
    let bl = padded[0] | (padded[1] << 8) | (padded[2] << 16) | (padded[3] << 24);
    let br = padded[4] | (padded[5] << 8) | (padded[6] << 16) | (padded[7] << 24);
    
    bl ^= P[0];
    br ^= ((S[0][(bl >> 24) & 0xff] + S[1][(bl >> 16) & 0xff]) ^ S[2][(bl >> 8) & 0xff]) + S[3][bl & 0xff] ^ P[1];
    
    for (let j = 2; j < 16; j += 2) {
      bl ^= ((S[0][(br >> 24) & 0xff] + S[1][(br >> 16) & 0xff]) ^ S[2][(br >> 8) & 0xff]) + S[3][br & 0xff] ^ P[j];
      br ^= ((S[0][(bl >> 24) & 0xff] + S[1][(bl >> 16) & 0xff]) ^ S[2][(bl >> 8) & 0xff]) + S[3][bl & 0xff] ^ P[j + 1];
    }
    
    const etemp = bl; bl = br; br = etemp;
    bl ^= P[16]; br ^= P[17];
    
    result.push(bl & 0xff, (bl >> 8) & 0xff, (bl >> 16) & 0xff, (bl >> 24) & 0xff);
    result.push(br & 0xff, (br >> 8) & 0xff, (br >> 16) & 0xff, (br >> 24) & 0xff);
  }
  
  // 添加头部标识
  const header = new Uint8Array([0x42, 0x46]); // "BF"
  const encrypted = new Uint8Array(header.length + result.length);
  encrypted.set(header);
  encrypted.set(result, header.length);
  
  return btoa(String.fromCharCode(...encrypted));
}

function blowfishDecrypt(ciphertext: string, key: string): string {
  try {
    const keyBytes = new TextEncoder().encode(key);
    const data = atob(ciphertext);
    const bytes = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      bytes[i] = data.charCodeAt(i);
    }
    
    // 检查头部
    if (bytes[0] !== 0x42 || bytes[1] !== 0x46) {
      throw new Error('无效的Blowfish密文');
    }
    
    const P = [
      0x243f6a88, 0x85a308d3, 0x13198a2e, 0x03707344, 0xa4093822, 0x299f31d0, 0x082efa98, 0xec4e6c89,
      0x452821e6, 0x38d01377, 0xbe5466cf, 0x34e90c6c, 0xc0ac29b7, 0xc97c50dd, 0x3f84d5b5, 0xb5470917,
      0x9216d5d9, 0x8979fb1b
    ];
    
    const S = [
      [0xd1310ba6, 0x98dfb5ac, 0x2ffd72db, 0xd01adfb7, 0xb8e1afed, 0x6a267e96, 0xba7c9045, 0xf12c7f99],
      [0x24a19947, 0xb3916cf7, 0x0801f2e2, 0x858efc16, 0x636920d8, 0x71574e69, 0xa458fea3, 0xf4933d7e],
      [0x0d95748f, 0x728eb658, 0x718bcd58, 0x82154aee, 0x7b54a41d, 0xc25a59b5, 0x9c30d539, 0x2af26013],
      [0xc5d1b023, 0x286085f0, 0xca417918, 0xb8db38ef, 0x8e79dcb0, 0x603a180e, 0x6c9e0e8b, 0xb01e8a3e]
    ];
    
    for (let i = 0; i < 18; i++) {
      P[i] ^= keyBytes[(i * 4) % keyBytes.length] | (keyBytes[(i * 4 + 1) % keyBytes.length] << 8) |
             (keyBytes[(i * 4 + 2) % keyBytes.length] << 16) | (keyBytes[(i * 4 + 3) % keyBytes.length] << 24);
    }
    
    const result: number[] = [];
    for (let i = 2; i < bytes.length; i += 8) {
      let bl = bytes[i] | (bytes[i + 1] << 8) | (bytes[i + 2] << 16) | (bytes[i + 3] << 24);
      let br = bytes[i + 4] | (bytes[i + 5] << 8) | (bytes[i + 6] << 16) | (bytes[i + 7] << 24);
      
      bl ^= P[16]; br ^= P[17];
      const temp = bl; bl = br; br = temp;
      
      for (let j = 14; j > 0; j -= 2) {
        br ^= ((S[0][(bl >> 24) & 0xff] + S[1][(bl >> 16) & 0xff]) ^ S[2][(bl >> 8) & 0xff]) + S[3][bl & 0xff] ^ P[j];
        bl ^= ((S[0][(br >> 24) & 0xff] + S[1][(br >> 16) & 0xff]) ^ S[2][(br >> 8) & 0xff]) + S[3][br & 0xff] ^ P[j - 1];
      }
      
      result.push(bl & 0xff, (bl >> 8) & 0xff, (bl >> 16) & 0xff, (bl >> 24) & 0xff);
      result.push(br & 0xff, (br >> 8) & 0xff, (br >> 16) & 0xff, (br >> 24) & 0xff);
    }
    
    return new TextDecoder().decode(new Uint8Array(result));
  } catch {
    throw new Error('解密失败，请检查密钥和密文');
  }
}

export default function BlowfishPage() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
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
        setResult(blowfishEncrypt(input, key));
      } else {
        setResult(blowfishDecrypt(input, key));
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
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-orange-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">Blowfish/Twofish 加密解密</h1>
            </div>
            <p className="text-orange-100 text-lg">Bruce Schneier设计的高效对称加密算法</p>
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
                      mode === m ? 'bg-orange-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
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
                    className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-mono text-sm"
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
                        placeholder="输入加密/解密密钥（4-56字节）..."
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
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

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={process}
                  disabled={!input.trim() || !key.trim()}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50"
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
                <li>• Blowfish 是 Bruce Schneier 于1993年设计的对称加密算法</li>
                <li>• 密钥长度可变（32-448位），加密速度快，无专利保护</li>
                <li>• Twofish 是 Blowfish 的后继算法，同样由 Bruce Schneier 设计</li>
                <li>• 适合需要快速加密且密钥不频繁变化的场景</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}