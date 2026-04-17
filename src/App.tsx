import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  checkoutMovie as checkoutMovieRequest,
  createAdminMovie,
  fetchAdminOverview,
  fetchHealth,
  fetchMovies,
  fetchMyLibrary,
  fetchSecureAccess,
  loginDemoUser,
  loginUser,
  type AdminOverview,
  type LibraryItem,
  type MovieApiItem,
  type SecureAccess,
} from './lib/api';

type View = 'browse' | 'admin';

type Movie = {
  id: string;
  title: string;
  slug?: string;
  category: string;
  mode: string;
  year: number;
  rating: number;
  criticScore: number;
  audienceScore: number;
  description: string;
  duration: string;
  thumbnailUrl?: string;
  trailerUrl?: string;
  rentPrice: number;
  buyPrice: number;
};

const fallbackMovies: Movie[] = [
  {
    id: 'movie-1',
    title: 'Inzira y’Intwari',
    slug: 'inzira-y-intwari',
    category: 'Action',
    mode: 'Gura cyangwa Kodesha',
    year: 2026,
    rating: 4.9,
    criticScore: 92,
    audienceScore: 95,
    duration: '2h 04m',
    rentPrice: 3000,
    buyPrice: 7000,
    description: 'Filime ikomeye y’urugamba n’ubutwari, ifite amashusho meza n’inkuru ifata umutima.',
    trailerUrl: 'https://example.com/trailers/inzira-y-intwari',
  },
  {
    id: 'movie-2',
    title: 'Urukundo rwa Nyampinga',
    slug: 'urukundo-rwa-nyampinga',
    category: 'Romance',
    mode: 'Kodesha',
    year: 2025,
    rating: 4.7,
    criticScore: 88,
    audienceScore: 91,
    duration: '1h 48m',
    rentPrice: 2500,
    buyPrice: 6000,
    description: 'Inkuru y’urukundo rwa nyarwo, ishimangira icyizere, kwihangana n’isezerano.',
    trailerUrl: 'https://example.com/trailers/urukundo-rwa-nyampinga',
  },
  {
    id: 'movie-3',
    title: 'Ijoro ry’Amabanga',
    slug: 'ijoro-ry-amabanga',
    category: 'Drama',
    mode: 'Gura',
    year: 2026,
    rating: 4.8,
    criticScore: 94,
    audienceScore: 90,
    duration: '2h 13m',
    rentPrice: 3500,
    buyPrice: 7500,
    description: 'Drama y’amarangamutima menshi, amabanga y’umuryango n’ukuri gutunguranye.',
    trailerUrl: 'https://example.com/trailers/ijoro-ry-amabanga',
  },
  {
    id: 'movie-4',
    title: 'Ubuzima bushya',
    slug: 'ubuzima-bushya',
    category: 'Documentary',
    mode: 'Kodesha',
    year: 2024,
    rating: 4.6,
    criticScore: 85,
    audienceScore: 87,
    duration: '1h 22m',
    rentPrice: 2000,
    buyPrice: 4500,
    description: 'Dokima ifasha abantu gusobanukirwa ubuzima, iterambere n’icyerekezo cy’ejo.',
    trailerUrl: 'https://example.com/trailers/ubuzima-bushya',
  },
  {
    id: 'movie-5',
    title: 'Umurage w’Ibanga',
    slug: 'umurage-wibanga',
    category: 'Thriller',
    mode: 'Gura cyangwa Kodesha',
    year: 2025,
    rating: 4.8,
    criticScore: 91,
    audienceScore: 93,
    duration: '1h 57m',
    rentPrice: 3200,
    buyPrice: 6800,
    description: 'Thriller y’umuryango ufite amabanga yihishe mu mateka yabo.',
    trailerUrl: 'https://example.com/trailers/umurage-wibanga',
  },
  {
    id: 'movie-6',
    title: 'Abacunguzi b’Ejo',
    slug: 'abacunguzi-bejo',
    category: 'Action',
    mode: 'Gura cyangwa Kodesha',
    year: 2026,
    rating: 4.7,
    criticScore: 89,
    audienceScore: 92,
    duration: '2h 01m',
    rentPrice: 3600,
    buyPrice: 7200,
    description: 'Action y’abasore baharanira kurinda umujyi n’abaturage bawo.',
    trailerUrl: 'https://example.com/trailers/abacunguzi-bejo',
  },
  {
    id: 'movie-7',
    title: 'Ijwi ry’Umutima',
    slug: 'ijwi-ryumutima',
    category: 'Gospel',
    mode: 'Kodesha',
    year: 2024,
    rating: 4.6,
    criticScore: 86,
    audienceScore: 90,
    duration: '1h 44m',
    rentPrice: 2200,
    buyPrice: 5000,
    description: 'Inkuru yubaka imitima, yuzuye kwizera, indangagaciro n’icyizere.',
    trailerUrl: 'https://example.com/trailers/ijwi-ryumutima',
  },
  {
    id: 'movie-8',
    title: 'Intego y’Ubuzima',
    slug: 'intego-yubuzima',
    category: 'Drama',
    mode: 'Gura',
    year: 2025,
    rating: 4.7,
    criticScore: 90,
    audienceScore: 89,
    duration: '1h 50m',
    rentPrice: 2800,
    buyPrice: 6100,
    description: 'Drama ikurikirana inzozi n’imbogamizi z’urubyiruko rwifuza gutsinda.',
    trailerUrl: 'https://example.com/trailers/intego-yubuzima',
  },
  {
    id: 'movie-9',
    title: 'Akanyamuneza k’Umuryango',
    slug: 'akanyamuneza-kumuryango',
    category: 'Family',
    mode: 'Kodesha',
    year: 2023,
    rating: 4.5,
    criticScore: 84,
    audienceScore: 88,
    duration: '1h 34m',
    rentPrice: 1800,
    buyPrice: 4200,
    description: 'Family comedy itanga ibyishimo ku rugo kandi igahuza imitima.',
    trailerUrl: 'https://example.com/trailers/akanyamuneza-kumuryango',
  },
  {
    id: 'movie-10',
    title: 'Ikirere cya Kigali',
    slug: 'ikirere-cya-kigali',
    category: 'Romance',
    mode: 'Gura cyangwa Kodesha',
    year: 2026,
    rating: 4.8,
    criticScore: 93,
    audienceScore: 94,
    duration: '1h 41m',
    rentPrice: 2600,
    buyPrice: 5900,
    description: 'Romance nziza ikinirwa i Kigali, yuzuye amarangamutima n’ubwiza.',
    trailerUrl: 'https://example.com/trailers/ikirere-cya-kigali',
  },
];

const defaultOverview: AdminOverview = {
  users: 0,
  movies: 0,
  payments: 0,
  purchases: 0,
  revenue: 0,
};

const emptyAdminForm = {
  title: '',
  category: 'Action',
  description: '',
  year: String(new Date().getFullYear()),
  duration: '1h 30m',
  rentPrice: '3000',
  buyPrice: '7000',
  thumbnailUrl: '',
  trailerUrl: '',
  storageKey: 'movies/demo/master.m3u8',
};

const formatMoney = (value: number) => `${Number(value || 0).toLocaleString('en-US')} RWF`;

const createSlug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const normalizeMovie = (movie: Partial<MovieApiItem>, index: number): Movie => {
  const ratingMap = [4.9, 4.7, 4.8, 4.6];
  const criticMap = [92, 88, 94, 85];
  const audienceMap = [95, 91, 90, 87];

  return {
    id: String(movie.id || `movie-${index + 1}`),
    title: String(movie.title || 'Filime nshya'),
    slug: String(movie.slug || `movie-${index + 1}`),
    category: String(movie.category || 'Filime'),
    mode: 'Gura cyangwa Kodesha',
    year: Number(movie.year || 2026),
    rating: ratingMap[index % ratingMap.length],
    criticScore: criticMap[index % criticMap.length],
    audienceScore: audienceMap[index % audienceMap.length],
    duration: String(movie.duration || '1h 45m'),
    rentPrice: Number(movie.rentPrice || 3000),
    buyPrice: Number(movie.buyPrice || 7000),
    description: String(movie.description || 'Iyi filime iri gutegurwa neza kugira ngo ishyirwe ku rubuga.'),
    thumbnailUrl: String(movie.thumbnailUrl || ''),
    trailerUrl: String(movie.trailerUrl || 'https://example.com'),
  };
};

export default function App() {
  const [view, setView] = useState<View>('browse');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Zose');
  const [watchlist, setWatchlist] = useState<string[]>(['movie-1']);
  const [message, setMessage] = useState('Murakaza neza kuri Ishema Cinema. Reba filime zigezweho zireberwa mu rugo.');
  const [apiStatus, setApiStatus] = useState('Turimo kugenzura ihuriro rya backend...');
  const [movies, setMovies] = useState<Movie[]>(fallbackMovies);
  const [adminOverview, setAdminOverview] = useState<AdminOverview>(defaultOverview);
  const [userToken, setUserToken] = useState('');
  const [adminToken, setAdminToken] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('MTN MoMo');
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [accessByMovie, setAccessByMovie] = useState<Record<string, SecureAccess>>({});
  const [busyMovieId, setBusyMovieId] = useState<string | null>(null);
  const [adminBusy, setAdminBusy] = useState(false);
  const [adminForm, setAdminForm] = useState(emptyAdminForm);
  const [adminCredentials, setAdminCredentials] = useState({ email: '', password: '' });
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const loadMovies = async () => {
    try {
      const movieResponse = await fetchMovies();
      const incomingMovies = Array.isArray(movieResponse.data) ? movieResponse.data : [];
      if (incomingMovies.length > 0) {
        const normalizedIncoming = incomingMovies.map((movie, index) => normalizeMovie(movie, index));
        const existingIds = new Set(normalizedIncoming.map((movie) => movie.id));
        const extraFallback = fallbackMovies.filter((movie) => !existingIds.has(movie.id));
        setMovies([...normalizedIncoming, ...extraFallback]);
        return;
      }

      setMovies(fallbackMovies);
    } catch {
      setMovies(fallbackMovies);
    }
  };

  const refreshAdminStats = async (token: string) => {
    const overview = await fetchAdminOverview(token);
    setAdminOverview(overview);
  };

  const loadUserLibrary = async (tokenValue: string) => {
    try {
      const response = await fetchMyLibrary(tokenValue);
      setLibrary(Array.isArray(response.data) ? response.data : []);
    } catch {
      setLibrary([]);
    }
  };

  useEffect(() => {
    const loadPlatformData = async () => {
      try {
        const health = await fetchHealth();
        setApiStatus(health.message || 'Backend ihujwe neza.');
      } catch {
        setApiStatus('Frontend iri gukora neza. Tangiza backend kuri localhost:5000 kugira ngo ubone amakuru ya nyayo.');
      }

      await loadMovies();
    };

    void loadPlatformData();
  }, []);

  const categories = useMemo(() => ['Zose', ...Array.from(new Set(movies.map((movie) => movie.category)))], [movies]);

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchQuery = movie.title.toLowerCase().includes(query.toLowerCase());
      const matchCategory = category === 'Zose' || movie.category === category;
      return matchQuery && matchCategory;
    });
  }, [movies, query, category]);

  const purchasedIds = useMemo(
    () => new Set(library.map((item) => item.movie?.id).filter((id): id is string => Boolean(id))),
    [library]
  );

  const heroMovie = filteredMovies[0] ?? movies[0];
  const trendingMovies = useMemo(() => filteredMovies.slice(0, 8), [filteredMovies]);
  const watchlistMovies = useMemo(() => movies.filter((movie) => watchlist.includes(movie.id)).slice(0, 4), [movies, watchlist]);

  const toggleWatchlist = (id: string, title: string) => {
    setWatchlist((current) => {
      const exists = current.includes(id);
      setMessage(exists ? `${title} yavanywe mu zo ukunda.` : `${title} yongewe mu zo ukunda.`);
      return exists ? current.filter((item) => item !== id) : [...current, id];
    });
  };

  const ensureUserSession = async () => {
    if (userToken) {
      return userToken;
    }

    const login = await loginDemoUser();
    setUserToken(login.token);
    await loadUserLibrary(login.token);
    return login.token;
  };

  const handleDemoUserLogin = async () => {
    try {
      const token = await ensureUserSession();
      await loadUserLibrary(token);
      setMessage('Winjiye nka demo user. Ushobora kugerageza kwishyura no kureba access links.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Kwinjira kwa demo user byanze.');
    }
  };

  const fillDemoAdminCredentials = () => {
    setAdminCredentials({
      email: 'admin@ishemacinema.rw',
      password: 'Admin@123',
    });
    setMessage('Demo admin credentials zashyizwemo. Kanda Open Admin Portal.');
  };

  const handleAdminLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAdminBusy(true);

    try {
      const auth = await loginUser(adminCredentials.email, adminCredentials.password);

      if (auth.user.role !== 'ADMIN') {
        throw new Error('Iri rembo rigenewe admin gusa.');
      }

      setAdminToken(auth.token);
      await refreshAdminStats(auth.token);
      setView('admin');
      setMessage('Admin portal yafunguwe neza.');
    } catch (error) {
      setAdminToken('');
      setMessage(error instanceof Error ? error.message : 'Kwinjira kwa admin byanze.');
    } finally {
      setAdminBusy(false);
    }
  };

  const handleAdminLogout = () => {
    setAdminToken('');
    setAdminOverview(defaultOverview);
    setAdminCredentials({ email: '', password: '' });
    setView('browse');
    setMessage('Wasohotse muri admin portal.');
  };

  const handleCheckout = async (movie: Movie, accessType: 'RENT' | 'BUY') => {
    setBusyMovieId(movie.id);

    try {
      const token = await ensureUserSession();
      const result = await checkoutMovieRequest({
        token,
        movieId: movie.id,
        method: paymentMethod,
        accessType,
      });

      const access = await fetchSecureAccess(movie.id, token);
      setAccessByMovie((current) => ({ ...current, [movie.id]: access.data }));
      await loadUserLibrary(token);
      setMessage(`${movie.title}: ${result.message}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Kwishyura byanze.');
    } finally {
      setBusyMovieId(null);
    }
  };

  const handleGetAccess = async (movieId: string) => {
    try {
      const token = await ensureUserSession();
      const access = await fetchSecureAccess(movieId, token);
      setAccessByMovie((current) => ({ ...current, [movieId]: access.data }));
      setMessage('Access link za streaming na download zagaruwe neza.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Kugarura access links byanze.');
    }
  };

  const handleAdminSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAdminBusy(true);

    try {
      if (!adminToken) {
        throw new Error('Banze winjire nka admin mbere yo kongeramo filime.');
      }

      const title = adminForm.title.trim();
      if (!title || !adminForm.description.trim()) {
        throw new Error('Shyiramo nibura izina rya filime n’ibisobanuro byayo.');
      }

      const result = await createAdminMovie({
        token: adminToken,
        title,
        slug: createSlug(title),
        description: adminForm.description,
        category: adminForm.category,
        year: Number(adminForm.year || new Date().getFullYear()),
        duration: adminForm.duration,
        rentPrice: Number(adminForm.rentPrice || 0),
        buyPrice: Number(adminForm.buyPrice || 0),
        thumbnailUrl: adminForm.thumbnailUrl,
        trailerUrl: adminForm.trailerUrl,
        storageKey: adminForm.storageKey,
      });

      await loadMovies();
      await refreshAdminStats(adminToken);
      setAdminForm(emptyAdminForm);
      setMessage(result.message || 'Filime yongewemo neza.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Kongeramo filime byanze.');
    } finally {
      setAdminBusy(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="brand">ISHEMA AT HOME</p>
          <p className="tagline">Browse filime zo mu rugo mu buryo busa na Rotten Tomatoes, ariko zigurwa kandi zikodeshwa.</p>
        </div>

        <div className="topbar-actions">
          <div className="view-switch">
            <button
              className={view === 'browse' ? 'category-btn active' : 'category-btn'}
              onClick={() => setView('browse')}
            >
              Movies at Home
            </button>
            <button
              className={view === 'admin' ? 'category-btn active' : 'category-btn'}
              onClick={() => setView('admin')}
            >
              Admin Portal
            </button>
          </div>
          <button className="ghost-btn" onClick={() => void handleDemoUserLogin()}>
            Demo User Login
          </button>
        </div>
      </header>

      <div className="status-banner">{apiStatus}</div>

      <main>
        {view === 'browse' ? (
          <>
            <section
              className="hero-card rt-hero hero-banner"
              style={heroMovie?.thumbnailUrl ? {
                backgroundImage: `linear-gradient(90deg, rgba(10,12,18,0.95) 0%, rgba(10,12,18,0.78) 42%, rgba(10,12,18,0.35) 100%), url(${heroMovie.thumbnailUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              } : undefined}
            >
              <div className="hero-text">
                <span className="pill">Fresh picks for your home</span>
                <h1>{heroMovie?.title || 'Stream filime zigezweho mu rugo'}</h1>
                <p>
                  {heroMovie?.description || 'Catalog nshya igaragara neza, ifite scores, filters, trailers na secure checkout.'}
                </p>

                <p className="hero-meta-line">
                  {heroMovie?.year || 2026} • {heroMovie?.duration || '1h 40m'} • {heroMovie?.category || 'Drama'}
                </p>

                <div className="hero-actions">
                  <button className="primary-btn" onClick={() => heroMovie && void handleCheckout(heroMovie, 'RENT')}>
                    Watch Now
                  </button>
                  <a className="ghost-btn inline-link" href={heroMovie?.trailerUrl || 'https://example.com'} target="_blank" rel="noreferrer">
                    Trailer
                  </a>
                  <select
                    className="select-field"
                    value={paymentMethod}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                  >
                    <option>MTN MoMo</option>
                    <option>Airtel Money</option>
                    <option>Visa / Mastercard</option>
                  </select>
                </div>

                <div className="hero-stats">
                  <div>
                    <strong>{movies.length}+</strong>
                    <span>Titles ziri live</span>
                  </div>
                  <div>
                    <strong>{library.length}</strong>
                    <span>My library</span>
                  </div>
                  <div>
                    <strong>{watchlist.length}</strong>
                    <span>Saved movies</span>
                  </div>
                </div>
              </div>

              <div className="featured-panel spotlight-panel">
                <div
                  className="hero-thumbnail-card"
                  style={heroMovie?.thumbnailUrl ? {
                    backgroundImage: `linear-gradient(180deg, rgba(10,12,18,0.18), rgba(10,12,18,0.82)), url(${heroMovie.thumbnailUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  } : undefined}
                />
              </div>
            </section>

            <section className="section-block">
              <div className="section-heading">
                <h3>Trending Now</h3>
                <p>Kanda ku ifoto ya filime ushaka, ubone uburyo bwo kwishyura.</p>
              </div>

              <div className="movie-grid compact-grid homepage-top-grid">
                {trendingMovies.slice(0, 5).map((movie) => (
                  <article key={`top-${movie.id}`} className="movie-card compact-home-card polished-card">
                    <button
                      className="poster-button"
                      onClick={() => setSelectedMovie(movie)}
                      style={movie.thumbnailUrl ? {
                        backgroundImage: `linear-gradient(180deg, rgba(10,12,18,0.16), rgba(10,12,18,0.92)), url(${movie.thumbnailUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      } : undefined}
                    >
                      <div className="tile-overlay">
                        <strong>{movie.title}</strong>
                        <span>{movie.duration}</span>
                      </div>
                    </button>
                  </article>
                ))}
              </div>

              <div className="toolbar">
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search title..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <div className="category-row">
                  {categories.map((item) => (
                    <button
                      key={item}
                      className={item === category ? 'category-btn active' : 'category-btn'}
                      onClick={() => setCategory(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="browse-layout">
                <div className="movie-grid compact-grid">
                  {trendingMovies.map((movie) => (
                    <article key={movie.id} className="movie-card compact-home-card polished-card">
                      <button
                        className="poster-button"
                        onClick={() => setSelectedMovie(movie)}
                        style={movie.thumbnailUrl ? {
                          backgroundImage: `linear-gradient(180deg, rgba(10,12,18,0.16), rgba(10,12,18,0.92)), url(${movie.thumbnailUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        } : undefined}
                      >
                        <div className="tile-overlay">
                          <strong>{movie.title}</strong>
                          <span>{movie.duration}</span>
                        </div>
                      </button>

                      <div className="compact-card-meta">
                      </div>
                    </article>
                  ))}
                </div>

                <aside className="side-panel compact-sidebar">
                  <div className="info-card accent-card compact-panel">
                    <h3>What to Watch</h3>
                    <div className="side-list">
                      {watchlistMovies.length > 0 ? watchlistMovies.map((movie) => (
                        <div key={movie.id} className="mini-list-item static-item">
                          <span>{movie.title}</span>
                          <strong>{movie.category}</strong>
                        </div>
                      )) : (
                        <p className="muted-text">Save movies to see them here.</p>
                      )}
                    </div>
                  </div>

                  <div className="info-card compact-panel">
                    <h3>Private library</h3>
                    <div className="library-list compact-library">
                      {library.length === 0 ? (
                        <p className="muted-text">Nta title irafungurwa. Koresha Demo User Login.</p>
                      ) : (
                        library.slice(0, 3).map((item) => (
                          <div key={item.id} className="library-card compact-library-card">
                            <div>
                              <strong>{item.movie?.title || 'Filime'}</strong>
                              <p className="muted-text">{item.accessType} • {new Date(item.createdAt).toLocaleDateString()}</p>
                            </div>

                            <div className="card-actions">
                              <button
                                className="ghost-btn small-btn"
                                onClick={() => item.movie?.id && void handleGetAccess(item.movie.id)}
                              >
                                Access
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </aside>
              </div>
            </section>

            <section className="section-block bottom-categories-section">
              <div className="section-heading">
                <h3>Reba Filime zikunzwe</h3>
              </div>

              <div className="trending-row compact-lower-row">
                {trendingMovies.slice(0, 4).map((movie, index) => (
                  <button
                    key={`lower-${movie.id}`}
                    className="trending-card compact-trending-card"
                    onClick={() => setSelectedMovie(movie)}
                    style={movie.thumbnailUrl ? {
                      backgroundImage: `linear-gradient(180deg, rgba(10,12,18,0.12), rgba(10,12,18,0.72)), url(${movie.thumbnailUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    } : undefined}
                  >
                    <span className="trend-number">{index + 1}</span>
                    <span className="trend-title">{movie.title}</span>
                  </button>
                ))}
              </div>
            </section>

            {selectedMovie ? (
              <div className="movie-modal-backdrop" onClick={() => setSelectedMovie(null)}>
                <div className="movie-modal-card netflix-modal" onClick={(event) => event.stopPropagation()}>
                  <div
                    className="modal-hero"
                    style={selectedMovie.thumbnailUrl ? {
                      backgroundImage: `linear-gradient(180deg, rgba(10,12,18,0.18), rgba(10,12,18,0.95)), url(${selectedMovie.thumbnailUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    } : undefined}
                  >
                    <button className="ghost-btn small-btn modal-close" onClick={() => setSelectedMovie(null)}>
                      ✕
                    </button>

                    <div className="modal-hero-content">
                      <h2>{selectedMovie.title}</h2>
                      <div className="modal-tags">
                        <span className="tiny-pill">{selectedMovie.year}</span>
                        <span className="tiny-pill">{selectedMovie.duration}</span>
                        <span className="tiny-pill">{selectedMovie.category}</span>
                      </div>
                      <p className="movie-description full-description">{selectedMovie.description}</p>
                    </div>
                  </div>

                  <div className="modal-body">
                    <div className="payment-callout">
                      <h3>Banza wishyure mbere yo kureba</h3>
                      <p className="muted-text">
                        Hitamo gukodesha cyangwa kugura iyi filime. Nyuma yo kwishyura uhita ubona uburenganzira bwo kureba.
                      </p>
                    </div>

                    <div className="price-reveal">
                      <div className="price-box">
                        <span>Kodesha</span>
                        <strong>{formatMoney(selectedMovie.rentPrice)}</strong>
                      </div>
                      <div className="price-box">
                        <span>Gura</span>
                        <strong>{formatMoney(selectedMovie.buyPrice)}</strong>
                      </div>
                    </div>

                    <div className="card-actions modal-actions-row">
                      <button className="primary-btn small-btn" onClick={() => void handleCheckout(selectedMovie, 'RENT')}>
                        Pay & Rent
                      </button>
                      <button className="primary-btn small-btn alt-btn" onClick={() => void handleCheckout(selectedMovie, 'BUY')}>
                        Pay & Buy
                      </button>
                      <a className="ghost-btn small-btn inline-link" href={selectedMovie.trailerUrl || 'https://example.com'} target="_blank" rel="noreferrer">
                        Watch Trailer
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </>
        ) : !adminToken ? (
          <section className="private-admin-shell">
            <div className="admin-lock-card">
              <span className="pill">🔒 Private staff portal</span>
              <h2>Admin panel is not public</h2>
              <p>
                Injira ukoresheje email na password bya admin. Nta mibare cyangwa controls byerekana mbere yo kwemezwa.
              </p>

              <div className="card-actions helper-actions">
                <button className="ghost-btn small-btn" onClick={fillDemoAdminCredentials} type="button">
                  Fill demo credentials
                </button>
              </div>

              <form className="form-grid" onSubmit={handleAdminLogin}>
                <input
                  className="readonly-field"
                  type="email"
                  value={adminCredentials.email}
                  onChange={(event) => setAdminCredentials((current) => ({ ...current, email: event.target.value }))}
                  placeholder="Admin email"
                />
                <input
                  className="readonly-field"
                  type="password"
                  value={adminCredentials.password}
                  onChange={(event) => setAdminCredentials((current) => ({ ...current, password: event.target.value }))}
                  placeholder="Admin password"
                />
                <button className="primary-btn" type="submit" disabled={adminBusy}>
                  {adminBusy ? 'Signing in...' : 'Open Admin Portal'}
                </button>
              </form>
            </div>
          </section>
        ) : (
          <>
            <section className="hero-card admin-hero">
              <div className="hero-text">
                <span className="pill">Private Admin Workspace</span>
                <h1>Dashboard yo gucunga Ishema At Home</h1>
                <p>
                  Hano ni ho admin yonyine ashobora kongeramo filime, kureba revenue no gucunga
                  ibikorwa byose by’urubuga.
                </p>
                <div className="hero-actions">
                  <button className="primary-btn" onClick={() => void refreshAdminStats(adminToken)}>
                    Refresh stats
                  </button>
                  <button className="ghost-btn" onClick={handleAdminLogout}>
                    Sign out
                  </button>
                </div>
              </div>

              <div className="featured-panel">
                <p className="featured-label">Protected overview</p>
                <ul>
                  <li>Only authenticated admin can view this screen</li>
                  <li>Create titles and monitor sales privately</li>
                  <li>No public auto-login remains</li>
                </ul>
              </div>
            </section>

            <section className="section-block">
              <div className="admin-metrics">
                <div className="metric-card">
                  <span>Abakoresha</span>
                  <strong>{adminOverview.users}</strong>
                </div>
                <div className="metric-card">
                  <span>Filime</span>
                  <strong>{adminOverview.movies}</strong>
                </div>
                <div className="metric-card">
                  <span>Payments</span>
                  <strong>{adminOverview.payments}</strong>
                </div>
                <div className="metric-card">
                  <span>Revenue</span>
                  <strong>{formatMoney(adminOverview.revenue)}</strong>
                </div>
              </div>
            </section>

            <section className="split-layout">
              <div className="info-card">
                <h3>Add a new movie</h3>
                <form className="form-grid" onSubmit={handleAdminSubmit}>
                  <input
                    className="readonly-field"
                    value={adminForm.title}
                    onChange={(event) => setAdminForm((current) => ({ ...current, title: event.target.value }))}
                    placeholder="Movie title"
                  />
                  <select
                    className="select-field"
                    value={adminForm.category}
                    onChange={(event) => setAdminForm((current) => ({ ...current, category: event.target.value }))}
                  >
                    {categories.filter((item) => item !== 'Zose').map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <textarea
                    className="text-area-field"
                    value={adminForm.description}
                    onChange={(event) => setAdminForm((current) => ({ ...current, description: event.target.value }))}
                    placeholder="Movie description"
                    rows={4}
                  />
                  <input
                    className="readonly-field"
                    value={adminForm.year}
                    onChange={(event) => setAdminForm((current) => ({ ...current, year: event.target.value }))}
                    placeholder="Year"
                  />
                  <input
                    className="readonly-field"
                    value={adminForm.duration}
                    onChange={(event) => setAdminForm((current) => ({ ...current, duration: event.target.value }))}
                    placeholder="Duration"
                  />
                  <input
                    className="readonly-field"
                    value={adminForm.rentPrice}
                    onChange={(event) => setAdminForm((current) => ({ ...current, rentPrice: event.target.value }))}
                    placeholder="Rent price"
                  />
                  <input
                    className="readonly-field"
                    value={adminForm.buyPrice}
                    onChange={(event) => setAdminForm((current) => ({ ...current, buyPrice: event.target.value }))}
                    placeholder="Buy price"
                  />
                  <input
                    className="readonly-field"
                    value={adminForm.thumbnailUrl}
                    onChange={(event) => setAdminForm((current) => ({ ...current, thumbnailUrl: event.target.value }))}
                    placeholder="Thumbnail URL"
                  />
                  <input
                    className="readonly-field"
                    value={adminForm.trailerUrl}
                    onChange={(event) => setAdminForm((current) => ({ ...current, trailerUrl: event.target.value }))}
                    placeholder="Trailer URL"
                  />
                  <button className="primary-btn" type="submit" disabled={adminBusy}>
                    {adminBusy ? 'Saving...' : 'Publish movie'}
                  </button>
                </form>
              </div>

              <div className="info-card accent-card">
                <h3>Admin controls</h3>
                <ul>
                  <li>Publish titles with artwork and trailer links</li>
                  <li>Track revenue, users and payments</li>
                  <li>Keep streaming and downloads protected</li>
                  <li>Operate from a private staff-only area</li>
                </ul>
              </div>
            </section>

            <section className="section-block">
              <div className="table-card">
                <div className="section-heading">
                  <h3>Published catalog</h3>
                  <p>Only visible inside the protected admin workspace.</p>
                </div>

                <div className="admin-table">
                  {movies.map((movie) => (
                    <div key={movie.id} className="admin-row">
                      <div>
                        <strong>{movie.title}</strong>
                        <p className="muted-text">{movie.category} • {movie.year}</p>
                      </div>
                      <div>
                        <strong>{formatMoney(movie.rentPrice)}</strong>
                        <p className="muted-text">Buy: {formatMoney(movie.buyPrice)}</p>
                      </div>
                      <div>
                        <span className="tiny-pill">Private</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
