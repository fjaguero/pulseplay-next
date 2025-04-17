'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Play, Tv, Activity, Users, User, Brain } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <nav className="bg-gray-800 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Play className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold">PulsePlay</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="/library" icon={<Tv />} text="Library" isActive={pathname === '/library'} />
            <NavLink href="/daily-feed" icon={<Activity />} text="The Pulse" isActive={pathname === '/daily-feed'} />
            <NavLink href="/channels" icon={<Play />} text="Live" isActive={pathname === '/channels'} />
            <NavLink href="/social" icon={<Users />} text="Social" isActive={pathname === '/social'} />
            <NavLink href="/trivia" icon={<Brain />} text="Trivia" isActive={pathname === '/trivia'} />
            <NavLink href="/profile" icon={<User />} text="Profile" isActive={pathname === '/profile'} />
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, icon, text, isActive }: { href: string; icon: React.ReactNode; text: string; isActive: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center space-x-1 transition-colors ${isActive ? 'text-blue-500' : 'hover:text-blue-500'}`}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
} 