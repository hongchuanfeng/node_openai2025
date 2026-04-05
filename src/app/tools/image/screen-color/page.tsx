'use client';

import { useState, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Crosshair, Download, Copy, Check, Info } from 'lucide-react';

export default function ScreenColorPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [color, setColor] = useState('#4f46e5');
  const [copied, setCopied] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const startCapture = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCapturing(true);
    } catch {
      alert('无法获取屏幕内容，请刷新后重试。');
    }
  };

  const stopCapture = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    setStream(null);
    setIsCapturing(false);
  };

  const pickColor = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !stream) return;

    const ctx = canvas.getContext('2d')!;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const centerX = Math.floor(canvas.width / 2);
    const centerY = Math.floor(canvas.height / 2);
    const pixel = ctx.getImageData(centerX, centerY, 1, 1).data;
    const hex = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`;
    setColor(hex);
  }, [stream]);

  const copyColor = async () => {
    await navigator.clipboard.writeText(color.toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rgb = {
    r: parseInt(color.slice(1, 3), 16),
    g: parseInt(color.slice(3, 5), 16),
    b: parseInt(color.slice(5, 7), 16),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-700 via-zinc-700 to-gray-800 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-gray-400 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Crosshair className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">屏幕颜色拾取</h1>
            </div>
            <p className="text-slate-300 text-lg">共享屏幕后拾取任意位置的颜色</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Screen capture */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
              <div className="relative bg-black aspect-video flex items-center justify-center">
                {stream ? (
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center text-slate-400">
                    <Crosshair className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-sm">点击下方按钮开始捕获屏幕</p>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="p-6 flex gap-3">
                {!stream ? (
                  <button onClick={startCapture} className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all">
                    捕获屏幕
                  </button>
                ) : (
                  <>
                    <button onClick={pickColor} className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all">
                      拾取中心颜色
                    </button>
                    <button onClick={stopCapture} className="py-3 px-6 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                      停止
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Color result */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl shadow-lg shrink-0" style={{ backgroundColor: color }} />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white">{color.toUpperCase()}</span>
                    <button onClick={copyColor} className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg transition-colors ${copied ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                      {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                      <div className="text-xs text-slate-400 mb-1">RGB</div>
                      <div className="font-mono font-medium text-slate-900 dark:text-white">{rgb.r}, {rgb.g}, {rgb.b}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                      <div className="text-xs text-slate-400 mb-1">HSL</div>
                      <div className="font-mono font-medium text-slate-900 dark:text-white">
                        {(() => {
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
                          return `${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
                        })()}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                      <div className="text-xs text-slate-400 mb-1">CMYK</div>
                      <div className="font-mono font-medium text-slate-900 dark:text-white">
                        {(() => {
                          const r1 = rgb.r / 255, g1 = rgb.g / 255, b1 = rgb.b / 255;
                          const k = 1 - Math.max(r1, g1, b1);
                          if (k === 1) return '0%, 0%, 0%, 100%';
                          return `${Math.round((1 - r1) / (1 - k) * 100)}%, ${Math.round((1 - g1) / (1 - k) * 100)}%, ${Math.round((1 - b1) / (1 - k) * 100)}%, ${Math.round(k * 100)}%`;
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  使用提示：点击「捕获屏幕」后会弹出屏幕共享选择，请选择要拾取颜色的窗口或整个屏幕。
                  共享后点击「拾取中心颜色」可拾取屏幕中心点的颜色。
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
