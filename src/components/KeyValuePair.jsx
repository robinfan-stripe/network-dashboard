const KeyValuePair = ({
  label,
  value,
  variant = 'default',
  labelWidth = 'w-40',
  className = '',
}) => {
  if (variant === 'stack') {
    return (
      <div className={`flex flex-col items-start ${className}`}>
        <span className="w-full mb-0.5 text-sm text-subdued flex-shrink-0">{label}</span>
        <span className="text-sm text-default">{value}</span>
      </div>
    );
  }

  if (variant === 'justified') {
    return (
      <div className={`flex justify-between items-start ${className}`}>
        <span className="text-sm text-subdued">{label}</span>
        <span className="text-sm text-default text-right">{value}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-start ${className}`}>
      <span className={`text-sm text-subdued ${labelWidth} flex-shrink-0`}>{label}</span>
      <span className="text-sm text-default">{value}</span>
    </div>
  );
};

export default KeyValuePair;
