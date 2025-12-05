import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductUploadForm } from "@/components/ProductUploadForm";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Package, BarChart3, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Product, InsertProduct } from "@shared/schema";
import { useState } from "react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (product: InsertProduct) => {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Failed to create product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Producto agregado",
        description: "El producto ha sido agregado exitosamente.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, product }: { id: number; product: Partial<InsertProduct> }) => {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Failed to update product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setEditingProduct(null);
      toast({
        title: "Producto actualizado",
        description: "El producto ha sido actualizado exitosamente.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado del catálogo.",
        variant: "destructive",
      });
    },
  });

  const handleAddProduct = (newProduct: InsertProduct) => {
    createMutation.mutate(newProduct);
  };

  const handleUpdateProduct = (updatedProduct: InsertProduct) => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, product: updatedProduct });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      deleteMutation.mutate(id);
    }
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const filteredProducts = activeTab === "all" 
    ? products 
    : products.filter((p) => p.category === activeTab);

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold font-heading text-foreground">Panel de Administración</h1>
            <p className="text-muted-foreground mt-2">Gestiona tu catálogo de productos digitales</p>
          </div>
          <ProductUploadForm 
            onAddProduct={handleAddProduct} 
            existingProduct={editingProduct} 
            onUpdateProduct={handleUpdateProduct}
            categories={categories}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-white shadow-sm border-border/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Productos</p>
                <h3 className="text-2xl font-bold">{products.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm border-border/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-full">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Categorías Activas</p>
                <h3 className="text-2xl font-bold">{categories.length - 1}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-border/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clientes Activos</p>
                <h3 className="text-2xl font-bold">128</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-lg border-border/50">
          <CardHeader className="border-b border-border/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <CardTitle>Inventario</CardTitle>
              
              <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
                <TabsList className="flex flex-wrap h-auto gap-1 bg-gray-100 p-1">
                  {categories.map(cat => (
                     <TabsTrigger key={cat} value={cat} className="capitalize">{cat === 'all' ? 'Todos' : cat}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-gray-500">Cargando productos...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">WhatsApp</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden border border-gray-200 bg-gray-100">
                              <img 
                                className="h-10 w-10 object-cover" 
                                src={product.image} 
                                alt="" 
                                onError={(e) => {
                                  e.currentTarget.src = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop";
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.title}</div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: product.color }}></span>
                                Color Tag
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Q{product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.whatsapp || "37871216"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-blue-600 hover:bg-blue-50"
                            onClick={() => startEdit(product)}
                            data-testid={`button-edit-${product.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-600 hover:bg-red-50" 
                            onClick={() => handleDelete(product.id)}
                            data-testid={`button-delete-${product.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          No hay productos en esta categoría.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
