import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="group relative inline-flex h-9 w-9 items-center justify-center rounded-md border transition-[color,transform,border-color] duration-200 hover:-translate-y-0.5 hover:cursor-pointer"
      style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
    >
      <span className="transition-transform duration-500 group-hover:rotate-[360deg]">
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </span>
    </button>
  );
}
