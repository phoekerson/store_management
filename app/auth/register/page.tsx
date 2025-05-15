// src/app/auth/register/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsSubmitting(true);

    try {
      // On exclut confirmPassword qui n'est pas nécessaire pour l'API
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      router.push('/');
    } catch (error: any) {
      setError(error.message || 'Échec de l\'inscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Inscription</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstname">Prénom</Label>
              <Input
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastname">Nom</Label>
              <Input
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="votreemail@exemple.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inscription en cours...
              </>
            ) : 'S\'inscrire'}
          </Button>
        </div>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Vous avez déjà un compte ?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}