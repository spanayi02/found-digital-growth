"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { navigation, siteConfig } from "@/lib/site-config";
import { StartOptions } from "@/components/start-options";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SiteHeader() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const [startOpen, setStartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <Link className="wordmark" href="/" aria-label={`${siteConfig.name} home`}>
          VISION<span>.</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className={isActive(item.href) ? "is-active" : undefined} aria-current={isActive(item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Popover open={startOpen} onOpenChange={setStartOpen}>
          <PopoverTrigger className="button button-dark header-cta">
            Get started <ChevronDown aria-hidden="true" />
          </PopoverTrigger>
          <PopoverContent className="start-popover" align="end" sideOffset={10}>
            <p className="start-popover-head">Free, with no obligation</p>
            <StartOptions variant="menu" onSelect={() => setStartOpen(false)} />
          </PopoverContent>
        </Popover>
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger className="mobile-menu-trigger" aria-label="Open navigation">
            <Menu aria-hidden="true" />
          </SheetTrigger>
          <SheetContent className="mobile-sheet" side="right">
            <SheetHeader className="mobile-sheet-header">
              <SheetTitle className="wordmark">VISION<span>.</span></SheetTitle>
              <SheetDescription>Practical digital growth for Cyprus businesses.</SheetDescription>
            </SheetHeader>
            <nav className="mobile-nav" aria-label="Mobile navigation">
              {navigation.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link href={item.href} className={isActive(item.href) ? "is-active" : undefined} aria-current={isActive(item.href) ? "page" : undefined}>{item.label}</Link>
                </SheetClose>
              ))}
              <div className="mobile-start">
                <p>Get started</p>
                <StartOptions onSelect={() => setMenuOpen(false)} />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
