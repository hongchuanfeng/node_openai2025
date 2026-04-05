'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Palette, Copy, Check, Heart } from 'lucide-react';

const presetColors = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#64748b',
];

export default function ColorPickerToolPage() {
  const [color, setColor] = useState('#6366f1');
  const [copied, setCopied] = useState('');

  const rgb = {
    r: parseInt(color.slice(1, 3), 16),
    g: parseInt(color.slice(3, 5), 16),
    b: parseInt(color.slice(5, 7), 16),
  };

  const hsl = (() => {
    const r1 = rgb.r / 255, g1 = rgb.g / 255, b1 = rgb.b / 255;
    const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r1: h = ((g1 - b1) / d + (g1 < b1 ? 6 : 0)) / 6; break;
        case g1: h = ((b1 - r1) / d + 2) / 6; break;
        case b1: h = ((r1 - g1) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  })();

  const copy = async (val: string, key: string) => {
    await navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-pink-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Palette className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">颜色选择器</h1>
            </div>
            <p className="text-purple-100 text-lg">选择颜色，获取 HEX、RGB、HSL、HSV、CMYK 等多种格式</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Color picker */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">选择颜色</label>
                  <input
                    type="color"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    className="w-full h-16 rounded-xl cursor-pointer border-0"
                  />
                </div>

                {/* Preset colors */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">预设颜色</label>
                  <div className="grid grid-cols-9 gap-2">
                    {presetColors.map(c => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-full aspect-square rounded-lg transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-purple-500' : ''}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">输入HEX值</label>
                  <input
                    type="text"
                    value={color.toUpperCase()}
                    onChange={e => {
                      const v = e.target.value;
                      if (/^#[0-9a-fA-F]{6}$/.test(v)) setColor(v.toLowerCase());
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-lg"
                    placeholder="#000000"
                  />
                </div>
              </div>

              {/* Color values */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br rounded-3xl p-8 flex items-center gap-6" style={{ backgroundColor: color }}>
                  <div className="flex-1">
                    <div className="text-white text-4xl font-bold mb-1">{color.toUpperCase()}</div>
                    <div className="text-white/70">当前颜色</div>
                  </div>
                  <Heart className="w-12 h-12 text-white/30" />
                </div>

                {[
                  { label: 'HEX', value: color.toUpperCase(), key: 'hex' },
                  { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, key: 'rgb' },
                  { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, key: 'hsl' },
                  { label: 'HSV', value: (() => {
                    const r1 = rgb.r/255, g1 = rgb.g/255, b1 = rgb.b/255;
                    const max = Math.max(r1,g1,b1), min = Math.min(r1,g1,b1);
                    const v = max, d = max-min, s = max===0?0:d/max;
                    let h = 0;
                    if (max!==min) { switch(max){case r1:h=(g1-b1)/d+(g1<b1?6:0);break;case g1:h=(b1-r1)/d+2;break;case b1:h=(r1-g1)/d+4;break;} h/=6; }
                    return `hsv(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(v*100)}%)`;
                  })(), key: 'hsv' },
                  { label: 'CMYK', value: (() => {
                    const r1=rgb.r/255,g1=rgb.g/255,b1=rgb.b/255;
                    const k=1-Math.max(r1,g1,b1);
                    if(k===1) return 'cmyk(0%, 0%, 0%, 100%)';
                    return `cmyk(${Math.round((1-r1)/(1-k)*100)}%, ${Math.round((1-g1)/(1-k)*100)}%, ${Math.round((1-b1)/(1-k)*100)}%, ${Math.round(k*100)}%)`;
                  })(), key: 'cmyk' },
                ].map(item => (
                  <div key={item.key} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 mr-3">{item.label}</span>
                      <span className="font-mono text-slate-900 dark:text-white">{item.value}</span>
                    </div>
                    <button onClick={() => copy(item.value, item.key)} className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors ${copied === item.key ? 'bg-green-100 text-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                      {copied === item.key ? <><Check className="w-3 h-3" /> 已复制</> : <><Copy className="w-3 h-3" /> 复制</>}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
