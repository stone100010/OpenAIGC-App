import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  rounded?: 'xl' | '2xl' | '3xl';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function GlassCard({ 
  children, 
  className = '', 
  rounded = '3xl', 
  padding = 'lg' 
}: GlassCardProps) {
  const roundedClasses = {
    'xl': 'rounded-2xl',
    '2xl': 'rounded-3xl', 
    '3xl': 'rounded-3xl'
  };

  const paddingClasses = {
    'sm': 'p-6',
    'md': 'p-6',
    'lg': 'p-8',
    'xl': 'p-8'
  };

  return (
    <div className={`
      glass 
      ${roundedClasses[rounded]} 
      ${paddingClasses[padding]} 
      card-hover 
      ${className}
    `}>
      {children}
    </div>
  );
}