import React from 'react';
import { Check, ShieldCheck, Sun, Sparkles, Zap, Infinity, Star, Anchor, ArrowRight } from 'lucide-react';

interface PricingProps {
  onEnroll?: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onEnroll }) => {
  return (
    <div id="pricing" className="py-48 bg-transparent relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gold-main/5 to-transparent"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
        <div className="mb-32 space-y-8 animate-reveal">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gold-main/10 border border-gold-main/30 text-[11px] font-black text-gold-main uppercase tracking-[0.5em] mx-auto shadow-gold-dim">
            <ShieldCheck size={14} className="animate-pulse" /> Enrollment Protocol
          </div>
          <h2 className="text-5xl md:text-8xl font-serif font-bold text-white tracking-tighter italic leading-none">Secure Your <br/><span className="text-gold-main not-italic transition-all duration-1000 hover:tracking-wide">Sanctuary Access</span></h2>
          <p className="text-xl md:text-3xl text-slate-400 font-light font-sans max-w-3xl mx-auto tracking-tight leading-relaxed opacity-80 italic border-t border-white/5 pt-8">Select the acoustic vector that aligns with your clinical timeline.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Free Tier */}
          <div className="group relative animate-reveal" style={{ animationDelay: '0.1s' }}>
            <div className="relative h-full bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-10 flex flex-col rounded-[3rem] transition-all duration-700 hover:border-blue-400/30 hover:bg-slate-900/60 shadow-2xl group-hover:translate-y-[-10px]">
                <div className="mb-10 text-left">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/5 text-white/20 group-hover:text-blue-400 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
                        <Anchor size={28} />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-2 italic">Acoustic Anchor</h3>
                    <p className="text-white/20 text-[9px] uppercase tracking-[0.5em] font-black">Entry Access</p>
                </div>
                
                <div className="flex items-baseline mb-10 text-left">
                    <span className="text-5xl font-serif font-bold text-white tracking-tighter">$0</span>
                    <span className="ml-3 text-white/20 font-sans text-base">/ free</span>
                </div>
                
                <ul className="space-y-5 mb-12 flex-1 font-sans text-[14px] text-slate-400 text-left">
                    {['Sector 1 access', 'Basic simulation viewer', 'Community support logs'].map((feat, i) => (
                      <li key={i} className="flex items-start gap-4 group/item">
                          <Check className="w-4 h-4 mt-1 text-blue-400/40 transition-colors group-hover/item:text-blue-400" />
                          <span className="group-hover/item:text-white transition-colors duration-500 italic">{feat}</span>
                      </li>
                    ))}
                </ul>
                
                <button 
                    onClick={onEnroll}
                    className="w-full py-5 bg-white/5 text-white font-black rounded-2xl uppercase tracking-[0.3em] text-[10px] border border-white/10 hover:bg-blue-400/10 hover:border-blue-400/40 transition-all duration-700 group/btn active:scale-95"
                >
                    Link Established
                </button>
            </div>
          </div>

          {/* Monthly Plan */}
          <div className="group relative animate-reveal" style={{ animationDelay: '0.2s' }}>
            <div className="relative h-full bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-10 flex flex-col rounded-[3rem] transition-all duration-700 hover:border-gold-main/30 hover:bg-slate-900/60 shadow-2xl group-hover:translate-y-[-10px]">
                <div className="mb-10 text-left">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/5 text-white/20 group-hover:text-gold-main transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
                        <Zap size={28} />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-2 italic">Monthly Pulse</h3>
                    <p className="text-white/20 text-[9px] uppercase tracking-[0.5em] font-black">Clinical Flexibility</p>
                </div>
                
                <div className="flex items-baseline mb-10 text-left">
                    <span className="text-5xl font-serif font-bold text-white tracking-tighter">$44</span>
                    <span className="ml-3 text-white/20 font-sans text-base">/ month</span>
                </div>
                
                <ul className="space-y-5 mb-12 flex-1 font-sans text-[14px] text-slate-400 text-left">
                    {['All 9 physics modules', 'Full simulation lab', 'Faculty AI briefings'].map((feat, i) => (
                      <li key={i} className="flex items-start gap-4 group/item">
                          <Check className="w-4 h-4 mt-1 text-gold-main/40 transition-colors group-hover/item:text-gold-main" />
                          <span className="group-hover/item:text-white transition-colors duration-500 italic">{feat}</span>
                      </li>
                    ))}
                </ul>
                
                <button 
                    onClick={onEnroll}
                    className="w-full py-5 bg-white/5 text-white font-black rounded-2xl uppercase tracking-[0.3em] text-[10px] border border-white/10 hover:bg-white/10 hover:border-gold-main/40 transition-all duration-700 active:scale-95"
                >
                    Initiate Monthly Link
                </button>
            </div>
          </div>

          {/* Annual Plan - Featured with Enhanced Hover */}
          <div className="relative group transform lg:-translate-y-6 animate-reveal" style={{ animationDelay: '0.3s' }}>
             <div className="absolute -inset-2 bg-gold-main/30 rounded-[4rem] blur-[60px] opacity-40 group-hover:opacity-80 transition-opacity duration-1000 animate-pulse-slow"></div>
             
             <div className="relative h-full bg-slate-950/90 backdrop-blur-3xl border-2 border-gold-main/60 p-12 flex flex-col rounded-[3.5rem] shadow-[0_0_100px_rgba(181,148,78,0.3)] group-hover:border-gold-main group-hover:scale-[1.03] transition-all duration-700 text-left ring-2 ring-gold-main/10 group-hover:translate-y-[-10px]">
                <div className="absolute top-8 right-10 flex items-center gap-3">
                    <Star className="w-4 h-4 text-gold-main fill-gold-main animate-ping" />
                    <span className="text-[9px] font-black uppercase text-gold-main tracking-[0.5em]">SPECIALIST CHOICE</span>
                </div>
                
                <div className="mb-10 pt-4">
                    <div className="w-18 h-18 rounded-[2rem] bg-gold-main/15 flex items-center justify-center mb-10 border border-gold-main/40 shadow-gold group-hover:scale-110 transition-transform duration-1000">
                        <Sun className="w-10 h-10 text-gold-main animate-[spin_15s_linear_infinite]" />
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-white mb-3 italic">Annual Resonance</h3>
                    <p className="text-gold-main/60 text-[10px] uppercase tracking-[0.5em] font-black">Full Sector Optimization</p>
                </div>
                
                <div className="flex items-baseline mb-12">
                    <span className="text-7xl font-serif font-bold text-white tracking-tighter drop-shadow-xl">$143</span>
                    <span className="ml-4 text-white/30 font-sans text-xl">/ year</span>
                </div>
                
                <ul className="space-y-6 mb-14 flex-1 font-sans text-base text-slate-300">
                    {[
                      { icon: Sparkles, text: "Mock exam vault access", highlight: true },
                      { icon: Check, text: "Interactive artifact catalog" },
                      { icon: Check, text: "Priority support line" }
                    ].map((feat, i) => (
                      <li key={i} className="flex items-start gap-5 group/item">
                          <feat.icon className={`w-5 h-5 mt-0.5 transition-all duration-500 ${feat.highlight ? 'text-gold-main animate-pulse' : 'text-gold-main/40 group-hover/item:text-gold-main'}`} />
                          <span className={`transition-colors duration-500 ${feat.highlight ? 'text-white font-bold' : 'group-hover/item:text-white'} italic`}>{feat.text}</span>
                      </li>
                    ))}
                </ul>
                
                <button 
                    onClick={onEnroll}
                    className="w-full py-6 bg-gold-main text-slate-950 font-black rounded-3xl transition-all duration-1000 uppercase tracking-[0.4em] text-[11px] shadow-gold hover:shadow-[0_0_80px_rgba(181,148,78,0.7)] hover:translate-y-[-6px] active:scale-95 flex items-center justify-center gap-4 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>
                    <span className="relative z-10">Deploy Protocol</span> <ArrowRight size={18} className="relative z-10" />
                </button>
             </div>
          </div>

          {/* Lifetime Plan */}
          <div className="group relative animate-reveal" style={{ animationDelay: '0.4s' }}>
            <div className="relative h-full bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-10 flex flex-col rounded-[3rem] transition-all duration-700 hover:border-gold-main/30 hover:bg-slate-900/60 shadow-2xl group-hover:translate-y-[-10px]">
                <div className="mb-10 text-left">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/5 text-white/20 group-hover:text-gold-main transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
                        <Infinity size={28} />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-2 italic">Eternal Matrix</h3>
                    <p className="text-white/20 text-[9px] uppercase tracking-[0.5em] font-black">Infinite Persistence</p>
                </div>
                
                <div className="flex items-baseline mb-10 text-left">
                    <span className="text-5xl font-serif font-bold text-white tracking-tighter">$350</span>
                    <span className="ml-3 text-white/20 font-sans text-base">lifetime</span>
                </div>
                
                <ul className="space-y-5 mb-12 flex-1 font-sans text-[14px] text-slate-400 text-left">
                    {['Updates for all modules', 'All future clinical sims', 'Unlimited podcast archive'].map((feat, i) => (
                      <li key={i} className="flex items-start gap-4 group/item">
                          <Check className="w-4 h-4 mt-1 text-gold-main/40 transition-colors group-hover/item:text-gold-main" />
                          <span className="group-hover/item:text-white transition-colors duration-500 italic">{feat}</span>
                      </li>
                    ))}
                </ul>
                
                <button 
                    onClick={onEnroll}
                    className="w-full py-5 bg-white/5 text-white font-black rounded-2xl uppercase tracking-[0.3em] text-[10px] border border-white/10 hover:bg-gold-main/10 hover:border-gold-main/40 transition-all duration-700 shadow-xl active:scale-95"
                >
                    Secure Eternal Link
                </button>
            </div>
          </div>
        </div>
        
        {/* Payment Vectors with reveal */}
        <div className="mt-48 text-center space-y-12 animate-reveal" style={{ animationDelay: '0.6s' }}>
             <div className="flex items-center justify-center gap-10">
                <div className="h-px w-24 bg-gradient-to-r from-transparent to-white/10"></div>
                <p className="text-[11px] text-white/30 uppercase tracking-[0.6em] font-black">Authorized Payment Vectors</p>
                <div className="h-px w-24 bg-gradient-to-l from-transparent to-white/10"></div>
             </div>
            <div className="flex justify-center flex-wrap items-center gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000 group cursor-default">
                <span className="font-serif font-bold text-white text-3xl tracking-tighter group-hover:text-blue-500 transition-colors duration-500 transform hover:scale-110">VISA</span>
                <span className="font-serif font-bold text-white text-3xl tracking-tighter group-hover:text-red-500 transition-colors duration-500 transform hover:scale-110">MASTERCARD</span>
                <span className="font-serif font-bold text-white text-3xl tracking-tighter group-hover:text-blue-400 transition-colors duration-500 transform hover:scale-110">PAYPAL</span>
                <span className="font-serif font-bold text-white text-3xl tracking-tighter group-hover:text-gold-main transition-colors duration-500 transform hover:scale-110">AMEX</span>
            </div>
        </div>
      </div>
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Pricing;