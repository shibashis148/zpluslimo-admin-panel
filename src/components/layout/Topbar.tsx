import { useLocation } from 'react-router-dom';
import {
  List,
  MagnifyingGlass,
  CaretDown,
  SignOut,
} from '@phosphor-icons/react';
import { useAuth } from '../../context/AuthContext';

const ROUTE_LABELS: Record<string, string> = {
  '/dashboard':          'Dashboard',
  '/live-operations':    'Live Operations',
  '/alerts':             'Alerts Center',
  '/driver-performance': 'Driver Performance',
  '/revenue':            'Revenue & Profitability',
  '/leakage':            'Leakage & Fraud Detection',
  '/fleet-health':       'Fleet Health',
  '/drivers':            'Drivers',
  '/cars':               'Cars',
  '/integrations':       'Integrations',
  '/settings':           'Settings',
};

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const pageTitle = ROUTE_LABELS[location.pathname] ?? 'Control Room';

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 md:px-6 gap-4 sticky top-0 z-30 shadow-sm">
      {/* Menu toggle (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-slate-500 hover:text-slate-800 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
      >
        <List size={22} weight="bold" />
      </button>

      {/* Page title */}
      <div className="flex items-center gap-2 min-w-0">
        <h1 className="font-display font-bold text-lg text-slate-800 truncate">{pageTitle}</h1>
      </div>

      {/* Search bar */}
      <div className="hidden md:flex flex-1 max-w-xs mx-auto relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <MagnifyingGlass size={16} />
        </span>
        <input
          type="text"
          placeholder="Search anything…"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-colors"
        />
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {/* Theme toggle — commented out for now */}
        {/* <button className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
          <Moon size={18} weight="duotone" />
        </button> */}

        {/* Notifications — commented out for now */}
        {/* <button className="relative p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
          <Bell size={18} weight="duotone" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-white" />
        </button> */}

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 mx-2" />

        {/* User menu */}
        <div className="flex items-center gap-2.5 cursor-pointer group select-none">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/80 to-gold-dark flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block">
            <p className="text-slate-800 text-sm font-semibold leading-none">{user?.name}</p>
            <p className="text-slate-400 text-xs mt-0.5">{user?.role}</p>
          </div>
          <CaretDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors hidden md:block" />
        </div>

        {/* Sign out (mobile) */}
        <button
          onClick={logout}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <SignOut size={18} />
        </button>
      </div>
    </header>
  );
}
