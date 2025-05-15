// src/app/checkout/page.tsx
'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('1'); // ID de la méthode de paiement (ex: 1 pour Carte bancaire)
  
  const [shippingDetails, setShippingDetails] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
  });

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Si le panier est vide, on redirige vers la page d'accueil
      if (cartItems.length === 0) {
        router.push('/products');
        return;
      }

      // Appel à l'API pour créer la commande
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          paymentMethodId: parseInt(paymentMethod),
          shippingDetails,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la commande');
      }

      // Succès: on vide le panier et on affiche le message de succès
      clearCart();
      setSuccess(true);
      
      // Redirection vers la page d'accueil après 3 secondes
      setTimeout(() => {
        router.push('/');
      }, 3000);

    } catch (error: any) {
      console.error('Checkout error:', error);
      setError(error.message || 'Une erreur est survenue lors du paiement');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Afficher un message de succès si la commande est passée
  if (success) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Commande confirmée !</h1>
        <p className="text-gray-600 mb-6">
          Merci pour votre achat. Vous recevrez bientôt un email de confirmation.
        </p>
        <Button onClick={() => router.push('/')}>
          Retour à l&apos;accueil
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Finaliser votre commande</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Adresse de livraison</CardTitle>
                <CardDescription>
                  Où souhaitez-vous recevoir votre commande ?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    name="address"
                    value={shippingDetails.address}
                    onChange={handleShippingChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      name="city"
                      value={shippingDetails.city}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={shippingDetails.postalCode}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Pays</Label>
                  <Select 
                    value={shippingDetails.country} 
                    onValueChange={(value) => setShippingDetails(prev => ({ ...prev, country: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un pays" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Belgique">Belgique</SelectItem>
                      <SelectItem value="Suisse">Suisse</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Méthode de paiement</CardTitle>
                <CardDescription>
                  Choisissez comment vous souhaitez payer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="1" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      Carte bancaire
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="2" id="paypal" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                      PayPal
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting || cartItems.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : `Payer ${formatPrice(totalAmount)}`}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.pro_name} <span className="text-gray-500">x{item.quantity}</span>
                    </span>
                    <span>{formatPrice(item.pro_price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>Gratuite</span>
                </div>
              </div>
              <div className="border-t pt-2 font-bold">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}