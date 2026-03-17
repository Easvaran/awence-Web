"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  baseVx: number;
  baseVy: number;
  isExploding?: boolean;
  explodeVx?: number;
  explodeVy?: number;
  explodeLife?: number;
}

interface ParticlesProps {
  className?: string;
  quantity?: number;
  color?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
}

export function Particles({
  className = "",
  quantity = 50,
  color = "255, 255, 255",
  minSize = 1,
  maxSize = 3,
  speed = 0.5,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number; isHovering: boolean }>({
    x: 0,
    y: 0,
    isHovering: false,
  });
  const explosionParticlesRef = useRef<Particle[]>([]);

  const triggerExplosion = useCallback(
    (x: number, y: number) => {
      const explosionCount = 30;
      const newExplosionParticles: Particle[] = [];

      for (let i = 0; i < explosionCount; i++) {
        const angle = (Math.PI * 2 * i) / explosionCount + Math.random() * 0.5;
        const velocity = 3 + Math.random() * 5;
        newExplosionParticles.push({
          x,
          y,
          vx: 0,
          vy: 0,
          baseVx: 0,
          baseVy: 0,
          radius: Math.random() * (maxSize - minSize) + minSize + 1,
          opacity: 1,
          isExploding: true,
          explodeVx: Math.cos(angle) * velocity,
          explodeVy: Math.sin(angle) * velocity,
          explodeLife: 1,
        });
      }

      explosionParticlesRef.current = [
        ...explosionParticlesRef.current,
        ...newExplosionParticles,
      ];

      // Push nearby particles away
      particlesRef.current.forEach((particle) => {
        const dx = particle.x - x;
        const dy = particle.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          const force = (150 - distance) / 150;
          const angle = Math.atan2(dy, dx);
          particle.vx += Math.cos(angle) * force * 8;
          particle.vy += Math.sin(angle) * force * 8;
        }
      });
    },
    [maxSize, minSize]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    const createParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < quantity; i++) {
        const vx = (Math.random() - 0.5) * speed;
        const vy = (Math.random() - 0.5) * speed;
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx,
          vy,
          baseVx: vx,
          baseVy: vy,
          radius: Math.random() * (maxSize - minSize) + minSize,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw regular particles
      particlesRef.current.forEach((particle) => {
        const { isHovering, x: mx, y: my } = mouseRef.current;
        let glowRadius = particle.radius;
        let glowOpacity = particle.opacity;

        // Enhanced glow when mouse is near
        if (isHovering) {
          const dx = particle.x - mx;
          const dy = particle.y - my;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const intensity = 1 - distance / 150;
            glowRadius = particle.radius + intensity * 3;
            glowOpacity = Math.min(1, particle.opacity + intensity * 0.5);

            // Draw glow effect
            const gradient = ctx.createRadialGradient(
              particle.x,
              particle.y,
              0,
              particle.x,
              particle.y,
              glowRadius * 3
            );
            gradient.addColorStop(0, `rgba(${color}, ${intensity * 0.4})`);
            gradient.addColorStop(1, `rgba(${color}, 0)`);
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, glowRadius * 3, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
          }
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${glowOpacity})`;
        ctx.fill();
      });

      // Draw explosion particles
      explosionParticlesRef.current.forEach((particle) => {
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 2
        );
        gradient.addColorStop(
          0,
          `rgba(${color}, ${particle.explodeLife || 0})`
        );
        gradient.addColorStop(1, `rgba(${color}, 0)`);

        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          particle.radius * (2 - (particle.explodeLife || 0)),
          0,
          Math.PI * 2
        );
        ctx.fillStyle = gradient;
        ctx.fill();
      });
    };

    const connectParticles = () => {
      const { isHovering, x: mx, y: my } = mouseRef.current;
      const baseMaxDistance = 120;
      const hoverMaxDistance = 180;

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Check if particles are near mouse for enhanced connection
          let maxDistance = baseMaxDistance;
          let lineOpacityMultiplier = 1;

          if (isHovering) {
            const p1ToMouse = Math.sqrt(
              (p1.x - mx) ** 2 + (p1.y - my) ** 2
            );
            const p2ToMouse = Math.sqrt(
              (p2.x - mx) ** 2 + (p2.y - my) ** 2
            );

            if (p1ToMouse < 150 || p2ToMouse < 150) {
              maxDistance = hoverMaxDistance;
              lineOpacityMultiplier = 2;
            }
          }

          if (distance < maxDistance) {
            const opacity =
              (1 - distance / maxDistance) * 0.15 * lineOpacityMultiplier;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${color}, ${opacity})`;
            ctx.lineWidth = isHovering ? 1.5 : 1;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Connect particles to mouse when hovering
        if (isHovering) {
          const p = particlesRef.current[i];
          const distToMouse = Math.sqrt((p.x - mx) ** 2 + (p.y - my) ** 2);

          if (distToMouse < 150) {
            const opacity = (1 - distToMouse / 150) * 0.3;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${color}, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mx, my);
            ctx.stroke();
          }
        }
      }
    };

    const updateParticles = () => {
      const { isHovering, x: mx, y: my } = mouseRef.current;

      particlesRef.current.forEach((particle) => {
        // Hover effect: particles move faster and are attracted/repelled by mouse
        if (isHovering) {
          const dx = mx - particle.x;
          const dy = my - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150 && distance > 0) {
            // Gentle orbiting/swirling effect around cursor
            const angle = Math.atan2(dy, dx);
            const perpAngle = angle + Math.PI / 2;
            const attraction = 0.02;
            const orbit = 0.5;

            particle.vx +=
              Math.cos(angle) * attraction + Math.cos(perpAngle) * orbit * 0.02;
            particle.vy +=
              Math.sin(angle) * attraction + Math.sin(perpAngle) * orbit * 0.02;

            // Speed boost near mouse
            const speedMultiplier = 1.5 + (1 - distance / 150) * 2;
            particle.vx = particle.baseVx * speedMultiplier + (particle.vx - particle.baseVx) * 0.95;
            particle.vy = particle.baseVy * speedMultiplier + (particle.vy - particle.baseVy) * 0.95;
          }
        } else {
          // Gradually return to base velocity
          particle.vx += (particle.baseVx - particle.vx) * 0.02;
          particle.vy += (particle.baseVy - particle.vy) * 0.02;
        }

        // Apply friction to explosion push
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -1;
          particle.baseVx *= -1;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -1;
          particle.baseVy *= -1;
        }

        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
      });

      // Update explosion particles
      explosionParticlesRef.current = explosionParticlesRef.current.filter(
        (particle) => {
          if (particle.isExploding && particle.explodeLife !== undefined) {
            particle.x += particle.explodeVx || 0;
            particle.y += particle.explodeVy || 0;
            particle.explodeVx = (particle.explodeVx || 0) * 0.96;
            particle.explodeVy = (particle.explodeVy || 0) * 0.96;
            particle.explodeLife -= 0.025;
            return particle.explodeLife > 0;
          }
          return false;
        }
      );
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      connectParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.isHovering = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovering = false;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      triggerExplosion(x, y);
    };

    resizeCanvas();
    createParticles();
    animate();

    const handleResize = () => {
      resizeCanvas();
      createParticles();
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationRef.current);
    };
  }, [quantity, color, minSize, maxSize, speed, triggerExplosion]);

  return (
    <canvas
      ref={canvasRef}
      className={`cursor-pointer w-full h-full ${className}`}
      style={{ display: 'block' }}
      aria-hidden="true"
    />
  );
}
