import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {authOptions} from "@/lib/auth"
import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { sale_code, items, total } = data;

    // Créer une nouvelle vente
    const sale = await prisma.sale.create({
      data: {
        sale_code,
        users_id: parseInt(session.user.id),
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // Créer les factures pour chaque article
    const bills = await Promise.all(
      items.map(async (item: any) => {
        return prisma.bill.create({
          data: {
            products_id: item.products_id,
            qty: item.qty,
            prix_vente: item.prix_vente,
            total: item.total,
            bill_code: `${sale_code}-${item.products_id}`,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
      })
    );

    // Vérifier si la méthode de paiement par carte existe
    let paymethod = await prisma.paymethod.findFirst({
      where: {
        pay_name: 'Carte bancaire'
      }
    });

    // Si la méthode de paiement n'existe pas, la créer
    if (!paymethod) {
      paymethod = await prisma.paymethod.create({
        data: {
          pay_name: 'Carte bancaire',
          created_at: new Date(),
          updated_at: new Date(),
        }
      });
    }

    // Créer un paiement
    await prisma.payment.create({
      data: {
        paymethods_id: paymethod.id,
        sales_id: sale.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      sale,
      bills,
    });
  } catch (error: any) {
    console.error('Erreur lors de la création de la facture:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la facture' },
      { status: 500 }
    );
  }
} 