// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import {prisma} from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Récupérer le token depuis les cookies
    const token = (await cookies()).get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      id: number;
      email: string;
    };

    // Récupérer l'utilisateur depuis la base de données
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Retourner les données utilisateur sans le mot de passe
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
    
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { message: 'Non authentifié' },
      { status: 401 }
    );
  }
}