'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      alert('Connexion réussie')
      router.push('/admin')
    } else {
      alert('Erreur de connexion')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Connexion Admin</h2>
      <input name="email" placeholder="Email" type="email" onChange={handleChange} required className="w-full p-2 border mb-2" />
      <input name="password" placeholder="Mot de passe" type="password" onChange={handleChange} required className="w-full p-2 border mb-4" />
      <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded">Se connecter</button>
    </form>
  )
}
