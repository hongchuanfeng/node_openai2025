'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info, AlertTriangle, Braces } from 'lucide-react';

export default function JsonViewerPage() {
  const [input, setInput] = useState('');
  const [parsedData, setParsedData] = useState<unknown>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['']));

  const parseAndDisplay = () => {
    if (!input.trim()) {
      setParsedData(null);
      setError('');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setParsedData(parsed);
      setError('');
      const allPaths = new Set<string>(['']);
      collectAllPaths(parsed, '', allPaths);
      setExpandedPaths(allPaths);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'JSON格式错误');
      setParsedData(null);
    }
  };

  const collectAllPaths = (obj: unknown, path: string, paths: Set<string>) => {
    if (Array.isArray(obj)) {
      paths.add(path);
      obj.forEach((item, index) => {
        collectAllPaths(item, `${path}.${index}`, paths);
      });
    } else if (obj !== null && typeof obj === 'object') {
      paths.add(path);
      Object.keys(obj).forEach(key => {
        collectAllPaths((obj as Record<string, unknown>)[key], `${path}.${key}`, paths);
      });
    }
  };

  const expandAll = () => {
    if (parsedData === null) return;
    const allPaths = new Set<string>();
    collectAllPaths(parsedData, '', allPaths);
    setExpandedPaths(allPaths);
  };

  const toggleExpand = (path: string) => {
    const newPaths = new Set(expandedPaths);
    if (newPaths.has(path)) {
      newPaths.delete(path);
    } else {
      newPaths.add(path);
    }
    setExpandedPaths(newPaths);
  };

  const renderValue = (value: unknown, path: string, key?: string, isLast = true): React.ReactNode => {
    const indent = path.split('.').length;
    const indentSpace = '  '.repeat(indent);
    const comma = isLast ? '' : ',';

    if (value === null) {
      return (
        <div className={indent === 0 ? '' : 'pl-4'}>
          <span className="text-slate-600 dark:text-slate-400">{indentSpace}{key && <><span className="text-blue-600 dark:text-blue-400">"{key}"</span>: </>}</span>
          <span className="text-amber-600 dark:text-amber-400">null</span>{comma}
        </div>
      );
    }

    if (typeof value === 'boolean') {
      return (
        <div className={indent === 0 ? '' : 'pl-4'}>
          <span className="text-slate-600 dark:text-slate-400">{indentSpace}{key && <><span className="text-blue-600 dark:text-blue-400">"{key}"</span>: </>}</span>
          <span className="text-amber-600 dark:text-amber-400">{value.toString()}</span>{comma}
        </div>
      );
    }

    if (typeof value === 'number') {
      return (
        <div className={indent === 0 ? '' : 'pl-4'}>
          <span className="text-slate-600 dark:text-slate-400">{indentSpace}{key && <><span className="text-blue-600 dark:text-blue-400">"{key}"</span>: </>}</span>
          <span className="text-green-600 dark:text-green-400">{value}</span>{comma}
        </div>
      );
    }

    if (typeof value === 'string') {
      return (
        <div className={indent === 0 ? '' : 'pl-4'}>
          <span className="text-slate-600 dark:text-slate-400">{indentSpace}{key && <><span className="text-blue-600 dark:text-blue-400">"{key}"</span>: </>}</span>
          <span className="text-green-600 dark:text-green-400">"{value}"</span>{comma}
        </div>
      );
    }

    if (Array.isArray(value)) {
      const isExpanded = expandedPaths.has(path);
      return (
        <div className={indent === 0 ? '' : 'pl-4'}>
          <span className="text-slate-600 dark:text-slate-400">{indentSpace}{key && <><span className="text-blue-600 dark:text-blue-400">"{key}"</span>: </>}</span>
          <button
            onClick={() => toggleExpand(path)}
            className="text-slate-500 hover:text-slate-700 mr-1"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          {isExpanded ? (
            <>
              <span className="text-slate-600 dark:text-slate-400">[</span>
              {value.length === 0 ? (
                <span className="text-slate-600 dark:text-slate-400">]</span>
              ) : (
                <>
                  <div>
                    {value.map((item, i) => (
                      <div key={i}>
                        {renderValue(item, `${path}.${i}`, undefined, i === value.length - 1)}
                      </div>
                    ))}
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">{indentSpace}]</span>
                </>
              )}
              {comma}
            </>
          ) : (
            <span className="text-slate-500"> ... ({value.length} items)</span>
          )}
        </div>
      );
    }

    if (typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>);
      const isExpanded = expandedPaths.has(path);
      return (
        <div className={indent === 0 ? '' : 'pl-4'}>
          <span className="text-slate-600 dark:text-slate-400">{indentSpace}{key && <><span className="text-blue-600 dark:text-blue-400">"{key}"</span>: </>}</span>
          <button
            onClick={() => toggleExpand(path)}
            className="text-slate-500 hover:text-slate-700 mr-1"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          {isExpanded ? (
            <>
              <span className="text-slate-600 dark:text-slate-400">{`{`}</span>
              {entries.length === 0 ? (
                <span className="text-slate-600 dark:text-slate-400">{`}`}</span>
              ) : (
                <>
                  <div>
                    {entries.map(([k, v], i) => (
                      <div key={k}>
                        {renderValue(v, `${path}.${k}`, k, i === entries.length - 1)}
                      </div>
                    ))}
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">{indentSpace}{`}`}</span>
                </>
              )}
              {comma}
            </>
          ) : (
            <span className="text-slate-500"> ...</span>
          )}
        </div>
      );
    }

    return <></>;
  };

  const handleCopy = async () => {
    if (!input) return;
    await navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setParsedData(null);
    setError('');
  };

  const loadExample = (example: string) => {
    setInput(example);
    setError('');
  };

  const examples = [
    {
      name: '简单对象',
      json: JSON.stringify({ name: '张三', age: 18, city: '深圳' }, null, 2),
    },
    {
      name: '嵌套对象',
      json: JSON.stringify({
        user: {
          name: '李四',
          info: {
            email: 'lisi@example.com',
            phone: '13800138000'
          }
        }
      }, null, 2),
    },
    {
      name: '数组对象',
      json: JSON.stringify({
        users: [
          { id: 1, name: '王五' },
          { id: 2, name: '赵六' },
          { id: 3, name: '钱七' }
        ]
      }, null, 2),
    },
    {
      name: '复杂数据',
      json: JSON.stringify({
        code: 200,
        message: 'success',
        data: {
          list: [
            { product: 'iPhone', price: 6999, inStock: true },
            { product: 'iPad', price: 4999, inStock: false },
            { product: 'MacBook', price: 9999, inStock: true }
          ],
          total: 3
        }
      }, null, 2),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              JSON格式化工具
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              美化JSON数据展示，支持展开/折叠节点
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    输入JSON
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
                        <option key={i} value={ex.json}>{ex.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleCopy}
                      className={`text-sm flex items-center gap-1 transition-colors ${
                        copied ? 'text-green-600' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                    </button>
                    <button
                      onClick={handleClear}
                      className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
                    >
                      <RefreshCw className="w-4 h-4" />
                      清空
                    </button>
                  </div>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='{"name": "张三", "age": 18, "city": "深圳"}'
                  className="w-full h-[450px] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                />
                <button
                  onClick={parseAndDisplay}
                  className="mt-4 w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  格式化
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    美化结果
                  </label>
                  <button
                    onClick={expandAll}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    全部展开
                  </button>
                </div>
                <div className={`w-full h-[450px] p-4 rounded-xl border overflow-auto font-mono text-sm bg-slate-50 dark:bg-slate-900 ${
                  error 
                    ? 'border-red-300 text-red-600' 
                    : 'border-slate-200 text-slate-900 dark:text-white'
                }`}>
                  {error ? (
                    <div className="text-red-600">{error}</div>
                  ) : parsedData !== null ? (
                    <pre className="text-xs leading-relaxed">
                      {renderValue(parsedData, '')}
                    </pre>
                  ) : (
                    <div className="text-slate-500">格式化结果将显示在这里...</div>
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
              功能说明
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: '展开/折叠', desc: '点击箭头可以展开或折叠对象和数组' },
                { title: '语法高亮', desc: '不同类型的数据用不同颜色显示' },
                { title: '树形结构', desc: '清晰的层级关系，便于理解复杂数据' },
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
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
                确保输入的JSON格式正确，否则会显示错误信息
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                支持任意嵌套深度的JSON数据
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                数据在浏览器本地处理，不会上传到服务器
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
