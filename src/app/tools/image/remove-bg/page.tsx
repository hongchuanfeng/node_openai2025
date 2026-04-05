'use client';

import { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Download, Scissors, AlertCircle, Wand2, RefreshCw } from 'lucide-react';

export default function RemoveBgPage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tolerance, setTolerance] = useState(35);
  const [iteration, setIteration] = useState(3);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setImage(ev.target?.result as string);
      setResult(null);
      setError('');
    };
    reader.readAsDataURL(file);
  }, []);

  // 欧几里得距离计算颜色差异
  const colorDiff = (c1: number[], c2: number[]): number => {
    return Math.sqrt(
      Math.pow(c1[0] - c2[0], 2) +
      Math.pow(c1[1] - c2[1], 2) +
      Math.pow(c1[2] - c2[2], 2)
    );
  };

  // RGB转HSL
  const rgbToHsl = (r: number, g: number, b: number): number[] => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
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
    return [h * 360, s * 100, l * 100];
  };

  // 从边缘采样获取背景色
  const sampleBackgroundColors = (data: Uint8ClampedArray, width: number, height: number): number[][] => {
    const samples: number[][] = [];
    const step = 3; // 采样间隔
    
    // 遍历四条边
    for (let i = 0; i < width; i += step) {
      // 上边
      const topIdx = (0 * width + i) * 4;
      if (data[topIdx + 3] > 200) { // 只采样不透明的像素
        samples.push([data[topIdx], data[topIdx + 1], data[topIdx + 2]]);
      }
      // 下边
      const bottomIdx = ((height - 1) * width + i) * 4;
      if (data[bottomIdx + 3] > 200) {
        samples.push([data[bottomIdx], data[bottomIdx + 1], data[bottomIdx + 2]]);
      }
    }
    for (let i = 0; i < height; i += step) {
      // 左边
      const leftIdx = (i * width + 0) * 4;
      if (data[leftIdx + 3] > 200) {
        samples.push([data[leftIdx], data[leftIdx + 1], data[leftIdx + 2]]);
      }
      // 右边
      const rightIdx = (i * width + width - 1) * 4;
      if (data[rightIdx + 3] > 200) {
        samples.push([data[rightIdx], data[rightIdx + 1], data[rightIdx + 2]]);
      }
    }
    
    return samples;
  };

  // K-means聚类找出主背景色
  const findDominantBgColors = (samples: number[][], k: number = 3): number[][] => {
    if (samples.length < k) return samples;
    
    // 随机选k个初始中心
    let centers: number[][] = [];
    for (let i = 0; i < k; i++) {
      centers.push([...samples[Math.floor(Math.random() * samples.length)]]);
    }
    
    // 迭代
    for (let iter = 0; iter < 10; iter++) {
      const clusters: number[][][] = Array.from({ length: k }, () => []);
      
      // 分配到最近的聚类
      for (const sample of samples) {
        let minDist = Infinity;
        let minIdx = 0;
        for (let i = 0; i < k; i++) {
          const dist = colorDiff(sample, centers[i]);
          if (dist < minDist) {
            minDist = dist;
            minIdx = i;
          }
        }
        clusters[minIdx].push(sample);
      }
      
      // 更新中心
      let changed = false;
      for (let i = 0; i < k; i++) {
        if (clusters[i].length > 0) {
          const newCenter = [
            Math.round(clusters[i].reduce((s, c) => s + c[0], 0) / clusters[i].length),
            Math.round(clusters[i].reduce((s, c) => s + c[1], 0) / clusters[i].length),
            Math.round(clusters[i].reduce((s, c) => s + c[2], 0) / clusters[i].length),
          ];
          if (colorDiff(centers[i], newCenter) > 1) changed = true;
          centers[i] = newCenter;
        }
      }
      
      if (!changed) break;
    }
    
    // 返回最大的聚类中心（最常见的背景色）
    return centers.filter(c => c.some(v => v > 0));
  };

  // 洪水填充
  const floodFill = (
    data: Uint8ClampedArray,
    width: number,
    height: number,
    bgColors: number[][],
    tol: number,
    visited: Uint8Array
  ): Set<number> => {
    const toRemove = new Set<number>();
    const queue: number[] = [];
    
    // 从边缘所有点开始
    for (let x = 0; x < width; x++) {
      if (!visited[x]) queue.push(x); // 上边
      const bottomIdx = (height - 1) * width + x;
      if (!visited[bottomIdx]) queue.push(bottomIdx); // 下边
    }
    for (let y = 0; y < height; y++) {
      const leftIdx = y * width;
      if (!visited[leftIdx]) queue.push(leftIdx); // 左边
      const rightIdx = y * width + width - 1;
      if (!visited[rightIdx]) queue.push(rightIdx); // 右边
    }
    
    while (queue.length > 0) {
      const idx = queue.shift()!;
      
      if (visited[idx]) continue;
      if (data[idx * 4 + 3] === 0) { // 已经是透明的跳过
        visited[idx] = 1;
        continue;
      }
      
      const pixelColor = [data[idx * 4], data[idx * 4 + 1], data[idx * 4 + 2]];
      
      // 检查是否匹配任意一个背景色
      let isBg = false;
      for (const bg of bgColors) {
        if (colorDiff(pixelColor, bg) <= tol) {
          isBg = true;
          break;
        }
      }
      
      if (!isBg) continue;
      
      visited[idx] = 1;
      toRemove.add(idx);
      
      const x = idx % width;
      const y = Math.floor(idx / width);
      
      // 添加邻居
      if (x > 0 && !visited[idx - 1]) queue.push(idx - 1);
      if (x < width - 1 && !visited[idx + 1]) queue.push(idx + 1);
      if (y > 0 && !visited[idx - width]) queue.push(idx - width);
      if (y < height - 1 && !visited[idx + width]) queue.push(idx + width);
    }
    
    return toRemove;
  };

  const removeBg = () => {
    if (!image) return;
    setLoading(true);
    setError('');
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const width = canvas.width;
      const height = canvas.height;
      
      // 采样背景色
      const samples = sampleBackgroundColors(data, width, height);
      
      if (samples.length < 10) {
        setError('无法检测到有效的背景色，请上传清晰的图片');
        setLoading(false);
        return;
      }
      
      // 找出主要背景色（可能有多个，比如渐变背景）
      const bgColors = findDominantBgColors(samples, 4);
      
      // 多次迭代洪水填充，逐步扩大范围
      const visited = new Uint8Array(width * height);
      let removedPixels = new Set<number>();
      
      for (let i = 0; i < iteration; i++) {
        const currentTol = tolerance + i * 5; // 每次迭代增加容差
        const newRemoved = floodFill(data, width, height, bgColors, currentTol, visited);
        
        // 合并之前和这次的移除结果
        newRemoved.forEach(idx => removedPixels.add(idx));
        
        // 如果这次没有新增，退出
        if (newRemoved.size === 0) break;
      }
      
      // 设置透明
      removedPixels.forEach(idx => {
        data[idx * 4 + 3] = 0;
      });
      
      // 边缘羽化 - 让边界更自然
      const edgeTol = tolerance * 0.8;
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = y * width + x;
          if (data[idx * 4 + 3] > 0) { // 非透明像素
            const pixelColor = [data[idx * 4], data[idx * 4 + 1], data[idx * 4 + 2]];
            
            // 检查是否是边缘透明区域
            const neighbors = [
              (y - 1) * width + x,
              (y + 1) * width + x,
              y * width + (x - 1),
              y * width + (x + 1),
            ];
            
            for (const nIdx of neighbors) {
              if (data[nIdx * 4 + 3] === 0) { // 邻居是透明的
                let isBg = false;
                for (const bg of bgColors) {
                  if (colorDiff(pixelColor, bg) <= edgeTol) {
                    isBg = true;
                    break;
                  }
                }
                if (isBg) {
                  data[idx * 4 + 3] = 0;
                  removedPixels.add(idx);
                  break;
                }
              }
            }
          }
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      setResult(canvas.toDataURL('image/png'));
      setLoading(false);
    };
    
    img.onerror = () => {
      setError('图片加载失败，请尝试其他图片');
      setLoading(false);
    };
    
    img.src = image;
  };

  const download = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result;
    link.download = 'no-bg.png';
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-rose-600 via-pink-600 to-purple-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-pink-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Scissors className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">去除背景</h1>
            </div>
            <p className="text-pink-100 text-lg">智能去除图片背景，生成透明PNG</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6">上传图片</h3>
                <label className="block w-full aspect-video rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  {image ? (
                    <img src={image} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-slate-300 mb-3" />
                      <p className="text-slate-400 text-sm">点击上传图片</p>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>
                <canvas ref={canvasRef} className="hidden" />
                
                {error && (
                  <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-6">参数设置</h3>
                  
                  <div className="mb-4">
                    <label className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                      <span>敏感度</span>
                      <span>{tolerance}</span>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="80"
                      value={tolerance}
                      onChange={e => setTolerance(Number(e.target.value))}
                      className="w-full accent-rose-600"
                    />
                    <p className="text-xs text-slate-400 mt-1">控制去除范围，值越大去除越多</p>
                  </div>
                  
                  <div className="mb-4">
                    <label className="flex justify-between text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                      <span>迭代次数</span>
                      <span>{iteration}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={iteration}
                      onChange={e => setIteration(Number(e.target.value))}
                      className="w-full accent-pink-600"
                    />
                    <p className="text-xs text-slate-400 mt-1">多次填充更彻底，但也可能误伤主体</p>
                  </div>
                  
                  <button
                    onClick={removeBg}
                    disabled={!image || loading}
                    className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Wand2 className="w-5 h-5" />
                    {loading ? '处理中...' : '智能去背景'}
                  </button>
                </div>

                {result && (
                  <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">处理结果</h3>
                    <div className="mb-4 rounded-xl overflow-hidden" style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}>
                      <img src={result} alt="Result" className="w-full" />
                    </div>
                    <button onClick={download} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" /> 下载透明图片
                    </button>
                  </div>
                )}
                
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3">使用技巧</h4>
                  <ul className="space-y-2 text-sm text-slate-500">
                    <li>• <strong>敏感度：</strong>值越大去除范围越大，建议20-40</li>
                    <li>• <strong>迭代次数：</strong>复杂背景可增加迭代次数</li>
                    <li>• 建议使用纯色或渐变背景的图片效果最佳</li>
                  </ul>
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
