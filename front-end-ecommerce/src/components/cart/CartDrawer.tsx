'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/Button';

export function CartDrawer() {
  const { cart, isOpen, setIsOpen, updateQuantity, removeItem, isLoading } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getImageUrl = (url?: string) => {
    if (!url) return '/placeholder.png';
    return url.startsWith('http') ? url : `http://localhost:8080${url}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Giỏ Hàng
                {cart && cart.totalItems > 0 && (
                  <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {cart.totalItems}
                  </span>
                )}
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content (Items) */}
            <div className="flex-1 overflow-y-auto p-4">
              {!cart || cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p>Giỏ hàng của bạn đang trống.</p>
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Tiếp tục mua sắm
                  </Button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {cart.items.map((item) => (
                    <li key={item.itemId} className="flex gap-4 border-b border-gray-50 pb-4">
                      {/* Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={getImageUrl(item.thumbnail)} 
                          alt={item.productTitle} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {item.productTitle}
                          </h4>
                          <button 
                            onClick={() => removeItem(item.itemId)}
                            className="text-gray-400 hover:text-red-500 p-1"
                            disabled={isLoading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-blue-600 font-semibold text-sm mt-1">
                          {formatPrice(item.unitPrice)}
                        </div>
                        
                        {/* Quantity controls */}
                        <div className="flex items-center gap-3 mt-auto pt-2">
                          <div className="flex items-center border border-gray-200 rounded-md">
                            <button 
                              onClick={() => updateQuantity(item.itemId, Math.max(1, item.quantity - 1))}
                              className="p-1 hover:bg-gray-100 text-gray-600"
                              disabled={isLoading || item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-gray-900">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 text-gray-600"
                              disabled={isLoading}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-xs text-gray-500 ml-auto">
                            Tổng: {formatPrice(item.subtotal)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer / Checkout */}
            {cart && cart.items.length > 0 && (
              <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-4">
                <div className="flex justify-between items-center font-bold text-gray-900">
                  <span>Tổng tiền:</span>
                  <span className="text-xl text-blue-600">{formatPrice(cart.totalAmount)}</span>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Phí vận chuyển sẽ được tính tại trang thanh toán.
                </p>
                <Link href="/checkout" passHref legacyBehavior>
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Tiến hành Thanh toán
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
