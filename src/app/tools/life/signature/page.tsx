'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PenTool, Download } from 'lucide-react';

export default function SignaturePage() {
  const [text, setText] = useState('传道AI');
  const [color, setColor] = useState('#1a1a1a');
  const [size, setSize] = useState(48);

  const colors = ['#1a1a1a', '#2563eb', '#dc2626', '#059669', '#7c3aed', '#ea580c'];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-purple-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <PenTool className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">电子签名生成器</h1>
            </div>
            <p className="text-violet-100 text-lg">生成个性化电子签名图片</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">签名文字</label>
                <input
                  type="text"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="输入签名文字"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">字体颜色</label>
                <div className="flex gap-2">
                  {colors.map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-10 h-10 rounded-xl border-2 transition-all ${color === c ? 'border-violet-500 ring-2 ring-violet-300' : 'border-slate-200 dark:border-slate-600'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">字体大小：{size}px</label>
                <input type="range" min="24" max="120" value={size} onChange={e => setSize(Number(e.target.value))} className="w-full accent-violet-600" />
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 text-center">
              <div className="mb-4">
                <span className="text-xs text-slate-400">签名预览</span>
              </div>
              <div
                className="min-h-[120px] flex items-center justify-center mb-6 select-all"
                style={{ fontSize: `${size}px`, color, fontFamily: "'STKaiti', 'KaiTi', '楷体', serif", fontStyle: 'italic' }}
              >
                {text}
              </div>
              <p className="text-xs text-slate-400 mb-4">提示：截图或右键保存图片即可使用</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
