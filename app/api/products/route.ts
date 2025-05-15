// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Récupérer tous les produits
export async function GET(req: NextRequest) {
  try {
    console.log("API Products: Début de la requête");
    
    // Récupérer tous les produits avec leurs catégories
    const products = await prisma.product.findMany({
      include: {
        category: true,
        user: {
          select: {
            firstname: true,
            lastname: true,
            id: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    
    console.log(`API Products: ${products.length} produits récupérés`);
    
    return NextResponse.json({
      success: true,
      products,
      message: `${products.length} produits récupérés`
    });
  } catch (error) {
    console.error('API Products: Erreur:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des produits',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}