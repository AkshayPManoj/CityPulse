import Link from "next/link";
import { Icons } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-14 items-center">
          <div className="flex-1 flex items-center gap-4">
             <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Admin Dashboard
                </Link>
             </Button>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <Link href="/citizen" className="flex items-center gap-2">
              <Icons.logo className="h-7 w-7 text-primary" />
              <span className="font-headline text-xl font-semibold">CityPulse</span>
            </Link>
          </div>
          
          <div className="flex flex-1 justify-end">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="py-4 text-center text-sm text-muted-foreground border-t">
        Developed by Akshay P M
      </footer>
    </div>
  );
}
