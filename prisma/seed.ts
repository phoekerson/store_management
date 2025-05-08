// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Vérifier si le rôle 'admin' existe déjà
  const adminExists = await prisma.role.findFirst({
    where: { role_name: 'admin' }
  })

  // Si le rôle 'admin' n'existe pas, le créer
  if (!adminExists) {
    await prisma.role.create({
      data: {
        role_name: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      }
    })
    console.log('Rôle admin créé avec succès')
  }

  // Vérifier si le rôle 'user' existe déjà
  const userExists = await prisma.role.findFirst({
    where: { role_name: 'user' }
  })

  // Si le rôle 'user' n'existe pas, le créer
  if (!userExists) {
    await prisma.role.create({
      data: {
        role_name: 'user',
        created_at: new Date(),
        updated_at: new Date()
      }
    })
    console.log('Rôle user créé avec succès')
  }

  // Afficher tous les rôles pour vérification
  const roles = await prisma.role.findMany()
  console.log('Rôles disponibles dans la base de données:', roles)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })