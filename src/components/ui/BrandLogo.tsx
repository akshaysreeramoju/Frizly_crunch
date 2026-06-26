// Frizly Crunch Brand Logo — matches the official brand guide
// Leaf icon + stacked wordmark + tagline
import Image from 'next/image';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  /** Show only the leaf icon, no wordmark */
  iconOnly?: boolean;
}

export function BrandLogo({ size = 'md', className = '', iconOnly = false }: BrandLogoProps) {
  const iconSizes = {
    sm: 28,
    md: 40,
    lg: 56,
    hero: 80,
  };
  const iconPx = iconSizes[size];

  const titleSizes = {
    sm: '1rem',
    md: '1.4rem',
    lg: '2rem',
    hero: '2.8rem',
  };

  const taglineSizes = {
    sm: '0.38rem',
    md: '0.5rem',
    lg: '0.65rem',
    hero: '0.85rem',
  };

  const LineH = {
    sm: 1,
    md: 1.5,
    lg: 2,
    hero: 3,
  };

  return (
    <div className={`inline-flex flex-col items-center gap-0 ${className}`}>
      <div className="flex items-center gap-2 sm:gap-3">
        <Image
          src="/images/logo.png"
          alt="Frizly Crunch Logo"
          width={iconPx}
          height={iconPx}
          className="object-contain shrink-0"
        />

        {!iconOnly && (
          /* Wordmark */
          <div className="flex flex-col leading-none">
            <span
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: titleSizes[size],
                fontWeight: 700,
                color: '#2E7D32',
                letterSpacing: '0.04em',
                lineHeight: 1.05,
              }}
            >
              Frizly
            </span>
            <span
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: titleSizes[size],
                fontWeight: 700,
                color: '#4B2E1E',
                letterSpacing: '0.04em',
                lineHeight: 1.05,
              }}
            >
              Crunch
            </span>
          </div>
        )}
      </div>

      {/* Tagline — only in md and up, not iconOnly */}
      {!iconOnly && size !== 'sm' && (
        <div
          className="flex items-center gap-1.5 mt-1"
          style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: taglineSizes[size],
            fontWeight: 600,
            color: '#4B2E1E',
            letterSpacing: '0.2em',
          }}
        >
          <span style={{ height: LineH[size], width: 20, backgroundColor: '#4B2E1E', display: 'inline-block', opacity: 0.5 }} />
          REAL FOOD. REINVENTED.
          <span style={{ height: LineH[size], width: 20, backgroundColor: '#4B2E1E', display: 'inline-block', opacity: 0.5 }} />
        </div>
      )}
    </div>
  );
}
