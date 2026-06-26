import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center gap-2 font-body font-semibold tracking-wide rounded-[40px] transition-all duration-300 overflow-hidden relative";
    
    const variants = {
      primary: `
        bg-gradient-to-br from-brand-burgundy to-brand-burgundy-lt text-white shadow-[0_8px_32px_rgba(107,30,30,0.15)]
        hover:translate-y-[-2px] hover:shadow-[0_20px_60px_rgba(107,30,30,0.20)]
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-brand-gold before:to-brand-gold-lt before:opacity-0 hover:before:opacity-100 before:transition-opacity
      `,
      outline: "border-2 border-brand-burgundy text-brand-burgundy hover:bg-brand-burgundy hover:text-white hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(107,30,30,0.15)]",
      ghost: "text-brand-burgundy hover:bg-brand-burgundy/10"
    };

    const sizes = {
      sm: "px-6 py-3 text-sm min-h-[44px]",
      md: "px-8 py-3.5 text-sm",
      lg: "px-10 py-4 text-base"
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
