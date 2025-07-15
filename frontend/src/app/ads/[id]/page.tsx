'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

export default function AdDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [ad, setAd] = useState<{
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    city: string;
    createdAt: string;
    user: {
      id: string;
      username: string;
      phone?: string;
    };
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAd = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/ads/${id}`);
        setAd(data);
      } catch (err) {
        setError('Failed to load ad details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="text-center py-5">
        <h4 className="text-danger">{error || 'Ad not found'}</h4>
        <button onClick={() => router.back()} className="btn btn-outline-primary mt-3">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="card shadow-sm">
        <div className="row g-0">
          {/* Image */}
          <div className="col-md-6">
            <div className="ratio ratio-1x1 bg-light">
              <img
                src={ad.imageUrl || '/placeholder-image.jpg'}
                alt={ad.title}
                className="img-fluid object-fit-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="col-md-6 p-4 d-flex flex-column justify-content-between">
            <div>
              <h2 className="h4 fw-bold text-primary mb-2">{ad.title}</h2>
              <div className="mb-3">
                <span className="badge bg-secondary me-2">{ad.category}</span>
                <small className="text-muted">
                  <i className="bi bi-geo-alt-fill me-1"></i>
                  {ad.city}
                </small>
              </div>
              <h4 className="text-success fw-semibold mb-3">
                {ad.price.toLocaleString()} €
              </h4>

              <h5 className="mt-4 mb-2">Description</h5>
              <p className="bg-light p-3 rounded">{ad.description}</p>
            </div>

            <div className="mt-4 pt-3 border-top">
              <h6 className="fw-bold mb-2">Seller Information</h6>
              <div className="d-flex align-items-center">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                  {ad.user.username.charAt(0).toUpperCase()}
                </div>
                <div className="ms-3">
                  <p className="mb-1 fw-medium">{ad.user.username}</p>
                  {ad.user.phone && <small className="text-muted">{ad.user.phone}</small>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card-footer d-flex flex-wrap gap-2 justify-content-between">
          <Link href="/" className="btn btn-outline-secondary w-100 w-md-auto">
            Back to List
          </Link>

          {user?.id === ad.user.id && (
            <div className="d-flex flex-wrap gap-2 w-100 w-md-auto">
              <Link href={`/ads/${ad.id}/edit`} className="btn btn-primary">
                Edit Ad
              </Link>
              <button
                onClick={async () => {
                  if (confirm('Are you sure you want to delete this ad?')) {
                    try {
                      await api.delete(`/ads/${ad.id}`);
                      router.push('/');
                    } catch (err) {
                      alert('Failed to delete ad');
                    }
                  }
                }}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
