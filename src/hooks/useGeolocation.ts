import { useEffect, useState } from 'react';

export interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface UseGeolocationReturn {
  position: GeolocationCoordinates | null;
  loading: boolean;
  error: Error | null;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [position, setPosition] = useState<GeolocationCoordinates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(new Error('Geolocation is not supported by this browser'));
      setLoading(false);
      return;
    }

    const successCallback = (position: GeolocationPosition) => {
      setPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
      setError(null);
      setLoading(false);
    };

    const errorCallback = (error: GeolocationPositionError) => {
      setError(new Error(error.message));
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, []);

  return { position, loading, error };
};
