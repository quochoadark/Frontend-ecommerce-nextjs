'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { ProductResponse } from '@/services/product.service';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/Button';

export function ProductDetailClient({ product }: { product: ProductResponse }) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.thumbnail);
  const { addToCart, isLoading } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getImageUrl = (url?: string) => {
    if (!url) return '/placeholder.png';
    return url.startsWith('http') ? url : `http://localhost:8080${url}`;
  };

  const allImages = [product.thumbnail, ...(product.imageUrls || [])].filter(Boolean);

  const handleAddToCart = () => {
    if (product.stockQuantity >= quantity) {
      addToCart(product.id, quantity);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
      
      {/* Images Section */}
      <div className="space-y-4">
        <motion.div 
          key={activeImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 relative"
        >
          <img 
            src={getImageUrl(activeImage)} 
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {allImages.length > 1 && (
          <div className="flex gap-4 overflow-x-auto py-2">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                  activeImage === img ? 'border-blue-600 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={getImageUrl(img)} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-2">
          {product.title}
        </h1>
        
        <div className="flex items-center gap-4 text-sm mb-6">
          <span className="text-gray-500">Danh mục: <span className="font-medium text-blue-600">{product.categoryName}</span></span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">Tình trạng: 
            <span className={`font-medium ml-1 ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stockQuantity > 0 ? `Còn ${product.stockQuantity} sản phẩm` : 'Hết hàng'}
            </span>
          </span>
        </div>

        <div className="text-4xl font-extrabold text-blue-600 mb-8">
          {formatPrice(product.price)}
        </div>

        <div className="prose prose-sm text-gray-600 mb-8 line-clamp-4">
          <p>{product.description || 'Chưa có mô tả cho sản phẩm này.'}</p>
        </div>

        {/* Action Area */}
        <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
          <div className="flex items-end gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng</label>
              <div className="flex items-center bg-white border border-gray-300 rounded-md max-w-[120px]">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <input 
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stockQuantity, parseInt(e.target.value) || 1)))}
                  className="w-10 h-10 text-center font-medium border-x border-gray-200 outline-none"
                />
                <button 
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              size="lg" 
              className="flex-1"
              onClick={handleAddToCart}
              isLoading={isLoading}
              disabled={product.stockQuantity <= 0}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.stockQuantity > 0 ? 'Thêm vào giỏ hàng' : 'Tạm hết hàng'}
            </Button>
            <Button variant="outline" size="lg" className="px-4 text-gray-500">
              <Heart className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-gray-700 leading-tight">Cam kết<br/>Chính hãng</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-gray-700 leading-tight">Giao hàng<br/>Siêu tốc</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <RotateCcw className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-gray-700 leading-tight">Đổi trả<br/>Miễn phí 7 ngày</span>
          </div>
        </div>

      </div>
    </div>
  );
}
