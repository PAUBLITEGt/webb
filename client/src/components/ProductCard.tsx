import { motion } from "framer-motion";
import { Check, Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface ProductProps {
  title: string;
  price: string;
  image: string;
  features: string[];
  color: string;
  popular?: boolean;
  whatsapp?: string;
}

export function ProductCard({ title, price, image, features, color, popular, whatsapp = "37871216" }: ProductProps) {
  const handleBuy = () => {
    // WhatsApp link generator with custom number support
    const message = `Hola! Me interesa comprar ${title} por Q${price}.`;
    const whatsappUrl = `https://wa.me/502${whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >
      <Card className={`relative h-full overflow-hidden border border-border/50 bg-white shadow-lg hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 flex flex-col`}>
        {popular && (
          <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10 shadow-md">
            POPULAR
          </div>
        )}
        
        <div className={`h-2 w-full`} style={{ backgroundColor: color }} />
        
        <CardHeader className="p-0">
          <div className="relative aspect-[4/3] overflow-hidden group bg-gray-100">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop"; // Fallback
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
            <div className="absolute bottom-4 left-4">
              <h3 className="text-2xl font-bold font-heading text-white mb-1 drop-shadow-md">{title}</h3>
              <div className="flex items-center text-yellow-400 gap-1 drop-shadow-md">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 flex-grow">
          <div className="mb-6">
            <span className="text-3xl font-bold text-foreground">Q{price}</span>
            <span className="text-muted-foreground text-sm ml-1">
              {/* Only show /mes if it's a subscription service usually */}
              {(title.toLowerCase().includes("netflix") || title.toLowerCase().includes("spotify")) ? " / mes" : ""}
            </span>
          </div>

          <ul className="space-y-3">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <div className="mt-1 rounded-full bg-primary/10 p-1 shrink-0">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="leading-tight">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="p-6 pt-0 mt-auto">
          <Button 
            onClick={handleBuy}
            className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all duration-300 group font-semibold"
          >
            <ShoppingCart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Comprar Ahora
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
