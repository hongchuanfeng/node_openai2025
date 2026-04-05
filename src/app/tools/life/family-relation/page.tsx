'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Users, HelpCircle, Info } from 'lucide-react';

const relations: Record<string, string[]> = {
  '父亲': ['儿子', '女儿'],
  '母亲': ['儿子', '女儿'],
  '丈夫': ['妻子'],
  '妻子': ['丈夫'],
  '哥哥': ['弟弟', '妹妹'],
  '弟弟': ['哥哥', '姐姐'],
  '姐姐': ['弟弟', '妹妹'],
  '妹妹': ['哥哥', '姐姐'],
  '儿子': ['父亲', '母亲'],
  '女儿': ['父亲', '母亲'],
  '祖父': ['孙子', '孙女'],
  '祖母': ['孙子', '孙女'],
  '外公': ['外孙', '外孙女'],
  '外婆': ['外孙', '外孙女'],
  '孙子': ['祖父', '祖母'],
  '孙女': ['祖父', '祖母'],
  '外孙': ['外公', '外婆'],
  '外孙女': ['外公', '外婆'],
  '伯父': ['侄子', '侄女'],
  '叔父': ['侄子', '侄女'],
  '姑姑': ['侄子', '侄女'],
  '舅舅': ['侄子', '侄女'],
  '姨妈': ['侄子', '侄女'],
  '侄子': ['伯父', '叔父', '姑姑', '舅舅', '姨妈'],
  '侄女': ['伯父', '叔父', '姑姑', '舅舅', '姨妈'],
};

export default function FamilyRelationPage() {
  const [myRelation, setMyRelation] = useState('父亲');
  const [targetRelation, setTargetRelation] = useState('儿子');
  const [result, setResult] = useState('');

  const calculate = () => {
    const my = relations[myRelation] || [];
    const target = relations[targetRelation] || [];
    const intersection = my.filter(r => target.includes(r));
    if (intersection.length > 0) {
      setResult(`你是对方的 ${intersection[0]}`);
    } else {
      const reverse = relations[targetRelation]?.includes(myRelation);
      if (reverse) {
        setResult('你们是同一个人');
      } else {
        setResult('关系较复杂，请咨询专业人士');
      }
    }
  };

  const relationKeys = Object.keys(relations);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-pink-600 via-rose-600 to-red-600 py-16 md:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-1/3 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-pink-200 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">亲戚关系计算器</h1>
            </div>
            <p className="text-pink-100 text-lg">轻松搞懂复杂亲戚称谓</p>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-10">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 font-medium">
                  <Users className="w-5 h-5" />
                  <span>我是 <strong>{myRelation}</strong>，对方是我的 <strong>{targetRelation}</strong></span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">我的身份</label>
                <select
                  value={myRelation}
                  onChange={(e) => setMyRelation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {relationKeys.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">对方与我的关系</label>
                <select
                  value={targetRelation}
                  onChange={(e) => setTargetRelation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {relationKeys.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <button
                onClick={calculate}
                className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all text-lg"
              >
                计算亲戚关系
              </button>

              {result && (
                <div className="mt-6 p-6 rounded-xl bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 text-center">
                  <div className="text-sm text-pink-500 mb-2">对方应该如何称呼我？</div>
                  <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">{result}</div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div className="text-sm text-amber-800 dark:text-amber-300 space-y-1">
                  <p>本工具基于常见的亲戚关系进行计算，部分复杂亲戚关系可能无法准确计算。</p>
                  <p>例如：舅舅的儿子和我是表兄弟关系。</p>
                </div>
              </div>
            </div>

            {/* Common relations */}
            <div className="mt-8">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-pink-500" />
                常见亲戚关系
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { a: '父亲', b: '儿子', r: '父子' },
                  { a: '母亲', b: '女儿', r: '母女' },
                  { a: '祖父', b: '孙子', r: '祖孙' },
                  { a: '哥哥', b: '弟弟', r: '兄弟' },
                  { a: '舅舅', b: '侄子', r: '舅甥' },
                  { a: '姑姑', b: '侄女', r: '姑侄' },
                  { a: '丈夫', b: '妻子', r: '夫妻' },
                  { a: '叔叔', b: '侄女', r: '叔侄' },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => { setMyRelation(item.a); setTargetRelation(item.b); }}
                    className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow text-center"
                  >
                    <div className="text-xs text-slate-400">{item.a} → {item.b}</div>
                    <div className="font-medium text-pink-600 dark:text-pink-400 text-sm">{item.r}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
