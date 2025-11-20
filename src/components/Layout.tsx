import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Building2, Shield, FileText, BarChart3, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { title: "汇总首页", path: "/", icon: Home },
  { title: "基础数据管理", path: "/enterprises", icon: Building2 },
  { title: "安全监管", path: "/safety", icon: Shield },
  { title: "日常记录", path: "/records", icon: FileText },
  { title: "数据可视化", path: "/visualization", icon: BarChart3 },
];

export default function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (confirm("确定要退出登录吗？")) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 顶部导航栏 */}
      <header className="h-16 bg-primary text-primary-foreground shadow-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-primary-foreground hover:bg-primary/90"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">智慧燃气监管平台</h1>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          退出登录
        </Button>
      </header>

      <div className="flex flex-1">
        {/* 左侧侧边栏 */}
        <aside
          className={cn(
            "bg-card border-r border-border transition-all duration-300 flex flex-col",
            collapsed ? "w-16" : "w-64"
          )}
        >
          <nav className="flex-1 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 transition-colors",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive && "bg-sidebar-accent text-sidebar-primary font-medium border-l-4 border-primary",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
