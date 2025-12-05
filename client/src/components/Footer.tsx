import { Facebook, Instagram, Twitter, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer id="footer" className="bg-gray-900 text-white py-16 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <h3 className="text-3xl font-bold font-heading text-white mb-6">PAUDRONIX GT</h3>
            <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
              La plataforma #1 en Guatemala para servicios de streaming y productos digitales. 
              Garantía total y soporte 24/7.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white text-white transition-all hover:scale-110">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white text-lg mb-6">Enlaces Rápidos</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="/" className="hover:text-primary transition-colors hover:pl-2 transition-all">Inicio</a></li>
              <li><a href="/#catalog" className="hover:text-primary transition-colors hover:pl-2 transition-all">Catálogo</a></li>
              <li><a href="/#testimonials" className="hover:text-primary transition-colors hover:pl-2 transition-all">Testimonios</a></li>
              <li><a href="#" className="hover:text-primary transition-colors hover:pl-2 transition-all">Soporte</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-lg mb-6">Contacto</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span>+502 3787-1216</span>
              </li>
              <li className="flex items-center gap-3">
                 <div className="w-5 h-5 rounded-full bg-green-500" />
                <span>info@digitalstore.gt</span>
              </li>
              <li>Ciudad de Guatemala</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} PAUDRONIX GT. Todos los derechos reservados.</p>
          <p className="mt-2 md:mt-0">Diseñado con ❤️ en Guatemala</p>
        </div>
      </div>
    </footer>
  );
}
