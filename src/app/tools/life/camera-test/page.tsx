'use client';

import { useRef, useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Camera, CameraOff, RefreshCw, Info } from 'lucide-react';

export default function CameraTestPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const [mirrored, setMirrored] = useState(true);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError('');
        setHasCamera(true);
      }
    } catch (err) {
      setHasCamera(false);
      setError('无法访问摄像头。请确保已授权摄像头权限，或摄像头可能被其他应用占用。');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

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
              <Camera className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">摄像头测试</h1>
            </div>
            <p className="text-violet-100 text-lg">检测摄像头是否正常工作</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              {/* Video preview */}
              <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden mb-6">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${mirrored ? 'scale-x-[-1]' : ''}`}
                />
                {!isStreaming && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                    <CameraOff className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-sm">摄像头未启动</p>
                  </div>
                )}
                {isStreaming && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => setMirrored(m => !m)}
                      className="p-2 rounded-lg bg-white/20 text-white text-xs hover:bg-white/30"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex gap-4">
                {!isStreaming ? (
                  <button
                    onClick={startCamera}
                    className="flex-1 py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all text-lg flex items-center justify-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    启动摄像头
                  </button>
                ) : (
                  <button
                    onClick={stopCamera}
                    className="flex-1 py-4 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold rounded-xl hover:from-red-600 hover:to-rose-600 transition-all text-lg flex items-center justify-center gap-2"
                  >
                    <CameraOff className="w-5 h-5" />
                    关闭摄像头
                  </button>
                )}
              </div>

              {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Status */}
            {isStreaming && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/20 p-4 mb-6 text-center">
                <p className="text-emerald-700 dark:text-emerald-300 font-medium">✅ 摄像头工作正常！</p>
              </div>
            )}

            {/* Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/20 p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <p>使用提示：</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>首次使用需要授权摄像头权限</li>
                    <li>如果摄像头被其他应用占用，请先关闭其他应用</li>
                    <li>部分浏览器可能不支持此功能</li>
                    <li>点击右上角按钮可以切换镜像模式</li>
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
