import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';
import { getUserFromToken } from '@/lib/auth';

// Récupérer un produit par son ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'ID invalide' },
        { status: 400 }
      );
    }
    
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        user: {
          select: {
            firstname: true,
            lastname: true,
            id: true
          }
        }
      }
    });
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Produit non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('API Product GET by ID: Erreur:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération du produit',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

// Mettre à jour un produit
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification
    const user = await getUserFromToken();
    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'ID invalide' },
        { status: 400 }
      );
    }

    // Vérifier si le produit existe
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    // Traiter les données envoyées
    const formData = await req.formData();
    const pro_name = formData.get('pro_name') as string;
    const pro_price = parseInt(formData.get('pro_price') as string);
    const pro_desc = formData.get('pro_desc') as string;
    const categories_id = parseInt(formData.get('categories_id') as string);
    const pro_img = formData.get('pro_img') as File | null;

    // Vérifier les données requises
    if (!pro_name || isNaN(pro_price) || !pro_desc || isNaN(categories_id)) {
      return NextResponse.json(
        { success: false, error: 'Données invalides' },
        { status: 400 }
      );
    }

    // Préparer les données de mise à jour
    let updateData: any = {
      pro_name,
      pro_price,
      pro_desc,
      categories_id,
      updated_at: new Date()
    };

    // Traiter la nouvelle image si elle est fournie
    if (pro_img && pro_img.size > 0) {
      const bytes = await pro_img.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const filePath = path.join("public/uploads", pro_img.name);
      await writeFile(filePath, buffer);
      
      updateData.pro_img = `/uploads/${pro_img.name}`;
    }

    // Mettre à jour le produit
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: 'Produit mis à jour avec succès'
    });
  } catch (error) {
    console.error('API Product PUT: Erreur:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la mise à jour du produit',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

// Supprimer un produit
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification
    const user = await getUserFromToken();
    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'ID invalide' },
        { status: 400 }
      );
    }

    // Vérifier si le produit existe
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si le produit a des factures associées
    const billCount = await prisma.bill.count({
      where: { products_id: id }
    });

    if (billCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Impossible de supprimer ce produit car il est lié à des factures'
        },
        { status: 400 }
      );
    }

    // Supprimer le produit
    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Produit supprimé avec succès'
    });
  } catch (error) {
    console.error('API Product DELETE: Erreur:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la suppression du produit',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}