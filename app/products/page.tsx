'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';

// Interface pour les produits
interface Product {
  id: number;
  pro_name: string;
  pro_price: number;
  pro_desc: string;
  pro_img: string;
  created_at: string;
  updated_at: string;
  categories_id: number;
  users_id: number;
  category: {
    id: number;
    cat_name: string;
  };
  user: {
    id: number;
    firstname: string;
    lastname: string;
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Charger les produits
    fetch('/api/products')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          throw new Error('Format de données invalide');
        }
      })
      .catch(err => {
        console.error('Erreur chargement produits:', err);
        setError('Impossible de charger les produits: ' + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {products.length === 0 ? (
        <p className="text-center text-gray-500">Aucun produit disponible pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}