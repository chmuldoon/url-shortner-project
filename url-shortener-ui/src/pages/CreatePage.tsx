import { useState } from 'react';
import { useUrls } from '../context/UrlsContext';
import './Page.css';
const BACKEND_URL = 'http://localhost:3000';
const FRONTEND_URL = 'http://localhost:5173';
export default function CreatePage() {
  const { shorten } = useUrls();

  const [url, setUrl] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);


  const convertToFrontendUrl = (url: string) => {
    return url.replace(BACKEND_URL, FRONTEND_URL);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const shortUrl = await shorten(url);
      setResult(shortUrl);
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
            {convertToFrontendUrl(result)}
          </a>
          <button className="btn btn-sm" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
}
