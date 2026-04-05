'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, FileSpreadsheet, Download, Loader2, AlertCircle, Check } from 'lucide-react';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface TableData {
  headers: string[];
  rows: string[][];
  sheetName: string;
}

export default function ExcelToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setTables([]);
      setError(null);
      setProgress(0);
      readExcelFile(uploaded);
    }
  }, []);

  const readExcelFile = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const tableData: TableData[] = [];

      for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
        
        if (jsonData.length > 0) {
          const headers = jsonData[0].map((cell: any) => String(cell ?? ''));
          const rows = jsonData.slice(1).map((row: any[]) => 
            row.map((cell: any) => String(cell ?? ''))
          );
          
          tableData.push({ headers, rows, sheetName });
        }
      }

      setTables(tableData);
    } catch (err) {
      console.error('读取Excel失败:', err);
      setError('读取Excel文件失败');
    }
  };

  const convertToPdf = async () => {
    if (tables.length === 0) return;
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      setProgress(10);

      // Create a hidden container for rendering
      const container = document.createElement('div');
      container.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        background: white;
        font-family: 'SimSun', '宋体', serif;
        font-size: 10pt;
        color: #333;
      `;
      document.body.appendChild(container);

      // Create HTML content for all tables
      for (let sheetIndex = 0; sheetIndex < tables.length; sheetIndex++) {
        const table = tables[sheetIndex];
        
        // Add sheet name
        const sheetTitle = document.createElement('h3');
        sheetTitle.textContent = table.sheetName;
        sheetTitle.style.cssText = `
          font-size: 10pt;
          font-weight: bold;
          margin: 0 0 6px 0;
          padding: 6px;
        `;
        container.appendChild(sheetTitle);

        // Create table
        const tableEl = document.createElement('table');
        tableEl.style.cssText = `
          border-collapse: collapse;
          width: auto;
          font-size: 8pt;
          line-height: 1.3;
        `;

        // Header row
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.style.backgroundColor = '#e0e0e0';
        
        for (const header of table.headers) {
          const th = document.createElement('th');
          th.textContent = header;
          th.style.cssText = `
            border: 1px solid #666;
            padding: 3px 6px;
            font-weight: bold;
            text-align: left;
            white-space: nowrap;
            font-size: 8pt;
          `;
          headerRow.appendChild(th);
        }
        thead.appendChild(headerRow);
        tableEl.appendChild(thead);

        // Body rows
        const tbody = document.createElement('tbody');
        for (let i = 0; i < table.rows.length; i++) {
          const row = table.rows[i];
          const tr = document.createElement('tr');
          if (i % 2 === 0) {
            tr.style.backgroundColor = '#f9f9f9';
          }
          
          for (const cell of row) {
            const td = document.createElement('td');
            td.textContent = cell;
            td.style.cssText = `
              border: 1px solid #666;
              padding: 2px 6px;
              white-space: nowrap;
              font-size: 8pt;
            `;
            tr.appendChild(td);
          }
          tbody.appendChild(tr);
        }
        tableEl.appendChild(tbody);
        container.appendChild(tableEl);

        // Page break between sheets (except last)
        if (sheetIndex < tables.length - 1) {
          const pageBreak = document.createElement('div');
          pageBreak.style.cssText = 'page-break-after: always;';
          container.appendChild(pageBreak);
        }
      }

      setProgress(30);

      // Render to canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      setProgress(60);

      // Remove container
      document.body.removeChild(container);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = pdfWidth / (imgWidth / 2);
      const scaledHeight = (imgHeight / 2) * ratio;

      let heightLeft = scaledHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - scaledHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledHeight);
        heightLeft -= pdfHeight;
      }

      setProgress(90);

      const pdfName = file!.name.replace(/\.(xlsx?|XLSX?)$/, '.pdf') || 'converted.pdf';
      pdf.save(pdfName);

      setProgress(100);
    } catch (err) {
      console.error('转换失败:', err);
      setError('转换失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-green-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Excel转PDF</h1>
            <p className="text-slate-600 dark:text-slate-400">将Excel表格 (.xls, .xlsx) 转换为PDF</p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">上传Excel文件</h3>
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                {loading ? (
                  <>
                    <Loader2 className="w-12 h-12 text-slate-400 mb-3 animate-spin" />
                    <span className="text-slate-500">转换中...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-slate-400 mb-3" />
                    <span className="text-slate-500">点击上传Excel文件 (.xls, .xlsx)</span>
                  </>
                )}
                <input type="file" accept=".xls,.xlsx,.XLS,.XLSX" onChange={handleUpload} className="hidden" disabled={loading} />
              </label>

              {file && !loading && (
                <div className="mt-6 flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <FileSpreadsheet className="w-8 h-8 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-700 dark:text-slate-200">{file.name}</p>
                    <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <span className="text-xs text-blue-600 dark:text-blue-400">{tables.length} 个工作表</span>
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
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <button 
                onClick={convertToPdf} 
                disabled={tables.length === 0 || loading}
                className="mt-4 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    转换中...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    转换为PDF并下载
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

            {tables.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">表格预览</h3>
                <div className="space-y-6">
                  {tables.map((table, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{table.sheetName}</h4>
                      <div className="overflow-x-auto bg-slate-50 dark:bg-slate-900 rounded-xl">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="bg-slate-200 dark:bg-slate-700">
                              {table.headers.map((header, i) => (
                                <th key={i} className="px-3 py-2 text-left font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {table.rows.slice(0, 10).map((row, i) => (
                              <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-700/50'}>
                                {row.map((cell, j) => (
                                  <td key={j} className="px-3 py-2 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {table.rows.length > 10 && (
                          <p className="text-sm text-slate-500 p-3">... 共 {table.rows.length} 行数据</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-amber-50 dark:bg-slate-800/50 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-green-500" />
                说明
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                将Excel表格 (.xls, .xlsx) 转换为PDF格式。支持多工作表，自动分页。
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}