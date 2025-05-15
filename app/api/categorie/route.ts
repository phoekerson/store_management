// app/api/categorie/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Récupérer toutes les catégories
export async function GET(req: NextRequest) {
  try {
    console.log("API Catégorie: Début de la requête");
    
    // Récupérer toutes les catégories
    const categories = await prisma.category.findMany({
      orderBy: {
        cat_name: 'asc'
      }
    });
    
    console.log(`API Catégorie: ${categories.length} catégories récupérées`);
    
    return NextResponse.json({
      success: true,
      categories,
      message: `${categories.length} catégories récupérées`
    });
  } catch (error) {
    console.error('API Catégorie: Erreur:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des catégories',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

// Ajouter une nouvelle catégorie
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body.cat_name) {
      return NextResponse.json(
        { success: false, error: 'Le nom de la catégorie est requis' },
        { status: 400 }
      );
    }
    
    // Vérifier si la catégorie existe déjà
    const existingCategory = await prisma.category.findFirst({
      where: {
        cat_name: body.cat_name
      }
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Une catégorie avec ce nom existe déjà' },
        { status: 409 }
      );
    }
    
    const newCategory = await prisma.category.create({
      data: {
        cat_name: body.cat_name,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
    
    return NextResponse.json({
      success: true,
      category: newCategory,
      message: 'Catégorie créée avec succès'
    }, { status: 201 });
  } catch (error) {
    console.error('API Catégorie POST: Erreur:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la création de la catégorie',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}