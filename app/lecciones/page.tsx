'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';

interface Leccion {
    id: number;
    titulo: string;
    descripcion: string | null;
    video_url: string | null;
    orden: number;
    modulo_id: number;
}

export default function LeccionDetallePage() {
    const { id } = useParams();
    const router = useRouter();
    const { token } = useAuth();
    const [leccion, setLeccion] = useState<Leccion | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [marcando, setMarcando] = useState(false);

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }

        api.get(`/lecciones/${id}`)
            .then(response => {
                setLeccion(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                if (error.response?.status === 403) {
                    setError(error.response?.data?.message || 'No tienes acceso a esta lección');
                } else {
                    setError('Error al cargar la lección');
                }
                setLoading(false);
            });
    }, [token, router, id]);

    const marcarComoVista = async () => {
        setMarcando(true);
        try {
            await api.post(`/lecciones/${id}/progreso`);
            alert('¡Lección marcada como vista!');
        } catch (error) {
            console.error('Error al marcar progreso:', error);
            alert('Error al marcar la lección como vista');
        } finally {
            setMarcando(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl">Cargando lección...</p>
            </div>
        );
    }

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

    if (!leccion) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl">Lección no encontrada</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <Link href={`/cursos/${leccion.modulo_id}/lecciones`}>
                <button className="mb-4 text-blue-500 hover:underline">
                    ← Volver a las lecciones
                </button>
            </Link>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">{leccion.titulo}</h1>
                    
                    {leccion.descripcion && (
                        <p className="text-gray-700 mb-6">{leccion.descripcion}</p>
                    )}
                    
                    {/* Reproductor de video */}
                    {leccion.video_url ? (
                        <div className="aspect-video mb-6">
                            <iframe
                                src={leccion.video_url}
                                title={leccion.titulo}
                                className="w-full h-full rounded-lg"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <div className="bg-gray-100 rounded-lg p-8 text-center mb-6">
                            <p className="text-gray-500">Video no disponible</p>
                        </div>
                    )}
                    
                    <button
                        onClick={marcarComoVista}
                        disabled={marcando}
                        className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition disabled:opacity-50"
                    >
                        {marcando ? 'Procesando...' : '✓ Marcar como vista'}
                    </button>
                </div>
            </div>
        </div>
    );
}