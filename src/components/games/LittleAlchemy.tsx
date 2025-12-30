'use client';

import { useState } from 'react';

interface LittleAlchemyProps {
  onComplete?: () => void;
}

const baseElements = ['fire', 'water', 'earth', 'air'];
const combinations: Record<string, string> = {
  'fire+water': 'steam',
  'water+earth': 'mud',
  'earth+air': 'dust',
  'fire+earth': 'lava',
  'fire+air': 'energy',
  'water+air': 'rain',
};

export default function LittleAlchemy({ onComplete }: LittleAlchemyProps) {
  const [elements, setElements] = useState<string[]>(baseElements);
  const [selected1, setSelected1] = useState<string | null>(null);
  const [selected2, setSelected2] = useState<string | null>(null);
  const [discovered, setDiscovered] = useState<string[]>([]);

  const handleElementClick = (element: string) => {
    if (!selected1) {
      setSelected1(element);
    } else if (!selected2 && selected1 !== element) {
      setSelected2(element);
      combineElements(selected1, element);
    } else {
      setSelected1(element);
      setSelected2(null);
    }
  };

  const combineElements = (elem1: string, elem2: string) => {
    const key1 = `${elem1}+${elem2}`;
    const key2 = `${elem2}+${elem1}`;
    const result = combinations[key1] || combinations[key2];

    if (result && !elements.includes(result)) {
      setElements(prev => [...prev, result]);
      setDiscovered(prev => [...prev, result]);
      setTimeout(() => {
        if (onComplete && discovered.length >= 5) {
          onComplete();
        }
      }, 1000);
    }

    setTimeout(() => {
      setSelected1(null);
      setSelected2(null);
    }, 1000);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">⚗️ Little Alchemy</h2>
        <p className="text-sm text-gray-600">
          Discovered: <span className="font-bold text-blue-600">{discovered.length}</span>
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200 max-w-2xl w-full">
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-600 mb-4">Click two elements to combine them:</p>
            <div className="grid grid-cols-4 gap-3">
              {elements.map((element) => (
                <button
                  key={element}
                  onClick={() => handleElementClick(element)}
                  className={`px-4 py-6 rounded-xl border-2 transition-all capitalize font-semibold ${
                    selected1 === element || selected2 === element
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-gray-50 border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {element}
                </button>
              ))}
            </div>
          </div>

          {selected1 && selected2 && (
            <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200 animate-fade-in">
              <p className="text-center font-semibold text-blue-800">
                Combining {selected1} + {selected2}...
              </p>
            </div>
          )}

          {discovered.length > 0 && (
            <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
              <p className="text-sm font-semibold text-green-800 mb-2">Discovered Items:</p>
              <div className="flex flex-wrap gap-2">
                {discovered.map((item) => (
                  <span key={item} className="px-3 py-1 bg-green-100 rounded-full text-sm capitalize">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


