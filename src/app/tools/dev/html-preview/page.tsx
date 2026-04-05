'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RefreshCw, Info, AlertTriangle, Play, Code, Eye } from 'lucide-react';

export default function HtmlPreviewPage() {
  const [input, setInput] = useState('');
  const [preview, setPreview] = useState('');
  const [mode, setMode] = useState<'split' | 'code' | 'preview'>('split');
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'preview' || mode === 'split') {
      setPreview(input);
    }
  }, [input, mode]);

  const handleFormat = () => {
    try {
      let formatted = input
        .replace(/></g, '>\n<')
        .replace(/(<\/?[a-z][a-z0-9]*)\s+/gi, '$1\n  ')
        .replace(/\s{2,}/g, ' ');
      
      const tags: string[] = [];
      let result = '';
      let indent = 0;
      
      formatted = formatted.replace(/>([^<]*)</g, (match, content) => {
        if (content.trim()) {
          return '>' + content.trim() + '<';
        }
        return match;
      });

      setInput(formatted);
      setError('');
    } catch {
      setError('格式化失败');
    }
  };

  const handleMinify = () => {
    try {
      const minified = input
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .replace(/\s+\/>/g, '/>')
        .trim();
      setInput(minified);
      setError('');
    } catch {
      setError('压缩失败');
    }
  };

  const handleClear = () => {
    setInput('');
    setPreview('');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              HTML代码调试预览
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              在线编写、预览和调试HTML代码，支持实时预览效果
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                  <button
                    onClick={() => setMode('split')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      mode === 'split'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    分屏
                  </button>
                  <button
                    onClick={() => setMode('code')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      mode === 'code'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    代码
                  </button>
                  <button
                    onClick={() => setMode('preview')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      mode === 'preview'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    预览
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleFormat}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
                >
                  <Code className="w-4 h-4" />
                  格式化
                </button>
                <button
                  onClick={handleMinify}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  压缩
                </button>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  清空
                </button>
              </div>
            </div>

            {(mode === 'split') && (
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-lg font-semibold text-slate-900 dark:text-white">
                      HTML代码
                    </label>
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="在此输入HTML代码..."
                    className="w-full h-[500px] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                  />
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-lg font-semibold text-slate-900 dark:text-white">
                      预览效果
                    </label>
                  </div>
                  <div className="w-full h-[500px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white overflow-auto">
                    <iframe
                      srcDoc={preview}
                      className="w-full h-full border-0"
                      title="HTML Preview"
                      sandbox="allow-scripts"
                    />
                  </div>
                </div>
              </div>
            )}

            {mode === 'code' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    HTML代码
                  </label>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="在此输入HTML代码..."
                  className="w-full h-[600px] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                />
              </div>
            )}

            {mode === 'preview' && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    预览效果
                  </label>
                </div>
                <div className="w-full h-[600px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white overflow-auto">
                  <iframe
                    srcDoc={preview}
                    className="w-full h-full border-0"
                    title="HTML Preview"
                    sandbox="allow-scripts"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              快速示例
            </h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <pre className="text-sm text-slate-600 dark:text-slate-400 font-mono">
{`<!DOCTYPE html>
<html>
<head>
  <title>我的网页</title>
  <style>
    body { font-family: Arial; padding: 20px; }
    h1 { color: #333; }
  </style>
</head>
<body>
  <h1>欢迎使用HTML预览工具</h1>
  <p>这是一个示例页面</p>
</body>
</html>`}
              </pre>
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
                代码预览使用iframe沙箱模式，确保安全性
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                支持HTML、CSS、JavaScript的混合编写
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                格式化功能会自动调整代码缩进
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                压缩功能会移除多余空格和换行
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
