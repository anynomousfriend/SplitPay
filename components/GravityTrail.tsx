'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const SVGS = [
  // Coin
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 18V6"></path></svg>`,
  // Wallet
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>`,
  // Receipt
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"></path><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 17.5v-11"></path></svg>`,
  // Bolt
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  // Sparkle
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path></svg>`
];

const COLORS = ['#eab308', '#ffffff', '#09090b', '#facc15', '#a1a1aa']; // Neon Yellow, White, Black, Lighter Yellow, Zinc-400

export default function GravityTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const isEnabled = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const parent = container.parentElement;
    if (!parent) return;
    
    // Respect user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      isEnabled.current = false;
      return;
    }

    let lastTime = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isEnabled.current) return;
      
      const now = Date.now();
      // Throttle spawn rate (only every 40ms)
      if (now - lastTime < 40) return;
      
      // Calculate distance to avoid spawning when mouse is slow/still
      const dist = Math.hypot(e.clientX - lastMousePos.current.x, e.clientY - lastMousePos.current.y);
      if (dist < 25) return; 
      
      lastTime = now;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      
      spawnElement(e.clientX, e.clientY);
    };

    const spawnElement = (clientX: number, clientY: number) => {
      const el = document.createElement('div');
      
      const svg = SVGS[Math.floor(Math.random() * SVGS.length)];
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const size = Math.floor(Math.random() * 16) + 24; // 24px to 40px
      
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      el.innerHTML = svg;
      el.style.position = 'absolute';
      el.style.left = `${x - size/2}px`;
      el.style.top = `${y - size/2}px`;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.color = color;
      el.style.pointerEvents = 'none';
      el.style.zIndex = '0';
      el.style.opacity = '1';
      
      // Some filter glow depending on color for extra polish
      el.style.filter = `drop-shadow(0 4px 6px ${color}40)`;

      container.appendChild(el);

      // GSAP Physics Animation
      const duration = Math.random() * 0.8 + 1.2;
      const xOffset = (Math.random() - 0.5) * 200; // scatter horizontally
      const initialRotation = (Math.random() - 0.5) * 90;
      const finalRotation = initialRotation + (Math.random() - 0.5) * 360;
      
      // Initial state
      gsap.set(el, {
        scale: 0.5,
        rotation: initialRotation,
      });

      // Animate entry (pop in)
      gsap.to(el, {
        scale: 1,
        duration: 0.3,
        ease: "back.out(1.7)"
      });

      // Animate gravity/bounce
      gsap.to(el, {
        y: rect.height - y - size, // Fall to bottom of container
        x: `+=${xOffset}`,
        rotation: finalRotation,
        ease: "bounce.out",
        duration: duration,
      });

      // Animate exit (fade out)
      gsap.to(el, {
        opacity: 0,
        scale: 0.5,
        duration: 0.4,
        delay: duration - 0.2, // Start fading just before it stops bouncing
        onComplete: () => {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        }
      });
    };

    parent.addEventListener('mousemove', handleMouseMove);

    return () => {
      parent.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <div ref={containerRef} className="pointer-events-none absolute inset-0 z-[0] overflow-hidden" />;
}
