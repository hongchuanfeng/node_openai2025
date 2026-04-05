'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tag, Copy, Check } from 'lucide-react';

export default function MetaGeneratorPage() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [kw, setKw] = useState('');
  const [author, setAuthor] = useState('');
  const [viewport, setViewport] = useState('width=device-width, initial-scale=1.0');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const tags = [
      title && `<title>${title}</title>`,
      desc && `<meta name="description" content="${desc}">`,
      kw && `<meta name="keywords" content="${kw}">`,
      author && `<meta name="author" content="${author}">`,
      `<meta name="viewport" content="${viewport}">`,
      `<meta name="robots" content="index, follow">`,
    ].filter(Boolean).join('\n  ');
    setResult(tags);
  };

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-emerald-600 to-green-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-green-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Tag className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">网页Meta标签生成</h1>
            </div>
            <p className="text-teal-100 text-lg">快速生成网页Meta标签代码</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              {[
                { label: '网页标题 (Title)', value: title, set: setTitle, placeholder: '网页标题' },
                { label: '网页描述 (Description)', value: desc, set: setDesc, placeholder: '网页描述内容' },
                { label: '关键词 (Keywords)', value: kw, set: setKw, placeholder: '关键词1, 关键词2, 关键词3' },
                { label: '作者 (Author)', value: author, set: setAuthor, placeholder: '作者名称' },
                { label: 'Viewport', value: viewport, set: setViewport, placeholder: 'width=device-width, initial-scale=1.0' },
              ].map((field, i) => (
                <div key={i} className="mb-4">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">{field.label}</label>
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => field.set(e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              ))}

              <button
                onClick={generate}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-all text-lg mt-2"
              >
                生成 Meta 标签
              </button>
            </div>

            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-sm text-slate-500">生成结果</span>
                  <button onClick={handleCopy} className={`flex items-center gap-1 text-sm transition-colors ${copied ? 'text-green-600' : 'text-slate-500 hover:text-slate-700'}`}>
                    {copied ? <><Check className="w-4 h-4" />已复制</> : <><Copy className="w-4 h-4" />复制代码</>}
                  </button>
                </div>
                <pre className="p-4 text-sm font-mono text-slate-800 dark:text-slate-300 whitespace-pre-wrap break-all">
                  {result}
                </pre>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
