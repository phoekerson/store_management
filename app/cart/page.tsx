// src/app/cart/page.tsx
'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalAmount } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    if (user) {
      router.push('/checkout');
    } else {
      router.push('/auth/login');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="flex justify-center mb-4">
          <ShoppingBag className="h-16 w-16 text-gray-300" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Votre panier est vide</h2>
        <p className="text-gray-500 mb-6">Découvrez nos produits et ajoutez-les à votre panier</p>
        <Link href="/products">
          <Button>Découvrir nos produits</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Votre Panier</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center p-4 sm:p-6">
              <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden relative">
                <Image
                  src={item.pro_img}
                  alt={item.pro_name}
                  fill
                  className="object-cover object-center"
                />
              </div>
              
              <div className="ml-4 flex-1">
                <h3 className="font-medium text-gray-900">{item.pro_name}</h3>
                <p className="text-blue-600 font-medium mt-1">
                  {formatPrice(item.pro_price)}
                </p>
              </div>
              
              <div className="flex items-center">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 text-gray-600 hover:text-blue-600"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 text-gray-600 hover:text-blue-600"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 sm:p-6 bg-gray-50">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Sous-total</span>
            <span>{formatPrice(totalAmount)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="font-medium">Livraison</span>
            <span>Gratuite</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(totalAmount)}</span>
          </div>
          
          <Button 
            onClick={handleCheckout} 
            className="w-full mt-6"
            size="lg"
          >
            {user ? 'Procéder au paiement' : 'Se connecter pour commander'}
          </Button>
          
          <div className="mt-4 text-center">
            <Link href="/products" className="text-blue-600 hover:underline text-sm">
              Continuer vos achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}