'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProducts, ProductSummaryResponse, Page } from '@/services/product.service';
import { ProductCard } from '@/components/product/ProductCard';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const categoryId = searchParams.get('categoryId');
  
  const [data, setData] = useState<Page<ProductSummaryResponse> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchResults = async () => {
      setLoading(true);
      try {
        const result = await getProducts({
          keyword,
          categoryId: categoryId ? Number(categoryId) : undefined,
          size: 20
        });
        if (active) setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchResults();
    return () => { active = false; };
  }, [keyword, categoryId]);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 min-h-screen">
      {/* Sidebar Filter */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
          <h3 className="font-bold text-lg mb-4 pb-4 border-b border-gray-100">Bộ lọc tìm kiếm</h3>
          
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Khoảng giá</h4>
            {/* Simple placeholder for price filter */}
            <div className="space-y-2 text-sm text-gray-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600" /> Dưới 1 triệu
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600" /> 1 - 5 triệu
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600" /> Trên 5 triệu
              </label>
            </div>
          </div>
          
          <button className="w-full py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors">
            Áp dụng
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Kết quả tìm kiếm {keyword ? `cho "${keyword}"` : ''}
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          {data ? `Tìm thấy ${data.totalElements} sản phẩm` : 'Đang tìm kiếm...'}
        </p>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : (
          <>
            {data && data.content.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {data.content.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào phù hợp.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
