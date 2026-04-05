'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info, AlertTriangle, ArrowLeftRight } from 'lucide-react';

interface DiffLine {
  type: 'same' | 'added' | 'removed' | 'modified';
  leftLineNum?: number;
  rightLineNum?: number;
  leftContent?: string;
  rightContent?: string;
  content?: string;
}

export default function DiffPage() {
  const [leftText, setLeftText] = useState('');
  const [rightText, setRightText] = useState('');
  const [diffResult, setDiffResult] = useState<DiffLine[]>([]);
  const [showDiff, setShowDiff] = useState(false);
  const [copied, setCopied] = useState(false);

  const computeDiff = () => {
    const leftLines = leftText.split('\n');
    const rightLines = rightText.split('\n');
    const result: DiffLine[] = [];

    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < leftLines.length || rightIndex < rightLines.length) {
      const leftLine = leftLines[leftIndex];
      const rightLine = rightLines[rightIndex];

      if (leftLine === rightLine) {
        result.push({
          type: 'same',
          leftLineNum: leftIndex + 1,
          rightLineNum: rightIndex + 1,
          content: leftLine,
        });
        leftIndex++;
        rightIndex++;
      } else if (leftIndex < leftLines.length && !rightLines.includes(leftLine)) {
        result.push({
          type: 'removed',
          leftLineNum: leftIndex + 1,
          content: leftLine,
        });
        leftIndex++;
      } else if (rightIndex < rightLines.length && !leftLines.includes(rightLine)) {
        result.push({
          type: 'added',
          rightLineNum: rightIndex + 1,
          content: rightLine,
        });
        rightIndex++;
      } else {
        result.push({
          type: 'removed',
          leftLineNum: leftIndex + 1,
          content: leftLine,
        });
        leftIndex++;
        result.push({
          type: 'added',
          rightLineNum: rightIndex + 1,
          content: rightLine,
        });
        rightIndex++;
      }
    }

    setDiffResult(result);
    setShowDiff(true);
  };

  const handleCopy = async () => {
    const text = diffResult.map(line => {
      if (line.type === 'same') return `  ${line.content}`;
      if (line.type === 'removed') return `- ${line.leftContent}`;
      if (line.type === 'added') return `+ ${line.rightContent}`;
      return `  ${line.content}`;
    }).join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setLeftText('');
    setRightText('');
    setDiffResult([]);
    setShowDiff(false);
  };

  const stats = {
    added: diffResult.filter(l => l.type === 'added').length,
    removed: diffResult.filter(l => l.type === 'removed').length,
    same: diffResult.filter(l => l.type === 'same').length,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              字符串对比
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              比较两段文本的差异，高亮显示新增、删除和修改的内容
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    原始文本（左侧）
                  </label>
                  <button
                    onClick={() => setLeftText('')}
                    className="text-sm text-slate-500 hover:text-slate-700"
                  >
                    清空
                  </button>
                </div>
                <textarea
                  value={leftText}
                  onChange={(e) => { setLeftText(e.target.value); setShowDiff(false); }}
                  placeholder="输入原始文本..."
                  className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                />
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    修改后文本（右侧）
                  </label>
                  <button
                    onClick={() => setRightText('')}
                    className="text-sm text-slate-500 hover:text-slate-700"
                  >
                    清空
                  </button>
                </div>
                <textarea
                  value={rightText}
                  onChange={(e) => { setRightText(e.target.value); setShowDiff(false); }}
                  placeholder="输入修改后的文本..."
                  className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={computeDiff}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
              >
                对比差异
              </button>
              <button
                onClick={handleClear}
                className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                清空
              </button>
            </div>

            {showDiff && (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    差异结果
                  </h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-green-500"></span>
                      <span className="text-slate-600 dark:text-slate-400">新增 {stats.added}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-red-500"></span>
                      <span className="text-slate-600 dark:text-slate-400">删除 {stats.removed}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-slate-300 dark:bg-slate-600"></span>
                      <span className="text-slate-600 dark:text-slate-400">相同 {stats.same}</span>
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`ml-auto text-sm flex items-center gap-1 transition-colors ${
                      copied ? 'text-green-600' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="flex border-b border-slate-200 dark:border-slate-700">
                    <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-700/50 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                      原始文本
                    </div>
                    <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-700/50 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                      修改后文本
                    </div>
                  </div>

                  <div className="max-h-[500px] overflow-auto">
                    {diffResult.map((line, i) => (
                      <div key={i} className={`flex border-b border-slate-100 dark:border-slate-800 ${
                        line.type === 'added' ? 'bg-green-50 dark:bg-green-900/10' :
                        line.type === 'removed' ? 'bg-red-50 dark:bg-red-900/10' : ''
                      }`}>
                        <div className="flex-1 p-2 border-r border-slate-100 dark:border-slate-800">
                          {line.type !== 'added' && (
                            <div className="flex items-start gap-2">
                              <span className="text-xs text-slate-400 w-8 text-right shrink-0">
                                {line.leftLineNum}
                              </span>
                              <span className={`font-mono text-sm ${
                                line.type === 'removed' ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'
                              }`}>
                                {line.type === 'same' ? line.content : line.leftContent}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 p-2">
                          {line.type !== 'removed' && (
                            <div className="flex items-start gap-2">
                              <span className="text-xs text-slate-400 w-8 text-right shrink-0">
                                {line.rightLineNum}
                              </span>
                              <span className={`font-mono text-sm ${
                                line.type === 'added' ? 'text-green-600 dark:text-green-400' : 'text-slate-700 dark:text-slate-300'
                              }`}>
                                {line.type === 'same' ? line.content : line.rightContent}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              使用场景
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: '代码对比', desc: '比较代码修改前后的差异' },
                { title: '文档比对', desc: '检查文档内容的修改情况' },
                { title: '版本比较', desc: '对比不同版本文件的区别' },
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
                绿色行表示新增的内容，红色行表示删除的内容
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                灰色行表示两段文本中相同的内容
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                按行进行比较，适合文本文件的对比
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
