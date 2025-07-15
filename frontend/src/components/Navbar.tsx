'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import UserAvatar from './UserAvatar';

export default function Navbar() {
  const { user, isLoading, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        {/* Logo */}
        <Link href="/" className="navbar-brand text-primary fw-bold fs-4">
          Oglasi
        </Link>

        {/* Toggle dugme for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="ms-auto d-flex align-items-center gap-2">
            {!isLoading && (
              user ? (
                <>
                  <UserAvatar/>
                  <Link href="/ads/create" className="btn btn-outline-primary btn-sm">
                    + Add ad
                  </Link>
                  <div className="d-flex align-items-center gap-2">
                    
                    <button
                      onClick={logout}
                      className="btn btn-primary btn-sm"
                    >
                      Log out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="btn btn-outline-secondary btn-sm">
                    Log in
                  </Link>
                  <Link href="/auth/register" className="btn btn-primary btn-sm">
                    Register
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';