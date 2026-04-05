'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Upload, FileText, Download, Info, Table, AlertCircle } from 'lucide-react';

interface TableData {
  headers: string[];
  rows: string[][];
  page: number;
}

export default function PdfToExcelPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [tables, setTables] = useState<TableData[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setResult(null);
      setTables([]);
      setError(null);
    }
  }, []);

  const extractTablesFromText = (text: string): string[][] => {
    const lines = text.split('\n').filter(line => line.trim());
    const tableData: string[][] = [];

    for (const line of lines) {
      // Split by multiple spaces, tabs, or common delimiters
      const cells = line.split(/[\t]{2,}|[\s]{3,}|[,;]/).map(cell => cell.trim()).filter(cell => cell);
      
      if (cells.length >= 2) {
        tableData.push(cells);
      }
    }

    return tableData;
  };

  const detectTableStructure = (rows: string[][]): { headers: string[]; body: string[][] } => {
    if (rows.length === 0) return { headers: [], body: [] };

    // Use first row as headers
    const headers = rows[0];
    const body = rows.slice(1);

    return { headers, body };
  };

  const createExcel = async (tables: TableData[]): Promise<Blob> => {
    const XLSX = await import('xlsx');
    const wb = XLSX.utils.book_new();

    tables.forEach((table, index) => {
      if (table.rows.length === 0) return;

      const { headers, body } = detectTableStructure(table.rows);
      
      if (headers.length === 0) return;

      // Create worksheet data
      const wsData = [
        headers,
        ...body
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      
      // Set column widths
      const colWidths = headers.map((_, i) => {
        const maxLength = Math.max(
          headers[i]?.length || 10,
          ...body.map(row => row[i]?.length || 0)
        );
        return { wch: Math.min(maxLength + 2, 50) };
      });
      ws['!cols'] = colWidths;

      const sheetName = `表格${index + 1} (页${table.page})`.substring(0, 31);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    // If no valid tables, create empty sheet
    if (wb.SheetNames.length === 0) {
      const ws = XLSX.utils.aoa_to_sheet([['未检测到表格数据']]);
      XLSX.utils.book_append_sheet(wb, ws, '数据');
    }

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  };

  const convertToExcel = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setTables([]);
    setResult(null);

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      const numPages = pdf.numPages;
      setPageCount(numPages);

      const allTables: TableData[] = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Get text with position information
        const pageText = textContent.items
          .map((item) => {
            if (!('str' in item)) return '';
            const raw = item as { str?: string; hasEOL?: boolean };
            const text = raw.str || '';
            return raw.hasEOL ? text + '\n' : text;
          })
          .join('');

        // Try to extract tables from text
        const tableRows = extractTablesFromText(pageText);

        if (tableRows.length >= 2) {
          allTables.push({
            headers: tableRows[0],
            rows: tableRows,
            page: pageNum
          });
        }
      }

      setTables(allTables);

      if (allTables.length === 0) {
        setError('未能在PDF中检测到表格数据。PDF转Excel仅支持文本型PDF中的表格提取，扫描件无法转换。');
        setLoading(false);
        return;
      }

      // Create Excel file
      const excelBlob = await createExcel(allTables);
      setResult(URL.createObjectURL(excelBlob));
    } catch (err) {
      console.error('转换失败:', err);
      setError('转换失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }

    setLoading(false);
  };

  const downloadResult = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    a.download = file?.name.replace('.pdf', '.xlsx') || 'converted.xlsx';
    a.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-green-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">PDF转Excel</h1>
            <p className="text-slate-600 dark:text-slate-400">将PDF中的表格数据提取并转换为Excel格式</p>
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
                onClick={convertToExcel} 
                disabled={!file || loading}
                className="mt-6 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50"
              >
                {loading ? '转换中...' : '转换为Excel'}
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
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Table className="w-5 h-5" />
                  检测到的表格 ({tables.length}个表格 / {pageCount}页)
                </h3>
                
                {tables.map((table, index) => (
                  <div key={index} className="mb-6">
                    <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                      表格 {index + 1} - 第{table.page}页
                    </h4>
                    <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-100 dark:bg-slate-700">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium text-slate-700 dark:text-slate-200">#</th>
                            {table.rows[0]?.map((header, i) => (
                              <th key={i} className="px-3 py-2 text-left font-medium text-slate-700 dark:text-slate-200">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                          {table.rows.slice(1, 6).map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                              <td className="px-3 py-2 text-slate-500">{rowIndex + 1}</td>
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-3 py-2 text-slate-700 dark:text-slate-300">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {table.rows.length > 6 && (
                      <p className="text-xs text-slate-500 mt-2">还有 {table.rows.length - 6} 行数据...</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {result && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">转换完成</h3>
                <button 
                  onClick={downloadResult} 
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:from-green-600 hover:to-emerald-600 transition-all"
                >
                  <Download className="w-5 h-5" />
                  下载Excel文件
                </button>
              </div>
            )}

            <div className="bg-amber-50 dark:bg-slate-800/50 rounded-xl p-6">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-500" />
                说明
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                此功能通过识别PDF中的表格结构来提取数据。仅支持文本型PDF中的表格，扫描件或图片型PDF无法提取数据。表格的识别依赖于PDF中的文本布局，复杂排版可能导致识别不准确。
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}