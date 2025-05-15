// app/api/categorie/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Récupérer une catégorie par son ID
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
    
    const category = await prisma.category.findUnique({
      where: { id }
    })
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Catégorie non trouvée' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(category)
  } catch (error) {
    console.error('API Catégorie GET by ID: Erreur:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération de la catégorie',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

// Mettre à jour une catégorie
export async function PUT(
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
    
    const body = await req.json()
    
    if (!body.cat_name) {
      return NextResponse.json(
        { success: false, error: 'Le nom de la catégorie est requis' },
        { status: 400 }
      )
    }
    
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        cat_name: body.cat_name,
        updated_at: new Date()
      }
    })
    
    return NextResponse.json({
      success: true,
      category: updatedCategory,
      message: 'Catégorie mise à jour avec succès'
    })
  } catch (error) {
    console.error('API Catégorie PUT: Erreur:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la mise à jour de la catégorie',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

// Supprimer une catégorie
export async function DELETE(
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
    
    // Vérifier si la catégorie a des produits associés
    const productCount = await prisma.product.count({
      where: { categories_id: id }
    })
    
    if (productCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Impossible de supprimer cette catégorie car elle contient des produits'
        },
        { status: 400 }
      )
    }
    
    await prisma.category.delete({
      where: { id }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Catégorie supprimée avec succès'
    })
  } catch (error) {
    console.error('API Catégorie DELETE: Erreur:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la suppression de la catégorie',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}