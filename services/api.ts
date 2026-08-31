// Importamos axios para hacer peticiones HTTP
import axios from 'axios';

// Creamos una instancia de axios con configuración base
// Todas las peticiones van a usar esta URL como base
const api = axios.create({
    // URL base de nuestra API Laravel
    baseURL: 'http://localhost:8000/api',
    // Headers por defecto para todas las peticiones
    headers: {
        'Content-Type': 'application/json',  // Indicamos que enviamos JSON
        'Accept': 'application/json',        // Esperamos respuesta JSON
    },
});

// INTERCEPTOR: Se ejecuta ANTES de cada petición
// Sirve para agregar el token automáticamente
api.interceptors.request.use((config) => {
    // Buscamos el token en localStorage (lo guardamos al hacer login)
    const token = localStorage.getItem('token');
    
    // Si hay token, lo agregamos al header Authorization
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Devolvemos la configuración modificada
    return config;
});

// Exportamos la instancia para usarla en toda la app
export default api;