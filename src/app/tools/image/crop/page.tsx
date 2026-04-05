'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Download, Crop, Move, Maximize2 } from 'lucide-react';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

type DragMode = 'none' | 'move' | 'resize-nw' | 'resize-ne' | 'resize-sw' | 'resize-se' | 'resize-n' | 'resize-s' | 'resize-e' | 'resize-w' | 'new';

export default function ImageCropPage() {
  const [image, setImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ w: 0, h: 0 });
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 });
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
  const [result, setResult] = useState<string | null>(null);
  
  const [dragMode, setDragMode] = useState<DragMode>('none');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialCrop, setInitialCrop] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const src = ev.target?.result as string;
      setImage(src);
      setResult(null);
      const img = new window.Image();
      img.onload = () => {
        setImageSize({ w: img.width, h: img.height });
        // 计算显示尺寸 (最大 600px)
        const maxW = 600;
        const scale = Math.min(maxW / img.width, maxW / img.height, 1);
        const dw = img.width * scale;
        const dh = img.height * scale;
        setDisplaySize({ w: dw, h: dh });
        imgRef.current = img;
        // 默认选择中央区域
        const cw = Math.min(dw * 0.6, img.width);
        const ch = Math.min(dh * 0.6, img.height);
        setCropArea({
          x: (dw - cw) / 2,
          y: (dh - ch) / 2,
          width: cw,
          height: ch,
        });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }, []);

  const getMousePos = (e: React.MouseEvent): { x: number; y: number } => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const getCursor = (pos: { x: number; y: number }): DragMode => {
    const { x, y } = cropArea;
    const w = cropArea.width;
    const h = cropArea.height;
    const threshold = 10;

    // 检查四个角
    if (pos.x < x && pos.y < y) return 'resize-nw';
    if (pos.x > x + w && pos.y < y) return 'resize-ne';
    if (pos.x < x && pos.y > y + h) return 'resize-sw';
    if (pos.x > x + w && pos.y > y + h) return 'resize-se';
    
    // 检查四条边
    if (Math.abs(pos.y - y) < threshold && pos.x > x && pos.x < x + w) return 'resize-n';
    if (Math.abs(pos.y - (y + h)) < threshold && pos.x > x && pos.x < x + w) return 'resize-s';
    if (Math.abs(pos.x - x) < threshold && pos.y > y && pos.y < y + h) return 'resize-w';
    if (Math.abs(pos.x - (x + w)) < threshold && pos.y > y && pos.y < y + h) return 'resize-e';
    
    // 检查是否在区域内
    if (pos.x > x && pos.x < x + w && pos.y > y && pos.y < y + h) return 'move';
    
    return 'new';
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const pos = getMousePos(e);
    const mode = getCursor(pos);
    setDragMode(mode);
    setDragStart(pos);
    setInitialCrop({ ...cropArea });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = getMousePos(e);
    
    // 更新鼠标样式
    if (containerRef.current) {
      const mode = getCursor(pos);
      const cursorMap: Record<DragMode, string> = {
        none: 'default',
        move: 'move',
        'resize-nw': 'nw-resize',
        'resize-ne': 'ne-resize',
        'resize-sw': 'sw-resize',
        'resize-se': 'se-resize',
        'resize-n': 'n-resize',
        'resize-s': 's-resize',
        'resize-e': 'e-resize',
        'resize-w': 'w-resize',
        new: 'crosshair',
      };
      containerRef.current.style.cursor = cursorMap[mode];
    }

    if (dragMode === 'none') return;
    
    const dx = pos.x - dragStart.x;
    const dy = pos.y - dragStart.y;
    
    let newCrop = { ...initialCrop };
    
    if (dragMode === 'new') {
      // 创建新的裁剪区域
      newCrop = {
        x: Math.min(pos.x, dragStart.x),
        y: Math.min(pos.y, dragStart.y),
        width: Math.abs(dx),
        height: Math.abs(dy),
      };
    } else if (dragMode === 'move') {
      newCrop.x = Math.max(0, Math.min(initialCrop.x + dx, displaySize.w - newCrop.width));
      newCrop.y = Math.max(0, Math.min(initialCrop.y + dy, displaySize.h - newCrop.height));
    } else {
      // 调整大小
      switch (dragMode) {
        case 'resize-nw':
          newCrop.x = initialCrop.x + dx;
          newCrop.y = initialCrop.y + dy;
          newCrop.width = Math.max(20, initialCrop.width - dx);
          newCrop.height = Math.max(20, initialCrop.height - dy);
          break;
        case 'resize-ne':
          newCrop.y = initialCrop.y + dy;
          newCrop.width = Math.max(20, initialCrop.width + dx);
          newCrop.height = Math.max(20, initialCrop.height - dy);
          break;
        case 'resize-sw':
          newCrop.x = initialCrop.x + dx;
          newCrop.width = Math.max(20, initialCrop.width - dx);
          newCrop.height = Math.max(20, initialCrop.height + dy);
          break;
        case 'resize-se':
          newCrop.width = Math.max(20, initialCrop.width + dx);
          newCrop.height = Math.max(20, initialCrop.height + dy);
          break;
        case 'resize-n':
          newCrop.y = initialCrop.y + dy;
          newCrop.height = Math.max(20, initialCrop.height - dy);
          break;
        case 'resize-s':
          newCrop.height = Math.max(20, initialCrop.height + dy);
          break;
        case 'resize-e':
          newCrop.width = Math.max(20, initialCrop.width + dx);
          break;
        case 'resize-w':
          newCrop.x = initialCrop.x + dx;
          newCrop.width = Math.max(20, initialCrop.width - dx);
          break;
      }
    }
    
    // 边界限制
    newCrop.x = Math.max(0, Math.min(newCrop.x, displaySize.w - 20));
    newCrop.y = Math.max(0, Math.min(newCrop.y, displaySize.h - 20));
    newCrop.width = Math.max(20, Math.min(newCrop.width, displaySize.w - newCrop.x));
    newCrop.height = Math.max(20, Math.min(newCrop.height, displaySize.h - newCrop.y));
    
    setCropArea(newCrop);
  };

  const handleMouseUp = () => {
    setDragMode('none');
  };

  const apply = () => {
    if (!image) return;
    const canvas = canvasRef.current;
    if (!canvas || !imgRef.current) return;
    const ctx = canvas.getContext('2d')!;
    const img = imgRef.current;
    
    // 转换为实际坐标
    const scaleX = imageSize.w / displaySize.w;
    const scaleY = imageSize.h / displaySize.h;
    const sx = cropArea.x * scaleX;
    const sy = cropArea.y * scaleY;
    const sw = cropArea.width * scaleX;
    const sh = cropArea.height * scaleY;
    
    canvas.width = sw;
    canvas.height = sh;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    setResult(canvas.toDataURL('image/png'));
  };

  const download = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result;
    link.download = 'cropped.png';
    link.click();
  };

  const resetCrop = () => {
    if (!displaySize.w) return;
    const cw = displaySize.w * 0.6;
    const ch = displaySize.h * 0.6;
    setCropArea({
      x: (displaySize.w - cw) / 2,
      y: (displaySize.h - ch) / 2,
      width: cw,
      height: ch,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <canvas ref={canvasRef} className="hidden" />
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-lime-600 via-green-600 to-emerald-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-lime-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Crop className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">图片裁剪工具</h1>
            </div>
            <p className="text-lime-100 text-lg">在图片上拖动选择区域进行裁剪</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 上传区域 */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
              {/* 图片预览和裁剪区域 */}
              {image ? (
                <div className="flex items-center justify-center rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900"
                  style={{ width: displaySize.w, height: displaySize.h }}>
                  <div
                    ref={containerRef}
                    className="relative"
                    style={{ width: displaySize.w, height: displaySize.h }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <img
                      src={image}
                      alt="Crop"
                      className="pointer-events-none"
                      style={{ width: displaySize.w, height: displaySize.h }}
                      draggable={false}
                    />
                    
                    {/* 裁剪选择框 - 相对于图片定位 */}
                    <div
                      className="absolute border-2 border-white shadow-lg"
                      style={{
                        left: cropArea.x,
                        top: cropArea.y,
                        width: cropArea.width,
                        height: cropArea.height,
                        backgroundColor: 'transparent',
                        boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
                      }}
                    >
                      {/* 网格线 */}
                      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                        <div className="border-r border-white/30" />
                        <div className="border-r border-white/30" />
                        <div />
                        <div className="border-b border-white/30" />
                        <div className="border-r border-b border-white/30" />
                        <div className="border-b border-white/30" />
                        <div className="border-r border-white/30" />
                        <div className="border-r border-b border-white/30" />
                        <div className="border-b border-white/30" />
                      </div>
                      
                      {/* 调整手柄 */}
                      <div className="absolute -top-1 -left-1 w-3 h-3 bg-white border border-green-500 rounded-sm cursor-nw-resize" />
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border border-green-500 rounded-sm cursor-n-resize" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-white border border-green-500 rounded-sm cursor-ne-resize" />
                      <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-3 h-3 bg-white border border-green-500 rounded-sm cursor-w-resize" />
                      <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-3 h-3 bg-white border border-green-500 rounded-sm cursor-e-resize" />
                      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border border-green-500 rounded-sm cursor-sw-resize" />
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border border-green-500 rounded-sm cursor-s-resize" />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border border-green-500 rounded-sm cursor-se-resize" />
                    </div>
                  </div>
                </div>
              ) : (
                <label htmlFor="crop-upload" className="relative block w-full bg-slate-100 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors overflow-hidden"
                  style={{ aspectRatio: '16/9' }}>
                  <Upload className="w-16 h-16 text-slate-300 mb-4 mt-8" />
                  <p className="text-slate-400 text-lg font-medium mb-2">点击上传图片</p>
                  <p className="text-slate-300 text-sm mb-8">支持 JPG、PNG、WebP 等格式</p>
                </label>
              )}
              <input id="crop-upload" type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </div>

            {/* 工具栏 */}
            {image && (
              <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Move className="w-4 h-4" />
                    <span>拖动选择区域</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Maximize2 className="w-4 h-4" />
                    <span>拖动边缘调整大小</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={resetCrop}
                    className="px-4 py-2 text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    重置
                  </button>
                  <button
                    onClick={apply}
                    className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all"
                  >
                    应用裁剪
                  </button>
                </div>
              </div>
            )}

            {/* 信息栏 */}
            {image && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">原图尺寸</div>
                    <div className="font-medium text-slate-700 dark:text-slate-300">{imageSize.w} × {imageSize.h}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">裁剪尺寸</div>
                    <div className="font-medium text-slate-700 dark:text-slate-300">
                      {Math.round(cropArea.width * (imageSize.w / displaySize.w))} × {Math.round(cropArea.height * (imageSize.h / displaySize.h))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">选择起点</div>
                    <div className="font-medium text-slate-700 dark:text-slate-300">
                      {Math.round(cropArea.x * (imageSize.w / displaySize.w))}, {Math.round(cropArea.y * (imageSize.h / displaySize.h))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">缩放比例</div>
                    <div className="font-medium text-slate-700 dark:text-slate-300">{Math.round((displaySize.w / imageSize.w) * 100)}%</div>
                  </div>
                </div>
              </div>
            )}

            {/* 预览结果 */}
            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">裁剪预览</h3>
                  <button
                    onClick={download}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all"
                  >
                    <Download className="w-5 h-5" />
                    下载图片
                  </button>
                </div>
                <div className="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                  <img src={result} alt="Result" className="max-w-full max-h-96 object-contain" />
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}