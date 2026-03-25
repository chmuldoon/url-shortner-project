const API_BASE = 'http://localhost:3000';

export interface UrlData {
  id: string;
  short_url: string;
  long_url: string;
  created_at: string;
  redirect_count: number;
}

export async function fetchUrls(): Promise<UrlData[]> {
  const res = await fetch(`${API_BASE}/urls`);
  if (!res.ok) throw new Error('Failed to load URLs');
  return res.json() as Promise<UrlData[]>;
}

export async function shortenUrl(url: string): Promise<string> {
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
  return data.short_url;
}
