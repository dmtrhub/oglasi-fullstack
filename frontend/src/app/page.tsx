"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { api } from "@/lib/api";
import Link from "next/link";
import {
  BiSearch,
  BiEuro,
  BiMapPin,
} from "react-icons/bi";

type Ad = {
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
  };
};

type PaginatedAds = {
  data: Ad[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
};

const categories = [
  { value: "clothing", label: "Clothing" },
  { value: "tools", label: "Tools" },
  { value: "sports", label: "Sports" },
  { value: "accessories", label: "Accessories" },
  { value: "furniture", label: "Furniture" },
  { value: "pets", label: "Pets" },
  { value: "games", label: "Games" },
  { value: "books", label: "Books" },
  { value: "technology", label: "Technology" },
  { value: "other", label: "Other" },
];

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    title: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    page: 1,
    showMine: false,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    lastPage: 1,
  });

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        let url = "/ads?";
        const params = new URLSearchParams();

        if (filters.category) params.append("category", filters.category);
        if (filters.title) params.append("title", filters.title);
        if (filters.city) params.append("city", filters.city);
        if (filters.minPrice) params.append("minPrice", filters.minPrice);
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
        params.append("page", filters.page.toString());

        if (filters.showMine && user) {
          const response = await api.get(`/ads/mine?${params.toString()}`);
          setAds(response.data);
          setPagination(response.meta);
        } else {
          const response = await api.get(`/ads?${params.toString()}`);
          setAds(response.data);
          setPagination(response.meta);
        }
      } catch (error) {
        console.error("Failed to fetch ads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [filters, user]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleShowMineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, showMine: e.target.checked, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Filter Section */}
      <div className="shadow-sm sticky-top z-3">
        <div className="container">
          <div className="row g-2 py-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <BiSearch />
                </span>
                <input
                  type="text"
                  name="title"
                  value={filters.title}
                  onChange={handleFilterChange}
                  className="form-control form-control-sm"
                  placeholder="Search ads..."
                />
              </div>
            </div>

            <div className="col-md-2">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="form-select form-select-sm"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <div className="input-group">
                <span className="input-group-text">
                  <BiMapPin />
                </span>
                <input
                  type="text"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  className="form-control form-control-sm"
                  placeholder="City"
                />
              </div>
            </div>

            <div className="col-md-2">
              <div className="input-group">
                <span className="input-group-text">
                  <BiEuro />
                </span>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="form-control form-control-sm"
                  placeholder="Min"
                />
              </div>
            </div>

            <div className="col-md-2">
              <div className="input-group">
                <span className="input-group-text">
                  <BiEuro />
                </span>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="form-control form-control-sm"
                  placeholder="Max"
                />
              </div>
            </div>

            {!!user && (
              <div className="col-12">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="showMine"
                    checked={filters.showMine}
                    onChange={handleShowMineChange}
                  />
                  <label className="form-check-label small text-dark" htmlFor="showMine">
                    Show my ads only
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ads Grid */}
      <div className="container py-4">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : ads.length === 0 ? (
          <div className="text-center py-5">
            <div className="text-muted mb-3">
              <svg
                width="48"
                height="48"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h5 className="text-muted">No ads found</h5>
            <p className="text-muted small">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <div className="row row-cols-2 row-cols-md-4 g-3">
              {ads.slice(0, 20).map((ad) => (
                <div key={ad.id} className="col">
                  <div className="card h-100 shadow-sm">
                    {/* Image */}
                    <div
                      className="d-flex justify-content-center align-items-center bg-light"
                      style={{ height: "150px", overflow: "hidden" }}
                    >
                      <img
                        src={ad.imageUrl || "/placeholder-image.jpg"}
                        alt={ad.title}
                        className="img-fluid"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </div>

                    {/* Card body */}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fs-6 text-truncate">
                        {ad.title}
                      </h5>
                      <p className="card-text fw-bold text-primary mb-2">
                        {ad.price.toLocaleString()} €
                      </p>

                      <div className="mb-2 d-flex justify-content-between">
                        <small className="text-muted">
                          <i className="bi bi-geo-alt-fill me-1" />
                          {ad.city}
                        </small>
                        <small className="text-muted">{ad.category}</small>
                      </div>

                      <div className="mt-auto d-flex flex-wrap gap-2">
                        <Link
                          href={`/ads/${ad.id}`}
                          className="btn btn-sm btn-outline-primary w-100"
                        >
                          Details
                        </Link>

                        {/* Only show Edit/Delete if the user is the owner */}
                        {user?.id === ad.user.id && (
                          <>
                            <Link
                              href={`/ads/${ad.id}/edit`}
                              className="btn btn-sm btn-outline-secondary w-100"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={async () => {
                                if (
                                  confirm(
                                    "Are you sure you want to delete this ad?"
                                  )
                                ) {
                                  try {
                                    const response = await api.delete(
                                      `/ads/${ad.id}`
                                    );
                                    alert(
                                      response.message ||
                                        "Ad deleted successfully"
                                    );
                                    setAds((prev) =>
                                      prev.filter((x) => x.id !== ad.id)
                                    );
                                  } catch (err) {
                                    alert("Failed to delete ad");
                                    console.error("Delete error:", err);
                                  }
                                }
                              }}
                              className="btn btn-sm btn-outline-danger w-100"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.lastPage > 1 && (
              <nav className="mt-4 d-flex justify-content-center">
                <ul className="pagination pagination-sm">
                  <li
                    className={`page-item ${
                      filters.page === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        handlePageChange(Math.max(1, filters.page - 1))
                      }
                    >
                      Previous
                    </button>
                  </li>

                  {Array.from(
                    { length: Math.min(5, pagination.lastPage) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.lastPage <= 5) {
                        pageNum = i + 1;
                      } else if (filters.page <= 3) {
                        pageNum = i + 1;
                      } else if (filters.page >= pagination.lastPage - 2) {
                        pageNum = pagination.lastPage - 4 + i;
                      } else {
                        pageNum = filters.page - 2 + i;
                      }

                      return (
                        <li
                          key={pageNum}
                          className={`page-item ${
                            filters.page === pageNum ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </button>
                        </li>
                      );
                    }
                  )}

                  <li
                    className={`page-item ${
                      filters.page === pagination.lastPage ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() =>
                        handlePageChange(
                          Math.min(pagination.lastPage, filters.page + 1)
                        )
                      }
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}
