'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info, AlertTriangle, HelpCircle } from 'lucide-react';

type Mode = 'json-to-get' | 'get-to-json';

export default function JsonGetPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<Mode>('json-to-get');
  const [error, setError] = useState('');

  const handleTransform = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    setError('');
    
    try {
      if (mode === 'json-to-get') {
        const obj = JSON.parse(input);
        const params = new URLSearchParams();
        const flattenObject = (obj: Record<string, unknown>, prefix = '') => {
          for (const key in obj) {
            const newKey = prefix ? `${prefix}.${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
              flattenObject(obj[key] as Record<string, unknown>, newKey);
            } else {
              params.append(newKey, String(obj[key]));
            }
          }
        };
        flattenObject(obj);
        setOutput(params.toString());
      } else {
        const params = new URLSearchParams(input);
        const result: Record<string, unknown> = {};
        params.forEach((value, key) => {
          const keys = key.split('.');
          let current = result;
          for (let i = 0; i < keys.length - 1; i++) {
            if (!(keys[i] in current)) {
              current[keys[i]] = {};
            }
            current = current[keys[i]] as Record<string, unknown>;
          }
          current[keys[keys.length - 1]] = value;
        });
        setOutput(JSON.stringify(result, null, 2));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '转换错误');
      setOutput('');
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              JSON/GET请求字符串互转
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              JSON对象与URL查询参数字符串之间的相互转换
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  onClick={() => { setMode('json-to-get'); setInput(''); setOutput(''); setError(''); }}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    mode === 'json-to-get'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  JSON → GET
                </button>
                <button
                  onClick={() => { setMode('get-to-json'); setInput(''); setOutput(''); setError(''); }}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    mode === 'get-to-json'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  GET → JSON
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    {mode === 'json-to-get' ? '输入JSON对象' : '输入GET参数字符串'}
                  </label>
                  <button
                    onClick={handleClear}
                    className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    清空
                  </button>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === 'json-to-get' 
                    ? '{\n  "name": "张三",\n  "age": 18\n}' 
                    : 'name=张三&age=18'}
                  className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                />
                <button
                  onClick={handleTransform}
                  className="mt-4 w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  转换
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    {mode === 'json-to-get' ? 'GET参数字符串' : 'JSON对象'}
                  </label>
                  <button
                    onClick={handleCopy}
                    className={`text-sm flex items-center gap-1 transition-colors ${
                      copied
                        ? 'text-green-600'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                  </button>
                </div>
                <textarea
                  value={error || output}
                  readOnly
                  placeholder="转换结果将在此显示..."
                  className={`w-full h-64 p-4 rounded-xl border resize-none font-mono text-sm ${
                    error
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-600'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white'
                  }`}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              示例
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">JSON → GET</h3>
                <pre className="text-sm text-slate-600 dark:text-slate-400 font-mono">
{`输入:
{
  "name": "张三",
  "age": 18
}

输出:
name=张三&age=18`}
                </pre>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">GET → JSON</h3>
                <pre className="text-sm text-slate-600 dark:text-slate-400 font-mono">
{`输入:
name=张三&age=18

输出:
{
  "name": "张三",
  "age": "18"
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              注意事项
            </h2>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                JSON中的嵌套对象会使用点号分隔符转换为GET参数
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                GET参数的值会自动进行URL编码
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                转换后的GET参数可以直接用于URL查询字符串
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
