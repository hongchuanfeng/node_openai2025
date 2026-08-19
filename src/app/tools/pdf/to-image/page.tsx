'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, Image, Download, Info, Loader2, AlertCircle, FileText, Check, Package } from 'lucide-react';
import JSZip from 'jszip';

export default function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<{ url: string; page: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [imageFormat, setImageFormat] = useState<'png' | 'jpeg'>('png');
  const [downloading, setDownloading] = useState(false);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setImages([]);
      setError(null);
      setProgress(0);
      setCurrentPage(0);
      setPageCount(0);
    }
  }, []);

  const convertToImages = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setProgress(0);
    setCurrentPage(0);
    setImages([]);

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      const arrayBuffer = await file.arrayBuffer();
      const typedArray = new Uint8Array(arrayBuffer);
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
      const numPages = pdf.numPages;
      setPageCount(numPages);

      const scale = 2; // 2x resolution for better quality
      const imageList: { url: string; page: number }[] = [];

      for (let i = 1; i <= numPages; i++) {
        setCurrentPage(i);
        setProgress(Math.round((i / numPages) * 90));

        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvas,
          canvasContext: ctx,
          viewport,
        }).promise;

        const mimeType = imageFormat === 'png' ? 'image/png' : 'image/jpeg';
        const quality = imageFormat === 'jpeg' ? 0.92 : undefined;
        const dataUrl = canvas.toDataURL(mimeType, quality);
        
        imageList.push({ url: dataUrl, page: i });
        
        // Clean up canvas
        canvas.width = 0;
        canvas.height = 0;
      }

      setProgress(100);
      setImages(imageList);
    } catch (err) {
      console.error('转换失败:', err);
      setError('转换失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }

    setLoading(false);
  };

  const downloadImage = (dataUrl: string, pageNum: number) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${file?.name.replace('.pdf', '') || 'page'}_page${pageNum}.${imageFormat}`;
    a.click();
  };

  const downloadAllImages = () => {
    images.forEach((img, index) => {
      setTimeout(() => downloadImage(img.url, img.page), index * 200);
    });
  };

  const downloadAsZip = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();
      const baseName = file?.name.replace('.pdf', '') || 'pdf_pages';

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const dataUrlParts = img.url.split(',');
        const mimeType = imageFormat === 'png' ? 'image/png' : 'image/jpeg';
        const base64 = dataUrlParts[1];
        zip.file(`${baseName}_page${img.page}.${imageFormat}`, base64, { base64: true });
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `${baseName}.zip`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      alert('打包下载失败');
    }
    setDownloading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">PDF转图片</h1>
            <p className="text-slate-600 dark:text-slate-400">将PDF文件转换为PNG/JPEG图片</p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">上传PDF文件</h3>
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                {loading ? (
                  <>
                    <Loader2 className="w-12 h-12 text-slate-400 mb-3 animate-spin" />
                    <span className="text-slate-500">转换中... {currentPage}/{pageCount}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-slate-400 mb-3" />
                    <span className="text-slate-500">点击上传PDF文件</span>
                  </>
                )}
                <input type="file" accept=".pdf" onChange={handleUpload} className="hidden" disabled={loading} />
              </label>

              {file && !loading && (
                <div className="mt-6 flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <FileText className="w-8 h-8 text-red-500" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-700 dark:text-slate-200">{file.name}</p>
                    <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              )}

              {loading && progress > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-slate-500 mb-1">
                    <span>转换进度</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setImageFormat('png')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      imageFormat === 'png' 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    PNG
                  </button>
                  <button
                    onClick={() => setImageFormat('jpeg')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      imageFormat === 'jpeg' 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    JPEG
                  </button>
                </div>
              </div>

              <button 
                onClick={convertToImages} 
                disabled={!file || loading}
                className="mt-4 w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    转换中...
                  </>
                ) : (
                  <>
                    <Image className="w-5 h-5" />
                    转换为图片
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {images.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-900 dark:text-white">转换结果 ({images.length} 页)</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={downloadAllImages}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      下载全部
                    </button>
                    <button
                      onClick={downloadAsZip}
                      disabled={downloading}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-all disabled:opacity-50"
                    >
                      <Package className="w-4 h-4" />
                      {downloading ? '打包中...' : '打包下载'}
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((img, index) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4">
                      <div className="relative bg-white rounded-lg overflow-hidden mb-3">
                        <img 
                          src={img.url} 
                          alt={`Page ${img.page}`}
                          className="w-full h-auto"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">第 {img.page} 页</span>
                        <button 
                          onClick={() => downloadImage(img.url, img.page)}
                          className="flex items-center gap-1 text-sm text-purple-500 hover:text-purple-600"
                        >
                          <Download className="w-4 h-4" />
                          下载
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-amber-50 dark:bg-slate-800/50 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-500" />
                说明
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                将PDF的每一页渲染为高清图片。支持PNG和JPEG两种格式。PNG支持透明背景，JPEG文件体积更小。
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}