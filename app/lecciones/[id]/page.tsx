// ============================================================
// ARCHIVO: app/lecciones/[id]/page.tsx
// PROPÓSITO: Página de detalle de una lección individual.
//   Muestra: título, descripción, reproductor de video,
//   y un botón para marcar la lección como vista.
//   Una vez marcada, el botón se deshabilita y cambia su texto.
//   Además, al cargar la página, consulta si la lección ya fue vista
//   para deshabilitar el botón desde el principio si corresponde.
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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

    // Estados principales
    const [leccion, setLeccion] = useState<Leccion | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Estados para el botón de progreso
    const [marcando, setMarcando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [yaVista, setYaVista] = useState(false);

    // ======================================================
    // 1. CARGAR LOS DATOS DE LA LECCIÓN Y VERIFICAR SI YA FUE VISTA
    // ======================================================
    useEffect(() => {
        if (!id) return;

        // 1.1 Obtener los datos de la lección
        api.get(`/lecciones/${id}`)
            .then(response => {
                setLeccion(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Error al cargar la lección');
                setLoading(false);
            });

        // 1.2 Consultar si la lección ya fue marcada como vista
        api.get(`/lecciones/${id}/progreso`)
            .then(response => {
                if (response.data.visto === true) {
                    setYaVista(true);
                }
            })
            .catch(err => {
                // 404 significa que no hay registro de progreso (no está vista) → no es error
                if (err.response?.status !== 404) {
                    console.error('Error al consultar progreso:', err);
                }
            });
    }, [id]);

    // ======================================================
    // 2. FUNCIÓN PARA MARCAR LA LECCIÓN COMO VISTA
    // ======================================================
    const marcarComoVista = async () => {
        setMarcando(true);
        setMensaje('');

        try {
            await api.post(`/lecciones/${id}/progreso`);
            setMensaje('✅ ¡Lección marcada como vista!');
            setYaVista(true); // Deshabilita el botón
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.message || 'Error al marcar la lección';
            setMensaje(`❌ ${msg}`);
        } finally {
            setMarcando(false);
        }
    };

    // ======================================================
    // 3. RENDERIZADO CONDICIONAL
    // ======================================================
    if (loading) {
        return <div className="p-4">Cargando lección...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    if (!leccion) {
        return <div className="p-4">Lección no encontrada</div>;
    }

    // ======================================================
    // 4. RENDERIZADO PRINCIPAL
    // ======================================================
    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <h1 className="text-2xl font-bold mb-4">{leccion.titulo}</h1>

            {leccion.descripcion && (
                <p className="text-gray-700 mb-6">{leccion.descripcion}</p>
            )}

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

            {/* Botón con estado y mensaje */}
            <div className="mt-6 text-center">
                <button
                    onClick={marcarComoVista}
                    disabled={marcando || yaVista}
                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg disabled:opacity-50 transition"
                >
                    {yaVista
                        ? '✓ Ya vista'
                        : marcando
                        ? 'Procesando...'
                        : '✓ Marcar como vista'}
                </button>

                {mensaje && (
                    <p className="mt-3 text-sm text-gray-600">{mensaje}</p>
                )}
            </div>
        </div>
    );
}