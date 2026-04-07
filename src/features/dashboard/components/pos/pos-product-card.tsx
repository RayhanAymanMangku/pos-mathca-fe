import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

interface POSProductCardProps {
    product: Product;
    stock: number;
    quantityInCart: number;
    onAdd: (product: Product) => void;
    onUpdateQuantity: (productId: string, quantity: number) => void;
}

const POSProductCard = ({ 
    product, 
    stock, 
    quantityInCart, 
    onAdd, 
    onUpdateQuantity 
}: POSProductCardProps) => {
    const isOutOfStock = stock <= 0;
    const isLowStock = stock < 10 && stock > 0;

    return (
        <Card className={cn(
            "group overflow-hidden border-none ring-1 ring-gray-100 shadow-sm transition-all hover:shadow-md h-full flex flex-col py-0",
            isOutOfStock && "opacity-75 grayscale-[0.5]"
        )}>
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img 
                    src={product.imageUrl || "/placeholder-product.png"} 
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {isOutOfStock ? (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white border-2 border-white/30 px-3 py-1 rounded-full">
                            Sold Out
                        </span>
                    </div>
                ) : isLowStock && (
                    <div className="absolute top-3 left-3">
                        <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse shadow-lg shadow-red-500/20">
                            {stock} Ready
                        </span>
                    </div>
                )}

                <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm border border-white/20">
                        {product.sku}
                    </span>
                </div>
            </div>

            <CardContent className="p-4 flex flex-col flex-1 gap-3">
                <div className="space-y-1">
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-green-700 transition-colors">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-black text-green-700">
                            Rp {product.sellPrice.toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="mt-auto pt-2">
                    {quantityInCart > 0 ? (
                        <div className="flex items-center justify-between bg-green-50 rounded-xl p-1 border border-green-100">
                            <button
                                onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
                                className="h-8 w-8 flex items-center justify-center rounded-lg bg-white text-green-700 shadow-sm hover:bg-green-100 transition-colors cursor-pointer outline-hidden"
                            >
                                <Minus size={14} strokeWidth={3} />
                            </button>
                            <span className="font-black text-green-800 text-xs px-2">
                                {quantityInCart}
                            </span>
                            <button
                                onClick={() => onUpdateQuantity(product.id, quantityInCart + 1)}
                                disabled={quantityInCart >= stock}
                                className="h-8 w-8 flex items-center justify-center rounded-lg bg-green-700 text-white shadow-sm hover:bg-green-800 transition-colors cursor-pointer disabled:opacity-40 outline-hidden"
                            >
                                <Plus size={14} strokeWidth={3} />
                            </button>
                        </div>
                    ) : (
                        <Button
                            onClick={() => onAdd(product)}
                            disabled={isOutOfStock}
                            className={cn(
                                "w-full rounded-xl h-10 font-bold text-[10px] uppercase tracking-widest transition-all",
                                isOutOfStock 
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                    : "bg-gray-900 text-white hover:bg-green-700 shadow-md shadow-gray-900/10 hover:shadow-green-900/10 cursor-pointer"
                            )}
                        >
                            <ShoppingCart className="mr-2 h-3.5 w-3.5" strokeWidth={3} />
                            Acquire Now
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default POSProductCard;
