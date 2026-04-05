'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Grid, Download } from 'lucide-react';

export default function MazePage() {
  const [rows, setRows] = useState(21);
  const [cols, setCols] = useState(21);
  const [cellSize, setCellSize] = useState(20);
  const [previewSrc, setPreviewSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);

  const generateMaze = (r: number, c: number, cs: number): string => {
    const w = c * cs, h = r * cs;
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    const grid: boolean[][] = [];
    for (let y = 0; y < r; y++) { grid[y] = []; for (let x = 0; x < c; x++) grid[y][x] = true; }
    const visited: boolean[][] = []; for (let y = 0; y < r; y++) visited[y] = [];
    const stack: [number, number][] = [[1, 1]]; visited[1][1] = true; grid[1][1] = false;
    const dirs = [[0, -2], [2, 0], [0, 2], [-2, 0]];
    while (stack.length > 0) {
      const [x, y] = stack[stack.length - 1];
      const s = dirs.slice().sort(() => Math.random() - 0.5);
      let found = false;
      for (const [dx, dy] of s) {
        const nx = x + dx, ny = y + dy;
        if (nx > 0 && nx < c - 1 && ny > 0 && ny < r - 1 && !visited[ny][nx]) {
          visited[ny][nx] = true;
          grid[y + dy / 2][x + dx / 2] = false;
          grid[ny][nx] = false;
          stack.push([nx, ny]); found = true; break;
        }
      }
      if (!found) stack.pop();
    }
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#1e293b';
    for (let y = 0; y < r; y++) for (let x = 0; x < c; x++) if (grid[y][x]) ctx.fillRect(x * cs, y * cs, cs, cs);
    ctx.fillStyle = '#22c55e'; ctx.fillRect(cs, cs, cs, cs);
    ctx.fillStyle = '#ef4444'; ctx.fillRect((c - 2) * cs, (r - 2) * cs, cs, cs);
    return canvas.toDataURL('image/png');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPreviewSrc(generateMaze(rows, cols, cellSize));
    }
  }, [rows, cols, cellSize]);

  const handleDownload = () => {
    const data = generateMaze(rows, cols, cellSize);
    const link = document.createElement('a');
    link.href = data;
    link.download = `maze-${rows}x${cols}.png`;
    link.click();
  };

  const presets = [
    { label: '小 (15×15)', r: 15, c: 15 },
    { label: '中 (21×21)', r: 21, c: 21 },
    { label: '大 (31×31)', r: 31, c: 31 },
    { label: '超大 (41×41)', r: 41, c: 41 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-pink-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Grid className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">在线生成迷宫图片</h1>
            </div>
            <p className="text-indigo-100 text-lg">生成随机迷宫图案，可下载打印或游戏使用</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-6">迷宫设置</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">行数：{rows}</label>
                      <input type="range" min="5" max="51" step="2" value={rows} onChange={e => setRows(Number(e.target.value))} className="w-full accent-indigo-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">列数：{cols}</label>
                      <input type="range" min="5" max="51" step="2" value={cols} onChange={e => setCols(Number(e.target.value))} className="w-full accent-indigo-600" />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">单元格大小：{cellSize}px</label>
                    <input type="range" min="8" max="40" value={cellSize} onChange={e => setCellSize(Number(e.target.value))} className="w-full accent-indigo-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">预设尺寸</label>
                    <div className="grid grid-cols-2 gap-2">
                      {presets.map(p => (
                        <button key={p.label} onClick={() => { setRows(p.r); setCols(p.c); }} className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button onClick={handleDownload} className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" /> 生成迷宫并下载
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 flex flex-col">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">预览（随机生成，每次不同）</h3>
                <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-auto p-4">
                  {previewSrc ? (
                    <img ref={imgRef} src={previewSrc} alt="Maze" className="max-w-full object-contain rounded" />
                  ) : (
                    <div className="text-slate-400 text-sm">生成中...</div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500 inline-block" /> 起点</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500 inline-block" /> 终点</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-700 inline-block" /> 墙壁</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
