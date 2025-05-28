'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

// Tipos Consumet
type Item = {
  id: string;
  title: string;
  image: string;
  description?: string | { [lang: string]: string };
  subOrDub?: string;
  episodes?: { id: string; number: number }[];
  chapters?: { id: string; title: string; chapter: string }[];
};

type Details = {
  id: string;
  title: string;
  image: string;
  description?: string;
  genres?: string[];
  status?: string;
  totalEpisodes?: number;
  episodes?: { id: string; number: number }[];
  totalChapters?: number;
  chapters?: { id: string; title: string; chapter: string }[];
  type?: string;
};

type Category = "anime" | "manga";
type SubCategory = "trending" | "popular" | "recent";

const API_BASE = "https://consumet-api-ovvw.onrender.com";

const SUBCATEGORIES: {
  [key in Category]: { [key in SubCategory]: string }
} = {
  anime: {
    trending: `${API_BASE}/anime/animepahe/top-airing`,
    popular: `${API_BASE}/anime/animepahe/popular`,
    recent: `${API_BASE}/anime/animepahe/recent-episodes`,
  },
  manga: {
    trending: `${API_BASE}/manga/mangadex/trending`,
    popular: `${API_BASE}/manga/mangadex/popular`,
    recent: `${API_BASE}/manga/mangadex/recent-chapters`,
  },
};

export default function HomePage() {
  const [category, setCategory] = useState<Category>("anime");
  const [subCategory, setSubCategory] = useState<SubCategory>("trending");
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Details | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [subtitles, setSubtitles] = useState<{ url: string; lang: string }[]>([]);

  // Cargar items según categoría y subcategoría
  useEffect(() => {
    setLoading(true);
    setError(null);
    setItems([]);
    fetch(SUBCATEGORIES[category][subCategory])
      .then((res: Response) => res.json())
      .then((data: any) => {
        // Si data.results existe y es un array, úsalo; si no, usa data si es array; si no, array vacío
        if (Array.isArray(data.results)) {
          setItems(data.results);
        } else if (Array.isArray(data)) {
          setItems(data);
        } else {
          setItems([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo conectar con la API de Consumet.");
        setLoading(false);
      });
  }, [category, subCategory]);

  // Buscar
  const handleSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE}/anime/animepahe/${encodeURIComponent(search)}?page=1`;
      const res = await fetch(url);
      const data = await res.json();
      setSearchResults(Array.isArray(data.results) ? data.results : []);
    } catch {
      setError("No se pudo buscar.");
    }
    setLoading(false);
  };

  // Modal detalles
  const handleItemClick = async (id: string) => {
    setSelected(null);
    setLoading(true);
    setError(null);
    setSelectedEpisode(null);
    setStreamUrl(null);
    setSubtitles([]);
    try {
      let url = "";
      if (category === "anime") {
        url = `${API_BASE}/anime/animepahe/info/${id}`;
      } else {
        url = `${API_BASE}/manga/mangadex/info/${id}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setSelected(data);
    } catch {
      setError("No se pudo cargar la información detallada.");
      setSelected(null); // Opcional: cierra el modal si hay error
    }
    setLoading(false);
  };

  // Obtener stream de episodio (solo anime)
  const handleEpisodeClick = async (epId: string) => {
    setSelectedEpisode(epId);
    setStreamUrl(null);
    setSubtitles([]); // Limpia subtítulos anteriores
    try {
      const url = `${API_BASE}/anime/animepahe/watch/${epId}`;
      const res = await fetch(url);
      const data = await res.json();
      setStreamUrl(data.sources?.[0]?.url || null);
      setSubtitles(Array.isArray(data.subtitles) ? data.subtitles : []);
    } catch {
      setStreamUrl(null);
      setSubtitles([]);
    }
  };

  function getLangString(field: unknown): string {
    if (!field) return "";
    if (typeof field === "string") return field;
    if (typeof field === "object" && field !== null) {
      const obj = field as Record<string, unknown>;
      if (typeof obj.en === "string") return obj.en;
      const first = Object.values(obj).find(v => typeof v === "string");
      if (typeof first === "string") return first;
    }
    return "";
  }

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      {/* Menú lateral */}
      <aside className="w-56 min-h-screen bg-card shadow flex flex-col p-6 gap-8">
        <div className="font-bold text-2xl mb-4">Sahara</div>
        <div>
          <div className="font-semibold mb-2">Categorías</div>
          <button
            className={`block w-full text-left px-2 py-1 rounded mb-1 ${
              category === "anime"
                ? "bg-primary text-primary-foreground font-bold"
                : "hover:bg-secondary"
            }`}
            onClick={() => setCategory("anime")}
          >
            Anime
          </button>
          <button
            className={`block w-full text-left px-2 py-1 rounded mb-1 ${
              category === "manga"
                ? "bg-primary text-primary-foreground font-bold"
                : "hover:bg-secondary"
            }`}
            onClick={() => setCategory("manga")}
          >
            Manga
          </button>
        </div>
        <div>
          <div className="font-semibold mb-2">Subcategorías</div>
          <button
            className={`block w-full text-left px-2 py-1 rounded mb-1 ${
              subCategory === "trending"
                ? "bg-secondary font-bold"
                : "hover:bg-secondary"
            }`}
            onClick={() => setSubCategory("trending")}
          >
            Trending
          </button>
          <button
            className={`block w-full text-left px-2 py-1 rounded mb-1 ${
              subCategory === "popular"
                ? "bg-secondary font-bold"
                : "hover:bg-secondary"
            }`}
            onClick={() => setSubCategory("popular")}
          >
            Popular
          </button>
          <button
            className={`block w-full text-left px-2 py-1 rounded ${
              subCategory === "recent"
                ? "bg-secondary font-bold"
                : "hover:bg-secondary"
            }`}
            onClick={() => setSubCategory("recent")}
          >
            Recientes
          </button>
        </div>
        <div className="mt-auto flex flex-col gap-2 text-sm">
          <a href="/" className="hover:underline">
            Inicio
          </a>
          <a href="/privacidad" className="hover:underline">
            Política de Privacidad
          </a>
          <a href="/terminos" className="hover:underline">
            Términos de Uso
          </a>
        </div>
      </aside>

      {/* Contenido principal */}
      <section className="flex-1 flex flex-col items-center p-8">
        <h1 className="text-3xl font-bold mb-6">
          {category === "anime" ? "Anime" : "Manga"} - {subCategory.charAt(0).toUpperCase() + subCategory.slice(1)}
        </h1>

        {/* Barra de búsqueda */}
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar anime..."
            className="border px-2 py-1 rounded"
          />
          <button
            onClick={handleSearch}
            className="bg-primary text-primary-foreground px-4 py-1 rounded"
          >
            Buscar
          </button>
        </div>

        {error && <div className="text-red-600 mb-4">{error}</div>}
        {loading && <div className="mb-4">Cargando...</div>}

        {/* Resultados de búsqueda */}
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
            {searchResults.slice(0, 10).map((item, idx) => (
              <div
                key={`${item.id}-${subCategory}-${idx}`}
                className="flex flex-col bg-card rounded-lg shadow-lg overflow-hidden hover:scale-[1.025] transition-transform"
              >
                <div
                  className="relative cursor-pointer block"
                  onClick={() => handleItemClick(item.id)}
                  tabIndex={0}
                  role="button"
                  style={{ outline: "none" }}
                >
                  <img
                    src={item.image || "/placeholder.jpg"}
                    alt={getLangString(item.title)}
                    className="w-full h-64 object-cover"
                  />
                  {category === "anime" && item.subOrDub && (
                    <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded shadow">
                      {item.subOrDub}
                    </span>
                  )}
                </div>
                <div className="flex-1 flex flex-col p-4">
                  <h3 className="text-lg font-bold mb-1 line-clamp-2">
                    {getLangString(item.title)}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {getLangString(item.description)}
                  </p>
                  {category === "anime" && item.episodes && (
                    <div>
                      <span>{item.episodes.length} ep.</span>
                    </div>
                  )}
                  {category === "manga" && item.chapters && (
                    <div>
                      <span>{item.chapters.length} caps.</span>
                    </div>
                  )}
                  <button
                    className="mt-auto bg-primary text-primary-foreground px-4 py-1 rounded hover:bg-primary/80 text-center"
                    onClick={() => handleItemClick(item.id)}
                  >
                    Ver más
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
            {items.slice(0, 10).map((item, idx) => (
              <div
                key={`${item.id}-${subCategory}-${idx}`}
                className="flex flex-col bg-card rounded-lg shadow-lg overflow-hidden hover:scale-[1.025] transition-transform"
              >
                <div
                  className="relative cursor-pointer block"
                  onClick={() => handleItemClick(item.id)}
                  tabIndex={0}
                  role="button"
                  style={{ outline: "none" }}
                >
                  <img
                    src={item.image || "/placeholder.jpg"}
                    alt={getLangString(item.title)}
                    className="w-full h-64 object-cover"
                  />
                  {category === "anime" && item.subOrDub && (
                    <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded shadow">
                      {item.subOrDub}
                    </span>
                  )}
                </div>
                <div className="flex-1 flex flex-col p-4">
                  <h3 className="text-lg font-bold mb-1 line-clamp-2">
                    {getLangString(item.title)}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {getLangString(item.description)}
                  </p>
                  {category === "anime" && item.episodes && (
                    <div>
                      <span>{item.episodes.length} ep.</span>
                    </div>
                  )}
                  {category === "manga" && item.chapters && (
                    <div>
                      <span>{item.chapters.length} caps.</span>
                    </div>
                  )}
                  <button
                    className="mt-auto bg-primary text-primary-foreground px-4 py-1 rounded hover:bg-primary/80 text-center"
                    onClick={() => handleItemClick(item.id)}
                  >
                    Ver más
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL DETALLES */}
        {selected && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-background p-6 rounded-lg shadow-lg max-w-2xl w-full relative flex flex-col md:flex-row gap-6">
              <button
                className="absolute top-2 right-2 text-xl"
                onClick={() => setSelected(null)}
                aria-label="Cerrar"
              >
                ✕
              </button>
              {/* Portada */}
              <div className="flex-shrink-0 flex justify-center items-start">
                <img
                  src={selected.image || "/placeholder.jpg"}
                  alt={getLangString(selected.title)}
                  className="w-40 h-56 object-cover rounded-lg shadow"
                />
              </div>
              {/* Info */}
              <div className="flex-1 flex flex-col gap-2">
                <h2 className="text-2xl font-bold mb-1">{getLangString(selected.title)}</h2>
                {/* Badges de géneros */}
                {selected.genres && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selected.genres.map((g) => (
                      <span
                        key={g}
                        className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-muted text-foreground"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                )}
                {/* Estado, episodios, tipo */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {selected.status && (
                    <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground">
                      {selected.status}
                    </span>
                  )}
                  {selected.episodes && (
                    <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground">
                      {selected.episodes.length} episodios
                    </span>
                  )}
                  {selected.chapters && (
                    <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground">
                      {selected.chapters.length} capítulos
                    </span>
                  )}
                  {selected.type && (
                    <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-muted text-foreground">
                      {selected.type}
                    </span>
                  )}
                </div>
                {/* Sinopsis */}
                <p className="text-sm text-muted-foreground">{getLangString(selected.description)}</p>
                {/* Lista de episodios (solo anime) */}
                {category === "anime" && selected.episodes && (
                  <div className="mt-4">
                    <div className="font-semibold mb-2">Episodios:</div>
                    {selected.episodes.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selected.episodes.map((ep) => (
                          <button
                            key={ep.id}
                            className={`px-3 py-1 rounded bg-secondary text-secondary-foreground text-xs font-medium hover:bg-primary hover:text-primary-foreground ${
                              selectedEpisode === ep.id ? "bg-primary text-primary-foreground" : ""
                            }`}
                            onClick={() => handleEpisodeClick(ep.id)}
                          >
                            {ep.number}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">No hay episodios disponibles.</div>
                    )}
                    {/* Reproductor */}
                    {streamUrl && (
                      <div className="mt-4">
                        <video src={streamUrl} controls className="w-full rounded">
                          {subtitles.map((sub, i) => (
                            <track
                              key={i}
                              src={sub.url}
                              label={sub.lang}
                              kind="subtitles"
                              srcLang={sub.lang}
                            />
                          ))}
                        </video>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

