'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/admin',
    label: 'Dashboard',
  },
  {
    href: '/admin/users',
    label: 'Utilisateurs',
  },
  {
    href: '/admin/products',
    label: 'Produits',
  },
  {
    href: '/admin/orders',
    label: 'Commandes',
  },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-4 border-b mb-4 pb-4">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors',
            pathname === item.href
              ? 'bg-gray-100 font-medium'
              : 'text-gray-600'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
} 