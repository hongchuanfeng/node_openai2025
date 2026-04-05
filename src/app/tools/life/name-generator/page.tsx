'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { User, Shuffle, RefreshCw } from 'lucide-react';

const surnames = ['张', '王', '李', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗', '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧', '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕'];
const givenNames1 = ['伟', '芳', '娜', '秀', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '秀', '霞', '平', '刚', '桂', '英'];
const givenNames2 = ['华', '明', '红', '玲', '波', '辉', '兰', '峰', '平', '东', '宇', '浩', '凯', '博', '超', '鹏', '飞', '龙', '晨', '阳', '泽', '轩', '睿', '然', '霖', '然', '辰'];

const generateName = (): string => {
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const g1 = givenNames1[Math.floor(Math.random() * givenNames1.length)];
  const g2 = givenNames2[Math.floor(Math.random() * givenNames2.length)];
  return surname + g1 + g2;
};

export default function NameGeneratorPage() {
  const [count, setCount] = useState(5);
  const [names, setNames] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const generate = () => {
    const arr: string[] = [];
    const used = new Set<string>();
    while (arr.length < count) {
      const name = generateName();
      if (!used.has(name)) { used.add(name); arr.push(name); }
    }
    setNames(arr);
  };

  const toggleFav = (name: string) => {
    setFavorites(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-pink-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <User className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">姓名生成器</h1>
            </div>
            <p className="text-indigo-100 text-lg">随机生成好听的中文姓名</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 mb-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                  生成数量：{count} 个
                </label>
                <input type="range" min="1" max="20" value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full accent-indigo-600" />
              </div>
              <button onClick={generate} className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all text-lg flex items-center justify-center gap-2 mb-4">
                <Shuffle className="w-5 h-5" />
                随机生成
              </button>
            </div>

            {names.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
                {names.map((name, i) => (
                  <div key={i} className="p-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">{name}</span>
                    <button onClick={() => toggleFav(name)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${favorites.includes(name) ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                      {favorites.includes(name) ? '★ 已收藏' : '☆ 收藏'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {favorites.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">我的收藏</h3>
                <div className="flex flex-wrap gap-2">
                  {favorites.map((name, i) => (
                    <span key={i} className="px-4 py-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-sm font-medium">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
