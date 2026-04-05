'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Check, RefreshCw } from 'lucide-react';

export default function PasswordGenPage() {
  const [length, setLength] = useState(16);
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let chars = '';
    if (options.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (options.numbers) chars += '0123456789';
    if (options.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      setPassword('请选择至少一种字符类型');
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  };

  useEffect(() => {
    generatePassword();
  }, []);

  const handleCopy = async () => {
    if (password && !password.includes('请选择')) {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const strengthColors = ['#EF4444', '#F97316', '#F59E0B', '#22C55E', '#10B981'];
  const getStrength = () => {
    let score = 0;
    if (length >= 8) score++;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (options.uppercase && options.lowercase) score++;
    if (options.numbers) score++;
    if (options.symbols) score++;
    return Math.min(5, Math.floor(score / 1.2));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              密码生成器
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              生成安全随机的密码字符串
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  密码长度：{length} 位
                </label>
                <input
                  type="range"
                  min={4}
                  max={64}
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>4</span>
                  <span>64</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                  字符类型
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'uppercase', label: '大写字母 (A-Z)' },
                    { key: 'lowercase', label: '小写字母 (a-z)' },
                    { key: 'numbers', label: '数字 (0-9)' },
                    { key: 'symbols', label: '特殊符号 (!@#$%)' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={options[item.key as keyof typeof options]}
                        onChange={(e) => setOptions({ ...options, [item.key]: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    密码强度
                  </label>
                  <span className="text-sm font-medium" style={{ color: strengthColors[getStrength()] }}>
                    {['非常弱', '弱', '中等', '强', '非常强'][getStrength()]}
                  </span>
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-2 flex-1 rounded-full"
                      style={{ backgroundColor: i <= getStrength() ? strengthColors[getStrength()] : '#E5E7EB' }}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <code className="flex-1 text-lg font-mono text-slate-900 dark:text-white break-all">
                    {password}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="p-2 text-slate-400 hover:text-slate-600"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={generatePassword}
                    className="p-2 text-slate-400 hover:text-slate-600"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button
                onClick={generatePassword}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
              >
                重新生成
              </button>
            </div>
          </div>
        </section>

        <section className="py-8 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">密码安全建议</h2>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                密码长度至少12位以上
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                包含大小写字母、数字和特殊符号
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                不要使用个人信息（生日、姓名等）
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                不要在多个网站使用相同密码
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                建议使用密码管理器管理密码
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
