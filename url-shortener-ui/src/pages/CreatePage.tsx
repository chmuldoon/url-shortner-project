import { useState } from 'react';
import './Page.css';

const API_BASE = 'http://localhost:3000';

export default function CreatePage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        throw new Error(data.message ?? 'Something went wrong');
      }

      const data = (await res.json()) as { short_url: string };
      setResult(data.short_url);
      setUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="page">
      <h1 className="page-title">Shorten a URL</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          type="url"
          placeholder="https://example.com/your-long-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'Shortening…' : 'Shorten'}
        </button>
      </form>

      {error && <p className="feedback error">{error}</p>}

      {result && (
        <div className="result">
          <a href={result} target="_blank" rel="noreferrer" className="result-url">
            {result}
          </a>
          <button className="btn btn-sm" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
}
