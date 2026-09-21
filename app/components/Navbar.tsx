'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/cursos');
    };

    return (
        <header className="bg-ehl-light">
            <nav className="container mx-auto flex items-center justify-between px-6 py-3">
                {/* Logo + nombre */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-ehl-dark flex items-center justify-center">
                        <span className="text-ehl-light text-xs font-bold">EHL</span>
                    </div>
                    <span className="font-lemmon text-lg tracking-wide text-ehl-dark">
                        COOPERATIVA EHL
                    </span>
                </Link>

                {/* Menú de navegación */}
                <ul className="hidden md:flex items-center gap-8 font-montserrat text-sm uppercase tracking-wide text-ehl-dark">
                    <li>
                        <Link href="/cursos" className="hover:text-ehl-medium transition">
                            Cursos
                        </Link>
                    </li>
                    <li>
                        <Link href="/tienda" className="hover:text-ehl-medium transition">
                            Tienda
                        </Link>
                    </li>
                    <li>
                        <Link href="/articulos" className="hover:text-ehl-medium transition">
                            Artículos
                        </Link>
                    </li>
                    <li>
                        <Link href="/nosotrxs" className="hover:text-ehl-medium transition">
                            Nosotrxs
                        </Link>
                    </li>
                    <li>
                        <Link href="/contacto" className="hover:text-ehl-medium transition">
                            Contacto
                        </Link>
                    </li>
                </ul>

                {/* Ingresar / Usuario */}
                <div className="font-montserrat text-sm uppercase tracking-wide">
                    {user ? (
                        <div className="flex items-center gap-4 text-ehl-dark">
                            <Link href="/mis-cursos" className="hover:text-ehl-medium transition">
                                Mis Cursos
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="hover:text-ehl-medium transition"
                            >
                                Salir ({user.name})
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="text-ehl-dark hover:text-ehl-medium transition"
                        >
                            Ingresar
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}