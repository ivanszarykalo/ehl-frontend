// 'use client' - Este componente se ejecuta en el navegador (necesario para hooks como useState, useEffect)
'use client';

// Importamos los hooks necesarios de React
import { useEffect, useState } from 'react';
// Importamos el hook de autenticación (para saber si el usuario está logueado)
import { useAuth } from '@/context/AuthContext';
// Hook de Next.js para redirigir entre páginas
import { useRouter } from 'next/navigation';
// Nuestra instancia de axios configurada con la URL base y el token
import api from '@/services/api';
// Componente Link de Next.js para navegación sin recargar
import Link from 'next/link';

// Definimos la estructura que tiene un curso cuando lo devuelve la API
// Notar que tiene un objeto 'pivot' que es la tabla intermedia curso_user
interface Curso {
    id: number;
    titulo: string;
    descripcion: string | null;
    precio: number;
    preciopromo: number;
    pivot: {
        created_at: string;  // Fecha en que el usuario se inscribió al curso
    };
}

// Componente principal de la página "Mis Cursos"
export default function MisCursosPage() {
    // Estado para guardar la lista de cursos del usuario
    const [cursos, setCursos] = useState<Curso[]>([]);
    // Estado para mostrar un mensaje mientras se cargan los datos
    const [loading, setLoading] = useState(true);
    // Obtenemos el usuario y el token del contexto de autenticación
    const { user, token } = useAuth();
    // Router para redirigir si no está logueado
    const router = useRouter();

    // useEffect: se ejecuta cuando el componente se monta y cuando cambia token o router
    useEffect(() => {
        // Si no hay token, el usuario no está logueado → redirigimos al login
        if (!token) {
            router.push('/login');
            return;  // Salimos del efecto, no seguimos cargando
        }

        // Llamamos a la API para obtener los cursos del usuario
        api.get('/mis-cursos')
            .then(response => {
                // Guardamos la lista de cursos en el estado
                setCursos(response.data.cursos);
                setLoading(false);  // Termina la carga
            })
            .catch(error => {
                console.error('Error al cargar cursos:', error);
                setLoading(false);
            });
    }, [token, router]);  // Dependencias: si cambian, se ejecuta de nuevo

    // Mientras carga, mostramos un mensaje
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl">Cargando tus cursos...</p>
            </div>
        );
    }

    // Renderizado principal
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Mis Cursos</h1>
            
            {/* Si no hay cursos, mostramos un mensaje y un botón para ver el catálogo */}
            {cursos.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-600 mb-4">
                        Todavía no estás inscripto en ningún curso.
                    </p>
                    <Link href="/cursos">
                        <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                            Ver catálogo de cursos
                        </button>
                    </Link>
                </div>
            ) : (
                // Si hay cursos, los mostramos en una cuadrícula
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cursos.map(curso => (
                        // Cada tarjeta de curso
                        <div key={curso.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
                            <h2 className="text-xl font-semibold">{curso.titulo}</h2>
                            <p className="text-gray-600 mt-2">
                                {curso.descripcion || 'Sin descripción'}
                            </p>
                            {/* Fecha de inscripción formateada */}
                            <p className="text-sm text-gray-500 mt-2">
                                Inscripto el: {new Date(curso.pivot.created_at).toLocaleDateString()}
                            </p>
                            {/* Botón para ver las lecciones del curso */}
                            <Link href={`/cursos/${curso.id}/lecciones`}>
                                <button className="mt-4 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">
                                    Ver lecciones
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}