export default function TiendaPage() {
    return (
        <div className="min-h-screen bg-ehl-bg">
            <div className="container mx-auto px-6 py-12 max-w-2xl text-center">
                <h1 className="font-lemmon text-4xl md:text-5xl text-ehl-dark mb-6 uppercase">
                    Tienda
                </h1>
                <p className="font-montserrat text-lg text-ehl-dark mb-8">
                    Estamos preparando la tienda de la cooperativa. Pronto vas a poder encontrar acá:
                </p>
                <ul className="font-montserrat text-ehl-dark space-y-2 mb-12 text-left inline-block">
                    <li>• Herramientas y materiales</li>
                    <li>• Merchandising de la EHL</li>
                </ul>
                <div className="bg-ehl-light p-6">
                    <p className="font-montserrat text-ehl-dark">
                        🚧 En construcción 🚧
                    </p>
                </div>
            </div>
        </div>
    );
}