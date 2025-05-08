'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', password: '' })

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      alert('Inscription réussie')
      router.push('/admin/login')
    } else {
      alert('Erreur')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Inscription Admin</h2>
      <input name="firstname" placeholder="Prénom" onChange={handleChange} required className="w-full p-2 border mb-2" />
      <input name="lastname" placeholder="Nom" onChange={handleChange} required className="w-full p-2 border mb-2" />
      <input name="email" placeholder="Email" type="email" onChange={handleChange} required className="w-full p-2 border mb-2" />
      <input name="password" placeholder="Mot de passe" type="password" onChange={handleChange} required className="w-full p-2 border mb-4" />
      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">S'inscrire</button>
    </form>
  )
}
