import { useState, useEffect } from 'react';
import { fetchMoviesBySport, Movie } from '../services/tmdb';

interface UseMoviesResult {
  movies: Movie[];
  isLoading: boolean;
  error: Error | null;
}

export function useMovies(sport: string): UseMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const fetchMovies = async () => {
      try {
        if (!sport) {
          setMovies([]);
          setIsLoading(false);
          return;
        }
        
        const data = await fetchMoviesBySport(sport);
        
        if (isMounted) {
          setMovies(data.results);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('An error occurred while fetching movies'));
          setIsLoading(false);
        }
      }
    };

    fetchMovies();

    return () => {
      isMounted = false;
    };
  }, [sport]);

  return { movies, isLoading, error };
} 