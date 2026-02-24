import React from 'react';

const EmbeddedButton = ({
  children,
  variant = 'secondary',
  size = 'md',
  className = '',
  themeColor = '#0085FF',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-sm transition-colors duration-100 gap-1.5 h-[30px]';
  const variants = {
    primary: 'text-white hover:opacity-80',
    secondary: 'bg-[#EBEEF1] text-gray-700 border border-[#EBEEF1] hover:bg-gray-200 hover:border-gray-300',
  };
  const sizes = {
    md: 'px-2 py-1 text-sm',
  };

  const style = variant === 'primary' ? { backgroundColor: themeColor } : {};

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};

export default EmbeddedButton;
