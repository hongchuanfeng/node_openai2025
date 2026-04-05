'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info } from 'lucide-react';

export default function MsgpackPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const encodeMsgpack = (obj: unknown): Uint8Array => {
    const bytes: number[] = [];
    const add = (b: number) => bytes.push(b);
    const addBytes = (arr: number[]) => bytes.push(...arr);

    const encode = (val: unknown): void => {
      if (val === null) { add(0xc0); return; }
      if (val === true) { add(0xc3); return; }
      if (val === false) { add(0xc2); return; }
      if (typeof val === 'number') {
        if (Number.isInteger(val)) {
          if (val >= 0 && val < 128) { add(val); return; }
          if (val >= -32 && val < 0) { add(0xe0 + (val + 32)); return; }
          if (val >= 0 && val <= 0xff) { add(0xcc); add(val); return; }
          if (val >= 0 && val <= 0xffff) { add(0xcd); add((val >> 8) & 0xff); add(val & 0xff); return; }
          if (val >= 0 && val <= 0xffffffff) { add(0xce); addBytes([(val >> 24) & 0xff, (val >> 16) & 0xff, (val >> 8) & 0xff, val & 0xff]); return; }
        }
        add(0xcb);
        const buf = new ArrayBuffer(8);
        new DataView(buf).setFloat64(0, val);
        addBytes(Array.from(new Uint8Array(buf)));
        return;
      }
      if (typeof val === 'string') {
        const buf = new TextEncoder().encode(val);
        if (buf.length < 32) { add(0xa0 + buf.length); }
        else if (buf.length < 0x100) { add(0xd9); add(buf.length); }
        else if (buf.length < 0x10000) { add(0xda); add((buf.length >> 8) & 0xff); add(buf.length & 0xff); }
        else { add(0xdb); addBytes([(buf.length >> 24) & 0xff, (buf.length >> 16) & 0xff, (buf.length >> 8) & 0xff, buf.length & 0xff]); }
        addBytes(Array.from(buf));
        return;
      }
      if (Array.isArray(val)) {
        if (val.length < 16) { add(0x90 + val.length); }
        else if (val.length < 0x10000) { add(0xdc); add((val.length >> 8) & 0xff); add(val.length & 0xff); }
        else { add(0xdd); addBytes([(val.length >> 24) & 0xff, (val.length >> 16) & 0xff, (val.length >> 8) & 0xff, val.length & 0xff]); }
        val.forEach(encode);
        return;
      }
      if (typeof val === 'object') {
        const entries = Object.entries(val as Record<string, unknown>);
        if (entries.length < 16) { add(0x80 + entries.length); }
        else if (entries.length < 0x10000) { add(0xde); add((entries.length >> 8) & 0xff); add(entries.length & 0xff); }
        else { add(0xdf); addBytes([(entries.length >> 24) & 0xff, (entries.length >> 16) & 0xff, (entries.length >> 8) & 0xff, entries.length & 0xff]); }
        for (const [k, v] of entries) {
          encode(k);
          encode(v);
        }
      }
    };
    encode(obj);
    return new Uint8Array(bytes);
  };

  const decodeMsgpack = (bytes: Uint8Array): unknown => {
    let pos = 0;
    const peek = () => bytes[pos];
    const next = () => bytes[pos++];
    const readInt = (n: number) => { let v = 0; for (let i = 0; i < n; i++) v = v * 256 + bytes[pos++]; return v; };

    const decode = (): unknown => {
      const b = next();
      if (b < 0x80) return b;
      if (b >= 0xe0 && b < 0x100) return b - 0xe0 - 32;
      if (b === 0xc0) return null;
      if (b === 0xc2) return false;
      if (b === 0xc3) return true;
      if (b === 0xcc) return readInt(1);
      if (b === 0xcd) return readInt(2);
      if (b === 0xce) return readInt(4);
      if (b === 0xcf) return readInt(8);
      if (b === 0xca) { const v = new DataView(bytes.buffer, pos, 4).getFloat32(0); pos += 4; return v; }
      if (b === 0xcb) { const v = new DataView(bytes.buffer, pos, 8).getFloat64(0); pos += 8; return v; }
      if (b === 0xd9) { const len = readInt(1); const s = new TextDecoder().decode(bytes.slice(pos, pos + len)); pos += len; return s; }
      if (b === 0xda) { const len = readInt(2); const s = new TextDecoder().decode(bytes.slice(pos, pos + len)); pos += len; return s; }
      if (b === 0xdb) { const len = readInt(4); const s = new TextDecoder().decode(bytes.slice(pos, pos + len)); pos += len; return s; }
      if (b === 0xa0) return new TextDecoder().decode(bytes.slice(pos, pos + (b - 0xa0)));
      if (b >= 0xa0 && b < 0xc0) { const s = new TextDecoder().decode(bytes.slice(pos, pos + (b - 0xa0))); pos += b - 0xa0; return s; }
      if (b >= 0x90 && b < 0xa0) { const len = b - 0x90; const arr: unknown[] = []; for (let i = 0; i < len; i++) arr.push(decode()); return arr; }
      if (b === 0xdc) { const len = readInt(2); const arr: unknown[] = []; for (let i = 0; i < len; i++) arr.push(decode()); return arr; }
      if (b === 0xdd) { const len = readInt(4); const arr: unknown[] = []; for (let i = 0; i < len; i++) arr.push(decode()); return arr; }
      if (b >= 0x80 && b < 0x90) { const len = b - 0x80; const obj: Record<string, unknown> = {}; for (let i = 0; i < len; i++) { const k = decode() as string; obj[k] = decode(); } return obj; }
      if (b === 0xde) { const len = readInt(2); const obj: Record<string, unknown> = {}; for (let i = 0; i < len; i++) { const k = decode() as string; obj[k] = decode(); } return obj; }
      if (b === 0xdf) { const len = readInt(4); const obj: Record<string, unknown> = {}; for (let i = 0; i < len; i++) { const k = decode() as string; obj[k] = decode(); } return obj; }
      return null;
    };

    return decode();
  };

  const toHex = (bytes: Uint8Array): string => Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');

  const handleConvert = () => {
    if (!input.trim()) return;
    try {
      if (mode === 'encode') {
        const obj = JSON.parse(input);
        const bytes = encodeMsgpack(obj);
        setOutput(toHex(bytes));
      } else {
        const hex = input.replace(/\s/g, '');
        const bytes = new Uint8Array(hex.match(/.{2}/g)!.map(h => parseInt(h, 16)));
        const obj = decodeMsgpack(bytes);
        setOutput(JSON.stringify(obj, null, 2));
      }
      setError('');
    } catch (err) {
      setError((err as Error).message);
      setOutput('');
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    setInput(output);
    setOutput('');
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-slate-900 dark:to-violet-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">MessagePack 编码/解码</h1>
            <p className="text-slate-600 dark:text-slate-400">高效二进制序列化格式，比JSON更紧凑</p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button onClick={() => { setMode('encode'); setOutput(''); setError(''); }} className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'encode' ? 'bg-white dark:bg-slate-700 text-violet-600 shadow-sm' : 'text-slate-500'}`}>编码</button>
                <button onClick={() => { setMode('decode'); setOutput(''); setError(''); }} className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'decode' ? 'bg-white dark:bg-slate-700 text-violet-600 shadow-sm' : 'text-slate-500'}`}>解码</button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">{mode === 'encode' ? '输入JSON' : '输入Hex'}</label>
                  <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="text-sm text-slate-500 flex items-center gap-1"><RefreshCw className="w-4 h-4" /> 清空</button>
                </div>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encode' ? '{"key": "value"}' : 'c0 a3 6b 65 79'} className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 resize-none font-mono focus:outline-none focus:ring-2 focus:ring-violet-500" />
                <button onClick={handleConvert} className="mt-4 w-full py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold rounded-xl">{mode === 'encode' ? '编码' : '解码'}</button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">{mode === 'encode' ? 'Hex结果' : 'JSON结果'}</label>
                  <div className="flex gap-2">
                    <button onClick={handleSwap} className="text-sm text-slate-500 flex items-center gap-1"><RefreshCw className="w-4 h-4" /> 交换</button>
                    <button onClick={handleCopy} className={`text-sm flex items-center gap-1 ${copied ? 'text-green-600' : 'text-slate-500'}`}>{copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}</button>
                  </div>
                </div>
                <textarea value={error || output} readOnly placeholder="结果将在此显示..." className={`w-full h-64 p-4 rounded-xl border resize-none font-mono ${error ? 'border-red-300 bg-red-50 text-red-600' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'}`} />
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Info className="w-5 h-5 text-violet-500" /> MessagePack 说明</h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-slate-600 dark:text-slate-400">
              <ul className="list-disc list-inside space-y-2">
                <li>MessagePack是一种高效的二进制序列化格式</li>
                <li>比JSON更紧凑，编码后体积通常减少30%-50%</li>
                <li>支持几乎所有JSON数据类型</li>
                <li>广泛应用于Redis、消息队列等场景</li>
                <li>支持多种编程语言</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
