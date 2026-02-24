import React, { useEffect, useState } from 'react';
import * as Icons from './icons';

const sizes = {
  small: 368,
  medium: 496,
  large: 648,
  xlarge: 944,
};

const Dialog = ({
  isOpen,
  onClose,
  onBack,
  header,
  subheader,
  children,
  footer,
  size = 'medium',
  showCloseButton = true,
  themeColor = '#0085FF',
  hideBackdrop = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Small delay to ensure the element is rendered before animating
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const width = sizes[size] || sizes.medium;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${hideBackdrop ? 'pointer-events-none' : ''}`}>
      {/* Backdrop */}
      {!hideBackdrop && (
        <div
          className={`absolute inset-0 transition-opacity duration-200 ${isVisible ? 'bg-black/30' : 'bg-black/0'
            }`}
          onClick={onClose}
        />
      )}

      {/* Dialog */}
      <div
        className={`relative bg-white rounded-lg shadow-xl flex flex-col max-h-[90vh] transition-all duration-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } ${hideBackdrop ? 'pointer-events-auto' : ''}`}
        style={{ width }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-200">
          <div className="flex-1 flex items-start gap-2 min-w-0">
            {onBack && (
              <button
                onClick={onBack}
                className="text-gray-400 transition-colors p-1 cursor-pointer hover:bg-gray-100 hover:text-gray-700 rounded-sm -ml-1 mt-0.5 flex-shrink-0"
              >
                <Icons.ArrowLeftIcon size={16} />
              </button>
            )}
            <div className="flex-1 min-w-0">
              {header && (
                <h2 className="text-lg font-semibold text-gray-900">{header}</h2>
              )}
              {subheader && (
                <p className="text-sm text-gray-500 mt-1">{subheader}</p>
              )}
            </div>
          </div>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-800 transition-colors p-1.5 cursor-pointer hover:bg-gray-100 hover:text-gray-700 rounded-sm flex-shrink-0"
            >
              <Icons.CloseIcon />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dialog;
