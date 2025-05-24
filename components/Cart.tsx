'use client';

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalAmount } = useCart();
  const router = useRouter();

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <h2 className="text-2xl font-semibold mb-4">Votre panier est vide</h2>
        <Button onClick={() => router.push('/products')}>
          Continuer vos achats
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Votre Panier</h2>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg shadow-sm">
            <div className="relative w-24 h-24">
              <Image
                src={item.pro_img}
                alt={item.pro_name}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex-grow">
              <h3 className="font-medium">{item.pro_name}</h3>
              <p className="text-gray-600">{item.pro_price.toFixed(2)} €</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                -
              </Button>
              <span className="w-8 text-center">{item.quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </Button>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeFromCart(item.id)}
            >
              Supprimer
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold">Total:</span>
          <span className="text-xl">{totalAmount.toFixed(2)} €</span>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.push('/products')}>
            Continuer les achats
          </Button>
          <Button onClick={() => router.push('/checkout')}>
            Procéder au paiement
          </Button>
        </div>
      </div>
    </div>
  );
} 