import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' 

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { cat_name } = body

    const newCategory = await prisma.category.create({
      data: {
        cat_name,
        created_at: new Date(),
        updated_at: new Date(),
      },
    })

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
