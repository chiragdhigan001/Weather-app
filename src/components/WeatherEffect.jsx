import { useEffect, useRef } from 'react';

const COLOR_RAIN = 'rgba(174, 194, 224, ';
const COLOR_SNOW = 'rgba(255, 255, 255, ';
const COLOR_CLOUD = 'rgba(200, 210, 220, ';
const COLOR_FOG = 'rgba(200, 200, 215, ';
const COLOR_DEFAULT = 'rgba(200, 210, 230, ';

function WeatherEffect({ weather }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!weather) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId, resizeTimer;
    let particles = [];
    let lightningFlash = 0;
    const isMobile = window.innerWidth < 768;
    const scale = isMobile ? 0.5 : 1;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };

    resize();
    window.addEventListener('resize', handleResize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    const createParticles = () => {
      particles = [];
      const w = W(), h = H();

      switch (weather) {
        case 'clear': {
          const n = 60 * scale;
          for (let i = 0; i < n; i++) {
            particles.push({
              x: Math.random() * w, y: Math.random() * h,
              size: Math.random() * 3 + 1,
              sx: (Math.random() - 0.5) * 0.2, sy: -Math.random() * 0.3 - 0.1,
              op: Math.random() * 0.5 + 0.1,
              hue: 35 + Math.random() * 25, light: 75 + Math.random() * 20,
              life: Math.random() * 300 + 100, maxLife: 400,
              t: 'sun',
            });
          }
          break;
        }
        case 'clouds': {
          const n = 12 * scale;
          for (let i = 0; i < n; i++) {
            const cx = Math.random() * w, cy = Math.random() * h * 0.5;
            for (let j = 0; j < 6; j++) {
              particles.push({
                x: cx + (Math.random() - 0.5) * 100,
                y: cy + (Math.random() - 0.5) * 40,
                size: Math.random() * 50 + 25,
                sx: Math.random() * 0.25 + 0.05, sy: (Math.random() - 0.5) * 0.03,
                op: Math.random() * 0.12 + 0.04, t: 'cloud',
              });
            }
          }
          break;
        }
        case 'rain': {
          const n = Math.min(Math.floor(w * 0.15 * scale), 250);
          for (let i = 0; i < n; i++) {
            particles.push({
              x: Math.random() * w, y: Math.random() * h,
              len: Math.random() * 18 + 8, spd: Math.random() * 6 + 4,
              op: Math.random() * 0.4 + 0.2, thick: Math.random() * 1.5 + 0.5,
              wind: Math.random() * 0.5 + 0.2, t: 'rain',
            });
          }
          break;
        }
        case 'drizzle': {
          const n = 120 * scale;
          for (let i = 0; i < n; i++) {
            particles.push({
              x: Math.random() * w, y: Math.random() * h,
              len: Math.random() * 10 + 4, spd: Math.random() * 3 + 2,
              op: Math.random() * 0.3 + 0.15, thick: Math.random() * 0.8 + 0.3,
              wind: Math.random() * 0.3 + 0.1, t: 'rain',
            });
          }
          break;
        }
        case 'snow': {
          const n = 200 * scale;
          for (let i = 0; i < n; i++) {
            particles.push({
              x: Math.random() * w, y: Math.random() * h,
              size: Math.random() * 5 + 2, spd: Math.random() * 1.5 + 0.5,
              op: Math.random() * 0.7 + 0.2,
              sway: Math.random() * 1.5 + 0.5, swaySpd: Math.random() * 0.02 + 0.005,
              angle: Math.random() * Math.PI * 2, t: 'snow',
            });
          }
          break;
        }
        case 'mist':
        case 'fog': {
          const n = 50 * scale;
          for (let i = 0; i < n; i++) {
            particles.push({
              x: Math.random() * w, y: Math.random() * h,
              size: Math.random() * 100 + 50,
              sx: Math.random() * 0.15 + 0.03, sy: (Math.random() - 0.5) * 0.02,
              op: Math.random() * 0.06 + 0.02, t: 'fog',
            });
          }
          break;
        }
        case 'thunderstorm': {
          const n = Math.min(Math.floor(w * 0.18 * scale), 300);
          for (let i = 0; i < n; i++) {
            particles.push({
              x: Math.random() * w, y: Math.random() * h,
              len: Math.random() * 22 + 10, spd: Math.random() * 8 + 5,
              op: Math.random() * 0.5 + 0.3, thick: Math.random() * 2 + 0.8,
              wind: Math.random() * 0.8 + 0.3, t: 'rain',
            });
          }
          break;
        }
        default: {
          const n = 30 * scale;
          for (let i = 0; i < n; i++) {
            particles.push({
              x: Math.random() * w, y: Math.random() * h,
              size: Math.random() * 3 + 1,
              sx: (Math.random() - 0.5) * 0.3, sy: (Math.random() - 0.5) * 0.3,
              op: Math.random() * 0.3 + 0.1, t: 'default',
            });
          }
        }
      }
    };

    createParticles();

    const animate = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (weather === 'thunderstorm') {
        if (lightningFlash > 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${lightningFlash})`;
          ctx.fillRect(0, 0, w, h);
          lightningFlash -= 0.015;
        } else if (Math.random() < 0.004) {
          lightningFlash = 0.7;
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        switch (p.t) {
          case 'rain': {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - p.wind * 3, p.y + p.len);
            ctx.strokeStyle = COLOR_RAIN + p.op + ')';
            ctx.lineWidth = p.thick;
            ctx.lineCap = 'round';
            ctx.stroke();
            p.y += p.spd;
            p.x -= p.wind;
            if (p.y > h) { p.y = -p.len; p.x = Math.random() * w; }
            break;
          }
          case 'snow': {
            p.angle += p.swaySpd;
            p.x += Math.sin(p.angle) * p.sway;
            p.y += p.spd;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = COLOR_SNOW + p.op + ')';
            ctx.fill();
            if (p.y > h + 10) { p.y = -10; p.x = Math.random() * w; }
            break;
          }
          case 'fog': {
            p.x += p.sx;
            p.y += p.sy;
            if (p.x > w + 150) p.x = -150;
            if (p.x < -150) p.x = w + 150;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = COLOR_FOG + p.op + ')';
            ctx.fill();
            break;
          }
          case 'cloud': {
            p.x += p.sx;
            p.y += p.sy;
            if (p.x > w + 150) { p.x = -150; p.y = Math.random() * h * 0.5; }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = COLOR_CLOUD + p.op + ')';
            ctx.fill();
            break;
          }
          case 'sun': {
            p.x += p.sx;
            p.y += p.sy;
            p.life--;
            if (p.life <= 0) { p.x = Math.random() * w; p.y = h + 5; p.life = p.maxLife; p.op = Math.random() * 0.5 + 0.1; }
            if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 100%, ${p.light}%, ${p.op})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 100%, 80%, ${p.op * 0.08})`;
            ctx.fill();
            break;
          }
          default: {
            p.x += p.sx;
            p.y += p.sy;
            if (p.x < -10 || p.x > w + 10) { p.x = Math.random() * w; p.y = Math.random() * h; }
            if (p.y < -10 || p.y > h + 10) { p.y = Math.random() * h; p.x = Math.random() * w; }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = COLOR_DEFAULT + p.op + ')';
            ctx.fill();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [weather]);

  if (!weather) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100vh',
        pointerEvents: 'none', zIndex: 2,
        willChange: 'transform',
      }}
    />
  );
}

export default WeatherEffect;
