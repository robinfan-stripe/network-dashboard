const sizes = {
  sm: 'text-xs px-2 py-1 mb-1 text-xs',
  md: 'text-sm px-2.5 py-1.5 mb-1 text-sm',
  lg: 'text-base px-3 py-2 mb-1 text-sm',
};

const Tab = ({ label, active, onClick, size = 'md', isFirst = false }) => (
  <button
    onClick={onClick}
    className={`relative font-semibold cursor-pointer rounded-lg transition-colors ${sizes[size]} ${isFirst ? 'ml-[-8px]' : ''} ${active ? 'text-brand hover:bg-brand/10' : 'text-subdued hover:text-default hover:bg-offset'
      }`}
  >
    {label}
    {active && (
      <span className={`absolute bottom-[-5px] left-2.5 right-2.5 bg-brand h-[2px]`} />
    )}
  </button>
);

const Tabs = ({ tabs, activeTab, onTabChange, size = 'md', children }) => {
  return (
    <div>
      <div className="flex gap-2 border-b border-border">
        {tabs.map((tab, index) => (
          <Tab
            key={tab.key}
            label={tab.label}
            active={activeTab === tab.key}
            onClick={() => onTabChange(tab.key)}
            size={size}
            isFirst={index === 0}
          />
        ))}
      </div>
      {children && <div className="pt-4">{children}</div>}
    </div>
  );
};

export default Tabs;
