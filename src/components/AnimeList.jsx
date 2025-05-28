import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://consumet-api-ovvw.onrender.com';

function AnimeList() {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/anime/zoro/top-airing`, {
          params: {
            page: 1
          }
        });
        console.log('API Response:', response.data);

        if (response.data && response.data.results) {
          const uniqueAnimes = response.data.results
            .slice(0, 10)
            .map(anime => ({
              id: anime.id,
              title: anime.title || anime.name,
              image: anime.image,
              description: anime.description || 'Sin descripción disponible'
            }));

          setAnimes(uniqueAnimes);
        } else {
          throw new Error('No se encontraron resultados');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching animes:', err);
        setError('Error al cargar los animes. Por favor, intenta más tarde.');
        setLoading(false);
      }
    };

    fetchAnimes();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="text-xl text-gray-600">Cargando animes...</div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="text-xl text-red-500">{error}</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Animes Populares</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {animes.map((anime) => (
          <Link
            key={anime.id}
            to={`/anime/${anime.id}`}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative pb-[140%]">
              <img
                src={anime.image}
                alt={anime.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                }}
              />
            </div>
            <div className="p-4">
              <h2 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
                {anime.title}
              </h2>
              <p className="text-gray-600 text-sm line-clamp-3 min-h-[4.5rem]">
                {anime.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AnimeList;
