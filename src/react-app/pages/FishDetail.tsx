import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { Fish, Segment } from '@/shared/types';
import Header from '@/react-app/components/Header';
import TunaMap from '@/react-app/components/TunaMap';
import OrderForm from '@/react-app/components/OrderForm';
import { Loader2, ArrowLeft, Scale, Calendar, MapPin, Star } from 'lucide-react';

export default function FishDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, redirectToLogin } = useAuth();
  const [fish, setFish] = useState<Fish | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);

  useEffect(() => {
    const fetchFishDetail = async () => {
      try {
        const response = await fetch(`/api/fish/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFish(data.fish);
          setSegments(data.segments);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Failed to fetch fish detail:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFishDetail();
    }
  }, [id, navigate]);

  const handleSegmentSelect = (segmentId: number) => {
    if (!user) {
      redirectToLogin();
      return;
    }

    setSelectedSegments(prev => 
      prev.includes(segmentId) 
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId]
    );
  };

  const handleReserveSegments = async () => {
    if (!user || selectedSegments.length === 0) return;

    setReserving(true);
    try {
      const response = await fetch('/api/segments/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segmentIds: selectedSegments })
      });

      if (response.ok) {
        setShowOrderForm(true);
      }
    } catch (error) {
      console.error('Failed to reserve segments:', error);
    } finally {
      setReserving(false);
    }
  };

  const selectedSegmentData = segments.filter(s => selectedSegments.includes(s.id));
  const totalWeight = selectedSegmentData.reduce((sum, segment) => sum + segment.weight_kg, 0);
  const totalPrice = fish ? totalWeight * fish.price_per_kg : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!fish) {
    return <div>Fish not found</div>;
  }

  const gradeColor = {
    'Premium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Superior': 'bg-blue-100 text-blue-800 border-blue-200',
    'Grade A': 'bg-green-100 text-green-800 border-green-200',
    'Grade B': 'bg-gray-100 text-gray-800 border-gray-200'
  }[fish.grade] || 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Selection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Fish Info */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-800">{fish.name}</h1>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${gradeColor}`}>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>{fish.grade}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Scale className="w-4 h-4 mr-2" />
                  <span>{fish.weight_kg} kg total</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Caught {new Date(fish.catch_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{fish.location}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-500 mb-2">Price per kg</div>
                <div className="text-2xl font-bold text-green-600">£{fish.price_per_kg}</div>
              </div>

              {selectedSegments.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-2">Selected Segments</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Weight:</span>
                      <span className="font-medium">{totalWeight.toFixed(2)} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-bold text-green-600">£{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {user ? (
                    <button
                      onClick={handleReserveSegments}
                      disabled={reserving}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      {reserving ? 'Reserving...' : 'Reserve & Order'}
                    </button>
                  ) : (
                    <button
                      onClick={redirectToLogin}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      Sign In to Order
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Tuna Map */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Segments</h2>
              <p className="text-gray-600 mb-6">
                Click on the segments below to select the cuts you want. Each segment shows its weight and availability.
              </p>
              
              <TunaMap
                segments={segments}
                selectedSegments={selectedSegments}
                onSegmentSelect={handleSegmentSelect}
              />
            </div>
          </div>
        </div>
      </main>

      {showOrderForm && (
        <OrderForm
          fish={fish}
          selectedSegments={selectedSegmentData}
          totalPrice={totalPrice}
          onClose={() => setShowOrderForm(false)}
          onSuccess={() => {
            setShowOrderForm(false);
            navigate('/orders');
          }}
        />
      )}
    </div>
  );
}
