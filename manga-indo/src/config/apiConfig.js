const isProd = import.meta.env.PROD;
const DEFAULT_RELATIVE = '/api';
// You can override the backend URL in production via VITE_BACKEND_URL env variable.
const BACKEND_URL = isProd ? (import.meta.env.VITE_BACKEND_URL || DEFAULT_RELATIVE) : 'http://localhost:3001/api';
export default BACKEND_URL;
