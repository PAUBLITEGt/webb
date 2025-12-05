import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Plus, Upload, X, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const productSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  price: z.string().min(1, "Ingresa un precio"),
  category: z.string().min(1, "Selecciona una categoría o crea una nueva"),
  newCategory: z.string().optional(),
  description: z.string().optional(),
  color: z.string().min(1, "Selecciona un color"),
  imageUrl: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  whatsapp: z.string().min(8, "Ingresa un número de WhatsApp válido"),
});

interface ProductUploadFormProps {
  onAddProduct: (product: any) => void;
  existingProduct?: any;
  onUpdateProduct?: (product: any) => void;
  categories: string[];
}

export function ProductUploadForm({ onAddProduct, existingProduct, onUpdateProduct, categories }: ProductUploadFormProps) {
  const [open, setOpen] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: "",
      category: "",
      newCategory: "",
      description: "",
      color: "#6366f1",
      imageUrl: "",
      whatsapp: "37871216", // Default whatsapp
    },
  });

  // Reset form when existingProduct changes or dialog opens
  useEffect(() => {
    if (existingProduct) {
      form.reset({
        name: existingProduct.title,
        price: existingProduct.price,
        category: existingProduct.category,
        description: existingProduct.features.join("\n"),
        color: existingProduct.color || "#6366f1",
        imageUrl: existingProduct.image,
        whatsapp: existingProduct.whatsapp || "37871216",
      });
      setOpen(true);
    } else {
      form.reset({
        name: "",
        price: "",
        category: "",
        newCategory: "",
        description: "",
        color: "#6366f1",
        imageUrl: "",
        whatsapp: "37871216",
      });
    }
  }, [existingProduct, form]);

  // Watch the image URL to preview it
  const imageUrl = form.watch("imageUrl");
  const selectedCategory = form.watch("category");

  // Handle category change to detect "new"
  useEffect(() => {
    if (selectedCategory === "new") {
      setIsNewCategory(true);
    } else {
      setIsNewCategory(false);
    }
  }, [selectedCategory]);


  function onSubmit(values: z.infer<typeof productSchema>) {
    const finalImage = values.imageUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop";
    const finalCategory = values.category === "new" ? values.newCategory : values.category;

    const productData = {
      title: values.name,
      price: values.price,
      category: finalCategory,
      image: finalImage,
      color: values.color,
      features: values.description ? values.description.split("\n").filter(f => f.trim()) : ["Entrega inmediata", "Garantía total"],
      whatsapp: values.whatsapp,
      popular: existingProduct ? existingProduct.popular : false
    };

    if (existingProduct && onUpdateProduct) {
      onUpdateProduct(productData);
    } else {
      onAddProduct(productData);
    }
    
    setOpen(false);
    if (!existingProduct) form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val && existingProduct) {
         // Clear selection when closing edit modal
         // This needs to be handled by parent really, but for now we rely on parent state
      }
    }}>
      {!existingProduct && (
        <DialogTrigger asChild>
          <Button className="gap-2 bg-primary text-white shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" /> Agregar Nuevo Producto
          </Button>
        </DialogTrigger>
      )}
      
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold text-foreground">
            {existingProduct ? "Editar Producto" : "Agregar Producto"}
          </DialogTitle>
          <DialogDescription>
            {existingProduct ? "Modifica los detalles del producto existente." : "Sube un nuevo producto. Puedes crear nuevas categorías."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Producto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Camisa Negra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio (Q)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="35" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        {categories.filter(c => c !== 'all').map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                        <SelectItem value="Streaming">Streaming</SelectItem>
                        <SelectItem value="Música">Música</SelectItem>
                        <SelectItem value="Ropa">Ropa</SelectItem>
                        <SelectItem value="new" className="text-primary font-bold">+ Crear Nueva Categoría</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp de Contacto</FormLabel>
                    <FormControl>
                      <Input placeholder="37871216" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isNewCategory && (
               <FormField
                control={form.control}
                name="newCategory"
                render={({ field }) => (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-blue-50 p-4 rounded-lg border border-blue-100"
                  >
                    <FormItem>
                      <FormLabel className="text-blue-700">Nombre de la Nueva Categoría</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. Zapatos, Accesorios, Videojuegos..." {...field} className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </motion.div>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Distintivo</FormLabel>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {["#E50914", "#1DB954", "#113CCF", "#00A8E1", "#6366f1", "#f59e0b", "#ec4899", "#10b981", "#000000"].map((c) => (
                      <div
                        key={c}
                        className={`w-8 h-8 rounded-full cursor-pointer ring-2 ring-offset-2 transition-all ${field.value === c ? 'ring-primary scale-110' : 'ring-transparent'}`}
                        style={{ backgroundColor: c }}
                        onClick={() => field.onChange(c)}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de Imagen o GIF</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input className="pl-9" placeholder="https://ejemplo.com/imagen.gif" {...field} />
                    </div>
                  </FormControl>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Pega el enlace directo a la imagen o GIF.
                  </div>
                  {imageUrl && (
                    <div className="mt-2 relative rounded-md overflow-hidden border border-border h-40 w-full bg-gray-50 flex items-center justify-center">
                      <img src={imageUrl} alt="Preview" className="h-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Características (una por línea)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Talla M&#10;Algodón 100%&#10;Envío Gratis" 
                      className="resize-none min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white border-t border-gray-100 p-4 -mx-6 -mb-6">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-primary text-white">{existingProduct ? "Actualizar" : "Guardar"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
