import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Page.css';
const API_BASE = 'http://localhost:3000';

export default function RedirectPage() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/resolve/${shortCode}`)
      .then((res) => {
        if (!res.ok) { setNotFound(true); return null; }
        return res.json() as Promise<{ long_url: string }>;
      })
      .then((data) => {
        if (data?.long_url) window.location.href = data.long_url;
      })
      .catch(() => setNotFound(true));
  }, [shortCode]);

  if (notFound) {
    return (
      <div className="page">
        <h1 className="page-title">404 — Not Found</h1>
        <p className="feedback">
          No URL found for <strong>/{shortCode}</strong>.
        </p>
        <Link to="/create" className="btn" style={{ display: 'inline-block', marginTop: '20px', textDecoration: 'none' }}>
          Create a short URL
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <p className="feedback">Redirecting…</p>
    </div>
  );
}
