'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/AdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const pathname = usePathname();

  // Menu items configuration
  const menuItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Produits', path: '/admin/products' },
    { name: 'Catégories', path: '/admin/categorie' },
    { name: 'Ventes', path: '/admin/sales' },
    { name: 'Utilisateurs', path: '/admin/users' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Administration</h1>
      <AdminNav />
      {/* Top Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin" className="text-xl font-bold text-blue-600">
                  Admin WikiLeaks
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Link href="/" className="text-gray-600 hover:text-blue-600">
                Retour au site
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md h-[calc(100vh-4rem)] p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path || 
                (item.path !== '/admin' && pathname?.startsWith(item.path));

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block px-4 py-2 rounded-md ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}