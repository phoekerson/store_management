// src/components/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">WikiLeaks</Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link 
            href="/" 
            className={`${pathname === '/' ? 'text-blue-600 font-medium' : 'text-gray-700'} hover:text-blue-600`}
          >
            Accueil
          </Link>
          <Link 
            href="/products" 
            className={`${pathname === '/products' ? 'text-blue-600 font-medium' : 'text-gray-700'} hover:text-blue-600`}
          >
            Produits
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-blue-600" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-3">
              <Link 
                href="/profile" 
                className="text-gray-700 hover:text-blue-600 flex items-center"
              >
                <User className="h-5 w-5 mr-1" />
                <span className="hidden md:inline">{user.firstname}</span>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="hidden md:inline-flex"
              >
                Déconnexion
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">Connexion</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Inscription</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}