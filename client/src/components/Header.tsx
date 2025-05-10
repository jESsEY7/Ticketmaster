import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Search,
  Heart,
  User,
  Menu,
  X,
  LogOut,
  Ticket,
  Music,
  Volleyball,
  Palmtree,
  Theater
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

export default function Header() {
  const [, navigate] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const nameArray = name.split(" ");
    if (nameArray.length > 1) {
      return `${nameArray[0][0]}${nameArray[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:space-x-10">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <a className="text-2xl font-bold text-primary font-heading cursor-pointer">
                TicketRaha
              </a>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/?category=1">
              <a className="text-base font-medium text-gray-700 hover:text-primary">
                Concerts
              </a>
            </Link>
            <Link href="/?category=2">
              <a className="text-base font-medium text-gray-700 hover:text-primary">
                Sports
              </a>
            </Link>
            <Link href="/?category=3">
              <a className="text-base font-medium text-gray-700 hover:text-primary">
                Theater
              </a>
            </Link>
            <Link href="/?category=4">
              <a className="text-base font-medium text-gray-700 hover:text-primary">
                Festivals
              </a>
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              className="hidden md:block bg-white p-2 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Favorites */}
            <Link href="/favorites">
              <a className="text-base font-medium text-gray-700 hover:text-primary hidden md:flex items-center">
                <Heart className="h-5 w-5 mr-1" /> Favorites
              </a>
            </Link>

            {/* User Menu or Auth Buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-white">
                        {getInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.fullName}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/account")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>My Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/my-tickets")}>
                    <Ticket className="mr-2 h-4 w-4" />
                    <span>My Tickets</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth">
                  <a className="whitespace-nowrap text-base font-medium text-gray-700 hover:text-primary">
                    Sign in
                  </a>
                </Link>
                <Link href="/auth?tab=register">
                  <a className="whitespace-nowrap bg-primary py-2 px-4 rounded-md text-white font-medium hover:bg-blue-600">
                    Sign up
                  </a>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open Menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6">
                  <div className="space-y-4">
                    <SheetClose asChild>
                      <Link href="/?category=1">
                        <a className="flex items-center text-base font-medium text-gray-700 hover:text-primary">
                          <Music className="h-5 w-5 mr-2" /> Concerts
                        </a>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/?category=2">
                        <a className="flex items-center text-base font-medium text-gray-700 hover:text-primary">
                          <Volleyball className="h-5 w-5 mr-2" /> Sports
                        </a>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/?category=3">
                        <a className="flex items-center text-base font-medium text-gray-700 hover:text-primary">
                          <Theater className="h-5 w-5 mr-2" /> Theater
                        </a>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/?category=4">
                        <a className="flex items-center text-base font-medium text-gray-700 hover:text-primary">
                          <Palmtree className="h-5 w-5 mr-2" /> Festivals
                        </a>
                      </Link>
                    </SheetClose>
                  </div>
                  <hr />
                  <div className="space-y-4">
                    <SheetClose asChild>
                      <Link href="/favorites">
                        <a className="flex items-center text-base font-medium text-gray-700 hover:text-primary">
                          <Heart className="h-5 w-5 mr-2" /> Favorites
                        </a>
                      </Link>
                    </SheetClose>
                    {user ? (
                      <>
                        <SheetClose asChild>
                          <Link href="/account">
                            <a className="flex items-center text-base font-medium text-gray-700 hover:text-primary">
                              <User className="h-5 w-5 mr-2" /> My Account
                            </a>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link href="/my-tickets">
                            <a className="flex items-center text-base font-medium text-gray-700 hover:text-primary">
                              <Ticket className="h-5 w-5 mr-2" /> My Tickets
                            </a>
                          </Link>
                        </SheetClose>
                        <button
                          onClick={handleLogout}
                          className="flex items-center text-base font-medium text-gray-700 hover:text-primary"
                        >
                          <LogOut className="h-5 w-5 mr-2" /> Log out
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col space-y-2">
                        <SheetClose asChild>
                          <Link href="/auth">
                            <a className="flex justify-center py-2 px-4 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-blue-600">
                              Sign in
                            </a>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link href="/auth?tab=register">
                            <a className="flex justify-center py-2 px-4 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                              Sign up
                            </a>
                          </Link>
                        </SheetClose>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
