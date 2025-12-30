'use client';

import { useState } from 'react';

interface PaperAirplaneProps {
  onComplete?: () => void;
}

export default function PaperAirplane({ onComplete }: PaperAirplaneProps) {
  const [angle, setAngle] = useState(45);
  const [power, setPower] = useState(50);
  const [wind, setWind] = useState(0);
  const [distance, setDistance] = useState(0);
  const [bestDistance, setBestDistance] = useState(0);
  const [thrown, setThrown] = useState(false);

  const calculateDistance = () => {
    // Simple physics simulation
    const baseDistance = power * 2;
    const angleFactor = Math.sin((angle * Math.PI) / 180);
    const windFactor = wind * 0.5;
    const calculated = Math.round(baseDistance * angleFactor + windFactor);
    setDistance(calculated);
    setThrown(true);
    
    if (calculated > bestDistance) {
      setBestDistance(calculated);
    }

    setTimeout(() => {
      if (calculated > 200 && onComplete) {
        setTimeout(() => onComplete(), 2000);
      }
    }, 2000);
  };

  const reset = () => {
    setThrown(false);
    setDistance(0);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">✈️ Paper Airplane Sim</h2>
        <div className="flex items-center justify-center gap-6">
          <p className="text-sm text-gray-600">
            Distance: <span className="font-bold text-blue-600">{distance}m</span>
          </p>
          <p className="text-sm text-gray-600">
            Best: <span className="font-bold text-purple-600">{bestDistance}m</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200 max-w-md w-full">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Angle: {angle}°
            </label>
            <input
              type="range"
              min="0"
              max="90"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="w-full"
              disabled={thrown}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Power: {power}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={power}
              onChange={(e) => setPower(parseInt(e.target.value))}
              className="w-full"
              disabled={thrown}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Wind: {wind > 0 ? '+' : ''}{wind}
            </label>
            <input
              type="range"
              min="-20"
              max="20"
              value={wind}
              onChange={(e) => setWind(parseInt(e.target.value))}
              className="w-full"
              disabled={thrown}
            />
          </div>

          {thrown && (
            <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200 animate-fade-in">
              <p className="text-center font-semibold text-blue-800">
                ✈️ Plane flew {distance} meters!
              </p>
            </div>
          )}

          <div className="flex gap-4">
            {!thrown ? (
              <button
                onClick={calculateDistance}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold"
              >
                🚀 Throw Plane!
              </button>
            ) : (
              <button
                onClick={reset}
                className="flex-1 py-3 px-6 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all font-bold"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


