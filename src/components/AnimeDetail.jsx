import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://consumet-api-ovvw.onrender.com';

function AnimeDetail() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const infoResponse = await axios.get(`${API_BASE_URL}/anime/zoro/info`, {
          params: {
            id: id
          }
        });
        console.log('Info Response:', infoResponse.data);

        if (infoResponse.data) {
          setAnime({
            id: infoResponse.data.id,
            title: infoResponse.data.title || infoResponse.data.name,
            description: infoResponse.data.description || 'Sin descripción disponible',
            image: infoResponse.data.image,
            status: infoResponse.data.status,
            type: infoResponse.data.type,
            releaseDate: infoResponse.data.releaseDate,
            genres: infoResponse.data.genres || []
          });

          if (infoResponse.data.episodes) {
            setEpisodes(infoResponse.data.episodes);
          }
        } else {
          throw new Error('No se encontró información del anime');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching anime details:', err);
        setError('Error al cargar los detalles del anime. Por favor, intenta más tarde.');
        setLoading(false);
      }
    };

    if (id) {
      fetchAnimeDetails();
    }
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="text-xl text-gray-600">Cargando detalles...</div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="text-xl text-red-500">{error}</div>
    </div>
  );

  if (!anime) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="text-xl text-gray-600">Anime no encontrado</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-block mb-6 text-blue-600 hover:text-blue-800">
        ← Volver a la lista
      </Link>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 lg:w-1/4">
            <img
              src={anime.image}
              alt={anime.title}
              className="w-full h-auto object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
              }}
            />
          </div>
          <div className="md:w-2/3 lg:w-3/4 p-6">
            <h1 className="text-3xl font-bold mb-4">{anime.title}</h1>
            <p className="text-gray-600 mb-6">{anime.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Información:</h2>
                <div className="space-y-2">
                  <p><strong>Estado:</strong> {anime.status || 'No disponible'}</p>
                  <p><strong>Tipo:</strong> {anime.type || 'No disponible'}</p>
                  <p><strong>Total episodios:</strong> {episodes.length || 'No disponible'}</p>
                  <p><strong>Año:</strong> {anime.releaseDate || 'No disponible'}</p>
                </div>
              </div>
              {anime.genres && anime.genres.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Géneros:</h2>
                  <div className="flex flex-wrap gap-2">
                    {anime.genres.map((genre, index) => (
                      <span 
                        key={index} 
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {episodes.length > 0 && (
          <div className="p-6 border-t">
            <h2 className="text-2xl font-bold mb-4">Episodios</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {episodes.map((episode) => (
                <a
                  key={episode.id}
                  href={`${API_BASE_URL}/anime/zoro/watch?episodeId=${episode.id}&id=${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-center transition-colors"
                >
                  Ep. {episode.number}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnimeDetail;
