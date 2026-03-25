import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchUrls, shortenUrl, type UrlData } from '../api/urls';

interface UrlsContextValue {
  urls: UrlData[];
  loading: boolean;
  error: string | null;
  shorten: (url: string) => Promise<string>;
  refresh: () => void;
}

const UrlsContext = createContext<UrlsContextValue | null>(null);

export function UrlsProvider({ children }: { children: React.ReactNode }) {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetchUrls()
      .then((data) => {
        setUrls(data);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(() => {
    setLoading(true);
    load();
  }, [load]);

  const shorten = useCallback(async (url: string): Promise<string> => {
    const shortUrl = await shortenUrl(url);
    refresh();
    return shortUrl;
  }, [refresh]);

  return (
    <UrlsContext.Provider value={{ urls, loading, error, shorten, refresh }}>
      {children}
    </UrlsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUrls(): UrlsContextValue {
  const ctx = useContext(UrlsContext);
  if (!ctx) throw new Error('useUrls must be used within a UrlsProvider');
  return ctx;
}
