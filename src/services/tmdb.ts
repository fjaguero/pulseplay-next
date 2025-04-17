/**
 * TMDB API Service
 * Handles API requests to The Movie Database API via our server-side API route
 */

export interface TMDBResponse {
  results: Movie[];
  total_results: number;
}

export interface Movie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

/**
 * Fetches movies from our API route which proxies TMDB API requests
 */
export const fetchMoviesBySport = async (sport: string): Promise<TMDBResponse> => {
  try {
    const response = await fetch(`/api/movies?sport=${encodeURIComponent(sport)}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || `Failed to fetch movies: ${response.statusText}`
      );
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

/**
 * Get full image URL for a TMDB poster path
 */
export const getImageUrl = (posterPath: string | null): string => {
  if (!posterPath) {
    return '/images/placeholder-poster.jpg'; // Placeholder image for missing posters
  }
  return `https://image.tmdb.org/t/p/w500${posterPath}`;
}; 