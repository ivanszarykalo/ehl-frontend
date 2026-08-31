'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Curso {
    id: number;
    titulo: string;
    descripcion: string | null;
    precio: number;
    preciopromo: number;
}

export default function CursosPage() {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8000/api/cursos', {
            headers: { 'Accept': 'application/json' }
        })
            .then(res => res.json())
            .then(data => {
                setCursos(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="p-4">Cargando cursos...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Nuestros Cursos</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cursos.map(curso => (
                    <div key={curso.id} className="border rounded-lg p-4 shadow">
                        <h2 className="text-xl font-semibold">{curso.titulo}</h2>
                        <p className="text-gray-600 mt-2">{curso.descripcion || 'Sin descripción'}</p>
                        <div className="mt-4">
                            <span className="text-2xl font-bold text-green-600">${curso.preciopromo}</span>
                            {curso.precio > curso.preciopromo && (
                                <span className="line-through text-gray-500 ml-2">${curso.precio}</span>
                            )}
                        </div>
                        <Link href={`/cursos/${curso.id}`}>
                            <button className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                                Ver curso
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}