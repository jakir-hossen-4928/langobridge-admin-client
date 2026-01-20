import { useState, ReactNode } from "react";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen bg-background overflow-hidden w-full relative flex-col lg:flex-row">
      {/* Mobile TopBar */}
      {isMobile && (
        <header className="h-16 border-b bg-card flex items-center justify-between px-4 shrink-0 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
              <img
                src="/langobridge-app-icon.jpg"
                alt="LangoBridge"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-lg font-bold text-primary tracking-tight">
              LangoBridge
            </span>
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-r-0 w-64 bg-card">
              <div className="h-full">
                <Sidebar
                  isCollapsed={false}
                  setIsCollapsed={() => {}}
                  onItemClick={() => setIsMobileMenuOpen(false)}
                  isMobileMode={true}
                />
              </div>
            </SheetContent>
          </Sheet>
        </header>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="hidden lg:block shrink-0 h-full">
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-full scroll-smooth">
        <div className="p-4 lg:p-6 max-w-[1600px] mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
