'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Download, Copy, Check, RefreshCw } from 'lucide-react';

export default function RGBHexPage() {
  const [color, setColor] = useState('#3B82F6');
  const [rgb, setRgb] = useState('rgb(59, 130, 246)');
  const [copied, setCopied] = useState('');
  const [format, setFormat] = useState<'hex' | 'rgb' | 'hsl'>('hex');

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const handleColorChange = (value: string) => {
    setColor(value);
    if (format === 'hex') {
      const rgbVal = hexToRgb(value);
      if (rgbVal) {
        setRgb(`rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b})`);
      }
    }
  };

  const handleFormatChange = (newFormat: 'hex' | 'rgb' | 'hsl') => {
    setFormat(newFormat);
    const rgbVal = hexToRgb(color);
    if (!rgbVal) return;

    if (newFormat === 'rgb') {
      setRgb(`rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b})`);
    } else if (newFormat === 'hsl') {
      const hsl = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
      setRgb(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
    } else {
      setRgb(color);
    }
  };

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const presetColors = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
    '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
    '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
    '#EC4899', '#F43F5E', '#000000', '#FFFFFF', '#6B7280',
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              RGB/HEX颜色转换
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              在RGB、HEX、HSL等多种颜色格式之间转换
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div
                    className="w-48 h-48 rounded-xl border-4 border-slate-200 dark:border-slate-700 shadow-lg"
                    style={{ backgroundColor: color }}
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                      选择颜色
                    </label>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-full h-12 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {presetColors.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleColorChange(c)}
                        className="w-8 h-8 rounded-lg border-2 border-slate-200 dark:border-slate-600 hover:scale-110 transition-transform"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {(['hex', 'rgb', 'hsl'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => handleFormatChange(f)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          format === f
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {f.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={format === 'hex' ? color : format === 'rgb' ? `rgb(${hexToRgb(color)?.r}, ${hexToRgb(color)?.g}, ${hexToRgb(color)?.b})` : ''}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                    <button
                      onClick={() => handleCopy(format === 'hex' ? color : rgb, 'main')}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    >
                      {copied === 'main' ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">所有格式</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { label: 'HEX', value: color },
                  { label: 'RGB', value: `rgb(${hexToRgb(color)?.r}, ${hexToRgb(color)?.g}, ${hexToRgb(color)?.b})` },
                  { label: 'HSL', value: (() => {
                    const rgbVal = hexToRgb(color);
                    if (!rgbVal) return '';
                    const hsl = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
                    return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
                  })() },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="text-sm text-slate-500 w-12">{item.label}</span>
                    <code className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm font-mono">
                      {item.value}
                    </code>
                    <button
                      onClick={() => handleCopy(item.value, item.label)}
                      className="p-2 text-slate-400 hover:text-slate-600"
                    >
                      {copied === item.label ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
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
