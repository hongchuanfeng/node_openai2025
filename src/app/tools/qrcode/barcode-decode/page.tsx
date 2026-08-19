'use client';

import { useState, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Html5Qrcode } from 'html5-qrcode';
import { Upload, Scan, Copy, Check, Info, Camera, Image, X } from 'lucide-react';

export default function BarcodeDecoder() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [decodedResult, setDecodedResult] = useState<string | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [barcodeFormat, setBarcodeFormat] = useState<string | null>(null);
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
    setBarcodeFormat(null);
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
    setBarcodeFormat(null);

    try {
      const html5QrCode = new Html5Qrcode('barcode-preview');
      const result = await html5QrCode.scanFile(selectedFile, false);
      setDecodedResult(result);
      // Try to detect format based on result
      if (/^\d{13}$/.test(result)) {
        setBarcodeFormat('EAN-13');
      } else if (/^\d{8}$/.test(result)) {
        setBarcodeFormat('EAN-8');
      } else if (/^\d{12}$/.test(result)) {
        setBarcodeFormat('UPC-A');
      } else if (/^\d+$/.test(result)) {
        setBarcodeFormat('Code 128 / Code 39');
      } else {
        setBarcodeFormat('Code 128');
      }
    } catch (err) {
      setError('未能识别到条形码，请确保图片清晰且包含条形码');
    }
    setIsDecoding(false);
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
    setBarcodeFormat(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              条形码识别
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              上传图片识别商品条形码 EAN-13、UPC-A 等格式
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
                      支持 JPG、PNG 等格式，建议条形码水平放置
                    </p>
                  </div>

                  {previewUrl && (
                    <div className="mt-4 relative">
                      <img
                        id="barcode-preview"
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
                          识别条形码
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Supported Formats */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    支持的条码格式
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: 'EAN-13', desc: '商品条码（13位）' },
                      { name: 'EAN-8', desc: '短码商品条码（8位）' },
                      { name: 'UPC-A', desc: '美国商品条码（12位）' },
                      { name: 'Code 128', desc: '通用条码' },
                      { name: 'Code 39', desc: '工业用条码' },
                      { name: 'ITF-14', desc: '物流用条码' },
                    ].map((format) => (
                      <div
                        key={format.name}
                        className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
                      >
                        <p className="font-medium text-slate-900 dark:text-white text-sm">
                          {format.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {format.desc}
                        </p>
                      </div>
                    ))}
                  </div>
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
                    <div className="w-full text-center">
                      {barcodeFormat && (
                        <p className="text-sm text-slate-500 mb-2">
                          条码格式：{barcodeFormat}
                        </p>
                      )}
                      <p className="text-4xl font-mono font-bold text-slate-900 dark:text-white tracking-widest">
                        {decodedResult}
                      </p>
                      {decodedResult.length === 13 && (
                        <a
                          href={`https://www.barcodelookup.com/${decodedResult}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm"
                        >
                          <Info className="w-4 h-4" />
                          查询商品信息
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-slate-400">
                      <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>上传包含条形码的图片</p>
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
              使用技巧
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">保持清晰</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  确保条形码图片清晰无模糊，光照均匀，避免反光。
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">正确方向</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  条形码应水平放置，完整显示在图片中，不要倾斜。
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">适当尺寸</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  条形码在图片中应占据足够比例，建议至少200px宽度。
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
