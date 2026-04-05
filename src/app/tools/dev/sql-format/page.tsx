'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info, AlertTriangle } from 'lucide-react';

export default function SqlFormatPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState('');

  const formatSql = (sql: string, indentSize: number): string => {
    const indentStr = ' '.repeat(indentSize);
    let formatted = sql
      .replace(/\s+/g, ' ')
      .trim();

    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER',
      'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT', 'INTO', 'VALUES',
      'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'PRIMARY',
      'KEY', 'FOREIGN', 'REFERENCES', 'NOT', 'NULL', 'DEFAULT', 'AUTO_INCREMENT', 'UNIQUE',
      'AS', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
      'UNION', 'ALL', 'DISTINCT', 'ASC', 'DESC', 'CROSS', 'NATURAL', 'USING', 'CONSTRAINT',
    ];

    let result = formatted;
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      result = result.replace(regex, keyword);
    }

    const upperKeywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT JOIN', 
      'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 
      'LIMIT', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE',
      'PRIMARY KEY', 'FOREIGN KEY', 'UNIQUE', 'NOT NULL', 'DEFAULT', 'AUTO_INCREMENT',
      'UNION ALL', 'CROSS JOIN', 'NATURAL JOIN'];

    for (const keyword of upperKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      result = result.replace(regex, keyword.toUpperCase());
    }

    result = result
      .replace(/\bSELECT\b/gi, '\nSELECT')
      .replace(/\bFROM\b/gi, '\nFROM')
      .replace(/\bWHERE\b/gi, '\nWHERE')
      .replace(/\bAND\b/gi, '\n  AND')
      .replace(/\bOR\b/gi, '\n  OR')
      .replace(/\bJOIN\b/gi, '\nJOIN')
      .replace(/\bLEFT JOIN\b/gi, '\nLEFT JOIN')
      .replace(/\bRIGHT JOIN\b/gi, '\nRIGHT JOIN')
      .replace(/\bINNER JOIN\b/gi, '\nINNER JOIN')
      .replace(/\bOUTER JOIN\b/gi, '\nOUTER JOIN')
      .replace(/\bCROSS JOIN\b/gi, '\nCROSS JOIN')
      .replace(/\bNATURAL JOIN\b/gi, '\nNATURAL JOIN')
      .replace(/\bJOIN\b/gi, '\nJOIN')
      .replace(/\bGROUP BY\b/gi, '\nGROUP BY')
      .replace(/\bORDER BY\b/gi, '\nORDER BY')
      .replace(/\bHAVING\b/gi, '\nHAVING')
      .replace(/\bLIMIT\b/gi, '\nLIMIT')
      .replace(/\bINSERT INTO\b/gi, '\nINSERT INTO')
      .replace(/\bVALUES\b/gi, '\nVALUES')
      .replace(/\bUPDATE\b/gi, '\nUPDATE')
      .replace(/\bSET\b/gi, '\nSET')
      .replace(/\bDELETE FROM\b/gi, '\nDELETE FROM')
      .replace(/\bCREATE TABLE\b/gi, '\nCREATE TABLE')
      .replace(/\bPRIMARY KEY\b/gi, 'PRIMARY KEY')
      .replace(/\bFOREIGN KEY\b/gi, 'FOREIGN KEY')
      .replace(/\bREFERENCES\b/gi, 'REFERENCES')
      .replace(/\bON\b/gi, '\n  ON')
      .replace(/,\s*/g, ',\n  ')
      .replace(/\(\s*/g, '(\n  ')
      .replace(/\s*\)/g, '\n)')
      .replace(/\s*;\s*/g, ';\n');

    const lines = result.split('\n').filter(line => line.trim());
    return lines.join('\n').trim();
  };

  const compressSql = (sql: string): string => {
    return sql
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/--.*$/gm, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ',')
      .replace(/\s*;\s*/g, ';')
      .replace(/\s*\(\s*/g, '(')
      .replace(/\s*\)\s*/g, ')')
      .replace(/;\s*$/, ';')
      .trim();
  };

  const handleFormat = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    
    setError('');
    try {
      setOutput(formatSql(input, indent));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'SQL格式错误');
      setOutput('');
    }
  };

  const handleCompress = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    
    setError('');
    try {
      setOutput(compressSql(input));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'SQL压缩错误');
      setOutput('');
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              SQL压缩/格式化工具
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              SQL语句的格式化（美化）和压缩（最小化）工具
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <button
                onClick={handleFormat}
                className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
              >
                格式化
              </button>
              <button
                onClick={handleCompress}
                className="px-6 py-2 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition-colors"
              >
                压缩
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <label className="text-sm text-slate-600 dark:text-slate-400">缩进：</label>
                <select
                  value={indent}
                  onChange={(e) => setIndent(Number(e.target.value))}
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                >
                  <option value={2}>2空格</option>
                  <option value={4}>4空格</option>
                </select>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    输入SQL
                  </label>
                  <button
                    onClick={handleClear}
                    className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    清空
                  </button>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="SELECT id,name FROM users WHERE age > 18;"
                  className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                />
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    结果
                  </label>
                  <button
                    onClick={handleCopy}
                    className={`text-sm flex items-center gap-1 transition-colors ${
                      copied ? 'text-green-600' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                  </button>
                </div>
                <textarea
                  value={error || output}
                  readOnly
                  placeholder="结果将在此显示..."
                  className={`w-full h-64 p-4 rounded-xl border ${
                    error ? 'border-red-300 dark:border-red-700' : 'border-slate-200 dark:border-slate-700'
                  } bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none font-mono text-sm ${
                    error ? 'text-red-600 dark:text-red-400' : ''
                  }`}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              示例
            </h2>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">格式化示例</h3>
              <pre className="text-sm text-green-600 dark:text-green-400 font-mono overflow-x-auto">
{`SELECT
  id,
  name,
  email
FROM users
WHERE age > 18
  AND status = 'active'
ORDER BY created_at DESC
LIMIT 10;`}
              </pre>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              注意事项
            </h2>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                SQL格式化会自动调整关键字大小写和缩进
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                SQL压缩会移除注释和多余空格，减小SQL文件大小
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                支持SELECT、INSERT、UPDATE、DELETE等常用SQL语句
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
