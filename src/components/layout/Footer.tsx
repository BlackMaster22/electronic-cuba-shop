// src/components/layout/Footer.tsx
export function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-6 px-4 rounded-t-lg">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Electronic Cuba Shop</h3>
                        <p className="text-gray-400">
                            Tu tienda de confianza para electrónicos y electrodomésticos en Cuba.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Contacto</h4>
                        <address className="text-gray-400 not-italic space-y-2">
                            <p>Calle Ficticia #123</p>
                            <p>Vedado, Plaza de la Revolución</p>
                            <p>La Habana, Cuba</p>
                            <p>Tel: +53 51234567</p>
                            <p>Email: info@electroniccubashop.cu</p>
                        </address>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Soporte</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white">Preguntas frecuentes</a></li>
                            <li><a href="#" className="hover:text-white">Políticas de envío</a></li>
                            <li><a href="#" className="hover:text-white">Términos y condiciones</a></li>
                            <li><a href="#" className="hover:text-white">Privacidad</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Horario</h4>
                        <p className="text-gray-400">
                            Lunes a Viernes: 9:00 AM - 6:00 PM<br />
                            Sábado: 10:00 AM - 2:00 PM<br />
                            Domingo: Cerrado
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-4 pt-2 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Electronic Cuba Shop. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}