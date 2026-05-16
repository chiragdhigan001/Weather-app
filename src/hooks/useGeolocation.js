import { useState, useEffect } from "react";
import { getCurrentPosition } from "../api/geolocation";

export function useGeolocation() {
  const [state, setState] = useState({ coords: null, error: null, loading: true });

  useEffect(() => {
    let cancelled = false;
    getCurrentPosition()
      .then(coords => { if (!cancelled) setState({ coords, error: null, loading: false }); })
      .catch(error => { if (!cancelled) setState({ coords: null, error, loading: false }); });
    return () => { cancelled = true; };
  }, []);

  return state;
}
