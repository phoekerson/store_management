'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: number;
  pro_name: string;
  pro_price: number;
  pro_desc: string;
  pro_img: string;
  category: {
    id: number;
    cat_name: string;
  };
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'CFA'
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Empêcher la navigation vers la page du produit
    addToCart({
      id: product.id,
      pro_name: product.pro_name,
      pro_price: product.pro_price,
      pro_img: product.pro_img
    });
    toast.success('Produit ajouté au panier');
  };

  return (
    <div className="group border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-48 w-full overflow-hidden">
          <Image 
            src={product.pro_img} 
            alt={product.pro_name} 
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h2 className="font-semibold text-lg mb-1 truncate">{product.pro_name}</h2>
          <p className="text-blue-600 font-bold">{formatPrice(product.pro_price)}</p>
          <p className="text-sm text-gray-500 mt-1">
            Catégorie: {product.category.cat_name}
          </p>
          
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              onClick={handleAddToCart}
              className="w-full"
              variant="secondary"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Ajouter au panier
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
} 