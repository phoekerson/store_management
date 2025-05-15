
// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Récupérer un produit par son ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'ID invalide' },
        { status: 400 }
      )
    }
    
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        user: {
          select: {
            firstname: true,
            lastname: true,
            id: true
          }
        }
      }
    })
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Produit non trouvé' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      product
    })
  } catch (error) {
    console.error('API Product GET by ID: Erreur:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération du produit',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}