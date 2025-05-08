'use server';

import { getUserFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

export async function createProduct(formData: FormData) {
  // Utiliser votre fonction getUserFromToken au lieu de getServerSession
  const user = await getUserFromToken();

  if (!user || !user.id) {
    throw new Error("Non autorisé");
  }

  const pro_name = formData.get("pro_name") as string;
  const pro_price = parseInt(formData.get("pro_price") as string);
  const pro_desc = formData.get("pro_desc") as string;
  const categories_id = parseInt(formData.get("categories_id") as string);
  const file = formData.get("pro_img") as File;

  // Vérification des données
  if (!pro_name || !pro_price || !pro_desc || !categories_id || !file) {
    throw new Error("Tous les champs sont requis");
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = path.join("public/uploads", file.name);
    await writeFile(filePath, buffer);

    const product = await prisma.product.create({
      data: {
        pro_name,
        pro_price,
        pro_desc,
        pro_img: `/uploads/${file.name}`,
        categories_id,
        users_id: user.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return { success: true, product };
  } catch (error) {
    console.error("Erreur création produit:", error);
    throw new Error("Erreur lors de la création du produit");
  }
}