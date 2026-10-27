import { useEffect, useRef } from 'react';

/** Lightweight text-stamp cursor trail for a positioned parent element. */
export default function TextCursor({
  text = 'Hello', mode = 'stamp', fontSize = 28, spacing = 88, maxPoints = 7,
  shrink = 0.5, fade = 0.6, smoothing = 0.3, exitDuration = 0.5,
  removalInterval = 30, followMouseDirection = false, keepUpright = false,
  randomFloat = false, popIn = false, hideCursor = false,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext('2d');
    if (!canvas || !host || !context || mode !== 'stamp') return undefined;

    let width = 0;
    let height = 0;
    let frame = 0;
    let lastStamp = null;
    let lastPoint = null;
    const stamps = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    const addStamp = (x, y, angle) => {
      stamps.push({ x, y, angle, born: performance.now(), floatX: 0, floatY: 0, seed: Math.random() * Math.PI * 2 });
      while (stamps.length > maxPoints) stamps.shift();
    };
    const onMove = event => {
      const bounds = host.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
        lastPoint = null;
        lastStamp = null;
        return;
      }
      const point = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      if (!lastStamp) {
        lastStamp = point;
        addStamp(point.x, point.y, 0);
      } else {
        const dx = point.x - lastStamp.x;
        const dy = point.y - lastStamp.y;
        const angle = followMouseDirection && !keepUpright ? Math.atan2(point.y - (lastPoint?.y ?? point.y), point.x - (lastPoint?.x ?? point.x)) : 0;
        const distance = Math.hypot(dx, dy);
        if (distance >= spacing) {
          const steps = Math.floor(distance / Math.max(1, spacing));
          for (let i = 1; i <= steps; i += 1) {
            const x = lastStamp.x + (dx * i) / steps;
            const y = lastStamp.y + (dy * i) / steps;
            addStamp(x, y, angle);
          }
          lastStamp = { x: lastStamp.x + (dx * steps) / steps, y: lastStamp.y + (dy * steps) / steps };
        }
      }
      lastPoint = point;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let lastRemoval = 0;
    const draw = now => {
      context.clearRect(0, 0, width, height);
      if (now - lastRemoval >= removalInterval) {
        lastRemoval = now;
        for (let i = stamps.length - 1; i >= 0; i -= 1) {
          if ((now - stamps[i].born) / 1000 >= exitDuration) stamps.splice(i, 1);
        }
      }
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      stamps.forEach(stamp => {
        const progress = Math.min(1, (now - stamp.born) / Math.max(1, exitDuration * 1000));
        const alpha = Math.max(0, 1 - progress * fade);
        const scale = 1 - progress * shrink;
        const float = randomFloat ? Math.sin(now / 650 + stamp.seed) * 2 : 0;
        context.save();
        context.globalAlpha = alpha;
        context.translate(stamp.x + float, stamp.y - float);
        context.rotate(stamp.angle);
        context.scale(scale, scale);
        context.font = `500 ${fontSize}px "Instrument Serif", Georgia, serif`;
        context.fillStyle = '#14231f';
        if (popIn) context.globalAlpha *= Math.min(1, progress * 5 + 0.2);
        context.fillText(text, 0, 0);
        context.restore();
      });
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, [text, mode, fontSize, spacing, maxPoints, shrink, fade, smoothing, exitDuration, removalInterval, followMouseDirection, keepUpright, randomFloat, popIn]);

  return <canvas ref={canvasRef} className={`text-cursor-canvas${hideCursor ? ' hide-native-cursor' : ''}`} aria-hidden="true" />;
}
