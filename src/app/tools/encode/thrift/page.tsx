'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info } from 'lucide-react';

export default function ThriftPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const encodeThrift = (obj: Record<string, unknown>): Uint8Array => {
    const bytes: number[] = [];
    const add = (b: number) => bytes.push(b);
    const addVarint = (v: number) => {
      let val = v < 0 ? v + 0x100000000 : v;
      while (val >= 0x80) {
        add((val & 0x7f) | 0x80);
        val = Math.floor(val / 128);
      }
      add(val);
    };
    const addI64 = (v: bigint) => {
      let val = v;
      for (let i = 0; i < 8; i++) {
        add(Number(val & BigInt(0xff)));
        val = val >> BigInt(8);
      }
    };

    const encode = (val: unknown, fieldType: number, fieldId: number): void => {
      if (val === null || val === undefined) return;
      add(fieldType);
      addVarint(fieldId);
      if (fieldType === 2) { addVarint(Number(val)); }
      else if (fieldType === 3) { addI64(BigInt(val as string | number)); }
      else if (fieldType === 4) { const buf = new ArrayBuffer(8); new DataView(buf).setFloat64(0, val as number); for (const b of new Uint8Array(buf)) add(b); }
      else if (fieldType === 5) { const buf = new ArrayBuffer(8); new DataView(buf).setFloat64(0, val as number); for (const b of new Uint8Array(buf)) add(b); }
      else if (fieldType === 6) { const buf = new TextEncoder().encode(val as string); addVarint(buf.length); for (const b of buf) add(b); }
      else if (fieldType === 7) { const buf = new Uint8Array(val as ArrayBuffer); for (const b of buf) add(b); }
      else if (fieldType === 8) { addVarint((val as boolean) ? 1 : 0); }
      else if (fieldType === 11) { const buf = new TextEncoder().encode(val as string); addVarint(buf.length); for (const b of buf) add(b); }
      else if (fieldType === 15) {
        const start = bytes.length;
        addVarint(0);
        let size = 0;
        for (const item of val as unknown[]) {
          const before = bytes.length;
          encode(item, 3, 0);
          size += bytes.length - before;
        }
        const after = bytes.length;
        bytes[start] = (size + 1) & 0x7f;
        if (size + 1 >= 0x80) {
          let tmp = Math.floor((size + 1) / 0x80);
          bytes[start] |= 0x80;
          let pos = start + 1;
          while (tmp >= 0x80) { bytes[pos++] = (tmp & 0x7f) | 0x80; tmp = Math.floor(tmp / 128); }
          bytes[pos] = tmp;
        }
        add(0);
      }
      else if (fieldType === 13) {
        const start = bytes.length;
        addVarint(0);
        let size = 0;
        for (const item of val as Record<string, unknown>[]) {
          const before = bytes.length;
          encodeStruct(item);
          size += bytes.length - before;
        }
        const after = bytes.length;
        bytes[start] = (size + 1) & 0x7f;
        if (size + 1 >= 0x80) {
          let tmp = Math.floor((size + 1) / 0x80);
          bytes[start] |= 0x80;
          let pos = start + 1;
          while (tmp >= 0x80) { bytes[pos++] = (tmp & 0x7f) | 0x80; tmp = Math.floor(tmp / 128); }
          bytes[pos] = tmp;
        }
        add(0);
      }
    };

    const encodeStruct = (obj: Record<string, unknown>): void => {
      for (const [key, val] of Object.entries(obj)) {
        const fieldId = parseInt(key.replace(/\D/g, '')) || 1;
        let fieldType = 11;
        if (typeof val === 'number' && Number.isInteger(val)) fieldType = 3;
        else if (typeof val === 'number') fieldType = 4;
        else if (typeof val === 'string') fieldType = 11;
        else if (typeof val === 'boolean') fieldType = 2;
        else if (Array.isArray(val)) fieldType = 13;
        encode(val, fieldType, fieldId);
      }
      add(0);
    };

    encodeStruct(obj);
    return new Uint8Array(bytes);
  };

  const toHex = (bytes: Uint8Array): string => Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');

  const handleConvert = () => {
    if (!input.trim()) return;
    try {
      if (mode === 'encode') {
        const obj = JSON.parse(input);
        const bytes = encodeThrift(obj);
        setOutput(toHex(bytes));
      } else {
        setOutput('Thrift解码需要在服务端进行，此处仅显示十六进制');
        const hex = input.replace(/\s/g, '');
        const bytes = new Uint8Array(hex.match(/.{2}/g)!.map(h => parseInt(h, 16)));
        setOutput(toHex(bytes));
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
        <section className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-slate-900 dark:to-yellow-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Thrift 编码/解码</h1>
            <p className="text-slate-600 dark:text-slate-400">Apache Thrift二进制序列化协议</p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button onClick={() => { setMode('encode'); setOutput(''); setError(''); }} className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'encode' ? 'bg-white dark:bg-slate-700 text-yellow-600 shadow-sm' : 'text-slate-500'}`}>编码</button>
                <button onClick={() => { setMode('decode'); setOutput(''); setError(''); }} className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'decode' ? 'bg-white dark:bg-slate-700 text-yellow-600 shadow-sm' : 'text-slate-500'}`}>解码</button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">{mode === 'encode' ? '输入JSON' : '输入Hex'}</label>
                  <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="text-sm text-slate-500 flex items-center gap-1"><RefreshCw className="w-4 h-4" /> 清空</button>
                </div>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encode' ? '{"1": "hello"}' : '08 01 0b 01 00'} className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 resize-none font-mono focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                <button onClick={handleConvert} className="mt-4 w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-semibold rounded-xl">{mode === 'encode' ? '编码' : '解码'}</button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">{mode === 'encode' ? 'Hex结果' : '解码结果'}</label>
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
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Info className="w-5 h-5 text-yellow-500" /> Thrift 说明</h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-slate-600 dark:text-slate-400">
              <ul className="list-disc list-inside space-y-2">
                <li>Apache Thrift是一种跨语言的序列化协议</li>
                <li>使用紧凑的二进制格式，支持多种数据类型</li>
                <li>需要IDL定义文件来生成序列化代码</li>
                <li>常用于微服务间的RPC通信</li>
                <li>Facebook开源，现为Apache项目</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
