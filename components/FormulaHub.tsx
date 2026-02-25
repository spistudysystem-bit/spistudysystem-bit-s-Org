import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, Zap, Target, Ruler, Activity, 
  ChevronRight, ArrowRight, Info, Brain, Sparkles,
  Search, Filter, List, Database, Sliders, Hash,
  TrendingUp, TrendingDown, Minus, ArrowLeftRight,
  Clock, Thermometer, Layers, Microscope, Monitor,
  Binary, Gauge, History, ShieldAlert, AlertTriangle,
  Lightbulb, Star, ShieldCheck, HeartPulse, GraduationCap,
  ExternalLink, Globe
} from 'lucide-react';
import { highYieldFormulas, Formula } from '../data/courseContent';

/**
 * ProportionalityBadge Component
 * Extracted to root level for better clarity and performance.
 */
const ProportionalityBadge = ({ type }: { type: 'direct' | 'inverse' | 'none' }) => {
  if (type === 'direct') return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/20 text-green-400">
          <TrendingUp size={10} />
          <span className="text-[7px] font-black uppercase tracking-widest">Direct</span>
      </div>
  );
  if (type === 'inverse') return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-400">
          <TrendingDown size={10} />
          <span className="text-[7px] font-black uppercase tracking-widest">Inverse</span>
      </div>
  );
  return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/40">
          <Minus size={10} />
          <span className="text-[7px] font-black uppercase tracking-widest">Fixed</span>
      </div>
  );
};

interface FormulaHubProps {
  onPlayClick?: () => void;
}

// Use standard function declaration to fix default export detection issues
export default function FormulaHub({ onPlayClick }: FormulaHubProps) {
  const [selectedFormulaId, setSelectedFormulaId] = useState<string>(highYieldFormulas[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [history, setHistory] = useState<string[]>([]);
  
  const [variables, setVariables] = useState<Record<string, number>>({});
  const [previousResult, setPreviousResult] = useState<number | null>(null);

  const categories = useMemo(() => ['All', ...new Set(highYieldFormulas.map(f => f.category))], []);

  const filteredFormulas = useMemo(() => {
    return highYieldFormulas.filter(f => {
      const matchesCategory = activeCategory === 'All' || f.category === activeCategory;
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            f.formula.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const selectedFormula = useMemo(() => {
    return highYieldFormulas.find(f => f.id === selectedFormulaId) || highYieldFormulas[0];
  }, [selectedFormulaId]);

  const handleFormulaSelect = (id: string) => {
    onPlayClick?.();
    setSelectedFormulaId(id);
  };

  const handleCategorySelect = (cat: string) => {
    onPlayClick?.();
    setActiveCategory(cat);
  };

  useEffect(() => {
    const defaults: Record<string, number> = {};
    selectedFormula.variables.forEach(v => {
      defaults[v.name] = (v.min + v.max) / 2;
    });
    setVariables(defaults);
    setPreviousResult(null);
    if (!history.includes(selectedFormulaId)) {
        setHistory(prev => [selectedFormulaId, ...prev].slice(0, 5));
    }
  }, [selectedFormulaId]);

  const handleVarChange = (name: string, value: number) => {
    setPreviousResult(calculationResult);
    setVariables(prev => ({ ...prev, [name]: value }));
  };

  const calculationResult = useMemo(() => {
    const currentVars = { ...variables };
    selectedFormula.variables.forEach(v => {
      if (currentVars[v.name] === undefined) currentVars[v.name] = (v.min + v.max) / 2;
    });
    return selectedFormula.calculate(currentVars);
  }, [selectedFormula, variables]);

  const resultDelta = useMemo(() => {
      if (previousResult === null) return 0;
      return calculationResult - previousResult;
  }, [calculationResult, previousResult]);

  const clinicalConstants = [
    { label: 'Soft Tissue Speed', value: '1540', unit: 'm/s', icon: Activity },
    { label: '13µs Rule', value: '1cm', unit: 'Depth', icon: Ruler },
    { label: 'IRC Bound', value: '1%', unit: 'Mismatch', icon: ArrowLeftRight },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in text-left pb-40 px-4 md:px-10 py-10">
      
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-white/5 pb-12">
        <div className="space-y-6 text-white overflow-hidden flex-1">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gold-main/10 rounded-lg border border-gold-main/20 shadow-gold"><Calculator size={14} className="text-gold-main animate-pulse" /></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Clinical Computation Terminal</span>
            </div>
            <div className="space-y-2">
                <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-serif font-bold tracking-tighter leading-[0.8] italic uppercase">Formula <span className="text-gold-main not-italic">Hub</span></h1>
                <p className="text-slate-400 text-sm md:text-xl font-light max-w-2xl italic leading-relaxed border-l-2 border-gold-main/20 pl-6 py-1">
                    Synchronize with the physical laws of sound. Manipulate live acoustic variables to observe clinical proportionality.
                </p>
            </div>
        </div>
        
        <div className="hidden lg:grid grid-cols-3 gap-3">
            {clinicalConstants.map((c, i) => (
                <div key={i} className="p-6 bg-slate-900 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-1.5 group hover:border-gold-main/20 transition-all shadow-xl">
                    <c.icon size={12} className="text-gold-main/40 group-hover:text-gold-main transition-colors" />
                    <div className="text-center">
                        <p className="text-[7px] font-black uppercase text-white/20 tracking-widest">{c.label}</p>
                        <p className="text-sm font-mono font-bold text-white tracking-tight">{c.value}<span className="text-[9px] text-white/40 ml-1">{c.unit}</span></p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Sidebar Selection */}
        <div className="lg:col-span-4 space-y-10">
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-gold-main transition-colors" />
                <input 
                    type="text" 
                    placeholder="Identify mathematical node..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-xs text-white focus:border-gold-main/40 transition-all outline-none font-sans placeholder:text-white/10 shadow-inner"
                />
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3 text-gold-main/60 px-2">
                    <Filter size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sector Filter</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => handleCategorySelect(cat)}
                      className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-gold-main text-slate-950 border-gold-main shadow-gold' : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3 text-gold-main/60 px-2">
                    <List size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Node Index</span>
                </div>
                <div className="grid grid-cols-1 gap-2.5 max-h-[600px] overflow-y-auto custom-scrollbar pr-3">
                    {filteredFormulas.map((f) => (
                        <button 
                            key={f.id}
                            onClick={() => { handleFormulaSelect(f.id); }}
                            className={`p-5 rounded-2xl border text-left transition-all duration-500 group relative overflow-hidden active:scale-95 ${selectedFormulaId === f.id ? 'bg-gold-main border-gold-main shadow-gold' : 'bg-slate-950/40 border-white/5 hover:border-gold-main/30'}`}
                        >
                            <div className="flex items-center justify-between relative z-10">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className={`text-sm font-serif font-bold italic leading-tight ${selectedFormulaId === f.id ? 'text-slate-950' : 'text-white'}`}>{f.name}</h4>
                                        {f.isHighYield && <Star size={10} className={selectedFormulaId === f.id ? 'text-slate-900/40' : 'text-gold-main animate-pulse'} fill="currentColor" />}
                                    </div>
                                    <p className={`text-[9px] font-mono tracking-tighter ${selectedFormulaId === f.id ? 'text-slate-950/60' : 'text-white/20'}`}>{f.formula}</p>
                                </div>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${selectedFormulaId === f.id ? 'bg-slate-950/10 text-slate-950' : 'bg-white/5 text-white/20'}`}>
                                    <ChevronRight size={14} />
                                </div>
                            </div>
                        </button>
                    ))}
                    {filteredFormulas.length === 0 && (
                        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl opacity-20">
                            <Binary size={48} className="mx-auto mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Null Response</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-10 bg-gold-main/5 border border-gold-main/20 rounded-[3rem] space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000"><Brain size={120} /></div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-gold-main text-slate-950 flex items-center justify-center shadow-gold"><Brain size={24} /></div>
                    <div>
                        <h4 className="text-base font-serif font-bold text-white italic">Faculty Lab Tip</h4>
                        <p className="text-[8px] text-gold-main font-black uppercase tracking-[0.4em]">Proportionality Sync</p>
                    </div>
                </div>
                <p className="text-base font-serif italic text-slate-300 leading-relaxed border-l-2 border-gold-main/20 pl-6 relative z-10">
                    "The board exam tests relationships, not just arithmetic. If frequency is doubled in Doppler, and everything else is constant, the shift MUST double. Visualize the balance."
                </p>
            </div>
        </div>

        {/* Calculator Area */}
        <div className="lg:col-span-8 space-y-10 animate-slide-up">
            
            <div className="p-8 md:p-14 bg-slate-950 border border-white/10 rounded-[4rem] space-y-12 shadow-3xl relative overflow-hidden group/calc">
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover/calc:opacity-5 transition-opacity"><Binary size={240} /></div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full bg-gold-main/10 border border-gold-main/20 text-[8px] font-black text-gold-main uppercase tracking-[0.4em]">{selectedFormula.category} Sector</span>
                            <div className="h-px w-8 bg-white/10"></div>
                            <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest font-bold">NODE_{selectedFormula.id.toUpperCase()}</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-white italic tracking-tighter leading-none">{selectedFormula.name}</h2>
                    </div>
                    <div className="p-6 bg-slate-900 border border-white/5 rounded-3xl w-full md:w-auto shadow-inner flex flex-col items-center justify-center group-hover/calc:border-gold-main/20 transition-colors">
                        <span className="text-[8px] font-black uppercase text-gold-main/40 tracking-[0.4em] mb-2">Equation Matrix</span>
                        <p className="text-xl md:text-3xl font-mono text-gold-main font-bold tracking-tighter italic">
                            {selectedFormula.formula}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-start relative z-10">
                    <div className="lg:col-span-7 space-y-12">
                        <div className="flex items-center gap-4 text-white/30 border-b border-white/5 pb-4">
                            <Sliders size={16} />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Input Variable Controllers</span>
                        </div>
                        <div className="space-y-12">
                            {selectedFormula.variables.map(v => {
                                const relType = selectedFormula.relationships.find(r => r.var === v.name)?.type || 'none';
                                return (
                                    <div key={v.name} className="space-y-5 group/var">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[11px] font-black uppercase text-white/90 tracking-[0.2em] group-hover/var:text-gold-main transition-colors">{v.label}</span>
                                                    <ProportionalityBadge type={relType} />
                                                </div>
                                                <p className="text-[10px] text-slate-500 italic max-w-[280px] leading-snug group-hover/var:text-slate-400 transition-colors">{v.description}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg md:text-2xl font-mono font-bold text-white bg-white/5 px-4 py-1.5 rounded-xl border border-white/10 shadow-lg group-hover/var:border-gold-main/30 transition-all">
                                                    {variables[v.name] ?? v.min} <span className="text-[10px] text-white/20 ml-1">{v.unit}</span>
                                                </span>
                                            </div>
                                        </div>
                                        <input 
                                            type="range" 
                                            min={v.min} max={v.max} step={v.step} 
                                            value={variables[v.name] ?? (v.min + v.max) / 2}
                                            onChange={(e) => handleVarChange(v.name, parseFloat(e.target.value))}
                                            className={`w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer ${relType === 'inverse' ? 'accent-red-500' : 'accent-green-500'} group-hover/var:h-1.5 transition-all`} 
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col gap-8">
                        <div className="bg-slate-900 border border-white/10 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center space-y-6 shadow-3xl group/result hover:border-gold-main/30 transition-all min-h-[350px]">
                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-gold-main uppercase tracking-[0.5em] opacity-40">Matrix Output {selectedFormula.id === 'f8' && '(W/cm²)'}</p>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gold-main/10 blur-3xl rounded-full opacity-0 group-hover/result:opacity-100 transition-opacity"></div>
                                    <span className="text-6xl md:text-[6.5rem] font-serif font-bold italic text-white leading-none tracking-tighter relative z-10 drop-shadow-2xl">
                                        {calculationResult > 1000 ? calculationResult.toExponential(2) : (calculationResult % 1 === 0 ? calculationResult : calculationResult.toFixed(3))}
                                    </span>
                                </div>
                                <p className="text-[11px] font-black uppercase text-white/20 tracking-widest pt-2">System Value Units</p>
                            </div>
                            
                            {resultDelta !== 0 && (
                                <div className={`flex items-center gap-3 px-5 py-2.5 rounded-full border transition-all animate-fade-in ${resultDelta > 0 ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                    {resultDelta > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                    <span className="text-xs font-mono font-bold">Δ {Math.abs(resultDelta).toFixed(4)}</span>
                                </div>
                            )}

                            <div className="w-16 h-px bg-white/5"></div>
                            <div className="flex items-center gap-3 text-gold-main/40 group-hover/result:text-gold-main transition-colors">
                                <Activity size={16} className="animate-pulse" />
                                <span className="text-[8px] font-black uppercase tracking-[0.4em]">Live Resonance Computation</span>
                            </div>
                        </div>

                        {/* Special Context Panel for Intensity */}
                        {selectedFormula.id === 'f8' && (
                            <div className="p-8 bg-blue-500/5 border border-blue-500/20 rounded-3xl space-y-5 animate-slide-up">
                                <div className="flex items-center gap-3 text-blue-400">
                                    <ShieldAlert size={14} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">ALARA Threshold Focus</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-bold text-white/60 px-1">
                                        <span>Bioeffect Descriptor</span>
                                        <span className="text-blue-400">Status</span>
                                    </div>
                                    <div className="space-y-2.5">
                                        {[
                                            { name: 'SPTA', desc: 'Tissue Heating Max', value: '0.720 W/cm²' },
                                            { name: 'SPTP', desc: 'Peak Temporal Concentration', value: 'Monitored' }
                                        ].map(item => (
                                            <div key={item.name} className="p-3 bg-white/5 rounded-xl flex justify-between items-center group/bio hover:bg-white/10 transition-colors">
                                                <div className="text-left">
                                                    <p className="text-[10px] font-bold text-white">{item.name}</p>
                                                    <p className="text-[8px] text-white/30 uppercase">{item.desc}</p>
                                                </div>
                                                <span className="text-[9px] font-mono text-blue-400/60 group-hover/bio:text-blue-400 transition-colors">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* High-Yield External Reference Links */}
                                    <div className="pt-4 border-t border-white/5 mt-4">
                                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-3 px-1">Academic Infrastructure</p>
                                        <div className="flex flex-col gap-2">
                                            {selectedFormula.referenceLinks?.map((link, idx) => (
                                                <a 
                                                    key={idx}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between group/link hover:bg-gold-main/10 hover:border-gold-main/30 transition-all"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Globe size={12} className="text-gold-main/60 group-hover/link:text-gold-main transition-colors" />
                                                        <span className="text-[9px] font-black uppercase text-white/60 group-hover/link:text-white transition-colors">{link.label}</span>
                                                    </div>
                                                    <ExternalLink size={12} className="text-white/20 group-hover/link:text-gold-main transition-colors" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                            <div className="flex items-center gap-3 text-white/40">
                                <History size={14} />
                                <span className="text-[9px] font-black uppercase tracking-widest">Recent Nodes</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {history.map(id => {
                                    const f = highYieldFormulas.find(f => f.id === id);
                                    return (
                                        <button 
                                            key={id} 
                                            onClick={() => setSelectedFormulaId(id)}
                                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${selectedFormulaId === id ? 'bg-gold-main text-slate-950' : 'bg-white/5 text-white/40 hover:text-white'}`}
                                        >
                                            {f?.name.split(' ')[0]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Deep Dive & Clinical Importance */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                <div className="md:col-span-8 space-y-8">
                    {/* Primary Deep Dive */}
                    <div className="p-10 md:p-14 bg-white/[0.03] border-2 border-white/5 rounded-[3.5rem] space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000"><Database size={160} /></div>
                        <div className="flex items-center gap-5 relative z-10">
                            <div className="w-14 h-14 bg-gold-main/10 rounded-2xl flex items-center justify-center border border-gold-main/30 text-gold-main shadow-gold">
                                {selectedFormula.id === 'f8' ? <AlertTriangle size={24} className="animate-pulse" /> : <Layers size={24} />}
                            </div>
                            <div>
                                <h4 className="text-2xl font-serif font-bold text-white italic">Conceptual Briefing</h4>
                                <p className="text-[9px] font-black text-gold-main/60 uppercase tracking-[0.4em] mt-1">Logic Alignment</p>
                            </div>
                        </div>
                        <div className="relative z-10">
                            <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed italic border-l-4 border-gold-main/40 pl-8 py-2">
                                {selectedFormula.deepDive}
                            </p>
                        </div>
                    </div>

                    {/* Specialized Clinical Importance Panel */}
                    {selectedFormula.clinicalImportance && (
                        <div className="p-10 md:p-14 bg-gold-main/[0.03] border border-gold-main/20 rounded-[3.5rem] space-y-8 relative overflow-hidden animate-slide-up group/safety">
                            <div className="absolute inset-0 bg-tech-grid opacity-5 pointer-events-none"></div>
                            <div className="flex items-center gap-5 relative z-10">
                                <div className="w-14 h-14 bg-gold-main/20 rounded-2xl flex items-center justify-center border border-gold-main/40 text-gold-main shadow-gold group-hover/safety:scale-110 transition-transform">
                                    <HeartPulse size={28} />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-2xl font-serif font-bold text-white italic tracking-tight">Clinical Correlation</h4>
                                    <p className="text-[9px] font-black text-gold-main/60 uppercase tracking-[0.4em] mt-1">Medical Protocol Matrix</p>
                                </div>
                            </div>
                            <div className="relative z-10">
                                <p className="text-lg md:text-xl text-slate-200 font-serif italic leading-relaxed border-l-4 border-gold-main/50 pl-8 py-1">
                                    {selectedFormula.clinicalImportance}
                                </p>
                            </div>
                            
                            {/* Detailed Safety Tables for Intensity */}
                            {selectedFormula.id === 'f8' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 relative z-10">
                                    <div className="p-6 bg-slate-950 border border-white/10 rounded-3xl space-y-3">
                                        <p className="text-[10px] font-black text-gold-main uppercase tracking-widest">Unfocused Threshold</p>
                                        <p className="text-2xl font-serif font-bold text-white italic">100 <span className="text-sm opacity-40">mW/cm²</span></p>
                                        <p className="text-[8px] text-white/30 uppercase tracking-widest leading-snug">No confirmed effects below this peak.</p>
                                    </div>
                                    <div className="p-6 bg-slate-950 border border-white/10 rounded-3xl space-y-3">
                                        <p className="text-[10px] font-black text-gold-main uppercase tracking-widest">Focused Threshold</p>
                                        <p className="text-2xl font-serif font-bold text-white italic">1.0 <span className="text-sm opacity-40">W/cm²</span></p>
                                        <p className="text-[8px] text-white/30 uppercase tracking-widest leading-snug">Higher limit due to heat dissipation.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Specialized Information for Intensity expert tips */}
                    {selectedFormula.id === 'f8' && (
                        <div className="p-8 bg-slate-950 border border-gold-main/20 rounded-[2.5rem] space-y-6 animate-slide-up relative z-10">
                            <div className="flex items-center gap-3 text-gold-main">
                                <Lightbulb size={18} />
                                <span className="text-[11px] font-black uppercase tracking-[0.4em]">Expert Contextual Note</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm text-slate-400 font-light italic leading-relaxed">
                                <p>
                                    When you adjust the "Output Power" on your machine, you are directly manipulating the pulse intensity. According to the 
                                    <span className="text-white font-bold"> ALARA</span> principle, you should use the minimum intensity needed for a diagnostic image. 
                                </p>
                                <p>
                                    Remember the board trap: increasing <span className="text-white font-bold">Receiver Gain</span> does NOT increase intensity, but increasing <span className="text-white font-bold">Output Power</span> does. Focal point placement is your most surgical way to control local intensity without changing the global energy output.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="md:col-span-4 flex flex-col gap-8">
                    {/* Sector Link Card */}
                    <div className="p-10 bg-slate-900 border border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-8 group/cta hover:border-gold-main/30 transition-all shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform"><GraduationCap size={160} /></div>
                        <div className="w-20 h-20 rounded-full bg-gold-main/10 flex items-center justify-center border-2 border-gold-main/20 text-gold-main shadow-gold group-hover/cta:scale-110 transition-transform duration-500">
                            <Monitor size={32} />
                        </div>
                        <div className="space-y-3 relative z-10">
                            <h5 className="text-2xl font-serif font-bold text-white italic">Sector Integration</h5>
                            <p className="text-xs text-slate-400 font-light italic leading-relaxed px-4">
                                This mathematical node is indexed within <span className="text-white font-bold">Sector 1: Fundamentals</span>. Verify your theoretical grasp in the laboratory.
                            </p>
                        </div>
                        <button className="w-full py-5 bg-gold-main text-slate-950 rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] shadow-gold hover:shadow-soft active:scale-95 transition-all flex items-center justify-center gap-3 relative z-10 overflow-hidden">
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/cta:translate-x-[100%] transition-transform duration-700"></div>
                            Open Lab View <ArrowRight size={16} />
                        </button>
                    </div>

                    {/* Unit Breakdown for Intensity */}
                    {selectedFormula.id === 'f8' && (
                        <div className="p-8 bg-slate-950 border border-white/5 rounded-[2.5rem] space-y-6">
                            <div className="flex items-center gap-3 text-white/40">
                                <Sliders size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Unit Matrix</span>
                            </div>
                            <div className="space-y-4 font-mono text-[10px] italic">
                                <div className="flex justify-between items-center text-white/60">
                                    <span>Power</span>
                                    <span>Watts (W)</span>
                                </div>
                                <div className="flex justify-between items-center text-white/60">
                                    <span>Area</span>
                                    <span>cm²</span>
                                </div>
                                <div className="h-px bg-white/5 w-full"></div>
                                <div className="flex justify-between items-center text-gold-main">
                                    <span>Intensity</span>
                                    <span>W/cm²</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}