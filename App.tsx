import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ExamSections from './components/ExamSections';
import AboutUs from './components/AboutUs';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import Guarantee from './components/Guarantee';
import CourseViewer, { GamificationState } from './components/CourseViewer';
import AppIntro from './components/AppIntro';
import LegalPages from './components/LegalPages';
import OceanBackground from './components/OceanBackground';
import AdminLogin from './components/AdminLogin';
import ClarityMatrix from './components/ClarityMatrix';
import { Shuffle, ArrowRight, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [showCourse, setShowCourse] = useState(false);
  const [legalPage, setLegalPage] = useState<'terms' | 'privacy' | null>(null);
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('spi-is-admin') === 'true');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [ripples, setRipples] = useState<{ id: number, x: number, y: number }[]>([]);
  const [introFinished, setIntroFinished] = useState(() => {
    return localStorage.getItem('spi-intro-seen') === 'true';
  });

  const [userPrefs, setUserPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem('spi-viewer-state-gamification');
      if (saved) {
        const game = JSON.parse(saved);
        return {
          sonicUXEnabled: game.sonicUXEnabled ?? true,
          visualRipplesEnabled: game.visualRipplesEnabled ?? true,
          sfxVolume: game.sfxVolume ?? 0.8
        };
      }
    } catch (e) {}
    return { sonicUXEnabled: true, visualRipplesEnabled: true, sfxVolume: 0.8 };
  });

  // Keep prefs in sync with local storage changes (from CourseViewer/UserProfile)
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('spi-viewer-state-gamification');
        if (saved) {
          const game = JSON.parse(saved);
          setUserPrefs({
            sonicUXEnabled: game.sonicUXEnabled ?? true,
            visualRipplesEnabled: game.visualRipplesEnabled ?? true,
            sfxVolume: game.sfxVolume ?? 0.8
          });
        }
      } catch (e) {}
    };
    window.addEventListener('storage', handleSync);
    // Also listen for custom events if navigation happens internally
    window.addEventListener('echomasters-prefs-update', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('echomasters-prefs-update', handleSync);
    };
  }, []);

  // Track scroll position for global parallax
  useEffect(() => {
    const handleScroll = () => {
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (introFinished) {
      localStorage.setItem('spi-intro-seen', 'true');
    }
  }, [introFinished]);

  // Global Acoustic Ripples
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
        if (!userPrefs.visualRipplesEnabled) return;
        const id = Date.now();
        setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== id));
        }, 1200);
    };
    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, [userPrefs.visualRipplesEnabled]);

  const handleAdminLogin = (success: boolean) => {
    if (success) {
      setIsAdmin(true);
      localStorage.setItem('spi-is-admin', 'true');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('spi-is-admin');
    window.location.reload();
  };

  // -- SONIC UX ENGINE --
  const playBubbleSound = () => {
    if (!userPrefs.sonicUXEnabled) return;
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;
    const bubbleCount = 8 + Math.floor(Math.random() * 4);
    for(let i = 0; i < bubbleCount; i++) {
        const t = now + i * 0.03;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        const freq = 900 + Math.random() * 500;
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq + 1200, t + 0.04);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.03 * userPrefs.sfxVolume, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.1);
    }
  };

  const playNavigationSound = () => {
    if (!userPrefs.sonicUXEnabled) return;
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.12);
    g.gain.setValueAtTime(0.04 * userPrefs.sfxVolume, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  };

  const playCorrectSound = () => {
    if (!userPrefs.sonicUXEnabled) return;
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const t = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C Major 7th
    freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const delay = idx * 0.05;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t + delay);
        g.gain.setValueAtTime(0, t + delay);
        g.gain.linearRampToValueAtTime(0.06 * userPrefs.sfxVolume, t + delay + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.9);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t + delay);
        osc.stop(t + delay + 1.2);
    });
  };

  const playClickSound = () => {
    if (!userPrefs.sonicUXEnabled) return;
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, t);
    osc.frequency.exponentialRampToValueAtTime(1200, t + 0.02);
    g.gain.setValueAtTime(0.02 * userPrefs.sfxVolume, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.03);
  };

  const playSuccessSound = () => {
    if (!userPrefs.sonicUXEnabled) return;
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const t = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C Major 9th
    freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const delay = idx * 0.08;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t + delay);
        g.gain.setValueAtTime(0, t + delay);
        g.gain.linearRampToValueAtTime(0.08 * userPrefs.sfxVolume, t + delay + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, t + delay + 1.5);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t + delay);
        osc.stop(t + delay + 2.0);
    });
  };

  const playIncorrectSound = () => {
    if (!userPrefs.sonicUXEnabled) return;
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.linearRampToValueAtTime(55, t + 0.4);
    g.gain.setValueAtTime(0.06 * userPrefs.sfxVolume, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 250;
    osc.connect(filter);
    filter.connect(g);
    g.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.5);
  };

  if (!introFinished) {
      return <AppIntro onComplete={() => setIntroFinished(true)} />;
  }

  const handleOpenCourse = () => {
    playNavigationSound();
    setShowCourse(true);
  };

  return (
    <div className="min-h-screen dark:text-white text-slate-900 selection:bg-gold-main/30 selection:text-gold-accent animate-fade-in relative overflow-hidden dark:bg-slate-950 bg-slate-50">
      <OceanBackground />
      
      {/* Click Ripple Layers */}
      {ripples.map(r => (
        <div 
            key={r.id} 
            className="fixed pointer-events-none z-[9999] border border-gold-main/30 rounded-full animate-acoustic-ripple"
            style={{ left: r.x, top: r.y, transform: 'translate(-50%, -50%)' }}
        />
      ))}

      {showCourse ? (
        <CourseViewer 
            onExit={() => { playNavigationSound(); setShowCourse(false); }} 
            onPlayCorrect={playCorrectSound}
            onPlayIncorrect={playIncorrectSound}
            onPlayBubble={playBubbleSound}
            onPlayClick={playClickSound}
            onPlaySuccess={playSuccessSound}
        />
      ) : (
        <div className="relative z-10 transition-all duration-1000">
          <Navbar 
            onOpenCourse={handleOpenCourse} 
            isAdmin={isAdmin} 
            onOpenLogin={() => setShowAdminLogin(true)}
            onLogout={handleAdminLogout}
          />
          <main className="space-y-0">
            <Hero onOpenCourse={handleOpenCourse} onPlayBubble={playBubbleSound} />
            <Features />
            <ExamSections />
            
            {/* Landing Page Clarity Preview */}
            <section id="glossary-preview" className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(181,148,78,0.03)_0%,transparent_60%)]"></div>
                <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
                    <div className="text-center space-y-6 mb-20">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-gold-main/10 border border-gold-main/20 text-[10px] font-black text-gold-main uppercase tracking-[0.4em]">
                           <Shuffle size={12} /> The Clarity Matrix
                        </div>
                        <h2 className="text-4xl md:text-7xl font-serif font-bold text-white tracking-tighter italic uppercase leading-[0.9]">
                            Commonly <span className="text-gold-main not-italic">Confused</span> Terms
                        </h2>
                        <p className="text-lg md:text-2xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed italic">
                            Master the subtle differences that determine board success. Our interactive matrix resolves clinical interference.
                        </p>
                    </div>
                    
                    <ClarityMatrix />

                    <div className="mt-20 text-center">
                        <button 
                            onClick={handleOpenCourse}
                            className="group px-12 py-6 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-black rounded-[2rem] uppercase tracking-[0.4em] text-[11px] transition-all hover:bg-gold-main hover:text-slate-950 hover:border-gold-main shadow-xl flex items-center gap-4 mx-auto"
                        >
                            Access Full Mastery Matrix <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>

            <AboutUs />
            <Testimonials />
            <Guarantee />
            <Pricing onEnroll={handleOpenCourse} />
          </main>
          <Footer onOpenLegal={(type) => setLegalPage(type)} />
        </div>
      )}

      {legalPage && (
        <LegalPages type={legalPage} onClose={() => setLegalPage(null)} />
      )}

      <AdminLogin 
        isOpen={showAdminLogin} 
        onClose={() => setShowAdminLogin(false)} 
        onLogin={handleAdminLogin} 
      />

      <style>{`
        @keyframes acoustic-ripple {
            from { width: 0; height: 0; opacity: 0.8; transform: translate(-50%, -50%) scale(0.1); }
            to { width: 500px; height: 500px; opacity: 0; transform: translate(-50%, -50%) scale(1.8); }
        }
        .animate-acoustic-ripple {
            animation: acoustic-ripple 1.2s cubic-bezier(0.1, 0.5, 0.2, 1) forwards;
        }
        :root {
          --scroll-y: 0px;
        }
      `}</style>
    </div>
  );
};

export default App;