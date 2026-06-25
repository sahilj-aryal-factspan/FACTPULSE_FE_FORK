import { useState, useEffect } from 'react';

interface TrendPoint {
  label: string;
  compliance: number;
  score: number;
  risks: number;
  closedActions: number;
}

interface GovernanceTrendsProps {
  data: TrendPoint[];
}

export default function GovernanceTrends({ data }: GovernanceTrendsProps) {
  const [activeChart, setActiveChart] = useState<'compliance' | 'score' | 'risks' | 'actions'>('compliance');
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, [activeChart]);

  // Reset animation on tab change
  const handleChartChange = (chart: typeof activeChart) => {
    setAnimated(false);
    setActiveChart(chart);
    setTimeout(() => setAnimated(true), 50);
  };

  const chartConfigs = {
    compliance: {
      label: 'Compliance Rate',
      key: 'compliance' as keyof TrendPoint,
      color: '#0D2A66',
      unit: '%',
      max: 100,
    },
    score: {
      label: 'Governance Score',
      key: 'score' as keyof TrendPoint,
      color: '#F68B1F',
      unit: '%',
      max: 100,
    },
    risks: {
      label: 'Open Risks',
      key: 'risks' as keyof TrendPoint,
      color: '#dc2626',
      unit: '',
      max: Math.max(...data.map((d) => d.risks)) + 2,
    },
    actions: {
      label: 'Closed Actions',
      key: 'closedActions' as keyof TrendPoint,
      color: '#8A3D78',
      unit: '',
      max: Math.max(...data.map((d) => d.closedActions)) + 2,
    },
  };

  const config = chartConfigs[activeChart];
  const values = data.map((d) => Number(d[config.key]));
  const maxVal = config.max;
  const chartHeight = 160;
  const chartWidth = 100; // percent-based via SVG viewBox
  const pointCount = data.length;

  // Build SVG path
  const getX = (i: number) => (i / (pointCount - 1)) * 100;
  const getY = (v: number) => chartHeight - (v / maxVal) * chartHeight;

  const polyline = values
    .map((v, i) => `${getX(i)},${animated ? getY(v) : chartHeight}`)
    .join(' ');

  const fillPath = `M${getX(0)},${chartHeight} ` +
    values.map((v, i) => `L${getX(i)},${animated ? getY(v) : chartHeight}`).join(' ') +
    ` L${getX(pointCount - 1)},${chartHeight} Z`;

  const tabStyle = (active: boolean, color: string) => ({
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    border: `1px solid ${active ? color : '#E4E7EC'}`,
    background: active ? color : '#FFFFFF',
    color: active ? '#FFFFFF' : '#64748b',
    transition: 'all 0.2s',
  });

  // Mini spark summary cards
  const latest = data[data.length - 1];
  const prev = data[data.length - 2];

  const summaryCards = [
    {
      label: 'Compliance',
      value: latest.compliance,
      prev: prev.compliance,
      unit: '%',
      color: '#0D2A66',
    },
    {
      label: 'Gov Score',
      value: latest.score,
      prev: prev.score,
      unit: '%',
      color: '#F68B1F',
    },
    {
      label: 'Open Risks',
      value: latest.risks,
      prev: prev.risks,
      unit: '',
      color: '#dc2626',
    },
    {
      label: 'Closed Actions',
      value: latest.closedActions,
      prev: prev.closedActions,
      unit: '',
      color: '#8A3D78',
    },
  ];

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E4E7EC',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(13,42,102,0.06)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E4E7EC',
          background: 'linear-gradient(135deg, rgba(13,42,102,0.02) 0%, rgba(138,61,120,0.02) 100%)',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0D2A66' }}>
          📈 Governance Trends
        </h3>
        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
          6-month trend analysis across governance dimensions
        </p>
      </div>

      {/* Summary mini-cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0',
          borderBottom: '1px solid #E4E7EC',
        }}
      >
        {summaryCards.map((card, idx) => {
          const delta = card.value - card.prev;
          const isRisk = card.label === 'Open Risks';
          const positive = isRisk ? delta <= 0 : delta >= 0;
          return (
            <div
              key={card.label}
              style={{
                padding: '14px 18px',
                borderRight: idx < 3 ? '1px solid #f1f5f9' : 'none',
                cursor: 'pointer',
                background: activeChart === Object.keys(chartConfigs)[idx] ? '#F5F6F8' : '#FFFFFF',
                transition: 'background 0.2s',
              }}
              onClick={() => handleChartChange(Object.keys(chartConfigs)[idx] as typeof activeChart)}
            >
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>
                {card.label}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: card.color }}>
                {card.value}{card.unit}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: positive ? '#16a34a' : '#dc2626',
                  marginTop: '2px',
                }}
              >
                {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}{card.unit}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Tabs */}
      <div style={{ padding: '16px 24px 0', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={() => handleChartChange('compliance')} style={tabStyle(activeChart === 'compliance', '#0D2A66')}>Compliance %</button>
        <button onClick={() => handleChartChange('score')} style={tabStyle(activeChart === 'score', '#F68B1F')}>Gov Score</button>
        <button onClick={() => handleChartChange('risks')} style={tabStyle(activeChart === 'risks', '#dc2626')}>Open Risks</button>
        <button onClick={() => handleChartChange('actions')} style={tabStyle(activeChart === 'actions', '#8A3D78')}>Closed Actions</button>
      </div>

      {/* SVG Chart Area */}
      <div style={{ padding: '16px 24px 24px', position: 'relative' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: config.color, marginBottom: '12px' }}>
          {config.label}
        </div>
        <svg
          viewBox={`0 0 100 ${chartHeight + 20}`}
          preserveAspectRatio="none"
          style={{ width: '100%', height: '180px', overflow: 'visible' }}
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((pct) => {
            const y = chartHeight - (pct / 100) * chartHeight;
            const val = Math.round((pct / 100) * maxVal);
            return (
              <g key={pct}>
                <line x1="0" y1={y} x2="100" y2={y} stroke="#f1f5f9" strokeWidth="0.5" />
                <text x="-2" y={y + 1} fontSize="4" fill="#94a3b8" textAnchor="end">
                  {val}{config.unit}
                </text>
              </g>
            );
          })}

          {/* Fill gradient */}
          <defs>
            <linearGradient id={`grad-${activeChart}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={config.color} stopOpacity="0.15" />
              <stop offset="100%" stopColor={config.color} stopOpacity="0.01" />
            </linearGradient>
          </defs>
          <path
            d={fillPath}
            fill={`url(#grad-${activeChart})`}
            style={{ transition: 'd 0.8s ease' }}
          />

          {/* Line */}
          <polyline
            points={polyline}
            fill="none"
            stroke={config.color}
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ transition: 'points 0.8s ease' }}
          />

          {/* Data points */}
          {values.map((v, i) => (
            <g key={i}>
              <circle
                cx={getX(i)}
                cy={animated ? getY(v) : chartHeight}
                r="2.5"
                fill="#FFFFFF"
                stroke={config.color}
                strokeWidth="1.5"
                style={{ transition: 'cy 0.8s ease' }}
              />
              {/* Label on X-axis */}
              <text
                x={getX(i)}
                y={chartHeight + 10}
                fontSize="4"
                fill="#94a3b8"
                textAnchor="middle"
              >
                {data[i].label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
