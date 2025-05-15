// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Supprimer le cookie d'authentification
  (await
        // Supprimer le cookie d'authentification
        cookies()).set('auth-token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return NextResponse.json({ success: true });
}