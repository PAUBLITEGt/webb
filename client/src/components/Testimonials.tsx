import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

// Import Embla Carousel components
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'

const testimonials = [
  {
    name: "Carlos Méndez",
    role: "Cliente Recurrente",
    content: "Excelente servicio, me entregaron mi cuenta de Netflix en menos de 5 minutos. ¡Súper recomendados!",
    avatar: "CM"
  },
  {
    name: "Ana Lucía",
    role: "Estudiante",
    content: "Los mejores precios de Guatemala. Llevo 6 meses comprando Spotify aquí y nunca he tenido problemas.",
    avatar: "AL"
  },
  {
    name: "Jorge Pineda",
    role: "Usuario Premium",
    content: "La atención al cliente es muy rápida. Tuve una duda y me respondieron al instante por WhatsApp.",
    avatar: "JP"
  },
  {
    name: "Maria González",
    role: "Emprendedora",
    content: "Compré software original y funcionó perfecto. Me ahorré mucho dinero comparado con otras tiendas.",
    avatar: "MG"
  },
  {
    name: "Luis Castillo",
    role: "Gamer",
    content: "Las cuentas de juegos funcionan de maravilla, cero lag y garantía total. Volveré a comprar.",
    avatar: "LC"
  }
];

export function Testimonials() {
  // Initialize Embla Carousel with AutoScroll plugin
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    AutoScroll({ speed: 1, stopOnInteraction: false, stopOnMouseEnter: true })
  ])

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden bg-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Miles de guatemaltecos confían en nosotros para su entretenimiento digital.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="flex-[0_0_100%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0">
                <Card className="h-full bg-white shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8 flex flex-col h-full">
                    <Quote className="w-10 h-10 text-primary/20 mb-6" />
                    <p className="text-gray-600 mb-8 flex-grow italic leading-relaxed text-lg">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-primary/10">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
