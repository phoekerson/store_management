'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmationPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold">Commande confirmée !</h1>
        <p className="text-gray-600">
          Merci pour votre achat. Vous recevrez bientôt un email de confirmation avec les détails de votre commande.
        </p>
        <div className="pt-6">
          <Button onClick={() => router.push('/products')}>
            Continuer mes achats
          </Button>
        </div>
      </div>
    </div>
  );
} 