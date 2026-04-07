import { useState } from 'react';
import ProductTable from './product-table';
import ProductDialog from './product-dialog';
import CategoryDialog from './category-dialog';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { Plus, Tag, RefreshCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
    useQuery, 
    useMutation, 
    useQueryClient 
} from '@tanstack/react-query';
import { 
    getAllProduct, 
    addProduct, 
    updateProduct, 
    deleteProduct 
} from '@/services/product-api';
import { 
    getAllCategories, 
    addCategory 
} from '@/services/category-api';
import type { Product } from '@/types/product';
import type { ProductFormValues } from '../../validators/product-schema';
import type { CategoryFormValues } from '../../validators/category-schema';
import { useResourceDialog } from '@/hooks/use-resource-dialog';

const ProductSection = () => {
    const queryClient = useQueryClient();
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    
    const {
        isOpen: isProductDialogOpen,
        isConfirmOpen,
        selectedItem: selectedProduct,
        itemToDelete: productToDelete,
        handleAdd: handleAddProduct,
        handleEdit: handleEditProduct,
        handleDeleteTrigger,
        closeDialog: closeProductDialog,
        closeConfirm: closeConfirmDialog,
    } = useResourceDialog<Product>();

    const { 
        data: products = [], 
        isLoading: isProductsLoading, 
        isError: isProductsError, 
        refetch: refetchProducts 
    } = useQuery({
        queryKey: ['products'],
        queryFn: getAllProduct,
    });

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: getAllCategories,
    });

    const addProductMutation = useMutation({
        mutationFn: addProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success("Product added to inventory! 🍵");
            closeProductDialog();
        },
        onError: (error: any) => toast.error(error.message || "Failed to add product"),
    });

    const updateProductMutation = useMutation({
        mutationFn: ({ id, values }: { id: string, values: ProductFormValues }) => updateProduct(id, values as any),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success("Product details updated! 🍵");
            closeProductDialog();
        },
        onError: (error: any) => toast.error(error.message || "Failed to update product"),
    });

    const deleteProductMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success("Product removed from inventory");
            closeConfirmDialog();
        },
        onError: (error: any) => toast.error(error.message || "Failed to delete product"),
    });

    const addCategoryMutation = useMutation({
        mutationFn: (values: CategoryFormValues) => addCategory({ id: '', name: values.name }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success("New category created! 🍵");
            setIsCategoryDialogOpen(false);
        },
        onError: (error: any) => toast.error(error.message || "Failed to add category"),
    });

    const handleConfirmDelete = () => {
        if (productToDelete) deleteProductMutation.mutate(productToDelete);
    };

    const handleProductSubmit = (values: ProductFormValues) => {
        if (selectedProduct) {
            updateProductMutation.mutate({ id: selectedProduct.id, values });
        } else {
            addProductMutation.mutate(values as any);
        }
    };

    if (isProductsError) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-red-50/50 rounded-2xl border border-red-100 ring-1 ring-red-50 text-center">
                <p className="text-red-700 font-bold mb-4 italic leading-tight">Oops! Failed to load products inventory.</p>
                <Button onClick={() => refetchProducts()} variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 rounded-xl px-6 font-bold uppercase tracking-widest text-xs outline-hidden cursor-pointer">
                    <RefreshCcw size={14} className="mr-2" /> Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 p-6 rounded-2xl border border-gray-100 ring-1 ring-gray-50/50 shadow-xs backdrop-blur-sm">
                <div className="space-y-1.5">
                    <h2 className="text-xl font-bold tracking-tight text-gray-900 leading-none">Product Inventory</h2>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest leading-none">
                        Track and manage your products, SKUs, and categories.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        onClick={() => setIsCategoryDialogOpen(true)}
                        variant="ghost"
                        className="text-green-800 hover:bg-green-50 rounded-xl h-10 px-4 font-bold text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer outline-hidden group border border-green-100/50"
                    >
                        <Tag className="mr-2.5 h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
                        Add Category
                    </Button>
                    <Button 
                        onClick={handleAddProduct}
                        disabled={isProductsLoading}
                        className="bg-green-800 hover:bg-green-700 text-white rounded-xl h-10 px-4 font-bold text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer shadow-md shadow-green-900/10 outline-hidden"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </div>
            </div>

            <div className={isProductsLoading ? "opacity-60 pointer-events-none transition-opacity duration-300" : "transition-opacity duration-300"}>
                <ProductTable 
                    products={products} 
                    categories={categories}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteTrigger}
                />
            </div>

            <ProductDialog 
                isOpen={isProductDialogOpen}
                onOpenChange={closeProductDialog}
                title={selectedProduct ? "Edit Product" : "Add New Product"}
                description={selectedProduct ? "Update your product details and pricing." : "Introduce a new item to your store inventory. 🍵"}
                onSubmit={handleProductSubmit}
                isLoading={addProductMutation.isPending || updateProductMutation.isPending}
                categories={categories}
                buttonText={selectedProduct ? "Update Product" : "Save Product"}
                initialValues={selectedProduct ? {
                    name: selectedProduct.name,
                    sku: selectedProduct.sku,
                    basePrice: selectedProduct.basePrice,
                    sellPrice: selectedProduct.sellPrice,
                    imageUrl: selectedProduct.imageUrl,
                    categoryId: selectedProduct.categoryId
                } : undefined}
            />

            <CategoryDialog 
                isOpen={isCategoryDialogOpen}
                onOpenChange={setIsCategoryDialogOpen}
                onSubmit={(v) => addCategoryMutation.mutate(v)}
                isLoading={addCategoryMutation.isPending}
            />

            <ConfirmDialog 
                isOpen={isConfirmOpen}
                onOpenChange={closeConfirmDialog}
                title="Remove Product?"
                description="This action cannot be undone. This product will be permanently removed from your inventory tracking."
                onConfirm={handleConfirmDelete}
                isLoading={deleteProductMutation.isPending}
                confirmText="Remove Item"
                variant="danger"
                icon={<Trash2 size={32} />}
            />
        </div>
    );
};

export default ProductSection;
