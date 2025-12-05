import { Link, useLocation } from "wouter";
import { Menu, Lock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth status on mount and when location changes (login/logout)
  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("auth_paudronix") === "true");
  }, [location]);

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Catálogo", href: "/#catalog" },
    { name: "Testimonios", href: "/#testimonials" },
    { name: "Contacto", href: "/#footer" },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith("/#")) {
      const element = document.querySelector(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else if (location !== "/") {
         window.location.href = href;
      }
    } else {
      window.location.href = href;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_paudronix");
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            PAUDRONIX GT
          </a>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
          
          {isAuthenticated ? (
            <>
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Lock className="w-4 h-4 mr-1" /> Admin
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary opacity-50 hover:opacity-100">
                <Lock className="w-4 h-4" />
              </Button>
            </Link>
          )}

          <Button 
            size="sm" 
            className="rounded-full bg-primary hover:bg-primary/90 text-white px-6 shadow-lg shadow-primary/20"
            onClick={() => scrollToSection("/#catalog")}
          >
            Ver Ofertas
          </Button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white border-l border-border">
              <div className="flex flex-col gap-6 mt-10">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                 {isAuthenticated ? (
                   <div className="flex flex-col gap-2">
                     <Link href="/admin">
                      <a 
                        className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <Lock className="w-4 h-4" /> Administración
                      </a>
                    </Link>
                    <button 
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                      className="text-lg font-medium text-red-500 hover:text-red-600 transition-colors flex items-center gap-2 text-left"
                    >
                      <LogOut className="w-4 h-4" /> Cerrar Sesión
                    </button>
                   </div>
                 ) : (
                   <Link href="/login">
                    <a 
                      className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Lock className="w-4 h-4" /> Acceso Admin
                    </a>
                  </Link>
                 )}
                <Button className="w-full bg-primary text-white mt-4 shadow-lg shadow-primary/20">
                  Ver Ofertas
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
