import React, { useEffect, useRef } from 'react';
import { BookOpen, Target, Brain, Video, Sparkles, Heart, FileText, CheckCircle2, ShieldCheck, ClipboardCheck, VideoIcon, Headphones, Activity, ShieldAlert, Ruler } from 'lucide-react';

const Features: React.FC = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
          }
        });
      },
      { threshold: 0.15 }
    );

    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => revealElements.forEach((el) => observer.unobserve(el));
  }, []);

  const corePillars = [
    {
      icon: <Target className="w-12 h-12 text-gold-main" strokeWidth={1.2} />,
      title: "Targeted Physics",
      description: "We carefully select the concepts you truly need, distilling the vast syllabus into focused, clinical insights."
    },
    {
      icon: <Brain className="w-12 h-12 text-gold-main" strokeWidth={1.2} />,
      title: "Cognitive Clarity",
      description: "Master the mechanics of sound with psychological protocols designed to maintain focus during high-pressure exams."
    },
    {
      icon: <BookOpen className="w-12 h-12 text-gold-main" strokeWidth={1.2} />,
      title: "Interactive Wisdom",
      description: "Explore Doppler and Artifacts through intuitive simulations that make complex physics feel natural and accessible."
    },
    {
      icon: <Video className="w-12 h-12 text-gold-main" strokeWidth={1.2} />,
      title: "Luminous Visuals",
      description: "Sound waves are made visible through cinema-grade simulations, helping you visualize what you scan."
    }
  ];

  const whatYouGet = [
    { title: "Comprehensive Review Guide", desc: "Digital vault covering all SPI domains.", icon: FileText },
    { title: "500+ Practice Scenarios", desc: "Board-aligned clinical case questions.", icon: ClipboardCheck },
    { title: "The Secret Key System", desc: "Mnemonic matrix for instant recall.", icon: Sparkles },
    { title: "Faculty Video Briefings", desc: "6+ hours of high-yield explanations.", icon: VideoIcon },
    { title: "Acoustic Podcast Archive", desc: "Learn physics during your commute.", icon: Headphones },
    { title: "Pass Guarantee Protocol", desc: "We sync your success or offer a refund.", icon: ShieldCheck }
  ];

  return (
    <div id="features" className="relative py-40 bg-transparent overflow-hidden">
      {/* Background Decorative Rings with Scroll Parallax */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-20 transition-transform duration-1000 ease-out"
        style={{ transform: 'translate(-50%, -50%) translateY(calc(var(--scroll-y) * 0.04))' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[85vw] border border-gold-main/10 rounded-full animate-spin-slow"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65vw] h-[65vw] border border-white/5 rounded-full animate-spin-slow-reverse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10 text-left">
        <div className="max-w-3xl mb-32 space-y-8 scroll-reveal">
          <div className="flex">
            <div className="px-6 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[11px] font-bold text-gold-main uppercase tracking-[0.4em] shadow-xl hover:border-gold-main/40 transition-colors duration-500 cursor-default">Educational Excellence</div>
          </div>
          <h2 className="text-5xl md:text-8xl font-serif font-bold text-white tracking-tight italic leading-[0.9]">
            Why Choose <span className="not-italic text-gold-main font-normal transition-all duration-1000 hover:tracking-widest">EchoMasters</span>?
          </h2>
          <p className="text-xl md:text-3xl text-slate-400 font-light leading-relaxed font-sans max-w-3xl border-l-2 border-gold-main/20 pl-8 transition-all duration-1000 hover:border-gold-main/60">
            The SPI Physics exam is your gateway to a professional career. Our approach transforms study into an elegant clinical journey of discovery.
          </p>
        </div>

        {/* Pillars Grid with staggered reveal and 3D hover */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-48">
          {corePillars.map((benefit, index) => (
            <div 
              key={index} 
              className="glass-card scroll-reveal p-10 md:p-12 group rounded-[3.5rem] relative overflow-hidden bg-slate-900/40 backdrop-blur-3xl border border-white/5 shadow-2xl transition-all duration-1000 hover:translate-y-[-16px] hover:border-gold-main/50"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Centered and Scaled Icon Container */}
              <div className="relative w-24 h-24 mb-10 mx-auto lg:mx-0">
                <div className="absolute inset-0 bg-gold-main/5 blur-[30px] group-hover:bg-gold-main/20 transition-all duration-1000 rounded-full"></div>
                <div className="relative w-full h-full rounded-[2rem] bg-slate-950 flex items-center justify-center border border-white/10 shadow-[inset_0_0_20px_rgba(181,148,78,0.05)] group-hover:border-gold-main/40 group-hover:shadow-gold transition-all duration-700 overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-tr from-gold-main/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <div className="relative z-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-700 transform group-hover:rotate-3">
                     {benefit.icon}
                   </div>
                   {/* Scanning pulse line */}
                   <div className="absolute top-0 left-0 w-full h-[1px] bg-gold-main/20 -translate-y-full group-hover:translate-y-[6rem] transition-transform duration-[2s] ease-linear repeat-infinite"></div>
                </div>
              </div>
              
              <h3 className="text-2xl font-serif font-bold text-white mb-6 group-hover:text-gold-main transition-colors duration-500 italic uppercase tracking-tight leading-tight">{benefit.title}</h3>
              <p className="text-slate-400 leading-relaxed text-base font-sans font-light italic opacity-80 group-hover:opacity-100 transition-opacity duration-700">
                {benefit.description}
              </p>
              
              <div className="mt-8 h-1 w-0 bg-gold-main/40 group-hover:w-full transition-all duration-1000 rounded-full shadow-gold"></div>
            </div>
          ))}
        </div>

        {/* 'What You Get' Visual List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center scroll-reveal">
            <div className="space-y-16">
                <div className="space-y-6">
                    <h3 className="text-3xl md:text-6xl font-serif font-bold text-white italic tracking-tighter uppercase leading-[0.95]">What's Inside the <br/><span className="text-gold-main not-italic">Ultimate Sanctuary Bundle</span></h3>
                    <p className="text-slate-400 font-light italic leading-relaxed text-lg md:text-2xl opacity-70">Every clinical resource we offer, synchronized for your success.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12">
                    {whatYouGet.map((item, i) => (
                        <div key={i} className="flex gap-6 group cursor-default">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:border-gold-main/50 group-hover:bg-gold-main group-hover:text-slate-950 transition-all duration-700 shadow-xl group-hover:rotate-6">
                                <item.icon size={24} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-sm font-black text-white uppercase tracking-widest group-hover:text-gold-main transition-colors">{item.title}</h4>
                                <p className="text-xs text-slate-500 italic leading-snug group-hover:text-slate-300 transition-colors">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative group">
                <div className="absolute inset-0 bg-gold-main/10 blur-[120px] animate-pulse group-hover:bg-gold-main/20 transition-colors duration-1000"></div>
                <div className="relative bg-slate-950/60 p-10 rounded-[4rem] border border-white/10 shadow-3xl overflow-hidden group-hover:border-gold-main/30 transition-all duration-1000">
                    <div className="aspect-[4/3] rounded-[3rem] overflow-hidden relative shadow-inner group-hover:scale-[0.98] transition-transform duration-1000">
                        <img src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80" alt="Clinical Precision" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[5s]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                        <div className="absolute inset-0 bg-scanline opacity-0 group-hover:opacity-20 animate-scanline"></div>
                        <div className="absolute bottom-10 left-10 right-10 p-8 bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl flex items-center gap-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-1000">
                            <div className="w-14 h-14 bg-gold-main rounded-2xl flex items-center justify-center text-slate-950 shadow-gold shrink-0 group-hover:scale-110 transition-transform">
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gold-main uppercase tracking-[0.4em]">Official Status</p>
                                <p className="text-lg font-serif font-bold text-white italic">Board Certified Preparation</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 flex justify-between items-center text-center">
                        <div className="flex-1 border-r border-white/10 group-hover:border-gold-main/20 transition-colors"><p className="text-3xl font-serif font-bold text-white italic group-hover:scale-110 transition-transform">12k+</p><p className="text-[8px] font-black uppercase text-white/30 tracking-widest mt-2">Alumni</p></div>
                        <div className="flex-1 border-r border-white/10 group-hover:border-gold-main/20 transition-colors"><p className="text-3xl font-serif font-bold text-gold-main italic group-hover:scale-110 transition-transform">100%</p><p className="text-[8px] font-black uppercase text-white/30 tracking-widest mt-2">Guarantee</p></div>
                        <div className="flex-1"><p className="text-3xl font-serif font-bold text-white italic group-hover:scale-110 transition-transform">4.9/5</p><p className="text-[8px] font-black uppercase text-white/30 tracking-widest mt-2">Rating</p></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Motivational Section */}
        <div className="mt-60 max-w-5xl mx-auto relative group scroll-reveal" style={{ transitionDelay: '300ms' }}>
            <div className="absolute -inset-4 bg-gradient-to-r from-gold-main/10 via-transparent to-gold-main/10 blur-[100px] opacity-40 group-hover:opacity-70 transition-opacity duration-1000"></div>
            <div className="bg-slate-950/80 p-12 md:p-24 relative overflow-hidden rounded-[4rem] border border-white/5 backdrop-blur-[120px] shadow-3xl transition-all duration-1000 hover:border-gold-main/30">
                <div className="absolute -top-1/4 -right-1/4 w-[50rem] h-[50rem] bg-gold-main/5 blur-[150px] rounded-full animate-pulse-slow"></div>
                
                <div className="flex items-center gap-8 mb-16 animate-pulse-soft">
                  <Heart className="w-10 h-10 text-gold-main/70 fill-gold-main/5" />
                  <h3 className="font-serif font-bold text-4xl md:text-6xl text-gold-main tracking-tight italic leading-none">To the Aspiring Clinician,</h3>
                </div>
                
                <div className="prose prose-invert max-w-none text-slate-300 font-sans font-light space-y-12 text-2xl md:text-4xl leading-[1.5]">
                    <p className="italic border-l-4 border-gold-main/30 pl-12 py-4 transition-all duration-1000 hover:border-gold-main hover:text-white">
                        If the mechanical principles of physics feel like noise in your path, <span className="text-white font-bold decoration-gold-main/50 underline underline-offset-[12px] decoration-2">you have found a place of clarity.</span> Mastery of sound is a peaceful pursuit of precision.
                    </p>
                    <p className="opacity-80 hover:opacity-100 transition-opacity duration-1000">
                        We designed EchoMasters to be your <span className="text-gold-main font-bold">trusted academic sanctuary</span>. We have refined the vast physics syllabus into a medium that is visually serene, scientifically rigorous, and intuitively guided.
                    </p>
                </div>
                
                <div className="mt-24 pt-16 border-t border-white/5 flex flex-col md:flex-row items-center gap-12 md:justify-between">
                   <div className="flex items-center gap-10">
                     <div className="w-20 h-20 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 flex items-center justify-center font-serif font-bold text-4xl text-gold-main shadow-2xl transition-all hover:rotate-[20deg] hover:scale-110 duration-700 cursor-default relative overflow-hidden group/e">
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/e:opacity-20 animate-shimmer"></div>
                        <span className="relative z-10">E</span>
                     </div>
                     <div>
                         <p className="text-3xl font-bold text-white font-serif italic leading-none">EchoMasters Academic Studio</p>
                         <p className="text-[12px] text-gold-main/50 uppercase tracking-[0.5em] font-black mt-3">Board of Sonography Educators</p>
                     </div>
                   </div>
                   <div className="flex gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 text-white/20 transition-all hover:text-gold-main hover:border-gold-main/40 hover:bg-white/10 hover:scale-110 hover:-translate-y-2 cursor-pointer shadow-xl"><Target size={28} /></div>
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 text-white/20 transition-all hover:text-gold-main hover:border-gold-main/40 hover:bg-white/10 hover:scale-110 hover:-translate-y-2 cursor-pointer shadow-xl"><Sparkles size={28} /></div>
                   </div>
                </div>
            </div>
        </div>
      </div>
      <style>{`
        .scroll-reveal {
          opacity: 0;
          transform: translateY(60px) scale(0.98);
          filter: blur(12px);
          transition: all 1.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-active {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: translate(-50%, -50%) rotate(360deg); }
          to { transform: translate(-50%, -50%) rotate(0deg); }
        }
        .animate-spin-slow { animation: spin-slow 35s linear infinite; }
        .animate-spin-slow-reverse { animation: spin-slow-reverse 45s linear infinite; }
        .bg-scanline {
          background: linear-gradient(to bottom, transparent 0%, rgba(181, 148, 78, 0.2) 50%, transparent 100%);
          background-size: 100% 40px;
        }
      `}</style>
    </div>
  );
};

export default Features;