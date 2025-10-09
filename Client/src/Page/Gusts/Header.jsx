import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
const Header = () => {
  return (
    <div className="shadow-lg">
      <div className="flex items-center justify-between px-8">
        <p className="p-2 font-extrabold text-2xl ">
          BATU <span className="text-[var(--five)]">HOSPITAL</span>
        </p>

      <div className="flex gap-5 items-center">
        <p>Home</p>
      <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>ABOUT US</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>LOCATION</NavigationMenuLink>
                <NavigationMenuLink>INFORMATION</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>OUR SERVICE</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink  className='w-[100px]'>With Email</NavigationMenuLink>
                <NavigationMenuLink>With Phone</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      </div>
    </div>
  );
};

export default Header;
