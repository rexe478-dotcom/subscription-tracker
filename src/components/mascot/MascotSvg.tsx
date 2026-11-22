import React from 'react';
import { cn } from '@/lib/utils';

export type MascotPose =
  | 'welcome'
  | 'empty'
  | 'reminder'
  | 'celebrate'
  | 'alert'
  | 'icon';

export interface MascotProps extends React.SVGProps<SVGSVGElement> {
  pose?: MascotPose;
  size?: number | string;
}

/**
 * The Swift Familiar (Kori)
 * An original geometric/origami swift companion designed with restrained dark slate tones
 * and focused olive-green accents (#A5C96B).
 */
export const MascotSvg: React.FC<MascotProps> = ({
  pose = 'welcome',
  size = 120,
  className,
  ...props
}) => {
  if (pose === 'icon') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('shrink-0 select-none', className)}
        aria-hidden="true"
        {...props}
      >
        <rect width="32" height="32" rx="8" fill="#191D24" stroke="#2A303A" strokeWidth="1.5" />
        {/* Stylized swift wing & head silhouette */}
        <path
          d="M7 21L14 8L18 14L25 10L21 23L15 19L9 24L7 21Z"
          fill="#202630"
          stroke="#2A303A"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path
          d="M14 8L20 13L16 19L11 15L14 8Z"
          fill="#A5C96B"
          fillOpacity="0.85"
        />
        {/* Eye */}
        <circle cx="15.5" cy="11.5" r="1.5" fill="#101216" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0 select-none drop-shadow-sm', className)}
      role="img"
      aria-label={`Mascot Kori in ${pose} pose`}
      {...props}
    >
      {/* Background Soft Ambient Disc */}
      <circle cx="100" cy="100" r="76" fill="#191D24" stroke="#2A303A" strokeWidth="2" strokeDasharray="4 4" />

      {pose === 'welcome' && (
        <g id="kori-welcome">
          {/* Tail feathers */}
          <polygon points="65,145 90,130 75,170" fill="#202630" stroke="#2A303A" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="75,170 95,135 110,165" fill="#101216" stroke="#2A303A" strokeWidth="2" strokeLinejoin="round" />

          {/* Body main geometry */}
          <polygon points="85,60 135,95 90,140 60,110" fill="#1E232B" stroke="#2A303A" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="85,60 135,95 105,105 80,75" fill="#262D38" stroke="#2A303A" strokeWidth="2" strokeLinejoin="round" />

          {/* Wing - Resting folded */}
          <polygon points="80,75 145,115 125,135 85,95" fill="#2E3744" stroke="#2A303A" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="110,105 155,130 130,140" fill="#A5C96B" fillOpacity="0.9" stroke="#B9D987" strokeWidth="1.5" strokeLinejoin="round" />

          {/* Head & Beak */}
          <polygon points="85,60 115,50 100,75" fill="#2A323D" stroke="#2A303A" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="115,50 135,55 108,63" fill="#A5C96B" stroke="#B9D987" strokeWidth="1.5" strokeLinejoin="round" />

          {/* Eye with alert olive glow */}
          <circle cx="98" cy="62" r="3.5" fill="#A5C96B" />
          <circle cx="98" cy="62" r="1.5" fill="#101216" />

          {/* Perch line */}
          <line x1="55" y1="150" x2="145" y2="150" stroke="#2A303A" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}

      {pose === 'empty' && (
        <g id="kori-empty">
          {/* Perched looking down with a blank ledger */}
          <polygon points="70,140 90,125 78,165" fill="#202630" stroke="#2A303A" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="85,75 130,105 90,140 65,115" fill="#1E232B" stroke="#2A303A" strokeWidth="2" strokeLinejoin="round" />
          
          {/* Head tilted curiously */}
          <polygon points="80,75 105,70 95,95" fill="#2A323D" stroke="#2A303A" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="105,70 120,78 100,82" fill="#A5C96B" stroke="#B9D987" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="92" cy="79" r="3" fill="#A5C96B" />
          <circle cx="92" cy="79" r="1.5" fill="#101216" />

          {/* Minimal folded blank list prop */}
          <rect x="110" y="115" width="34" height="42" rx="4" fill="#202630" stroke="#2A303A" strokeWidth="2" />
          <line x1="118" y1="126" x2="136" y2="126" stroke="#7D8591" strokeWidth="2" strokeLinecap="round" />
          <line x1="118" y1="135" x2="130" y2="135" stroke="#7D8591" strokeWidth="2" strokeLinecap="round" />
          <circle cx="134" cy="144" r="3" fill="#A5C96B" />
        </g>
      )}

      {pose === 'reminder' && (
        <g id="kori-reminder">
          {/* Alert wings half-spread, glowing beacon */}
          <polygon points="50,90 95,110 70,135" fill="#262D38" stroke="#2A303A" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="95,65 155,75 125,120 85,115" fill="#1E232B" stroke="#2A303A" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="125,70 170,55 140,95" fill="#A5C96B" fillOpacity="0.9" stroke="#B9D987" strokeWidth="1.5" strokeLinejoin="round" />

          {/* Head & Beak forward */}
          <polygon points="95,65 125,50 110,75" fill="#2A323D" stroke="#2A303A" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="125,50 145,55 120,62" fill="#E5B86B" stroke="#E5B86B" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="108" cy="62" r="4" fill="#A5C96B" />
          <circle cx="108" cy="62" r="1.5" fill="#101216" />

          {/* Reminder pulse ring */}
          <circle cx="108" cy="62" r="14" stroke="#A5C96B" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="3 3" />
        </g>
      )}

      {pose === 'celebrate' && (
        <g id="kori-celebrate">
          {/* Wings lifted high */}
          <polygon points="65,130 90,115 80,155" fill="#202630" stroke="#2A303A" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="60,65 100,105 85,125 50,95" fill="#2E3744" stroke="#2A303A" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="140,65 100,105 115,125 150,95" fill="#2E3744" stroke="#2A303A" strokeWidth="2" strokeLinejoin="round" />
          
          {/* Uplifted accents */}
          <polygon points="60,65 80,45 85,75" fill="#A5C96B" stroke="#B9D987" strokeWidth="1.5" strokeLinejoin="round" />
          <polygon points="140,65 120,45 115,75" fill="#A5C96B" stroke="#B9D987" strokeWidth="1.5" strokeLinejoin="round" />

          {/* Head upwards */}
          <polygon points="90,75 110,75 100,60" fill="#2A323D" stroke="#2A303A" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="100,60 100,42 105,55" fill="#8CCB9A" stroke="#8CCB9A" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="96" cy="68" r="3" fill="#8CCB9A" />
        </g>
      )}

      {pose === 'alert' && (
        <g id="kori-alert">
          <polygon points="70,140 90,125 78,165" fill="#202630" stroke="#2A303A" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="85,75 130,105 90,140 65,115" fill="#1E232B" stroke="#2A303A" strokeWidth="2" strokeLinejoin="round" />
          {/* Vigilant orange/warning feather */}
          <polygon points="110,95 155,100 130,125" fill="#E5B86B" fillOpacity="0.9" stroke="#E5B86B" strokeWidth="1.5" strokeLinejoin="round" />
          <polygon points="80,75 110,65 98,85" fill="#2A323D" stroke="#2A303A" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="94" cy="74" r="3.5" fill="#E5B86B" />
          <circle cx="94" cy="74" r="1.5" fill="#101216" />
        </g>
      )}
    </svg>
  );
};
