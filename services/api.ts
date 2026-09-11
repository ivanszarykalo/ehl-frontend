// Importamos axios para hacer peticiones HTTP
import axios from 'axios';

// Creamos una instancia de axios con configuración base
const api = axios.create({
    // URL base de nuestra API Laravel (hardcodeada para pruebas locales)
    baseURL: `https://ehl-backend-production.up.railway.app/api`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});
/*
Guarda Ivan!
Estamos harcodeando
baseURL: `http://localhost:8000/api`,
baseURL: `https://ehl-backend-production.up.railway.app/api`,
*/

// Interceptor para agregar el token automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;