'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import jsQR from 'jsqr';
import { Html5Qrcode } from 'html5-qrcode';
import { Upload, Scan, Copy, Check, Info, Camera, Image, X } from 'lucide-react';

export default function QRCodeDecoder() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [decodedResult, setDecodedResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setDecodedResult(null);
    setError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const decodeImage = async () => {
    if (!selectedFile) return;
    setIsDecoding(true);
    setError(null);
    setDecodedResult(null);

    try {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(selectedFile);

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('图片加载失败'));
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('无法创建画布上下文');
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code) {
        setDecodedResult(code.data);
      } else {
        setError('未能识别到二维码，请确保图片清晰且包含二维码');
      }
    } catch (err) {
      console.error('解码错误:', err);
      setError('识别失败，请确保图片清晰且包含二维码');
    }
    setIsDecoding(false);
  };

  const startCamera = async () => {
    setShowCamera(true);
    setError(null);
    setDecodedResult(null);

    try {
      const html5QrCode = new Html5Qrcode('camera-preview');
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          setDecodedResult(decodedText);
          stopCamera();
        },
        () => {}
      );
      setIsScanning(true);
    } catch (err) {
      setError('无法访问摄像头，请确保已授予摄像头权限');
      setShowCamera(false);
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {}
    }
    setIsScanning(false);
    setShowCamera(false);
  };

  const handleCopy = async () => {
    if (!decodedResult) return;
    await navigator.clipboard.writeText(decodedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDecodedResult(null);
    setError(null);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              二维码识别
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              上传图片或使用摄像头扫描，识别二维码中的内容
            </p>
          </div>
        </section>

        {/* Tool Section */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                {/* Image Upload */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    上传图片
                  </h3>

                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                      isDragging
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Upload className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                    <p className="text-slate-600 dark:text-slate-400">
                      点击或拖拽图片到此处
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      支持 JPG、PNG、GIF 等格式
                    </p>
                  </div>

                  {previewUrl && (
                    <div className="mt-4 relative">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full max-h-64 object-contain rounded-lg bg-gray-50 dark:bg-slate-900"
                      />
                      <button
                        onClick={handleClear}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {selectedFile && (
                    <button
                      onClick={decodeImage}
                      disabled={isDecoding}
                      className="mt-4 w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isDecoding ? (
                        <>
                          <Scan className="w-5 h-5 animate-spin" />
                          识别中...
                        </>
                      ) : (
                        <>
                          <Scan className="w-5 h-5" />
                          识别二维码
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Camera Section */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      摄像头扫描
                    </h3>
                    {showCamera && isScanning && (
                      <button
                        onClick={stopCamera}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        停止扫描
                      </button>
                    )}
                  </div>

                  {!showCamera ? (
                    <button
                      onClick={startCamera}
                      className="w-full py-4 px-6 border-2 border-blue-500 text-blue-500 font-semibold rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      打开摄像头
                    </button>
                  ) : (
                    <div className="relative">
                      <div
                        id="camera-preview"
                        className="w-full aspect-square bg-black rounded-lg overflow-hidden"
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-48 h-48 border-2 border-blue-500 rounded-lg" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Result Section */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    识别结果
                  </h3>
                  {decodedResult && (
                    <button
                      onClick={handleCopy}
                      className={`text-sm flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                        copied
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? '已复制' : '复制'}
                    </button>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-6 min-h-[200px] flex items-center justify-center">
                  {error ? (
                    <div className="text-center text-red-500">
                      <Info className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>{error}</p>
                    </div>
                  ) : decodedResult ? (
                    <div className="w-full">
                      <p className="text-sm text-slate-500 mb-2">识别内容：</p>
                      <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <p className="text-slate-900 dark:text-white break-all font-mono text-sm">
                          {decodedResult}
                        </p>
                      </div>
                      {decodedResult.startsWith('http') && (
                        <a
                          href={decodedResult}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm"
                        >
                          <Info className="w-4 h-4" />
                          打开链接
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-slate-400">
                      <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>上传图片或使用摄像头扫描</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              使用说明
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">图片识别</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>1. 点击上传区域或拖拽图片</li>
                  <li>2. 确保图片清晰，二维码完整可见</li>
                  <li>3. 点击"识别二维码"按钮</li>
                  <li>4. 查看识别结果并复制使用</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">摄像头扫描</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>1. 点击"打开摄像头"按钮</li>
                  <li>2. 允许浏览器访问摄像头</li>
                  <li>3. 将二维码对准扫描框</li>
                  <li>4. 识别成功后自动显示结果</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
