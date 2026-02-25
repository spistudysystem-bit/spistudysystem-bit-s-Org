import React, { useEffect } from 'react';
import { ChevronRight, Layers, Activity, Zap, Eye, Sun, Cpu, CheckCircle2, ShieldAlert, GraduationCap, AlertTriangle, Lightbulb, Binary, Microscope, Ruler, Target } from 'lucide-react';

const ExamSections: React.FC = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealElements = document.querySelectorAll('.scroll-reveal-section');
    revealElements.forEach((el) => observer.observe(el));

    return () => revealElements.forEach((el) => observer.unobserve(el));
  }, []);

  const sections = [
    {
      icon: <Layers className="w-5 h-5 text-gold-main/80" />,
      title: "I. Physics Fundamentals",
      weight: "20%",
      trap: "Commonly mistaken: Frequency vs Period relationship. Remember they are reciprocal.",
      topics: ["Wave properties & propagation", "Acoustic variables & units", "Interaction of sound with tissue", "Intensity, power, & amplitude relationships", "Pulsed vs Continuous wave dynamics"],
      blueprint: "1540m/s constant focus"
    },
    {
      icon: <Microscope className="w-5 h-5 text-gold-main/80" />,
      title: "II. Transducers & Beams",
      weight: "25%",
      trap: "The 'Secret Key': Damping material reduces sensitivity but improves axial resolution (LARRD).",
      topics: ["PZT properties & construction", "Matching layers & damping efficiency", "Beam formation & focusing", "Array technology (Linear vs Phased)", "Near field/Far field divergence"],
      blueprint: "LARRD vs LATA focus"
    },
    {
      icon: <Binary className="w-5 h-5 text-gold-main/80" />,
      title: "III. Instrumentation",
      weight: "20%",
      trap: "Only 'Demodulation' is not adjustable by the sonographer. Always a board question.",
      topics: ["The 5 Receiver Functions", "Preprocessing vs Postprocessing", "TGC and overall gain optimization", "Analog-to-Digital conversion", "Display & Storage (DICOM/PACS)"],
      blueprint: "A-C-C-D-R logic chain"
    },
    {
      icon: <Activity className="w-5 h-5 text-gold-main/80" />,
      title: "IV. Doppler Dynamics",
      weight: "15%",
      trap: "Cosine of 90 degrees is 0. No Doppler shift is measured at normal incidence.",
      topics: ["The Doppler Shift Equation", "Hemodynamics & flow profiles", "Aliasing & Nyquist limits", "Color & Power Doppler variances", "Spectral analysis interpretation"],
      blueprint: "Angle correction mastery"
    },
    {
      icon: <Ruler className="w-5 h-5 text-gold-main/80" />,
      title: "V. Resolution & QA",
      weight: "20%",
      trap: "Shadowing = diagnostic of high attenuation (gallstone). Enhancement = low attenuation (cyst).",
      topics: ["Axial, Lateral & Temporal detail", "Artifact identification & causes", "Phantom testing & calibration", "Bioeffects & ALARA safety", "Clinical safety indices (TI & MI)"],
      blueprint: "AIUM Standard ALARA"
    }
  ];

  return (
    <div id="study-guides" className="py-32 bg-transparent relative overflow-hidden">
      {/* Blueprint Grid Overlay for this section only with scroll response */}
      <div 
        className="absolute inset-0 bg-tech-grid opacity-[0.04] pointer-events-none transition-transform duration-700 ease-out"
        style={{ transform: 'translateY(calc(var(--scroll-y) * 0.02))' }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="lg:grid lg:grid-cols-2 gap-24 items-start">
            <div className="space-y-12 scroll-reveal-section">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-gold-main">
                    <GraduationCap className="w-5 h-5 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Official SPI Blueprint Mapping</span>
                  </div>
                  <h2 className="text-4xl md:text-8xl font-serif font-bold text-white leading-[0.9] tracking-tighter italic">
                      Clinical <br/> <span className="text-gold-main not-italic">Strategy Vault</span>
                  </h2>
                  <p className="text-lg md:text-2xl text-slate-400 font-light leading-relaxed font-sans border-l-2 border-gold-main/20 pl-6 md:pl-10 py-2 opacity-90 transition-all duration-1000 hover:border-gold-main">
                      Our curriculum is precision-engineered to meet the 2025/2026 ARDMS® requirements. We prioritize the <span className="text-white font-bold italic underline decoration-gold-main/40">exact</span> logic used by examiners.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { title: "Secret Key System", desc: "Our proprietary mnemonic matrix for complex sound mechanics.", icon: Target },
                    { title: "Trap Prevention", desc: "Every module includes 'Board Trap' alerts to avoid common errors.", icon: ShieldAlert },
                    { title: "Nyquist Predictor", desc: "Master spectral analysis without the mathematical fatigue.", icon: Activity },
                    { title: "ALARA Mastery", desc: "Safety protocols focused on TI/MI clinical relevance.", icon: ShieldAlert }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col gap-4 p-8 bg-white/[0.03] rounded-[2.5rem] border border-white/5 group hover:border-gold-main/40 transition-all duration-700 hover:bg-white/[0.05] shadow-xl hover:-translate-y-2">
                      <div className="flex items-center gap-4">
                         <div className="p-3 rounded-2xl bg-gold-main/10 text-gold-main group-hover:scale-110 transition-transform"><item.icon size={20} /></div>
                         <h4 className="text-xs font-black text-white uppercase tracking-widest">{item.title}</h4>
                      </div>
                      <p className="text-sm text-slate-400 font-light leading-relaxed italic">{item.desc}</p>
                    </div>
                  ))}
                </div>
            </div>

            <div className="mt-16 lg:mt-0 grid gap-8 relative">
                <div className="absolute -top-12 right-4 px-6 py-2.5 bg-gold-main text-slate-950 border border-gold-main/40 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-gold-strong z-20 animate-bounce">
                  Official weighting Matrix
                </div>
                {sections.map((section, idx) => (
                    <div key={idx} 
                      className="scroll-reveal-section bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/5 shadow-2xl hover:border-gold-main/40 transition-all duration-700 group relative overflow-hidden"
                      style={{ transitionDelay: `${idx * 150}ms` }}
                    >
                        {/* Blueprint scan line effect */}
                        <div className="absolute inset-0 bg-scanline opacity-0 group-hover:opacity-10 animate-scanline pointer-events-none"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-gold-main/0 to-gold-main/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <div className="absolute top-0 right-0 px-8 py-3 bg-white/5 border-b border-l border-white/10 text-white/30 text-[9px] font-black rounded-bl-3xl font-mono uppercase tracking-widest transition-colors group-hover:text-gold-main group-hover:bg-gold-main/5">
                            {section.blueprint}
                        </div>
                        <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
                            <div className="p-6 bg-gold-main/10 rounded-2xl border border-gold-main/30 group-hover:bg-gold-main group-hover:text-slate-950 transition-all duration-500 shrink-0 shadow-gold-dim">
                                {section.icon}
                            </div>
                            <div className="flex-1 space-y-6 text-left">
                                <div className="space-y-1">
                                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white group-hover:text-gold-main transition-colors italic leading-none">
                                        {section.title}
                                    </h3>
                                    <div className="flex items-center gap-3 pt-2">
                                        <div className="h-0.5 w-8 bg-gold-main/40 transition-all duration-1000 group-hover:w-24"></div>
                                        <span className="text-[10px] font-black text-gold-main uppercase tracking-widest">{section.weight} Exam Coverage</span>
                                    </div>
                                </div>
                                <ul className="grid grid-cols-1 gap-y-3 pb-4">
                                    {section.topics.map((topic, tIdx) => (
                                        <li key={tIdx} className="flex items-start text-[14px] text-slate-400 group-hover:text-slate-200 transition-colors font-sans leading-snug italic group/li">
                                            <ChevronRight className="w-4 h-4 text-gold-main/40 mt-0.5 mr-2 shrink-0 group-hover/li:translate-x-1 transition-transform" />
                                            {topic}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
      <style>{`
        .scroll-reveal-section {
          opacity: 0;
          transform: translateY(40px);
          transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-active {
          opacity: 1;
          transform: translateY(0);
        }
        .bg-scanline {
          background: linear-gradient(to bottom, transparent 0%, rgba(181, 148, 78, 0.15) 50%, transparent 100%);
          background-size: 100% 30px;
        }
      `}</style>
    </div>
  );
};

export default ExamSections;