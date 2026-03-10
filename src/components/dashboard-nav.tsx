"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BrainCircuit,
  Route,
  TestTube2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/demand-prediction",
    label: "Demand Prediction",
    icon: BrainCircuit,
  },
  {
    href: "/dashboard/route-optimization",
    label: "Route Optimization",
    icon: Route,
  },
  {
    href: "/dashboard/policy-simulation",
    label: "Policy Simulation",
    icon: TestTube2,
  },
  {
    href: "/citizen",
    label: "Citizen View",
    icon: Users,
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  
  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            className={cn(pathname === item.href && "bg-primary/10 text-primary hover:bg-primary/10")}
          >
            <Link href={item.href}>
              <item.icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
