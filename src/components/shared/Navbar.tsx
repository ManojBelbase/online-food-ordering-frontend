"use client";
import { User, Menu as MenuIcon, X, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/features/auth/selectors";
import { Menu } from "@headlessui/react";
import { useState } from "react";
import UserInfo from "./UserInfo";
import { CartIcon } from "@/components/cart/CartIcon";
import NotificationManager from "@/components/notifications/NotificationManager";

const Navbar = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Location */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="tExt-lg sm:text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer">
              BhojanNepal
            </Link>
            {/* <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
              <MapPin className="h-4 w-4 text-orange-500" />
              <span className="font-medium">Deliver to: Kathmandu, Nepal</span>
            </div> */}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/restaurants"
              className="text-gray-600 hover:text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-all duration-200 cursor-pointer"
            >
              Restaurants
            </Link>
            {isAuthenticated ? (
              <>
                {/* Orders Link */}
                <Link
                  href="/orders"
                  className="text-gray-600 hover:text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-all duration-200 cursor-pointer"
                >
                  My Orders
                </Link>

                {/* Notifications */}
                <NotificationManager />

                {/* Cart Icon */}
                <CartIcon />

                {/* User Account Menu */}
                <Menu as="div" className="relative">
                  <Menu.Button className="relative w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center hover:from-orange-600 hover:to-red-600 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg">
                    <User className="h-5 w-5 text-white" />
                  </Menu.Button>

                  <Menu.Items className="absolute right-0 mt-2 z-50 w-80 rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-100">
                    <UserInfo />
                  </Menu.Items>
                </Menu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-all duration-200 cursor-pointer"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {isAuthenticated && (
              <>
                <Link
                  href="/orders"
                  className="text-gray-600 hover:text-orange-600 px-3 py-2 rounded-lg font-medium hover:bg-orange-50 transition-all duration-200 cursor-pointer"
                >
                  Orders
                </Link>
                <Link
                  href="/restaurants"
                  className="text-gray-600 hover:text-orange-600 px-3 py-2 rounded-lg font-medium hover:bg-orange-50 transition-all duration-200 cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Restaurants
                </Link>
                <NotificationManager />
                <CartIcon />
              </>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <MenuIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </div>


      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-gray-800">Profile</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <UserInfo />
                </div>
                <div className="space-y-2">
                  <Link
                    href="/orders"
                    className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all duration-200 cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>My Orders</span>
                  </Link>
                  <Link
                    href="/restaurants"
                    className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all duration-200 cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Restaurants</span>
                  </Link>
                  <Link
                    href="/cart"
                    className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all duration-200 cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    <span>Cart</span>
                  </Link>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/login"
                  className="block w-full text-center bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-all duration-200 cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="block w-full text-center border border-orange-600 text-orange-600 px-6 py-3 rounded-lg font-medium hover:bg-orange-50 transition-all duration-200 cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
