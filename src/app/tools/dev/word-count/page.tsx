'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info, AlertTriangle, Hash } from 'lucide-react';

export default function WordCountPage() {
  const [text, setText] = useState('');

  const stats = {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    lines: text ? text.split('\n').length : 0,
    paragraphs: text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0,
    sentences: text.split(/[.!?。！？]+/).filter(s => s.trim()).length,
    chineseChars: (text.match(/[\u4e00-\u9fa5]/g) || []).length,
    englishWords: (text.match(/[a-zA-Z]+/g) || []).length,
    digits: (text.match(/\d/g) || []).length,
    spaces: (text.match(/\s/g) || []).length,
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              在线字数统计
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              统计文本的字符数、字数、行数、段落数等详细信息
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-lg font-semibold text-slate-900 dark:text-white">
                      输入文本
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      >
                        复制
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
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="请输入需要统计的文本..."
                    className="w-full h-[400px] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-6 text-white">
                  <div className="text-sm opacity-80 mb-1">总字符数</div>
                  <div className="text-4xl font-bold">{stats.characters}</div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">字符（不含空格）</span>
                    <span className="font-bold text-slate-900 dark:text-white">{stats.charactersNoSpaces}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">中文字符</span>
                    <span className="font-bold text-slate-900 dark:text-white">{stats.chineseChars}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">英文单词</span>
                    <span className="font-bold text-slate-900 dark:text-white">{stats.englishWords}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">空格数</span>
                    <span className="font-bold text-slate-900 dark:text-white">{stats.spaces}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">数字个数</span>
                    <span className="font-bold text-slate-900 dark:text-white">{stats.digits}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">行数</span>
                    <span className="font-bold text-slate-900 dark:text-white">{stats.lines}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">段落数</span>
                    <span className="font-bold text-slate-900 dark:text-white">{stats.paragraphs}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">句子数</span>
                    <span className="font-bold text-slate-900 dark:text-white">{stats.sentences}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              统计说明
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: '字符数', desc: '包含所有输入的字符，包括中英文、数字、标点符号和空格' },
                { title: '中文字符', desc: '专门统计Unicode范围在\u4e00-\u9fa5之间的汉字数量' },
                { title: '英文单词', desc: '统计连续英文字母组成的单词数量' },
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
                统计结果实时更新，无需点击按钮
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                中文字符统计采用Unicode编码标准
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                段落数以空行作为分隔标志
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
