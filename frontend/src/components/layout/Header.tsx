import { Menu, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface HeaderProps {
  toggleSidebar: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ toggleSidebar, isDarkMode, toggleDarkMode }: HeaderProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 glass-panel border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 lg:hidden mr-4">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100 hidden sm:block">Welcome back, {user?.name.split(' ')[0]} 👋</h1>
      </div>

      <div className="flex items-center space-x-4">
        <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{user?.name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{user?.role}</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
            {user?.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
