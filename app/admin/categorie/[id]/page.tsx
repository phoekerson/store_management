'use client'
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"

export default function EditCategory() {
  const { id } = useParams()
  const router = useRouter()
  const [name, setName] = useState("")

  useEffect(() => {
    fetch(`/api/categorie/${id}`)
      .then(res => res.json())
      .then(data => setName(data.cat_name))
  }, [id])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    await fetch(`/api/categorie/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cat_name: name }),
    })

    router.push("/admin/categorie")
  }

  return (
    <form onSubmit={handleUpdate} className="p-6">
      <h1 className="text-xl font-bold mb-4">Modifier Catégorie</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Mettre à jour</button>
    </form>
  )
}
