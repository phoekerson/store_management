'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function CreateProductPage() {
  const [categorie, setCategories] = useState([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    userId: '',
  })

  const router = useRouter()

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch('/api/categorie')
      const data = await res.json()
      setCategories(data)
    }

    fetchCategories()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let imageUrl = ''

    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`
      const { data, error } = await supabase.storage
        .from('produits')
        .upload(fileName, imageFile)

      if (error) {
        console.error(error)
        alert("Erreur d'upload de l'image")
        return
      }

      const { data: publicUrlData } = supabase
        .storage
        .from('produits')
        .getPublicUrl(fileName)

      imageUrl = publicUrlData.publicUrl
    }

    const payload = {
      pro_name: form.name,
      pro_desc: form.description,
      pro_price: parseInt(form.price),
      pro_img: imageUrl,
      categories_id: parseInt(form.categoryId),
      users_id: parseInt(form.userId),
    }

    const res = await fetch('/api/produit', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
      router.push('/admin/produit')
    } else {
      alert("Erreur lors de l'ajout du produit")
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ajouter un produit</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Nom du produit" value={form.name} onChange={handleChange} required className="w-full border p-2 rounded" />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="price" type="number" step="0.01" placeholder="Prix" value={form.price} onChange={handleChange} required className="w-full border p-2 rounded" />
        
        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border p-2 rounded" />
        
        <select name="categoryId" value={form.categoryId} onChange={handleChange} required className="w-full border p-2 rounded">
          <option value="">Choisir une catégorie</option>
          {categorie.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.cat_name}</option>
          ))}
        </select>

        <input name="userId" placeholder="ID utilisateur" value={form.userId} onChange={handleChange} required className="w-full border p-2 rounded" />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Ajouter</button>
      </form>
    </div>
  )
}
