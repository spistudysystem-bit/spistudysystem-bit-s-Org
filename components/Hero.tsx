import React, { useMemo, useState, useEffect, useRef } from 'react';
import { BookOpen, Sun, Loader2, Waves, Activity, ShieldCheck, Compass, ArrowRight, Target, Sparkles, ClipboardList, Bot, Rocket, GraduationCap, CheckCircle2, Package, Star } from 'lucide-react';
import ProfessorHost from './ProfessorHost';
import { GoogleGenAI } from "@google/genai";

interface HeroProps {
    onOpenCourse?: () => void;
    onPlayBubble?: () => void;
}

const INSIGHT_KEY = 'spi-daily-insight';
const INSIGHT_EXPIRY = 1 * 60 * 60 * 1000; 

const Hero: React.FC<HeroProps> = ({ onOpenCourse, onPlayBubble }) => {
  const [showTip, setShowTip] = useState(false);
  const [tipMessage, setTipMessage] = useState("");
  const [isSummoning, setIsSummoning] = useState(false);
  const [harveyVisible, setHarveyVisible] = useState(false);
  const [summonStage, setSummonStage] = useState<'none' | 'beaming' | 'materializing' | 'active'>('none');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(INSIGHT_KEY);
    if (saved) {
      try {
        const { text, timestamp } = JSON.parse(saved);
        if (Date.now() - timestamp < INSIGHT_EXPIRY) {
          setTipMessage(text);
          setShowTip(true);
          setHarveyVisible(true);
          setSummonStage('active');
        }
      } catch (e) {
        localStorage.removeItem(INSIGHT_KEY);
      }
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  const summonHarvey = async (part: 'head' | 'hand' | 'core' = 'core') => {
      if (isSummoning) return;
      setIsSummoning(true);
      onPlayBubble?.(); 
      
      if (summonStage === 'none') {
        setSummonStage('beaming');
        setTimeout(() => {
            setSummonStage('materializing');
            setHarveyVisible(true);
        }, 1000);
      }

      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          
          let prompt = "You are Harvey, a seasoned robotic professor of ultrasound physics. ";
          if (part === 'head') {
            prompt += "Provide one deep, high-yield physics fact for the SPI exam (e.g. related to Doppler or resolution). Max 20 words.";
          } else if (part === 'hand') {
            prompt += "Provide one tactical clinical scanning tip for a sonographer (e.g. transducer pressure or window optimization). Max 20 words.";
          } else {
            prompt += "Provide one encouraging clinical insight for the SPI exam. Max 20 words.";
          }

          const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: prompt,
              config: {
                  temperature: 0.9,
                  topP: 0.95,
                  topK: 64
              }
          });

          const wisdom = response.text || "Listen closely, child of sound. Resonance requires frequency alignment.";
          setTipMessage(wisdom);
          localStorage.setItem(INSIGHT_KEY, JSON.stringify({ text: wisdom, timestamp: Date.now() }));
          
          setTimeout(() => {
            setIsSummoning(false);
            setShowTip(true);
            setSummonStage('active');
          }, 1500);

      } catch (e) {
          setTipMessage("Signal interference detected. Sound requires a medium; wisdom requires an open mind.");
          setIsSummoning(false);
          setShowTip(true);
          setSummonStage('active');
      }
  };

  const getOverride = (id: string, fallback: string) => {
    try {
        const saved = localStorage.getItem('spi-admin-overrides');
        if (!saved) return fallback;
        const overrides = JSON.parse(saved);
        return overrides[id]?.value || fallback;
    } catch (e) { return fallback; }
  };

  const heroTitle = useMemo(() => getOverride('hero-title', "Master the ARDMS® Exam the First Time"), []);
  const heroSubtitle = useMemo(() => getOverride('hero-subtitle', "Comprehensive SPI Physics and Clinical specialty prep designed for sonographers. Don't just study—secure your clinical identity."), []);

  return (
    <div id="home" className="relative min-h-[100dvh] flex items-center pt-24 pb-16 lg:pt-32 lg:pb-32 overflow-hidden bg-transparent">
      {/* Multi-layered Parallax Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div 
          className="absolute top-1/4 -left-20 w-[50rem] h-[50rem] bg-gold-main/5 blur-[150px] rounded-full animate-pulse-slow transition-transform duration-1000 ease-out"
          style={{ transform: `translate(${mousePos.x * -20}px, translateY(calc(var(--scroll-y) * 0.03)))` }}
        ></div>
        <div 
          className="absolute bottom-1/4 -right-20 w-[40rem] h-[40rem] bg-blue-500/5 blur-[120px] rounded-full animate-pulse-slow transition-transform duration-700 ease-out"
          style={{ animationDelay: '2s', transform: `translate(${mousePos.x * 30}px, translateY(calc(var(--scroll-y) * 0.08)))` }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/3 w-[30rem] h-[30rem] border border-gold-main/10 rounded-full transition-transform duration-500 ease-out opacity-20"
          style={{ transform: `scale(1.8) translateY(calc(var(--scroll-y) * 0.15))` }}
        ></div>
        {/* Floating tech elements */}
        <div className="absolute top-[20%] right-[10%] w-1 h-24 bg-gradient-to-b from-gold-main/20 to-transparent transition-transform duration-1000" style={{ transform: `translateY(calc(var(--scroll-y) * -0.1))` }}></div>
        <div className="absolute bottom-[20%] left-[15%] w-1 h-32 bg-gradient-to-t from-blue-500/10 to-transparent transition-transform duration-1000" style={{ transform: `translateY(calc(var(--scroll-y) * -0.05))` }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-10 relative z-10 w-full">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-7 text-center lg:text-left space-y-8 md:space-y-12">
            <div className="inline-flex items-center gap-2 md:gap-4 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-gold-main/10 backdrop-blur-md border border-gold-main/30 shadow-gold-dim animate-fade-in group mx-auto lg:mx-0 transition-all hover:bg-gold-main/20">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-main animate-ping"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-gold-main/40"></div>
              </div>
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-gold-main font-sans">Official ARDMS® Prep Matrix</span>
            </div>
            
            <div className="space-y-6 md:space-y-10">
              <h1 className="text-4xl sm:text-7xl lg:text-[7.5rem] font-serif font-bold tracking-tighter leading-[0.85] text-white animate-slide-up-intense select-none break-words italic">
                {heroTitle.split(' ').map((word, i) => i > 4 ? <span key={i} className="text-gold-main not-italic inline-block transition-transform hover:scale-110 hover:rotate-1 duration-500 cursor-default">{word} </span> : <span key={i} className="inline-block transition-transform hover:translate-y-[-4px] duration-500 cursor-default">{word} </span>)}
              </h1>
              
              <div className="max-w-2xl mx-auto lg:mx-0">
                <p className="text-lg sm:text-2xl text-slate-400 leading-relaxed font-light font-sans opacity-0 animate-slide-up-intense px-1 md:px-0" style={{ animationDelay: '0.2s' }}>
                  {heroSubtitle}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center lg:justify-start pt-4 opacity-0 animate-slide-up-intense" style={{ animationDelay: '0.4s' }}>
              <button 
                onClick={onOpenCourse} 
                className="group relative px-10 sm:px-16 py-5 md:py-7 bg-gold-main text-slate-950 font-black text-[11px] sm:text-[13px] uppercase tracking-[0.3em] rounded-2xl shadow-gold hover:translate-y-[-8px] hover:shadow-gold-strong transition-all duration-700 active:scale-95 flex items-center justify-center gap-4 overflow-hidden"
              >
                 <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>
                 <Rocket size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative z-10" />
                 <span className="relative z-10">Initiate Practice</span>
              </button>
              
              <button 
                onClick={onOpenCourse}
                className="group relative px-10 sm:px-16 py-5 md:py-7 bg-white/5 backdrop-blur-xl text-white font-black text-[11px] sm:text-[13px] uppercase tracking-[0.3em] rounded-2xl border border-white/10 hover:bg-white/10 hover:border-gold-main/30 transition-all duration-500 active:scale-95 flex items-center justify-center gap-4"
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <BookOpen size={20} className="text-gold-main group-hover:scale-125 transition-transform duration-500" />
                <span className="relative z-10">Open Study Vault</span>
              </button>
            </div>

            {/* Bundle Visual Widget */}
            <div className="pt-12 opacity-0 animate-slide-up-intense flex flex-col sm:flex-row items-center gap-8" style={{ animationDelay: '0.6s' }}>
                <div className="flex -space-x-4">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-12 h-16 bg-slate-900 border border-gold-main/30 rounded-lg shadow-gold overflow-hidden transform hover:-translate-y-4 hover:rotate-3 transition-all duration-500 cursor-pointer group relative">
                             <div className="w-full h-full bg-tech-grid opacity-20 absolute inset-0"></div>
                             <div className="absolute inset-0 bg-gradient-to-t from-gold-main/10 to-transparent"></div>
                             <div className="absolute inset-0 flex items-center justify-center font-serif font-black text-gold-main/40 text-[10px] select-none group-hover:text-gold-main/80 transition-colors">SPI_{i}</div>
                        </div>
                    ))}
                </div>
                <div className="text-left">
                    <p className="text-[9px] font-black text-gold-main uppercase tracking-[0.4em] mb-1">Elite Study Bundle</p>
                    <p className="text-xs text-white/40 italic">Digital & Interactive Mastery Modules Included</p>
                </div>
            </div>
          </div>

          <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
            className="lg:col-span-5 mt-16 md:mt-0 relative flex justify-center items-center opacity-0 animate-fade-in" 
            style={{ animationDelay: '0.4s' }}
          >
            {/* Interactive Holographic Container with 3D Mouse Tilt */}
            <div 
              className={`relative w-full max-w-[280px] sm:max-w-lg perspective-1000 group ${harveyVisible ? 'z-[500]' : ''} transition-all duration-700`}
              style={{ 
                transform: `
                  translateY(calc(var(--scroll-y) * -0.08))
                  rotateY(${mousePos.x * 12}deg)
                  rotateX(${mousePos.y * -12}deg)
                `
              }}
            >
                {/* Floating Product Callout */}
                <div className="absolute -top-12 -right-8 z-20 bg-gold-main text-slate-950 px-5 py-2.5 rounded-full font-black text-[9px] uppercase tracking-[0.2em] shadow-gold-strong flex items-center gap-2 animate-bounce">
                    <Star size={12} fill="currentColor" /> 2026 Edition
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gold-main/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-gold-main/15 transition-all duration-1000"></div>
                
                <div className={`relative bg-slate-950/80 backdrop-blur-3xl rounded-[3rem] md:rounded-[5rem] shadow-3xl transition-all duration-1000 lg:group-hover:scale-[1.05] aspect-[4/5.8] flex flex-col p-1.5 ${(harveyVisible && showTip) || isSummoning ? 'overflow-visible' : 'overflow-hidden'} border border-white/10 ring-1 ring-white/5`}>
                   <div className="w-full h-12 md:h-20 border-b border-white/5 flex items-center px-8 md:px-14 justify-between">
                       <div className="flex gap-2 md:gap-4">
                           <div className="w-2 h-2 rounded-full bg-gold-main/30 animate-pulse"></div>
                           <div className="w-2 h-2 rounded-full bg-gold-main/30 animate-pulse" style={{ animationDelay: '1s' }}></div>
                       </div>
                       <span className="text-[8px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.5em] animate-pulse">Sector Master 2026</span>
                   </div>
                   
                   <div className="flex-1 relative flex items-center justify-center p-8 md:p-20 overflow-hidden">
                        {/* Clinical Scan Background */}
                        <img 
                          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80" 
                          alt="Physics Art" 
                          className="w-full h-full object-cover opacity-10 absolute inset-0 mix-blend-screen transition-transform duration-[10s] group-hover:scale-125"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40"></div>
                        <div className="absolute inset-0 bg-scanline opacity-10 pointer-events-none animate-scanline"></div>
                        
                        <div className="relative z-10 text-center space-y-8 md:space-y-16 w-full h-full flex flex-col items-center justify-center">
                            <div className="relative w-20 h-20 sm:w-36 sm:h-36 flex items-center justify-center mx-auto">
                                <div className="absolute inset-[-12px] md:inset-[-20px] border border-gold-main/10 rounded-full animate-[spin_20s_linear_infinite]"></div>
                                <div className="absolute inset-[-6px] md:inset-[-10px] border border-gold-main/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                                <div className="absolute inset-0 border border-gold-main/30 rounded-3xl md:rounded-[4rem] bg-slate-900/40 backdrop-blur-lg transition-all duration-700 shadow-[0_0_60px_rgba(181,148,78,0.2)] group-hover:border-gold-main/50"></div>
                                
                                <ProfessorHost 
                                    position={{ x: 50, y: 50 }} 
                                    isActive={harveyVisible} 
                                    isThinking={isSummoning}
                                    message={isSummoning ? undefined : (showTip ? tipMessage : undefined)}
                                    onClick={() => summonHarvey()}
                                    onPartClick={(part) => summonHarvey(part)}
                                />

                                {!harveyVisible && summonStage !== 'beaming' && (
                                    <Waves className="relative z-0 w-10 h-10 md:w-16 md:h-16 text-gold-main/20 animate-pulse transition-all duration-500 group-hover:text-gold-main/60 group-hover:scale-110" />
                                )}
                            </div>

                            <div className="space-y-3 md:space-y-6">
                                <h3 className="font-serif font-bold text-white text-3xl md:text-7xl tracking-tighter leading-none italic uppercase drop-shadow-2xl group-hover:tracking-widest transition-all duration-1000">Acoustic <br/><span className="text-gold-main not-italic">Sanctuary</span></h3>
                                <div className="h-0.5 w-12 md:w-20 bg-gold-main/30 mx-auto rounded-full group-hover:w-48 transition-all duration-1000"></div>
                                <p className="text-[8px] md:text-[11px] uppercase tracking-[0.5em] md:tracking-[0.7em] text-white/30 font-black">Elite Preparatory Protocol</p>
                            </div>
                        </div>
                   </div>
                   
                   <div className="w-full bg-white/5 backdrop-blur-xl py-8 md:py-16 border-t border-white/5 px-8 md:px-14 text-center">
                       <p className="text-[8px] md:text-[11px] font-black text-white/20 uppercase tracking-[0.4em] leading-relaxed italic transition-colors duration-700 group-hover:text-white/60">The journey to mastery begins at the speed of sound.</p>
                   </div>
                </div>

                {/* Floating Achievement Card */}
                <div className="absolute -bottom-8 -left-8 md:-bottom-16 md:-left-16 w-20 h-20 md:w-36 md:h-36 bg-slate-900/90 backdrop-blur-3xl shadow-3xl rounded-3xl md:rounded-[4.5rem] border border-white/10 flex items-center justify-center animate-float group-hover:border-gold-main/50 transition-all duration-1000 group-hover:scale-125 group-hover:rotate-12">
                    <GraduationCap className="w-10 h-10 md:w-18 md:h-18 text-gold-main/20 group-hover:text-gold-main transition-all duration-1000" />
                </div>

                {/* Bundle Stats Badge */}
                <div className="absolute -bottom-10 -right-4 bg-white/10 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl flex flex-col items-center gap-1 shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-8 group-hover:translate-y-0">
                    <p className="text-[7px] font-black text-gold-main uppercase tracking-widest leading-none">Contents</p>
                    <p className="text-[10px] text-white font-bold whitespace-nowrap">9 Modules + 500 Questions</p>
                </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .bg-scanline {
          background: linear-gradient(to bottom, transparent 0%, rgba(181, 148, 78, 0.1) 50%, transparent 100%);
          background-size: 100% 20px;
        }
      `}</style>
    </div>
  );
};

export default Hero;