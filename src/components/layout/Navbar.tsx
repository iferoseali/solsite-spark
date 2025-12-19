import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { WalletButton } from "@/components/wallet/WalletButton";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Active section detection for home page
      if (isHomePage) {
        const sections = ["templates", "features", "how-it-works", "pricing"];
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const navLinks = [
    { href: "/", label: "Home", section: null },
    { href: "/templates", label: "Templates", section: null },
    { href: "/builder", label: "Builder", section: null },
    { href: "/dashboard", label: "Dashboard", section: null },
  ];

  const isActive = (path: string, section: string | null) => {
    if (section && isHomePage) {
      return activeSection === section;
    }
    return location.pathname === path;
  };

  const handleNavClick = (href: string, section: string | null) => {
    if (href.startsWith("#") && isHomePage) {
      const element = document.getElementById(href.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "glass-strong shadow-lg shadow-background/20" 
          : "bg-transparent"
      }`}
    >
      {/* Scroll progress indicator */}
      {isHomePage && (
        <motion.div 
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary to-accent"
          style={{
            width: `${scrolled ? Math.min((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100, 100) : 0}%`
          }}
        />
      )}
      
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <img 
                src={logo} 
                alt="Solsite" 
                className="h-10 w-auto transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href.startsWith("#") ? "/" : link.href}
                onClick={() => handleNavClick(link.href, link.section)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                  isActive(link.href, link.section)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
                {isActive(link.href, link.section) && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <WalletButton />
            <Link to="/builder">
              <Button variant="glow" size="sm" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Create Site
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden glass-strong border-t border-border overflow-hidden"
          >
            <div className="container px-4 py-4 space-y-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={link.href.startsWith("#") ? "/" : link.href}
                    onClick={() => handleNavClick(link.href, link.section)}
                    className={`block py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                      isActive(link.href, link.section)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 pt-4 border-t border-border"
              >
                <ThemeToggle />
                <WalletButton className="flex-1" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="pt-2"
              >
                <Link to="/builder" onClick={() => setIsOpen(false)}>
                  <Button variant="glow" className="w-full gap-2">
                    <Sparkles className="h-4 w-4" />
                    Create Site
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
