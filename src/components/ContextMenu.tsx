import React, { useState, useEffect, useRef } from 'react';

interface ContextMenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  onClose?: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ items, onClose }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const x = e.clientX;
      const y = e.clientY;

      // Ensure menu stays within viewport
      const menuWidth = 200; // Approximate width
      const menuHeight = items.length * 32; // Approximate height per item
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const adjustedX = x + menuWidth > viewportWidth ? x - menuWidth : x;
      const adjustedY = y + menuHeight > viewportHeight ? y - menuHeight : y;

      setPosition({ x: adjustedX, y: adjustedY });
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose?.();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg shadow-lg"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        minWidth: '200px',
      }}
      role="menu"
    >
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          {item.divider && index > 0 && (
            <div className="my-1 border-t border-white/10" />
          )}
          <button
            onClick={() => {
              if (!item.disabled) {
                item.onClick();
                onClose?.();
              }
            }}
            className={`w-full px-4 py-2 text-left flex items-center ${
              item.disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-white/10'
            } ${
              item.danger ? 'text-red-500 hover:text-red-400' : 'text-white'
            }`}
            role="menuitem"
            disabled={item.disabled}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ContextMenu; 