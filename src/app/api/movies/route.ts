import { NextRequest, NextResponse } from 'next/server';

// Define movie interface for TypeScript
interface Movie {
  id: number;
  title: string;
  original_language: string;
  [key: string]: any;
}

// Cache to store all results for each sport
const resultsCache = new Map<string, Movie[]>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get('sport');

    if (!sport) {
      return NextResponse.json(
        { error: 'Sport parameter is required' },
        { status: 400 }
      );
    }

    // Log initial request parameters
    console.log(`[TMDB API] Request received - sport: "${sport}"`);

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMBD_API_KEY}`
      }
    };
    
    // Check if we already have results cached for this sport
    let filteredMovies: Movie[] = [];
    const cacheKey = sport.toLowerCase();
    
    // Clear cache for debugging - remove this in production
    resultsCache.delete(cacheKey);
    
    if (resultsCache.has(cacheKey)) {
      console.log(`[TMDB API] Using cached results for "${sport}"`);
      filteredMovies = resultsCache.get(cacheKey)!;
    } else {
      // First search - look for documentaries
      const documentaryQuery = `${sport} documentary`;
      const documentaryUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(documentaryQuery)}&include_adult=false&language=en-US&page=1`;
      
      console.log(`[TMDB API] Making documentary search - Query: "${documentaryQuery}" - URL: ${documentaryUrl}`);
      
      const documentaryResponse = await fetch(documentaryUrl, options);
      
      if (!documentaryResponse.ok) {
        throw new Error(`Failed to fetch documentary movies: ${documentaryResponse.statusText}`);
      }
      
      const documentaryData = await documentaryResponse.json();
      console.log(`[TMDB API] Documentary search results: ${documentaryData.total_results}`);
      
      // Second search - look for general movies about the sport
      const sportUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(sport)}&include_adult=false&language=en-US&page=1`;
      
      console.log(`[TMDB API] Making sport search - Query: "${sport}" - URL: ${sportUrl}`);
      
      const sportResponse = await fetch(sportUrl, options);
      
      if (!sportResponse.ok) {
        throw new Error(`Failed to fetch sport movies: ${sportResponse.statusText}`);
      }
      
      const sportData = await sportResponse.json();
      console.log(`[TMDB API] Sport search results: ${sportData.total_results}`);
      
      // Third search - get popular sport-specific keywords
      let additionalKeyword = '';
      switch (sport.toLowerCase()) {
        case 'basketball':
          additionalKeyword = 'NBA';
          break;
        case 'football':
          additionalKeyword = 'NFL';
          break;
        case 'soccer':
          additionalKeyword = 'FIFA';
          break;
        case 'combat':
          additionalKeyword = 'UFC';
          break;
        case 'esports':
          additionalKeyword = 'league of legends';
          break;
        case 'tennis':
          additionalKeyword = 'wimbledon';
          break;
        case 'golf':
          additionalKeyword = 'PGA';
          break;
        case 'olympics':
          additionalKeyword = 'olympic games';
          break;
        default:
          additionalKeyword = '';
      }
      
      console.log(`[TMDB API] Selected additional keyword: "${additionalKeyword}" for sport: "${sport}"`);
      
      let keywordData: { results: Movie[]; total_results?: number } = { results: [] };
      if (additionalKeyword) {
        const keywordUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(additionalKeyword)}&include_adult=false&language=en-US&page=1`;
        
        console.log(`[TMDB API] Making keyword search - Query: "${additionalKeyword}" - URL: ${keywordUrl}`);
        
        const keywordResponse = await fetch(keywordUrl, options);
        
        if (keywordResponse.ok) {
          keywordData = await keywordResponse.json();
          console.log(`[TMDB API] Keyword search results: ${keywordData.total_results}`);
        } else {
          console.log(`[TMDB API] Keyword search failed: ${keywordResponse.statusText}`);
        }
      }
      
      // Fourth search for more results - try a broader search with just "movie" and the sport
      const broadQuery = `${sport} movie`;
      const broadUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(broadQuery)}&include_adult=false&language=en-US&page=1`;
      
      console.log(`[TMDB API] Making broad search - Query: "${broadQuery}" - URL: ${broadUrl}`);
      
      const broadResponse = await fetch(broadUrl, options);
      let broadData = { results: [] };
      
      if (broadResponse.ok) {
        broadData = await broadResponse.json();
        console.log(`[TMDB API] Broad search results: ${broadData.results.length}`);
      }
      
      // Combine all results, removing duplicates
      let allMovies = [...documentaryData.results];
      const addedIds = new Set(allMovies.map(m => m.id));
      
      // Helper function to add movies to the list without duplicates
      const addMoviesWithoutDuplicates = (movies: Movie[]) => {
        movies.forEach(movie => {
          if (!addedIds.has(movie.id)) {
            allMovies.push(movie);
            addedIds.add(movie.id);
          }
        });
      };
      
      // Add sport-specific movies
      addMoviesWithoutDuplicates(sportData.results);
      
      // Add keyword-specific movies
      addMoviesWithoutDuplicates(keywordData.results);
      
      // Add broad search movies
      addMoviesWithoutDuplicates(broadData.results);
      
      console.log(`[TMDB API] Combined results before filtering: ${allMovies.length}`);
      
      // Filter movies by language - include more languages and don't filter too strictly
      const allowedLanguages = ['en', 'es', 'de', 'fr', 'it'];
      console.log(`[TMDB API] Filtering by languages: ${allowedLanguages.join(', ')}`);
      
      filteredMovies = allMovies.filter(movie => 
        allowedLanguages.includes(movie.original_language)
      );
      
      console.log(`[TMDB API] Results after language filtering: ${filteredMovies.length}`);

      // Sort by popularity
      filteredMovies.sort((a, b) => b.popularity - a.popularity);
      
      // Log language distribution for debugging
      const languageCounts: Record<string, number> = {};
      filteredMovies.forEach(movie => {
        const lang = movie.original_language || 'unknown';
        languageCounts[lang] = (languageCounts[lang] || 0) + 1;
      });
      console.log(`[TMDB API] Language distribution in results: ${JSON.stringify(languageCounts)}`);
      
      // Store in cache
      resultsCache.set(cacheKey, filteredMovies);
    }
    
    // Log final response details
    console.log(`[TMDB API] Returning all ${filteredMovies.length} movies for "${sport}"`);

    if (filteredMovies.length > 0) {
      console.log(`[TMDB API] Top 5 movies for "${sport}": ${filteredMovies.slice(0, 5).map((m: Movie) => `"${m.title}" (${m.release_date?.split('-')[0] || 'unknown'}, ${m.original_language})`).join(', ')}`);
    } else {
      console.log(`[TMDB API] No movies found for "${sport}"`);
    }
    
    // Return all movies in a single response
    return NextResponse.json({
      results: filteredMovies,
      total_results: filteredMovies.length
    });
  } catch (error) {
    console.error('[TMDB API] Error fetching movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies from TMDB' },
      { status: 500 }
    );
  }
}