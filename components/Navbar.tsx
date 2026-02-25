import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, X, ShoppingCart, BookOpen, Settings, LayoutGrid, Star, Zap, Activity, Heart, Shield, LogOut, Info, Bot, ChevronRight, Target, Sun, Moon } from 'lucide-react';
import AdminStudio from './AdminStudio';
import SiteRadio from './SiteRadio';

interface NavbarProps {
    onOpenCourse?: () => void;
    isAdmin?: boolean;
    onOpenLogin?: () => void;
    onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenCourse, isAdmin, onOpenLogin, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showStudio, setShowStudio] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const [isDark, setIsDark] = useState(true);
  const navContainerRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { id: 'study-guides', label: 'Study Guides' },
    { id: 'about-us', label: 'About Us' },
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' }
  ];

  useEffect(() => {
    setMounted(true);
    
    // Initialize theme
    const savedTheme = localStorage.getItem('spi-theme');
    const initialDark = savedTheme ? savedTheme === 'dark' : true;
    setIsDark(initialDark);
    if (initialDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

      // Track active section
      const sections = ['home', ...navLinks.map(l => l.id)];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (section === 'home' && window.scrollY < 100) return true;
        if (element) {
          const rect = element.getBoundingClientRect();
          // Adjust threshold for better detection
          return rect.top <= 200 && rect.bottom >= 200;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update sliding indicator position
  useEffect(() => {
    if (activeSection === 'home' || !navContainerRef.current) {
        setIndicatorStyle({ opacity: 0 });
        return;
    }

    const activeElement = navContainerRef.current.querySelector(`[data-nav-id="${activeSection}"]`) as HTMLElement;
    if (activeElement) {
        setIndicatorStyle({
            left: activeElement.offsetLeft,
            width: activeElement.offsetWidth,
            opacity: 1,
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        });
    }
  }, [activeSection]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      setIsOpen(false);
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getOverride = (id: string) => {
    try {
        const saved = localStorage.getItem('spi-admin-overrides');
        if (!saved) return null;
        const overrides = JSON.parse(saved);
        return overrides[id]?.value || null;
    } catch (e) { return null; }
  };

  const logoUrl = getOverride('global-logo');

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('spi-theme', newDark ? 'dark' : 'light');
    if (newDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
  };

  return (
    <>
      <header className={`fixed w-full top-0 z-[100] transition-all duration-1000 ${scrolled ? 'dark:bg-slate-950/80 bg-white/80 backdrop-blur-2xl border-b dark:border-white/5 border-slate-200 py-3 shadow-2xl' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex justify-between items-center h-12 sm:h-16">
            
            <div className={`flex-shrink-0 flex items-center cursor-pointer group transition-all duration-1000 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <a href="#home" onClick={(e) => scrollToSection(e, 'home')} className="flex items-center gap-3 sm:gap-4 relative">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 border rounded-xl sm:rounded-2xl flex items-center justify-center bg-slate-950 shadow-soft transition-all duration-700 overflow-hidden relative ${activeSection === 'home' ? 'border-gold-main/40 shadow-gold' : 'border-gold-main/10 group-hover:shadow-gold'}`}>
                    <div className="absolute inset-0 bg-gradient-to-tr from-gold-main/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute inset-0 bg-shimmer opacity-0 group-hover:opacity-20 animate-shimmer"></div>
                    {logoUrl ? <img src={logoUrl} className="w-full h-full object-cover" alt="Logo" /> : <Bot size={24} className={`relative z-10 transition-all duration-500 ${activeSection === 'home' ? 'text-gold-main scale-110' : 'text-gold-main group-hover:scale-110'}`} />}
                  </div>
                  <div className="flex flex-col text-left">
                      <span className={`font-serif font-semibold text-lg sm:text-xl tracking-tight leading-none italic transition-colors ${activeSection === 'home' ? 'text-gold-main' : 'dark:text-white text-slate-900 group-hover:text-gold-main'}`}>EchoMasters</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`h-1 w-1 rounded-full animate-pulse ${activeSection === 'home' ? 'bg-gold-main' : 'bg-gold-main/40'}`}></div>
                        <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium text-nowrap">Educational Studio</span>
                      </div>
                  </div>
                  {activeSection === 'home' && (
                    <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-gold-main/40 rounded-full animate-pulse"></div>
                  )}
              </a>
            </div>

            <nav className="hidden lg:flex items-center gap-10">
              <div ref={navContainerRef} className="flex items-center gap-8 relative">
                {/* Sliding Indicator Background */}
                <div 
                  className="absolute bottom-0 h-0.5 bg-gold-main rounded-full pointer-events-none z-0"
                  style={indicatorStyle}
                />
                
                {navLinks.map((link, index) => {
                  const isActive = activeSection === link.id;
                  return (
                      <a 
                        key={link.id} 
                        href={`#${link.id}`} 
                        data-nav-id={link.id}
                        onClick={(e) => scrollToSection(e, link.id)} 
                        className={`group relative text-[10px] font-black transition-all uppercase tracking-widest py-2 z-10 ${isActive ? 'text-gold-main' : 'dark:text-white/60 text-slate-500 hover:text-slate-900 dark:hover:text-white'} ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        style={{ transitionDelay: `${index * 100 + 500}ms` }}
                      >
                      {link.label}
                    </a>
                  );
                })}
              </div>
              <div className="h-6 w-px bg-white/5 mx-2"></div>
              <div className={`flex items-center gap-6 transition-all duration-1000 delay-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                <button 
                  onClick={toggleTheme}
                  className="p-2.5 dark:text-white/20 text-slate-400 hover:text-gold-main transition-all rounded-xl hover:bg-white/5"
                  title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <SiteRadio />
                {isAdmin ? (
                   <div className="flex items-center gap-4">
                      <button onClick={() => setShowStudio(true)} className="flex items-center gap-2 px-5 py-2 bg-gold-main/10 text-gold-main border border-gold-main/20 rounded-xl hover:bg-gold-main/20 transition-all font-black text-[10px] uppercase tracking-widest">
                        <LayoutGrid size={14}/> Admin
                      </button>
                      <button onClick={onLogout} className="p-2.5 text-white/20 hover:text-red-400 transition-all" title="Logout">
                        <LogOut size={18} />
                      </button>
                   </div>
                ) : (
                  <button onClick={onOpenLogin} className="p-2.5 text-white/20 hover:text-gold-main transition-all group">
                    <Shield size={18} className="group-hover:rotate-12 transition-transform" />
                  </button>
                )}
                <button 
                  onClick={onOpenCourse} 
                  className="group relative flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-sm transition-all duration-700 hover:bg-white/10 hover:border-gold-main/30 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-gold-main/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <BookOpen size={14} className="opacity-70 group-hover:scale-110 transition-transform" />
                    <span>Classroom</span>
                </button>
              </div>
            </nav>

            <div className="lg:hidden flex items-center gap-3">
              <button onClick={onOpenCourse} className="text-white font-black text-[8px] sm:text-[9px] uppercase tracking-widest border border-white/10 bg-white/5 px-4 py-2 rounded-xl active:scale-95 transition-all">Classroom</button>
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={`relative z-[1100] p-3 text-white rounded-xl transition-all duration-500 ${isOpen ? 'bg-gold-main text-slate-950 rotate-90 scale-110 shadow-gold' : 'bg-white/5 hover:bg-white/10'}`}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <div className="absolute bottom-0 left-0 h-[1.5px] bg-gold-main/40 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(181,148,78,0.5)]" style={{ width: `${scrollProgress}%` }}></div>

        {/* Mobile Fullscreen Menu */}
        <div 
            className={`fixed inset-0 z-[1000] lg:hidden bg-slate-950/98 backdrop-blur-3xl flex flex-col transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
            style={{ 
                clipPath: isOpen ? 'circle(150% at 90% 5%)' : 'circle(0% at 90% 5%)' 
            }}
        >
          <div className="absolute inset-0 bg-tech-grid opacity-[0.05] pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-gold-main/5 via-transparent to-transparent"></div>

          <div className="flex justify-between items-center p-8 border-b border-white/5 relative z-10">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold-main/10 flex items-center justify-center font-bold text-gold-main border border-gold-main/20">
                  <Bot size={20} />
                </div>
                <div className="flex flex-col">
                    <span className="font-serif font-bold text-xl text-white italic leading-none">EchoMasters</span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/30 mt-1">Mobile Interface Node</span>
                </div>
             </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center gap-4 px-10 relative z-10 py-12">
              {[
                { id: 'study-guides', icon: Star, label: 'Study Guides', sub: 'Master the sectors' },
                { id: 'about-us', icon: Info, label: 'About Us', sub: 'Our clinical legacy' },
                { id: 'features', icon: Zap, label: 'Features', sub: 'The mastery toolset' },
                { id: 'pricing', icon: ShoppingCart, label: 'Pricing', sub: 'Enroll in sanctuary' }
              ].map((item, i) => {
                const isActive = activeSection === item.id;
                return (
                  <a 
                    key={item.id} 
                    href={`#${item.id}`} 
                    onClick={(e) => scrollToSection(e, item.id)} 
                    className={`flex items-center gap-6 p-4 rounded-2xl transition-all duration-700 group active:bg-white/5 border border-transparent active:border-white/10 ${isOpen ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-12 opacity-0 blur-md'} ${isActive ? 'bg-white/5 border-gold-main/20' : ''}`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <div className={`w-14 h-14 rounded-2xl border transition-all shadow-xl flex items-center justify-center group-active:scale-110 ${isActive ? 'bg-gold-main text-slate-950 border-gold-main shadow-gold' : 'bg-slate-900 border-white/10'}`}>
                      <item.icon className={`w-6 h-6 ${isActive ? 'text-slate-950' : 'text-gold-main'}`} />
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-2xl font-serif font-bold italic leading-none transition-colors ${isActive ? 'text-gold-main' : 'text-white/80 group-active:text-gold-main'}`}>{item.label}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/20 mt-2">{item.sub}</span>
                    </div>
                    {isActive && (
                        <div className="ml-auto flex flex-col items-center gap-1 animate-fade-in">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold-main shadow-gold"></div>
                            <span className="text-[7px] font-black text-gold-main uppercase tracking-widest leading-none">Active</span>
                        </div>
                    )}
                  </a>
                );
              })}
              
              <div className={`h-px bg-white/5 my-6 ${isOpen ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'} transition-all duration-1000 delay-500`}></div>
              
              <div className={`transition-all duration-700 delay-500 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <SiteRadio />
              </div>
          </div>

          <div className="p-10 border-t border-white/5 bg-white/[0.02] relative z-10">
              <div className="mb-8 flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                      <Target size={14} className="text-gold-main animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Academic Readiness</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-gold-main">84% SYNC</span>
              </div>

              {isAdmin ? (
                <button onClick={() => { setIsOpen(false); setShowStudio(true); }} className="w-full flex items-center justify-center gap-4 p-6 rounded-[2rem] bg-gold-main text-slate-900 font-black uppercase text-[11px] tracking-[0.3em] shadow-gold active:scale-[0.98] transition-all">
                  <LayoutGrid size={20} /> Admin Studio
                </button>
              ) : (
                <button onClick={() => { setIsOpen(false); onOpenLogin?.(); }} className="w-full flex items-center justify-center gap-4 p-6 rounded-[2rem] bg-white/5 border border-white/10 text-white font-black uppercase text-[11px] tracking-[0.3em] active:bg-white/10 transition-all">
                  <Shield size={20} className="text-gold-main" /> Staff Entrance
                </button>
              )}
          </div>
        </div>
      </header>
      <AdminStudio isOpen={showStudio} onClose={() => setShowStudio(false)} />
    </>
  );
};

export default Navbar;