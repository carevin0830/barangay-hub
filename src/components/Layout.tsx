import { Home, Users, Building2, FileText, Calendar, BarChart3, Settings, Award, LogOut } from "lucide-react";
import { NavLink } from "./NavLink";
import { Button } from "./ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Residents", href: "/residents", icon: Users },
  { name: "Households", href: "/households", icon: Building2 },
  { name: "Officials", href: "/officials", icon: FileText },
  { name: "Ordinances", href: "/ordinances", icon: FileText },
  { name: "Activities", href: "/activities", icon: Calendar },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Certificates", href: "/certificates", icon: Award },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-56 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="flex h-16 items-center gap-2 px-4 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Home className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">BDHUB</h1>
            <p className="text-xs text-secondary">Barangay Data Hub</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-all hover:bg-sidebar-accent/10"
              activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-end px-8 gap-4">
          <span className="text-sm text-foreground">cortezroxxanne700@gmail.com</span>
          <span className="text-xs text-muted-foreground">Admin User</span>
          <Button variant="ghost" size="sm" className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
