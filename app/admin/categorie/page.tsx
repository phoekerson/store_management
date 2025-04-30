import Link from "next/link"
import { prisma } from "@/lib/prisma"
import DeleteCategoryButton from "./DeleteCategorieButton"

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { created_at: "desc" },
  })

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Catégories</h1>
        <Link href="/admin/categorie/new" className="bg-blue-600 text-white px-4 py-2 rounded">
          Ajouter 
        </Link>
      </div>
      <ul className="mt-6 space-y-2">
        {categories.map((cat) => (
          <li key={cat.id} className="flex justify-between border p-3 rounded">
            <span>{cat.cat_name}</span>
            <div className="flex items-center">
              <Link href={`/admin/categorie/${cat.id}`} className="text-blue-600">Modifier</Link>
              <DeleteCategoryButton id={cat.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
