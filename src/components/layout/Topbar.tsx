import { useLocation } from 'react-router-dom';
import {
  List,
  Bell,
  MagnifyingGlass,
  CaretDown,
  SignOut,
  Moon,
} from '@phosphor-icons/react';
import { useAuth } from '../../context/AuthContext';

const ROUTE_LABELS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/analytics': 'Analytics',
  '/vehicles': 'Vehicles',
  '/bookings': 'Bookings',
  '/tracking': 'Live Tracking',
  '/dispatch': 'Dispatch',
  '/drivers': 'Drivers',
  '/clients': 'Clients',
  '/staff': 'Staff',
  '/finance': 'Finance',
  '/maintenance': 'Maintenance',
  '/reports': 'Reports',
  '/messages': 'Messages',
  '/notifications': 'Notifications',
  '/compliance': 'Compliance',
  '/activity': 'Activity Log',
  '/company': 'Company',
  '/settings': 'Settings',
};

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const pageTitle = ROUTE_LABELS[location.pathname] ?? 'Admin Panel';

  return (
    <header className="h-16 bg-surface-card/80 backdrop-blur-md border-b border-surface-border flex items-center px-4 md:px-6 gap-4 sticky top-0 z-30">
      {/* Menu toggle (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-surface-elevated"
      >
        <List size={22} weight="bold" />
      </button>

      {/* Page title */}
      <div className="flex items-center gap-2 min-w-0">
        <h1 className="font-display font-bold text-lg text-white truncate">{pageTitle}</h1>
      </div>

      {/* Search bar (hidden on small screens) */}
      <div className="hidden md:flex flex-1 max-w-xs mx-auto relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          <MagnifyingGlass size={16} />
        </span>
        <input
          type="text"
          placeholder="Search anything…"
          className="w-full bg-surface-elevated border border-surface-border rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold/40 transition-colors"
        />
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {/* Theme toggle */}
        <button className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-surface-elevated transition-all">
          <Moon size={18} weight="duotone" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-surface-elevated transition-all">
          <Bell size={18} weight="duotone" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-surface-card" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-surface-border mx-2" />

        {/* User menu */}
        <div className="flex items-center gap-2.5 cursor-pointer group select-none">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/60 to-gold-dark/60 flex items-center justify-center text-white font-bold text-xs">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block">
            <p className="text-white text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-gray-500 text-xs mt-0.5">{user?.role}</p>
          </div>
          <CaretDown size={14} className="text-gray-500 group-hover:text-gray-300 transition-colors hidden md:block" />
        </div>

        {/* Sign out (mobile) */}
        <button
          onClick={logout}
          className="md:hidden p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <SignOut size={18} />
        </button>
      </div>
    </header>
  );
}
