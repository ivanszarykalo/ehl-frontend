'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

interface Leccion {
    id: number;
    titulo: string;
    descripcion: string | null;
    video_url: string | null;
    orden: number;
    gratis: boolean;
}

interface Modulo {
    id: number;
    titulo: string;
    orden: number;
    semana: number;
    lecciones: Leccion[];
}

interface Curso {
    id: number;
    titulo: string;
    descripcion: string | null;
    precio: number;
    preciopromo: number;
    imagen: string | null;
    modulos?: Modulo[];
    inscripto?: boolean;
}

export default function CursoDetallePage() {
    const { id } = useParams();
    const router = useRouter();
    const { user, token } = useAuth();
    const [curso, setCurso] = useState<Curso | null>(null);
    const [loading, setLoading] = useState(true);
    const [inscribiendo, setInscribiendo] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [comprando, setComprando] = useState(false);
    const [moduloAbierto, setModuloAbierto] = useState<number | null>(null);

    useEffect(() => {
        if (!id) return;
        
        api.get(`/cursos/${id}`)
            .then(response => {
                setCurso(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error al cargar detalle del curso:', err);
                setLoading(false);
            });
    }, [id]);

    const handleInscribirse = async () => {
        if (!token) {
            router.push('/login');
            return;
        }
        
        setInscribiendo(true);
        try {
            const response = await api.post(`/cursos/${id}/inscribir`);
            setMensaje(response.data.message || 'Inscripción exitosa');
            // Recargar el curso para actualizar el campo 'inscripto'
            const cursoActualizado = await api.get(`/cursos/${id}`);
            setCurso(cursoActualizado.data);
            setTimeout(() => setMensaje(''), 3000);
        } catch (error: any) {
            console.error('Error al inscribir:', error);
            const msg = error.response?.data?.message || 'Error al inscribirte. Intentalo nuevamente.';
            setMensaje(msg);
            setTimeout(() => setMensaje(''), 3000);
        } finally {
            setInscribiendo(false);
        }
    };

    const handleComprar = async () => {
        if (!token) {
            router.push('/login');
            return;
        }

        setComprando(true);
        try {
            const response = await api.post(`/cursos/${id}/checkout`);
            window.location.href = response.data.init_point;
        } catch (error) {
            console.error('Error al iniciar pago:', error);
            alert('Hubo un error al procesar el pago. Intentalo nuevamente.');
        } finally {
            setComprando(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl font-montserrat">Cargando curso...</p>
            </div>
        );
    }

    if (!curso) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl font-montserrat">Curso no encontrado</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ehl-bg">
            {/* Hero */}
            <section className="relative w-full h-[400px] md:h-[600px]">
                <img
                    src="/images/header-curso-1.png"
                    alt={curso.titulo}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-ehl-dark/70"></div>
                <div className="relative z-10 container mx-auto h-full flex flex-col justify-center px-6">
                    <h1 className="font-lemmon text-4xl md:text-6xl text-white mb-4 uppercase">
                        {curso.titulo}
                    </h1>
                    <p className="font-montserrat text-lg text-white/90 max-w-2xl">
                        {curso.descripcion}
                    </p>
                </div>
            </section>

            {/* Contenido */}
            <div className="container mx-auto px-6 py-12 max-w-4xl">
                {/* Precio */}
                <div className="mb-8">
                    <span className="font-lemmon text-4xl text-ehl-dark">
                        ${curso.preciopromo}
                    </span>
                </div>

                {/* Acordeón de módulos */}
                {curso.modulos && curso.modulos.length > 0 && (
                    <div className="mb-8">
                        <h2 className="font-lemmon text-3xl text-ehl-dark mb-6 uppercase">
                            Programa del curso
                        </h2>
                        <div className="space-y-2">
                            {curso.modulos.map((modulo) => (
                                <div key={modulo.id}>
                                    {/* Header del módulo: clickeable si está inscripto */}
                                    {curso.inscripto ? (
                                        <button
                                            onClick={() => setModuloAbierto(
                                                moduloAbierto === modulo.id ? null : modulo.id
                                            )}
                                            className="w-full bg-ehl-dark text-white px-6 py-4 flex items-center justify-between hover:bg-ehl-medium transition"
                                        >
                                            <div className="flex items-center gap-6 text-left">
                                                <span className="font-lemmon text-3xl md:text-4xl">
                                                    MÓDULO {modulo.orden}
                                                </span>
                                                <div className="font-montserrat">
                                                    <p className="text-sm opacity-80">{modulo.titulo}</p>
                                                </div>
                                            </div>
                                            <span className="font-montserrat text-sm uppercase">
                                                {moduloAbierto === modulo.id ? 'Contraer' : 'Expandir'} →
                                            </span>
                                        </button>
                                    ) : (
                                        <div className="w-full bg-ehl-dark text-white px-6 py-4 flex items-center justify-between">
                                            <div className="flex items-center gap-6 text-left">
                                                <span className="font-lemmon text-3xl md:text-4xl">
                                                    MÓDULO {modulo.orden}
                                                </span>
                                                <div className="font-montserrat">
                                                    <p className="text-sm opacity-80">{modulo.titulo}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Lecciones (solo si está inscripto y el módulo está abierto) */}
                                    {curso.inscripto && moduloAbierto === modulo.id && (
                                        <div className="bg-ehl-medium">
                                            {modulo.lecciones.map((leccion) => (
                                                <div
                                                    key={leccion.id}
                                                    className="border-t border-white/20 px-6 py-4 flex items-center justify-between"
                                                >
                                                    <span className="font-montserrat text-white">
                                                        {leccion.titulo}
                                                    </span>
                                                    <Link
                                                        href={`/leccion?id=${leccion.id}`}
                                                        className="font-montserrat text-sm text-white/70 uppercase hover:text-white transition"
                                                    >
                                                        Ver →
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Mensaje para no inscriptos */}
                {!curso.inscripto && (
                    <div className="bg-ehl-light p-6 text-center mb-8">
                        <p className="font-montserrat text-ehl-dark">
                            Inscribite para acceder a las lecciones del curso.
                        </p>
                    </div>
                )}

                {/* Mensaje */}
                {mensaje && (
                    <p className={`mb-4 text-center font-montserrat ${
                        mensaje.includes('correctamente') || mensaje.includes('inscrito') || mensaje.includes('exitosa')
                            ? 'text-green-600' 
                            : 'text-red-600'
                    }`}>
                        {mensaje}
                    </p>
                )}

                {/* Botones */}
                <div className="space-y-3">
                    <button 
                        onClick={handleComprar}
                        disabled={comprando}
                        className="w-full bg-ehl-dark text-white py-4 font-lemmon text-lg uppercase hover:bg-ehl-medium transition disabled:opacity-50"
                    >
                        {comprando ? 'Preparando pago...' : 'Comprar ahora'}
                    </button>
                    <button 
                        onClick={handleInscribirse}
                        disabled={inscribiendo}
                        className="w-full border-2 border-ehl-dark text-ehl-dark py-4 font-lemmon text-lg uppercase hover:bg-ehl-dark hover:text-white transition disabled:opacity-50"
                    >
                        {inscribiendo ? 'Procesando...' : 'Inscribirme'}
                    </button>
                </div>

                {!user && (
                    <p className="text-center text-gray-500 text-sm mt-4 font-montserrat">
                        Necesitás iniciar sesión para comprar o inscribirte
                    </p>
                )}
            </div>
        </div>
    );
}