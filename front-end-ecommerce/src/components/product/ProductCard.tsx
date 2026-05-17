import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { ProductSummaryResponse } from '@/services/product.service';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
  product: ProductSummaryResponse;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isLoading } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getImageUrl = (url?: string) => {
    if (!url) return '/placeholder.png';
    return url.startsWith('http') ? url : `http://localhost:8080${url}`;
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Image */}
      <Link href={`/product/${product.id}`} className="block relative w-full pt-[100%] overflow-hidden bg-gray-50">
        <img 
          src={getImageUrl(product.thumbnail)} 
          alt={product.title} 
          className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.stockQuantity <= 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Hết hàng
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors" title={product.title}>
            {product.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1">{product.categoryName}</p>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => addToCart(product.id, 1)}
            disabled={isLoading || product.stockQuantity <= 0}
            className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Thêm vào giỏ"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
