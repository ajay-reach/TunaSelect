import { Link } from 'react-router';
import { Fish } from '@/shared/types';
import { MapPin, Calendar, Scale, Star } from 'lucide-react';

interface FishCardProps {
  fish: Fish;
}

export default function FishCard({ fish }: FishCardProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const gradeColor = {
    'Premium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Superior': 'bg-blue-100 text-blue-800 border-blue-200',
    'Grade A': 'bg-green-100 text-green-800 border-green-200',
    'Grade B': 'bg-gray-100 text-gray-800 border-gray-200'
  }[fish.grade] || 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <Link to={`/fish/${fish.id}`}>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
            {fish.name}
          </h3>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${gradeColor}`}>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3" />
              <span>{fish.grade}</span>
            </div>
          </div>
        </div>

        {/* Fish illustration placeholder */}
        <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-300/20 backdrop-blur-sm"></div>
          <svg 
            viewBox="0 0 200 80" 
            className="w-32 h-12 text-blue-600/80 relative z-10"
            fill="currentColor"
          >
            <path d="M20 40 Q50 20, 100 25 Q150 30, 180 40 Q150 50, 100 55 Q50 60, 20 40 Z" />
            <circle cx="160" cy="35" r="3" fill="currentColor" />
          </svg>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <Scale className="w-4 h-4 mr-2" />
            <span className="text-sm">{fish.weight_kg} kg</span>
            <span className="mx-2">•</span>
            <span className="text-sm font-medium text-green-600">
              £{fish.price_per_kg}/kg
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">Caught {formatDate(fish.catch_date)}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{fish.location}</span>
          </div>

          {/* Delivery Window */}
          <div className="flex items-center text-blue-700 mt-1">
            <span className="text-xs font-semibold bg-blue-100 rounded px-2 py-0.5">
              Delivery: {fish.delivery_window}
            </span>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Select segments</span>
            <div className="text-blue-600 group-hover:text-blue-700 font-medium text-sm">
              View Details →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
