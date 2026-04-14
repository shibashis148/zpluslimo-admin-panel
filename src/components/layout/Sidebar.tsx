import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  CarProfile,
  ChartBarHorizontal,
  SignOut,
  CaretRight,
  X,
  IdentificationCard,
  GearSix,
  Plugs,
  Desktop,
  TrendUp,
  CurrencyDollar,
  ShieldWarning,
  Bell,
  Heartbeat,
} from '@phosphor-icons/react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: string | number;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', icon: ChartBarHorizontal, path: '/dashboard' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Live Operations', icon: Desktop,       path: '/live-operations' },
      { label: 'Alerts Center',   icon: Bell,          path: '/alerts', badge: 8, badgeColor: 'red' },
    ],
  },
  {
    title: 'Performance',
    items: [
      { label: 'Driver Performance',    icon: TrendUp,        path: '/driver-performance' },
      { label: 'Revenue & Profit',      icon: CurrencyDollar, path: '/revenue' },
      { label: 'Leakage & Fraud',       icon: ShieldWarning,  path: '/leakage', badge: 3, badgeColor: 'red' },
      { label: 'Fleet Health',          icon: Heartbeat,      path: '/fleet-health' },
    ],
  },
  {
    title: 'Fleet',
    items: [
      { label: 'Drivers', icon: IdentificationCard, path: '/drivers' },
      { label: 'Cars',    icon: CarProfile,         path: '/cars' },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Integrations', icon: Plugs,   path: '/integrations', badge: 'New', badgeColor: 'gold' },
      { label: 'Settings',     icon: GearSix, path: '/settings' },
    ],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const badgeClass = (color?: string) => {
    if (color === 'gold')  return 'bg-gold/20 text-gold';
    if (color === 'red')   return 'bg-red-500/20 text-red-400';
    if (color === 'brand') return 'bg-brand-500/20 text-brand-400';
    return 'bg-white/10 text-gray-300';
  };

  const isActive = (path: string) =>
    location.pathname === path ||
    (path !== '/dashboard' && location.pathname.startsWith(path));

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          'fixed top-0 left-0 h-screen z-50 flex flex-col',
          'bg-surface-card border-r border-surface-border',
          'transition-all duration-300 ease-in-out',
          'lg:relative lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          collapsed ? 'w-[72px]' : 'w-[240px]',
        ].join(' ')}
      >
        {/* ── Header ── */}
        <div
          className={`flex items-center ${collapsed ? 'justify-center px-3' : 'justify-between px-4'}
            h-16 border-b border-surface-border shrink-0`}
        >
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-glow-gold shrink-0">
                <CarProfile size={16} weight="duotone" className="text-surface" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-white text-[15px] leading-none">zpluslimo</p>
                <p className="text-gray-500 text-[10px] mt-0.5">Control Room</p>
              </div>
            </div>
          )}

          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-glow-gold">
              <CarProfile size={16} weight="duotone" className="text-surface" />
            </div>
          )}

          {/* Close – mobile */}
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors lg:hidden">
            <X size={20} />
          </button>

          {/* Collapse – desktop */}
          {!open && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`hidden lg:flex text-gray-500 hover:text-white transition-all duration-200 ${collapsed ? 'rotate-180' : ''}`}
            >
              <CaretRight size={16} weight="bold" />
            </button>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-4 px-2">
          {NAV.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <p className="section-title">{section.title}</p>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        onClick={onClose}
                        title={collapsed ? item.label : undefined}
                        className={[
                          'nav-item',
                          active ? 'nav-item-active' : '',
                          collapsed ? 'justify-center px-0' : '',
                        ].join(' ')}
                      >
                        <Icon
                          size={20}
                          weight={active ? 'duotone' : 'regular'}
                          className={`shrink-0 ${active ? 'text-gold' : 'text-gray-500'}`}
                        />
                        {!collapsed && (
                          <>
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.badge !== undefined && (
                              <span className={`badge text-[10px] ${badgeClass(item.badgeColor)}`}>
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* ── User profile ── */}
        <div className="shrink-0 border-t border-surface-border p-3">
          <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-surface-elevated
            transition-colors cursor-pointer ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/60 to-gold-dark/60
              flex items-center justify-center text-white font-bold text-xs shrink-0">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-gray-500 text-xs truncate">{user?.role}</p>
                </div>
                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/10"
                  title="Sign out"
                >
                  <SignOut size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

    </>
  );
}
