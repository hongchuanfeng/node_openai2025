'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RefreshCw, Info, AlertTriangle, Play, Trash2, Copy, Check } from 'lucide-react';

interface LogEntry {
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: Date;
}

export default function JsDebugPage() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const runCode = () => {
    if (!code.trim()) return;
    
    setIsRunning(true);
    setOutput([]);
    setError('');
    
    const logs: LogEntry[] = [];
    
    const customConsole = {
      log: (...args: unknown[]) => {
        logs.push({
          type: 'log',
          message: args.map(arg => formatValue(arg)).join(' '),
          timestamp: new Date(),
        });
      },
      error: (...args: unknown[]) => {
        logs.push({
          type: 'error',
          message: args.map(arg => formatValue(arg)).join(' '),
          timestamp: new Date(),
        });
      },
      warn: (...args: unknown[]) => {
        logs.push({
          type: 'warn',
          message: args.map(arg => formatValue(arg)).join(' '),
          timestamp: new Date(),
        });
      },
      info: (...args: unknown[]) => {
        logs.push({
          type: 'info',
          message: args.map(arg => formatValue(arg)).join(' '),
          timestamp: new Date(),
        });
      },
    };

    try {
      const fn = new Function('console', code);
      fn(customConsole);
      setOutput(logs);
    } catch (err) {
      setError(err instanceof Error ? err.message : '执行错误');
    }
    
    setIsRunning(false);
  };

  const formatValue = (value: unknown): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return String(value);
      }
    }
    return String(value);
  };

  const handleClear = () => {
    setCode('');
    setOutput([]);
    setError('');
  };

  const handleClearOutput = () => {
    setOutput([]);
    setError('');
  };

  const loadExample = (example: string) => {
    if (!example) return;
    setCode(example);
    setError('');
    setTimeout(() => runCode(), 0);
  };

  const examples = [
    {
      name: '基础输出',
      code: `console.log('Hello World!');

const name = '张三';
const age = 18;
console.log('姓名:', name);
console.log('年龄:', age);`,
    },
    {
      name: '数组操作',
      code: `const numbers = [1, 2, 3, 4, 5];
console.log('原数组:', numbers);

const doubled = numbers.map(n => n * 2);
console.log('翻倍:', doubled);

const sum = numbers.reduce((a, b) => a + b, 0);
console.log('求和:', sum);

const filtered = numbers.filter(n => n > 2);
console.log('过滤 > 2:', filtered);`,
    },
    {
      name: '对象操作',
      code: `const user = {
  name: '李四',
  age: 25,
  city: '北京'
};

console.log('用户信息:', user);
console.log('姓名:', user.name);
console.log('属性:', Object.keys(user));

const updated = { ...user, age: 26 };
console.log('更新后:', updated);`,
    },
    {
      name: '字符串处理',
      code: `const text = '  Hello, JavaScript!  ';
console.log('原字符串:', text);
console.log('去空格:', text.trim());
console.log('转大写:', text.toUpperCase());
console.log('长度:', text.length);

const words = text.trim().split(', ');
console.log('分割:', words);

const reversed = text.trim().split('').reverse().join('');
console.log('反转:', reversed);`,
    },
    {
      name: '异步模拟',
      code: `function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

console.log('开始...');
console.log('1秒后执行');
console.log('模拟异步操作完成');`,
    },
  ];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormat = () => {
    try {
      const formatted = code
        .replace(/\s*([{}();,])\s*/g, '$1 ')
        .replace(/\{\s*/g, '{\n  ')
        .replace(/\}\s*/g, '\n}')
        .replace(/;\s*/g, ';\n')
        .trim();
      setCode(formatted);
    } catch {
      setError('格式化失败');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              JS代码调试
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              在线编写和调试JavaScript代码，支持console日志输出
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    JavaScript代码
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">示例：</span>
                    <select
                      onChange={(e) => loadExample(e.target.value)}
                      className="px-2 py-1 text-sm rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                      value=""
                    >
                      <option value="">选择示例...</option>
                      {examples.map((ex, i) => (
                        <option key={i} value={ex.code}>{ex.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleCopy}
                      className={`text-sm flex items-center gap-1 transition-colors ${
                        copied ? 'text-green-600' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                    </button>
                    <button
                      onClick={handleFormat}
                      className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      格式化
                    </button>
                    <button
                      onClick={handleClear}
                      className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      清空
                    </button>
                  </div>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="// 输入JavaScript代码
// 支持 console.log() 输出

console.log('Hello World');
const arr = [1, 2, 3];
console.log('数组:', arr);

function greet(name) {
  return `Hello, ${name}!`;
}
console.log(greet('传道AI'));"
                  className="w-full h-[450px] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                />
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="mt-4 w-full py-3 px-6 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  {isRunning ? '运行中...' : '运行代码'}
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    运行结果
                  </label>
                  <button
                    onClick={handleClearOutput}
                    className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    清空
                  </button>
                </div>
                <div className={`w-full h-[450px] rounded-xl border p-4 overflow-auto font-mono text-sm ${
                  error 
                    ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-600' 
                    : 'border-slate-200 dark:border-slate-700 bg-slate-900 text-slate-100'
                }`}>
                  {error ? (
                    <div className="text-red-500">错误: {error}</div>
                  ) : output.length === 0 ? (
                    <div className="text-slate-500">运行结果将显示在这里...</div>
                  ) : (
                    output.map((entry, index) => (
                      <div key={index} className={`mb-2 ${
                        entry.type === 'error' ? 'text-red-400' :
                        entry.type === 'warn' ? 'text-yellow-400' :
                        entry.type === 'info' ? 'text-blue-400' : 'text-green-400'
                      }`}>
                        <span className="text-slate-500 mr-2">›</span>
                        <span className="whitespace-pre-wrap">{entry.message}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              支持的Console方法
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { method: 'console.log()', desc: '普通日志' },
                { method: 'console.error()', desc: '错误日志' },
                { method: 'console.warn()', desc: '警告日志' },
                { method: 'console.info()', desc: '信息日志' },
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-center">
                  <code className="text-green-600 dark:text-green-400 font-mono text-sm">{item.method}</code>
                  <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                </div>
              ))}
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
                代码在浏览器的沙箱环境中执行，不会影响您的系统安全
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                代码执行是同步的，不支持async/await语法
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                使用console.log()系列方法查看输出结果
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                禁止执行会触发网络请求或修改DOM的代码
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
