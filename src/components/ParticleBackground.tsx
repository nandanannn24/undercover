"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  alpha: number;
  symbol?: string;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 140,
      active: false,
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    const handleTouchEnd = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    // Particle Colors matching legacy gold #d4af37 and mystical violet #8b5cf6
    const colors = ["#d4af37", "#f59e0b", "#c084fc", "#e9d5ff", "#fbbf24"];
    const symbols = ["✦", "●", "★", "?", "◆"];

    const isMobile = width < 640;
    const count = isMobile ? 32 : 55;
    const maxLinkDist = isMobile ? 110 : 145;

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const isSymbol = Math.random() < 0.22;
      const c = colors[Math.floor(Math.random() * colors.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: isSymbol ? 5 : Math.random() * 2.2 + 1.2,
        color: c,
        glowColor: c === "#d4af37" ? "rgba(212, 175, 55, 0.4)" : "rgba(192, 132, 252, 0.4)",
        alpha: Math.random() * 0.45 + 0.35,
        symbol: isSymbol ? symbols[Math.floor(Math.random() * symbols.length)] : undefined,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw elegant constellation lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxLinkDist) {
            const linkAlpha = (1 - dist / maxLinkDist) * 0.24;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${linkAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles & symbols with mouse repulsion
      particles.forEach((p) => {
        // Mouse repulsion
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 0) {
            const force = (1 - dist / mouse.radius) * 3;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;

        if (p.symbol) {
          ctx.font = "bold 12px serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 6;
          ctx.shadowColor = p.glowColor;
          ctx.fillText(p.symbol, p.x, p.y);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.glowColor;
          ctx.fill();
        }

        ctx.restore();

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around bounds
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Deep Twilight Mystery Gradient (matching legacy_backup) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,_#261343_0%,_#160c29_55%,_#0d0718_100%)]" />

      {/* Subtle Mystical Ambient Lights */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-purple-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

      {/* Floating Ghost Element from legacy_backup (Modern 3D Cartoon Float) */}
      <div
        className="absolute top-16 right-6 sm:right-16 w-20 h-28 sm:w-24 sm:h-36 opacity-30 pointer-events-none animate-float-ghost bg-contain bg-no-repeat bg-center"
        style={{ backgroundImage: "url('/hantu.PNG')" }}
      />
      <div
        className="absolute bottom-24 left-4 sm:left-12 w-16 h-24 sm:w-20 sm:h-30 opacity-25 pointer-events-none animate-float-ghost-delayed bg-contain bg-no-repeat bg-center"
        style={{ backgroundImage: "url('/hantu.PNG')" }}
      />

      {/* Interactive Constellation Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto" aria-hidden="true" />
    </div>
  );
}
