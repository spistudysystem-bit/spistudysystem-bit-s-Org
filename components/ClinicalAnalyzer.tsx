import React, { useState, useRef } from 'react';
import { 
    Upload, Camera, Image as ImageIcon, Zap, 
    Bot, Loader2, Search, Brain, Activity, 
    ShieldCheck, AlertCircle, Sparkles, X,
    FileText, Microscope, Scan
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface ClinicalAnalyzerProps {
    onPlayCorrect?: () => void;
    onPlayClick?: () => void;
}

const ClinicalAnalyzer: React.FC<ClinicalAnalyzerProps> = ({ onPlayCorrect, onPlayClick }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setSelectedImage(event.target?.result as string);
            setAnalysis(null);
            setError(null);
        };
        reader.readAsDataURL(file);
    };

    const runAnalysis = async () => {
        if (!selectedImage || isAnalyzing) return;
        setIsAnalyzing(true);
        setError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const base64Data = selectedImage.split(',')[1];
            
            const prompt = `You are Professor Harvey, an expert in ultrasound physics and clinical sonography.
            Analyze this ultrasound image for educational purposes. 
            Identify:
            1. Any visible artifacts (e.g. shadowing, enhancement, reverberation, aliasing).
            2. The physics principles being demonstrated (e.g. attenuation, Doppler shift).
            3. Tactical advice for the sonographer to optimize this image.
            
            Tone: Professional, wise, paternal. Limit response to 120 words.`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: {
                    parts: [
                        { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
                        { text: prompt }
                    ]
                }
            });

            setAnalysis(response.text || "I've processed the acoustic data, but the signal is unclear. Try a higher quality scan.");
            onPlayCorrect?.();
        } catch (err) {
            console.error(err);
            setError("Resonance failure. Check your uplink or signal quality.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const reset = () => {
        setSelectedImage(null);
        setAnalysis(null);
        setError(null);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-fade-in text-left pb-40 px-4 md:px-10 py-10">
            
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-white/5 pb-12">
                <div className="space-y-6 text-white overflow-hidden flex-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gold-main/10 rounded-lg border border-gold-main/20"><Microscope size={14} className="text-gold-main animate-pulse" /></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Clinical Signal Analysis</span>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-[clamp(2rem,8vw,5.5rem)] font-serif font-bold tracking-tighter leading-[0.8] italic uppercase">Acoustic <span className="text-gold-main not-italic">Analyzer</span></h1>
                        <p className="text-slate-400 text-sm md:text-xl font-light max-w-2xl italic leading-relaxed border-l-2 border-gold-main/20 pl-6 py-1">
                            Establish a diagnostic uplink. Upload clinical images for AI-driven artifact identification and physics optimization briefings.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                
                {/* Image Upload Area */}
                <div className="lg:col-span-6 space-y-8">
                    <div className={`relative group aspect-[4/3] rounded-[3rem] border-2 border-dashed transition-all duration-700 overflow-hidden bg-slate-950/40 ${selectedImage ? 'border-gold-main/40' : 'border-white/10 hover:border-gold-main/30'}`}>
                        {selectedImage ? (
                            <div className="relative w-full h-full group">
                                <img src={selectedImage} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Uplinked Scan" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <button onClick={() => { onPlayClick?.(); fileInputRef.current?.click(); }} className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl text-white hover:bg-gold-main hover:text-slate-950 transition-all"><Camera size={24} /></button>
                                    <button onClick={() => { onPlayClick?.(); reset(); }} className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl text-white hover:bg-red-500 transition-all"><X size={24} /></button>
                                </div>
                                <div className="absolute top-6 left-6 flex items-center gap-3">
                                    <div className="px-3 py-1 bg-gold-main text-slate-950 rounded-full text-[8px] font-black uppercase tracking-widest shadow-gold">UPLINK_READY</div>
                                </div>
                            </div>
                        ) : (
                            <button 
                                onClick={() => { onPlayClick?.(); fileInputRef.current?.click(); }}
                                className="w-full h-full flex flex-col items-center justify-center space-y-6 group/btn"
                            >
                                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 group-hover/btn:border-gold-main/30 group-hover/btn:scale-110 transition-all shadow-xl">
                                    <Scan size={32} className="text-white/20 group-hover/btn:text-gold-main" />
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Select Scan Vector</p>
                                    <p className="text-[8px] text-white/20 uppercase tracking-widest">JPG / PNG / DICOM_EXPORT</p>
                                </div>
                            </button>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
                    </div>

                    <div className="p-8 bg-gold-main/5 border border-gold-main/20 rounded-[2.5rem] space-y-4">
                        <div className="flex items-center gap-3 text-gold-main">
                            <Bot size={16} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Faculty Protocol</span>
                        </div>
                        <p className="text-xs text-slate-300 italic leading-relaxed border-l-2 border-gold-main/20 pl-4">
                            "Visualization is the key, kid. If you can't tell the difference between a side-lobe artifact and real anatomy, you aren't ready for the board. Uplink a sample and let's study the grain."
                        </p>
                    </div>
                </div>

                {/* Analysis Console */}
                <div className="lg:col-span-6 space-y-10">
                    <div className="bg-slate-900/60 border border-white/10 rounded-[3rem] p-10 min-h-[400px] flex flex-col relative overflow-hidden shadow-3xl">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03]"><Brain size={160} /></div>
                        
                        <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-8 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAnalyzing ? 'bg-gold-main/10 animate-pulse' : 'bg-white/5'}`}>
                                    <Search size={18} className={isAnalyzing ? 'text-gold-main' : 'text-white/20'} />
                                </div>
                                <h4 className="text-xl font-serif font-bold text-white italic">Analysis Deck</h4>
                            </div>
                            <button 
                                onClick={runAnalysis}
                                disabled={!selectedImage || isAnalyzing}
                                className={`px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] transition-all flex items-center gap-3 shadow-gold ${!selectedImage || isAnalyzing ? 'opacity-20 cursor-not-allowed' : 'bg-gold-main text-slate-950 hover:shadow-soft active:scale-95'}`}
                            >
                                {isAnalyzing ? <><Loader2 size={16} className="animate-spin" /> Synchronizing</> : <><Zap size={16} fill="currentColor" /> Run Diagnostic</>}
                            </button>
                        </div>

                        <div className="flex-1 relative z-10">
                            {isAnalyzing ? (
                                <div className="h-full flex flex-col items-center justify-center space-y-6 py-20">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gold-main/20 blur-2xl rounded-full animate-ping"></div>
                                        <Bot size={64} className="text-gold-main relative z-10" />
                                    </div>
                                    <div className="text-center space-y-3">
                                        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-gold-main/60 animate-pulse">Calculating Reflection Coefficients</p>
                                        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-gold-main animate-shimmer w-full bg-[length:200%_100%]"></div>
                                        </div>
                                    </div>
                                </div>
                            ) : analysis ? (
                                <div className="space-y-10 animate-slide-up">
                                    <div className="prose prose-invert max-w-none">
                                        <div className="flex items-center gap-3 mb-4 text-gold-main/60">
                                            <Sparkles size={14} />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Unit-01 Interpretation</span>
                                        </div>
                                        <div className="text-xl text-slate-200 font-serif italic leading-relaxed border-l-2 border-gold-main/30 pl-8 py-2 whitespace-pre-wrap">
                                            {analysis}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-6">
                                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                                            <div className="flex items-center gap-2 text-gold-main/40">
                                                <Activity size={12} />
                                                <span className="text-[8px] font-black uppercase tracking-widest">Signal Clarity</span>
                                            </div>
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-gold-main" style={{ width: '85%' }}></div>
                                            </div>
                                        </div>
                                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                                            <div className="flex items-center gap-2 text-gold-main/40">
                                                <ShieldCheck size={12} />
                                                <span className="text-[8px] font-black uppercase tracking-widest">Confidence</span>
                                            </div>
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-gold-main" style={{ width: '92%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="h-full flex flex-col items-center justify-center space-y-6 text-red-500 opacity-60">
                                    <AlertCircle size={48} />
                                    <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-20 py-20">
                                    <Scan size={48} className="text-white" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Console Awaiting Uplink</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClinicalAnalyzer;