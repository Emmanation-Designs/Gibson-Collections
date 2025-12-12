import React, { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { supabase } from '../lib/supabase';
import { Product, CATEGORIES } from '../types';
import { useStore } from '../store/useStore';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { searchQuery } = useStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setProducts(data || []);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      if (err.message === 'Failed to fetch') {
        setError('Network error: Could not connect to Supabase. Please check your internet connection or verify the database is active.');
      } else {
        setError(err.message || 'Failed to connect to the database.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Connection Error</h3>
        <p className="text-gray-600 mb-6 max-w-md text-sm">{error}</p>
        <button 
          onClick={fetchProducts}
          className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-blue-800 transition flex items-center gap-2 shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      {!searchQuery && (
        <div className="relative rounded-2xl overflow-hidden bg-primary text-white shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-600/50 z-10"></div>
          <div className="relative z-20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left mb-6 md:mb-0 max-w-lg">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Baby Care & More</h2>
              <p className="text-blue-100 text-lg mb-6">Premium quality bags, shoes, and baby essentials delivered to your doorstep.</p>
              <button 
                onClick={() => setSelectedCategory('Baby Care')}
                className="bg-white text-primary px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition shadow-lg"
              >
                Shop Baby Care
              </button>
            </div>
            {/* Baby Hero Image */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
               <img 
                 src="/baby.png" 
                 alt="Baby Care Collection" 
                 className="max-h-64 object-contain drop-shadow-2xl hover:scale-105 transition duration-500" 
               />
            </div>
          </div>
        </div>
      )}

      {/* Category Chips */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 sticky top-[130px] md:top-20 z-30 bg-surface/95 backdrop-blur-sm">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${
            selectedCategory === 'All' 
              ? 'bg-primary text-white shadow-md' 
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          All Items
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === cat 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <>
          {/* Section Headers if showing All */}
          {selectedCategory === 'All' && !searchQuery ? (
             <div className="space-y-10">
                {CATEGORIES.map(category => {
                  const catProducts = products.filter(p => p.category === category);
                  if (catProducts.length === 0) return null;
                  return (
                    <section key={category} id={category.toLowerCase().split(' ')[0]} className="scroll-mt-28">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800">{category}</h3>
                        <button 
                          onClick={() => setSelectedCategory(category)}
                          className="text-primary text-sm font-medium hover:underline"
                        >
                          View All
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                        {catProducts.slice(0, 4).map(product => (
                          <ProductCard 
                            key={product.id} 
                            product={product} 
                            onDelete={handleDeleteProduct}
                          />
                        ))}
                      </div>
                    </section>
                  )
                })}
             </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onDelete={handleDeleteProduct}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  {products.length === 0 ? "No products found in database." : "No products match your criteria."}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};