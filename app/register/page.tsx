// 'use client' indica que este componente se renderiza en el cliente
// Es necesario porque usamos hooks como useState, useEffect, etc.
'use client';

// Importamos hooks de React
import { useState } from 'react';
// Importamos el hook personalizado para autenticación
import { useAuth } from '@/context/AuthContext';
// Hook de Next.js para redirigir entre páginas
import { useRouter } from 'next/navigation';
// Componente Link de Next.js para navegación sin recargar la página
import Link from 'next/link';

// Componente principal de la página de registro
export default function RegisterPage() {
    // Estado para cada campo del formulario
    // setName es la función que actualiza el valor
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Estado para mostrar mensajes de error
    const [error, setError] = useState('');
    
    // Obtenemos la función register del contexto de autenticación
    const { register } = useAuth();
    // Router para redirigir después del registro exitoso
    const router = useRouter();

    // Función que se ejecuta cuando se envía el formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();  // Evita que el formulario recargue la página
        
        try {
            // Intentamos registrar al usuario con los datos ingresados
            await register(name, email, password);
            // Si funciona, redirigimos a la página "Mis cursos"
            router.push('/mis-cursos');
        } catch (err) {
            // Si hay error, mostramos un mensaje
            setError('Error al registrarse');
        }
    };

    // Renderizamos el formulario
    return (
        // Contenedor centrado con fondo gris claro
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            {/* Formulario con fondo blanco, sombra y bordes redondeados */}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6">Registro</h1>
                
                {/* Si hay error, mostramos el mensaje en rojo */}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                
                {/* Campo de nombre */}
                <input
                    type="text"
                    placeholder="Nombre"
                    value={name}                    // El valor se controla desde el estado
                    onChange={(e) => setName(e.target.value)}  // Actualiza el estado cuando el usuario escribe
                    className="w-full p-2 border rounded mb-4"
                    required                         // HTML: campo obligatorio
                />
                
                {/* Campo de email */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                    required
                />
                
                {/* Campo de contraseña */}
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                    required
                />
                
                {/* Botón de envío */}
                <button 
                    type="submit" 
                    className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                    Registrarse
                </button>
                
                {/* Link a la página de login para quienes ya tienen cuenta */}
                <p className="mt-4 text-center">
                    ¿Ya tenés cuenta?{' '}
                    <Link href="/login" className="text-blue-500">
                        Iniciar sesión
                    </Link>
                </p>
            </form>
        </div>
    );
}