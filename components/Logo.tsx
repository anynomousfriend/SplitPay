export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon 
        points="10,2 2,10 10,18" 
        fill="currentColor" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinejoin="round" 
      />
      <polygon 
        points="14,6 22,14 14,22" 
        fill="currentColor" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinejoin="round" 
        opacity="0.3" 
      />
    </svg>
  );
}
