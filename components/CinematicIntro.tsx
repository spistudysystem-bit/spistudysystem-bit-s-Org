import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ArrowRight, Sparkles, Loader2, Bot, Mic2, Cpu, Activity, Clock, ShieldCheck, Brain, Zap, Database, Volume2, Waves, RotateCcw, VolumeX, X, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface CinematicIntroProps {
  title: string;
  seedText: string;
  type: 'module' | 'lesson';
  onContinue: () => void;
  persona?: 'Charon' | 'Puck' | 'Kore' | 'Zephyr';
  topicData?: any; 
  voiceId?: string;
  elevenLabsKey?: string;
  volume?: number;
}

const DEFAULT_VOICE_ID = 'Yko7iBn2vnSMvSAsuF8N';
const CACHE_NAME = 'echomasters-acoustic-vault-v1';

const CinematicIntro: React.FC<CinematicIntroProps> = ({ title, seedText, type, onContinue, persona = 'Charon', topicData, voiceId = DEFAULT_VOICE_ID, elevenLabsKey, volume = 0.8 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [script, setScript] = useState("");
  const [hasAudio, setHasAudio] = useState(false);
  const [fadeStatus, setFadeStatus] = useState<'in' | 'out' | 'none'>('in');
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const checkCache = async () => {
      const cacheId = `intro-${title.replace(/\s+/g, '-').toLowerCase()}-${persona}-${voiceId}`;
      try {
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(`/api/audio/${cacheId}`);
          if (cachedResponse) {
              const blob = await cachedResponse.blob();
              const url = URL.createObjectURL(blob);
              setScript(localStorage.getItem(`script-${cacheId}`) || seedText);
              setupAudio(url);
              setHasAudio(true);
              return true;
          }
      } catch (e) { console.warn("Cache access error", e); }
      return false;
  };

  const setupAudio = (url: string) => {
      if (!url || url === "") return;
      if (!audioRef.current) {
          const audio = new Audio();
          audio.onended = () => {
              setIsPlaying(false);
              if ((window as any).duckRadio) (window as any).duckRadio(false);
          };
          audio.onerror = () => setError("Acoustic node failed to synchronize.");
          audio.ontimeupdate = () => {
              if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
          };
          audioRef.current = audio;
      }
      audioRef.current.src = url;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.play().catch(e => console.warn("Auto-play prevented", e));
      setIsPlaying(true);
      if ((window as any).duckRadio) (window as any).duckRadio(true);
  };

  const generateHarveyVoice = async () => {
    if (hasAudio || isGenerating) return;
    setError(null);
    const wasCached = await checkCache();
    if (wasCached) return;

    setIsGenerating(true);
    const cacheId = `intro-${title.replace(/\s+/g, '-').toLowerCase()}-${persona}-${voiceId}`;

    let generatedScript = "";
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const traits = {
        'Charon': 'Seasoned professor, wise, authoritative.',
        'Puck': 'High-energy technical mentor, fast-paced.',
        'Kore': 'Methodical calm instructor, clear.',
        'Zephyr': 'Storyteller of clinical physics, immersive.'
      }[persona] || 'Expert faculty.';

      // IMPLEMENTING THE "LECTURE PROMPT" STRATEGY
      const lecturePrompt = `
        You are ${persona}, an elite ultrasound physics mentor. 
        Topic: "${title}". 
        Context: "${topicData?.contentBody || seedText}".
        
        Write a high-yield cinematic script following this EXACT structure:
        1. QUANTIFY EFFORT: "I distilled over 150 pages of board documentation for you so here is the cliffnotes version to save you 6 hours of fatigue."
        2. ESTABLISH STAKES: "Listen close, passive watching is a failure point. If you can't solve the assessment at the end, you aren't board-ready."
        3. ROADMAP: Briefly state Parts 1 (Acoustic Identity), 2 (Mechanical Logic), and 3 (Clinical Kill-shot).
        4. CONTRAST: Explain what ${title} is NOT (e.g., "This isn't math, it's energy geometry").
        5. MNEMONIC: Provide a silly sentence to anchor the concept.
        6. ANALOGY: Relate this to human behavior or popular culture.
        7. MINDSET: Address burnout. "Just show up for 2 minutes, kid. The resonance will follow."
        8. CLOSING: "Synchronizing the node now."
        
        TONE: ${traits}. Keep it under 110 words.
      `;

      const res = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: lecturePrompt,
          config: {
              temperature: 0.8,
              topP: 0.95
          }
      });
      generatedScript = res.text || seedText;
    } catch (e) { 
      generatedScript = `I distilled hours of board-exam traps into this briefing to save you time. Passive listening won't cut it—master the assessment or you aren't ready. For ${title}, remember that physics follows systems, not just formulas. Synchronizing now.`;
    }

    setScript(generatedScript);

    try {
      const elRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'xi-api-key': elevenLabsKey || '' },
          body: JSON.stringify({
              text: generatedScript,
              model_id: 'eleven_multilingual_v2',
              voice_settings: { stability: 0.5, similarity_boost: 0.8 }
          }),
      });

      if (!elRes.ok) throw new Error("TTS Link Failed");

      const blob = await elRes.blob();
      const cache = await caches.open(CACHE_NAME);
      await cache.put(new Request(`/api/audio/${cacheId}`), new Response(blob));
      localStorage.setItem(`script-${cacheId}`, generatedScript);

      setupAudio(URL.createObjectURL(blob));
      setHasAudio(true);
    } catch (e) {
      console.warn("TTS Failed", e);
      setError("Faculty link offline. Proceeding with visual briefing.");
      setHasAudio(true); 
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
        audioRef.current.pause();
        if ((window as any).duckRadio) (window as any).duckRadio(false);
    } else {
        audioRef.current.play();
        if ((window as any).duckRadio) (window as any).duckRadio(true);
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
      if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  return (
    <div className={`fixed inset-0 z-[400] bg-slate-950/60 backdrop-blur-[100px] flex flex-col p-5 md:p-12 lg:p-24 overflow-y-auto custom-scrollbar transition-all duration-1000 ${fadeStatus === 'out' ? 'opacity-0 scale-105 blur-2xl' : 'opacity-100 scale-100'}`} role="dialog">
      
      {isGenerating && (
        <div className="fixed inset-0 z-[500] bg-slate-950/80 backdrop-blur-3xl flex flex-col items-center justify-center animate-fade-in">
           <div className="relative mb-12">
              <div className="absolute inset-[-40px] border border-gold-main/20 rounded-full animate-acoustic-pulse-slow"></div>
              <div className="absolute inset-[-80px] border border-gold-main/10 rounded-full animate-acoustic-pulse-slow" style={{ animationDelay: '1s' }}></div>
              <div className="w-24 h-24 bg-gold-main/10 rounded-3xl flex items-center justify-center border-2 border-gold-main/30 shadow-gold relative z-10">
                 <Brain className="text-gold-main animate-pulse" size={48} />
              </div>
           </div>
           <div className="text-center space-y-4 max-w-md px-6">
              <h3 className="text-2xl font-serif font-bold text-white italic tracking-tight">Synchronizing Neural Pathways</h3>
              <p className="text-slate-400 font-light italic leading-relaxed">Distilling hours of clinical documentation into a high-yield auditory node. Please hold resonance.</p>
              <div className="w-48 h-1 bg-white/5 rounded-full mx-auto overflow-hidden mt-8">
                 <div className="h-full bg-gold-main shadow-gold animate-shimmer w-full bg-[length:200%_100%]"></div>
              </div>
           </div>
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(181,148,78,0.08)_0%,transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(1,8,22,0.8)_0%,transparent_100%)]"></div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-gold-main/20 rounded-full animate-acoustic-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gold-main/10 rounded-full animate-acoustic-pulse-slow" style={{ animationDelay: '2s' }}></div>
          
          <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]"></div>
      </div>

      <div className="max-w-7xl w-full mx-auto space-y-8 md:space-y-20 relative z-10 flex flex-col min-h-full">
        <div className="flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4 md:gap-8">
                <div className="w-10 h-10 md:w-20 md:h-20 rounded-xl md:rounded-[2rem] bg-gold-main/10 flex items-center justify-center border border-gold-main/30 shadow-gold shrink-0">
                    <Bot className="w-5 h-5 md:w-10 md:h-10 text-gold-main" />
                </div>
                <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] md:text-[14px] font-black text-gold-main uppercase tracking-[0.4em] md:tracking-[0.8em] font-sans">Sector Sync</span>
                </div>
            </div>
            <button onClick={() => { setFadeStatus('out'); setTimeout(onContinue, 800); }} className="p-2.5 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"><X size={24} /></button>
        </div>

        <div className="space-y-6 md:space-y-12 flex-1">
            <h1 className="text-3xl md:text-8xl lg:text-[9rem] font-serif font-bold text-white tracking-tighter leading-none italic uppercase break-words">
                {title}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start pb-24">
                <div className="lg:col-span-8 space-y-8 md:space-y-12">
                    <div className="relative p-6 md:p-20 bg-slate-950/40 rounded-3xl md:rounded-[4rem] border border-white/10 overflow-hidden backdrop-blur-3xl shadow-3xl min-h-[220px] md:min-h-[350px] flex flex-col justify-center">
                        <div className="absolute top-0 right-0 p-12 md:p-24 opacity-[0.03] pointer-events-none"><Bot className="w-40 h-40 md:w-80 md:h-80" /></div>
                        <div className="relative z-10 text-lg md:text-5xl text-white/95 font-serif italic leading-[1.3] drop-shadow-2xl">
                            {script || "Initializing faculty uplink..."}
                        </div>
                    </div>
                    
                    {error && (
                        <div className="p-4 md:p-6 bg-red-500/10 border border-red-500/20 rounded-xl md:rounded-2xl flex items-center gap-3 md:gap-4 text-red-500 text-[9px] md:text-xs font-black uppercase tracking-widest animate-pulse">
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    {!hasAudio && !isGenerating && (
                        <button onClick={generateHarveyVoice} className="w-full md:w-max flex items-center justify-center gap-4 md:gap-6 px-10 py-5 md:px-16 md:py-8 bg-gold-main text-slate-950 rounded-2xl md:rounded-[2.5rem] hover:shadow-[0_0_80px_rgba(181,148,78,0.4)] transition-all font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-xs">
                            <Bot size={24} /> Establish Link
                        </button>
                    )}
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="aspect-[1.5/1] md:aspect-[4/5] rounded-3xl md:rounded-[4rem] bg-slate-900/60 border border-white/5 flex flex-col p-8 md:p-12 relative overflow-hidden group shadow-3xl backdrop-blur-xl">
                        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 md:space-y-10">
                            <div className="w-16 h-16 md:w-32 md:h-32 bg-gold-main/10 rounded-2xl md:rounded-[3rem] flex items-center justify-center border-2 border-gold-main/30 shadow-gold"><Zap className="w-12 h-12 text-gold-main" /></div>
                            <h4 className="text-xl md:text-3xl font-serif font-bold text-white italic">Node Ready</h4>
                        </div>
                        <button onClick={() => { setFadeStatus('out'); setTimeout(onContinue, 800); }} className="w-full py-5 md:py-8 bg-gold-main text-slate-950 rounded-2xl md:rounded-[3rem] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-xs shadow-gold hover:translate-y-[-4px] transition-all flex items-center justify-center gap-4">Initiate <ArrowRight size={20} /></button>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {hasAudio && !error && (
        <div className="sticky bottom-6 md:bottom-12 left-0 right-0 w-full max-w-4xl mx-auto px-4 md:px-8 z-[450] animate-slide-up py-2">
            <div className="bg-slate-950/90 backdrop-blur-3xl border border-white/10 p-4 md:p-6 rounded-2xl md:rounded-[3rem] shadow-2xl flex items-center gap-4 md:gap-8">
                <button onClick={togglePlayback} className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] bg-gold-main text-slate-950 flex items-center justify-center shadow-gold transition-all shrink-0">
                    {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                </button>
                <div className="flex-1 flex flex-col gap-2 md:gap-3">
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
                        <div className="h-full bg-gold-main shadow-gold transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[7px] md:text-[10px] font-black text-gold-main uppercase tracking-[0.2em] md:tracking-[0.4em]">Signal Resonance</span>
                        <span className="text-[8px] md:text-[10px] font-mono text-white/30">{Math.floor(progress)}%</span>
                    </div>
                </div>
            </div>
        </div>
      )}

      <style>{`
        @keyframes acoustic-pulse-slow {
            0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
        .animate-acoustic-pulse-slow {
            animation: acoustic-pulse-slow 8s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default CinematicIntro;