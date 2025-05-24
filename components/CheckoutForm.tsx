'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';
import { useSession } from 'next-auth/react';

export default function CheckoutForm() {
  const { cartItems, totalAmount, clearCart } = useCart();
  const router = useRouter();
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    date: ''
  });
  const [formData, setFormData] = useState({
    fullName: session?.user?.name || '',
    email: session?.user?.email || '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}${month}${day}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (!session?.user) {
        throw new Error('Vous devez être connecté pour effectuer un achat');
      }

      // Simulation d'une requête de paiement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Générer les données de la facture
      const invoiceNumber = generateInvoiceNumber();
      const date = new Date().toLocaleDateString('fr-FR');
      
      setInvoiceData({
        invoiceNumber,
        date
      });

      // Créer la facture dans la base de données
      const billData = {
        sale_code: invoiceNumber,
        items: cartItems.map(item => ({
          products_id: item.id,
          qty: item.quantity,
          prix_vente: item.pro_price,
          total: item.pro_price * item.quantity
        })),
        total: totalAmount
      };

      const response = await fetch('/api/bills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(billData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la facture');
      }

      setShowInvoice(true);
      toast.success('Paiement effectué avec succès !');
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue lors du paiement.');
      if (!session?.user) {
        router.push('/auth/login');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalize = () => {
    clearCart();
    router.push('/order-confirmation');
  };

  if (!session?.user) {
    router.push('/auth/login');
    return null;
  }

  if (cartItems.length === 0) {
    router.push('/cart');
    return null;
  }

  if (showInvoice) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="bg-green-50 p-6 rounded-lg text-center mb-6">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">
            Commande confirmée !
          </h2>
          <p className="text-green-700 mb-6">
            Votre paiement a été traité avec succès. Vous pouvez télécharger votre facture ci-dessous.
          </p>
          <div className="space-y-4">
            <PDFDownloadLink
              document={
                <InvoicePDF
                  items={cartItems}
                  totalAmount={totalAmount}
                  invoiceNumber={invoiceData.invoiceNumber}
                  date={invoiceData.date}
                />
              }
              fileName={`facture-${invoiceData.invoiceNumber}.pdf`}
              className="block"
            >
              {({ loading }) => (
                <Button disabled={loading} className="w-full">
                  {loading ? 'Génération...' : 'Télécharger la facture'}
                </Button>
              )}
            </PDFDownloadLink>
            <Button
              onClick={handleFinalize}
              variant="outline"
              className="w-full"
            >
              Continuer mes achats
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6">Paiement</h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Récapitulatif de la commande</h3>
        <p className="text-lg font-semibold">Total: {totalAmount.toFixed(2)} €</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Nom complet</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Code postal</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="font-medium mb-4">Informations de paiement</h3>
            
            <div>
              <Label htmlFor="cardNumber">Numéro de carte</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="expiryDate">Date d'expiration</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/AA"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/cart')}
          >
            Retour au panier
          </Button>
          <Button
            type="submit"
            disabled={isProcessing}
          >
            {isProcessing ? 'Traitement...' : 'Payer maintenant'}
          </Button>
        </div>
      </form>
    </div>
  );
} 