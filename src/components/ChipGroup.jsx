/**
 * A single selectable chip/pill button.
 *
 * @param {string}  label    – Display text
 * @param {boolean} active   – Whether the chip is currently selected
 * @param {Function} onClick – Click handler
 */
export function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`transition-colors focus:outline-none cursor-pointer shrink-0 ${
        active
          ? 'text-white'
          : 'border border-border bg-surface hover:bg-[#F0F1F4]'
      }`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '36px',
        padding: '0 12px',
        borderRadius: '10px',
        color: active ? undefined : '#1A2C44',
        background: active ? 'rgb(39, 57, 81)' : undefined,
        border: active ? 'none' : undefined,
        fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: '14px',
        fontWeight: 600,
        lineHeight: '20px',
        letterSpacing: '-0.15px',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

/**
 * A horizontal row of selectable chips. Only one can be active at a time.
 *
 * @param {Array<{id: string, label: string}>} items – Chip definitions
 * @param {string}   value    – Currently selected chip id
 * @param {Function} onChange – Called with the new chip id on selection
 * @param {string}   [className] – Optional wrapper class
 */
export function ChipGroup({ items, value, onChange, className = '' }) {
  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`} style={{ rowGap: '8px' }}>
      {items.map((item) => (
        <Chip
          key={item.id}
          label={item.label}
          active={value === item.id}
          onClick={() => onChange(item.id)}
        />
      ))}
    </div>
  );
}

export default ChipGroup;
