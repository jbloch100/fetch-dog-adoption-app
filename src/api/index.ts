import axios from 'axios';

const api = axios.create({
  baseURL: 'https://frontend-take-home-service.fetch.com',
  withCredentials: true
});

// Axios Response Interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      alert("Session expired. Please log in again.");
      window.location.href = '/'; // redirect to login page
    }
    return Promise.reject(error);
  }
);

// Login
export const login = (name: string, email: string) => 
  api.post('/auth/login', { name, email });

// Logout
export const logout = () => 
  api.post('/auth/logout');

// Get all breeds
export const getBreeds = () => 
  api.get<string[]>('/dogs/breeds');

// Search dogs
export const searchDogs = (url: string) => api.get(url);

// Get dog details by IDs
export const getDogsByIds = (ids: string[]) =>
  api.post('/dogs', ids);

// Match favorite dogs
export const matchDogs = (ids: string[]) =>
  api.post('/dogs/match', ids);

// Get locations by zip codes
export const getLocations = (zipCodes: string[]) =>
  api.post('/locations', zipCodes);

// Search locations
export const searchLocations = (body: any) =>
  api.post('/locations/search', body);

export default api;
