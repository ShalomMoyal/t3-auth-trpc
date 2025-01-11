import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { SearchIcon, MenuIcon, XIcon, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModalProposal } from "./modal-form";
import UserBadge from "@/hooks/user-badge";

export function WebAppNavbarComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 bg-background shadow-sm transition-shadow duration-300 ${isScrolled ? "shadow-md" : ""}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-primary">
                <Image
                  src="/icon.jpg"
                  alt="WebApp Icon"
                  width={170}
                  height={90}
                />
              </Link>
            </div>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="rounded-md px-3 py-2 text-sm font-medium text-black hover:bg-primary-foreground/10"
              >
                Home
              </Link>
              <Link
                href="/examples/post-crud"
                className="rounded-md px-3 py-2 text-sm font-medium text-black hover:bg-primary-foreground/10"
              >
                Posts
              </Link>
            </div>
          </div>
          <div className="hidden items-center space-x-4 md:flex">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon
                  className="h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              <Input
                type="text"
                placeholder="Search"
                className="block w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 leading-5 placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm"
              />
            </div>
            <button>
              <ModalProposal />
            </button>
            <button>
              <UserBadge />
            </button>
            <Button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              variant="destructive"
              size="icon"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex md:hidden">
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              variant="ghost"
              size="icon"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <Link
              href="/"
              className="block rounded-md px-3 py-2 text-base font-medium text-primary-foreground hover:bg-primary-foreground/10"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="block rounded-md px-3 py-2 text-base font-medium text-black hover:bg-primary-foreground/10"
            >
              Posts
            </Link>
          </div>
          <div className="border-t border-input pb-3 pt-4">
            <div className="space-y-1 px-2">
              <div className="relative mb-3">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <SearchIcon
                    className="h-5 w-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <Input
                  type="text"
                  placeholder="Search"
                  className="block w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm leading-5 placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button
                variant="destructive"
                className="w-full justify-center"
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
