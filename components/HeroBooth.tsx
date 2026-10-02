import { PhotoFrame } from "@/components/PrintPreview";

/**
 * Illustrated traditional booth (camera, live monitor, printer) that prints a strip once on load.
 * Shapes echo the Pictopia mascot camera: cream body, golden lens, espresso outline.
 */
export function HeroBooth({ className = "" }: { className?: string }) {
  const stroke = { stroke: "#2e1b0e", strokeWidth: 5, strokeLinejoin: "round" as const };
  return (
    <svg
      viewBox="0 0 420 520"
      className={className}
      role="img"
      aria-label="Illustration of a Pictopia photobooth printing a photo strip"
    >
      {/* splash marks from the logo */}
      <g fill="#f07c1b" {...stroke} strokeWidth={4}>
        <path d="M36 92 l26 14 -8 10 -24 -16 Z" />
        <path d="M30 140 l30 -2 0 13 -30 3 Z" />
        <path d="M384 92 l-26 14 8 10 24 -16 Z" />
        <path d="M390 140 l-30 -2 0 13 30 3 Z" />
      </g>

      {/* stand */}
      <g {...stroke} fill="none" strokeLinecap="round">
        <path d="M210 330 L210 470" />
        <path d="M210 420 L150 506" />
        <path d="M210 420 L270 506" />
      </g>

      {/* printer + strip (strip slides out of the slot) */}
      <defs>
        <clipPath id="hero-strip-clip">
          <rect x="250" y="388" width="140" height="132" />
        </clipPath>
      </defs>
      <g clipPath="url(#hero-strip-clip)">
        <g className="print-strip">
          <rect x="286" y="388" width="74" height="128" fill="#fff" {...stroke} strokeWidth={3} />
          <PhotoFrame x={292} y={394} w={62} h={34} pose={0} color="pink" finish="sequin" />
          <PhotoFrame x={292} y={433} w={62} h={34} pose={1} color="pink" finish="sequin" />
          <PhotoFrame x={292} y={472} w={62} h={34} pose={2} color="pink" finish="sequin" />
        </g>
      </g>
      <rect x="262" y="344" width="122" height="52" rx="10" fill="#fff1bf" {...stroke} />
      <rect x="280" y="380" width="86" height="8" rx="3" fill="#2e1b0e" />
      <circle cx="364" cy="362" r="5" fill="#f07c1b" />

      {/* camera body */}
      <rect x="150" y="38" width="120" height="44" rx="14" fill="#ffd866" {...stroke} />
      <circle cx="210" cy="58" r="6" fill="#2e1b0e" />
      <rect x="72" y="70" width="276" height="176" rx="30" fill="#fff1bf" {...stroke} />
      <path d="M72 150 h276 v66 a30 30 0 0 1 -30 30 h-216 a30 30 0 0 1 -30 -30 Z" fill="#f07c1b" {...stroke} />
      <rect x="92" y="88" width="46" height="28" rx="8" fill="#fff" {...stroke} strokeWidth={4} />
      <rect x="290" y="88" width="40" height="20" rx="6" fill="#ffc72c" {...stroke} strokeWidth={4} />

      {/* lens */}
      <circle cx="210" cy="158" r="78" fill="#ffc72c" {...stroke} />
      <circle cx="210" cy="158" r="58" fill="#fff1bf" {...stroke} strokeWidth={4} />
      <circle cx="210" cy="158" r="44" fill="#ffc72c" {...stroke} strokeWidth={4} />
      <circle cx="210" cy="158" r="31" fill="#1d120a" {...stroke} strokeWidth={4} />
      <circle cx="222" cy="146" r="9" fill="#fff" />
      <circle cx="230" cy="162" r="4" fill="#fff" />

      {/* live monitor with countdown */}
      <rect x="134" y="262" width="152" height="84" rx="12" fill="#2e1b0e" {...stroke} />
      <rect x="146" y="272" width="128" height="64" rx="6" fill="#6f9fd8" />
      <text
        x="210"
        y="306"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-fredoka), sans-serif"
        fontWeight="700"
        fontSize="40"
        fill="#fff"
        stroke="#2e1b0e"
        strokeWidth="2"
      >
        3
      </text>
    </svg>
  );
}
