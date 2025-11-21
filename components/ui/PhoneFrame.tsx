import { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
}

export default function PhoneFrame({ children, className = '' }: PhoneFrameProps) {
  return (
    <div className={`
      w-[377px] h-[814px] 
      border-2 border-slate-200/50 
      rounded-[3rem] 
      shadow-2xl 
      overflow-hidden 
      relative 
      bg-gradient-to-br from-white to-orange-50/50 
      transform hover:scale-[1.02] 
      transition-all duration-500
      ${className}
    `}>
      {children}
    </div>
  );
}