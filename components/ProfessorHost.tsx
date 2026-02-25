import React, { useState } from 'react';
import { Bot, Sun, Loader2, Zap, Cpu, Radio, Sparkles, Brain, HandMetal, Waves, MousePointer2 } from 'lucide-react';

interface ProfessorHostProps {
  position?: { x: number; y: number };
  isActive: boolean;
  isThinking?: boolean;
  isSpeaking?: boolean;
  message?: string;
  onClick?: () => void;
  onPartClick?: (part: 'head' | 'hand' | 'core') => void;
}

const ProfessorHost: React.FC<ProfessorHostProps> = ({ 
  position = { x: 50, y: 50 }, 
  isActive, 
  isThinking, 
  isSpeaking, 
  message, 
  onClick,
  onPartClick
}) => {
  const [hoveredPart, setHoveredPart] = useState<'head' | 'hand' | 'core' | null>(null);

  const safeX = position?.x ?? 50;
  const safeY = position?.y ?? 50;

  const handleInteraction = (e: React.MouseEvent, part: 'head' | 'hand' | 'core') => {
    e.stopPropagation();
    if (!isActive) {
        onClick?.();
        return;
    }
    
    // Internal visual feedback could go here
    onPartClick?.(part);
    
    // Play a small localized haptic sound if available or just the interaction logic
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(part === 'head' ? 880 : 440, now);
    osc.frequency.exponentialRampToValueAtTime(part === 'head' ? 1200 : 220, now + 0.1);
    g.gain.setValueAtTime(0.02, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    osc.stop(now + 0.1);
  };

  return (
    <div 
      className="absolute z-[999] pointer-events-none transition-all duration-1000 ease-in-out transform"
      style={{ 
        left: `${safeX}%`, 
        top: `${safeY}%`,
        transform: `translate(-50%, -50%) scale(${isActive ? 1.15 : 0.7})`
      }}
    >
      <div 
        className={`relative flex flex-col items-center group pointer-events-auto cursor-pointer transition-all duration-1000 ${isActive ? 'opacity-100' : 'opacity-0 scale-50 rotate-12 blur-xl'}`}
        onClick={onClick}
      >
        {isActive && (
          <div className="absolute inset-0 bg-gold-main/10 animate-hologram-flicker pointer-events-none rounded-full blur-[60px]"></div>
        )}

        <div className="absolute -top-20 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none scale-90 group-hover:scale-100">
            <div className="bg-slate-950/95 backdrop-blur-md border border-gold-main/40 px-5 py-2 rounded-full flex items-center gap-3 shadow-[0_0_30px_rgba(181,148,78,0.3)]">
                <Cpu size={14} className="text-gold-main animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Unit-01: Harvey</span>
            </div>
        </div>

        {/* Dynamic Part Label */}
        {isActive && hoveredPart && (
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 animate-fade-in">
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
                    <span className="text-[8px] font-black text-gold-main uppercase tracking-widest">
                        {hoveredPart === 'head' ? 'Knowledge Core' : hoveredPart === 'hand' ? 'Acoustic Manipulator' : 'Primary Sync'}
                    </span>
                </div>
            </div>
        )}

        <div className="absolute -bottom-6 w-24 h-8 bg-gold-main/20 blur-3xl rounded-[100%] animate-pulse"></div>
        
        <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
            {/* Spinning Energy Rings */}
            <div className={`absolute inset-0 border-2 border-dashed border-gold-main/30 rounded-full ${isActive ? 'animate-[spin_15s_linear_infinite]' : ''}`}></div>
            <div className={`absolute inset-4 border border-blue-400/20 rounded-full ${isActive ? 'animate-[spin_8s_linear_infinite_reverse]' : ''}`}></div>
            
            {/* Manipulator "Hands" - Floating interaction points */}
            {isActive && (
                <>
                    {/* Left Manipulator */}
                    <div 
                        onMouseEnter={() => setHoveredPart('hand')}
                        onMouseLeave={() => setHoveredPart(null)}
                        onClick={(e) => handleInteraction(e, 'hand')}
                        className="absolute -left-8 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-950 border border-gold-main/30 rounded-xl flex items-center justify-center shadow-gold hover:scale-125 hover:border-gold-main transition-all duration-300 animate-float"
                    >
                        <Sparkles size={14} className="text-gold-main" />
                        <div className="absolute inset-0 bg-gold-main/20 animate-ping rounded-xl"></div>
                    </div>
                    {/* Right Manipulator */}
                    <div 
                        onMouseEnter={() => setHoveredPart('hand')}
                        onMouseLeave={() => setHoveredPart(null)}
                        onClick={(e) => handleInteraction(e, 'hand')}
                        className="absolute -right-8 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-950 border border-gold-main/30 rounded-xl flex items-center justify-center shadow-gold hover:scale-125 hover:border-gold-main transition-all duration-300 animate-float"
                        style={{ animationDelay: '1s' }}
                    >
                        <Zap size={14} className="text-gold-main" />
                        <div className="absolute inset-0 bg-gold-main/20 animate-ping rounded-xl" style={{ animationDelay: '1s' }}></div>
                    </div>
                </>
            )}

            <div className={`relative w-16 h-16 md:w-20 md:h-20 bg-slate-950 border-2 border-gold-main/50 rounded-[2.5rem] flex flex-col items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-700 ${isActive ? 'animate-materialize' : ''} ${isSpeaking ? 'scale-110 border-gold-main shadow-[0_0_50px_rgba(181,148,78,0.4)]' : isThinking ? 'scale-95 border-blue-400/70' : 'animate-float'}`}>
                <div className={`absolute inset-0 bg-gradient-to-tr transition-colors duration-500 ${isThinking ? 'from-blue-600/40' : 'from-gold-main/40'} to-transparent`}></div>
                
                {/* Visual Head Interaction Zone */}
                <div 
                    onMouseEnter={() => setHoveredPart('head')}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={(e) => handleInteraction(e, 'head')}
                    className="absolute top-0 left-0 w-full h-1/2 z-20 cursor-help"
                />

                {/* Visual Core Interaction Zone */}
                <div 
                    onMouseEnter={() => setHoveredPart('core')}
                    onMouseLeave={() => setHoveredPart(null)}
                    onClick={(e) => handleInteraction(e, 'core')}
                    className="absolute bottom-0 left-0 w-full h-1/2 z-20"
                />

                {isThinking ? (
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin relative z-10" />
                ) : (
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <div className={`transition-all duration-500 ${hoveredPart === 'head' ? 'scale-125 text-white' : ''}`}>
                        <Brain size={18} className={isSpeaking ? 'text-gold-main' : 'text-gold-main/70'} />
                    </div>
                    <Bot className={`w-8 h-8 transition-all duration-700 ${isSpeaking ? 'text-gold-main' : 'text-gold-main/70'} ${hoveredPart === 'core' ? 'scale-110' : ''}`} />
                  </div>
                )}

                {isSpeaking && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5 items-end h-3">
                        <div className="w-0.5 bg-gold-main rounded-full animate-[host-wave_0.4s_infinite]"></div>
                        <div className="w-0.5 bg-gold-main rounded-full animate-[host-wave_0.5s_infinite_0.1s]"></div>
                        <div className="w-0.5 bg-gold-main rounded-full animate-[host-wave_0.3s_infinite_0.2s]"></div>
                        <div className="w-0.5 bg-gold-main rounded-full animate-[host-wave_0.6s_infinite_0.3s]"></div>
                    </div>
                )}
                
                <div className={`absolute top-0 left-0 w-full h-[2px] animate-scan-robotic ${isThinking ? 'bg-blue-400' : 'bg-gold-main'}`}></div>
            </div>
        </div>

        {message && (
            <div className="absolute bottom-full mb-14 w-[300px] md:w-[380px] bg-slate-950/95 backdrop-blur-3xl border-2 border-gold-main/40 p-8 rounded-[2.5rem] shadow-3xl animate-message-pop z-[1000]">
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-slate-950 border-r-2 border-b-2 border-gold-main/40 rotate-45"></div>
                <div className="flex gap-2 items-center mb-4">
                    <div className="w-2 h-2 rounded-full bg-gold-main animate-pulse shadow-[0_0_12px_#B5944E]"></div>
                    <span className="text-[9px] uppercase tracking-[0.4em] font-black text-gold-main">Faculty Briefing</span>
                </div>
                <p className="text-sm md:text-base font-serif font-medium text-white/95 leading-relaxed text-left italic border-l-2 border-gold-main/50 pl-6 py-1">
                    {message}
                </p>
                <div className="mt-4 flex justify-end gap-2">
                    <MousePointer2 size={12} className="text-gold-main/30 animate-pulse" />
                    <span className="text-[7px] uppercase tracking-widest text-white/20">Interact with host components for depth</span>
                </div>
            </div>
        )}
      </div>

      <style>{`
        @keyframes host-wave { 0%, 100% { height: 3px; } 50% { height: 10px; } }
        @keyframes scan-robotic { 0% { top: 0%; opacity: 0; } 50% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        @keyframes hologram-flicker { 0%, 100% { opacity: 0.3; } 30% { opacity: 0.6; transform: scale(1.02); } 60% { opacity: 0.4; } }
        @keyframes material-fx { 0% { opacity: 0; transform: translateY(20px); filter: blur(10px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0); } }
        @keyframes message-pop { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-materialize { animation: material-fx 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-message-pop { animation: message-pop 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-hologram-flicker { animation: hologram-flicker 3s infinite; }
        .animate-scan-robotic { animation: scan-robotic 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default ProfessorHost;