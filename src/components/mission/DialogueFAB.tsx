const FAB_STYLE: React.CSSProperties = {
  position: 'fixed',
  bottom: 'calc(var(--nav-h) + env(safe-area-inset-bottom) + var(--s-3))',
  right: 'calc(12.5vw - 28px)',
  width: 56,
  height: 56,
  borderRadius: '50%',
  border: '1px solid rgba(255,255,255,0.2)',
  background: 'rgba(31, 58, 104, 0.82)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxShadow: '0 4px 20px rgba(31,58,104,0.35)',
  color: 'white',
  cursor: 'pointer',
  zIndex: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
};

const ArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const MapIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </svg>
);

interface DialogueFABProps {
  onClick: () => void;
  isLast: boolean;
  isOutro?: boolean;
  ariaLabel?: string;
}

export const DialogueFAB = ({ onClick, isLast, isOutro = false, ariaLabel }: DialogueFABProps) => {
  const showMap = isLast && isOutro;
  const label = ariaLabel ?? (showMap ? 'マップに戻る' : isLast ? '次のシーンへ' : '続きを読む');
  return (
    <button onClick={onClick} className="dialogue-fab" aria-label={label} style={FAB_STYLE}>
      {showMap ? <MapIcon /> : <ArrowIcon />}
    </button>
  );
};
