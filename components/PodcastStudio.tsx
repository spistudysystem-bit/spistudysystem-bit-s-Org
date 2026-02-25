import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Music, Mic, 
  Disc3, Radio, Headphones, Volume2, Search, 
  Sparkles, Clock, ArrowRight, Share2, Heart,
  VolumeX, ListMusic, Bot, Wifi, Download, 
  Loader2, Zap, Save, Trash2, Mic2, AlertCircle,
  Database, Plus, Globe, Upload, FileAudio, X,
  Activity, BarChart3, Binary, Link as LinkIcon, ChevronRight, ZapOff, Brain,
  Calendar, Info, Gauge, Waves, Sliders, PlayCircle,
  // Fix: Adding missing icons to resolve "Cannot find name" errors on lines 306 and 478
  UserCircle, ChevronDown
} from 'lucide-react';
import { podcastTracks, PodcastTrack, courseData } from '../data/courseContent';
import { GoogleGenAI } from "@google/genai";

interface PodcastStudioProps {
  onOpenConsultancy?: () => void;
  elevenLabsKey?: string;
  voiceId?: string;
  onPlayClick?: () => void;
}

const BURT_VOICE_ID = 'Yko7iBn2vnSMvSAsuF8N';
const CACHE_NAME = 'echomasters-acoustic-vault-v1';

const PodcastStudio: React.FC<PodcastStudioProps> = ({ onOpenConsultancy, elevenLabsKey, voiceId, onPlayClick }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'songs' | 'lectures' | 'broadcasts' | 'custom'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTrackId, setCurrentTrackId] = useState<string>('');
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState<string>("");

  const [showDeployment, setShowDeployment] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualArtist, setManualArtist] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  const [customTracks, setCustomTracks] = useState<PodcastTrack[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visualizerAnimationFrame = useRef<number>(0);

  // Simulated Broadcast Schedule
  const schedule = [
    { time: '09:00', event: 'Morning Acoustic Pulse', sector: 'Sector 1' },
    { time: '12:00', event: 'High-Velocity Doppler Sync', sector: 'Sector 5' },
    { time: '15:00', event: 'Artifact Resolution Lab', sector: 'Sector 4' },
    { time: '18:00', event: 'Evening Resonance Deck', sector: 'Deep Vault' },
  ];

  useEffect(() => {
    loadCachedTracks();

    const handleAudioState = (e: any) => {
        setIsPlaying(e.detail.isPlaying);
        if (e.detail.track) setCurrentTrackId(e.detail.track.id);
    };
    window.addEventListener('echomasters-audio-state', handleAudioState);
    
    // Start Visualizer Loop
    startVisualizer();

    return () => {
        window.removeEventListener('echomasters-audio-state', handleAudioState);
        cancelAnimationFrame(visualizerAnimationFrame.current);
    };
  }, []);

  const startVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let bars = 64;
    let data = new Array(bars).fill(0).map(() => Math.random() * 100);

    const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bars);
        
        for (let i = 0; i < bars; i++) {
            // Update data based on playing state
            if (isPlaying) {
                const target = Math.random() * (canvas.height * 0.8) + 10;
                data[i] += (target - data[i]) * 0.1;
            } else {
                data[i] *= 0.92;
            }

            const h = data[i];
            const x = i * barWidth;
            const y = canvas.height - h;

            const grad = ctx.createLinearGradient(x, y, x, canvas.height);
            grad.addColorStop(0, '#B5944E');
            grad.addColorStop(1, 'rgba(181, 148, 78, 0.05)');

            ctx.fillStyle = grad;
            ctx.fillRect(x + 1, y, barWidth - 2, h);
            
            // Mirror
            ctx.globalAlpha = 0.2;
            ctx.fillRect(x + 1, 0, barWidth - 2, h * 0.3);
            ctx.globalAlpha = 1;
        }

        visualizerAnimationFrame.current = requestAnimationFrame(render);
    };
    render();
  };

  const loadCachedTracks = async () => {
    try {
      const metadata = localStorage.getItem('echomasters-custom-tracks');
      if (metadata) {
        setCustomTracks(JSON.parse(metadata));
      }
    } catch (e) {
      console.error("Cache load failed", e);
    }
  };

  const filteredTracks = [...podcastTracks, ...customTracks].filter(track => {
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'songs' && track.type === 'song') || 
                      (activeTab === 'lectures' && track.type === 'lecture') ||
                      (activeTab === 'broadcasts' && track.type === 'broadcast') ||
                      (activeTab === 'custom' && (track.id.startsWith('custom-') || track.id.startsWith('manual-')));
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const playTrack = async (track: PodcastTrack) => {
    setCurrentTrackId(track.id);
    setIsPlaying(true);

    let finalUrl = track.url;
    if (track.id.startsWith('custom-') && track.url.startsWith('/api/audio/')) {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(track.url);
        if (cachedResponse) {
            const blob = await cachedResponse.blob();
            finalUrl = URL.createObjectURL(blob);
        }
    }

    window.dispatchEvent(new CustomEvent('echomasters-play-track', { 
        detail: { track: { ...track, url: finalUrl } } 
    }));
  };

  const activeTrack = filteredTracks.find(t => t.id === currentTrackId) || filteredTracks[0] || podcastTracks[0];

  const generateNewLecture = async (topicTitle: string) => {
    if (isRecording) return;
    setIsRecording(true);
    setRecordingProgress(5);
    setGenerationStep("Analyzing Physics Sector...");
    
    let script = "";
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Write a high-yield ultrasound physics podcast script for: "${topicTitle}". Narrator: Faculty Unit. Tone: Cool, mature, paternal. Max 55 words. Start with "Listen close." Raw text only.`;
      
      setRecordingProgress(15);
      setGenerationStep("Drafting Auditory Matrix...");
      
      const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      script = res.text || `Focus on ${topicTitle}. Let's secure this concept.`;
    } catch (e) {
      script = `Attention student. Focus on ${topicTitle} mechanics. Let's secure this concept.`;
    }
      
    setRecordingProgress(45);
    setGenerationStep("Syncing Neural Voice...");

    try {
      const elRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId || BURT_VOICE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'xi-api-key': elevenLabsKey || '' },
        body: JSON.stringify({
          text: script, model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.8 }
        })
      });
      if (!elRes.ok) throw new Error("TTS Failed");
      
      setRecordingProgress(75);
      setGenerationStep("Archiving to Acoustic Vault...");
      
      const audioBlob = await elRes.blob();
      setRecordingProgress(90);
      const cache = await caches.open(CACHE_NAME);
      const customId = `custom-lecture-${Date.now()}`;
      const apiUrl = `/api/audio/${customId}`;
      await cache.put(new Request(apiUrl), new Response(audioBlob));
      const newTrack: PodcastTrack = {
        id: customId, title: `${topicTitle} (Lecture)`, artist: 'Faculty Node 01',
        url: apiUrl, duration: '1:00', type: 'lecture',
        description: `Custom deep dive into ${topicTitle}.`, tags: ['AI Generated']
      };
      const updatedCustom = [newTrack, ...customTracks];
      setCustomTracks(updatedCustom);
      localStorage.setItem('echomasters-custom-tracks', JSON.stringify(updatedCustom));
      setRecordingProgress(100);
      setGenerationStep("Node Ready.");
      setTimeout(() => { setIsRecording(false); setRecordingProgress(0); setActiveTab('custom'); playTrack(newTrack); }, 1000);
    } catch (e) {
      setIsRecording(false);
      setGenerationStep("Connection Failed.");
    }
  };

  const handleManualDeployment = async () => {
    if (!manualTitle || (!manualUrl && !manualArtist)) return;
    setIsDeploying(true);
    const customId = `manual-${Date.now()}`;
    const newTrack: PodcastTrack = {
      id: customId, title: manualTitle, artist: manualArtist || 'Specialist ID',
      url: manualUrl, duration: 'LIVE', type: 'song',
      description: 'Manually deployed node.', tags: ['Manual']
    };
    const updatedCustom = [newTrack, ...customTracks];
    setCustomTracks(updatedCustom);
    localStorage.setItem('echomasters-custom-tracks', JSON.stringify(updatedCustom));
    setTimeout(() => {
      setIsDeploying(false); setManualTitle(''); setManualArtist(''); setManualUrl('');
      setShowDeployment(false); setActiveTab('custom'); playTrack(newTrack);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-6 md:py-16 space-y-12 animate-fade-in text-left font-sans pb-60">
      
      {/* Expanded Studio Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end border-b border-white/5 pb-16">
        <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gold-main/10 rounded-xl border border-gold-main/30 shadow-gold"><Radio size={18} className="text-gold-main animate-pulse" /></div>
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-gold-main">Acoustic Control Center</span>
            </div>
            <div className="space-y-4">
                <h1 className="text-[clamp(2.5rem,10vw,7rem)] font-serif font-bold tracking-tighter leading-[0.75] italic uppercase text-white">Echo <span className="text-gold-main not-italic">Studio</span></h1>
                <p className="text-slate-400 text-lg md:text-2xl font-light max-w-3xl italic leading-relaxed border-l-4 border-gold-main/20 pl-8">
                    The expanded sanctuary for high-fidelity physics synchronization. Deploy auditory nodes, monitor real-time clinical broadcasts, and archive neural signatures.
                </p>
            </div>
        </div>
        <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex justify-end gap-3">
                <button onClick={() => { onPlayClick?.(); setShowDeployment(!showDeployment); }} className={`px-10 py-6 rounded-[2.5rem] font-black uppercase text-[11px] tracking-widest transition-all flex items-center gap-4 border shadow-2xl ${showDeployment ? 'bg-white text-slate-950 border-white' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'}`}>
                    {showDeployment ? <X size={20} /> : <Zap size={20} />}
                    <span>{showDeployment ? 'Abort Deployment' : 'Deploy Node'}</span>
                </button>
            </div>
            <div className="p-8 bg-slate-900 border border-white/5 rounded-[3rem] flex justify-between items-center shadow-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(181,148,78,0.03)_0%,transparent_60%)]"></div>
                <div className="flex flex-col gap-1 relative z-10">
                    <span className="text-[9px] font-black uppercase text-white/30 tracking-widest">Resonance Fidelity</span>
                    <span className="text-2xl font-serif font-bold text-white italic">256kbps</span>
                </div>
                <div className="h-10 w-px bg-white/10"></div>
                <div className="flex flex-col gap-1 text-right relative z-10">
                    <span className="text-[9px] font-black uppercase text-white/30 tracking-widest">Neural Load</span>
                    <span className="text-2xl font-serif font-bold text-gold-main italic">OPTIMAL</span>
                </div>
            </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        
        {/* Left Deck: Spectrum & Primary Deck */}
        <div className="lg:col-span-8 space-y-12">
            
            {/* Deployment Console (Expanded) */}
            {showDeployment && (
                <div className="p-10 md:p-16 bg-slate-900 border-2 border-white/10 rounded-[4rem] animate-slide-up space-y-12 relative overflow-hidden shadow-3xl group">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform"><Activity size={240} /></div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-10">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-gold-main/10 text-gold-main rounded-3xl flex items-center justify-center border-2 border-gold-main/30 shadow-gold"><Upload size={32} /></div>
                            <div>
                                <h3 className="text-3xl font-serif font-bold text-white italic uppercase tracking-tight">Signal Deployment</h3>
                                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.4em] mt-2">Unified Uplink Protocol v4.2</p>
                            </div>
                        </div>
                        <span className="px-5 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-[10px] font-black text-green-400 uppercase tracking-widest animate-pulse">UPLINK_READY</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em] ml-2">Node Identification</label>
                            <div className="relative group">
                                <Info className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10 group-focus-within:text-gold-main transition-colors" />
                                <input type="text" value={manualTitle} onChange={(e) => setManualTitle(e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-[2rem] pl-16 pr-8 py-5 text-white font-serif italic text-xl focus:border-gold-main/40 transition-all outline-none" placeholder="Target Briefing Name" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em] ml-2">Identity Signature</label>
                            <div className="relative group">
                                <UserCircle className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10 group-focus-within:text-gold-main transition-colors" />
                                <input type="text" value={manualArtist} onChange={(e) => setManualArtist(e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-[2rem] pl-16 pr-8 py-5 text-white font-serif italic text-xl focus:border-gold-main/40 transition-all outline-none" placeholder="Specialist Code" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em] ml-2">Digital Signal Path (.mp3 URL)</label>
                        <div className="relative group">
                            <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10 group-focus-within:text-gold-main transition-colors" />
                            <input type="text" value={manualUrl} onChange={(e) => setManualUrl(e.target.value)} className="w-full bg-slate-950 border border-white/5 rounded-[2rem] pl-16 pr-8 py-5 text-gold-main font-mono text-sm focus:border-gold-main transition-all outline-none" placeholder="https://secure-resource-path.mp3" />
                        </div>
                    </div>

                    <button onClick={handleManualDeployment} disabled={!manualTitle || (!manualUrl && !manualArtist) || isDeploying} className="w-full py-8 bg-gold-main text-slate-950 rounded-[2.5rem] font-black uppercase text-[14px] tracking-[0.5em] shadow-gold hover:shadow-[0_0_80px_rgba(181,148,78,0.4)] active:scale-[0.99] transition-all flex items-center justify-center gap-6">
                        {isDeploying ? <Loader2 className="animate-spin" size={24} /> : <><Activity size={24} fill="currentColor" /> Initialize Resonance Deck</>}
                    </button>
                </div>
            )}

            {/* Expanded Master Deck */}
            <div className="bg-slate-950 border border-white/5 rounded-[4rem] overflow-hidden shadow-3xl relative group/master">
                <div className="absolute inset-0 bg-tech-grid opacity-[0.02] pointer-events-none"></div>
                
                {/* Visual Header / Telemetry */}
                <div className="p-8 md:p-12 border-b border-white/5 flex justify-between items-center bg-white/[0.02] backdrop-blur-xl">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-white/20 group-hover/master:text-gold-main group-hover/master:border-gold-main/30 transition-all duration-700">
                            <BarChart3 size={24} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gold-main/60 uppercase tracking-[0.4em]">Signal Spectrum Analyzer</p>
                            <h4 className="text-sm font-black text-white uppercase tracking-widest mt-1">Live Acoustic Feedback</h4>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="hidden sm:flex flex-col items-end gap-1">
                            <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">Stability</span>
                            <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(i => <div key={i} className={`h-1 w-3 rounded-full ${i < 5 ? 'bg-green-500' : 'bg-green-500/20'} shadow-sm`}></div>)}
                            </div>
                        </div>
                        <div className="h-10 w-px bg-white/5"></div>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-mono font-bold text-white/40">NODE_0x{activeTrack.id.slice(-4)}</span>
                        </div>
                    </div>
                </div>

                {/* Primary Visualizer & Deck */}
                <div className="p-8 md:p-20 space-y-16 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        {/* Rotating Holographic Disc */}
                        <div className="lg:col-span-5 relative flex justify-center">
                            <div className="w-64 h-64 md:w-80 md:h-80 relative group/disc">
                                {/* Outer Rotating Glyphs */}
                                <div className={`absolute inset-[-30px] border border-dashed border-gold-main/10 rounded-full transition-all duration-[20s] linear infinite ${isPlaying ? 'animate-[spin_20s_linear_infinite]' : 'opacity-0'}`}></div>
                                <div className={`absolute inset-[-15px] border border-gold-main/20 rounded-full transition-all duration-[10s] linear infinite reverse ${isPlaying ? 'animate-[spin_10s_linear_infinite_reverse]' : 'opacity-0'}`}></div>
                                
                                <div className={`relative w-full h-full rounded-full border-[16px] border-slate-900 shadow-[0_0_80px_rgba(181,148,78,0.15)] overflow-hidden transition-all duration-1000 flex items-center justify-center ${isPlaying ? 'scale-110 rotate-12' : 'scale-95 grayscale'}`}>
                                    <div className={`absolute inset-0 bg-gold-gradient transition-transform duration-[4s] ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}></div>
                                    <div className="absolute inset-2 rounded-full bg-slate-950/40 backdrop-blur-[4px] flex items-center justify-center border border-white/5 shadow-inner">
                                        <div className="relative">
                                            {activeTrack.type === 'song' ? <Music size={80} className="text-white drop-shadow-3xl" /> : <Mic size={80} className="text-white drop-shadow-3xl" />}
                                            {isPlaying && (
                                                <div className="absolute -top-4 -right-4">
                                                    <Sparkles className="text-gold-main animate-bounce" size={24} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Scanline circle */}
                                    <div className="absolute inset-0 bg-scanline opacity-20 pointer-events-none animate-scanline"></div>
                                </div>
                            </div>
                        </div>

                        {/* Metadata & Deck Controls */}
                        <div className="lg:col-span-7 space-y-12">
                            <div className="space-y-6">
                                <div className="flex flex-wrap items-center gap-4">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] ${activeTrack.type === 'song' ? 'bg-gold-main/10 text-gold-main border border-gold-main/30' : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'}`}>{activeTrack.type === 'song' ? 'Acoustic Signature' : activeTrack.type === 'broadcast' ? 'Clinical Broadcast' : 'Sector Briefing'}</span>
                                    <div className={`flex items-center gap-3 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 ${isPlaying ? 'text-green-500' : 'text-white/20'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]' : 'bg-white/10'}`}></div>
                                        <span className="text-[10px] font-mono font-black tracking-widest">{isPlaying ? 'LINKED' : 'STANDBY'}</span>
                                    </div>
                                </div>
                                <h2 className="text-4xl md:text-7xl font-serif font-bold text-white tracking-tighter italic uppercase leading-[0.85]">{activeTrack.title}</h2>
                                <p className="text-xl md:text-3xl text-slate-400 font-light italic leading-relaxed opacity-60">Source Node: <span className="text-white">{activeTrack.artist}</span></p>
                            </div>

                            <div className="space-y-12">
                                <div className="flex items-center gap-10 md:gap-14">
                                    <button className="p-4 text-white/20 hover:text-white transition-all transform hover:scale-125 active:scale-95"><SkipBack size={48} /></button>
                                    <button onClick={() => playTrack(activeTrack)} className="w-24 h-24 md:w-32 md:h-32 rounded-[3rem] bg-gold-main text-slate-950 flex items-center justify-center shadow-gold hover:shadow-[0_0_100px_rgba(181,148,78,0.5)] hover:scale-110 active:scale-95 transition-all group overflow-hidden">
                                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1s]"></div>
                                        {isPlaying && activeTrack.id === currentTrackId ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" className="ml-2" />}
                                    </button>
                                    <button className="p-4 text-white/20 hover:text-white transition-all transform hover:scale-125 active:scale-95"><SkipForward size={48} /></button>
                                </div>

                                <div className="space-y-6">
                                    <canvas ref={canvasRef} className="w-full h-16 rounded-2xl bg-white/[0.02] border border-white/5" width={800} height={100} />
                                    <div className="flex justify-between items-center text-[11px] md:text-[13px] font-mono text-white/20 uppercase tracking-[0.5em] px-2">
                                        <div className="flex items-center gap-5">
                                            <span className="text-gold-main font-bold">DEEP_RESONANCE</span>
                                            <div className="h-1 w-1 rounded-full bg-gold-main/20"></div>
                                            <span>VECTOR_SYNC_V4</span>
                                        </div>
                                        <span className="text-gold-main font-bold">{activeTrack.duration}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub-Deck: Real-time Audio Journal / AI Generator */}
                <div className="p-10 md:p-16 border-t border-white/5 bg-white/[0.01] backdrop-blur-3xl relative overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center border-2 border-blue-500/30 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                                    <Brain size={32} />
                                </div>
                                <div className="text-left space-y-1">
                                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white italic tracking-tight uppercase">Neural Signature</h3>
                                    <p className="text-[10px] font-black text-blue-400/60 uppercase tracking-[0.4em]">Synthetic Lecture Architect</p>
                                </div>
                            </div>
                            <p className="text-lg text-slate-400 italic leading-relaxed font-light">Convert clinical topic vectors into permanent auditory briefings. The AI faculty will distill the physics for you.</p>
                        </div>

                        <div className="w-full max-w-lg mx-auto">
                            {!elevenLabsKey ? (
                                <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-6 group hover:bg-red-500/10 transition-all duration-700">
                                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500"><AlertCircle size={32} /></div>
                                    <div className="space-y-2">
                                        <p className="text-[11px] font-black text-red-500 uppercase tracking-[0.4em]">Auth Protocol Required</p>
                                        <p className="text-sm text-slate-500 italic max-w-[240px]">Uplink your ElevenLabs key in the Profile Matrix to activate neural synthesis.</p>
                                    </div>
                                    <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Configure Profile</button>
                                </div>
                            ) : isRecording ? (
                                <div className="p-8 bg-slate-900 border border-gold-main/30 rounded-[3rem] space-y-6 animate-pulse-soft relative overflow-hidden shadow-gold-dim">
                                    <div className="flex justify-between items-center relative z-10">
                                        <div className="flex items-center gap-4">
                                            <Loader2 className="w-5 h-5 text-gold-main animate-spin" />
                                            <span className="text-[10px] font-black text-gold-main uppercase tracking-[0.4em]">{generationStep}</span>
                                        </div>
                                        <span className="text-xl font-mono font-bold text-white italic">{recordingProgress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
                                        <div className="h-full bg-gold-main shadow-gold transition-all duration-500" style={{ width: `${recordingProgress}%` }}></div>
                                    </div>
                                    <div className="absolute inset-0 bg-shimmer opacity-5 animate-shimmer"></div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="relative group">
                                        <select 
                                            className="w-full bg-slate-900 border border-white/10 rounded-[2rem] pl-10 pr-12 py-6 text-lg text-white font-serif font-bold italic focus:border-gold-main/50 transition-all outline-none appearance-none cursor-pointer shadow-xl"
                                            onChange={(e) => generateNewLecture(e.target.value)}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select Target Sector...</option>
                                            {courseData.map(m => (
                                                <optgroup key={m.id} label={`SECTOR ${m.id.replace('m','')}`} className="bg-slate-950 text-white/20 uppercase text-[9px] font-black tracking-widest p-4">
                                                    {m.topics.map(t => <option key={t.id} value={t.title} className="bg-slate-900 text-white p-4 font-serif italic text-base uppercase">{t.title}</option>)}
                                                </optgroup>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-gold-main pointer-events-none group-hover:scale-125 transition-transform" />
                                    </div>
                                    <div className="flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-[0.5em] text-white/20">
                                        <Sparkles size={12} className="text-gold-main/40" />
                                        <span>Instant AI Distillation Protocol Active</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Sidebar: Schedule & Secondary Library */}
        <div className="lg:col-span-4 space-y-10">
            
            {/* Live Broadcast Schedule */}
            <div className="bg-slate-950/40 p-10 rounded-[3.5rem] border border-white/10 shadow-3xl space-y-10 relative overflow-hidden group/sched">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover/sched:opacity-10 transition-opacity"><Calendar size={120} /></div>
                <div className="flex items-center justify-between relative z-10 px-2">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-serif font-bold text-white italic uppercase tracking-tighter leading-none">Broadcasting</h3>
                        <p className="text-[10px] font-black text-gold-main/60 uppercase tracking-[0.4em]">Daily Sync Schedule</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-white/20"><Calendar size={20} /></div>
                </div>

                <div className="space-y-3 relative z-10">
                    {schedule.map((slot, i) => {
                        const isCurrent = i === 1; // Simulated highlight
                        return (
                            <div key={i} className={`p-6 rounded-2xl border transition-all duration-700 flex items-center gap-6 group/slot ${isCurrent ? 'bg-gold-main/10 border-gold-main/40 shadow-gold-dim scale-[1.02]' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}>
                                <div className="flex flex-col items-center gap-1 shrink-0">
                                    <span className={`text-lg font-serif font-bold italic leading-none ${isCurrent ? 'text-white' : 'text-white/20'}`}>{slot.time}</span>
                                    {isCurrent && <div className="w-1 h-1 rounded-full bg-gold-main animate-ping"></div>}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className={`text-sm font-bold tracking-tight transition-colors ${isCurrent ? 'text-white' : 'text-white/40 group-hover/slot:text-white/60'}`}>{slot.event}</p>
                                    <p className={`text-[8px] font-black uppercase tracking-[0.3em] ${isCurrent ? 'text-gold-main' : 'text-white/10'}`}>{slot.sector}</p>
                                </div>
                                {isCurrent ? (
                                    <div className="w-10 h-10 rounded-xl bg-gold-main text-slate-950 flex items-center justify-center shadow-gold animate-pulse"><Radio size={16} /></div>
                                ) : (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/5"></div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="pt-6 border-t border-white/5 text-center">
                    <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.5em]">Synchronizing with Local Station: ECHO_NODE_7</p>
                </div>
            </div>
            
            {/* Expanded Vault Library */}
            <div className="bg-slate-950/40 p-10 rounded-[3.5rem] border border-white/10 shadow-3xl flex flex-col h-[700px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none"><ListMusic size={140} /></div>
                
                <div className="space-y-8 mb-10 relative z-10 px-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-serif font-bold text-white italic tracking-tighter uppercase leading-none">Acoustic Vault</h3>
                        <Headphones className="text-gold-main/30" size={24} />
                    </div>
                    
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-gold-main transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Identify Signal Code..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="w-full bg-slate-950 border border-white/5 rounded-[1.5rem] pl-16 pr-8 py-5 text-sm text-white font-sans focus:outline-none focus:border-gold-main/40 transition-all placeholder:text-white/5" 
                        />
                    </div>

                    <div className="flex gap-1 p-1.5 bg-white/5 rounded-2xl border border-white/5">
                        {['all', 'songs', 'lectures', 'broadcasts'].map((tab) => (
                            <button 
                                key={tab} 
                                onClick={() => setActiveTab(tab as any)} 
                                className={`flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-gold-main text-slate-900 shadow-gold' : 'text-white/20 hover:text-white/40'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-3 relative z-10">
                    {filteredTracks.length > 0 ? filteredTracks.map((track, i) => (
                        <button 
                            key={track.id + i} 
                            onClick={() => playTrack(track)} 
                            className={`w-full p-5 rounded-[1.8rem] border transition-all duration-700 flex items-center gap-6 group/item relative overflow-hidden ${currentTrackId === track.id ? 'bg-gold-main text-slate-950 border-gold-main shadow-gold scale-[1.02]' : 'bg-white/[0.02] border-white/5 hover:border-gold-main/30 hover:bg-white/[0.05]'}`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all ${currentTrackId === track.id ? 'bg-slate-950/10' : 'bg-slate-900 border border-white/5 group-hover/item:border-gold-main/40'}`}>
                                {currentTrackId === track.id && isPlaying ? (
                                    <div className="flex gap-1 items-end h-5">
                                        <div className="w-1.5 bg-current rounded-full animate-resonance-pulse-1"></div>
                                        <div className="w-1.5 bg-current rounded-full animate-resonance-pulse-2"></div>
                                        <div className="w-1.5 bg-current rounded-full animate-resonance-pulse-3"></div>
                                    </div>
                                ) : track.type === 'song' ? <Music size={24} /> : track.type === 'broadcast' ? <Radio size={24} /> : <Mic2 size={24} />}
                            </div>
                            <div className="flex-1 min-w-0 text-left space-y-1">
                                <p className={`text-base font-serif font-bold truncate leading-tight ${currentTrackId === track.id ? 'text-slate-950' : 'text-white'}`}>{track.title}</p>
                                <div className="flex items-center gap-3">
                                    <p className={`text-[9px] font-black uppercase tracking-widest truncate ${currentTrackId === track.id ? 'text-slate-950/40' : 'text-white/20'}`}>{track.artist}</p>
                                    <div className={`h-1 w-1 rounded-full ${currentTrackId === track.id ? 'bg-slate-950/20' : 'bg-white/5'}`}></div>
                                    <p className={`text-[9px] font-mono ${currentTrackId === track.id ? 'text-slate-950/40' : 'text-white/20'}`}>{track.duration}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {currentTrackId === track.id ? <PlayCircle size={20} className="text-slate-950/40" /> : <ChevronRight size={20} className="text-white/5 group-hover/item:text-gold-main transition-colors" />}
                            </div>
                        </button>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 opacity-10">
                            <ZapOff size={64} />
                            <p className="text-xs font-black uppercase tracking-[0.5em]">Sector Empty</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      <style>{`
        @keyframes resonance-1 { 0%, 100% { height: 8px; opacity: 0.4; } 50% { height: 32px; opacity: 1; } }
        @keyframes resonance-2 { 0%, 100% { height: 24px; opacity: 0.8; } 50% { height: 12px; opacity: 0.4; } }
        @keyframes resonance-3 { 0%, 100% { height: 14px; opacity: 0.6; } 50% { height: 28px; opacity: 1; } }
        .animate-resonance-pulse-1 { animation: resonance-1 0.8s ease-in-out infinite; }
        .animate-resonance-pulse-2 { animation: resonance-2 1.2s ease-in-out infinite; }
        .animate-resonance-pulse-3 { animation: resonance-3 1.0s ease-in-out infinite; }
        
        @keyframes radar-sweep {
            from { transform: translateX(-100%) skewX(-20deg); }
            to { transform: translateX(100%) skewX(-20deg); }
        }
        .animate-radar-sweep {
            animation: radar-sweep 8s linear infinite;
        }

        .bg-scanline {
          background: linear-gradient(to bottom, transparent 0%, rgba(181, 148, 78, 0.2) 50%, transparent 100%);
          background-size: 100% 4px;
        }
      `}</style>
    </div>
  );
};

export default PodcastStudio;