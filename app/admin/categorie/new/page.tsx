'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewCategory() {
  const [name, setName] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await fetch("/api/categorie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cat_name: name }),
    })

    router.push("/admin/categorie")
  }

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h1 className="text-xl font-bold mb-4">Nouvelle Catégorie</h1>
      <input
        type="text"
        placeholder="Nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Enregistrer</button>
    </form>
  )
}
