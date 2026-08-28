import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Blog', to: '/blog' },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'color-mix(in srgb, var(--bg) 85%, transparent)',
      }}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <NavLink
          to="/"
          className="font-display font-semibold tracking-tight text-sm sm:text-base"
          style={{ color: 'var(--text)' }}
        >
          RAJ DIWAKAR
        </NavLink>

        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `nav-underline px-3 py-2 text-sm rounded-md transition-colors ${isActive ? 'font-medium' : ''}`
              }
              style={({ isActive }: { isActive: boolean }) => ({
                color: isActive ? 'var(--text)' : 'var(--text-muted)',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border hover:cursor-pointer"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            <Menu size={16} />
          </button>
        </div>
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
