import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlayCircle, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

import netflixImg from "@assets/generated_images/netflix_logo_3d_glass_icon_style.png";
import spotifyImg from "@assets/generated_images/spotify_logo_3d_glass_icon_style.png";
import disneyImg from "@assets/generated_images/disney_plus_logo_3d_glass_icon_style.png";
import primeImg from "@assets/generated_images/amazon_prime_video_logo_3d_glass_icon_style.png";

export default function Home() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const scrollToCatalog = () => {
    const element = document.querySelector("#catalog");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-white">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-primary/5 to-transparent -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10" />

        <div className="container relative z-10 px-4 pt-20 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <span className="inline-flex items-center py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6">
              <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Precios de Guatemala 🇬🇹
            </span>
            <h1 className="text-5xl md:text-7xl font-bold font-heading text-gray-900 mb-6 leading-tight tracking-tight">
              Tu Entretenimiento <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                Al Mejor Precio
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Disfruta de tus series, música y películas favoritas sin gastar de más. 
              Activación inmediata y garantía garantizada.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                onClick={scrollToCatalog}
                className="text-lg px-8 py-6 rounded-full bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all hover:-translate-y-1"
              >
                Ver Catálogo <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full border-gray-200 hover:bg-gray-50 text-gray-900 transition-all hover:-translate-y-1">
                <PlayCircle className="mr-2 w-5 h-5 text-gray-500" /> Cómo Funciona
              </Button>
            </div>
          </motion.div>

          {/* Hero Image/Composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 grid grid-cols-2 gap-4">
               <div className="space-y-4 mt-12">
                 <div className="rounded-2xl overflow-hidden shadow-2xl transform rotate-[-3deg] hover:rotate-0 transition-all duration-500 bg-white">
                   <img src={netflixImg} alt="Netflix" className="w-full h-full object-cover" />
                 </div>
                 <div className="rounded-2xl overflow-hidden shadow-2xl transform rotate-[2deg] hover:rotate-0 transition-all duration-500 bg-white">
                   <img src={spotifyImg} alt="Spotify" className="w-full h-full object-cover" />
                 </div>
               </div>
               <div className="space-y-4">
                 <div className="rounded-2xl overflow-hidden shadow-2xl transform rotate-[3deg] hover:rotate-0 transition-all duration-500 bg-white">
                   <img src={disneyImg} alt="Disney" className="w-full h-full object-cover" />
                 </div>
                 <div className="rounded-2xl overflow-hidden shadow-2xl transform rotate-[-2deg] hover:rotate-0 transition-all duration-500 bg-white">
                   <img src={primeImg} alt="Prime" className="w-full h-full object-cover" />
                 </div>
               </div>
            </div>
            {/* Abstract blur behind images */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-blue-500/30 blur-[100px] -z-10 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Stats/Trust Section */}
      <section className="py-12 border-y border-gray-100 bg-white">
        <div className="container mx-auto px-4 flex flex-wrap justify-center md:justify-between gap-8 text-center md:text-left">
          {[
            { number: "+5,000", label: "Clientes Felices", icon: "😊" },
            { number: "100%", label: "Garantía", icon: "🛡️" },
            { number: "24/7", label: "Soporte WhatsApp", icon: "💬" },
            { number: "Flash", label: "Entrega Rápida", icon: "⚡" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-2 rounded-2xl hover:bg-gray-50 transition-colors">
              <span className="text-4xl">{stat.icon}</span>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="py-24 bg-gray-50 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
               <span className="text-primary font-bold tracking-wider uppercase text-sm">Nuestra Selección</span>
              <h2 className="text-3xl md:text-5xl font-bold font-heading text-gray-900 mt-2">
                Catálogo Premium
              </h2>
            </div>
            <Button variant="ghost" className="group text-primary hover:text-primary/80 hover:bg-primary/5">
              Ver todo el catálogo <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Render Products from API */}
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-500">Cargando productos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.title}
                  price={product.price}
                  image={product.image}
                  features={product.features}
                  color={product.color}
                  popular={product.popular}
                  whatsapp={product.whatsapp}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Testimonials />
      
      {/* CTA Section */}
      <section className="py-20 bg-primary overflow-hidden relative">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light" />
         <div className="container mx-auto px-4 text-center relative z-10">
           <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-6">¿Listo para empezar?</h2>
           <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
             Únete a más de 5,000 clientes satisfechos en Guatemala y disfruta del mejor contenido hoy mismo.
           </p>
           <Button 
             size="lg" 
             className="bg-white text-primary hover:bg-gray-100 text-lg px-10 py-6 rounded-full font-bold shadow-xl"
             onClick={() => window.open("https://wa.me/50237871216", "_blank")}
           >
             Contactar por WhatsApp
           </Button>
         </div>
      </section>

      <Footer />
    </div>
  );
}
