import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  o: number;
  depth: number;
  phase: number;
}

interface Fish {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  phase: number;
  depth: number;
  schoolId: number;
  tailPhase: number;
}

const OceanBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sonarPulses = useRef<{ x: number, y: number, r: number, o: number, color: string }[]>([]);
  const readinessScoreRef = useRef(0);
  const scrollPosRef = useRef(0);
  const mousePos = useRef({ x: 0, y: 0 });
  const [readinessScore, setReadinessScore] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleReadinessUpdate = (e: any) => {
      const score = e.detail.score || 0;
      setReadinessScore(score);
      readinessScoreRef.current = score;
    };
    const handleScroll = () => {
      scrollPosRef.current = window.scrollY;
    };
    window.addEventListener('echomasters-readiness-update', handleReadinessUpdate);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('echomasters-readiness-update', handleReadinessUpdate);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const lightShafts = Array.from({ length: 15 }, () => ({
      x: Math.random() * width,
      width: 150 + Math.random() * 400,
      opacity: 0.02 + Math.random() * 0.08,
      speed: 0.0005 + Math.random() * 0.001,
      phase: Math.random() * Math.PI * 2
    }));

    const plants = Array.from({ length: 40 }, () => {
      const depth = 0.3 + Math.random() * 0.7;
      return {
        x: Math.random() * width,
        height: height * (0.2 + Math.random() * 0.4) * depth,
        swaySpeed: 0.001 + Math.random() * 0.003,
        swayAmount: 15 + Math.random() * 40,
        phase: Math.random() * Math.PI * 2,
        width: (6 + Math.random() * 12) * depth,
        color: Math.random() > 0.5 ? '#064e3b' : '#065f46',
        depth
      };
    });

    const marineSnow: Particle[] = Array.from({ length: 300 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.1,
      vy: Math.random() * 0.3 + 0.1,
      o: Math.random() * 0.5 + 0.1,
      depth: Math.random() * 0.8 + 0.2,
      phase: Math.random() * Math.PI * 2
    }));

    const tropicalColors = ['#B5944E', '#D4AF37', '#7dd3fc', '#38bdf8', '#facc15'];
    const fish: Fish[] = Array.from({ length: 60 }, () => {
      const depth = 0.4 + Math.random() * 0.6;
      const schoolId = Math.floor(Math.random() * 6);
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (0.8 + Math.random() * 1.5) * (Math.random() > 0.5 ? 1 : -1) * depth,
        vy: (Math.random() - 0.5) * 0.05,
        size: (4 + Math.random() * 8) * depth,
        color: tropicalColors[Math.floor(Math.random() * tropicalColors.length)],
        phase: Math.random() * Math.PI * 2,
        depth,
        schoolId,
        tailPhase: Math.random() * Math.PI * 2
      };
    });

    let time = 0;

    const drawBackground = (ctx: CanvasRenderingContext2D) => {
      const clarity = readinessScoreRef.current / 100;
      let topColor, bottomColor, midColor;
      
      if (isDarkMode) {
        topColor = clarity > 0.6 ? '#0c2447' : '#01040a';
        midColor = '#010816';
        bottomColor = '#000000';
      } else {
        topColor = clarity > 0.6 ? '#e0f2fe' : '#f8fafc';
        midColor = '#f1f5f9';
        bottomColor = '#e2e8f0';
      }
      
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, topColor);
      gradient.addColorStop(0.6, midColor);
      gradient.addColorStop(1, bottomColor);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = 0.03 + (Math.sin(time * 0.005) * 0.01);
      const patternSize = 400;
      for (let x = -patternSize; x < width + patternSize; x += patternSize) {
        const ox = Math.sin(time * 0.008 + x) * 50;
        const scrollOffset = scrollPosRef.current * 0.05;
        ctx.fillStyle = '#B5944E';
        ctx.beginPath();
        ctx.ellipse(x + ox, 50 - scrollOffset, patternSize * 0.8, 150, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawLightShafts = (ctx: CanvasRenderingContext2D) => {
      const scrollOffset = scrollPosRef.current * 0.2;
      lightShafts.forEach(s => {
        const sway = Math.sin(time * s.speed + s.phase) * 100;
        const grad = ctx.createLinearGradient(s.x + sway, -scrollOffset, s.x + sway - 300, height);
        grad.addColorStop(0, `rgba(181, 148, 78, ${s.opacity})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(s.x + sway, -scrollOffset);
        ctx.lineTo(s.x + sway + s.width, -scrollOffset);
        ctx.lineTo(s.x + sway + s.width - 400, height);
        ctx.lineTo(s.x + sway - 400, height);
        ctx.fill();
      });
    };

    const drawFish = (ctx: CanvasRenderingContext2D, f: Fish) => {
      // Schooling Vertical Sway (Cohesive movement)
      const schoolOsc = Math.sin(time * 0.01 + f.schoolId * 10) * 15;
      // Individual Undulation
      const individualOsc = Math.sin(time * 0.04 + f.phase) * 5;
      
      const scrollOffset = scrollPosRef.current * (f.depth * 0.15);
      
      f.x += f.vx;
      // vy adds a small drift to the vertical position
      f.y += f.vy;
      
      if (f.x > width + 100) f.x = -100;
      if (f.x < -100) f.x = width + 100;
      if (f.y > height + 200) f.y = -200;
      if (f.y < -200) f.y = height + 200;

      // Tail Wagging frequency based on speed
      f.tailPhase += Math.abs(f.vx) * 0.15 + 0.05;
      const tailWag = Math.sin(f.tailPhase) * (f.size * 0.6);
      
      ctx.save();
      // Total vertical position incorporates school and individual movement
      const finalY = f.y + schoolOsc + individualOsc - scrollOffset;
      ctx.translate(f.x, finalY);
      ctx.scale(f.vx > 0 ? 1 : -1, 1);
      ctx.globalAlpha = f.depth * 0.7;
      
      // Shadow / Depth glint
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, f.size);
      grad.addColorStop(0, f.color);
      grad.addColorStop(1, 'rgba(0,0,0,0.3)');
      
      ctx.fillStyle = grad;
      
      // Fish Body (Undulating slightly)
      const bodyUndulation = Math.sin(f.tailPhase * 0.5) * 1.5;
      ctx.beginPath();
      ctx.ellipse(0, bodyUndulation, f.size, f.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Tail (Finely animated)
      ctx.beginPath();
      ctx.moveTo(-f.size * 0.7, bodyUndulation);
      ctx.quadraticCurveTo(-f.size * 1.1, bodyUndulation + tailWag * 0.5, -f.size * 1.6, bodyUndulation + tailWag);
      ctx.lineTo(-f.size * 1.4, bodyUndulation);
      ctx.lineTo(-f.size * 1.6, bodyUndulation - tailWag);
      ctx.quadraticCurveTo(-f.size * 1.1, bodyUndulation - tailWag * 0.5, -f.size * 0.7, bodyUndulation);
      ctx.fill();

      // Eye
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(f.size * 0.5, bodyUndulation - f.size * 0.1, f.size * 0.12, 0, Math.PI * 2);
      ctx.fill();
      
      // Eye Glint (Life-like)
      if (Math.sin(time * 0.02 + f.phase) > 0.8) {
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(f.size * 0.55, bodyUndulation - f.size * 0.15, f.size * 0.05, 0, Math.PI * 2);
          ctx.fill();
      }

      ctx.restore();
    };

    const drawPlants = (ctx: CanvasRenderingContext2D) => {
      plants.sort((a, b) => a.depth - b.depth).forEach(p => {
        const scrollOffset = scrollPosRef.current * (p.depth * 0.1);
        const sway = Math.sin(time * p.swaySpeed + p.phase) * p.swayAmount;
        ctx.save();
        ctx.globalAlpha = p.depth * 0.7;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x, height + scrollOffset);
        ctx.quadraticCurveTo(p.x + sway * 0.5, height - p.height * 0.5 + scrollOffset, p.x + sway, height - p.height + scrollOffset);
        ctx.stroke();
        ctx.restore();
      });
    };

    const drawParticles = (ctx: CanvasRenderingContext2D) => {
      const clarity = readinessScoreRef.current / 100;
      marineSnow.forEach(p => {
        const scrollOffset = scrollPosRef.current * (p.depth * 0.2);
        p.y += p.vy * p.depth;
        p.x += Math.sin(time * 0.01 + p.phase) * 0.2;
        if (p.y > height) p.y = -20;
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;
        
        ctx.fillStyle = isDarkMode 
          ? `rgba(255, 255, 255, ${p.o * (0.3 + clarity * 0.5)})`
          : `rgba(0, 0, 0, ${p.o * (0.1 + clarity * 0.2)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y - scrollOffset, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawAcousticRipples = (ctx: CanvasRenderingContext2D) => {
      for (let i = sonarPulses.current.length - 1; i >= 0; i--) {
        const p = sonarPulses.current[i];
        p.r += 3.5;
        p.o -= 0.012;
        if (p.o <= 0) {
          sonarPulses.current.splice(i, 1);
          continue;
        }
        const scrollOffset = scrollPosRef.current * 0.1;
        ctx.strokeStyle = p.color.replace('opacity', p.o.toString());
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y - scrollOffset, p.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = p.o * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y - scrollOffset, p.r * 0.8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      if (time % 200 === 0) {
        sonarPulses.current.push({
          x: Math.random() * width,
          y: Math.random() * height + scrollPosRef.current * 0.1,
          r: 0,
          o: 0.6,
          color: 'rgba(181, 148, 78, opacity)'
        });
      }
    };

    const render = () => {
      time++;
      ctx.clearRect(0, 0, width, height);

      drawBackground(ctx);
      drawLightShafts(ctx);
      drawParticles(ctx);
      
      fish.filter(f => f.depth < 0.7).sort((a,b) => a.depth - b.depth).forEach(f => drawFish(ctx, f));
      drawPlants(ctx);
      fish.filter(f => f.depth >= 0.7).sort((a,b) => a.depth - b.depth).forEach(f => drawFish(ctx, f));
      drawAcousticRipples(ctx);
      
      animationFrame = requestAnimationFrame(render);
    };

    let animationFrame = requestAnimationFrame(render);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = (e: MouseEvent) => {
      sonarPulses.current.push({
        x: e.clientX,
        y: e.clientY + scrollPosRef.current * 0.1,
        r: 0,
        o: 1.0,
        color: 'rgba(255, 255, 255, opacity)'
      });
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [readinessScore]);

  return (
    <div className={`fixed inset-0 z-[-1] overflow-hidden transition-colors duration-1000 ${isDarkMode ? 'bg-[#01040a]' : 'bg-[#f8fafc]'}`}>
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className={`absolute inset-0 pointer-events-none ${isDarkMode ? 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]' : 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.4)_100%)]'}`}></div>
    </div>
  );
};

export default OceanBackground;