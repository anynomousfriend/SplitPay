'use client';

import { useState, useCallback } from 'react';

export default function CheckerGrid() {
  const [key, setKey] = useState(0);

  const randomizeGrid = useCallback(() => {
    // We increment a key or trigger a state change to re-render with random scales/radii
    setKey((prev) => prev + 1);
  }, []);

  const checkers = [
    'bg-[#FF2121]', 'bg-[#FF7F00]', 'bg-[#FF80ED]', 'bg-[#FFFF00]',
    'bg-[#00FF00]', 'bg-[#007BFF]', 'bg-[#7BBFFF]', 'bg-[#7F00FF]',
    'bg-[#440000]', 'bg-[#FF80ED]', 'bg-[#FFFF00]', 'bg-[#FF7F00]',
    'bg-[#00FF00]', 'bg-[#007BFF]', 'bg-[#7BBFFF]', 'bg-[#FF2121]'
  ];

  return (
    <div 
      className="aspect-square bg-black rounded-xl overflow-hidden relative cursor-pointer"
      onClick={randomizeGrid}
    >
      <div className="grid grid-cols-4 grid-rows-4 h-full w-full">
        {checkers.map((colorClass, i) => {
          // On click, we randomize styles using inline styles since it's dynamic
          const isRandomized = key > 0;
          const scale = isRandomized ? 0.5 + Math.random() : 1;
          const borderRadius = isRandomized && Math.random() > 0.5 ? '50%' : '0%';
          
          return (
            <div
              key={`${i}-${key}`}
              className={`checker ${colorClass}`}
              style={{
                transform: `scale(${scale})`,
                borderRadius: borderRadius,
                // Automatically reset after 600ms to mimic the setTimeout logic
                animation: isRandomized ? `checkerReset 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards` : 'none'
              }}
            />
          );
        })}
      </div>
      <style jsx>{`
        @keyframes checkerReset {
          0% { }
          100% {
            transform: scale(1);
            border-radius: 0%;
          }
        }
      `}</style>
    </div>
  );
}
