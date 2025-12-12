import React, { useState } from 'react';
import { Product, ADMIN_EMAILS } from '../types';
import { useStore } from '../store/useStore';
import { ShoppingBag, Heart, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProductCardProps {
  product: Product;
  onDelete?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  const { addToCart, toggleWishlist, wishlist, user } = useStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const isWishlisted = wishlist.includes(product.id);
  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

  // Fallback image if array is empty or invalid
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : `https://picsum.photos/seed/${product.id}/300/300`;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent any parent clicks
    
    if (!window.confirm('Are you sure you want to delete this product? This cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;
      
      if (onDelete) {
        onDelete(product.id);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300 relative group">
      <div className="relative aspect-square bg-gray-50">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        
        {/* Wishlist Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition text-gray-600 z-10"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Admin Delete Button */}
        {isAdmin && (
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="absolute top-2 left-2 p-1.5 rounded-full bg-red-500/90 hover:bg-red-600 text-white transition z-10 flex items-center justify-center shadow-sm"
            title="Delete Product"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        )}
      </div>
      
      <div className="p-3 flex flex-col flex-grow">
        <p className="text-xs text-secondary font-medium uppercase tracking-wide mb-1">{product.category}</p>
        <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-2 mb-2 flex-grow">{product.name}</h3>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-primary">₦{product.price.toLocaleString()}</span>
          <button 
            onClick={() => addToCart(product)}
            className="p-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition active:scale-95"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};