// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Créer les rôles par défaut
  const roles = ['USER', 'ADMIN']

  for (const roleName of roles) {
    // Vérifier si le rôle existe
    const existingRole = await prisma.role.findFirst({
      where: {
        role_name: roleName
      }
    })

    if (!existingRole) {
      await prisma.role.create({
        data: {
          role_name: roleName,
          created_at: new Date(),
          updated_at: new Date(),
        },
      })
      console.log(`Rôle ${roleName} créé avec succès`)
    }
  }

  console.log('Initialisation des rôles terminée')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })