import React, { useState, useMemo } from 'react';
import { 
  User, Shield, Trophy, Zap, Coins, 
  Flame, Camera, Save, RotateCcw, 
  Settings, Key, Mic2, Bot, Check,
  UserCircle, Heart, Award, Star,
  AlertTriangle, Trash2, Brain, Activity, ShieldCheck,
  Volume2, VolumeX, Eye, EyeOff, Target, Gauge, MousePointer2,
  Sliders, Info, Rocket, Loader2
} from 'lucide-react';
import { GamificationState } from './CourseViewer';

interface UserProfileProps {
  game: GamificationState;
  setGame: React.Dispatch<React.SetStateAction<GamificationState>>;
  onPlayCorrect?: () => void;
  onPlayClick?: () => void;
}

const AVATARS = [
  { id: 'av-1', icon: UserCircle, label: 'Standard' },
  { id: 'av-2', icon: Bot, label: 'Synthetic' },
  { id: 'av-3', icon: Shield, label: 'Protector' },
  { id: 'av-4', icon: Heart, label: 'Healer' },
  { id: 'av-5', icon: Star, label: 'Master' },
  { id: 'av-6', icon: Zap, label: 'Flash' },
];

const VOICES = [
  { id: 'Yko7iBn2vnSMvSAsuF8N', name: 'Burt', desc: 'Paternal & Wise' },
  { id: 'Lcf7ee35bPms8p653653', name: 'River', desc: 'Calm & Direct' },
  { id: 'EXAV8jWqayQ9N6P9GIn5', name: 'Bella', desc: 'Methodical & Soft' },
];

const UserProfile: React.FC<UserProfileProps> = ({ game, setGame, onPlayCorrect, onPlayClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    userName: game.userName,
    userRole: game.userRole,
    elevenLabsKey: game.elevenLabsKey,
    avatarId: game.avatarId,
    voiceId: game.voiceId,
    sonicUXEnabled: game.sonicUXEnabled,
    visualRipplesEnabled: game.visualRipplesEnabled,
    dailyXpGoal: game.dailyXpGoal,
    sfxVolume: game.sfxVolume
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setGame((prev) => ({
        ...prev,
        ...formData
      }));
      setSaveStatus('saved');
      setIsEditing(false);
      if (formData.sonicUXEnabled) {
        onPlayCorrect?.();
      } else {
        onPlayClick?.();
      }
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1200);
  };

  const handleResetProgress = () => {
    if (window.confirm("CRITICAL PROTOCOL: This will reset all XP, Credits, and Topic Progress. Proceed?")) {
      localStorage.removeItem('spi-viewer-state-completed-ids');
      window.location.reload();
    }
  };

  const diagnosticAccuracy = useMemo(() => {
    if (!game.totalQuestionsAttempted) return 0;
    return Math.round((game.correctAnswersCount / game.totalQuestionsAttempted) * 100);
  }, [game.totalQuestionsAttempted, game.correctAnswersCount]);

  const ActiveAvatar = AVATARS.find(a => a.id === formData.avatarId)?.icon || UserCircle;

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in text-left pb-40 px-4 md:px-10 py-10">
      
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-white/5 pb-12">
        <div className="space-y-6 text-white overflow-hidden flex-1">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gold-main/10 rounded-lg border border-gold-main/20"><User size={14} className="text-gold-main animate-pulse" /></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Clinical Identity Matrix</span>
            </div>
            <div className="space-y-2">
                <h1 className="text-[clamp(2rem,8vw,5.5rem)] font-serif font-bold tracking-tighter leading-[0.8] italic uppercase">Specialist <span className="text-gold-main not-italic">Profile</span></h1>
                <p className="text-slate-400 text-sm md:text-xl font-light max-w-2xl italic leading-relaxed border-l-2 border-gold-main/20 pl-6 py-1">
                    Manage your clinical credentials, analyze performance vectors, and calibrate your interface preferences for optimal resonance.
                </p>
            </div>
        </div>
        
        <div className="flex gap-4 w-full lg:w-auto">
            <button 
              onClick={() => { onPlayClick?.(); setIsEditing(!isEditing); }}
              className={`px-10 py-6 rounded-[2rem] font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-3 border ${isEditing ? 'bg-white text-slate-950 border-white' : 'bg-gold-main text-slate-950 shadow-gold hover:shadow-soft active:scale-95'}`}
            >
              {isEditing ? <RotateCcw size={16} /> : <Settings size={16} />}
              <span>{isEditing ? 'Cancel Sync' : 'Edit Credentials'}</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Profile Card & Performance Stats */}
        <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-950/40 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-10 flex flex-col items-center text-center space-y-8 shadow-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(181,148,78,0.05)_0%,transparent_70%)]"></div>
                
                <div className="relative">
                    <div className="absolute inset-0 bg-gold-main/20 blur-2xl rounded-full animate-pulse"></div>
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-900 border-4 border-gold-main/40 rounded-[3rem] flex items-center justify-center relative z-10 shadow-gold group-hover:scale-105 transition-transform duration-700">
                        <ActiveAvatar size={64} className="text-gold-main" />
                        {isEditing && (
                          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gold-main rounded-2xl flex items-center justify-center text-slate-950 shadow-gold cursor-pointer hover:scale-110 transition-all">
                             <Camera size={18} />
                          </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2 relative z-10">
                    <h3 className="text-3xl font-serif font-bold text-white italic tracking-tight">{game.userName}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-main/60">{game.userRole}</p>
                </div>

                <div className="w-full pt-8 border-t border-white/5 grid grid-cols-2 gap-4 relative z-10">
                    <div className="p-4 bg-white/5 rounded-2xl space-y-1 group/stat hover:bg-white/10 transition-colors">
                        <span className="text-[8px] font-black uppercase text-white/20 tracking-widest block">Sector Level</span>
                        <span className="text-xl font-serif font-bold text-white italic">{game.level}</span>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl space-y-1 group/stat hover:bg-white/10 transition-colors">
                        <span className="text-[8px] font-black uppercase text-white/20 tracking-widest block">Sync XP</span>
                        <span className="text-xl font-serif font-bold text-white italic">{game.xp}</span>
                    </div>
                </div>

                {/* Performance Vectors */}
                <div className="w-full space-y-6 pt-4 relative z-10 text-left border-t border-white/5 mt-4">
                    <div className="flex items-center gap-3 text-gold-main/60 mb-2">
                        <Gauge size={14} />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">Performance Indices</span>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/40 px-1">
                                <span>Diagnostic Accuracy</span>
                                <span className={diagnosticAccuracy >= 70 ? 'text-green-400' : 'text-red-400'}>{diagnosticAccuracy}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-1000 ${diagnosticAccuracy >= 70 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${diagnosticAccuracy}%` }}></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/40 px-1">
                                <span>Daily Resilience Target</span>
                                <span className="text-gold-main">{Math.min(100, Math.round((game.xp % 1000) / (formData.dailyXpGoal / 10)))}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gold-main shadow-gold animate-pulse" style={{ width: `${Math.min(100, Math.round((game.xp % 1000) / (formData.dailyXpGoal / 10)))}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] space-y-6 group">
                <div className="flex items-center gap-3 text-red-500">
                    <AlertTriangle size={18} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Danger Zone</span>
                </div>
                <p className="text-xs text-slate-400 italic leading-relaxed opacity-60">
                    Purging acoustic memory is permanent. All sector synchronization data and credentials will be lost.
                </p>
                <button 
                  onClick={handleResetProgress}
                  className="w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  <Trash2 size={14} /> Purge Resonance Data
                </button>
            </div>
        </div>

        {/* Edit Forms & Preferences */}
        <div className="lg:col-span-8 space-y-10">
            <div className={`p-8 md:p-14 bg-slate-900/60 border border-white/10 rounded-[4rem] shadow-3xl space-y-12 transition-all duration-1000 ${!isEditing ? 'opacity-50 pointer-events-none grayscale-[0.5]' : 'opacity-100'}`}>
                
                {/* Identity Config */}
                <section className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gold-main/10 flex items-center justify-center border border-gold-main/20">
                            <UserCircle className="text-gold-main" size={24} />
                        </div>
                        <h4 className="text-2xl font-serif font-bold text-white italic tracking-tight">Credentials Config</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Specialist Designation</label>
                            <input 
                              type="text" 
                              value={formData.userName}
                              onChange={(e) => setFormData(p => ({ ...p, userName: e.target.value }))}
                              className="w-full bg-slate-950/60 border border-white/10 rounded-2xl px-6 py-4 text-white font-serif italic text-lg focus:border-gold-main/40 transition-all outline-none"
                              placeholder="Enter Name"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Professional Role</label>
                            <select 
                                value={formData.userRole}
                                onChange={(e) => setFormData(p => ({ ...p, userRole: e.target.value }))}
                                className="w-full bg-slate-950/60 border border-white/10 rounded-2xl px-6 py-4 text-white font-serif italic text-lg focus:border-gold-main/40 transition-all outline-none appearance-none"
                            >
                                <option value="Sonography Student">Sonography Student</option>
                                <option value="Certified RDMS">Certified RDMS</option>
                                <option value="Physics Enthusiast">Physics Enthusiast</option>
                                <option value="Faculty Member">Faculty Member</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Avatar Vector</label>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                            {AVATARS.map((av) => (
                                <button 
                                    key={av.id}
                                    onClick={() => setFormData(p => ({ ...p, avatarId: av.id }))}
                                    className={`aspect-square rounded-3xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-500 ${formData.avatarId === av.id ? 'bg-gold-main/20 border-gold-main text-gold-main shadow-gold' : 'bg-white/5 border-white/10 text-white/20 hover:border-white/30 hover:text-white'}`}
                                >
                                    <av.icon size={24} />
                                    <span className="text-[7px] font-black uppercase tracking-widest">{av.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* System Calibration */}
                <section className="space-y-8 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                            <Sliders className="text-purple-400" size={24} />
                        </div>
                        <h4 className="text-2xl font-serif font-bold text-white italic tracking-tight">System Calibration</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-6 bg-slate-950/60 border border-white/10 rounded-2xl group transition-all hover:border-gold-main/20">
                                <div className="flex items-center gap-4">
                                    <Volume2 className={`w-5 h-5 ${formData.sonicUXEnabled ? 'text-gold-main' : 'text-white/20'}`} />
                                    <div className="text-left">
                                        <p className="text-[11px] font-black text-white uppercase tracking-widest">Sonic UX Engine</p>
                                        <p className="text-[8px] text-white/40 uppercase tracking-widest">Interactive bubble & ping sounds</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setFormData(p => ({ ...p, sonicUXEnabled: !p.sonicUXEnabled }))}
                                    className={`w-12 h-6 rounded-full relative transition-all duration-500 ${formData.sonicUXEnabled ? 'bg-gold-main' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-slate-950 rounded-full transition-all duration-500 ${formData.sonicUXEnabled ? 'left-7' : 'left-1'}`}></div>
                                </button>
                            </div>

                            <div className="flex flex-col gap-4 p-6 bg-slate-950/60 border border-white/10 rounded-2xl group transition-all hover:border-gold-main/20">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Volume2 className={`w-5 h-5 text-gold-main`} />
                                        <div className="text-left">
                                            <p className="text-[11px] font-black text-white uppercase tracking-widest">SFX & Narration Volume</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-mono font-bold text-gold-main">{Math.round(formData.sfxVolume * 100)}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" max="1" step="0.01" 
                                    value={formData.sfxVolume}
                                    onChange={(e) => setFormData(p => ({ ...p, sfxVolume: parseFloat(e.target.value) }))}
                                    className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-gold-main"
                                />
                            </div>

                            <div className="flex items-center justify-between p-6 bg-slate-950/60 border border-white/10 rounded-2xl group transition-all hover:border-gold-main/20">
                                <div className="flex items-center gap-4">
                                    <MousePointer2 className={`w-5 h-5 ${formData.visualRipplesEnabled ? 'text-gold-main' : 'text-white/20'}`} />
                                    <div className="text-left">
                                        <p className="text-[11px] font-black text-white uppercase tracking-widest">Acoustic Ripples</p>
                                        <p className="text-[8px] text-white/40 uppercase tracking-widest">Click response visual effects</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setFormData(p => ({ ...p, visualRipplesEnabled: !p.visualRipplesEnabled }))}
                                    className={`w-12 h-6 rounded-full relative transition-all duration-500 ${formData.visualRipplesEnabled ? 'bg-gold-main' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-slate-950 rounded-full transition-all duration-500 ${formData.visualRipplesEnabled ? 'left-7' : 'left-1'}`}></div>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                             <div className="p-6 bg-slate-950/60 border border-white/10 rounded-2xl space-y-4">
                                <div className="flex items-center gap-3">
                                    <Rocket size={14} className="text-gold-main" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Daily XP Resonance Goal</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="100" max="2000" step="100" 
                                    value={formData.dailyXpGoal}
                                    onChange={(e) => setFormData(p => ({ ...p, dailyXpGoal: parseInt(e.target.value) }))}
                                    className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-gold-main"
                                />
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Intensity: Low</span>
                                    <span className="text-sm font-mono font-bold text-gold-main">{formData.dailyXpGoal} XP</span>
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Elite</span>
                                </div>
                             </div>
                        </div>
                    </div>
                </section>

                {/* Faculty Link */}
                <section className="space-y-8 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <Mic2 className="text-blue-400" size={24} />
                        </div>
                        <h4 className="text-2xl font-serif font-bold text-white italic tracking-tight">Faculty Link Matrix</h4>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Faculty Neural Link (ElevenLabs API)</label>
                            <div className="relative group">
                                <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                <input 
                                    type="password" 
                                    value={formData.elevenLabsKey}
                                    onChange={(e) => setFormData(p => ({ ...p, elevenLabsKey: e.target.value }))}
                                    className="w-full bg-slate-950/60 border border-white/10 rounded-2xl pl-16 pr-6 py-4 text-gold-main font-mono text-xs focus:border-gold-main transition-all outline-none"
                                    placeholder="sk_..."
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] ml-2">Faculty Vocal Profile</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {VOICES.map((v) => (
                                    <button 
                                        key={v.id}
                                        onClick={() => setFormData(p => ({ ...p, voiceId: v.id }))}
                                        className={`p-6 rounded-3xl border-2 text-left transition-all duration-500 space-y-2 relative overflow-hidden ${formData.voiceId === v.id ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className={`text-sm font-serif font-bold italic ${formData.voiceId === v.id ? 'text-white' : 'text-white/60'}`}>{v.name}</span>
                                            {formData.voiceId === v.id && <Check size={14} className="text-blue-400" />}
                                        </div>
                                        <p className="text-[8px] font-black uppercase tracking-widest text-white/30">{v.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="pt-8">
                  {saveStatus === 'saving' && (
                    <div className="mb-6 p-4 bg-gold-main/5 border border-gold-main/20 rounded-2xl animate-fade-in">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[9px] font-black text-gold-main uppercase tracking-widest">Synchronizing Specialist ID...</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gold-main animate-shimmer w-full bg-[length:200%_100%]"></div>
                        </div>
                    </div>
                  )}
                  <button 
                    onClick={handleSave}
                    disabled={saveStatus !== 'idle'}
                    className={`w-full py-6 rounded-[2rem] font-black uppercase text-[12px] tracking-[0.4em] transition-all flex items-center justify-center gap-4 ${
                      saveStatus === 'saved' ? 'bg-green-500 text-white shadow-lg' : 'bg-gold-main text-slate-950 shadow-gold hover:shadow-soft active:scale-95'
                    }`}
                  >
                    {saveStatus === 'saving' ? <Loader2 size={20} className="animate-spin" /> : saveStatus === 'saved' ? <Check size={20} /> : <><Save size={20} /> Sync Identity Matrix</>}
                  </button>
                </div>
            </div>

            {/* Badges / Achievements Preview */}
            <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[4rem] space-y-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000"><Award size={180} /></div>
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gold-main/10 rounded-2xl flex items-center justify-center border border-gold-main/30 text-gold-main shadow-gold transition-transform group-hover:scale-110">
                        <Award size={28} />
                    </div>
                    <div className="text-left">
                        <h4 className="text-2xl font-serif font-bold text-white italic">Clinical Commendations</h4>
                        <p className="text-[9px] font-black text-gold-main/60 uppercase tracking-[0.4em] mt-1">Unlocked Board Achievements</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative z-10">
                    {[
                      { id: 'pioneer_badge', label: 'Pioneer', icon: Trophy, desc: 'Classroom access initialized' },
                      { id: 'physics_master', label: 'Physics Master', icon: Brain, desc: 'Fundamental sectors synced' },
                      { id: 'doppler_sync', label: 'Doppler Pro', icon: Activity, desc: 'High-velocity flow mastery' },
                      { id: 'alara_knight', label: 'ALARA Knight', icon: ShieldCheck, desc: 'Peak safety protocols established' }
                    ].map((badge) => {
                        const isUnlocked = game.badges.includes(badge.id);
                        return (
                          <div key={badge.id} className={`p-6 rounded-3xl border flex flex-col items-center gap-4 transition-all duration-700 group/badge ${isUnlocked ? 'bg-gold-main/5 border-gold-main/30' : 'bg-white/5 border-white/5 opacity-20'}`}>
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isUnlocked ? 'bg-gold-main text-slate-950 shadow-gold group-hover/badge:scale-110' : 'bg-slate-900 text-white/20'}`}>
                                  <badge.icon size={24} />
                              </div>
                              <div className="text-center space-y-1">
                                <span className="text-[8px] font-black uppercase tracking-widest block text-white">{badge.label}</span>
                                {isUnlocked && <span className="text-[7px] text-white/40 italic block leading-tight">{badge.desc}</span>}
                              </div>
                          </div>
                        );
                    })}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;