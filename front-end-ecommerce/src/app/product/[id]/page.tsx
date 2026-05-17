import React, { Suspense } from 'react';
import Link from 'next/link';
import { getProductById } from '@/services/product.service';
import { ProductDetailClient } from './ProductDetailClient';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProductById(Number(resolvedParams.id));

  return (
    <div className="bg-white min-h-screen pt-8 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8 flex items-center space-x-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link href={`/search?categoryId=${product.categoryId}`} className="hover:text-blue-600 transition-colors">
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{product.title}</span>
        </nav>

        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-2xl"></div>}>
          <ProductDetailClient product={product} />
        </Suspense>
      </div>
    </div>
  );
}
