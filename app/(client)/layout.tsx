// src/app/(client)/layout.tsx
import Header from '@/components/Header';
import { CartProvider } from '@/context/CartContext';

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </CartProvider>
  );
}