'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { tools } from '@/config/tools';
import ToolCard from '@/components/ToolCard';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof tools>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      const filtered = tools.filter(
        tool =>
          tool.name.toLowerCase().includes(value.toLowerCase()) ||
          tool.description.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (path: string) => {
    router.push(path);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          placeholder="搜索工具..."
          className="w-full pl-14 pr-5 py-4 text-lg rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-md text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/40 focus:bg-white/20 transition-all"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden z-50">
          <div className="max-h-80 overflow-y-auto p-2">
            {results.slice(0, 8).map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleSelect(tool.path)}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="font-medium text-slate-900 dark:text-white">{tool.name}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{tool.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 text-center text-slate-500">
          未找到相关工具
        </div>
      )}
    </div>
  );
}
