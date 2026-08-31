'use client';  // Este componente se ejecuta en el cliente (necesario para hooks y localStorage)

import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/services/api';

// Definimos la estructura de un usuario
interface User {
    id: number;
    name: string;
    email: string;
}

// Definimos la estructura del contexto de autenticación
interface AuthContextType {
    user: User | null;                    // Datos del usuario logueado
    token: string | null;                 // Token de autenticación
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;                     // Para saber si está cargando
}

// Creamos el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto (envuelve toda la app)
export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Estados para guardar usuario y token
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Al iniciar la app, buscamos si hay token guardado en localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);  // Terminamos la carga
    }, []);

    // Función para iniciar sesión
    const login = async (email: string, password: string) => {
        // POST a la API de login
        const response = await api.post('/login', { email, password });
        const { token, user } = response.data;
        // Guardamos en localStorage para que persista al recargar
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        setUser(user);
    };

    // Función para registrar un nuevo usuario
    const register = async (name: string, email: string, password: string) => {
        // POST a la API de registro
        const response = await api.post('/register', { 
            name, email, password, 
            password_confirmation: password   // Laravel espera confirmación
        });
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        setUser(user);
    };

    // Función para cerrar sesión
    const logout = async () => {
        try {
            await api.post('/logout');  // Informamos al backend
        } catch (error) {
            console.error('Error en logout:', error);
        }
        // Borramos datos locales
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    // Proveemos los valores a los hijos
    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personalizado para usar el contexto fácilmente
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
}