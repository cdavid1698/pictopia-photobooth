import { useId } from "react";
import { backdrops, type BackdropColor, type BackdropFinish, type PrintFormat, type TierId } from "@/content/packages";

const SKIN = ["#8d5a3b", "#c68b5e", "#a86b45", "#e0a878"];
const SHIRT = ["#f07c1b", "#ffc72c", "#ffffff", "#b4500a", "#6f9fd8", "#f2a7c3"];

type Prop = "hat" | "glasses" | "none";

function Guest({ x, y, s, i, prop }: { x: number; y: number; s: number; i: number; prop: Prop }) {
  const skin = SKIN[i % SKIN.length];
  const shirt = SHIRT[(i * 2 + 1) % SHIRT.length];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-22 40 Q-22 14 0 14 Q22 14 22 40 Z" fill={shirt} stroke="#2e1b0e" strokeWidth="2.5" />
      <circle cx="0" cy="0" r="12" fill={skin} stroke="#2e1b0e" strokeWidth="2.5" />
      <path d="M-12 -2 Q-12 -14 0 -14 Q12 -14 12 -2 Q6 -8 0 -8 Q-6 -8 -12 -2 Z" fill="#2e1b0e" />
      <path d="M-4 5 Q0 8 4 5" stroke="#2e1b0e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {prop === "hat" ? (
        <path d="M-7 -11 L0 -30 L7 -11 Z" fill="#ffc72c" stroke="#2e1b0e" strokeWidth="2.2" strokeLinejoin="round" />
      ) : null}
      {prop === "glasses" ? (
        <g fill="#2e1b0e">
          <rect x="-10" y="-3" width="8" height="5" rx="1.5" />
          <rect x="2" y="-3" width="8" height="5" rx="1.5" />
          <rect x="-2" y="-2" width="4" height="1.5" />
        </g>
      ) : null}
    </g>
  );
}

/** One photo frame: the chosen backdrop with a few illustrated guests posing. */
export function PhotoFrame({
  x,
  y,
  w,
  h,
  pose,
  color,
  finish,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  pose: number;
  color: BackdropColor;
  finish: BackdropFinish;
}) {
  const uid = useId().replace(/:/g, "");
  const fill = backdrops.colors.find((c) => c.id === color)?.hex ?? "#f7f7f7";
  const count = (pose % 3) + 1;
  const scale = Math.min(w, h) / 90;
  const props: Prop[] = ["hat", "glasses", "none"];
  const spacing = w / (count + 1);
  return (
    <g>
      <defs>
        <clipPath id={`c${uid}`}>
          <rect x={x} y={y} width={w} height={h} rx="2" />
        </clipPath>
        <pattern id={`p${uid}`} width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill="#fff" opacity="0.55" />
          <circle cx="6" cy="6" r="1.1" fill="#2e1b0e" opacity="0.12" />
        </pattern>
      </defs>
      <g clipPath={`url(#c${uid})`}>
        <rect x={x} y={y} width={w} height={h} fill={fill} />
        {finish === "sequin" ? <rect x={x} y={y} width={w} height={h} fill={`url(#p${uid})`} /> : null}
        {Array.from({ length: count }, (_, i) => (
          <Guest
            key={i}
            x={x + spacing * (i + 1)}
            y={y + h - 34 * scale + (i % 2) * 3 * scale}
            s={scale}
            i={pose + i}
            prop={props[(pose + i) % props.length]}
          />
        ))}
      </g>
      <rect x={x} y={y} width={w} height={h} rx="2" fill="none" stroke="#2e1b0e" strokeWidth="2" />
    </g>
  );
}

type Layout = { vw: number; vh: number; frames: [number, number, number, number][]; footer: [number, number, number, number] };

function layoutFor(tier: TierId, format: PrintFormat): Layout {
  const m = 10;
  if (format === "strip") {
    // 2x6 strip: 3 photos + footer (4 when room allows)
    const vw = 120;
    const vh = 360;
    const n = tier === "multi" ? 4 : 3;
    const fh = (vh - 60 - m * (n + 1)) / n;
    return {
      vw,
      vh,
      frames: Array.from({ length: n }, (_, i) => [m, m + i * (fh + m), vw - 2 * m, fh]),
      footer: [m, vh - 50, vw - 2 * m, 40],
    };
  }
  if (format === "polaroid") {
    return { vw: 220, vh: 264, frames: [[14, 14, 192, 192]], footer: [14, 214, 192, 40] };
  }
  const portrait = format === "4x6-portrait";
  const vw = portrait ? 200 : 300;
  const vh = portrait ? 300 : 200;
  const footerH = 36;
  const areaH = vh - footerH - 2 * m;
  const areaW = vw - 2 * m;
  let frames: Layout["frames"];
  if (tier === "one") frames = [[m, m, areaW, areaH]];
  else if (tier === "two")
    frames = portrait
      ? [
          [m, m, areaW, (areaH - m) / 2],
          [m, m + (areaH - m) / 2 + m, areaW, (areaH - m) / 2],
        ]
      : [
          [m, m, (areaW - m) / 2, areaH],
          [m + (areaW - m) / 2 + m, m, (areaW - m) / 2, areaH],
        ];
  else {
    const cw = (areaW - m) / 2;
    const ch = (areaH - m) / 2;
    frames = [
      [m, m, cw, ch],
      [m + cw + m, m, cw, ch],
      [m, m + ch + m, cw, ch],
      [m + cw + m, m + ch + m, cw, ch],
    ];
  }
  return { vw, vh, frames, footer: [m, vh - footerH - 2, areaW, footerH - 4] };
}

/** A drawn print showing the real layout for a price tier. */
export function PrintPreview({
  tier,
  format,
  color = "white",
  finish = "sequin",
  className = "",
  title,
}: {
  tier: TierId;
  format: PrintFormat;
  color?: BackdropColor;
  finish?: BackdropFinish;
  className?: string;
  title: string;
}) {
  const l = layoutFor(tier, format);
  const [fx, fy, fw, fh] = l.footer;
  return (
    <svg viewBox={`-2 -2 ${l.vw + 8} ${l.vh + 8}`} className={className} role="img" aria-label={title}>
      <rect x="4" y="4" width={l.vw} height={l.vh} rx="4" fill="#2e1b0e" />
      <rect x="0" y="0" width={l.vw} height={l.vh} rx="4" fill="#fff" stroke="#2e1b0e" strokeWidth="2.5" />
      {l.frames.map(([x, y, w, h], i) => (
        <PhotoFrame key={i} x={x} y={y} w={w} h={h} pose={i} color={color} finish={finish} />
      ))}
      <text
        x={fx + fw / 2}
        y={fy + fh / 2 - (format === "strip" ? 4 : 0)}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-fredoka), sans-serif"
        fontWeight="600"
        fontSize={format === "strip" ? 11 : 14}
        fill="#2e1b0e"
      >
        Your names here
      </text>
      <text
        x={fx + fw / 2}
        y={fy + fh / 2 + (format === "strip" ? 10 : 14)}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-figtree), sans-serif"
        fontSize={format === "strip" ? 8 : 9}
        fill="#5a4232"
      >
        your event · your date
      </text>
    </svg>
  );
}
