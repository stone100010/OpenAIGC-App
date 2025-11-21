interface LineChartProps {
  className?: string;
}

export default function LineChart({ className = '' }: LineChartProps) {
  return (
    <svg className={`w-full h-32 ${className}`} viewBox="0 0 300 80">
      <defs>
        <linearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b"/>
          <stop offset="50%" stopColor="#fbbf24"/>
          <stop offset="100%" stopColor="#f59e0b"/>
        </linearGradient>
      </defs>
      <path 
        className="line-chart stroke-[3px] fill-none" 
        d="M20 60 L80 40 L140 25 L200 35 L260 15" 
        stroke="url(#chartGrad)" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle cx="20" cy="60" r="4" fill="#f59e0b" className="opacity-0 animate-pulse delay-500"/>
      <circle cx="80" cy="40" r="4" fill="#f59e0b" className="opacity-0 animate-pulse delay-1000"/>
      <circle cx="140" cy="25" r="4" fill="#f59e0b" className="opacity-0 animate-pulse delay-1500"/>
      <circle cx="200" cy="35" r="4" fill="#f59e0b" className="opacity-0 animate-pulse delay-2000"/>
      <circle cx="260" cy="15" r="4" fill="#f59e0b" className="opacity-0 animate-pulse delay-2500"/>
    </svg>
  );
}