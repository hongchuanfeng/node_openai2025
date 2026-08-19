'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Atom, Search } from 'lucide-react';

interface Element {
  num: number;
  symbol: string;
  name: string;
  nameEn: string;
  weight: string;
  category: string;
  row: number;
  col: number;
}

const elements: Element[] = [
  { num: 1, symbol: 'H', name: '氢', nameEn: 'Hydrogen', weight: '1.008', category: '非金属', row: 1, col: 1 },
  { num: 2, symbol: 'He', name: '氦', nameEn: 'Helium', weight: '4.003', category: '稀有气体', row: 1, col: 18 },
  { num: 3, symbol: 'Li', name: '锂', nameEn: 'Lithium', weight: '6.941', category: '碱金属', row: 2, col: 1 },
  { num: 4, symbol: 'Be', name: '铍', nameEn: 'Beryllium', weight: '9.012', category: '碱土金属', row: 2, col: 2 },
  { num: 5, symbol: 'B', name: '硼', nameEn: 'Boron', weight: '10.81', category: '类金属', row: 2, col: 13 },
  { num: 6, symbol: 'C', name: '碳', nameEn: 'Carbon', weight: '12.01', category: '非金属', row: 2, col: 14 },
  { num: 7, symbol: 'N', name: '氮', nameEn: 'Nitrogen', weight: '14.01', category: '非金属', row: 2, col: 15 },
  { num: 8, symbol: 'O', name: '氧', nameEn: 'Oxygen', weight: '16.00', category: '非金属', row: 2, col: 16 },
  { num: 9, symbol: 'F', name: '氟', nameEn: 'Fluorine', weight: '19.00', category: '卤素', row: 2, col: 17 },
  { num: 10, symbol: 'Ne', name: '氖', nameEn: 'Neon', weight: '20.18', category: '稀有气体', row: 2, col: 18 },
  { num: 11, symbol: 'Na', name: '钠', nameEn: 'Sodium', weight: '22.99', category: '碱金属', row: 3, col: 1 },
  { num: 12, symbol: 'Mg', name: '镁', nameEn: 'Magnesium', weight: '24.31', category: '碱土金属', row: 3, col: 2 },
  { num: 13, symbol: 'Al', name: '铝', nameEn: 'Aluminium', weight: '26.98', category: '贫金属', row: 3, col: 13 },
  { num: 14, symbol: 'Si', name: '硅', nameEn: 'Silicon', weight: '28.09', category: '类金属', row: 3, col: 14 },
  { num: 15, symbol: 'P', name: '磷', nameEn: 'Phosphorus', weight: '30.97', category: '非金属', row: 3, col: 15 },
  { num: 16, symbol: 'S', name: '硫', nameEn: 'Sulfur', weight: '32.07', category: '非金属', row: 3, col: 16 },
  { num: 17, symbol: 'Cl', name: '氯', nameEn: 'Chlorine', weight: '35.45', category: '卤素', row: 3, col: 17 },
  { num: 18, symbol: 'Ar', name: '氩', nameEn: 'Argon', weight: '39.95', category: '稀有气体', row: 3, col: 18 },
  { num: 19, symbol: 'K', name: '钾', nameEn: 'Potassium', weight: '39.10', category: '碱金属', row: 4, col: 1 },
  { num: 20, symbol: 'Ca', name: '钙', nameEn: 'Calcium', weight: '40.08', category: '碱土金属', row: 4, col: 2 },
  { num: 21, symbol: 'Sc', name: '钪', nameEn: 'Scandium', weight: '44.96', category: '过渡金属', row: 4, col: 3 },
  { num: 22, symbol: 'Ti', name: '钛', nameEn: 'Titanium', weight: '47.87', category: '过渡金属', row: 4, col: 4 },
  { num: 23, symbol: 'V', name: '钒', nameEn: 'Vanadium', weight: '50.94', category: '过渡金属', row: 4, col: 5 },
  { num: 24, symbol: 'Cr', name: '铬', nameEn: 'Chromium', weight: '52.00', category: '过渡金属', row: 4, col: 6 },
  { num: 25, symbol: 'Mn', name: '锰', nameEn: 'Manganese', weight: '54.94', category: '过渡金属', row: 4, col: 7 },
  { num: 26, symbol: 'Fe', name: '铁', nameEn: 'Iron', weight: '55.85', category: '过渡金属', row: 4, col: 8 },
  { num: 27, symbol: 'Co', name: '钴', nameEn: 'Cobalt', weight: '58.93', category: '过渡金属', row: 4, col: 9 },
  { num: 28, symbol: 'Ni', name: '镍', nameEn: 'Nickel', weight: '58.69', category: '过渡金属', row: 4, col: 10 },
  { num: 29, symbol: 'Cu', name: '铜', nameEn: 'Copper', weight: '63.55', category: '过渡金属', row: 4, col: 11 },
  { num: 30, symbol: 'Zn', name: '锌', nameEn: 'Zinc', weight: '65.38', category: '过渡金属', row: 4, col: 12 },
  { num: 31, symbol: 'Ga', name: '镓', nameEn: 'Gallium', weight: '69.72', category: '贫金属', row: 4, col: 13 },
  { num: 32, symbol: 'Ge', name: '锗', nameEn: 'Germanium', weight: '72.63', category: '类金属', row: 4, col: 14 },
  { num: 33, symbol: 'As', name: '砷', nameEn: 'Arsenic', weight: '74.92', category: '类金属', row: 4, col: 15 },
  { num: 34, symbol: 'Se', name: '硒', nameEn: 'Selenium', weight: '78.97', category: '非金属', row: 4, col: 16 },
  { num: 35, symbol: 'Br', name: '溴', nameEn: 'Bromine', weight: '79.90', category: '卤素', row: 4, col: 17 },
  { num: 36, symbol: 'Kr', name: '氪', nameEn: 'Krypton', weight: '83.80', category: '稀有气体', row: 4, col: 18 },
  { num: 37, symbol: 'Rb', name: '铷', nameEn: 'Rubidium', weight: '85.47', category: '碱金属', row: 5, col: 1 },
  { num: 38, symbol: 'Sr', name: '锶', nameEn: 'Strontium', weight: '87.62', category: '碱土金属', row: 5, col: 2 },
  { num: 39, symbol: 'Y', name: '钇', nameEn: 'Yttrium', weight: '88.91', category: '过渡金属', row: 5, col: 3 },
  { num: 40, symbol: 'Zr', name: '锆', nameEn: 'Zirconium', weight: '91.22', category: '过渡金属', row: 5, col: 4 },
  { num: 41, symbol: 'Nb', name: '铌', nameEn: 'Niobium', weight: '92.91', category: '过渡金属', row: 5, col: 5 },
  { num: 42, symbol: 'Mo', name: '钼', nameEn: 'Molybdenum', weight: '95.95', category: '过渡金属', row: 5, col: 6 },
  { num: 43, symbol: 'Tc', name: '锝', nameEn: 'Technetium', weight: '(98)', category: '过渡金属', row: 5, col: 7 },
  { num: 44, symbol: 'Ru', name: '钌', nameEn: 'Ruthenium', weight: '101.1', category: '过渡金属', row: 5, col: 8 },
  { num: 45, symbol: 'Rh', name: '铑', nameEn: 'Rhodium', weight: '102.9', category: '过渡金属', row: 5, col: 9 },
  { num: 46, symbol: 'Pd', name: '钯', nameEn: 'Palladium', weight: '106.4', category: '过渡金属', row: 5, col: 10 },
  { num: 47, symbol: 'Ag', name: '银', nameEn: 'Silver', weight: '107.9', category: '过渡金属', row: 5, col: 11 },
  { num: 48, symbol: 'Cd', name: '镉', nameEn: 'Cadmium', weight: '112.4', category: '过渡金属', row: 5, col: 12 },
  { num: 49, symbol: 'In', name: '铟', nameEn: 'Indium', weight: '114.8', category: '贫金属', row: 5, col: 13 },
  { num: 50, symbol: 'Sn', name: '锡', nameEn: 'Tin', weight: '118.7', category: '贫金属', row: 5, col: 14 },
  { num: 51, symbol: 'Sb', name: '锑', nameEn: 'Antimony', weight: '121.8', category: '类金属', row: 5, col: 15 },
  { num: 52, symbol: 'Te', name: '碲', nameEn: 'Tellurium', weight: '127.6', category: '类金属', row: 5, col: 16 },
  { num: 53, symbol: 'I', name: '碘', nameEn: 'Iodine', weight: '126.9', category: '卤素', row: 5, col: 17 },
  { num: 54, symbol: 'Xe', name: '氙', nameEn: 'Xenon', weight: '131.3', category: '稀有气体', row: 5, col: 18 },
  { num: 55, symbol: 'Cs', name: '铯', nameEn: 'Caesium', weight: '132.9', category: '碱金属', row: 6, col: 1 },
  { num: 56, symbol: 'Ba', name: '钡', nameEn: 'Barium', weight: '137.3', category: '碱土金属', row: 6, col: 2 },
  { num: 57, symbol: 'La', name: '镧', nameEn: 'Lanthanum', weight: '138.9', category: '镧系元素', row: 9, col: 3 },
  { num: 58, symbol: 'Ce', name: '铈', nameEn: 'Cerium', weight: '140.1', category: '镧系元素', row: 9, col: 4 },
  { num: 59, symbol: 'Pr', name: '镨', nameEn: 'Praseodymium', weight: '140.9', category: '镧系元素', row: 9, col: 5 },
  { num: 60, symbol: 'Nd', name: '钕', nameEn: 'Neodymium', weight: '144.2', category: '镧系元素', row: 9, col: 6 },
  { num: 61, symbol: 'Pm', name: '钷', nameEn: 'Promethium', weight: '(145)', category: '镧系元素', row: 9, col: 7 },
  { num: 62, symbol: 'Sm', name: '钐', nameEn: 'Samarium', weight: '150.4', category: '镧系元素', row: 9, col: 8 },
  { num: 63, symbol: 'Eu', name: '铕', nameEn: 'Europium', weight: '152.0', category: '镧系元素', row: 9, col: 9 },
  { num: 64, symbol: 'Gd', name: '钆', nameEn: 'Gadolinium', weight: '157.3', category: '镧系元素', row: 9, col: 10 },
  { num: 65, symbol: 'Tb', name: '铽', nameEn: 'Terbium', weight: '158.9', category: '镧系元素', row: 9, col: 11 },
  { num: 66, symbol: 'Dy', name: '镝', nameEn: 'Dysprosium', weight: '162.5', category: '镧系元素', row: 9, col: 12 },
  { num: 67, symbol: 'Ho', name: '钬', nameEn: 'Holmium', weight: '164.9', category: '镧系元素', row: 9, col: 13 },
  { num: 68, symbol: 'Er', name: '铒', nameEn: 'Erbium', weight: '167.3', category: '镧系元素', row: 9, col: 14 },
  { num: 69, symbol: 'Tm', name: '铥', nameEn: 'Thulium', weight: '168.9', category: '镧系元素', row: 9, col: 15 },
  { num: 70, symbol: 'Yb', name: '镱', nameEn: 'Ytterbium', weight: '173.0', category: '镧系元素', row: 9, col: 16 },
  { num: 71, symbol: 'Lu', name: '镥', nameEn: 'Lutetium', weight: '175.0', category: '镧系元素', row: 9, col: 17 },
  { num: 72, symbol: 'Hf', name: '铪', nameEn: 'Hafnium', weight: '178.5', category: '过渡金属', row: 6, col: 4 },
  { num: 73, symbol: 'Ta', name: '钽', nameEn: 'Tantalum', weight: '180.9', category: '过渡金属', row: 6, col: 5 },
  { num: 74, symbol: 'W', name: '钨', nameEn: 'Tungsten', weight: '183.8', category: '过渡金属', row: 6, col: 6 },
  { num: 75, symbol: 'Re', name: '铼', nameEn: 'Rhenium', weight: '186.2', category: '过渡金属', row: 6, col: 7 },
  { num: 76, symbol: 'Os', name: '锇', nameEn: 'Osmium', weight: '190.2', category: '过渡金属', row: 6, col: 8 },
  { num: 77, symbol: 'Ir', name: '铱', nameEn: 'Iridium', weight: '192.2', category: '过渡金属', row: 6, col: 9 },
  { num: 78, symbol: 'Pt', name: '铂', nameEn: 'Platinum', weight: '195.1', category: '过渡金属', row: 6, col: 10 },
  { num: 79, symbol: 'Au', name: '金', nameEn: 'Gold', weight: '197.0', category: '过渡金属', row: 6, col: 11 },
  { num: 80, symbol: 'Hg', name: '汞', nameEn: 'Mercury', weight: '200.6', category: '过渡金属', row: 6, col: 12 },
  { num: 81, symbol: 'Tl', name: '铊', nameEn: 'Thallium', weight: '204.4', category: '贫金属', row: 6, col: 13 },
  { num: 82, symbol: 'Pb', name: '铅', nameEn: 'Lead', weight: '207.2', category: '贫金属', row: 6, col: 14 },
  { num: 83, symbol: 'Bi', name: '铋', nameEn: 'Bismuth', weight: '209.0', category: '贫金属', row: 6, col: 15 },
  { num: 84, symbol: 'Po', name: '钋', nameEn: 'Polonium', weight: '(209)', category: '类金属', row: 6, col: 16 },
  { num: 85, symbol: 'At', name: '砹', nameEn: 'Astatine', weight: '(210)', category: '卤素', row: 6, col: 17 },
  { num: 86, symbol: 'Rn', name: '氡', nameEn: 'Radon', weight: '(222)', category: '稀有气体', row: 6, col: 18 },
  { num: 87, symbol: 'Fr', name: '钫', nameEn: 'Francium', weight: '(223)', category: '碱金属', row: 7, col: 1 },
  { num: 88, symbol: 'Ra', name: '镭', nameEn: 'Radium', weight: '(226)', category: '碱土金属', row: 7, col: 2 },
  { num: 89, symbol: 'Ac', name: '锕', nameEn: 'Actinium', weight: '(227)', category: '锕系元素', row: 10, col: 3 },
  { num: 90, symbol: 'Th', name: '钍', nameEn: 'Thorium', weight: '232.0', category: '锕系元素', row: 10, col: 4 },
  { num: 91, symbol: 'Pa', name: '镤', nameEn: 'Protactinium', weight: '231.0', category: '锕系元素', row: 10, col: 5 },
  { num: 92, symbol: 'U', name: '铀', nameEn: 'Uranium', weight: '238.0', category: '锕系元素', row: 10, col: 6 },
  { num: 93, symbol: 'Np', name: '镎', nameEn: 'Neptunium', weight: '(237)', category: '锕系元素', row: 10, col: 7 },
  { num: 94, symbol: 'Pu', name: '钚', nameEn: 'Plutonium', weight: '(244)', category: '锕系元素', row: 10, col: 8 },
  { num: 95, symbol: 'Am', name: '镅', nameEn: 'Americium', weight: '(243)', category: '锕系元素', row: 10, col: 9 },
  { num: 96, symbol: 'Cm', name: '锔', nameEn: 'Curium', weight: '(247)', category: '锕系元素', row: 10, col: 10 },
  { num: 97, symbol: 'Bk', name: '锫', nameEn: 'Berkelium', weight: '(247)', category: '锕系元素', row: 10, col: 11 },
  { num: 98, symbol: 'Cf', name: '锎', nameEn: 'Californium', weight: '(251)', category: '锕系元素', row: 10, col: 12 },
  { num: 99, symbol: 'Es', name: '锿', nameEn: 'Einsteinium', weight: '(252)', category: '锕系元素', row: 10, col: 13 },
  { num: 100, symbol: 'Fm', name: '镄', nameEn: 'Fermium', weight: '(257)', category: '锕系元素', row: 10, col: 14 },
  { num: 101, symbol: 'Md', name: '钔', nameEn: 'Mendelevium', weight: '(258)', category: '锕系元素', row: 10, col: 15 },
  { num: 102, symbol: 'No', name: '锘', nameEn: 'Nobelium', weight: '(259)', category: '锕系元素', row: 10, col: 16 },
  { num: 103, symbol: 'Lr', name: '铹', nameEn: 'Lawrencium', weight: '(266)', category: '锕系元素', row: 10, col: 17 },
  { num: 104, symbol: 'Rf', name: '𬬻', nameEn: 'Rutherfordium', weight: '(267)', category: '过渡金属', row: 7, col: 4 },
  { num: 105, symbol: 'Db', name: '𬭊', nameEn: 'Dubnium', weight: '(268)', category: '过渡金属', row: 7, col: 5 },
  { num: 106, symbol: 'Sg', name: '𬭳', nameEn: 'Seaborgium', weight: '(269)', category: '过渡金属', row: 7, col: 6 },
  { num: 107, symbol: 'Bh', name: '𬭛', nameEn: 'Bohrium', weight: '(270)', category: '过渡金属', row: 7, col: 7 },
  { num: 108, symbol: 'Hs', name: '𬭶', nameEn: 'Hassium', weight: '(269)', category: '过渡金属', row: 7, col: 8 },
  { num: 109, symbol: 'Mt', name: '鿏', nameEn: 'Meitnerium', weight: '(278)', category: '过渡金属', row: 7, col: 9 },
  { num: 110, symbol: 'Ds', name: '𫟼', nameEn: 'Darmstadtium', weight: '(281)', category: '过渡金属', row: 7, col: 10 },
  { num: 111, symbol: 'Rg', name: '𬬭', nameEn: 'Roentgenium', weight: '(282)', category: '过渡金属', row: 7, col: 11 },
  { num: 112, symbol: 'Cn', name: '鿔', nameEn: 'Copernicium', weight: '(285)', category: '过渡金属', row: 7, col: 12 },
  { num: 113, symbol: 'Nh', name: '鿭', nameEn: 'Nihonium', weight: '(286)', category: '贫金属', row: 7, col: 13 },
  { num: 114, symbol: 'Fl', name: '𫓧', nameEn: 'Flerovium', weight: '(289)', category: '贫金属', row: 7, col: 14 },
  { num: 115, symbol: 'Mc', name: '镆', nameEn: 'Moscovium', weight: '(290)', category: '贫金属', row: 7, col: 15 },
  { num: 116, symbol: 'Lv', name: '𫟷', nameEn: 'Livermorium', weight: '(293)', category: '贫金属', row: 7, col: 16 },
  { num: 117, symbol: 'Ts', name: '石田', nameEn: 'Tennessine', weight: '(294)', category: '卤素', row: 7, col: 17 },
  { num: 118, symbol: 'Og', name: '奥气', nameEn: 'Oganesson', weight: '(294)', category: '稀有气体', row: 7, col: 18 },
];

const categories = ['全部', '非金属', '稀有气体', '碱金属', '碱土金属', '卤素', '过渡金属', '类金属', '贫金属', '镧系元素', '锕系元素'];

const categoryColors: Record<string, string> = {
  '非金属': 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300',
  '稀有气体': 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300',
  '碱金属': 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300',
  '碱土金属': 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300',
  '卤素': 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300',
  '过渡金属': 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300',
  '类金属': 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300',
  '贫金属': 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300',
  '镧系元素': 'bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700 text-pink-700 dark:text-pink-300',
  '锕系元素': 'bg-rose-100 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300',
};

export default function PeriodicTablePage() {
  const [selected, setSelected] = useState<Element | null>(elements[0]);
  const [filter, setFilter] = useState('全部');
  const [search, setSearch] = useState('');

  const filteredElements = useMemo(() => {
    let result = elements;
    if (filter !== '全部') {
      result = result.filter(e => e.category === filter);
    }
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(query) ||
        e.symbol.toLowerCase().includes(query) ||
        e.nameEn.toLowerCase().includes(query) ||
        e.num.toString().includes(query)
      );
    }
    return result;
  }, [filter, search]);

  const handleSelect = (el: Element) => {
    setSelected(el);
  };

  const isVisible = (el: Element) => {
    if (search.trim()) return true;
    if (filter !== '全部') return el.category === filter;
    return true;
  };

  const renderGrid = () => {
    const grid: (Element | null)[][] = Array.from({ length: 10 }, () => Array(18).fill(null));

    elements.forEach(el => {
      if (el.row >= 1 && el.row <= 7) {
        grid[el.row - 1][el.col - 1] = el;
      }
    });

    return grid;
  };

  const grid = renderGrid();

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
              <Atom className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">元素周期表</h1>
            </div>
            <p className="text-indigo-100 text-lg">化学元素周期表在线查询 · 共 {elements.length} 个元素</p>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="搜索元素名称、符号、原子序数..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === cat ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {search.trim() || filter !== '全部' ? (
              /* Search/Filter Results */
              <div>
                <p className="text-sm text-slate-500 mb-4">找到 {filteredElements.length} 个元素</p>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
                  {filteredElements.map((el) => (
                    <button
                      key={el.num}
                      onClick={() => handleSelect(el)}
                      className={`p-3 rounded-xl text-center transition-all ${selected?.num === el.num ? 'bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-500' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-md'}`}
                    >
                      <div className="text-xs text-slate-400">{el.num}</div>
                      <div className={`text-xl font-bold ${selected?.num === el.num ? 'text-indigo-600' : ''}`}>{el.symbol}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{el.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Full Periodic Table */
              <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                  {/* Main Table */}
                  <div className="space-y-1">
                    {grid.slice(0, 7).map((row, rowIndex) => (
                      <div key={rowIndex} className="flex gap-1">
                        {row.map((el, colIndex) => (
                          <div key={colIndex} className="w-12 h-14 sm:w-14 sm:h-16">
                            {el && (
                              <button
                                onClick={() => handleSelect(el)}
                                className={`w-full h-full p-1 sm:p-2 rounded-lg border transition-all text-center ${categoryColors[el.category]} ${selected?.num === el.num ? 'ring-2 ring-indigo-500 shadow-lg' : 'hover:scale-105 hover:shadow-md'}`}
                              >
                                <div className="text-[8px] sm:text-xs text-slate-400">{el.num}</div>
                                <div className="text-sm sm:text-lg font-bold leading-tight">{el.symbol}</div>
                                <div className="text-[6px] sm:text-[8px] text-slate-500 truncate hidden sm:block">{el.name}</div>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Gap */}
                  <div className="h-4" />

                  {/* Lanthanides & Actinides */}
                  <div className="space-y-1">
                    {grid.slice(9).map((row, rowIndex) => (
                      <div key={rowIndex} className="flex gap-1">
                        <div className="w-12 sm:w-14" /> {/* Spacer */}
                        {row.map((el, colIndex) => (
                          <div key={colIndex} className="w-12 h-14 sm:w-14 sm:h-16">
                            {el && (
                              <button
                                onClick={() => handleSelect(el)}
                                className={`w-full h-full p-1 sm:p-2 rounded-lg border transition-all text-center ${categoryColors[el.category]} ${selected?.num === el.num ? 'ring-2 ring-indigo-500 shadow-lg' : 'hover:scale-105 hover:shadow-md'}`}
                              >
                                <div className="text-[8px] sm:text-xs text-slate-400">{el.num}</div>
                                <div className="text-sm sm:text-lg font-bold leading-tight">{el.symbol}</div>
                                <div className="text-[6px] sm:text-[8px] text-slate-500 truncate hidden sm:block">{el.name}</div>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="mt-8 flex flex-wrap gap-3">
                    {Object.entries(categoryColors).map(([cat, color]) => (
                      <div key={cat} className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${color}`}>
                        <span className="w-2 h-2 rounded-full bg-current opacity-50" />
                        {cat}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Detail Panel */}
            {selected && (
              <div className="mt-10 grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl p-8 text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-6xl font-bold mb-2">{selected.symbol}</div>
                        <div className="text-2xl font-medium mb-1">{selected.name}</div>
                        <div className="text-white/70">{selected.nameEn}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-5xl font-bold opacity-20">{selected.num}</div>
                      </div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    {[
                      { label: '原子序数', value: selected.num },
                      { label: '相对原子质量', value: selected.weight },
                      { label: '元素分类', value: selected.category },
                      { label: '元素符号', value: selected.symbol },
                    ].map((item) => (
                      <div key={item.label} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <div className="text-xs text-slate-500 mb-1">{item.label}</div>
                        <div className="font-bold text-slate-900 dark:text-white">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">关于 {selected.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {selected.nameEn}（{selected.symbol}）是元素周期表中的第 {selected.num} 号元素，
                    相对原子质量约为 {selected.weight}，属于<span className="font-medium">{selected.category}</span>。
                    {selected.category === '过渡金属' && '过渡金属具有良好的导电性和延展性。'}
                    {selected.category === '卤素' && '卤素是周期表中的一个活跃元素族，具有强氧化性。'}
                    {selected.category === '稀有气体' && '稀有气体化学性质稳定，几乎不与其他元素发生反应。'}
                    {selected.category === '碱金属' && '碱金属非常活泼，在自然界中多以化合物形式存在。'}
                    {selected.category === '碱土金属' && '碱土金属在自然界中分布广泛，常用于工业生产。'}
                    {selected.category === '非金属' && '非金属通常不是良好的导体，在常温下可以是气体或固体。'}
                    {selected.category === '类金属' && '类金属具有介于金属和非金属之间的性质。'}
                    {selected.category === '贫金属' && '贫金属密度较低，在工业上有广泛应用。'}
                    {selected.category === '镧系元素' && '镧系元素是一组15种金属元素，具有独特的磁性。'}
                    {selected.category === '锕系元素' && '锕系元素大多具有放射性，在核能领域有重要应用。'}
                  </p>
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
