'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

// Interface pour le produit
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

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    // Charger les détails du produit
    fetch(`/api/products/${id}`)
      .then(res => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Produit non trouvé');
          }
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data && data.success && data.product) {
          setProduct(data.product);
        } else {
          throw new Error('Format de données invalide');
        }
      })
      .catch(err => {
        console.error('Erreur chargement produit:', err);
        setError('Impossible de charger les détails du produit: ' + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Formatter le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'CFA'
    }).format(price);
  };

  // Formatter la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          <p>{error}</p>
        </div>
        <button 
          onClick={() => router.push('/products')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retour aux produits
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded mb-4">
          <p>Produit non trouvé</p>
        </div>
        <button 
          onClick={() => router.push('/products')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retour aux produits
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <nav className="mb-4">
        <Link href="/products" className="text-blue-500 hover:underline">
          &larr; Retour aux produits
        </Link>
      </nav>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Image du produit */}
          <div className="md:w-1/2">
            <div className="relative h-96 w-full">
              <Image 
                src={product.pro_img} 
                alt={product.pro_name} 
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
              />
            </div>
          </div>
          
          {/* Détails du produit */}
          <div className="p-6 md:w-1/2">
            <div className="mb-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {product.category.cat_name}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{product.pro_name}</h1>
            
            <p className="text-2xl text-blue-600 font-bold mb-4">
              {formatPrice(product.pro_price)}
            </p>
            
            <div className="border-t border-b py-4 my-4">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{product.pro_desc}</p>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex-1">
                Ajouter au panier
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex-1">
                Acheter maintenant
              </button>
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              <p>Ajouté le {formatDate(product.created_at)}</p>
              <p>Par {product.user.firstname} {product.user.lastname}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}