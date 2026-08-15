import React from 'react';

// K&G design tokens (直値: SVG属性でCSS変数が使えない属性に備え明示)
const KG_ACCENT        = '#1F3A68';
const KG_ACCENT_FILL   = 'rgba(31,58,104,0.13)';
const KG_RULE_SOFT     = '#ECE9E0';
const KG_INK           = '#1A1D24';
const KG_INK_3         = '#6B7280';

interface RadarChartProps {
  labels: string[];
  values: number[]; // 0-100
  size?: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ labels, values, size = 280 }) => {
  const cx = size / 2;
  const cy = size / 2;
  const levels = 4;
  const max = 100;
  const angleStep = (Math.PI * 2) / labels.length;

  const toPoint = (value: number, i: number) => {
    const radius = (value / max) * (size / 2 - 34);
    const angle = -Math.PI / 2 + i * angleStep;
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
  };

  const ringCircles = Array.from({ length: levels }, (_, idx) => {
    const radius = ((idx + 1) / levels) * (size / 2 - 32);
    return (
      <circle
        key={idx}
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={KG_RULE_SOFT}
        strokeWidth="1"
        strokeDasharray="4 6"
      />
    );
  });

  const polygonPoints = values.map((v, i) => toPoint(v, i).join(',')).join(' ');

  const getLabelPosition = (i: number) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const radius = size / 2 - 18;
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, angle] as const;
  };

  const pad = 28;

  return (
    <div className="radar-wrapper" style={{ width: '100%', maxWidth: size + pad * 2, margin: '0 auto', position: 'relative' }}>
      <svg
        width="100%"
        height="auto"
        preserveAspectRatio="xMidYMid meet"
        viewBox={`${-pad} ${-pad} ${size + pad * 2} ${size + pad * 2}`}
        style={{ overflow: 'visible' }}
      >
        {/* 目盛り円 */}
        {ringCircles}

        {/* 軸ライン */}
        {labels.map((_, i) => {
          const [x, y] = toPoint(100, i);
          return (
            <line key={i} x1={cx} y1={cy} x2={x} y2={y}
              stroke={KG_RULE_SOFT} strokeWidth="1" />
          );
        })}

        {/* データポリゴン */}
        <polygon
          points={polygonPoints}
          fill={KG_ACCENT_FILL}
          stroke={KG_ACCENT}
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* データ点 + ラベル */}
        {values.map((v, i) => {
          const [x, y] = toPoint(v, i);
          const [labelX, labelY, angle] = getLabelPosition(i);
          const anchor = labelX > cx + 4 ? 'start' : labelX < cx - 4 ? 'end' : 'middle';
          const lineOffset = Math.sin(angle) > 0.25 ? 10 : Math.sin(angle) < -0.25 ? -10 : 0;

          return (
            <g key={i}>
              <circle cx={x} cy={y} r={4} fill="#fff" stroke={KG_ACCENT} strokeWidth="1.5" />
              <text x={labelX} y={labelY} textAnchor={anchor} fontWeight="700" fontSize={11}
                fontFamily="'Noto Sans JP', sans-serif" fill={KG_INK}>
                <tspan x={labelX} dy={lineOffset}>{labels[i]}</tspan>
                <tspan x={labelX} dy="1.35em" fill={KG_INK_3} fontSize={9}
                  fontFamily="'Lato', sans-serif" fontWeight="400">{v}%</tspan>
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default RadarChart;
