import React, { useState, useEffect, useRef } from 'react';
import { SkipForward, Waves, Anchor, Database, Activity, Sparkles, Volume2 } from 'lucide-react';

interface AppIntroProps {
    onComplete: () => void;
}

const FALLBACK_ELEVEN_LABS_KEY = 'sk_1936bfcdbf6206ed5b4cab49c62bd5ff8e377b02b60401d2';
const DEFAULT_VOICE_ID = 'Yko7iBn2vnSMvSAsuF8N'; // Burt - Smooth, Charismatic, Mature
const CACHE_NAME = 'echomasters-acoustic-vault-v1';

const AppIntro: React.FC<AppIntroProps> = ({ onComplete }) => {
  const [step, setStep] = useState(-1);
  const [isExiting, setIsExiting] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [cachedCount, setCachedCount] = useState(0);
  const [activeVoiceId, setActiveVoiceId] = useState(DEFAULT_VOICE_ID);
  const [activeApiKey, setActiveApiKey] = useState(FALLBACK_ELEVEN_LABS_KEY);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const backgroundGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
      try {
          const saved = localStorage.getItem('spi-viewer-state-gamification');
          if (saved) {
              const game = JSON.parse(saved);
              // Use custom override if provided, otherwise the chosen preset
              const effectiveVoice = game.customVoiceId || game.voiceId || DEFAULT_VOICE_ID;
              setActiveVoiceId(effectiveVoice);
              
              if (game.elevenLabsKey) {
                  setActiveApiKey(game.elevenLabsKey);
              }
          }
      } catch (e) { console.error("Identity retrieval failed"); }
  }, []);

  const script = [
      { id: 'intro-1', text: "Listen close, kid. The human body is a vast, silent ocean.", duration: 3500 },
      { id: 'intro-2', text: "But where light fails to see, sound begins to speak.", duration: 3500 },
      { id: 'intro-3', text: "Every echo is a story. Every reflection is a heartbeat caught in time.", duration: 4000 },
      { id: 'intro-4', text: "Your precision doesn't just create images... it saves lives.", duration: 3500 },
      { id: 'intro-5', text: "Welcome to the EchoMasters Sanctuary. Let's make you a master.", duration: 4500 },
  ];

  const initAudio = () => {
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        backgroundGainRef.current = audioContextRef.current.createGain();
        backgroundGainRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);
        backgroundGainRef.current.connect(audioContextRef.current.destination);
    }
  };

  const playSonarPing = () => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.15);
    g.gain.setValueAtTime(0.06, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    osc.stop(now + 1.5);
  };

  const handleStartIntro = async () => {
    initAudio();
    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    playSonarPing();
    setStep(0);
  };

  useEffect(() => {
    caches.open(CACHE_NAME).then(cache => {
        cache.keys().then(keys => setCachedCount(keys.length));
    });
  }, []);

  useEffect(() => {
      if (step === -1) return;
      let timeout: number;
      if (step < script.length) {
          timeout = window.setTimeout(() => {
            if (step < script.length - 1) playSonarPing();
            setStep(s => s + 1);
          }, script[step].duration);
      } else if (step === script.length) {
          setShowLogo(true);
          timeout = window.setTimeout(() => { setIsExiting(true); setTimeout(onComplete, 1200); }, 5000);
      }
      return () => clearTimeout(timeout);
  }, [step, onComplete]);

  return (
    <div className={`fixed inset-0 z-[500] bg-slate-950 flex flex-col items-center justify-center transition-all duration-1000 overflow-y-auto p-6 md:p-12 custom-scrollbar ${isExiting ? 'opacity-0 scale-110 blur-xl pointer-events-none' : 'opacity-100 scale-100'}`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 fixed">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] border-[0.5px] border-gold-main/20 rounded-full animate-[spin_240s_linear_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] border-[0.5px] border-gold-main/10 rounded-full animate-[spin_180s_linear_infinite_reverse]"></div>
        </div>

        {step === -1 ? (
            <div className="flex flex-col items-center gap-8 md:gap-16 animate-fade-in relative z-10 px-4 md:px-6 text-center py-10">
              <div className="relative group shrink-0 animate-float-intense">
                <div className="absolute inset-0 bg-gold-main/20 blur-[100px] animate-pulse rounded-full group-hover:bg-gold-main/40 transition-all duration-1000"></div>
                <div className="w-40 h-40 md:w-56 md:h-56 bg-slate-950/90 backdrop-blur-3xl rounded-[3rem] md:rounded-[5rem] flex items-center justify-center border-2 border-gold-main/40 shadow-gold-strong relative z-10 hover:border-gold-main transition-all duration-1000 transform hover:scale-110 group-active:scale-90">
                  <Waves className="w-20 h-20 md:w-28 md:h-28 text-gold-main animate-pulse" />
                  <div className="absolute inset-0 bg-shimmer opacity-10 animate-shimmer rounded-[inherit]"></div>
                </div>
              </div>
              <div className="space-y-6 md:space-y-10">
                <h2 className="text-white font-serif italic text-4xl md:text-8xl tracking-tight leading-none opacity-0 animate-slide-up drop-shadow-2xl" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>The Acoustic Protocol</h2>
                <div className="flex flex-col items-center gap-6 opacity-0 animate-slide-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                    <p className="text-gold-main/60 text-[10px] md:text-[14px] uppercase tracking-[0.6em] md:tracking-[1em] font-black font-sans transition-all hover:tracking-[1.2em] cursor-default">EchoMasters Sanctuary Matrix</p>
                    {cachedCount > 0 && (
                        <div className="flex items-center gap-4 px-6 py-2 rounded-full bg-gold-main/5 border border-gold-main/30 animate-pulse-soft backdrop-blur-xl">
                            <Database size={14} className="text-gold-main" />
                            <span className="text-[9px] md:text-[12px] text-gold-main font-black uppercase tracking-[0.3em]">{cachedCount} Synaptic Nodes Primed</span>
                        </div>
                    )}
                </div>
              </div>
              <button 
                onClick={handleStartIntro} 
                className="group relative px-16 py-8 md:px-24 md:py-10 bg-gold-main text-slate-950 font-black rounded-[2.5rem] md:rounded-[3.5rem] shadow-gold hover:shadow-[0_0_100px_rgba(181,148,78,0.6)] hover:translate-y-[-8px] transition-all uppercase tracking-[0.5em] md:tracking-[0.8em] text-[11px] md:text-[15px] flex items-center gap-6 md:gap-10 active:scale-95 mt-10 opacity-0 animate-slide-up overflow-hidden"
                style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>
                <Activity className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-[30deg] transition-transform duration-500 relative z-10" /> 
                <span className="relative z-10">Establish Resonance</span>
              </button>
            </div>
        ) : (
            <>
                <button onClick={onComplete} className="absolute top-8 right-8 md:top-14 md:right-14 z-[550] flex items-center gap-4 text-[10px] md:text-[13px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-all group p-6 hover:bg-white/5 rounded-2xl">
                    Bypass Narrative <SkipForward className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
                </button>
                <div className="relative z-10 max-w-7xl px-4 md:px-12 text-center py-20 flex flex-col justify-center min-h-full">
                    {!showLogo && step < script.length && (
                      <div className="space-y-12 md:space-y-24 animate-slide-up">
                         <div className="flex justify-center items-center gap-6 md:gap-12">
                            <div className="h-[1px] w-16 md:w-32 bg-gradient-to-r from-transparent to-gold-main/40"></div>
                            <Sparkles className="text-gold-main animate-ping" size={24} />
                            <div className="h-[1px] w-16 md:w-32 bg-gradient-to-l from-transparent to-gold-main/40"></div>
                         </div>
                         <h1 className="text-4xl sm:text-6xl md:text-[10rem] font-serif italic text-white leading-[1.1] drop-shadow-[0_0_80px_rgba(255,255,255,0.2)] select-none animate-fade-in px-4 md:px-10 transition-all duration-1000 hover:tracking-tight">
                            {script[step].text}
                         </h1>
                      </div>
                    )}
                    {showLogo && (
                      <div className="flex flex-col items-center animate-fade-in space-y-10 md:space-y-20">
                        <div className="relative group shrink-0 animate-float-intense">
                            <div className="absolute inset-0 bg-gold-main/30 blur-[150px] rounded-full animate-pulse"></div>
                            <h1 className="text-6xl sm:text-9xl md:text-[16rem] font-serif font-bold text-white mb-10 tracking-tighter relative z-10 select-none leading-none italic group-hover:scale-[1.05] transition-transform duration-1000">
                              Echo<span className="text-gold-main not-italic">Masters</span>
                            </h1>
                        </div>
                        <div className="flex flex-col items-center gap-6 md:gap-10 opacity-0 animate-slide-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
                            <div className="flex gap-8 items-center">
                                <div className="h-[1.5px] w-12 md:w-24 bg-gradient-to-r from-transparent to-gold-main/60"></div>
                                <p className="text-[12px] md:text-[18px] text-gold-main uppercase tracking-[1em] md:tracking-[1.5em] font-black opacity-90 group-hover:tracking-[2em] transition-all duration-1000">Academic Sanctuary</p>
                                <div className="h-[1.5px] w-12 md:w-24 bg-gradient-to-l from-transparent to-gold-main/60"></div>
                            </div>
                            <p className="text-white/40 text-[10px] md:text-[14px] uppercase tracking-[0.5em] md:tracking-[0.8em] italic font-medium animate-pulse-slow">Synchronizing clinical vectors across all domains...</p>
                        </div>
                      </div>
                    )}
                </div>
                
                <div className="absolute bottom-12 left-12 md:bottom-20 md:left-20 flex items-center gap-10 opacity-40 md:opacity-70">
                   <div className="flex flex-col gap-3 md:gap-5">
                      <span className="text-[9px] md:text-[11px] font-black text-white/40 uppercase tracking-[0.5em] md:tracking-[0.7em]">Acoustic Sync Logic</span>
                      <div className="flex gap-2 md:gap-3 items-end h-12 md:h-20">
                         {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                             <div key={i} className={`w-1 md:w-2 bg-gold-main rounded-full transition-all duration-500 shadow-gold ${step >= 0 ? `animate-radio-wave-${(i%3)+1}` : 'h-2'}`} style={{ animationDelay: `${i * 0.1}s` }}></div>
                         ))}
                      </div>
                   </div>
                </div>
            </>
        )}
    </div>
  );
};
export default AppIntro;