'use client';

import { useState } from 'react';

export default function ContactoPage() {
    const [form, setForm] = useState({
        nombre: '',
        email: '',
        mensaje: '',
    });
    const [enviando, setEnviando] = useState(false);
    const [enviado, setEnviado] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setEnviando(true);
        // Simulamos el envío (por ahora no hay backend)
        setTimeout(() => {
            setEnviando(false);
            setEnviado(true);
            setForm({ nombre: '', email: '', mensaje: '' });
            setTimeout(() => setEnviado(false), 5000);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-ehl-bg">
            <div className="container mx-auto px-6 py-12 max-w-2xl">
                <h1 className="font-lemmon text-4xl md:text-5xl text-ehl-dark mb-4 uppercase text-center">
                    Contacto
                </h1>
                <p className="font-montserrat text-lg text-ehl-dark text-center mb-12">
                    Escribinos y te respondemos a la brevedad.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="nombre" className="block font-montserrat text-sm uppercase text-ehl-dark mb-2">
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-ehl-dark bg-white font-montserrat text-ehl-dark focus:outline-none focus:border-ehl-medium"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block font-montserrat text-sm uppercase text-ehl-dark mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-ehl-dark bg-white font-montserrat text-ehl-dark focus:outline-none focus:border-ehl-medium"
                        />
                    </div>

                    <div>
                        <label htmlFor="mensaje" className="block font-montserrat text-sm uppercase text-ehl-dark mb-2">
                            Mensaje
                        </label>
                        <textarea
                            id="mensaje"
                            name="mensaje"
                            value={form.mensaje}
                            onChange={handleChange}
                            required
                            rows={6}
                            className="w-full px-4 py-3 border-2 border-ehl-dark bg-white font-montserrat text-ehl-dark focus:outline-none focus:border-ehl-medium resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={enviando}
                        className="w-full bg-ehl-dark text-white py-4 font-lemmon text-lg uppercase hover:bg-ehl-medium transition disabled:opacity-50"
                    >
                        {enviando ? 'Enviando...' : 'Enviar mensaje'}
                    </button>

                    {enviado && (
                        <div className="bg-ehl-light p-4 text-center">
                            <p className="font-montserrat text-ehl-dark">
                                ✓ ¡Mensaje enviado! Te vamos a responder a la brevedad.
                            </p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}