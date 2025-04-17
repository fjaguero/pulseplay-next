import { Play, Trophy, Star } from 'lucide-react';
import Image from 'next/image';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <header className="relative h-[500px] rounded-xl overflow-hidden">
        <div className="relative w-full h-full">
          <Image 
            src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80"
            alt="Sports stadium"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent">
          <div className="absolute bottom-0 left-0 p-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to PulsePlay</h1>
            <p className="text-xl md:text-2xl mb-6">Your premier destination for sports streaming</p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Start Watching</span>
            </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeaturedCard
          icon={<Trophy className="w-8 h-8 text-yellow-500" />}
          title="Live Games"
          description="Watch your favorite teams compete in real-time"
          image="https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&q=80"
        />
        <FeaturedCard
          icon={<Play className="w-8 h-8 text-blue-500" />}
          title="On-Demand"
          description="Access our library of sports content anytime"
          image="https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80"
        />
        <FeaturedCard
          icon={<Star className="w-8 h-8 text-purple-500" />}
          title="Interactive Trivia"
          description="Test your sports knowledge and compete with others"
          image="https://images.unsplash.com/photo-1569517282132-25d22f4573e6?auto=format&fit=crop&q=80"
        />
      </section>
    </div>
  );
}

function FeaturedCard({ icon, title, description, image }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
}) {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-transform">
      <div className="h-48 relative">
        <Image 
          src={image} 
          alt={title} 
          fill
          style={{ objectFit: 'cover' }}
        />
        <div className="absolute top-4 left-4 bg-gray-900 rounded-full p-2">
          {icon}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
} 