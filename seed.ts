// seed.ts
import { prisma } from './lib/prisma'

async function main() {
  const exists = await prisma.role.findFirst({ where: { role_name: 'admin' } })
  if (!exists) {
    await prisma.role.create({
      data: {
        role_name: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      }
    })
  }
}

main().then(() => {
  console.log('Seed completed')
  process.exit(0)
})
