import React, { useState, useMemo } from 'react';
import { 
  Shuffle, Search, Filter, Layers, 
  ChevronRight, ArrowRight, Brain, 
  Sparkles, Database, Info, Activity,
  Zap, ArrowLeftRight, Binary, Target,
  CheckCircle2, X, Plus, Minus
} from 'lucide-react';
import { clarityMatrixBank, ConfusedTermPair } from '../data/courseContent';

interface ClarityMatrixProps {
  onPlayClick?: () => void;
}

const ClarityMatrix: React.FC<ClarityMatrixProps> = ({ onPlayClick }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(clarityMatrixBank[0]?.id || null);

  const categories = useMemo(() => ['All', ...new Set(clarityMatrixBank.map(c => c.category))], []);

  const filteredPairs = useMemo(() => {
    return clarityMatrixBank.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.comparison.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in text-left pb-40 px-4 md:px-10 py-10">
      
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-white/5 pb-12">
        <div className="space-y-6 text-white overflow-hidden flex-1">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gold-main/10 rounded-lg border border-gold-main/20 shadow-gold"><Shuffle size={14} className="text-gold-main animate-pulse" /></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Cognitive Signal Processor</span>
            </div>
            <div className="space-y-2">
                <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-serif font-bold tracking-tighter leading-[0.8] italic uppercase">Clarity <span className="text-gold-main not-italic">Matrix</span></h1>
                <p className="text-slate-400 text-sm md:text-xl font-light max-w-2xl italic leading-relaxed border-l-2 border-gold-main/20 pl-6 py-1">
                    Definitive resolution for the most commonly confused board topics. Establish distinct synaptic anchors and eliminate signal interference.
                </p>
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="px-10 py-6 bg-slate-900 border border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-1 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-12 h-12 bg-gold-main/5 blur-xl group-hover:bg-gold-main/10 transition-colors"></div>
                <ArrowLeftRight size={14} className="text-gold-main/60 mb-1" />
                <span className="text-3xl font-serif font-bold text-white italic leading-none">{clarityMatrixBank.length}</span>
                <span className="text-[8px] font-black uppercase text-white/30 tracking-[0.3em]">Pairs</span>
            </div>
            <div className="px-10 py-6 bg-slate-950 border border-gold-main/20 rounded-[2.5rem] flex flex-col items-center justify-center gap-1 shadow-gold-dim relative overflow-hidden">
                <Target size={14} className="text-gold-main mb-1" />
                <span className="text-[9px] font-black uppercase text-gold-main/60 tracking-widest text-center leading-tight">Board<br/>Standards</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-10">
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-gold-main transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search term pairs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-xs text-white focus:border-gold-main/40 transition-all outline-none font-sans placeholder:text-white/10"
                />
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3 text-gold-main px-2">
                    <Filter size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sector Filter</span>
                </div>
                <div className="flex flex-wrap lg:flex-col gap-2">
                    {categories.map((cat) => (
                        <button 
                            key={cat}
                            onClick={() => { onPlayClick?.(); setActiveCategory(cat); }}
                            className={`px-6 py-4 rounded-[1.8rem] border text-left transition-all duration-500 group relative overflow-hidden flex items-center gap-4 ${activeCategory === cat ? 'bg-gold-main border-gold-main text-slate-950 shadow-gold' : 'bg-slate-950/40 border-white/5 hover:bg-white/[0.04] hover:border-gold-main/40 text-white/40 hover:text-white'}`}
                        >
                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">{cat}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-10 bg-gold-main/5 border border-gold-main/20 rounded-[3rem] space-y-6 group hover:bg-gold-main/10 transition-all duration-1000">
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-gold-main text-slate-950 flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform duration-500"><Brain size={24} /></div>
                    <div>
                        <h4 className="text-base font-serif font-bold text-white italic">Faculty Insight</h4>
                        <p className="text-[8px] text-gold-main font-black uppercase tracking-[0.4em]">Anchor Protocol</p>
                    </div>
                </div>
                <p className="text-base font-serif italic text-slate-300 leading-relaxed border-l-2 border-gold-main/20 pl-6">
                    "The board isn't testing memory; it's testing differentiation. If you can't distinguish Axial from Lateral, you're scanning in the dark, kid."
                </p>
            </div>
        </div>

        {/* Main Accordion Feed */}
        <div className="lg:col-span-8 space-y-4 animate-slide-up">
            {filteredPairs.length > 0 ? filteredPairs.map((pair) => {
                const isOpen = expandedId === pair.id;
                return (
                    <div 
                        key={pair.id}
                        className={`group bg-slate-900/40 backdrop-blur-3xl border rounded-[2.5rem] overflow-hidden transition-all duration-700 ${isOpen ? 'border-gold-main/40 shadow-3xl bg-slate-950/60 ring-1 ring-gold-main/10' : 'border-white/5 hover:border-white/20 shadow-xl'}`}
                    >
                        <button 
                            onClick={() => { onPlayClick?.(); setExpandedId(isOpen ? null : pair.id); }}
                            className="w-full p-8 md:p-10 flex justify-between items-center group/btn text-left"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-8">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 rounded-full bg-gold-main/10 border border-gold-main/20 text-[8px] font-black text-gold-main uppercase tracking-[0.3em]">{pair.category}</span>
                                    <div className="h-0.5 w-6 bg-white/5 hidden sm:block"></div>
                                </div>
                                <h3 className="text-xl md:text-2xl font-serif font-bold text-white italic tracking-tight group-hover/btn:text-gold-main transition-colors uppercase leading-none">
                                    {pair.title}
                                </h3>
                            </div>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shrink-0 ${isOpen ? 'bg-gold-main text-slate-950 shadow-gold rotate-90' : 'bg-white/5 text-white/20 group-hover/btn:bg-white/10 group-hover/btn:text-white'}`}>
                                {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                            </div>
                        </button>

                        <div className={`transition-all duration-700 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="p-8 md:p-14 pt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 relative">
                                    {/* Comparison Track */}
                                    <div className="hidden md:block absolute left-1/2 top-0 bottom-10 w-px bg-gradient-to-b from-white/10 via-gold-main/20 to-transparent -translate-x-1/2 z-0"></div>
                                    
                                    {pair.comparison.map((term, tIdx) => (
                                        <div key={tIdx} className="space-y-10 relative z-10">
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center text-gold-main/70 shadow-inner group/term transition-transform hover:scale-110">
                                                        <Binary size={20} />
                                                    </div>
                                                    <h4 className="text-xl md:text-2xl font-serif font-bold text-white uppercase tracking-tighter italic leading-none">{term.name}</h4>
                                                </div>
                                                
                                                <p className="text-lg text-slate-400 font-light leading-relaxed italic border-l border-white/5 pl-8 py-1">
                                                    {term.description}
                                                </p>
                                            </div>

                                            <div className="p-8 bg-gold-main/10 border border-gold-main/20 rounded-[2rem] space-y-3 relative overflow-hidden group/anchor">
                                                <div className="absolute inset-0 bg-gold-main/5 opacity-0 group-hover/anchor:opacity-100 transition-opacity duration-1000"></div>
                                                <div className="flex items-center gap-3 text-gold-main mb-2 relative z-10">
                                                    <Target size={14} className="animate-pulse" />
                                                    <span className="text-[9px] font-black uppercase tracking-[0.4em]">Synaptic Anchor</span>
                                                </div>
                                                <p className="text-sm md:text-base font-black uppercase text-white tracking-[0.2em] leading-relaxed relative z-10">
                                                    {term.keyAnchor}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-4 text-white/20">
                                        <div className="flex -space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center"><CheckCircle2 size={12} className="text-green-500" /></div>
                                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center"><Activity size={12} className="text-blue-500" /></div>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Resonance Synchronized</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-gold-main shadow-gold animate-pulse" style={{ width: '100%' }}></div>
                                        </div>
                                        <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest font-bold">Node_{pair.id.toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }) : (
                <div className="py-40 text-center space-y-8 bg-slate-950/20 border border-dashed border-white/10 rounded-[4rem]">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-gold-main/20 blur-3xl rounded-full"></div>
                        <Search size={80} className="text-white/5 relative z-10 mx-auto" />
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-3xl font-serif font-bold text-white/40 italic tracking-tight">Signal Flatline</h3>
                        <p className="text-sm text-white/20 uppercase tracking-[0.4em] font-black">No matrix nodes match your current uplink</p>
                    </div>
                    <button 
                        onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                        className="px-12 py-5 bg-white/5 border border-white/10 text-white/40 hover:text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all hover:bg-gold-main hover:text-slate-950 hover:border-gold-main shadow-lg"
                    >
                        Reset Uplink Parameters
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ClarityMatrix;