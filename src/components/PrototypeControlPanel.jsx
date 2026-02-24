import React, { useState, useRef, useEffect } from 'react';
import * as Icons from './icons';

const PANEL_WIDTH = 260;
const PANEL_MARGIN = 12;

// Stripe dashboard font stack
const FONT_FAMILY = '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif';

const PrototypeControlPanel = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState('left');
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [keepVisible, setKeepVisible] = useState(false);
  const [currentPos, setCurrentPos] = useState({ left: 0, bottom: PANEL_MARGIN });
  const [panelHeight, setPanelHeight] = useState(0);
  const panelRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0, left: 0, bottom: 0 });
  const initializedRef = useRef(false);
  const hasMovedRef = useRef(false);

  const getSnapPosition = (pos) => {
    if (pos === 'left') {
      return { left: PANEL_MARGIN, bottom: PANEL_MARGIN };
    } else {
      return { left: window.innerWidth - PANEL_WIDTH - PANEL_MARGIN, bottom: PANEL_MARGIN };
    }
  };

  useEffect(() => {
    if (!initializedRef.current) {
      setCurrentPos(getSnapPosition(position));
      initializedRef.current = true;
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (!isDragging && !isAnimating) {
        setCurrentPos(getSnapPosition(position));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position, isDragging, isAnimating]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        hasMovedRef.current = true;
      }

      setCurrentPos({
        left: dragStartRef.current.left + deltaX,
        bottom: dragStartRef.current.bottom - deltaY,
      });
    };

    const handleMouseUp = (e) => {
      setIsDragging(false);

      if (!hasMovedRef.current) {
        setIsCollapsed(prev => !prev);
        return;
      }

      const windowWidth = window.innerWidth;
      const mouseX = e.clientX;
      const newPosition = mouseX < windowWidth / 2 ? 'left' : 'right';

      setPosition(newPosition);
      setIsAnimating(true);
      setKeepVisible(true);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const snapPos = getSnapPosition(newPosition);
          setCurrentPos(snapPos);
        });
      });

      setTimeout(() => setIsAnimating(false), 350);
      setTimeout(() => setKeepVisible(false), 350 + 500);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleDragStart = (e) => {
    e.preventDefault();
    hasMovedRef.current = false;

    if (panelRef.current) {
      setPanelHeight(panelRef.current.offsetHeight);
    }

    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      left: currentPos.left,
      bottom: currentPos.bottom,
    };

    setIsDragging(true);
  };

  if (!children) {
    return null;
  }

  const isLeftZoneActive = currentPos.left < (window.innerWidth - PANEL_WIDTH) / 2;

  return (
    <>
      {isDragging && (
        <>
          <div
            className={`fixed bottom-3 left-3 z-40 rounded-lg transition-colors ${isLeftZoneActive ? 'bg-blue-400/20' : 'bg-gray-400/10'}`}
            style={{ width: PANEL_WIDTH, height: panelHeight }}
          />
          <div
            className={`fixed bottom-3 right-3 z-40 rounded-lg transition-colors ${!isLeftZoneActive ? 'bg-blue-400/20' : 'bg-gray-400/10'}`}
            style={{ width: PANEL_WIDTH, height: panelHeight }}
          />
        </>
      )}

      <div
        ref={panelRef}
        className={`fixed z-50 ${isDragging ? 'cursor-grabbing' : ''} ${isDragging || isAnimating || keepVisible ? 'opacity-100' : isCollapsed ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
        style={{
          left: currentPos.left,
          bottom: currentPos.bottom,
          transition: isAnimating ? 'left 300ms cubic-bezier(0.22, 1, 0.36, 1), bottom 300ms cubic-bezier(0.22, 1, 0.36, 1)' : isDragging ? 'none' : 'opacity 500ms',
          fontFamily: FONT_FAMILY,
        }}
      >
        <div className="bg-white shadow-lg border border-gray-200 overflow-hidden" style={{ width: `${PANEL_WIDTH}px`, borderRadius: '8px' }}>
          {/* Header */}
          <div
            className="flex items-center justify-between px-3 py-2 bg-gray-50 cursor-grab active:cursor-grabbing hover:bg-gray-100 transition-colors select-none"
            onMouseDown={handleDragStart}
          >
            <div className="flex items-center gap-1.5 pointer-events-none">
              <Icons.SettingsIcon />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#353A44', letterSpacing: '0.01em' }}>Controls</span>
            </div>
            <div className={`text-gray-400 transition-transform duration-200 pointer-events-none ${isCollapsed ? 'rotate-180' : ''}`}>
              <Icons.ChevronDownIcon size={10} />
            </div>
          </div>

          {/* Controls */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[80vh] opacity-100'}`}
            style={{ overflowY: isCollapsed ? 'hidden' : 'auto' }}
          >
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrototypeControlPanel;
