// prisma/seed-categories.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Vérifier si des catégories existent déjà
  const categoryCount = await prisma.category.count()
  
  console.log(`Nombre de catégories existantes: ${categoryCount}`)
  
  // Si aucune catégorie n'existe, en créer quelques-unes
  if (categoryCount === 0) {
    const categories = await prisma.category.createMany({
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
        },
        { 
          cat_name: "Beauté", 
          created_at: new Date(), 
          updated_at: new Date() 
        },
        { 
          cat_name: "Alimentation", 
          created_at: new Date(), 
          updated_at: new Date() 
        }
      ],
      skipDuplicates: true,
    })
    
    console.log(`${categories.count} catégories créées avec succès`)
  } else {
    console.log('Des catégories existent déjà, aucune création nécessaire')
  }

  // Afficher toutes les catégories pour vérification
  const allCategories = await prisma.category.findMany()
  console.log('Catégories disponibles dans la base de données:')
  console.table(allCategories)
}

main()
  .catch((e) => {
    console.error('Erreur lors de l\'initialisation des catégories:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })