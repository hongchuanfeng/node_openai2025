'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, FileText, Download, Copy, Check, Info, Image } from 'lucide-react';
import type { PDFPageProxy } from 'pdfjs-dist';

interface ExtractedImage {
  blob: Blob;
  width: number;
  height: number;
}

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [extractedText, setExtractedText] = useState<string[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [imageCount, setImageCount] = useState(0);
  const [images, setImages] = useState<string[]>([]);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setResult(null);
      setExtractedText([]);
      setPageCount(0);
      setImageCount(0);
      setImages([]);
    }
  }, []);

  const extractImageToCanvas = async (page: PDFPageProxy, imgName: string): Promise<ExtractedImage | null> => {
    try {
      const imgObj = await page.objs.get(imgName);
      if (!imgObj || !imgObj.data) return null;

      const { width, height, data } = imgObj;
      if (!width || !height) return null;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // imgObj.data can be:
      // - Uint8ClampedArray (already in RGBA format suitable for ImageData)
      // - Uint8Array (raw RGB or palette data)
      // Check if data length matches width*height*4 (RGBA) or width*height*3 (RGB)
      const expectedRgba = width * height * 4;
      const expectedRgb = width * height * 3;

      if (data.length === expectedRgba) {
        // Already RGBA format
        const imageData = new ImageData(width, height);
        imageData.data.set(data);
        ctx.putImageData(imageData, 0, 0);
      } else if (data.length === expectedRgb) {
        // RGB format - convert to RGBA
        const imageData = ctx.createImageData(width, height);
        for (let i = 0; i < width * height; i++) {
          imageData.data[i * 4] = data[i * 3];
          imageData.data[i * 4 + 1] = data[i * 3 + 1];
          imageData.data[i * 4 + 2] = data[i * 3 + 2];
          imageData.data[i * 4 + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
      } else {
        // Try to handle as raw data - assume RGBA
        const imageData = new ImageData(width, height);
        const bytesToCopy = Math.min(data.length, expectedRgba);
        imageData.data.set(new Uint8ClampedArray(data.buffer, data.byteOffset, bytesToCopy));
        ctx.putImageData(imageData, 0, 0);
      }

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve({ blob, width, height });
          } else {
            resolve(null);
          }
        }, 'image/png');
      });
    } catch (e) {
      console.log('Image extraction error:', e);
      return null;
    }
  };

  const createDocxWithImages = async (
    paragraphs: string[], 
    imagesPerPage: ExtractedImage[][]
  ): Promise<Blob> => {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    let paragraphXml = '';
    let relXml = '';
    let mediaIndex = 1;
    let imageList: ExtractedImage[] = [];

    // Flatten images per page for Word document
    for (let i = 0; i < paragraphs.length; i++) {
      const escapedText = paragraphs[i]
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '</w:t></w:r><w:r><w:br/></w:r><w:r><w:t>');

      // Add text paragraph
      paragraphXml += `<w:p><w:r><w:t xml:space="preserve">${escapedText}</w:t></w:r></w:p>`;

      // Add images for this page
      const pageImages = imagesPerPage[i] || [];
      for (const img of pageImages) {
        imageList.push(img);
        const imgId = `rId${mediaIndex + 100}`;
        relXml += `<Relationship Id="${imgId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image${mediaIndex}.png"/>`;

        // Calculate image size in EMUs (English Metric Units) - max width 6 inches
        const maxWidthEmu = 5486400; // 6 inches in EMUs
        const maxHeightEmu = 4114800; // 4.5 inches in EMUs
        const ratio = Math.min(maxWidthEmu / img.width, maxHeightEmu / img.height);
        const cx = Math.round(img.width * ratio);
        const cy = Math.round(img.height * ratio);

        paragraphXml += `<w:p><w:r><w:drawing><wp:inline xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:docPr id="${mediaIndex}" name="Picture ${mediaIndex}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="${mediaIndex}" name="Picture ${mediaIndex}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${imgId}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphic></wp:drawing></w:r></w:p>`;
        mediaIndex++;
      }

      // Page break every 5 pages
      if (i > 0 && i % 5 === 0) {
        paragraphXml += `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
      }
    }

    // Add images to zip
    for (let i = 0; i < imageList.length; i++) {
      zip.file(`word/media/image${i + 1}.png`, await imageList[i].blob.arrayBuffer());
    }

    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>${paragraphXml}<w:sectPr></w:sectPr></w:body>
</w:document>`;

    const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="png" ContentType="image/png"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

    const docRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>${relXml}
</Relationships>`;

    const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

    zip.file('[Content_Types].xml', contentTypesXml);
    zip.file('_rels/.rels', rootRelsXml);
    zip.file('word/document.xml', documentXml);
    zip.file('word/_rels/document.xml.rels', docRelsXml);

    return await zip.generateAsync({ type: 'blob' });
  };

  const convertToWord = async () => {
    if (!file) return;
    setLoading(true);
    setImages([]);
    setImageCount(0);
    
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
      const numPages = pdf.numPages;
      setPageCount(numPages);
      
      const paragraphs: string[] = [];
      const imagesPerPage: ExtractedImage[][] = [];
      let totalImages = 0;
      const previewImages: string[] = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        
        // Extract text
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item) =>
            'str' in item ? String((item as { str: string }).str || '') : ''
          )
          .filter(Boolean)
          .join(' ');
        
        paragraphs.push(pageText);

        // Extract images
        const pageImages: ExtractedImage[] = [];
        try {
          const operatorList = await page.getOperatorList();
          
          for (let i = 0; i < operatorList.fnArray.length; i++) {
            const fn = operatorList.fnArray[i];
            
            if (fn === pdfjsLib.OPS.paintImageXObject) {
              const imgName = operatorList.argsArray[i][0];
              const extractedImg = await extractImageToCanvas(page, imgName);
              
              if (extractedImg) {
                pageImages.push(extractedImg);
                totalImages++;
                
                if (totalImages <= 6) {
                  previewImages.push(URL.createObjectURL(extractedImg.blob));
                }
              }
            }
          }
        } catch (e) {
          console.log('Page image extraction error:', e);
        }
        
        imagesPerPage.push(pageImages);
      }

      setImageCount(totalImages);
      setImages(previewImages);

      // Check if there's any content
      const hasText = paragraphs.some(p => p.trim().length > 0);
      if (!hasText && totalImages === 0) {
        alert('无法从PDF中提取内容，该PDF可能基于图片扫描');
        setLoading(false);
        return;
      }

      setExtractedText(paragraphs.filter(p => p.trim().length > 0));
      
      // Create Word document with images
      const docxBlob = await createDocxWithImages(paragraphs, imagesPerPage);
      setResult(URL.createObjectURL(docxBlob));
    } catch (err) {
      console.error('转换失败:', err);
      alert('转换失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }
    
    setLoading(false);
  };

  const downloadResult = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    a.download = file?.name.replace('.pdf', '.docx') || 'converted.docx';
    a.click();
  };

  const copyText = async () => {
    await navigator.clipboard.writeText(extractedText.join('\n\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">PDF转Word</h1>
            <p className="text-slate-600 dark:text-slate-400">将PDF文件转换为Word文档，支持文字和图片</p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">上传PDF文件</h3>
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Upload className="w-12 h-12 text-slate-400 mb-3" />
                <span className="text-slate-500">点击上传PDF文件</span>
                <input type="file" accept=".pdf" onChange={handleUpload} className="hidden" />
              </label>

              {file && (
                <div className="mt-6 flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <FileText className="w-8 h-8 text-red-500" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-700 dark:text-slate-200">{file.name}</p>
                    <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              )}

              <button 
                onClick={convertToWord} 
                disabled={!file || loading} 
                className="mt-6 w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50"
              >
                {loading ? '转换中...' : '转换为Word'}
              </button>
            </div>

            {pageCount > 0 && extractedText.length === 0 && !loading && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 mb-6">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  无法从PDF中提取文本内容，该PDF可能基于图片扫描
                </p>
              </div>
            )}

            {extractedText.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">
                  提取的内容 ({pageCount}页 / {extractedText.length}段文字 / {imageCount}张图片)
                </h3>
                <textarea 
                  value={extractedText.slice(0, 10).join('\n\n') + (extractedText.length > 10 ? '\n\n...' : '')} 
                  readOnly 
                  className="w-full h-48 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 resize-none text-sm"
                />
                <div className="flex gap-4 mt-4">
                  <button 
                    onClick={copyText} 
                    className={`flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-600 flex items-center justify-center gap-2 ${copied ? 'text-green-600' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制文本</>}
                  </button>
                </div>
              </div>
            )}

            {images.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Image className="w-5 h-5" /> 提取的图片预览
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img, i) => (
                    <img 
                      key={i} 
                      src={img} 
                      alt={`图片${i + 1}`} 
                      className="w-full h-auto rounded-lg border border-slate-200 dark:border-slate-600" 
                    />
                  ))}
                </div>
                {imageCount > images.length && (
                  <p className="text-sm text-slate-500 mt-4">还有 {imageCount - images.length} 张图片...</p>
                )}
              </div>
            )}

            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">转换完成</h3>
                <button 
                  onClick={downloadResult} 
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:from-green-600 hover:to-emerald-600 transition-all"
                >
                  <Download className="w-5 h-5" /> 下载Word文档
                </button>
              </div>
            )}

            <div className="bg-amber-50 dark:bg-slate-800/50 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-500" /> 说明
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                此功能使用Mozilla PDF.js提取PDF中的文字和图片生成Word文档。图片型PDF（扫描件）无法提取文字内容，复杂排版可能丢失格式。
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}