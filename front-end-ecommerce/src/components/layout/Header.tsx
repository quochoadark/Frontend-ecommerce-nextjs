'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, User as UserIcon, LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCartStore } from '@/store/useCartStore';

export function Header() {
  const { state: { isAuthenticated, user }, logout } = useAuth();
  const { cart, fetchCart, setIsOpen } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-4">
          <button className="md:hidden text-gray-600 hover:text-gray-900">
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/" className="text-xl font-bold text-blue-600 tracking-tight">
            ShopStore
          </Link>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-full text-sm focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition-all"
          />
          <Search className="w-4 h-4 absolute left-4 top-3 text-gray-400" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          
          {/* Cart Icon */}
          <button 
            onClick={() => setIsOpen(true)}
            className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {cart && cart.totalItems > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white">
                {cart.totalItems}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4 text-sm font-medium text-gray-700">
                <span className="truncate max-w-[150px]">Xin chào, {user?.name}</span>
                {user?.role === 'ADMIN' && (
                  <Link href="/admin" className="text-blue-600 hover:underline">
                    Quản trị
                  </Link>
                )}
                <button 
                  onClick={logout} 
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                <UserIcon className="w-5 h-5" />
                Đăng nhập
              </Link>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
