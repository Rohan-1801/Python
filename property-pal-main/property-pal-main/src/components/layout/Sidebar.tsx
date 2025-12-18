import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  Building2,
  LayoutDashboard,
  Users,
  UserCircle,
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  FileBarChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Leads', path: '/leads' },
  { icon: Home, label: 'Properties', path: '/properties' },
  { icon: FileBarChart, label: 'Reports', path: '/reports' },
  { icon: UserCircle, label: 'Profile', path: '/profile' },
  { icon: CreditCard, label: 'Payment', path: '/payment' },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'h-screen gradient-sidebar flex flex-col transition-all duration-300 relative',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <Link
        to="/dashboard"
        className="flex items-center gap-3 p-6 border-b border-sidebar-border"
      >
        <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="text-xl font-bold text-sidebar-foreground animate-fade-in">
            PMS
          </span>
        )}
      </Link>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* User Info */}
      {!collapsed && user && (
        <div className="p-4 mx-4 mt-4 rounded-xl bg-sidebar-accent animate-fade-in">
          <p className="text-sm font-medium text-sidebar-foreground truncate">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path === '/leads' && location.pathname.startsWith('/leads')) ||
            (item.path === '/properties' && location.pathname.startsWith('/properties'));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="sidebar"
          className={cn(
            'w-full justify-start gap-3',
            collapsed && 'justify-center px-0'
          )}
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
