'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_BASE = "https://consumet-api-ovvw.onrender.com";

function getLangString(field: any) {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field.es || field.en || Object.values(field)[0] || "";
}

export default function AnimeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };
  const [anime, setAnime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setAnime(null);
    fetch(`${API_BASE}/anime/animepahe/info/${id}`)
      .then(res => res.json())
      .then(data => {
        setAnime(data);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar el anime.");
        setLoading(false);
      });
  }, [id]);

  const handleEpisodeClick = async (epId: string) => {
    setSelectedEpisode(epId);
    setStreamUrl(null);
    try {
      const url = `${API_BASE}/anime/animepahe/watch/${epId}`;
      const res = await fetch(url);
      const data = await res.json();
      setStreamUrl(data.sources?.[0]?.url || null);
    } catch {
      setStreamUrl(null);
    }
  };

  if (loading) return <div className="p-8">Cargando...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!anime) return (
    <main style={{ padding: 40, textAlign: "center" }}>
      <h1>404 - Página no encontrada</h1>
      <p>Por favor, vuelve al inicio.</p>
      <a href="/" style={{ color: "#0070f3" }}>Ir al inicio</a>
    </main>
  );

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <button
        className="mb-4 text-primary underline"
        onClick={() => router.back()}
      >
        ← Volver
      </button>
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={anime.image}
          alt={getLangString(anime.title)}
          className="w-64 h-96 object-cover rounded-lg shadow"
        />
        <div className="flex-1 flex flex-col gap-2">
          <h1 className="text-3xl font-bold mb-2">{getLangString(anime.title)}</h1>
          {anime.genres && (
            <div className="flex flex-wrap gap-2 mb-2">
              {anime.genres.map((g: string) => (
                <span
                  key={g}
                  className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-muted text-foreground"
                >
                  {g}
                </span>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-2 mb-2">
            {anime.status && (
              <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground">
                {anime.status}
              </span>
            )}
            {anime.episodes && (
              <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground">
                {anime.episodes.length} episodios
              </span>
            )}
            {anime.type && (
              <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-muted text-foreground">
                {anime.type}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-4">{getLangString(anime.description)}</p>
          {/* Episodios */}
          {anime.episodes && (
            <div className="mt-4">
              <div className="font-semibold mb-2">Episodios:</div>
              <div className="flex flex-wrap gap-2">
                {anime.episodes.map((ep: any) => (
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
              {/* Reproductor */}
              {streamUrl && (
                <div className="mt-4">
                  <video src={streamUrl} controls className="w-full rounded" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}