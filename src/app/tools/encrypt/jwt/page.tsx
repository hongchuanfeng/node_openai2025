'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Key, Copy, Check, AlertCircle } from 'lucide-react';

function base64UrlDecode(str: string): string {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return decodeURIComponent(
    atob(s)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

function decodeJWT(token: string): { header: string; payload: string; signature: string } | null {
  const parts = token.trim().split('.');
  if (parts.length !== 3) return null;
  try {
    return {
      header: JSON.parse(base64UrlDecode(parts[0])),
      payload: JSON.parse(base64UrlDecode(parts[1])),
      signature: parts[2],
    };
  } catch {
    return null;
  }
}

function formatDate(ts: number) {
  if (!ts) return '—';
  const d = new Date(ts * 1000);
  return d.toLocaleString('zh-CN', { timeZoneName: 'short' });
}

export default function JWTPage() {
  const [input, setInput] = useState('');
  const [decoded, setDecoded] = useState<{ header: Record<string, unknown>; payload: Record<string, unknown>; signature: string } | null>(null);
  const [error, setError] = useState('');
  const [copiedHeader, setCopiedHeader] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  const handleDecode = () => {
    if (!input.trim()) { setDecoded(null); setError(''); return; }
    const result = decodeJWT(input);
    if (result) {
      setDecoded(result as unknown as { header: Record<string, unknown>; payload: Record<string, unknown>; signature: string });
      setError('');
    } else {
      setError('无效的JWT格式，请检查令牌是否完整');
      setDecoded(null);
    }
  };

  const copyJson = async (obj: Record<string, unknown>, key: 'header' | 'payload') => {
    await navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    if (key === 'header') { setCopiedHeader(true); setTimeout(() => setCopiedHeader(false), 2000); }
    else { setCopiedPayload(true); setTimeout(() => setCopiedPayload(false), 2000); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-violet-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Key className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">JWT在线解密</h1>
            </div>
            <p className="text-violet-100 text-lg">解析JWT令牌，查看Header和Payload内容</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">输入JWT令牌</h3>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="粘贴JWT令牌（如 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c）..."
                className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none font-mono text-sm"
              />
              <button onClick={handleDecode} disabled={!input.trim()} className="w-full mt-4 py-3 bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-bold rounded-xl hover:from-violet-600 hover:to-indigo-600 transition-all disabled:opacity-50">
                解析JWT
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {decoded && (
              <>
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 dark:text-white">Header（头部）</h3>
                    <button onClick={() => copyJson(decoded.header, 'header')} className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${copiedHeader ? 'bg-green-100 text-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                      {copiedHeader ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-700 dark:text-slate-300 overflow-x-auto">
                    {JSON.stringify(decoded.header, null, 2)}
                  </pre>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 dark:text-white">Payload（载荷）</h3>
                    <button onClick={() => copyJson(decoded.payload, 'payload')} className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${copiedPayload ? 'bg-green-100 text-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                      {copiedPayload ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-700 dark:text-slate-300 overflow-x-auto">
                    {JSON.stringify(decoded.payload, null, 2)}
                  </pre>
                  {typeof decoded.payload.exp === 'number' && (
                    <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-sm">
                      <span className="text-amber-700 dark:text-amber-400">过期时间：</span>
                      <span className="font-mono text-amber-800 dark:text-amber-300">{formatDate(decoded.payload.exp as number)}</span>
                      {Date.now() / 1000 > decoded.payload.exp ? (
                        <span className="ml-3 px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs">已过期</span>
                      ) : (
                        <span className="ml-3 px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs">有效</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4">Signature（签名）</h3>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <code className="text-sm font-mono text-slate-700 dark:text-slate-300 break-all">{decoded.signature}</code>
                  </div>
                </div>
              </>
            )}

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-4">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">功能说明</h4>
              <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                <li>• JWT（JSON Web Token）由 Header、Payload、Signature 三部分组成，用"."分隔</li>
                <li>• 本工具仅解析解码，不验证签名真实性</li>
                <li>• Payload中的"exp"字段表示过期时间，"iat"表示签发时间</li>
                <li>• 重要：不要将敏感信息直接明文放在JWT中传输</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
