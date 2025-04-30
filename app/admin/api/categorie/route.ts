import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const body = await req.json()

  const category = await prisma.category.create({
    data: {
      cat_name: body.cat_name,
      created_at: new Date(),
      updated_at: new Date(),
    },
  })

  return NextResponse.json(category)
}
