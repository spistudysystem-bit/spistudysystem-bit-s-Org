import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { 
  Play, Pause, Activity, Waves, Target, Eye, 
  Ruler, BarChart3, Binary, Radar, Wind, 
  Compass, HelpCircle, ArrowRight, Zap, ShieldAlert,
  User, Move, GitMerge, Layers
} from 'lucide-react';

interface SimulationProps {
  type: string;
  topicId?: string;
  isSandbox?: boolean;
  onPlayClick?: () => void;
}

const Simulations: React.FC<SimulationProps> = ({ type, isSandbox, onPlayClick }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(!!isSandbox);
  const [showHelp, setShowHelp] = useState(false);
  const [param1, setParam1] = useState(50); 
  const [param2, setParam2] = useState(50); 
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const [size, setSize] = useState({ width: 0, height: 320 });

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
        if (containerRef.current) {
            const isMobile = window.innerWidth < 768;
            setSize({ 
              width: containerRef.current.clientWidth, 
              height: isMobile ? 280 : (isSandbox ? 500 : 380)
            });
        }
    };
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [isSandbox]);

  // Fix hoisting: define getLabels before usage
  const getLabels = () => {
    const safeType = type || 'Default';
    switch(safeType) {
      case 'LongitudinalWaveVisual':
        return { p1: "Frequency", p2: "Amplitude", icon1: Activity, icon2: Waves, help: "Observe particles compressing and rarefying. Parallel motion defines longitudinal sound." };
      case 'HuygensVisual':
        return { p1: "Wavelet Count", p2: "Interference", icon1: GitMerge, icon2: Layers, help: "Huygens' Principle states every point on a wavefront is a source of wavelets. Their interference creates the beam shape." };
      case 'LobeVisual':
        return { p1: "Apodization", p2: "Element Spacing", icon1: ShieldAlert, icon2: Ruler, help: "Visualize side lobes and grating lobes. Higher central voltage (Apodization) reduces energy leakage." };
      case 'DopplerShiftVisual':
        return { p1: "Velocity", p2: "Incident Angle", icon1: Wind, icon2: Compass, help: "At 90°, the frequency shift disappears. Parallel alignment is key. Click and drag on the visual to adjust the angle." };
      case 'BeamFormingVisual':
        return { p1: "Focal Depth", p2: "Aperture Size", icon1: Target, icon2: Move, help: "Adjust focal depth to optimize lateral resolution at a specific distance." };
      case 'PositioningVisual':
        return { p1: "Patient Orientation", p2: "Window Clarity", icon1: User, icon2: Eye, help: "Manipulate orientation to optimize acoustic windows and reduce bowel gas interference." };
      default:
        return { p1: "Intensity", p2: "Sensitivity", icon1: Zap, icon2: Activity, help: "Adjust vectors to observe acoustic interactions." };
    }
  };

  const labels = getLabels();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.width === 0) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size.width * dpr; canvas.height = size.height * dpr;
    canvas.style.width = `${size.width}px`; canvas.style.height = `${size.height}px`;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    let frame = 0;
    const render = () => {
      if (isPlaying) frame++;
      ctx.clearRect(0, 0, size.width, size.height);
      const cy = size.height / 2;
      const cx = size.width / 2;

      const p1Val = param1 / 100;
      const p2Val = param2 / 100;

      if (type === 'HuygensVisual') {
        const waveletCount = Math.floor(p1Val * 15) + 3;
        const interference = p2Val;
        ctx.strokeStyle = "#B5944E";
        ctx.globalAlpha = 0.3;
        for (let i = 0; i < waveletCount; i++) {
            const x = (size.width / (waveletCount + 1)) * (i + 1);
            const radius = (frame * 2) % 200;
            ctx.beginPath();
            ctx.arc(x, cy, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        // Resultant wave front
        ctx.globalAlpha = 1;
        ctx.lineWidth = 3;
        ctx.beginPath();
        const frontR = (frame * 2) % 200;
        ctx.moveTo(0, cy + frontR * interference);
        ctx.lineTo(size.width, cy + frontR * interference);
        ctx.stroke();
      } else if (type === 'LobeVisual') {
        const apo = 1 - p1Val;
        const spacing = p2Val * 40 + 10;
        ctx.save();
        ctx.translate(cx, cy);
        // Main Beam
        ctx.fillStyle = `rgba(181, 148, 78, 0.6)`;
        ctx.beginPath();
        ctx.moveTo(-20, 0); ctx.lineTo(20, 0); ctx.lineTo(5, 150); ctx.lineTo(-5, 150);
        ctx.fill();
        // Lobes
        ctx.fillStyle = `rgba(239, 68, 68, ${0.4 * apo})`;
        for(let i = -1; i <= 1; i += 2) {
            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.ellipse(i * 60, 40, 20, 80, i * 0.8, 0, Math.PI*2);
            ctx.fill();
        }
        ctx.restore();
      } else if (type === 'LongitudinalWaveVisual') {
          const freq = p1Val * 0.1 + 0.02;
          const amp = p2Val * 30 + 5;
          ctx.fillStyle = "#B5944E";
          for(let i=0; i<300; i++) {
              const x = (i * 10) % size.width;
              const y = (Math.floor(i * 10 / size.width) * 20) % size.height;
              const shift = Math.sin(x * freq + frame * 0.1) * amp;
              ctx.beginPath(); ctx.arc(x + shift, y, 1.5, 0, Math.PI * 2); ctx.fill();
          }
      } else if (type === 'PositioningVisual') {
          const angle = p1Val * Math.PI * 2;
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(angle);
          ctx.strokeStyle = "#B5944E";
          ctx.lineWidth = 3;
          ctx.beginPath(); ctx.ellipse(0, 0, 80, 140, 0, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.arc(0, -170, 30, 0, Math.PI * 2); ctx.stroke();
          ctx.restore();
      } else if (type === 'DopplerShiftVisual') {
        const velocity = p1Val * 5 + 1;
        const angleDeg = (param2 / 100) * 180;
        const angleRad = (angleDeg * Math.PI) / 180;
        
        // Blood Vessel
        ctx.strokeStyle = "rgba(239, 68, 68, 0.15)";
        ctx.lineWidth = 60;
        ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(size.width, cy); ctx.stroke();
        
        // Flow particles
        ctx.fillStyle = "#ef4444";
        for(let i=0; i<15; i++) {
          const x = (i * 60 + frame * velocity) % size.width;
          ctx.beginPath(); ctx.arc(x, cy + (Math.sin(i + frame * 0.05) * 15), 3, 0, Math.PI * 2); ctx.fill();
        }
        
        // Doppler Cursor
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-angleRad);
        ctx.strokeStyle = "#B5944E";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -200); ctx.stroke();
        
        // Angle marker
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(0, 0, 50, -Math.PI/2, -Math.PI/2 + angleRad); ctx.stroke();
        
        // Cursor head
        ctx.fillStyle = "#B5944E";
        ctx.beginPath(); ctx.moveTo(-10, -150); ctx.lineTo(10, -150); ctx.lineTo(0, -170); ctx.fill();
        ctx.restore();

        // Telemetry
        if (showAnalysis) {
            ctx.fillStyle = "white";
            ctx.font = "10px monospace";
            const cosTheta = Math.abs(Math.cos(angleRad - Math.PI/2));
            const shift = 2 * velocity * cosTheta;
            ctx.fillText(`INCIDENT_ANGLE: ${angleDeg.toFixed(1)}°`, 20, 30);
            ctx.fillText(`DOPPLER_SHIFT: ${shift.toFixed(2)} kHz`, 20, 45);
            ctx.fillText(`COS_THETA: ${cosTheta.toFixed(3)}`, 20, 60);
        }
      } else if (type === 'BeamFormingVisual') {
        const focalDepth = p1Val * (size.height - 100) + 50;
        const aperture = p2Val * 120 + 40;
        
        // Transducer Elements
        const elementCount = 12;
        const elementWidth = aperture / elementCount;
        ctx.fillStyle = "#1e293b";
        for(let i=0; i<elementCount; i++) {
            const ex = cx - aperture/2 + i * elementWidth;
            ctx.fillRect(ex + 1, 20, elementWidth - 2, 15);
            
            // Firing lines
            ctx.strokeStyle = "rgba(181, 148, 78, 0.1)";
            ctx.beginPath(); ctx.moveTo(ex + elementWidth/2, 35); ctx.lineTo(cx, focalDepth); ctx.stroke();
        }

        // Main Beam Shape
        const gradient = ctx.createRadialGradient(cx, 35, 0, cx, 35, size.height);
        gradient.addColorStop(0, "rgba(181, 148, 78, 0.3)");
        gradient.addColorStop(focalDepth / size.height, "rgba(181, 148, 78, 0.6)");
        gradient.addColorStop(1, "rgba(181, 148, 78, 0.05)");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(cx - aperture/2, 35);
        ctx.lineTo(cx + aperture/2, 35);
        ctx.lineTo(cx + 10, focalDepth);
        ctx.lineTo(cx + 40, size.height);
        ctx.lineTo(cx - 40, size.height);
        ctx.lineTo(cx - 10, focalDepth);
        ctx.closePath();
        ctx.fill();

        // Focal point indicator
        ctx.strokeStyle = "#B5944E";
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(cx - 60, focalDepth); ctx.lineTo(cx + 60, focalDepth); ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillStyle = "#B5944E";
        ctx.beginPath(); ctx.arc(cx, focalDepth, 4, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.beginPath();
        ctx.strokeStyle = "#B5944E";
        ctx.lineWidth = 2;
        for(let x=0; x<size.width; x++) {
          const y = cy + Math.sin(x * (p1Val * 0.1 + 0.01) + frame * 0.1) * (p2Val * 50 + 10);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [type, isPlaying, param1, param2, size]);

  const updateDopplerAngle = (e: any) => {
    if (!canvasRef.current || type !== 'DopplerShiftVisual') return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const cx = size.width / 2;
    const cy = size.height / 2;
    
    const angleRad = Math.atan2(cy - y, x - cx);
    let degrees = (angleRad * 180) / Math.PI;
    
    if (degrees < 0) degrees = 0;
    if (degrees > 180) degrees = 180;
    
    setParam2(Math.round((degrees / 180) * 100));
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (type === 'DopplerShiftVisual') {
      setIsDragging(true);
      updateDopplerAngle(e);
    }
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isDragging) {
      updateDopplerAngle(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className={`bg-slate-950/60 backdrop-blur-3xl rounded-2xl md:rounded-[3.5rem] shadow-3xl border border-white/5 overflow-hidden text-left relative group ${isSandbox ? 'h-full flex flex-col' : ''}`}>
      {showHelp && (
        <div className="absolute inset-0 z-[100] bg-slate-950/95 backdrop-blur-md animate-fade-in flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gold-main/10 border border-gold-main/30 flex items-center justify-center text-gold-main shadow-gold"><HelpCircle size={32} /></div>
            <div className="space-y-2">
                <h4 className="text-xl font-serif font-bold italic text-white">Visual Logic Unit</h4>
                <p className="text-sm text-slate-400 font-light max-sm leading-relaxed">{labels.help}</p>
            </div>
            <button onClick={() => setShowHelp(false)} className="px-10 py-3 bg-gold-main text-slate-950 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-gold transition-all active:scale-95">Resume Sync</button>
        </div>
      )}

      <div className="px-4 py-3 md:px-10 md:py-6 bg-white/[0.03] border-b border-white/5 flex justify-between items-center z-20 relative">
        <div className="flex items-center gap-3 md:gap-5">
            <div className="w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-2xl bg-gold-main/10 flex items-center justify-center border border-gold-main/20 shadow-inner">
              <Activity size={20} className="text-gold-main" />
            </div>
            <div>
              <h4 className="text-[7px] md:text-[10px] font-black text-gold-main/60 uppercase tracking-[0.2em] md:tracking-[0.5em] font-sans leading-tight">Acoustic Vector Simulation</h4>
              <p className="text-[10px] md:text-sm font-serif font-bold text-white tracking-tight mt-1">{(type || 'DEFAULT').replace('Visual', '').toUpperCase()}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => { onPlayClick?.(); setShowHelp(true); }} className="p-2 text-white/30 hover:text-white transition-colors"><HelpCircle size={18} /></button>
            <button onClick={() => { onPlayClick?.(); setShowAnalysis(!showAnalysis); }} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${showAnalysis ? 'bg-gold-main/20 border-gold-main text-gold-main' : 'bg-white/5 border-white/5 text-white/40'}`}>
                <BarChart3 size={10} /><span className="text-[8px] font-black uppercase tracking-widest">Telemetry</span>
            </button>
            <button onClick={() => { onPlayClick?.(); setIsPlaying(!isPlaying); }} className="p-2 md:p-3 bg-slate-900 text-gold-main/60 hover:bg-gold-main hover:text-slate-950 rounded-xl transition-all border border-white/5 active:scale-90 shadow-xl">
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>
        </div>
      </div>

      <div 
        ref={containerRef} 
        className={`flex-1 bg-transparent relative overflow-hidden flex items-center justify-center min-h-[220px] md:min-h-[340px] ${type === 'DopplerShiftVisual' ? 'cursor-crosshair' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
          <canvas ref={canvasRef} className="block" />
          <div className="absolute top-4 right-4 pointer-events-none hidden sm:block">
             <div className="bg-slate-950/80 p-2.5 rounded-xl border border-white/5 backdrop-blur-xl flex items-center gap-3 shadow-2xl transition-all group-hover:border-gold-main/20">
                <Radar size={12} className="text-gold-main animate-[spin_10s_linear_infinite]" />
                <div><p className="text-[7px] font-black text-white/20 uppercase tracking-widest leading-none mb-1">Status</p><p className="text-[8px] text-white font-bold uppercase tracking-widest leading-none">REALTIME_SYNC</p></div>
             </div>
          </div>
      </div>

      <div className="px-4 py-5 md:px-12 md:py-10 bg-slate-950/40 border-t border-white/5 space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            <div className="space-y-3 md:space-y-5">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <labels.icon1 size={14} className="text-gold-main" />
                        <label className="text-[9px] md:text-[11px] font-black text-white/80 uppercase tracking-widest">{labels.p1}</label>
                    </div>
                    <span className="text-[9px] font-mono text-gold-main font-bold bg-gold-main/10 px-2 py-0.5 rounded-md">{param1}%</span>
                </div>
                <input type="range" min="0" max="100" value={param1} onChange={e => setParam1(parseInt(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-gold-main" />
            </div>
            <div className="space-y-3 md:space-y-5">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <labels.icon2 size={14} className="text-gold-main" />
                        <label className="text-[9px] md:text-[11px] font-black text-white/80 uppercase tracking-widest">{labels.p2}</label>
                    </div>
                    <span className="text-[9px] font-mono text-gold-main font-bold bg-gold-main/10 px-2 py-0.5 rounded-md">{param2}%</span>
                </div>
                <input type="range" min="0" max="100" value={param2} onChange={e => setParam2(parseInt(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-gold-main" />
            </div>
          </div>
      </div>
    </div>
  );
};

export default Simulations;
