import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '#/' },
    {
      name: 'About Us',
      subItems: [
        { name: 'Location', path: '/location' },
        { name: 'Information', path: '/about' },
        { name: 'Our Team', path: '/team' },
      ],
    },
    {
      name: 'Our Services',
      subItems: [
        { name: 'Specialties', path: '#/services' },
        { name: 'Appointments', path: '#/appointments' },
        { name: 'Emergency', path: '#/emergency' },
      ],
    },
    { name: 'Contact', path: '/location' },
  ];



  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 bg-[var(--one)] z-50 shadow transition-all duration-300 ${
        isScrolled ? 'shadow-md py-2' : 'py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#/" className="flex items-center space-x-2" onClick={handleNavClick}>
            <span className="text-2xl font-bold text-gray-900">
              BATU <span className="text-[var(--five)]">HOSPITAL</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList className="flex space-x-1">
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    {item.subItems ? (
                      <>
                        <NavigationMenuTrigger
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors `}
                        >
                          {item.name}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="p-2 min-w-[200px]">
                          <div className="grid gap-1">
                            {item.subItems.map((subItem) => (
                              <NavigationMenuLink asChild key={subItem.name}>
                                <a
                                  href={subItem.path}
                                  onClick={handleNavClick}
                                  className="block px-4 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-700"
                                >
                                  {subItem.name}
                                </a>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink asChild>
                        <a
                          href={item.path}
                          onClick={handleNavClick}
                          className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-[var(--five)] transition-colors"
                        >
                          {item.name}
                        </a>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="ml-4 flex items-center space-x-2">
              <Button variant="outline" asChild className='bg-[var(--six)] text-white'>
               <Link to="/login">Login</Link>
              </Button>
             
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navItems.map((item) => (
                <div key={item.name} className="border-b border-gray-200 last:border-0">
                  {item.subItems ? (
                    <div className="py-2">
                      <button
                        className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                        onClick={() => {
                          // Toggle submenu
                          const submenu = document.getElementById(`mobile-submenu-${item.name}`);
                          if (submenu) {
                            submenu.classList.toggle('hidden');
                          }
                        }}
                      >
                        {item.name}
                        <svg
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <div id={`mobile-submenu-${item.name}`} className="hidden pl-4">
                        {item.subItems.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.path}
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50"
                            onClick={handleNavClick}
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <a
                      href={item.path}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                      onClick={handleNavClick}
                    >
                      {item.name}
                    </a>
                  )}
                </div>
              ))}
              <div className="pt-4 space-y-2">
                <Button variant="outline" className="w-full bg-[var(--six)] text-white" asChild>
                  <Link to="/login" onClick={handleNavClick}>
                    Login
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
