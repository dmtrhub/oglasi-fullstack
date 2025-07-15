'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function EditAdPage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    city: '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch current ad data on mount
  useEffect(() => {
    const fetchAd = async () => {
      try {
        setLoading(true);
        const ad = await api.get(`/ads/${id}`);
        setFormData({
          title: ad.title,
          description: ad.description,
          price: ad.price.toString(),
          category: ad.category,
          city: ad.city,
          imageUrl: ad.imageUrl || '',
        });
      } catch (err) {
        setError('Failed to load ad data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // PUT /ads/:id expects data without id, user etc
      const updateData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        city: formData.city,
        imageUrl: formData.imageUrl,
      };

      await api.put(`/ads/${id}`, updateData);
      alert('Ad updated successfully!');
      router.push(`/ads/${id}`);
    } catch (err) {
      setError('Failed to update ad');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-5">Loading ad data...</div>;

  return (
    <div className="container my-5">
      <h2>Edit Ad</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={100}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price (€)</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.1"
            className="form-control"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            id="category"
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {[
              'clothing',
              'tools',
              'sports',
              'accessories',
              'furniture',
              'pets',
              'games',
              'books',
              'technology',
              'other',
            ].map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="city" className="form-label">City</label>
          <input
            id="city"
            name="city"
            type="text"
            className="form-control"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="imageUrl" className="form-label">Image URL</label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="text"
            className="form-control"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
