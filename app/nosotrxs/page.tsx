export default function NosotrxsPage() {
    return (
        <div className="min-h-screen bg-ehl-bg">
            {/* Hero */}
            <section className="relative w-full h-[300px] md:h-[400px] bg-ehl-dark flex items-center justify-center">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="font-lemmon text-5xl md:text-7xl text-white uppercase">
                        Sobre nosotrxs
                    </h1>
                </div>
            </section>

            {/* Contenido */}
            <div className="container mx-auto px-6 py-16 max-w-4xl">
                <div className="space-y-8 font-montserrat text-ehl-dark leading-relaxed">
                    <p className="text-lg">
                        La Cooperativa de Trabajo Escuela de Herrería Lesbiana (EHL) nació en 2018, en el barrio de Villa Devoto, Ciudad de Buenos Aires, como una serie de talleres gratuitos de domingo para la comunidad LGTBQNB+. Desde entonces, hemos recorrido un largo camino, y hace más de 7 años nos dedicamos a enseñar, crear y sistematizar información relacionada con herrería, metalurgia y procesos de soldadura, tanto en sus técnicas más antiguas y tradicionales, como en las formas tecnológicas más actuales que exige la industria.
                    </p>

                    <p className="text-lg">
                        Ofrecemos educación de calidad en oficios para personas de todas las edades, de todos los estratos sociales, que buscan insertarse en el ámbito laboral de manera autogestiva, o a través de empleos calificados en relación de dependencia.
                    </p>

                    <p className="text-lg">
                        Fieles a nuestros orígenes, sostenemos nuestro carácter social ofreciendo un sistema de becas para clases presenciales que alcanzan al 25% de nuestro alumnado más vulnerable, al mismo tiempo que continuamos dando clases online gratuitas semanales a través de las redes sociales.
                    </p>

                    <p className="text-lg">
                        Nuestros talleres han graduado a más de 1500 estudiantes, muchxs de ellxs pertenecientes a grupos históricamente vulnerados, que buscan en nuestra escuela aprender habilidades que les permitan trabajar y progresar en un país continuamente cambiante y con una economía desafiante. Hemos becado a cerca de 400 estudiantes, que se han formado de manera enteramente gratuita.
                    </p>

                    <p className="text-lg">
                        En 2023, nos formamos como cooperativa de trabajo. Hoy en día somos un equipo multidisciplinario de seis personas LGBTQNB+, con amplia experiencia en herrería, procesos de soldadura, cerámica, lutheria, construcción, pedagogía y gestión cultural, y reconocemos en los oficios manuales una herramienta de autonomía y dignidad.
                    </p>
                </div>
            </div>
        </div>
    );
}