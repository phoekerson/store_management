'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

// Interface pour les catégories
interface Category {
  id: number;
  cat_name: string;
}

// Interface pour les produits
interface Product {
  id: number;
  pro_name: string;
  pro_price: number;
  pro_desc: string;
  pro_img: string;
  categories_id: number;
}

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [formData, setFormData] = useState({
    pro_name: '',
    pro_price: '',
    pro_desc: '',
    categories_id: ''
  });
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    // Charger les catégories et les détails du produit
    Promise.all([
      fetch('/api/categorie').then(res => res.json()),
      fetch(`/api/products/${id}`).then(res => res.json())
    ])
      .then(([categoriesData, productData]) => {
        if (categoriesData && Array.isArray(categoriesData.categories)) {
          setCategories(categoriesData.categories);
        } else {
          console.error('Format de données categories invalide:', categoriesData);
        }

        if (productData && productData.success && productData.product) {
          const product = productData.product;
          setProduct(product);
          setFormData({
            pro_name: product.pro_name,
            pro_price: product.pro_price.toString(),
            pro_desc: product.pro_desc,
            categories_id: product.categories_id.toString()
          });
          setImagePreview(product.pro_img);
        } else {
          console.error('Format de données produit invalide:', productData);
          setError('Impossible de charger les détails du produit');
        }
      })
      .catch(err => {
        console.error('Erreur:', err);
        setError(`Erreur lors du chargement des données: ${err.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImage(file);
      
      // Créer une prévisualisation de l'image
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUpdateSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('pro_name', formData.pro_name);
      formDataToSend.append('pro_price', formData.pro_price);
      formDataToSend.append('pro_desc', formData.pro_desc);
      formDataToSend.append('categories_id', formData.categories_id);
      
      // Seulement si une nouvelle image est sélectionnée
      if (newImage) {
        formDataToSend.append('pro_img', newImage);
      }

      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du produit');
      }

      const data = await response.json();
      setUpdateSuccess('Produit mis à jour avec succès');
      
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);
    } catch (error) {
      setError(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Modification du Produit</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Modification du Produit</h1>
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          <p>{error}</p>
        </div>
        <button
          onClick={() => router.push('/admin/products')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Retour à la liste des produits
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Modification du Produit</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {updateSuccess && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
          <p>{updateSuccess}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pro_name">
            Nom du produit
          </label>
          <input
            type="text"
            id="pro_name"
            name="pro_name"
            value={formData.pro_name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pro_price">
            Prix
          </label>
          <input
            type="number"
            id="pro_price"
            name="pro_price"
            value={formData.pro_price}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pro_desc">
            Description
          </label>
          <textarea
            id="pro_desc"
            name="pro_desc"
            value={formData.pro_desc}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            required
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categories_id">
            Catégorie
          </label>
          <select
            id="categories_id"
            name="categories_id"
            value={formData.categories_id}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">-- Choisir une catégorie --</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.cat_name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Image actuelle
          </label>
          {imagePreview && (
            <div className="mt-2 mb-4">
              <div className="relative h-48 w-48">
                <Image
                  src={imagePreview.startsWith('data:') ? imagePreview : imagePreview}
                  alt="Prévisualisation"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded"
                />
              </div>
            </div>
          )}
          
          <label className="block text-gray-700 text-sm font-bold mb-2 mt-4" htmlFor="pro_img">
            Changer l'image (optionnel)
          </label>
          <input
            type="file"
            id="pro_img"
            name="pro_img"
            accept="image/*"
            onChange={handleImageChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Mettre à jour
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}