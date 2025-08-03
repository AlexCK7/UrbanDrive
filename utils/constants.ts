const LOCAL_URL = 'http://localhost:3001';
const TUNNEL_URL = 'https://urbandrive.loca.lt';
const PROD_URL = 'https://urbandrive-server.onrender.com';

export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? PROD_URL
    : __DEV__
    ? LOCAL_URL
    : TUNNEL_URL;
