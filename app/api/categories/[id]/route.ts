import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        cat_name: true,
      },
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Erreur récupération catégories:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}


export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()

  const category = await prisma.category.update({
    where: { id: parseInt(params.id) },
    data: {
      cat_name: body.cat_name,
      updated_at: new Date(),
    },
  })

  return NextResponse.json(category)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.category.delete({
    where: { id: parseInt(params.id) },
  })

  return NextResponse.json({ success: true })
}
