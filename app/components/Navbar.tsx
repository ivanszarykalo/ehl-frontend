'use client';

// Componente Link de Next.js para navegación sin recargar la página
import Link from 'next/link';
// Hook personalizado para acceder al contexto de autenticación
import { useAuth } from '@/context/AuthContext';
// Hook de Next.js para redirigir programáticamente
import { useRouter } from 'next/navigation';  // ← tenías un } de más (useRouter } }), corregido

// Componente de barra de navegación que aparece en todas las páginas
export default function Navbar() {
    // Obtenemos el usuario logueado y la función logout del contexto
    const { user, logout } = useAuth();
    const router = useRouter();

    // Función que se ejecuta al hacer click en "Cerrar Sesión"
    const handleLogout = async () => {
        await logout();              // Llamamos al logout del contexto (elimina token)
        router.push('/cursos');     // Redirigimos al catálogo de cursos
    };

    return (
        // Barra de navegación: fondo gris oscuro, texto blanco, padding
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo / Título de la escuela - al hacer click va al catálogo */}
                <Link href="/cursos" className="text-xl font-bold">
                    Escuela de Herreria Lesbiana
                </Link>
                
                {/* Menú de navegación - alineado a la derecha */}
                <div className="flex gap-4">
                    {/* Enlace a catálogo de cursos (siempre visible) */}
                    <Link href="/cursos" className="hover:text-gray-300">
                        Cursos
                    </Link>
                    
                    {/* Si hay usuario logueado, mostramos opciones de usuario */}
                    {user ? (
                        <>
                            {/* Enlace a "Mis Cursos" (solo para logueados) */}
                            <Link href="/mis-cursos" className="hover:text-gray-300">
                                Mis Cursos
                            </Link>
                            {/* Botón para cerrar sesión, muestra el nombre del usuario */}
                            <button onClick={handleLogout} className="hover:text-gray-300">
                                Cerrar Sesión ({user.name})
                            </button>
                        </>
                    ) : (
                        // Si NO hay usuario logueado, mostramos opciones de autenticación
                        <>
                            <Link href="/login" className="hover:text-gray-300">
                                Iniciar Sesión
                            </Link>
                            <Link href="/register" className="hover:text-gray-300">
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}