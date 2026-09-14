// 'use client' le avisa a Next.js (App Router) que este componente se ejecuta en el navegador del usuario.
// Es obligatorio siempre que necesites interactuar con el cliente (usar useState, useEffect, eventos de click, etc.).
'use client';

// Importamos los hooks fundamentales de React:
// - useState: para guardar y actualizar datos que cambian la pantalla (estado).
// - useEffect: para ejecutar código cuando el componente se dibuja por primera vez (efectos secundarios).
import { useEffect, useState } from 'react';

// Link es el componente de Next.js para navegar entre páginas sin recargar la pantalla completa (Single Page Application).
import Link from 'next/link';

// Importamos nuestra instancia personalizada de Axios desde api.ts.
// Usar '@/...' es un atajo de Next.js (alias) que apunta directamente a la carpeta raíz del proyecto.
import api from '@/services/api';

// --- INTERFACES DE TYPESCRIPT ---
// TypeScript nos pide definir la "forma" que tienen los datos.
// Acá definimos qué propiedades tiene un objeto "Curso" según lo que devuelve el backend en Laravel.
interface Curso {
    id: number;
    titulo: string;
    descripcion: string | null; // Puede ser un texto o venir nulo (null) de la base de datos
    precio: number;
    preciopromo: number;
}

export default function CursosPage() {
    // --- ESTADOS LOCALES (useState) ---
    // 1. Guardamos la lista de cursos. Arranca como un arreglo vacío [].
    // Le indicamos a TypeScript que es un array de Cursos: <Curso[]>
    const [cursos, setCursos] = useState<Curso[]>([]);

    // 2. Estado de carga: nos sirve para mostrar un cartelito de "Cargando..." mientras esperamos la respuesta de Railway.
    const [loading, setLoading] = useState(true);

    // --- CONSUMO DE LA API (useEffect) ---
    // El useEffect con un arreglo de dependencias vacío `[]` al final se ejecuta UNA SOLA VEZ,
    // justo cuando la página se carga en el navegador.
    useEffect(() => {
        // Hacemos la petición GET a la ruta '/cursos'.
        // Como 'api' ya tiene configurada la baseURL (https://ehl-backend-production.up.railway.app/api),
        // Axios automáticamente completa la URL a: .../api/cursos
        api.get('/cursos')
            .then(response => {
                // Si la API responde con éxito (HTTP 200):
                // 1. Guardamos los datos recibidos (response.data) en nuestro estado 'cursos'
                setCursos(response.data);
                // 2. Apagamos el indicador de carga
                setLoading(false);
            })
            .catch(err => {
                // Si la red falla o la API devuelve error:
                console.error('Error cargando cursos:', err);
                // También apagamos la carga para que la pantalla no quede colgada para siempre
                setLoading(false);
            });
    }, []); // <-- [] significa: "ejecutar solo al montar la página"

    // --- RENDERIZADO CONDICIONAL (Cargando) ---
    // Si la API todavía no respondió, interrumpimos el render normal y mostramos esto:
    if (loading) {
        return <div className="p-4">Cargando cursos...</div>;
    }

    // --- RENDERIZADO PRINCIPAL (UI) ---
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Nuestros Cursos</h1>
            
            {/* Grilla responsive con Tailwind CSS:
                - Mobile: 1 columna (grid-cols-1)
                - Pantallas medianas/Tablet: 2 columnas (md:grid-cols-2)
                - Pantallas grandes/Desktop: 3 columnas (lg:grid-cols-3) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* RECORRIDO DEL ARRAY (.map):
                    Convertimos la lista de objetos 'cursos' en elementos visuales JSX. */}
                {cursos.map(curso => (
                    
                    /* OJO: React nos exige colocar la propiedad 'key' única en el elemento padre 
                       cuando iteramos con .map() para poder rastrear los cambios eficientemente. */
                    <div key={curso.id} className="border rounded-lg p-4 shadow">
                        <h2 className="text-xl font-semibold">{curso.titulo}</h2>
                        
                        {/* Operador OR (||): Si curso.descripcion viene nulo o vacío, muestra 'Sin descripción' */}
                        <p className="text-gray-600 mt-2">{curso.descripcion || 'Sin descripción'}</p>
                        
                        <div className="mt-4">
                            {/* Precio promocional/final */}
                            <span className="text-2xl font-bold text-green-600">${curso.preciopromo}</span>
                            
                            {/* RENDERIZADO CONDICIONAL CON '&&':
                                Si el precio original es mayor al promocional, mostramos el precio tachado.
                                Si no hay descuento, esta parte directamente no se dibuja en el HTML. */}
                            {curso.precio > curso.preciopromo && (
                                <span className="line-through text-gray-500 ml-2">${curso.precio}</span>
                            )}
                        </div>

                        {/* Navegación dinámica hacia el detalle del curso usando Template Literals (`...`)
                            Redirige por ejemplo a: /cursos/1, /cursos/2, etc. */}
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