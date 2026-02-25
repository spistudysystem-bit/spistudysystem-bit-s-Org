import React, { useState, useEffect } from 'react';
import { X, Upload, RotateCcw, Image as ImageIcon, Video, Save, Check, Shield, Search, LayoutGrid, Type, FileText, Music, Plus, Trash2, ShoppingBag, DollarSign, Zap, ShieldCheck, Sparkles, TrendingUp, Heart, Trophy, Brain, Mic, Globe, Link as LinkIcon, Bot, Loader2 } from 'lucide-react';
import { courseData } from '../data/courseContent';

interface AdminStudioProps {
    isOpen: boolean;
    onClose: () => void;
}

export type AdminOverride = {
    value: string;
    type: 'image' | 'video' | 'text' | 'audio' | 'shop-item' | 'topic-media';
    label?: string;
    metadata?: any;
};

const AdminStudio: React.FC<AdminStudioProps> = ({ isOpen, onClose }) => {
    const [overrides, setOverrides] = useState<Record<string, AdminOverride>>(() => {
        try {
            const saved = localStorage.getItem('spi-admin-overrides');
            return saved ? JSON.parse(saved) : {};
        } catch(e) { return {}; }
    });
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [activeTab, setActiveTab] = useState<'branding' | 'classroom' | 'radio' | 'shop'>('branding');

    const handleUpdate = (id: string, value: string, type: any, label?: string, metadata?: any) => {
        setOverrides(prev => ({
            ...prev,
            [id]: { value, type, label, metadata }
        }));
    };

    const handleReset = (id: string) => {
        setOverrides(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    const saveSettings = () => {
        setSaveStatus('saving');
        localStorage.setItem('spi-admin-overrides', JSON.stringify(overrides));
        setTimeout(() => {
            setSaveStatus('saved');
            setTimeout(() => {
                window.location.reload();
            }, 800);
        }, 1200);
    };

    const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'audio') => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        if (file.size > 2 * 1024 * 1024) {
            alert("File is quite large. Local storage has strict limits (~5MB). URLs recommended.");
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            const current = overrides[id] || { value: '', type };
            handleUpdate(id, result, type, current.label, current.metadata);
        };
        reader.readAsDataURL(file);
    };

    const addRadioTrack = () => {
        const id = `radio-track-${Date.now()}`;
        handleUpdate(id, '', 'audio', 'New Acoustic Node', { artist: 'Academy Podcast', type: 'podcast' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-2xl animate-fade-in font-sans">
            <div className="w-full max-w-6xl h-[92vh] bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden relative border-t-gold-main/20">
                
                {/* Header */}
                <div className="px-8 py-8 md:px-12 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/[0.02]">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-gold-main/10 rounded-2xl flex items-center justify-center border border-gold-main/30 shadow-gold">
                            <Bot className="w-7 h-7 text-gold-main" />
                        </div>
                        <div className="text-left text-white">
                            <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight">Admin Master Control</h2>
                            <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.4em]">Environment & Asset Overrides</p>
                        </div>
                    </div>
                    
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                        {[
                            { id: 'branding', label: 'Branding', icon: Sparkles },
                            { id: 'classroom', label: 'Classroom', icon: FileText },
                            { id: 'radio', label: 'Radio', icon: Mic },
                            { id: 'shop', label: 'Shop', icon: ShoppingBag }
                        ].map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-gold-main text-slate-900 shadow-gold' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                            >
                                <tab.icon size={14} />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-all border border-white/5 group">
                        <X className="w-6 h-6 text-white/40 group-hover:text-white transition-all" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto px-8 md:px-12 py-10 space-y-16 custom-scrollbar text-left bg-radial-glow">
                    
                    {activeTab === 'branding' && (
                        <div className="space-y-12 animate-fade-in">
                            <section>
                                <AdminSectionHeader icon={Type} title="Platform Copy" />
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <AdminInput label="Hero Main Title" id="hero-title" current={overrides['hero-title']} onUpdate={handleUpdate} onReset={handleReset} type="text" />
                                    <AdminInput label="Hero Subtitle" id="hero-subtitle" current={overrides['hero-subtitle']} onUpdate={handleUpdate} onReset={handleReset} type="text" />
                                </div>
                            </section>
                            <section>
                                <AdminSectionHeader icon={ImageIcon} title="Identity Assets" />
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <AdminInput 
                                        label="Platform Logo (Square)" 
                                        id="global-logo" 
                                        current={overrides['global-logo']} 
                                        onUpdate={handleUpdate} 
                                        onReset={handleReset} 
                                        type="image"
                                        onFile={(e:any) => handleFileUpload('global-logo', e, 'image')}
                                    />
                                    <AdminInput 
                                        label="Primary Hero Illustration" 
                                        id="global-hero" 
                                        current={overrides['global-hero']} 
                                        onUpdate={handleUpdate} 
                                        onReset={handleReset} 
                                        type="image"
                                        onFile={(e:any) => handleFileUpload('global-hero', e, 'image')}
                                    />
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'classroom' && (
                        <div className="space-y-12 animate-fade-in">
                            <section>
                                <AdminSectionHeader icon={FileText} title="Lesson Media Swapping" />
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {courseData.flatMap(m => m.topics).map(topic => (
                                        <AdminInput 
                                            key={topic.id}
                                            label={topic.title} 
                                            id={`topic-media-${topic.id}`} 
                                            current={overrides[`topic-media-${topic.id}`]} 
                                            onUpdate={handleUpdate} 
                                            onReset={handleReset} 
                                            type="image"
                                            onFile={(e:any) => handleFileUpload(`topic-media-${topic.id}`, e, 'image')}
                                            allowVideo
                                        />
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'radio' && (
                        <div className="space-y-12 animate-fade-in">
                            <section>
                                <AdminSectionHeader icon={Mic} title="Acoustic Node Management" />
                                <div className="grid grid-cols-1 gap-6">
                                    {Object.keys(overrides).filter(k => k.startsWith('radio-track-')).map(id => {
                                        const track = overrides[id];
                                        return (
                                            <div key={id} className="p-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem] space-y-6 group hover:border-gold-main/20 transition-all">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-6 flex-1 mr-8">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div className="space-y-2">
                                                                <label className="text-[9px] font-black text-gold-main uppercase tracking-widest">Track Title</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={track.label || ''}
                                                                    onChange={(e) => handleUpdate(id, track.value, 'audio', e.target.value, track.metadata)}
                                                                    className="w-full bg-slate-950/40 border border-white/10 rounded-2xl px-6 py-3.5 text-sm text-white font-serif font-bold focus:border-gold-main/40 transition-all"
                                                                    placeholder="e.g. Frequency Deep Dive"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-[9px] font-black text-gold-main uppercase tracking-widest">Artist / Host</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={track.metadata?.artist || ''}
                                                                    onChange={(e) => handleUpdate(id, track.value, 'audio', track.label, { ...track.metadata, artist: e.target.value })}
                                                                    className="w-full bg-slate-950/40 border border-white/10 rounded-2xl px-6 py-3.5 text-sm text-white focus:border-gold-main/40 transition-all"
                                                                    placeholder="e.g. Professor Harvey"
                                                                />
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="space-y-3">
                                                            <label className="text-[9px] font-black text-gold-main uppercase tracking-widest">Audio Source</label>
                                                            <div className="flex flex-col md:flex-row gap-4">
                                                                <div className="relative flex-1">
                                                                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                                                    <input 
                                                                        type="text" 
                                                                        value={track.value?.startsWith('data:') ? 'Local File Uploaded' : (track.value || '')}
                                                                        onChange={(e) => !track.value?.startsWith?.('data:') && handleUpdate(id, e.target.value, 'audio', track.label, track.metadata)}
                                                                        readOnly={track.value?.startsWith?.('data:')}
                                                                        className={`w-full bg-slate-950/40 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-[11px] text-white/60 font-mono focus:border-gold-main/40 transition-all ${track.value?.startsWith?.('data:') ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                        placeholder="Paste external .mp3 URL..."
                                                                    />
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <label className="cursor-pointer bg-gold-main/10 border border-gold-main/20 hover:bg-gold-main/20 px-8 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-gold-main transition-all shrink-0">
                                                                        <Upload size={16} /> 
                                                                        <span>{track.value?.startsWith?.('data:') ? 'Swap Upload' : 'Upload MP3'}</span>
                                                                        <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleFileUpload(id, e, 'audio')} />
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => handleReset(id)} className="p-3 text-red-400/40 hover:text-red-400 transition-colors bg-red-500/5 rounded-2xl border border-red-500/10"><Trash2 size={20} /></button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <button 
                                    onClick={addRadioTrack}
                                    className="flex items-center justify-center gap-4 px-10 py-6 rounded-[2.5rem] border-2 border-dashed border-white/10 text-white/40 hover:text-gold-main hover:border-gold-main/40 transition-all w-full bg-white/[0.01] group"
                                >
                                    <Plus size={20} className="group-hover:rotate-90 transition-transform" /> 
                                    <span className="text-[11px] font-black uppercase tracking-[0.4em]">Deploy New Radio Node</span>
                                </button>
                            </section>
                        </div>
                    )}
                </div>

                {/* Footer Sync */}
                <div className="px-8 py-8 border-t border-white/5 bg-slate-950/80 flex flex-col sm:flex-row justify-between items-center gap-6 backdrop-blur-xl">
                    {saveStatus === 'saving' && (
                        <div className="flex-1 flex items-center gap-6 px-4 py-2 bg-gold-main/5 border border-gold-main/20 rounded-2xl animate-fade-in">
                            <Loader2 className="w-5 h-5 text-gold-main animate-spin" />
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-black text-gold-main uppercase tracking-widest">Synchronizing Acoustic Overrides...</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-gold-main animate-shimmer w-full bg-[length:200%_100%]"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center gap-6 w-full sm:w-auto">
                        <button onClick={onClose} className="flex-1 sm:flex-none px-8 py-4 text-[10px] font-black text-white/40 hover:text-white transition-colors uppercase tracking-[0.2em]">Discard</button>
                        <button 
                            onClick={saveSettings}
                            disabled={saveStatus !== 'idle'}
                            className={`flex-1 sm:flex-none px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-500 ${
                                saveStatus === 'saved' ? 'bg-green-600 text-white shadow-lg' : 'bg-gold-main text-slate-900 shadow-gold hover:translate-y-[-2px]'
                            }`}
                        >
                            {saveStatus === 'saving' ? <RotateCcw className="w-5 h-5 animate-spin" /> : saveStatus === 'saved' ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                            {saveStatus === 'saving' ? 'SYNCING...' : saveStatus === 'saved' ? 'SYNCED' : 'SYNC RESONANCE'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminSectionHeader = ({ icon: Icon, title }: any) => (
    <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gold-main/5 border border-gold-main/20 flex items-center justify-center">
            <Icon className="text-gold-main" size={24} />
        </div>
        <h3 className="text-2xl font-serif font-bold text-white tracking-tight italic">{title}</h3>
        <div className="h-px flex-1 bg-white/5"></div>
    </div>
);

const AdminInput = ({ label, id, current, onUpdate, onReset, onFile, allowVideo, type }: any) => {
    const [val, setVal] = useState(current?.value || '');
    const isVideo = current?.type === 'video' || val.startsWith?.('data:video');
    
    return (
        <div className="p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] flex flex-col justify-between group hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-6">
                <div className="text-left">
                    <label className="text-[11px] font-black text-white uppercase tracking-widest block mb-1">{label}</label>
                    <span className="text-[9px] text-white/20 uppercase font-black tracking-widest">ID: {id}</span>
                </div>
                {current && (
                    <button onClick={() => { onReset(id); setVal(''); }} className="text-[9px] text-red-400 hover:text-red-300 font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/10">
                        <RotateCcw size={10} /> Reset
                    </button>
                )}
            </div>
            
            {type === 'text' ? (
                <div className="relative">
                    <textarea 
                        value={val}
                        onChange={(e) => { setVal(e.target.value); onUpdate(id, e.target.value, 'text'); }}
                        className="w-full bg-slate-950/40 border border-white/10 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-gold-main/40 transition-all font-sans min-h-[120px] resize-none italic leading-relaxed"
                        placeholder="Enter custom text content..."
                    />
                </div>
            ) : (
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                        <div className="relative group">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-gold-main transition-colors" />
                            <input 
                                type="text" 
                                value={val?.startsWith?.('data:') ? 'Local File Uploaded' : (val || '')}
                                onChange={(e) => { setVal(e.target.value); onUpdate(id, e.target.value, 'image'); }}
                                readOnly={val?.startsWith?.('data:')}
                                placeholder="External Asset URL..."
                                className={`w-full bg-slate-950/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-xs text-white/80 focus:outline-none focus:border-gold-main/40 transition-all font-mono ${val?.startsWith?.('data:') ? 'opacity-50' : ''}`}
                            />
                        </div>
                        <div className="flex gap-3">
                            <label className="flex-1 cursor-pointer bg-white/5 border border-white/5 hover:bg-white/10 px-4 py-3 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 transition-all">
                                <ImageIcon size={14} className="text-gold-main" /> {val?.startsWith?.('data:') ? 'Swap Image' : 'Upload Image'}
                                <input type="file" accept="image/*" className="hidden" onChange={onFile} />
                            </label>
                        </div>
                    </div>
                    <div className="w-32 h-32 bg-slate-950 rounded-[1.8rem] border border-white/10 overflow-hidden flex items-center justify-center relative group shrink-0 shadow-inner">
                        {current?.value && current.value !== "" ? (
                            isVideo ? (
                                <video src={current.value} className="w-full h-full object-cover" muted autoPlay loop />
                            ) : (
                                <img src={current.value} className="w-full h-full object-cover" alt="Preview" />
                            )
                        ) : (
                            <ImageIcon className="w-8 h-8 text-white/5" />
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Asset Preview</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStudio;