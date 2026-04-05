'use client';

import Link from 'next/link';
import {
  Cloud, DollarSign, TrendingUp, Newspaper, Map, Languages, Calculator, Scale,
  CreditCard, Mail, Calendar, Globe, Users, Network, Key, Signal, Volume2,
  Timer, QrCode, Baby, Cigarette, Camera, Mic, Eye, Activity, Smartphone,
  RefreshCw, User, Scan, Barcode, Hash, Tag, Search, Server,
  Shuffle, BookOpen, MapPin, Atom, PenTool, Car, Type, Star, Palette,
  Crosshair, FileImage, Contrast, ImagePlus, Image, Minimize2, FileSpreadsheet,
  Grid, Droplet, Layers, Crop, Square, Edit, Grid3x3, Columns,
  Shield, Lock, Zap, Check, Rabbit, Diff, Braces, Bug,
  FileCode, Clock, Database, Binary, Play, AlignLeft,
  ArrowLeftRight, Link as LinkIcon, Coins, File
} from 'lucide-react';
import { Tool } from '@/config/tools';
import { clsx } from 'clsx';

interface ToolCardProps {
  tool: Tool;
  featured?: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Cloud, DollarSign, TrendingUp, Newspaper, Map, Languages, Calculator, Scale,
  CreditCard, Mail, Calendar, Globe, Users, Network, Key, Signal, Volume2,
  Timer, QrCode, Baby, Cigarette, Camera, Mic, Eye, Activity, Smartphone,
  ChineseYuan: Coins, RefreshCw, User, Scan, Barcode, Hash, Tag, Search, Server,
  Shuffle, BookOpen, MapPin, Atom, PenTool, Car, Type, Star, Palette,
  Crosshair, FileImage, Contrast, ImagePlus, Image, Minimize2, FileSpreadsheet,
  Grid, Droplet, Layers, Crop, Square, Edit, Grid3x3, Columns,
  Text: Type, Shield, Lock, Zap, Check, Rabbit, Diff, Braces, Bug,
  FileCode, Clock, Database, Binary, Play, AlignLeft, ArrowLeftRight,
  PaletteIcon: Palette, Zip: File, LinkIcon, Vibrate: Signal, Labyrinth: Grid,
  ShieldCheck: Shield, rgbhex: Palette
};

export default function ToolCard({ tool, featured }: ToolCardProps) {
  const IconComponent = iconMap[tool.icon] || Star;

  return (
    <Link
      href={tool.path}
      className={clsx(
        'group block p-5 rounded-2xl border transition-all duration-200',
        'bg-white dark:bg-slate-800',
        'border-slate-200 dark:border-slate-700',
        'hover:border-blue-300 dark:hover:border-blue-600',
        'hover:shadow-lg hover:shadow-blue-500/10',
        'hover:-translate-y-1',
        featured && 'ring-2 ring-blue-500/20'
      )}
    >
      <div className="flex items-start gap-4">
        <div className={clsx(
          'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
          'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30',
          'group-hover:from-blue-100 group-hover:to-purple-100',
          'dark:group-hover:from-blue-900/50 dark:group-hover:to-purple-900/50',
          'transition-all duration-200'
        )}>
          <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {tool.name}
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
            {tool.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
