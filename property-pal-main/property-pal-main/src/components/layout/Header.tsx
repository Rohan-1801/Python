import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import NotificationCenter from './NotificationCenter';

const tabs = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Leads', path: '/leads' },
  { label: 'Properties', path: '/properties' },
  { label: 'Reports', path: '/reports' },
];

const Header = () => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/leads')) {
      if (path === '/leads/create') return 'Create Lead';
      if (path.includes('/edit')) return 'Edit Lead';
      return 'Lead Management';
    }
    if (path.startsWith('/properties')) {
      if (path === '/properties/create') return 'Add Property';
      if (path.includes('/edit')) return 'Edit Property';
      return 'Property Management';
    }
    if (path === '/reports') return 'Reports & Analytics';
    if (path === '/profile') return 'Profile Settings';
    if (path === '/payment') return 'Payment Details';
    return 'PMS';
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-semibold text-foreground">{getPageTitle()}</h1>
        
        <nav className="hidden lg:flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path ||
              (tab.path === '/leads' && location.pathname.startsWith('/leads')) ||
              (tab.path === '/properties' && location.pathname.startsWith('/properties'));
            
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 w-64 h-9 bg-secondary border-0"
          />
        </div>
        <NotificationCenter />
      </div>
    </header>
  );
};

export default Header;
