'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
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

function LeccionContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();
    const { token } = useAuth();
    const [leccion, setLeccion] = useState<Leccion | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [marcando, setMarcando] = useState(false);
    const [marcada, setMarcada] = useState(false);

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }

        if (!id) {
            setError('ID de lección no especificado');
            setLoading(false);
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
                    setError(error.response?.data?.message || 'No tenés acceso a esta lección');
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
            setMarcada(true);
            setTimeout(() => setMarcada(false), 3000);
        } catch (error) {
            console.error('Error al marcar progreso:', error);
            alert('Error al marcar la lección como vista');
        } finally {
            setMarcando(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-ehl-bg">
                <p className="text-xl font-montserrat text-ehl-dark">Cargando lección...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-ehl-bg">
                <div className="bg-ehl-light border border-ehl-dark text-ehl-dark px-6 py-4 mb-6 font-montserrat">
                    {error}
                </div>
                <Link href="/cursos/4">
                    <button className="bg-ehl-dark text-white px-6 py-3 font-lemmon uppercase hover:bg-ehl-medium transition">
                        Volver al curso
                    </button>
                </Link>
            </div>
        );
    }

    if (!leccion) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-ehl-bg">
                <p className="text-xl font-montserrat text-ehl-dark">Lección no encontrada</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ehl-bg">
            <div className="container mx-auto px-6 py-12 max-w-4xl">
                {/* Volver */}
                <Link href="/cursos/4">
                    <button className="mb-8 font-montserrat text-ehl-medium hover:text-ehl-dark transition flex items-center gap-2">
                        ← Volver al curso
                    </button>
                </Link>

                {/* Título */}
                <h1 className="font-lemmon text-4xl md:text-5xl text-ehl-dark mb-6 uppercase">
                    {leccion.titulo}
                </h1>

                {/* Descripción */}
                {leccion.descripcion && (
                    <p className="font-montserrat text-lg text-ehl-dark mb-8">
                        {leccion.descripcion}
                    </p>
                )}

                {/* Video */}
                {leccion.video_url ? (
                    <div className="aspect-video mb-8 bg-ehl-dark">
                        <iframe
                            src={leccion.video_url}
                            title={leccion.titulo}
                            className="w-full h-full"
                            allowFullScreen
                        />
                    </div>
                ) : (
                    <div className="bg-ehl-light p-12 text-center mb-8">
                        <p className="font-montserrat text-ehl-dark">Video no disponible</p>
                    </div>
                )}

                {/* Botón marcar como vista */}
                <button
                    onClick={marcarComoVista}
                    disabled={marcando || marcada}
                    className={`w-full py-4 font-lemmon text-lg uppercase transition disabled:opacity-50 ${
                        marcada
                            ? 'bg-green-600 text-white'
                            : 'bg-ehl-dark text-white hover:bg-ehl-medium'
                    }`}
                >
                    {marcando ? 'Procesando...' : marcada ? '✓ Marcada como vista' : '✓ Marcar como vista'}
                </button>
            </div>
        </div>
    );
}

export default function LeccionPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-ehl-bg">
                <p className="text-xl font-montserrat text-ehl-dark">Cargando...</p>
            </div>
        }>
            <LeccionContent />
        </Suspense>
    );
}