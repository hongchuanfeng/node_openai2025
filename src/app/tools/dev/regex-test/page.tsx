'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info, AlertTriangle, Search, X, Flag } from 'lucide-react';

export default function RegexTestPage() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [result, setResult] = useState<{
    isValid: boolean;
    matches: { text: string; index: number; groups?: string[] }[];
    error?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const flagOptions = [
    { value: 'g', label: 'g', desc: '全局匹配' },
    { value: 'i', label: 'i', desc: '忽略大小写' },
    { value: 'm', label: 'm', desc: '多行模式' },
    { value: 's', label: 's', desc: '点号匹配换行' },
    { value: 'u', label: 'u', desc: 'Unicode模式' },
  ];

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''));
    } else {
      setFlags(flags + flag);
    }
  };

  const testRegex = () => {
    if (!pattern) {
      setResult(null);
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const matches: { text: string; index: number; groups?: string[] }[] = [];
      
      if (flags.includes('g')) {
        let match;
        while ((match = regex.exec(testString)) !== null) {
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1).length > 0 ? match.slice(1) : undefined,
          });
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1).length > 0 ? match.slice(1) : undefined,
          });
        }
      }

      setResult({
        isValid: true,
        matches,
      });
    } catch (err) {
      setResult({
        isValid: false,
        matches: [],
        error: err instanceof Error ? err.message : '正则表达式错误',
      });
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pattern);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setPattern('');
    setTestString('');
    setResult(null);
  };

  const highlightMatches = (): { text: string; isMatch: boolean }[] => {
    if (!result || !result.isValid || result.matches.length === 0) {
      return testString ? [{ text: testString, isMatch: false }] : [];
    }

    const parts: { text: string; isMatch: boolean }[] = [];
    let lastIndex = 0;

    const sortedMatches = [...result.matches].sort((a, b) => a.index - b.index);
    
    for (const match of sortedMatches) {
      if (match.index >= lastIndex) {
        if (match.index > lastIndex) {
          parts.push({ text: testString.slice(lastIndex, match.index), isMatch: false });
        }
        parts.push({ text: match.text, isMatch: true });
        lastIndex = match.index + match.text.length;
      }
    }

    if (lastIndex < testString.length) {
      parts.push({ text: testString.slice(lastIndex), isMatch: false });
    }

    return parts;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              在线正则表达式测试
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              测试和调试正则表达式，实时高亮匹配结果
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  正则表达式
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && testRegex()}
                      placeholder="输入正则表达式，如 \\d+"
                      className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        result && !result.isValid 
                          ? 'border-red-500 text-red-600' 
                          : 'border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                      }`}
                    />
                    {pattern && (
                      <button
                        onClick={() => setPattern('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">/</span>
                    <div className="flex gap-1">
                      {flagOptions.map((flag) => (
                        <button
                          key={flag.value}
                          onClick={() => toggleFlag(flag.value)}
                          title={flag.desc}
                          className={`w-8 h-8 rounded font-mono text-sm transition-colors ${
                            flags.includes(flag.value)
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {flag.label}
                        </button>
                      ))}
                    </div>
                    <span className="text-slate-500">/</span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`text-sm flex items-center gap-1 transition-colors ${
                      copied ? 'text-green-600' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                  </button>
                </div>
              </div>

              {result && !result.isValid && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-red-600 dark:text-red-400 text-sm">{result.error}</p>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  测试文本
                </label>
                <textarea
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  placeholder="输入需要匹配的文本..."
                  className="w-full h-40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={testRegex}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  测试匹配
                </button>
                <button
                  onClick={handleClear}
                  className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  清空
                </button>
              </div>
            </div>

            {result && result.isValid && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    匹配结果
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    result.matches.length > 0 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    {result.matches.length} 个匹配
                  </span>
                </div>

                <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl font-mono text-sm whitespace-pre-wrap break-all">
                  {highlightMatches().map((part, i) => (
                    part.isMatch ? (
                      <mark key={i} className="bg-yellow-200 dark:bg-yellow-600/50 text-yellow-900 dark:text-yellow-200 rounded px-0.5">
                        {part.text}
                      </mark>
                    ) : (
                      <span key={i} className="text-slate-700 dark:text-slate-300">{part.text}</span>
                    )
                  ))}
                </div>

                {result.matches.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400">匹配详情</h4>
                    {result.matches.map((match, i) => (
                      <div key={i} className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-slate-500">#{i + 1}</span>
                          <code className="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded">
                            {match.text}
                          </code>
                          <span className="text-slate-500">位置: {match.index}</span>
                        </div>
                        {match.groups && (
                          <div className="mt-2 text-sm text-slate-500">
                            捕获组: {match.groups.map((g, j) => (
                              <span key={j} className="ml-2 text-blue-600 dark:text-blue-400">
                                ${j + 1}: {g}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              常用正则表达式示例
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: '手机号', pattern: '1[3-9]\\d{9}', desc: '中国大陆手机号' },
                { name: '邮箱', pattern: '[\\w.-]+@[\\w.-]+\\.\\w+', desc: '电子邮箱地址' },
                { name: 'URL', pattern: 'https?://[\\w.-]+(?:/[\\w./-]*)?', desc: '网页链接' },
                { name: 'IP地址', pattern: '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}', desc: 'IPv4地址' },
                { name: '身份证', pattern: '[1-9]\\d{5}(?:\\d{2})\\d{10}', desc: '中国大陆身份证' },
                { name: '中文字符', pattern: '[\\u4e00-\\u9fa5]+', desc: '匹配中文字符' },
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                  onClick={() => setPattern(item.pattern)}
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{item.name}</h3>
                  <p className="text-xs text-slate-500 mb-2">{item.desc}</p>
                  <code className="text-xs text-blue-600 dark:text-blue-400 font-mono">{item.pattern}</code>
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
                正则表达式中的特殊字符需要转义，如 \d 需要写成 \\d
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                点击常用示例可以快速填入正则表达式
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                匹配结果会实时高亮显示在测试文本中
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
