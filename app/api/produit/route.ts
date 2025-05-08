// app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    console.log("API Categories: Début de la requête");
    
    // Vérifier si la table Category existe et contient des données
    const categoryCount = await prisma.category.count();
    console.log(`API Categories: Nombre de catégories trouvées: ${categoryCount}`);
    
    // Si aucune catégorie n'existe, en créer quelques-unes pour démo
    if (categoryCount === 0) {
      console.log("API Categories: Aucune catégorie trouvée, création de catégories par défaut");
      
      // Créer des catégories de démonstration
      await prisma.category.createMany({
        data: [
          { 
            cat_name: "Électronique", 
            created_at: new Date(), 
            updated_at: new Date() 
          },
          { 
            cat_name: "Vêtements", 
            created_at: new Date(), 
            updated_at: new Date() 
          },
          { 
            cat_name: "Maison", 
            created_at: new Date(), 
            updated_at: new Date() 
          }
        ],
        skipDuplicates: true,
      });
      
      console.log("API Categories: Catégories de démonstration créées");
    }
    
    // Récupérer toutes les catégories
    const categories = await prisma.category.findMany({
      orderBy: {
        cat_name: 'asc'
      }
    });
    
    console.log(`API Categories: ${categories.length} catégories récupérées`);
    
    return NextResponse.json({ 
      success: true, 
      categories,
      message: `${categories.length} catégories récupérées`
    });
  } catch (error) {
    console.error('API Categories: Erreur:', error);
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