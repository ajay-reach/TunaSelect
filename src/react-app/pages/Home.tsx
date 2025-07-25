import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { Fish } from '@/shared/types';
import FishCard from '@/react-app/components/FishCard';
import Header from '@/react-app/components/Header';
import { Loader2, Fish as FishIcon } from 'lucide-react';

export default function Home() {
  const { user, isPending } = useAuth();
  const [fish, setFish] = useState<Fish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFish = async () => {
      try {
        const response = await fetch('/api/fish');
        if (response.ok) {
          const data = await response.json();
          setFish(data);
        }
      } catch (error) {
        console.error('Failed to fetch fish:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFish();
  }, []);

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center">
        <div className="animate-spin">
          <Loader2 className="w-10 h-10 text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FishIcon className="w-12 h-12 text-blue-600 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TunaSelect
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Premium Bluefin Tuna Selection System. Choose your cuts with precision, 
            just like selecting the best seats at a stadium.
          </p>
        </div>

        {!user && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/50 shadow-xl">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Sign in to Start Ordering
              </h2>
              <p className="text-gray-600 mb-6">
                Access our premium selection of Bluefin tuna with detailed segment mapping
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fish.map((fishItem) => (
            <FishCard key={fishItem.id} fish={fishItem} />
          ))}
        </div>

        {fish.length === 0 && !loading && (
          <div className="text-center py-16">
            <FishIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No fish available</h3>
            <p className="text-gray-500">Check back later for new arrivals</p>
          </div>
        )}
      </main>
    </div>
  );
}
