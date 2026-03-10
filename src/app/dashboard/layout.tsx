import Link from "next/link";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardNav } from "@/components/dashboard-nav";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar
          className="border-r"
          collapsible="icon"
          variant="sidebar"
        >
          <SidebarHeader>
            <Link href="/dashboard" className="flex items-center gap-2">
              <Icons.logo className="size-7 text-primary" />
              <span className="text-lg font-semibold font-headline">
                CityPulse
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <DashboardNav />
          </SidebarContent>
          <SidebarFooter>
            <UserNav />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
            <div className="flex-1">
              {/* Add Search if needed */}
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <ThemeToggle />
          </header>
          <div className="flex-1 p-4 sm:p-6">{children}</div>
          <footer className="py-4 text-center text-sm text-muted-foreground border-t">
            Developed by Akshay P M
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
