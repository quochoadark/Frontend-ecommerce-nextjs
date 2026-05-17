'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getMyOrders, cancelOrder, Page, OrderResponse } from '@/services/order.service';
import { Button } from '@/components/ui/Button';

export default function OrderHistoryPage() {
  const router = useRouter();
  const { state: { isAuthenticated } } = useAuth();
  
  const [data, setData] = useState<Page<OrderResponse> | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/auth/login?redirect=/profile/orders');
    }
  }, [isAuthenticated, router, loading]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await getMyOrders(0, 50); // Get recent 50
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isAuthenticated) {
      setLoading(true);
      getMyOrders(0, 50).then(result => {
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      }).catch(console.error);
    } else {
      setLoading(false);
    }
    return () => { isMounted = false; };
  }, [isAuthenticated]);

  const handleCancel = async (orderId: number) => {
    if (!confirm('Bạn có chắc chắn muốn huỷ đơn hàng này?')) return;
    try {
      await cancelOrder(orderId);
      alert('Huỷ đơn hàng thành công.');
      const result = await getMyOrders(0, 50);
      setData(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message || 'Huỷ đơn thất bại.');
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">Chờ xác nhận</span>;
      case 'CONFIRMED': return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">Đã xác nhận</span>;
      case 'SHIPPING': return <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">Đang giao</span>;
      case 'DELIVERED': return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">Đã giao</span>;
      case 'CANCELLED': return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold">Đã huỷ</span>;
      default: return <span>{status}</span>;
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Lịch sử đơn hàng</h1>
        
        {loading ? (
          <div className="space-y-6">
            {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-2xl"></div>)}
          </div>
        ) : !data || data.content.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center border border-gray-200">
            <p className="text-gray-500 mb-6 text-lg">Bạn chưa có đơn hàng nào.</p>
            <Button onClick={() => router.push('/')}>Mua sắm ngay</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {data.content.map(order => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">Mã đơn hàng: <strong className="text-gray-900">#{order.id}</strong></span>
                    <span className="text-sm text-gray-500">Đặt lúc: {formatDate(order.orderDate)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(order.status)}
                    {order.status === 'PENDING' && (
                      <button 
                        onClick={() => handleCancel(order.id)}
                        className="text-sm font-medium text-red-600 hover:underline"
                      >
                        Huỷ đơn
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  <ul className="space-y-4 mb-6">
                    {order.items.map(item => (
                      <li key={item.id} className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={item.productThumbnail?.startsWith('http') ? item.productThumbnail : `http://localhost:8080${item.productThumbnail}`}
                            alt={item.productTitle} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 line-clamp-2">{item.productTitle}</h4>
                          <p className="text-gray-500 text-sm mt-1">Số lượng: {item.quantity}</p>
                        </div>
                        <div className="font-semibold text-gray-900">
                          {formatPrice(item.totalMoney)}
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      Giao đến: <strong>{order.fullname}</strong> - {order.phoneNumber}
                      <br/>
                      {order.address}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Tổng tiền</p>
                      <p className="text-xl font-bold text-blue-600">{formatPrice(order.totalMoney)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
