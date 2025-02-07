import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Handle resize
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      initParticles();
    };

    // Initialize particles with reduced count
    const initParticles = () => {
      const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 20000));
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3, // Slower movement
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1.5
      }));

      console.log(`Initialized ${particleCount} particles`);
    };

    // Draw connections with reduced opacity
    const drawConnections = (particles: Particle[]) => {
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            const opacity = (1 - distance / 200) * 0.3; // Reduced opacity
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            gradient.addColorStop(0, `rgba(6, 182, 212, ${opacity})`);
            gradient.addColorStop(1, `rgba(59, 130, 246, ${opacity})`);

            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1; // Thinner lines
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });
    };

    // Animation loop with adjusted opacity
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.fillStyle = 'rgba(17, 24, 39, 0.1)'; // More transparent fade
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 2
        );
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.4)'); // Reduced opacity
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      drawConnections(particles);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Initialize and start animation
    handleResize();
    window.addEventListener('resize', handleResize);
    animate();

    // Debug info
    console.log('Canvas initialized:', {
      width: canvas.width,
      height: canvas.height,
      context: ctx !== null
    });

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ 
        zIndex: 0,
        background: 'transparent',
        position: 'fixed',
        top: 0,
        left: 0,
        opacity: 0.3 // Overall reduced opacity
      }}
    />
  );
}; 