import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const category = await prisma.category.findUnique({
    where: { id: parseInt(params.id) }
  })

  return NextResponse.json(category)
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
