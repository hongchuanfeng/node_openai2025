'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info } from 'lucide-react';

export default function YencPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const encodeYenc = (str: string, filename = 'data.bin'): string => {
    const bytes = new TextEncoder().encode(str);
    let result = `=${filename} begin=644 ${filename}\n`;
    let crc = 0xffffffff;
    let lineCount = 0;
    for (const byte of bytes) {
      let encoded = byte + 42;
      if (encoded === 0 || encoded === 13 || encoded === 10 || encoded === 61) {
        encoded = ((byte ^ 64) + 64) % 256;
        result += '=' + String.fromCharCode(encoded);
      } else {
        result += String.fromCharCode(encoded);
      }
      crc = (crc >>> 8) ^ yenc_crc32_table[(crc ^ byte) & 0xff];
      lineCount++;
      if (lineCount >= 128) {
        result += '\n';
        lineCount = 0;
      }
    }
    if (lineCount > 0) result += '\n';
    result += `=${filename} end\n`;
    result += ` CRC32=${(crc ^ 0xffffffff) >>> 0}`;
    return result;
  };

  const yenc_crc32_table = (() => {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      table[i] = c;
    }
    return table;
  })();

  const decodeYenc = (str: string): string => {
    const lines = str.split('\n');
    const bytes: number[] = [];
    for (const line of lines) {
      if (line.startsWith('=') && (line.includes('begin') || line.includes('end') || line.includes('CRC32'))) continue;
      for (let i = 0; i < line.length; i++) {
        let c = line.charCodeAt(i);
        if (c === 61) {
          i++;
          if (i < line.length) {
            c = ((line.charCodeAt(i) - 42) & 0xff);
            if (c === 0 || c === 13 || c === 10 || c === 61) {
              c = ((line.charCodeAt(i) ^ 64) + 64) & 0xff;
            }
          }
        }
        bytes.push(c);
      }
    }
    return new TextDecoder().decode(new Uint8Array(bytes));
  };

  const handleConvert = () => {
    if (!input.trim()) return;
    try {
      if (mode === 'encode') setOutput(encodeYenc(input));
      else setOutput(decodeYenc(input));
      setError('');
    } catch {
      setError('处理失败');
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
        <section className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-900 dark:to-red-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">YEnc 编码/解码</h1>
            <p className="text-slate-600 dark:text-slate-400">Usenet二进制编码格式，支持CRC校验</p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button onClick={() => { setMode('encode'); setOutput(''); setError(''); }} className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'encode' ? 'bg-white dark:bg-slate-700 text-red-600 shadow-sm' : 'text-slate-500'}`}>编码</button>
                <button onClick={() => { setMode('decode'); setOutput(''); setError(''); }} className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'decode' ? 'bg-white dark:bg-slate-700 text-red-600 shadow-sm' : 'text-slate-500'}`}>解码</button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">{mode === 'encode' ? '输入原文' : '输入YEnc编码'}</label>
                  <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="text-sm text-slate-500 flex items-center gap-1"><RefreshCw className="w-4 h-4" /> 清空</button>
                </div>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encode' ? '输入要编码的文本...' : '输入YEnc字符串...'} className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 resize-none font-mono focus:outline-none focus:ring-2 focus:ring-red-500" />
                <button onClick={handleConvert} className="mt-4 w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl">{mode === 'encode' ? '编码' : '解码'}</button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">{mode === 'encode' ? 'YEnc编码结果' : '解码结果'}</label>
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
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Info className="w-5 h-5 text-red-500" /> YEnc 编码说明</h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-slate-600 dark:text-slate-400">
              <ul className="list-disc list-inside space-y-2">
                <li>YEnc是专门为Usenet设计的二进制编码格式</li>
                <li>效率高，编码后数据增加量很小</li>
                <li>内置CRC32校验，可检测传输错误</li>
                <li>主要替代Base64和UUEncode</li>
                <li>被广泛应用于二进制新闻组传输</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
