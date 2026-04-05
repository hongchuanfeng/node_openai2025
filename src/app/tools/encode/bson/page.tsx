'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info } from 'lucide-react';

export default function BsonPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const encodeBson = (obj: unknown): Uint8Array => {
    const bytes: number[] = [];
    const add = (b: number) => bytes.push(b);
    const addInt32 = (v: number) => { add(v & 0xff); add((v >> 8) & 0xff); add((v >> 16) & 0xff); add((v >> 24) & 0xff); };
    const addInt64 = (v: bigint) => {
      let val = v;
      for (let i = 0; i < 8; i++) {
        add(Number(val & BigInt(0xff)));
        val = val >> BigInt(8);
      }
    };
    const addCString = (s: string) => { for (const c of s) add(c.charCodeAt(0)); add(0); };
    const addString = (s: string) => { const buf = new TextEncoder().encode(s); addInt32(buf.length + 1); for (const b of buf) add(b); add(0); };

    const encode = (val: unknown, name?: string): void => {
      if (name) addCString(name);
      if (val === null) { add(0x0a); return; }
      if (typeof val === 'boolean') { add(0x08); add(val ? 1 : 0); return; }
      if (typeof val === 'number') {
        if (Number.isInteger(val) && Math.abs(val) < Number.MAX_SAFE_INTEGER) {
          if (val >= -2147483648 && val <= 2147483647) {
            add(0x10); addInt32(val);
          } else {
            add(0x12); addInt64(BigInt(Math.floor(val)));
          }
        } else {
          add(0x01);
          const buf = new ArrayBuffer(8);
          new DataView(buf).setFloat64(0, val);
          for (const b of new Uint8Array(buf)) add(b);
        }
        return;
      }
      if (typeof val === 'bigint') { add(0x12); addInt64(val); return; }
      if (typeof val === 'string') { add(0x02); addString(val); return; }
      if (val instanceof Uint8Array || val instanceof ArrayBuffer) { add(0x05); const buf = val instanceof ArrayBuffer ? new Uint8Array(val) : val; addInt32(buf.length); for (const b of buf) add(b); return; }
      if (Array.isArray(val)) { add(0x04); const start = bytes.length; addInt32(0); let idx = 0; for (const item of val) encode(item, String(idx++)); const end = bytes.length; const size = end - start; bytes[start] = size & 0xff; bytes[start + 1] = (size >> 8) & 0xff; bytes[start + 2] = (size >> 16) & 0xff; bytes[start + 3] = (size >> 24) & 0xff; add(0x00); return; }
      if (typeof val === 'object') { add(0x03); const start = bytes.length; addInt32(0); for (const [k, v] of Object.entries(val as Record<string, unknown>)) encode(v, k); const end = bytes.length; const size = end - start; bytes[start] = size & 0xff; bytes[start + 1] = (size >> 8) & 0xff; bytes[start + 2] = (size >> 16) & 0xff; bytes[start + 3] = (size >> 24) & 0xff; add(0x00); return; }
    };

    const start = bytes.length;
    addInt32(0);
    if (typeof obj === 'object' && obj !== null) {
      for (const [k, v] of Object.entries(obj as Record<string, unknown>)) encode(v, k);
    }
    add(0x00);
    const end = bytes.length;
    const size = end - start;
    bytes[start] = size & 0xff;
    bytes[start + 1] = (size >> 8) & 0xff;
    bytes[start + 2] = (size >> 16) & 0xff;
    bytes[start + 3] = (size >> 24) & 0xff;
    return new Uint8Array(bytes);
  };

  const decodeBson = (bytes: Uint8Array): Record<string, unknown> => {
    const readInt32 = (pos: number): number => { let v = 0; for (let i = 0; i < 4; i++) v += bytes[pos + i] * Math.pow(256, i); return v; };
    const readInt64 = (pos: number): bigint => { let v = BigInt(0); for (let i = 0; i < 8; i++) v += BigInt(bytes[pos + i]) << BigInt(i * 8); return v; };
    const readCString = (pos: number): { s: string; p: number } => { let s = ''; while (bytes[pos] !== 0) { s += String.fromCharCode(bytes[pos++]); } return { s, p: pos + 1 }; };
    const readString = (pos: number): { s: string; p: number } => { const len = readInt32(pos); const s = new TextDecoder().decode(bytes.slice(pos + 4, pos + 4 + len - 1)); return { s, p: pos + 4 + len }; };

    const decodeDocument = (pos: number): { o: Record<string, unknown>; p: number } => {
      const obj: Record<string, unknown> = {};
      pos += 4;
      while (bytes[pos] !== 0) {
        const type = bytes[pos++];
        const { s: name, p: nameEnd } = readCString(pos);
        pos = nameEnd;
        if (type === 0x01) { const buf = new ArrayBuffer(8); new Uint8Array(buf).set(bytes.slice(pos, pos + 8)); const v = new DataView(buf).getFloat64(0); pos += 8; obj[name] = v; }
        else if (type === 0x02) { const { s, p } = readString(pos); obj[name] = s; pos = p; }
        else if (type === 0x08) { obj[name] = bytes[pos++] !== 0; }
        else if (type === 0x0a) { obj[name] = null; }
        else if (type === 0x10) { obj[name] = readInt32(pos); pos += 4; }
        else if (type === 0x12) { obj[name] = readInt64(pos); pos += 8; }
        else if (type === 0x05) { const len = readInt32(pos); obj[name] = bytes.slice(pos + 4, pos + 4 + len); pos += 4 + len; }
        else if (type === 0x04) { const { o, p } = decodeDocument(pos); obj[name] = o; pos = p; }
        else if (type === 0x03) { const { o, p } = decodeDocument(pos); obj[name] = o; pos = p; }
      }
      pos++;
      return { o: obj, p: pos };
    };

    const { o } = decodeDocument(0);
    return o;
  };

  const toHex = (bytes: Uint8Array): string => Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');

  const handleConvert = () => {
    if (!input.trim()) return;
    try {
      if (mode === 'encode') {
        const obj = JSON.parse(input);
        const bytes = encodeBson(obj);
        setOutput(toHex(bytes));
      } else {
        const hex = input.replace(/\s/g, '');
        const bytes = new Uint8Array(hex.match(/.{2}/g)!.map(h => parseInt(h, 16)));
        const obj = decodeBson(bytes);
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
        <section className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-slate-900 dark:to-cyan-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">BSON 编码/解码</h1>
            <p className="text-slate-600 dark:text-slate-400">MongoDB使用的二进制JSON格式</p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button onClick={() => { setMode('encode'); setOutput(''); setError(''); }} className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'encode' ? 'bg-white dark:bg-slate-700 text-cyan-600 shadow-sm' : 'text-slate-500'}`}>编码</button>
                <button onClick={() => { setMode('decode'); setOutput(''); setError(''); }} className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'decode' ? 'bg-white dark:bg-slate-700 text-cyan-600 shadow-sm' : 'text-slate-500'}`}>解码</button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">{mode === 'encode' ? '输入JSON' : '输入Hex'}</label>
                  <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="text-sm text-slate-500 flex items-center gap-1"><RefreshCw className="w-4 h-4" /> 清空</button>
                </div>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encode' ? '{"key": "value"}' : '1f 00 00 00 02'} className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 resize-none font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                <button onClick={handleConvert} className="mt-4 w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl">{mode === 'encode' ? '编码' : '解码'}</button>
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
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Info className="w-5 h-5 text-cyan-500" /> BSON 说明</h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-slate-600 dark:text-slate-400">
              <ul className="list-disc list-inside space-y-2">
                <li>BSON（Binary JSON）是MongoDB使用的二进制序列化格式</li>
                <li>比JSON支持更多数据类型，如日期、二进制、正则表达式等</li>
                <li>设计用于高效存储和传输</li>
                <li>字段名存储在每个文档中，增加了空间开销</li>
                <li>是JSON的超集，提供了额外的类型支持</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
