// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { firstname, lastname, email, password } = await req.json()

    // Vérifier si l'email existe déjà
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Vérifier si des rôles existent
    const rolesCount = await prisma.role.count()
    
    // Si aucun rôle n'existe, créer le rôle admin
    if (rolesCount === 0) {
      await prisma.role.create({
        data: {
          role_name: 'admin',
          created_at: new Date(),
          updated_at: new Date()
        }
      })
      console.log('Rôle admin créé automatiquement')
    }
    
    // Récupérer le rôle admin ou le premier rôle disponible
    const role = await prisma.role.findFirst({ 
      where: { role_name: 'admin' } 
    }) || await prisma.role.findFirst()
    
    if (!role) {
      return NextResponse.json({ 
        error: 'Impossible de créer un utilisateur sans rôle valide' 
      }, { status: 500 })
    }

    // Créer l'utilisateur avec le rôle trouvé
    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        roles_id: role.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    })

    // Ne pas retourner le mot de passe dans la réponse
    const { password: _, ...userWithoutPassword } = user
    
    return NextResponse.json({ 
      message: 'Inscription réussie', 
      user: userWithoutPassword 
    })
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
    return NextResponse.json({ 
      error: 'Une erreur est survenue lors de l\'inscription' 
    }, { status: 500 })
  }
}