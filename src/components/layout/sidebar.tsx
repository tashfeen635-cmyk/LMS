"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  GraduationCap,
  Calendar,
  MessageSquare,
  Users,
  Library,
  BarChart3,
  UserCog,
  Settings2,
  FileBarChart,
  Settings,
  PanelLeftClose,
  PanelLeft,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { getNavItems, type NavItem } from "@/lib/navigation";
import useAuthStore from "@/stores/auth-store";
import useUIStore from "@/stores/ui-store";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// ---------------------------------------------------------------------------
// Icon lookup – maps the string name stored in NavItem.icon to a component
// ---------------------------------------------------------------------------
const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  BookOpen,
  FileText,
  GraduationCap,
  Calendar,
  MessageSquare,
  Users,
  Library,
  BarChart3,
  UserCog,
  Settings2,
  FileBarChart,
  Settings,
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface SidebarProps {
  portalColor?: string;
}

// ---------------------------------------------------------------------------
// Shared navigation list (used by both desktop & mobile sidebars)
// ---------------------------------------------------------------------------
function NavList({
  items,
  pathname,
  collapsed,
  portalColor,
}: {
  items: NavItem[];
  pathname: string;
  collapsed: boolean;
  portalColor?: string;
}) {
  return (
    <nav className="flex flex-col gap-1 px-2">
      {items.map((item) => {
        const Icon = iconMap[item.icon] ?? LayoutDashboard;
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Tooltip key={item.href}>
            <TooltipTrigger
              render={
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive &&
                      "text-white dark:text-white",
                    !isActive &&
                      "text-muted-foreground"
                  )}
                  style={
                    isActive && portalColor
                      ? { backgroundColor: portalColor }
                      : isActive
                        ? { backgroundColor: "hsl(var(--primary))" }
                        : undefined
                  }
                />
              }
            >
              <Icon className="size-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">{item.label}</TooltipContent>
            )}
          </Tooltip>
        );
      })}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Desktop Sidebar
// ---------------------------------------------------------------------------
function DesktopSidebar({
  items,
  pathname,
  collapsed,
  onToggle,
  portalColor,
}: {
  items: NavItem[];
  pathname: string;
  collapsed: boolean;
  onToggle: () => void;
  portalColor?: string;
}) {
  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out h-screen sticky top-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo / school name */}
      <div className="flex h-14 items-center gap-3 border-b border-border px-3">
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: portalColor ?? "hsl(var(--primary))" }}
        >
          <GraduationCap className="size-5 text-white" />
        </div>
        {!collapsed && (
          <span className="truncate text-base font-semibold tracking-tight text-foreground">
            School LMS
          </span>
        )}
      </div>

      {/* Navigation items in a scrollable area */}
      <ScrollArea className="flex-1 py-3">
        <NavList
          items={items}
          pathname={pathname}
          collapsed={collapsed}
          portalColor={portalColor}
        />
      </ScrollArea>

      {/* Collapse toggle */}
      <Separator />
      <div className="flex items-center justify-center py-2">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              />
            }
          >
            {collapsed ? (
              <PanelLeft className="size-5" />
            ) : (
              <PanelLeftClose className="size-5" />
            )}
          </TooltipTrigger>
          <TooltipContent side="right">
            {collapsed ? "Expand sidebar" : "Collapse sidebar"}
          </TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Mobile Sidebar (inside a Sheet drawer)
// ---------------------------------------------------------------------------
function MobileSidebar({
  items,
  pathname,
  open,
  onOpenChange,
  portalColor,
}: {
  items: NavItem[];
  pathname: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portalColor?: string;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0" showCloseButton={false}>
        <SheetHeader className="border-b border-border px-3">
          <SheetTitle className="flex items-center gap-3">
            <div
              className="flex size-8 shrink-0 items-center justify-center rounded-lg"
              style={{
                backgroundColor: portalColor ?? "hsl(var(--primary))",
              }}
            >
              <GraduationCap className="size-5 text-white" />
            </div>
            <span className="truncate text-base font-semibold tracking-tight">
              School LMS
            </span>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 py-3">
          <NavList
            items={items}
            pathname={pathname}
            collapsed={false}
            portalColor={portalColor}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// Sidebar (exported component)
// ---------------------------------------------------------------------------
export default function Sidebar({ portalColor }: SidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const sidebarMobileOpen = useUIStore((s) => s.sidebarMobileOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const setSidebarMobileOpen = useUIStore((s) => s.setSidebarMobileOpen);

  const navItems = user ? getNavItems(user.role) : [];

  return (
    <TooltipProvider>
      {/* Desktop */}
      <DesktopSidebar
        items={navItems}
        pathname={pathname}
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        portalColor={portalColor}
      />

      {/* Mobile */}
      <MobileSidebar
        items={navItems}
        pathname={pathname}
        open={sidebarMobileOpen}
        onOpenChange={setSidebarMobileOpen}
        portalColor={portalColor}
      />
    </TooltipProvider>
  );
}
