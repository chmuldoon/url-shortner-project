import { useEffect, useState } from 'react';
import './Page.css';

const API_BASE = 'http://localhost:3000';

interface UrlData {
  id: string;
  short_url: string;
  long_url: string;
  created_at: string;
  redirect_count: number;
}

export default function UrlsPage() {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/urls`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load URLs');
        return res.json() as Promise<UrlData[]>;
      })
      .then(setUrls)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">All URLs</h1>

      {loading && <p className="feedback">Loading…</p>}
      {error && <p className="feedback error">{error}</p>}

      {!loading && !error && urls.length === 0 && (
        <p className="feedback">No URLs yet. Go create one!</p>
      )}

      {urls.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Short URL</th>
              <th>Original URL</th>
              <th>Redirects</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((u) => (
              <tr key={u.id}>
                <td>
                  <a href={u.short_url} target="_blank" rel="noreferrer">
                    {u.short_url}
                  </a>
                </td>
                <td className="truncate">{u.long_url}</td>
                <td>{u.redirect_count}</td>
                <td>{new Date(u.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
