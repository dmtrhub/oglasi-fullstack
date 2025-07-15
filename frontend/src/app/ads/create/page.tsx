'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { api } from '@/lib/api';

const categories = [
  'clothing', 'tools', 'sports', 'accessories', 'furniture',
  'pets', 'games', 'books', 'technology', 'other'
];

export default function CreateAdPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    price: '',
    category: '',
    city: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return <p className="text-center mt-5">You must be logged in to create an ad.</p>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price)  // ensure number
      };

      const res = await api.post('/ads', payload);

      alert('Ad created successfully!');
      router.push('/');
    } catch (err: any) {
      console.error('Create error:', err);
      setError(err.message || 'Failed to create ad');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 text-primary">Create New Ad</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            id="title"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="imageUrl" className="form-label">Image URL</label>
          <input
            id="imageUrl"
            name="imageUrl"
            className="form-control"
            type="url"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price (€)</label>
          <input
            id="price"
            name="price"
            type="number"
            className="form-control"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
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
            <option value="">-- Select --</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="city" className="form-label">City</label>
          <input
            id="city"
            name="city"
            className="form-control"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Ad'}
        </button>
      </form>
    </div>
  );
}
