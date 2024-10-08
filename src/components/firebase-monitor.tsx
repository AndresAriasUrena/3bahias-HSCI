// src/components/firebase-monitor.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Clock, Activity } from 'lucide-react';

interface FirebaseData {
  fecha: string;
  valor: number;
}

export default function FirebaseMonitor() {
  const [data, setData] = useState<FirebaseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('https://prueba-labview-default-rtdb.firebaseio.com/BASE_DATOS/ALSH_3BT2.json');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      setError('Error fetching data: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <Card className="max-w-md mx-auto mt-4 bg-red-900">
        <CardContent className="p-4">
          <p className="text-red-200">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-4 bg-gray-900 border-gray-800">
      <CardHeader className="border-b border-gray-800">
        <h2 className="text-xl font-semibold text-gray-100">3 Bahías Monitor</h2>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {data ? (
          <>
            <div className="flex items-center gap-2">
              <Clock className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Fecha</p>
                <p className="font-medium text-gray-100">{data.fecha}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Activity className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Valor</p>
                <p className="font-medium text-gray-100">{data.valor}</p>
              </div>
            </div>

            {lastUpdated && (
              <p className="text-sm text-gray-400 pt-2 border-t border-gray-800">
                Última actualización: {lastUpdated}
              </p>
            )}
          </>
        ) : (
          <p className="text-center py-4 text-gray-300">Cargando...</p>
        )}
      </CardContent>
    </Card>
  );
}