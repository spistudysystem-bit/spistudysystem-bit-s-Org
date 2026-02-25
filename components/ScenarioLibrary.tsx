import React, { useState, useMemo } from 'react';
import { 
  FileQuestion, Search, Filter, Layers, 
  ChevronRight, Eye, EyeOff, Brain, 
  Sparkles, Database, Info, Activity,
  Stethoscope, ShieldCheck, Zap
} from 'lucide-react';
import { scenarioBank, Scenario } from '../data/courseContent';

interface ScenarioLibraryProps {
  onPlayClick?: () => void;
}

const ScenarioLibrary: React.FC<ScenarioLibraryProps> = ({ onPlayClick }) => {
  const [activePart, setActivePart] = useState<number>(0); // 0 means all
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const parts = [
    { id: 0, label: 'All Parts' },
    { id: 1, label: 'Physics Principles' },
    { id: 2, label: 'Transducers & Imaging' },
    { id: 3, label: 'Hemodynamics & Doppler' },
    { id: 4, label: 'Quality Assurance' }
  ];

  const filteredScenarios = useMemo(() => {
    return scenarioBank.filter(s => {
      const matchesPart = activePart === 0 || s.part === activePart;
      const matchesSearch = s.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPart && matchesSearch;
    });
  }, [activePart, searchQuery]);

  const toggleReveal = (id: string) => {
    const next = new Set(revealedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setRevealedIds(next);
  };

  const revealAll = () => setRevealedIds(new Set(filteredScenarios.map(s => s.id)));
  const hideAll = () => setRevealedIds(new Set());

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in text-left pb-40 px-4 md:px-10 py-10">
      
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-white/5 pb-12">
        <div className="space-y-6 text-white overflow-hidden flex-1">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gold-main/10 rounded-lg border border-gold-main/20"><FileQuestion size={14} className="text-gold-main animate-pulse" /></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Clinical Response Protocol</span>
            </div>
            <div className="space-y-2">
                <h1 className="text-[clamp(2rem,8vw,5.5rem)] font-serif font-bold tracking-tighter leading-[0.8] italic uppercase">Scenario <span className="text-gold-main not-italic">Vault</span></h1>
                <p className="text-slate-400 text-sm md:text-xl font-light max-w-2xl italic leading-relaxed border-l-2 border-gold-main/20 pl-6 py-1">
                    Traverse real-world clinical dilemmas. Strengthen your diagnostic intuition by resolving scenarios before revealing the faculty resolution.
                </p>
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="px-8 py-5 bg-slate-900 border border-white/5 rounded-[2rem] flex flex-col items-center justify-center gap-1 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-12 h-12 bg-gold-main/5 blur-xl group-hover:bg-gold-main/10 transition-colors"></div>
                <Database size={14} className="text-gold-main/60 mb-1" />
                <span className="text-2xl font-serif font-bold text-white italic leading-none">{scenarioBank.length}</span>
                <span className="text-[7px] font-black uppercase text-white/20 tracking-widest">Case Files</span>
            </div>
            <div className="px-8 py-5 bg-slate-950 border border-gold-main/20 rounded-[2rem] flex flex-col items-center justify-center gap-1 shadow-gold-dim relative overflow-hidden">
                <Stethoscope size={14} className="text-gold-main mb-1" />
                <span className="text-[8px] font-black uppercase text-gold-main/60 tracking-widest text-center">Board Aligned</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Sidebar: Filters */}
        <div className="lg:col-span-3 space-y-8">
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-gold-main transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search Case Files..."
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
                    {parts.map((p) => (
                        <button 
                            key={p.id}
                            onClick={() => { onPlayClick?.(); setActivePart(p.id); }}
                            className={`px-6 py-3.5 rounded-[1.5rem] border text-left transition-all duration-500 group relative overflow-hidden flex items-center gap-4 ${activePart === p.id ? 'bg-gold-main border-gold-main text-slate-950 shadow-gold' : 'bg-slate-950/40 border-white/5 hover:bg-white/[0.04] hover:border-gold-main/40 text-white/40 hover:text-white'}`}
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest">{p.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-8 bg-gold-main/5 border border-gold-main/20 rounded-[2.5rem] space-y-4">
                <div className="flex items-center gap-3 text-gold-main">
                    <Brain size={16} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Faculty Protocol</span>
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed border-l-2 border-gold-main/20 pl-4">
                    "Physics isn't just formulas, kid. It's behavior. Read the scenario, visualize the wave, and commit to an answer before you reveal the truth. That's how resonance is built."
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <button onClick={() => { onPlayClick?.(); revealAll(); }} className="w-full py-4 bg-white/5 border border-white/10 text-white/40 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Reveal All Solutions</button>
                <button onClick={() => { onPlayClick?.(); hideAll(); }} className="w-full py-4 bg-white/5 border border-white/10 text-white/40 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Mask All Solutions</button>
            </div>
        </div>

        {/* Main Feed: Scenarios */}
        <div className="lg:col-span-9 space-y-6 animate-slide-up">
            {filteredScenarios.length > 0 ? filteredScenarios.map((s, idx) => (
                <div 
                    key={s.id}
                    className="group bg-slate-950/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:border-gold-main/30 shadow-2xl"
                >
                    <div className="p-8 md:p-12 space-y-8">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 rounded-full bg-gold-main/10 border border-gold-main/20 text-[8px] font-black text-gold-main uppercase tracking-[0.3em]">Part {s.part}</span>
                                <div className="h-px w-8 bg-white/10"></div>
                                <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{s.category}</span>
                            </div>
                            <div className="text-[10px] font-mono text-white/10">CASE_{s.id.toUpperCase()}</div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-6">
                                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center shrink-0 text-white/40 group-hover:text-gold-main transition-colors">
                                    <Activity size={18} />
                                </div>
                                <h3 className="text-xl md:text-2xl font-serif font-bold text-white italic leading-relaxed tracking-tight">
                                    {s.question}
                                </h3>
                            </div>

                            <div className={`transition-all duration-700 overflow-hidden ${revealedIds.has(s.id) ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="p-8 bg-gold-main/5 border border-gold-main/20 rounded-3xl space-y-4 mt-4">
                                    <div className="flex items-center gap-3 text-gold-main">
                                        <ShieldCheck size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Faculty Resolution</span>
                                    </div>
                                    <p className="text-lg md:text-xl text-slate-200 font-serif italic leading-relaxed">
                                        {s.answer}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
                                <Zap size={14} className="text-gold-main/40" />
                                <span>Diagnostic Threshold: Validated</span>
                            </div>
                            
                            <button 
                                onClick={() => { onPlayClick?.(); toggleReveal(s.id); }}
                                className={`w-full sm:w-auto px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all flex items-center justify-center gap-3 ${
                                    revealedIds.has(s.id) 
                                        ? 'bg-white/5 text-white/60 border border-white/10' 
                                        : 'bg-gold-main text-slate-950 shadow-gold hover:shadow-[0_15px_40px_rgba(181,148,78,0.3)]'
                                }`}
                            >
                                {revealedIds.has(s.id) ? <><EyeOff size={16} /> Hide Resolution</> : <><Eye size={16} /> Reveal Resolution</>}
                            </button>
                        </div>
                    </div>
                </div>
            )) : (
                <div className="py-40 text-center space-y-6 bg-slate-950/20 border border-dashed border-white/10 rounded-[4rem]">
                    <Search size={64} className="text-white/5 mx-auto" />
                    <div className="space-y-2">
                        <h3 className="text-2xl font-serif font-bold text-white/40 italic">No Case Signal</h3>
                        <p className="text-sm text-white/20 uppercase tracking-[0.3em]">Adjust your filters to locate clinical nodes</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ScenarioLibrary;