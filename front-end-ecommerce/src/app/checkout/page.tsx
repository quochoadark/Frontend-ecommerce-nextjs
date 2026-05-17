'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useAuth } from '@/context/AuthContext';
import { createOrder } from '@/services/order.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckCircle2, Truck } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, fetchCart } = useCartStore();
  const { state: { isAuthenticated, isLoading: authLoading, user } } = useAuth();
  
  const [formData, setFormData] = useState({
    fullname: '',
    phoneNumber: '',
    address: '',
    note: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Prefill fullname when user data becomes available
  useEffect(() => {
    if (user?.name) {
      setFormData(prev => ({ ...prev, fullname: user.name }));
    }
  }, [user?.name]);

  // Fetch cart on mount
  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated, fetchCart]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || cart.items.length === 0) return;

    setIsSubmitting(true);
    try {
      await createOrder({
        fullname: formData.fullname,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        note: formData.note,
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      });
      setIsSuccess(true);
      await fetchCart(); // refresh cart (should be empty now)
    } catch (error) {
      alert('Đặt hàng thất bại, vui lòng thử lại.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;
  }

  if (!isAuthenticated) return null; // Wait for redirect

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Đặt hàng thành công!</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Cảm ơn bạn đã mua sắm tại ShopStore. Chúng tôi sẽ sớm liên hệ để xác nhận đơn hàng của bạn.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.push('/profile/orders')}>Xem đơn hàng</Button>
          <Button onClick={() => router.push('/')}>Tiếp tục mua sắm</Button>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-4">
        <p className="text-gray-500 mb-4">Giỏ hàng của bạn đang trống.</p>
        <Button onClick={() => router.push('/')}>Về trang chủ</Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Thanh toán</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                Thông tin giao hàng
              </h2>
              
              <div className="space-y-5">
                <Input 
                  label="Họ và tên" 
                  name="fullname" 
                  value={formData.fullname} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Nhập họ và tên người nhận"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input 
                    label="Số điện thoại" 
                    name="phoneNumber" 
                    type="tel"
                    value={formData.phoneNumber} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Ví dụ: 0912345678"
                  />
                  <Input 
                    label="Địa chỉ email" 
                    type="email"
                    value={user?.email || ''} 
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                
                <Input 
                  label="Địa chỉ nhận hàng chi tiết" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú (Không bắt buộc)</label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    placeholder="Ghi chú thêm về thời gian giao hàng..."
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-base font-bold text-gray-900 mb-4">Phương thức thanh toán</h3>
                <label className="flex items-center justify-between p-4 border-2 border-blue-600 bg-blue-50 rounded-xl cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input type="radio" checked readOnly className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</p>
                      <p className="text-sm text-gray-500">Trả tiền mặt khi giao hàng</p>
                    </div>
                  </div>
                </label>
              </div>

              <div className="mt-8">
                <Button type="submit" size="lg" className="w-full text-lg h-14" isLoading={isSubmitting}>
                  Xác nhận Đặt hàng
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                Đơn hàng của bạn ({cart.totalItems} sản phẩm)
              </h2>
              
              <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-6">
                {cart.items.map(item => (
                  <li key={item.itemId} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={item.thumbnail?.startsWith('http') ? item.thumbnail : `http://localhost:8080${item.thumbnail}`}
                        alt={item.productTitle} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{item.productTitle}</h4>
                      <div className="text-sm text-gray-500 mt-1">SL: {item.quantity} x {formatPrice(item.unitPrice)}</div>
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {formatPrice(item.subtotal)}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="space-y-3 pt-4 border-t border-gray-100 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{formatPrice(cart.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-100">
                  <span>Tổng cộng</span>
                  <span className="text-blue-600">{formatPrice(cart.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
