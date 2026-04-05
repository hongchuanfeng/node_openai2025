import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToolCard from '@/components/ToolCard';
import { tools, toolCategories } from '@/config/tools';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '全部工具',
  description: '浏览传道AI提供的所有在线工具',
};

export default function AllToolsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              全部工具
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              共 {tools.length} 个工具
            </p>
          </div>
        </section>

        {toolCategories.map((category) => {
          const categoryTools = tools.filter(t => t.category === category.id);
          if (categoryTools.length === 0) return null;

          return (
            <section key={category.id} className="py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {category.name}
                  </h2>
                  <Link
                    href={`/tools/${category.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    查看更多
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categoryTools.slice(0, 8).map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </main>

      <Footer />
    </div>
  );
}
