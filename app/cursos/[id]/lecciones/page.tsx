'use client'; // 👈 Indica que este componente se ejecuta en el cliente (Next.js App Router)

// ============================================================
// 1. IMPORTS
// ============================================================
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext'; // Contexto de autenticación
import { useRouter } from 'next/navigation'; // Para redireccionar
import { useParams } from 'next/navigation'; // Para obtener el ID de la URL
import api from '@/services/api'; // Cliente HTTP (axios o fetch)
import Link from 'next/link'; // Para navegación sin recargar la página

// ============================================================
// 2. INTERFACES (tipos de datos)
// ============================================================
interface Leccion {
    id: number;
    titulo: string;
    video_url: string | null;
    orden: number;
}

interface Modulo {
    id: number;
    titulo: string;
    orden: number;
    lecciones: Leccion[];
}

interface ProximoModulo {
    semana: number;
    modulos: string[];
}

// ============================================================
// 3. COMPONENTE PRINCIPAL
// ============================================================
export default function LeccionesPage() {
    // Estados locales
    const [curso, setCurso] = useState<any>(null); // Datos del curso
    const [modulos, setModulos] = useState<Modulo[]>([]); // Módulos y lecciones
    const [semanaActual, setSemanaActual] = useState<number>(1);
    const [proximosModulos, setProximosModulos] = useState<ProximoModulo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Hooks de autenticación y navegación
    const { token } = useAuth(); // 👈 Si no hay token, redirige al login
    const router = useRouter();
    const params = useParams(); // 👈 Obtiene los parámetros de la URL (ej: { id: "1" })
    const cursoId = params.id; // 👈 Este es el ID del curso

    // ============================================================
    // 4. useEffect: CARGA LOS DATOS AL MONTAR EL COMPONENTE
    // ============================================================
    useEffect(() => {
        // Si no hay token, redirige al login
        if (!token) {
            router.push('/login');
            return;
        }

        // Llama a la API para obtener las lecciones del curso
        api.get(`/cursos/${cursoId}/lecciones`) // 👈 URL relativa. Se concatena con la base de api (ej: http://127.0.0.1:8000/api)
            .then(response => {
                // Actualiza los estados con los datos recibidos
                setCurso(response.data.curso);
                setModulos(response.data.modulos);
                setSemanaActual(response.data.semana_actual);
                setProximosModulos(response.data.proximos_modulos);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                // Manejo de errores: 403 = sin acceso, otros = error genérico
                if (error.response?.status === 403) {
                    setError(error.response?.data?.message || 'No tienes acceso');
                } else {
                    setError('Error al cargar las lecciones');
                }
                setLoading(false);
            });
    }, [token, router, cursoId]); // 👈 Dependencias: se ejecuta al cambiar token, router o cursoId

    // ============================================================
    // 5. RENDERIZADO CONDICIONAL
    // ============================================================

    // 5.1 Mientras carga
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl">Cargando curso...</p>
            </div>
        );
    }

    // 5.2 Si hay error
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded mb-4">
                    {error}
                </div>
                <Link href="/mis-cursos">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">
                        Volver a Mis Cursos
                    </button>
                </Link>
            </div>
        );
    }

    // ============================================================
    // 6. RENDERIZADO PRINCIPAL
    // ============================================================
    return (
        <div className="container mx-auto p-4">
            {/* Botón para volver a "Mis Cursos" */}
            <Link href="/mis-cursos">
                <button className="mb-4 text-blue-500 hover:underline">
                    ← Volver a Mis Cursos
                </button>
            </Link>
            
            {/* Título del curso */}
            <h1 className="text-3xl font-bold mb-2">{curso?.titulo}</h1>
            
            {/* Fecha límite (si existe) */}
            {curso?.fecha_limite && (
                <p className="text-sm text-gray-500 mb-4">
                    Acceso válido hasta: {new Date(curso.fecha_limite).toLocaleDateString()}
                </p>
            )}
            
            {/* Información de la semana actual y próximos módulos */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-700 font-medium">
                    📅 Semana {semanaActual} del curso
                </p>
                {proximosModulos.length > 0 && (
                    <div className="mt-2">
                        <p className="text-blue-600 text-sm">Próximos contenidos:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {proximosModulos.map((item) => (
                                <span key={item.semana} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                                    Semana {item.semana}: {item.modulos.join(', ')}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Lista de módulos y lecciones */}
            {modulos.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                    Aún no hay módulos disponibles para esta semana.
                    {proximosModulos.length > 0 && ' Vuelve pronto para ver los próximos contenidos.'}
                </p>
            ) : (
                modulos.map(modulo => (
                    <div key={modulo.id} className="mb-8 border rounded-lg overflow-hidden">
                        <div className="bg-gray-100 p-4 border-b">
                            <h2 className="text-xl font-semibold">
                                Módulo {modulo.orden}: {modulo.titulo}
                            </h2>
                        </div>
                        <div className="divide-y">
                            {modulo.lecciones && modulo.lecciones.length > 0 ? (
                                modulo.lecciones.map(leccion => (
                                    <div key={leccion.id} className="p-4 hover:bg-gray-50 transition">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium">
                                                    Lección {leccion.orden}: {leccion.titulo}
                                                </h3>
                                            </div>
                                            {/* 👇 ENLACE A LA LECCIÓN INDIVIDUAL */}
                                            <Link href={`/lecciones/${leccion.id}`}>
                                                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                                                    Ver lección
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-gray-500 text-sm">
                                    No hay lecciones disponibles en este módulo.
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}