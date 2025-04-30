'use client'

import { useState } from "react"

export default function DeleteCategoryButton({ id }: { id: number }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    const confirmDelete = confirm("Confirmer la suppression ?")
    if (!confirmDelete) return

    setLoading(true)
    const res = await fetch(`/api/categorie/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      console.log("Suppression effectué abec succès")
    } else {
      alert("Suppression effectué avec succès")
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-800 font-semibold ml-4"
    >
      {loading ? "Suppression..." : "Supprimer"}
    </button>
  )
}
