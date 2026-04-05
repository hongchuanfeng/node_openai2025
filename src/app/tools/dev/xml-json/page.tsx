'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw, Info, AlertTriangle, ArrowLeftRight } from 'lucide-react';

type Mode = 'xml-to-json' | 'json-to-xml';

export default function XmlJsonPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<Mode>('xml-to-json');
  const [error, setError] = useState('');

  const parseXml = (xml: string, rootName = 'root'): Record<string, unknown> => {
    const result: Record<string, unknown> = {};
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      throw new Error('无效的XML格式');
    }

    const root = doc.documentElement;
    const parseNode = (node: Element): unknown => {
      if (node.children.length === 0) {
        return node.textContent?.trim() || '';
      }
      
      const children: Record<string, unknown>[] = [];
      const groups: Record<string, Element[]> = {};
      
      for (const child of Array.from(node.children)) {
        const name = child.nodeName;
        if (!groups[name]) groups[name] = [];
        groups[name].push(child);
      }
      
      const obj: Record<string, unknown> = {};
      for (const [name, elements] of Object.entries(groups)) {
        if (elements.length === 1) {
          obj[name] = parseNode(elements[0]);
        } else {
          obj[name] = elements.map(el => parseNode(el));
        }
      }
      
      return obj;
    };

    if (root.children.length === 1) {
      return { [root.children[0].nodeName]: parseNode(root.children[0]) } as Record<string, unknown>;
    }
    
    return { [root.nodeName]: parseNode(root) } as Record<string, unknown>;
  };

  const jsonToXml = (obj: unknown, rootName = 'root', indent = 0): string => {
    const spaces = '  '.repeat(indent);
    
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
      const content = String(obj);
      const needCdata = content.includes('<') || content.includes('>') || content.includes('&');
      const encodedContent = needCdata ? `<![CDATA[${content}]]>` : content;
      return `${spaces}<${rootName}>${encodedContent}</${rootName}>`;
    }
    
    if (obj === null || obj === undefined) {
      return `${spaces}<${rootName}/>`;
    }
    
    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return `${spaces}<${rootName}/>`;
      }
      const results = obj.map((item) => {
        return jsonToXml(item, rootName, indent);
      });
      return results.join('\n');
    }
    
    if (typeof obj === 'object') {
      const entries = Object.entries(obj as Record<string, unknown>);
      if (entries.length === 0) {
        return `${spaces}<${rootName}/>`;
      }
      
      const children: string[] = [];
      for (const [key, value] of entries) {
        children.push(jsonToXml(value, key, indent + 1));
      }
      
      if (children.length === 1 && !children[0].includes('\n')) {
        return `${spaces}<${rootName}>${children[0].trim()}</${rootName}>`;
      }
      
      return `${spaces}<${rootName}>\n${children.join('\n')}\n${spaces}</${rootName}>`;
    }
    
    return `${spaces}<${rootName}/>`;
  };

  const handleTransform = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    setError('');
    try {
      if (mode === 'xml-to-json') {
        const parsed = parseXml(input);
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        const obj = JSON.parse(input);
        const xml = jsonToXml(obj);
        setOutput(xml);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '转换错误');
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

  const handleSwap = () => {
    setMode(mode === 'xml-to-json' ? 'json-to-xml' : 'xml-to-json');
    setInput(output);
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
              XML/JSON相互转换
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              XML与JSON格式之间的相互转换
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  onClick={() => { setMode('xml-to-json'); setInput(''); setOutput(''); setError(''); }}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    mode === 'xml-to-json'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  XML → JSON
                </button>
                <button
                  onClick={() => { setMode('json-to-xml'); setInput(''); setOutput(''); setError(''); }}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    mode === 'json-to-xml'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  JSON → XML
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    {mode === 'xml-to-json' ? '输入XML' : '输入JSON'}
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
                  placeholder={mode === 'xml-to-json' 
                    ? '<root><name>张三</name></root>' 
                    : '{"name": "张三"}'}
                  className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                />
                <button
                  onClick={handleTransform}
                  className="mt-4 w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  转换
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-lg font-semibold text-slate-900 dark:text-white">
                    {mode === 'xml-to-json' ? 'JSON结果' : 'XML结果'}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSwap}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                      交换
                    </button>
                    <button
                      onClick={handleCopy}
                      className={`text-sm flex items-center gap-1 transition-colors ${
                        copied ? 'text-green-600' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {copied ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
                    </button>
                  </div>
                </div>
                <textarea
                  value={error || output}
                  readOnly
                  placeholder="结果将在此显示..."
                  className={`w-full h-64 p-4 rounded-xl border resize-none font-mono text-sm ${
                    error
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-600'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white'
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
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">XML → JSON</h3>
                <pre className="text-sm text-slate-600 dark:text-slate-400 font-mono overflow-x-auto">
{`<user>
  <name>张三</name>
  <age>18</age>
</user>`}
                </pre>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">转换结果</h3>
                <pre className="text-sm text-green-600 dark:text-green-400 font-mono overflow-x-auto">
{`{
  "user": {
    "name": "张三",
    "age": "18"
  }
}`}
                </pre>
              </div>
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
                XML转JSON时会保留所有标签和文本内容
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                JSON转XML时数组元素会添加Item后缀
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                确保输入格式正确，否则会报错
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
