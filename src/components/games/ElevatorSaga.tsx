'use client';

import { useState } from 'react';

interface ElevatorSagaProps {
  onComplete?: () => void;
}

export default function ElevatorSaga({ onComplete }: ElevatorSagaProps) {
  const [floors, setFloors] = useState<{ floor: number; waiting: number }[]>([
    { floor: 1, waiting: 2 },
    { floor: 2, waiting: 1 },
    { floor: 3, waiting: 3 },
  ]);
  const [elevator1, setElevator1] = useState({ floor: 1, passengers: 0 });
  const [elevator2, setElevator2] = useState({ floor: 1, passengers: 0 });
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const moveElevator = (elevatorNum: number, direction: 'up' | 'down') => {
    if (elevatorNum === 1) {
      const newFloor = direction === 'up' ? Math.min(3, elevator1.floor + 1) : Math.max(1, elevator1.floor - 1);
      setElevator1(prev => ({ ...prev, floor: newFloor }));
    } else {
      const newFloor = direction === 'up' ? Math.min(3, elevator2.floor + 1) : Math.max(1, elevator2.floor - 1);
      setElevator2(prev => ({ ...prev, floor: newFloor }));
    }
  };

  const pickupPassengers = (elevatorNum: number) => {
    const elevator = elevatorNum === 1 ? elevator1 : elevator2;
    const floorData = floors.find(f => f.floor === elevator.floor);
    if (floorData && floorData.waiting > 0 && elevator.passengers < 5) {
      const picked = Math.min(floorData.waiting, 5 - elevator.passengers);
      setFloors(prev => prev.map(f => 
        f.floor === elevator.floor ? { ...f, waiting: f.waiting - picked } : f
      ));
      if (elevatorNum === 1) {
        setElevator1(prev => ({ ...prev, passengers: prev.passengers + picked }));
      } else {
        setElevator2(prev => ({ ...prev, passengers: prev.passengers + picked }));
      }
      setScore(prev => prev + picked * 10);
    }
  };

  const dropPassengers = (elevatorNum: number) => {
    if (elevatorNum === 1 && elevator1.passengers > 0) {
      setElevator1(prev => ({ ...prev, passengers: 0 }));
      setScore(prev => prev + 20);
    } else if (elevatorNum === 2 && elevator2.passengers > 0) {
      setElevator2(prev => ({ ...prev, passengers: 0 }));
      setScore(prev => prev + 20);
    }
  };

  if (completed || floors.every(f => f.waiting === 0)) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🏢</div>
          <h3 className="text-2xl font-bold text-gray-800">Mission Complete!</h3>
          <p className="text-lg text-gray-600">Final Score: <span className="font-bold text-blue-600">{score}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">🏢 Elevator Saga</h2>
        <p className="text-sm text-gray-600">Score: {score} | Time: {timeLeft}s</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200 max-w-md w-full">
        <div className="space-y-4">
          {floors.slice().reverse().map((floor) => (
            <div key={floor.floor} className="border-2 border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">Floor {floor.floor}</span>
                <span className="text-sm text-gray-600">Waiting: {floor.waiting}</span>
              </div>
              <div className="flex gap-2">
                {elevator1.floor === floor.floor && (
                  <div className="bg-blue-500 text-white px-3 py-1 rounded">E1 ({elevator1.passengers})</div>
                )}
                {elevator2.floor === floor.floor && (
                  <div className="bg-green-500 text-white px-3 py-1 rounded">E2 ({elevator2.passengers})</div>
                )}
              </div>
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <p className="text-sm font-semibold mb-2">Elevator 1</p>
              <div className="flex gap-2">
                <button onClick={() => moveElevator(1, 'up')} className="flex-1 py-2 bg-blue-600 text-white rounded">↑</button>
                <button onClick={() => moveElevator(1, 'down')} className="flex-1 py-2 bg-blue-600 text-white rounded">↓</button>
                <button onClick={() => pickupPassengers(1)} className="flex-1 py-2 bg-green-600 text-white rounded">Pick</button>
                <button onClick={() => dropPassengers(1)} className="flex-1 py-2 bg-red-600 text-white rounded">Drop</button>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">Elevator 2</p>
              <div className="flex gap-2">
                <button onClick={() => moveElevator(2, 'up')} className="flex-1 py-2 bg-blue-600 text-white rounded">↑</button>
                <button onClick={() => moveElevator(2, 'down')} className="flex-1 py-2 bg-blue-600 text-white rounded">↓</button>
                <button onClick={() => pickupPassengers(2)} className="flex-1 py-2 bg-green-600 text-white rounded">Pick</button>
                <button onClick={() => dropPassengers(2)} className="flex-1 py-2 bg-red-600 text-white rounded">Drop</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


