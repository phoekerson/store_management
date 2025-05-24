// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { Prisma, Role } from '@prisma/client'

interface RegisterBody {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as RegisterBody
    const { firstname, lastname, email, password } = body

    // Validation des données
    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      )
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Vérifier s'il y a déjà des utilisateurs
    const usersCount = await prisma.user.count()

    // Récupérer ou créer les rôles
    let role = await prisma.role.findFirst({
      where: {
        role_name: usersCount === 0 ? 'ADMIN' : 'USER'
      }
    })

    if (!role) {
      role = await prisma.role.create({
        data: {
          role_name: usersCount === 0 ? 'ADMIN' : 'USER',
          created_at: new Date(),
          updated_at: new Date(),
        }
      })
    }

    // Création de l'utilisateur
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
      include: {
        role: true,
      },
    })

    // On ne renvoie pas le mot de passe
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: 'Utilisateur créé avec succès',
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Erreur lors de l\'inscription:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    )
  }
}