import { Segment } from '@/shared/types';

interface TunaMapProps {
  segments: Segment[];
  selectedSegments: number[];
  onSegmentSelect: (segmentId: number) => void;
}

export default function TunaMap({ segments, selectedSegments, onSegmentSelect }: TunaMapProps) {
  const getSegmentColor = (segment: Segment) => {
    if (!segment.is_available) {
      return 'fill-gray-300 cursor-not-allowed';
    }
    if (selectedSegments.includes(segment.id)) {
      return 'fill-blue-500 cursor-pointer hover:fill-blue-600';
    }
    
    // Color coding based on segment type
    switch (segment.segment_type) {
      case 'Otoro':
        return 'fill-pink-200 cursor-pointer hover:fill-pink-300';
      case 'Chutoro':
        return 'fill-orange-200 cursor-pointer hover:fill-orange-300';
      case 'Toro Akami':
        return 'fill-red-200 cursor-pointer hover:fill-red-300';
      case 'Akami Block':
        return 'fill-red-100 cursor-pointer hover:fill-red-200';
      case 'Kama Shoulder':
        return 'fill-yellow-200 cursor-pointer hover:fill-yellow-300';
      case 'Akami Tail':
      case 'Toro Tail':
        return 'fill-gray-200 cursor-pointer hover:fill-gray-300';
      default:
        return 'fill-blue-200 cursor-pointer hover:fill-blue-300';
    }
  };

  const getSegmentStroke = (segment: Segment) => {
    if (selectedSegments.includes(segment.id)) {
      return 'stroke-blue-700 stroke-2';
    }
    return 'stroke-gray-400 stroke-1';
  };

  const handleSegmentClick = (segment: Segment) => {
    if (segment.is_available) {
      onSegmentSelect(segment.id);
    }
  };

  // Group segments by type for better organization
  const akamiBlocks = segments.filter(s => s.segment_type === 'Akami Block');
  const akamiTails = segments.filter(s => s.segment_type === 'Akami Tail');
  const toroAkami = segments.filter(s => s.segment_type === 'Toro Akami');
  const otoro = segments.filter(s => s.segment_type === 'Otoro');
  const chutoro = segments.filter(s => s.segment_type === 'Chutoro');
  const kama = segments.filter(s => s.segment_type === 'Kama Shoulder');
  const toroTails = segments.filter(s => s.segment_type === 'Toro Tail');

  return (
    <div className="w-full">
      <svg viewBox="0 0 700 300" className="w-full h-auto max-h-96 border rounded-lg bg-blue-50">
        {/* Fish outline */}
        <path
          d="M80 150 Q150 80, 350 100 Q550 110, 650 150 Q550 190, 350 200 Q150 220, 80 150 Z"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
          className="opacity-70"
        />
        
        {/* Render all segments */}
        {segments.map((segment) => (
          <rect
            key={segment.id}
            x={segment.position_x}
            y={segment.position_y}
            width={segment.width}
            height={segment.height}
            rx="4"
            className={getSegmentColor(segment)}
            stroke={getSegmentStroke(segment)}
            onClick={() => handleSegmentClick(segment)}
            
          />
        ))}

        {/* Add labels for major sections */}
        <text x="100" y="50" className="text-xs font-medium fill-gray-600">Kama</text>
        <text x="200" y="50" className="text-xs font-medium fill-gray-600">Akami Loins</text>
        <text x="200" y="280" className="text-xs font-medium fill-gray-600">Akami Loins</text>
        <text x="450" y="50" className="text-xs font-medium fill-gray-600">Toro Loins</text>
        <text x="450" y="280" className="text-xs font-medium fill-gray-600">Toro Loins</text>
      </svg>
      
      {/* Legend and Segment List */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Available Segments</h4>
        
        {/* Segment Type Groups */}
        <div className="space-y-4">
          {/* Akami Blocks */}
          {akamiBlocks.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <div className="w-3 h-3 bg-red-100 border border-red-200 rounded mr-2"></div>
                Akami Blocks (Lean Red Meat)
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {akamiBlocks.map((segment) => (
                  <SegmentCard key={segment.id} segment={segment} selectedSegments={selectedSegments} onSelect={handleSegmentClick} />
                ))}
              </div>
            </div>
          )}

          {/* Otoro */}
          {otoro.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <div className="w-3 h-3 bg-pink-200 border border-pink-300 rounded mr-2"></div>
                Otoro (Premium Fatty Belly)
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {otoro.map((segment) => (
                  <SegmentCard key={segment.id} segment={segment} selectedSegments={selectedSegments} onSelect={handleSegmentClick} />
                ))}
              </div>
            </div>
          )}

          {/* Chutoro */}
          {chutoro.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <div className="w-3 h-3 bg-orange-200 border border-orange-300 rounded mr-2"></div>
                Chutoro (Medium Fatty Belly)
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {chutoro.map((segment) => (
                  <SegmentCard key={segment.id} segment={segment} selectedSegments={selectedSegments} onSelect={handleSegmentClick} />
                ))}
              </div>
            </div>
          )}

          {/* Toro Akami */}
          {toroAkami.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <div className="w-3 h-3 bg-red-200 border border-red-300 rounded mr-2"></div>
                Toro Akami (Toro Red Meat)
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {toroAkami.map((segment) => (
                  <SegmentCard key={segment.id} segment={segment} selectedSegments={selectedSegments} onSelect={handleSegmentClick} />
                ))}
              </div>
            </div>
          )}

          {/* Kama */}
          {kama.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <div className="w-3 h-3 bg-yellow-200 border border-yellow-300 rounded mr-2"></div>
                Kama (Collar/Shoulder)
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {kama.map((segment) => (
                  <SegmentCard key={segment.id} segment={segment} selectedSegments={selectedSegments} onSelect={handleSegmentClick} />
                ))}
              </div>
            </div>
          )}

          {/* Tail Sections */}
          {(akamiTails.length > 0 || toroTails.length > 0) && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <div className="w-3 h-3 bg-gray-200 border border-gray-300 rounded mr-2"></div>
                Tail Sections
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[...akamiTails, ...toroTails].map((segment) => (
                  <SegmentCard key={segment.id} segment={segment} selectedSegments={selectedSegments} onSelect={handleSegmentClick} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SegmentCard({ segment, selectedSegments, onSelect }: { 
  segment: Segment; 
  selectedSegments: number[]; 
  onSelect: (segment: Segment) => void;
}) {
  return (
    <div 
      className={`p-2 rounded-lg border transition-all cursor-pointer text-xs ${
        selectedSegments.includes(segment.id) 
          ? 'border-blue-500 bg-blue-50' 
          : segment.is_available 
            ? 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50' 
            : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
      }`}
      onClick={() => onSelect(segment)}
    >
      <div className="flex items-center justify-between mb-1">
        <h6 className="font-medium text-xs">{segment.name}</h6>
        <div className={`w-2 h-2 rounded-full ${
          !segment.is_available ? 'bg-red-400' : 
          selectedSegments.includes(segment.id) ? 'bg-blue-500' : 'bg-green-400'
        }`} />
      </div>
      <div className="text-xs text-gray-600">
        {segment.weight_kg} kg
      </div>
      <div className="text-xs text-gray-500">
        {segment.segment_type}
      </div>
      {!segment.is_available && (
        <div className="text-xs text-red-600 mt-1">Sold Out</div>
      )}
    </div>
  );
}
