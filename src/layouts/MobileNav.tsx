import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Upload, 
  Trophy, 
  User, 
  Users, 
  FileBarChart, 
  GraduationCap 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["student", "faculty", "admin"]
  },
  {
    title: "Upload Achievement",
    href: "/upload",
    icon: Upload,
    roles: ["student"]
  },
  {
    title: "My Achievements",
    href: "/achievements",
    icon: Trophy,
    roles: ["student"]
  },
  {
    title: "My Portfolio",
    href: "/portfolio",
    icon: User,
    roles: ["student"]
  },
  {
    title: "Faculty Approval",
    href: "/faculty",
    icon: GraduationCap,
    roles: ["faculty", "admin"]
  },
  {
    title: "Admin Reports",
    href: "/reports",
    icon: FileBarChart,
    roles: ["admin"]
  }
];

// For now, we'll assume student role - this would come from auth context
const currentRole = "student";

export function MobileNav() {
  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(currentRole)
  );

  return (
    <div className="h-full bg-card border-r border-border">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Smart Student</h2>
            <p className="text-sm text-muted-foreground">Hub</p>
          </div>
        </div>

        <nav className="space-y-2">
          {filteredItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )
              }
            >
              <item.icon className="w-4 h-4" />
              {item.title}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}