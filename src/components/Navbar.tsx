'use client';

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";


const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { title: "About Me", href: "/#about-me" },
    { title: "Mini Projects", href: "/#mini-project" },
    { title: "Tech Stacks", href: "/#tech" },
    { title: "Contact Me", href: "/#contact" },
  ];

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <Navbar
      isBordered
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}>
      <NavbarBrand>
        <Link href="/#landing">
          <p className="font-bold text-inherit">Vincent AU</p>
        </Link>
      </NavbarBrand>
      <NavbarContent
        className="hidden sm:flex gap-4"
        justify="center">
        {menuItems.map((item, index) => (
          <NavbarItem key={`${item.title}-${index}`}>
            <Link
              color="foreground"
              href={item.href}
              className={pathname === item.href ? "active font-bold" : ""}
            >
              {item.title}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.title}-${index}`} onClick={handleMenuItemClick}>
            <Link
              color="foreground"
              className={`w-full ${pathname === item.href ? "active font-bold" : ""}`}
              href={item.href}
            >
              {item.title}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>

    </Navbar>
  );
};

export default NavBar;