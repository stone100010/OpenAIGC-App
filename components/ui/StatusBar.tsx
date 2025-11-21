interface StatusBarProps {
  className?: string;
}

export default function StatusBar({ className = '' }: StatusBarProps) {
  return (
    <div className={`status-bar absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-6 text-xs font-bold text-white z-50 ${className}`}>
      <span>9:41</span>
      <div className="flex items-center gap-2">
        <i className="fas fa-signal text-white text-xs"></i>
        <i className="fas fa-wifi text-white text-xs"></i>
        <i className="fas fa-battery-three-quarters text-white text-xs"></i>
      </div>
    </div>
  );
}