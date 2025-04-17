'use client';

import React, { useState } from 'react';
import { Play, Filter, Search, Clock, Star, TrendingUp, Calendar } from 'lucide-react';
import Image from 'next/image';

const categories = ['All', 'Basketball', 'Football', 'Soccer', 'Combat', 'eSports', 'Tennis', 'Golf', 'Olympics'];

const mockContent = [
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
    id: 2,
    title: "Super Bowl Classics",
    category: "Football",
    duration: "2h 30m",
    rating: 4.8,
    views: "980K",
    thumbnail: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&q=80",
    new: false,
    featured: true
  },
  {
    id: 3,
    title: "Champions League Final 2023",
    category: "Soccer",
    duration: "1h 45m",
    rating: 4.7,
    views: "2.1M",
    thumbnail: "https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?auto=format&fit=crop&q=80",
    new: true,
    featured: false
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
  {
    id: 5,
    title: "Wimbledon Highlights",
    category: "Tennis",
    duration: "45m",
    rating: 4.6,
    views: "750K",
    thumbnail: "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?auto=format&fit=crop&q=80",
    new: true,
    featured: false
  },
  {
    id: 6,
    title: "LoL World Championship",
    category: "eSports",
    duration: "4h",
    rating: 4.8,
    views: "3.2M",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80",
    new: true,
    featured: true
  }
];

export default function Library() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating'>('popular');

  const filteredContent = mockContent
    .filter(item => 
      (selectedCategory === 'All' || item.category === selectedCategory) &&
      (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       item.category.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'popular') return parseInt(b.views) - parseInt(a.views);
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return b.new ? 1 : -1;
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
            {mockContent.filter(item => item.featured).slice(0, 2).map(item => (
              <FeaturedCard key={item.id} {...item} />
            ))}
          </div>
        </div>
      )}

      {/* Content Grid */}
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
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredContent.map(item => (
            <ContentCard key={item.id} {...item} />
          ))}
        </div>
      </div>
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

function ContentCard({ title, category, duration, thumbnail, rating, views, new: isNew }: {
  title: string;
  category: string;
  duration: string;
  thumbnail: string;
  rating: number;
  views: string;
  new: boolean;
}) {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden group cursor-pointer hover:transform hover:scale-105 transition-all duration-300">
      <div className="relative aspect-video">
        <Image 
          src={thumbnail} 
          alt={title} 
          fill
          style={{ objectFit: 'cover' }}
        />
        {isNew && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-medium">
            NEW
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
          <button className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transform hover:scale-110 transition-transform">
            <Play className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 mr-1" />
            <span className="text-sm">{rating}</span>
          </div>
        </div>
        <div className="flex justify-between text-gray-400 text-sm mt-1">
          <span>{category}</span>
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {duration}
          </span>
        </div>
      </div>
    </div>
  );
} 