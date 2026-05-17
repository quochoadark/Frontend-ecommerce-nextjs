import { Suspense } from 'react';
import { getProducts } from '@/services/product.service';
import { ProductCard } from '@/components/product/ProductCard';
import Link from 'next/link';

async function ProductList() {
  const pageData = await getProducts({ size: 12, sortBy: 'createdAt', direction: 'desc' });
  
  if (!pageData.content || pageData.content.length === 0) {
    return <div className="text-center py-12 text-gray-500">Chưa có sản phẩm nào.</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {pageData.content.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Mua sắm thông minh, <br className="hidden md:block"/> Giao hàng siêu tốc.
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Khám phá hàng ngàn sản phẩm công nghệ, thời trang và tiêu dùng với giá tốt nhất thị trường.
          </p>
          <Link href="/search" className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            Khám phá ngay
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50 flex-grow">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Sản phẩm mới nhất</h2>
              <p className="text-gray-500 mt-2">Cập nhật xu hướng mua sắm mỗi ngày</p>
            </div>
            <Link href="/search" className="hidden md:inline-block text-blue-600 font-medium hover:underline">
              Xem tất cả &rarr;
            </Link>
          </div>

          <Suspense fallback={
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse"></div>
              ))}
            </div>
          }>
            <ProductList />
          </Suspense>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/search" className="inline-block bg-white border border-gray-300 text-gray-700 font-medium px-6 py-2 rounded-md hover:bg-gray-50">
              Xem tất cả
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
