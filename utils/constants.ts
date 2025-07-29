const LOCAL_URL = 'http://localhost:3001';
const PROD_URL = 'https://urbandrive-server.onrender.com';

// Detect manually via NODE_ENV or fallback based on hostname
export const BASE_URL =
  process.env.NODE_ENV === 'development' ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost')
    ? LOCAL_URL
    : PROD_URL;
