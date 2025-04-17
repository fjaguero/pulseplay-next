'use client';

import React, { useState } from 'react';
import { Play, Filter, Search, Clock, Star, TrendingUp, Calendar } from 'lucide-react';
import Image from 'next/image';
import { useMovies } from '@/hooks/useMovies';
import { getImageUrl, Movie } from '@/services/tmdb';

const categories = ['Basketball', 'Football', 'Soccer', 'Combat', 'eSports', 'Tennis', 'Golf', 'Olympics'];

// Keep mockContent for featured section
const featuredContent = [
  {
    id: 1,
    title: "The Last Dance",
    category: "Basketball",
    duration: "50m",
    rating: 4.9,
    views: "1.2M",
    thumbnail: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80",
    new: true,
    featured: true
  },
  {
    id: 4,
    title: "UFC Greatest Fights",
    category: "Combat",
    duration: "3h",
    rating: 4.9,
    views: "1.5M",
    thumbnail: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80",
    new: false,
    featured: true
  },
];

export default function Library() {
  const [selectedCategory, setSelectedCategory] = useState('Basketball');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating'>('popular');
  
  // Fetch movies based on selected category
  const { movies, isLoading, error } = useMovies(selectedCategory === 'All' ? 'sports' : selectedCategory);

  // Filter and sort movies
  const filteredMovies = movies
    .filter(movie => 
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'popular') return b.popularity - a.popularity;
      if (sortBy === 'rating') return b.vote_average - a.vote_average;
      if (sortBy === 'newest') {
        return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
      }
      return 0;
    });

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative h-[300px] rounded-2xl overflow-hidden">
        <div className="relative w-full h-full">
          <Image 
            src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80"
            alt="Sports Library"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent flex items-center">
          <div className="p-8 space-y-4">
            <h1 className="text-4xl font-bold">Sports Library</h1>
            <p className="text-xl text-gray-300 max-w-lg">
              Discover thousands of hours of premium sports content, from classic matches to exclusive documentaries.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'popular' | 'newest' | 'rating')}
            className="bg-gray-800 px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="rating">Top Rated</option>
          </select>
          <button className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-xl hover:bg-gray-700">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === category 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Featured Content */}
      {selectedCategory === 'All' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Star className="w-6 h-6 text-yellow-500" />
            <span>Featured Content</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredContent.map(item => (
              <FeaturedCard key={item.id} {...item} />
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-xl">Loading {selectedCategory} documentaries...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="py-20 text-center">
          <div className="bg-red-500/20 p-6 rounded-xl">
            <h3 className="text-xl font-bold text-red-500 mb-2">Error Loading Content</h3>
            <p>{error.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Content Grid */}
      {!isLoading && !error && filteredMovies.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            {sortBy === 'popular' && <TrendingUp className="w-6 h-6 text-blue-500" />}
            {sortBy === 'newest' && <Calendar className="w-6 h-6 text-green-500" />}
            {sortBy === 'rating' && <Star className="w-6 h-6 text-yellow-500" />}
            <span>{
              sortBy === 'popular' ? 'Popular Now' :
              sortBy === 'newest' ? 'Latest Additions' :
              'Top Rated'
            }</span>
            <span className="text-gray-400 text-lg font-normal">({filteredMovies.length} movies)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!isLoading && !error && filteredMovies.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-xl">No documentaries found for {selectedCategory}.</p>
        </div>
      )}
    </div>
  );
}

function FeaturedCard({ title, category, duration, thumbnail, rating, views, new: isNew }: {
  title: string;
  category: string;
  duration: string;
  thumbnail: string;
  rating: number;
  views: string;
  new: boolean;
}) {
  return (
    <div className="relative group cursor-pointer rounded-xl overflow-hidden">
      <div className="aspect-video relative">
        <Image 
          src={thumbnail} 
          alt={title} 
          fill
          style={{ objectFit: 'cover' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
      </div>
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="space-y-2">
          {isNew && (
            <span className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm font-medium">NEW</span>
          )}
          <h3 className="text-2xl font-bold">{title}</h3>
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{rating}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </span>
            <span>{views} views</span>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full flex items-center space-x-2 transform hover:scale-105 transition-transform">
          <Play className="w-5 h-5" />
          <span>Watch Now</span>
        </button>
      </div>
    </div>
  );
}

function MovieCard({ movie }: { movie: Movie }) {
  // Format the release date
  const releaseDate = movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown';
  
  // Format the duration (since API doesn't provide duration, use a placeholder)
  const duration = '1h 30m';
  
  // Get a short overview
  const shortOverview = movie.overview 
    ? movie.overview.length > 80 
      ? `${movie.overview.substring(0, 80)}...` 
      : movie.overview
    : 'No description available';
  
  return (
    <div className="relative group cursor-pointer rounded-xl overflow-hidden bg-gray-800 h-full transition-transform hover:scale-[1.02]">
      <div className="aspect-[2/3] relative">
        <Image 
          src={getImageUrl(movie.poster_path)} 
          alt={movie.title} 
          fill
          style={{ objectFit: 'cover' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
      </div>
      <div className="absolute inset-0 p-3 flex flex-col justify-end">
        <div className="space-y-1">
          <h3 className="text-sm font-bold line-clamp-2">{movie.title}</h3>
          <div className="flex items-center space-x-2 text-xs text-gray-300">
            <span className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </span>
            <span>{releaseDate}</span>
          </div>
        </div>
      </div>
      {/* Additional information displayed on hover */}
      <div className="absolute inset-0 bg-gray-900/90 p-3 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity overflow-y-auto">
        <h3 className="text-sm font-bold mb-1">{movie.title}</h3>
        <p className="text-xs text-gray-300 mb-2">{shortOverview}</p>
        <div className="flex items-center space-x-2 text-xs mb-2">
          <span className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-500" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </span>
          <span>{releaseDate}</span>
        </div>
        <div className="mt-auto">
          <button className="bg-blue-500 hover:bg-blue-600 text-white w-full py-1.5 rounded-full flex items-center justify-center space-x-1 text-xs">
            <Play className="w-3 h-3" />
            <span>Watch</span>
          </button>
        </div>
      </div>
    </div>
  );
} 