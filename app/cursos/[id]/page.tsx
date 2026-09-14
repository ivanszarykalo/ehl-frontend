'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api'; // Instancia centralizada de Axios para Railway

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

    // 1. Cargar datos del curso usando nuestra instancia 'api'
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

    // 2. Función para inscribirse manualmente usando 'api'
    const handleInscribirse = async () => {
        if (!token) {
            router.push('/login');
            return;
        }
        
        setInscribiendo(true);
        try {
            const response = await api.post(`/cursos/${id}/inscribir`);
            setMensaje(response.data.message || 'Inscripción exitosa');
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

    // 3. Función para comprar con MercadoPago
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
                <p className="text-xl">Cargando curso...</p>
            </div>
        );
    }

    if (!curso) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl">Curso no encontrado</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <Link href="/cursos">
                <button className="mb-6 text-blue-500 hover:underline flex items-center gap-1">
                    ← Volver a cursos
                </button>
            </Link>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {curso.imagen && (
                    <img 
                        src={curso.imagen} 
                        alt={curso.titulo}
                        className="w-full h-64 object-cover"
                    />
                )}
                
                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-4">{curso.titulo}</h1>
                    
                    <p className="text-gray-700 mb-6 text-lg">
                        {curso.descripcion || 'Sin descripción'}
                    </p>
                    
                    <div className="mb-6">
                        <span className="text-3xl font-bold text-green-600">
                            ${curso.preciopromo}
                        </span>
                        {curso.precio > curso.preciopromo && (
                            <span className="line-through text-gray-500 ml-3 text-lg">
                                ${curso.precio}
                            </span>
                        )}
                    </div>

                    {/* Programa del curso */}
                    {curso.modulos && curso.modulos.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4">Programa del curso</h2>
                            <div className="space-y-4">
                                {curso.modulos.map((modulo) => (
                                    <div key={modulo.id} className="border rounded-lg p-4 bg-gray-50">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                            {modulo.titulo}
                                        </h3>
                                        <ul className="space-y-1">
                                            {modulo.lecciones.map((leccion) => (
                                                <li key={leccion.id} className="text-gray-600 text-sm flex items-start gap-2">
                                                    <span className="text-gray-400">•</span>
                                                    <span>{leccion.titulo}</span>
                                                    {leccion.gratis && (
                                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-auto">
                                                            Gratis
                                                        </span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Mensaje de éxito/error */}
                    {mensaje && (
                        <p className={`mb-4 text-center ${
                            mensaje.includes('correctamente') || mensaje.includes('inscrito') || mensaje.includes('exitosa')
                                ? 'text-green-600' 
                                : 'text-red-600'
                        }`}>
                            {mensaje}
                        </p>
                    )}
                    
                    {/* Botón de compra con MercadoPago */}
                    <button 
                        onClick={handleComprar}
                        disabled={comprando}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 mb-3"
                    >
                        {comprando ? 'Preparando pago...' : 'Comprar ahora'}
                    </button>
                    
                    {/* Botón de inscripción manual */}
                    <button 
                        onClick={handleInscribirse}
                        disabled={inscribiendo}
                        className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition disabled:opacity-50"
                    >
                        {inscribiendo ? 'Procesando...' : 'Inscribirme (manual)'}
                    </button>
                    
                    {/* Aviso si no está logueado */}
                    {!user && (
                        <p className="text-center text-gray-500 text-sm mt-4">
                            Necesitás iniciar sesión para comprar o inscribirte
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}