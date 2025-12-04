import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from '../../assets/Logo.png'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { useLanguage } from "@/Context/LanguageContext";
import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/Stores/UserAuthslicer";
import BottomProfile from "@/Components/AllUsers/BottomProfile";

const Header = ({ currentUser, isAuth }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleSubmenu = (name) => {
    setActiveSubmenu(activeSubmenu === name ? null : name);
  };

  const LogoutHandler = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: t("home"), path: "/" },
    {
      name: t("aboutUs"),
      subItems: [
        { name: t("location"), path: "/location" },

      ],
    },

  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 bg-[var(--one)] z-50 shadow transition-all duration-300 ${isScrolled ? "shadow-md py-2" : "py-4"
        }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#/"
            className="flex items-center space-x-2"
            onClick={handleNavClick}
          >
            BATU <span className="text-[var(--five)]">HOSPITAL</span>
            <img src={Logo} alt="Logo" className="w-auto h-12 object-contain ml-2 rounded-b-2xl" />
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
            {isAuth ? (
              <Button onClick={LogoutHandler}>LogOut</Button>
            ) : (
              <Button
                variant="outline"
                asChild
                className="bg-[var(--six)] text-white"
              >
                <Link to="/login">{t("login")}</Link>
              </Button>
            )}
            {isAuth && (
              <Popover>
                <PopoverTrigger className=" cursor-pointer">
                  <Avatar className="w-15 h-15 bg-white">
                    <BottomProfile />

                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col gap-3 cursor-pointer">
                  <Button><Link to={`/${currentUser.role}/home`} className="w-full">DashBoard</Link></Button>
                  <Button><Link to='/profile' className="w-full ">Profile</Link></Button>

                </PopoverContent>
              </Popover>
            )}
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 bg-[var(--one)] border-t border-gray-200">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="border-b border-gray-200 last:border-0"
              >
                {item.subItems ? (
                  <div className="py-2">
                    <button
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => toggleSubmenu(item.name)}
                    >
                      {item.name}
                      <svg
                        className={`h-5 w-5 text-gray-400 transition-transform ${activeSubmenu === item.name ? 'rotate-180' : ''}`}
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
                    {activeSubmenu === item.name && (
                      <div className="pl-4 space-y-1">
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
                    )}
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

            <div className="pt-4 space-y-2 border-t border-gray-200 mt-2">
              {isAuth ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 mb-2 border-b border-gray-100 pb-3">
                    <div className="h-10 w-10 rounded-full bg-[var(--five)] flex items-center justify-center text-white font-bold">
                      {currentUser?.fullName?.charAt(0) || "U"}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-gray-900">{currentUser?.fullName || "User"}</span>
                      <span className="text-xs text-gray-500 capitalize">{currentUser?.role}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to={`/${currentUser?.role}/home`} onClick={handleNavClick}>
                      Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to='/profile' onClick={handleNavClick}>
                      Profile
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full mt-2"
                    onClick={() => {
                      LogoutHandler();
                      handleNavClick();
                    }}
                  >
                    LogOut
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  className="w-full bg-[var(--six)] text-white hover:bg-[var(--five)] hover:text-white"
                  asChild
                >
                  <Link to="/login" onClick={handleNavClick}>
                    {t("login")}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </header>
  );
};

export default Header;
