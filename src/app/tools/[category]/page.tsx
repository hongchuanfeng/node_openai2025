import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToolCard from '@/components/ToolCard';
import { tools, toolCategories } from '@/config/tools';
import { Home, Image, Shield, Code, Zap } from 'lucide-react';
import Link from 'next/link';

interface Props {
  params: Promise<{ category: string }>;
}

const categoryIcons: Record<string, React.ReactNode> = {
  life: <Home className="w-8 h-8" />,
  image: <Image className="w-8 h-8" />,
  encrypt: <Shield className="w-8 h-8" />,
  encode: <Code className="w-8 h-8" />,
  dev: <Zap className="w-8 h-8" />,
};

const categoryColors: Record<string, string> = {
  life: 'from-emerald-500 to-teal-500',
  image: 'from-pink-500 to-rose-500',
  encrypt: 'from-violet-500 to-purple-500',
  encode: 'from-amber-500 to-orange-500',
  dev: 'from-blue-500 to-cyan-500',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const categoryInfo = toolCategories.find(c => c.id === category);
  if (!categoryInfo) {
    return { title: '工具分类' };
  }
  return {
    title: categoryInfo.name,
    description: `${categoryInfo.name} - ${categoryInfo.description}`,
  };
}

export function generateStaticParams() {
  return toolCategories.map((cat) => ({
    category: cat.id,
  }));
}

export default async function ToolsPage({ params }: Props) {
  const { category } = await params;
  const categoryInfo = toolCategories.find(c => c.id === category);

  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              分类不存在
            </h1>
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              返回首页
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryTools = tools.filter(t => t.category === category);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${categoryColors[category]} p-0.5`}>
                <div className="w-full h-full rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
                  {categoryIcons[category]}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {categoryInfo.name}
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  {categoryInfo.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoryTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
