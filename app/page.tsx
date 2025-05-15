'use client'

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-blue-100 to-white text-gray-800">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl sm:text-6xl font-extrabold text-center mb-6 text-blue-700"
      >
        Gérez votre boutique en ligne <br /> avec facilité.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-lg sm:text-xl text-center mb-10 max-w-2xl"
      >
        Une solution moderne pour administrer vos produits, catégories, ventes et paiements. Une plateforme complète et intuitive pour booster votre commerce.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="flex gap-4"
      >
        <Link href="/admin/categorie">
          <Button size="lg">Espace Admin</Button>
        </Link>
        <Link href="/products">
          <Button size="lg" variant="outline">Découvrir</Button>
        </Link>
      </motion.div>

      <motion.div
        id="features"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl"
      >
        {[
          {
            title: "Gestion des Catégories",
            desc: "Ajoutez, modifiez et organisez les catégories de vos produits.",
          },
          {
            title: "Produits Dynamiques",
            desc: "Mettez à jour vos produits en quelques clics.",
          },
          {
            title: "Historique des Ventes",
            desc: "Suivez l'évolution de vos ventes en temps réel.",
          },
          {
            title: "Méthodes de Paiement",
            desc: "Gérez les moyens de paiement utilisés par vos clients.",
          },
          {
            title: "Statistiques",
            desc: "Visualisez les performances de votre boutique facilement.",
          },
          {
            title: "Sécurité",
            desc: "Connexion sécurisée et rôles d’accès personnalisés.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="bg-white shadow-md rounded-2xl p-6 text-center border"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-xl font-semibold text-blue-600 mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </main>
  )
} 
