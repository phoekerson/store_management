'use client';

import { useState, useEffect } from "react";
import { createProduct } from "./action";
import { useRouter } from "next/navigation";

// Définir l'interface pour les catégories
interface Category {
  id: number;
  cat_name: string;
  created_at: string;
  updated_at: string;
}

export default function CreateProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Ajouter un log pour déboguer
    console.log("Chargement des catégories...");
    
    fetch("/api/categories")
      .then(res => {
        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Données reçues:", data);
        
        if (data && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          throw new Error("Format de données invalide");
        }
      })
      .catch(err => {
        console.error("Erreur chargement catégories:", err);
        setError("Impossible de charger les catégories: " + err.message);
      });
  }, []);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
   
    try {
      const res = await createProduct(formData);
      alert("Produit créé avec succès");
      // Rediriger vers la liste des produits ou vider le formulaire
      router.push("/admin/products"); // Adaptez selon votre structure de routes
    } catch (e: any) {
      console.error(e);
      setError("Erreur lors de la création du produit: " + (e.message || "Erreur inconnue"));
    } finally {
      setLoading(false);
    }
  }

  // Vérifier si nous avons des catégories à afficher
  const hasCategoriesData = categories && categories.length > 0;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Créer un nouveau produit</h1>
     
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
     
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nom du produit</label>
          <input
            name="pro_name"
            placeholder="Nom du produit"
            required
            className="w-full p-2 border rounded"
          />
        </div>
       
        <div>
          <label className="block mb-1">Prix</label>
          <input
            name="pro_price"
            type="number"
            placeholder="Prix"
            required
            className="w-full p-2 border rounded"
          />
        </div>
       
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="pro_desc"
            placeholder="Description"
            required
            className="w-full p-2 border rounded h-32"
          ></textarea>
        </div>
       
        <div>
          <label className="block mb-1">Image</label>
          <input
            type="file"
            name="pro_img"
            accept="image/*"
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Catégorie</label>
          <select
            name="categories_id"
            required
            className="w-full p-2 border rounded"
          >
            <option value="">-- Choisir une catégorie --</option>
            {hasCategoriesData ? (
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.cat_name}
                </option>
              ))
            ) : (
              <option disabled>Chargement des catégories...</option>
            )}
          </select>
          {!hasCategoriesData && !error && (
            <p className="text-yellow-600 text-sm mt-1">Chargement des catégories...</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !hasCategoriesData}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "Création en cours..." : "Créer le produit"}
        </button>
      </form>
    </div>
  );
}