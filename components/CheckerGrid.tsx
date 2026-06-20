'use client';

export default function CheckerGrid() {
  // Relaxing, soft pastel and muted palette (eliminating harsh pure hex colors)
  const checkers = [
    'bg-blue-200', 'bg-indigo-200', 'bg-violet-200', 'bg-fuchsia-200',
    'bg-sky-200',  'bg-blue-300',   'bg-indigo-300', 'bg-purple-200',
    'bg-teal-200', 'bg-cyan-200',   'bg-sky-300',    'bg-blue-200',
    'bg-emerald-200','bg-teal-300', 'bg-cyan-300',   'bg-sky-200'
  ];

  return (
    <div className="aspect-square bg-slate-50/50 rounded-xl overflow-hidden relative border border-slate-100">
      <div className="grid grid-cols-4 grid-rows-4 h-full w-full gap-1 p-2">
        {checkers.map((colorClass, i) => {
          // Create a diagonal wave delay pattern
          const x = i % 4;
          const y = Math.floor(i / 4);
          const delay = (x + y) * 0.5;
          
          return (
            <div
              key={i}
              className={`w-full h-full ${colorClass} relaxing-cell`}
              style={{
                animationDelay: `${delay}s`
              }}
            />
          );
        })}
      </div>
      <style jsx>{`
        .relaxing-cell {
          border-radius: 8px;
          opacity: 0.7;
          /* Smooth, slow infinite animation */
          animation: breathe 8s ease-in-out infinite alternate;
        }

        @keyframes breathe {
          0% {
            transform: scale(1);
            border-radius: 8px;
            opacity: 0.7;
          }
          33% {
            transform: scale(0.85);
            border-radius: 50%;
            opacity: 1;
          }
          66% {
            transform: scale(0.92);
            border-radius: 16px;
            opacity: 0.85;
          }
          100% {
            transform: scale(0.75);
            border-radius: 40%;
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
}
