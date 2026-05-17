import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">ShopStore</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Premium E-Commerce Platform. Mua sắm thông minh, giao hàng nhanh chóng.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase">Về chúng tôi</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Giới thiệu</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Tuyển dụng</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Điều khoản</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase">Hỗ trợ khách hàng</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Hướng dẫn mua hàng</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Thanh toán & Vận chuyển</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase">Liên hệ</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Hotline: 1900 1234</li>
              <li>Email: support@shopstore.vn</li>
              <li>Địa chỉ: 123 Ecommerce St, HCMC</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} ShopStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
