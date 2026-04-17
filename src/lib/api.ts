export type AdminOverview = {
  users: number;
  movies: number;
  payments: number;
  purchases: number;
  revenue: number;
};

export type MovieApiItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  thumbnailUrl?: string;
  trailerUrl?: string;
  storageKey?: string;
  year?: number;
  duration?: string;
  rentPrice?: number;
  buyPrice?: number;
  accessible?: boolean;
};

export type LibraryItem = {
  id: string;
  accessType: 'RENT' | 'BUY';
  amount: number;
  status: string;
  createdAt: string;
  movie?: MovieApiItem;
};

export type SecureAccess = {
  streamUrl: string;
  downloadUrl: string;
  expiresIn: string;
};

type AuthResponse = {
  message?: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function buildApiUrl(path: string) {
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error((payload as { message?: string }).message || 'Request failed');
  }

  return payload as T;
}

export function loginUser(email: string, password: string) {
  return apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: String(email).trim().toLowerCase(),
      password: String(password).trim(),
    }),
  });
}

export function loginDemoUser() {
  return loginUser('user@ishemacinema.rw', 'User@123');
}

export async function fetchHealth() {
  return apiRequest<{ status: string; message?: string }>('/api/health', { method: 'GET' });
}

export async function fetchMovies() {
  return apiRequest<{ categories?: string[]; data?: MovieApiItem[] }>('/api/movies', { method: 'GET' });
}

export async function fetchAdminOverview(token: string) {
  const overviewData = await apiRequest<{ data: AdminOverview }>('/api/admin/overview', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return overviewData.data;
}

export async function checkoutMovie(payload: {
  token: string;
  movieId: string;
  method?: string;
  accessType?: 'RENT' | 'BUY';
}) {
  const { token, ...body } = payload;
  return apiRequest<{ message: string; data: unknown }>('/api/payments/checkout', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

export async function fetchMyLibrary(token: string) {
  return apiRequest<{ data: LibraryItem[] }>('/api/movies/library/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function fetchSecureAccess(movieId: string, token: string) {
  return apiRequest<{ message: string; data: SecureAccess }>(`/api/movies/${movieId}/access`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createAdminMovie(payload: {
  token: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  year: number;
  duration: string;
  rentPrice: number;
  buyPrice: number;
  thumbnailUrl?: string;
  trailerUrl?: string;
  storageKey?: string;
}) {
  const { token, ...body } = payload;
  return apiRequest<{ message: string; data: MovieApiItem }>('/api/admin/movies', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}
