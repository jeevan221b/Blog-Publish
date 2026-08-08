import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Experience', to: '/#experience' },
  { label: 'Projects', to: '/#projects' },
  { label: 'Blog', to: '/blog' },
];

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'color-mix(in srgb, black 55%, transparent)' }}
        onClick={onClose}
      />
      <div
        className="absolute top-0 right-0 h-full w-72 max-w-[85%] border-l p-6 flex flex-col gap-1 animate-in"
        style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <span className="font-mono text-xs" style={{ color: 'var(--text-faint)' }}>
            MENU
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 rounded-md hover:cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            onClick={onClose}
            className="font-display text-lg font-medium py-2.5 border-b"
            style={{ borderColor: 'var(--border-soft)', color: 'var(--text)' }}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
