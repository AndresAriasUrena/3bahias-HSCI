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
      <Card className="max-w-md mx-auto mt-4 bg-red-50">
        <CardContent className="p-4">
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-4">
      <CardHeader className="bg-gray-50 border-b">
        <h2 className="text-xl font-semibold">3 Bahías Monitor</h2>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {data ? (
          <>
            <div className="flex items-center gap-2">
              <Clock className="text-gray-500" size={20} />
              <div>
                <p className="text-sm text-gray-500">Fecha</p>
                <p className="font-medium">{data.fecha}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Activity className="text-gray-500" size={20} />
              <div>
                <p className="text-sm text-gray-500">Valor</p>
                <p className="font-medium">{data.valor}</p>
              </div>
            </div>

            {lastUpdated && (
              <p className="text-sm text-gray-500 pt-2 border-t">
                Última actualización: {lastUpdated}
              </p>
            )}
          </>
        ) : (
          <p className="text-center py-4">Cargando...</p>
        )}
      </CardContent>
    </Card>
  );
}