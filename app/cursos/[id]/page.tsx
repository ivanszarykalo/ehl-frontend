'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';  // 🔹 Necesitamos api para llamar al checkout

interface Curso {
    id: number;
    titulo: string;
    descripcion: string | null;
    precio: number;
    preciopromo: number;
    imagen: string | null;
}

export default function CursoDetallePage() {
    const { id } = useParams();
    const router = useRouter();
    const { user, token } = useAuth();
    const [curso, setCurso] = useState<Curso | null>(null);
    const [loading, setLoading] = useState(true);
    const [inscribiendo, setInscribiendo] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [comprando, setComprando] = useState(false);  // 🔹 Estado para el botón de compra

    // Cargar datos del curso
    useEffect(() => {
        if (!id) return;
        
        fetch(`http://localhost:8000/api/cursos/${id}`, {
            headers: { 'Accept': 'application/json' }
        })
            .then(res => res.json())
            .then(data => {
                setCurso(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    // Función para inscribirse (pago manual, sin MercadoPago)
    const handleInscribirse = async () => {
        if (!token) {
            router.push('/login');
            return;
        }
        
        setInscribiendo(true);
        try {
            const res = await fetch(`http://localhost:8000/api/cursos/${id}/inscribir`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            setMensaje(data.message);
            setTimeout(() => setMensaje(''), 3000);
        } catch (error) {
            setMensaje('Error al inscribirte. Intentalo nuevamente.');
            setTimeout(() => setMensaje(''), 3000);
        } finally {
            setInscribiendo(false);
        }
    };

    // 🆕 Función para comprar con MercadoPago
    const handleComprar = async () => {
        if (!token) {
            router.push('/login');
            return;
        }

        setComprando(true);
        try {
            const response = await api.post(`/cursos/${id}/checkout`);
            // Redirigir a MercadoPago para pagar
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
                    
                    {/* Mensaje de éxito/error */}
                    {mensaje && (
                        <p className={`mb-4 text-center ${
                            mensaje.includes('correctamente') || mensaje.includes('inscrito') 
                                ? 'text-green-600' 
                                : 'text-red-600'
                        }`}>
                            {mensaje}
                        </p>
                    )}
                    
                    {/* 🆕 Botón de compra con MercadoPago */}
                    <button 
                        onClick={handleComprar}
                        disabled={comprando}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 mb-3"
                    >
                        {comprando ? 'Preparando pago...' : 'Comprar ahora'}
                    </button>
                    
                    {/* Botón de inscripción manual (opcional, podés borrarlo si querés solo compra) */}
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