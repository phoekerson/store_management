import { Suspense } from 'react';

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nos Produits</h1>
            <p className="mt-2 text-sm text-gray-600">
              Découvrez notre sélection de produits de qualité
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <Suspense fallback={
              <div className="w-full h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
              </div>
            }>
              {children}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
} 