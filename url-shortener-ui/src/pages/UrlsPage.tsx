import { useUrls } from '../context/UrlsContext';
import './Page.css';

export default function UrlsPage() {
  const { urls, loading, error } = useUrls();

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
                <td>{new Date(u.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
