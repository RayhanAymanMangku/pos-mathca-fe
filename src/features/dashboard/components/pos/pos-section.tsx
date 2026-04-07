import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllProduct } from "@/services/product-api";
import { getStocksByOutlet } from "@/services/stock-api";
import { useStore } from "@/store/store";
import POSProductCard from "./pos-product-card";
import { Search, Package, MapPin } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { useShallow } from "zustand/shallow";

const POSSection = () => {
    const { user, cart, addToCart, updateQuantity, outlet } = useStore(useShallow((state) => ({
        user: state.user,
        cart: state.cart,
        addToCart: state.addToCart,
        updateQuantity: state.updateQuantity,
        outlet: state.outlet,
    })));
    const [searchQuery, setSearchQuery] = useState("");
    const outletId = user?.outletId;

    const { data: products = [], isLoading: isProductsLoading } = useQuery({
        queryKey: ["products"],
        queryFn: getAllProduct,
    });

    const { data: stocks = [], isLoading: isStocksLoading } = useQuery({
        queryKey: ["stocks", outletId],
        queryFn: () => getStocksByOutlet(outletId!),
        enabled: !!outletId,
    });

    // Join logic: Product + Its Stock in this outlet
    const enrichedProducts = useMemo(() => {
        return products.map(product => {
            const stockItem = stocks.find(s => s.productId === product.id);
            return {
                ...product,
                stock: stockItem?.quantity ?? 0
            };
        });
    }, [products, stocks]);

    const filteredProducts = useMemo(() => {
        return enrichedProducts.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [enrichedProducts, searchQuery]);

    const isLoading = isProductsLoading || isStocksLoading;

    return (
        <div className="space-y-6">
            {/* Header POS */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white/50 p-6 rounded-3xl border border-gray-100 ring-1 ring-gray-50/50 shadow-xs backdrop-blur-sm">
                <div className="space-y-1">
                    <h2 className="text-xl font-black tracking-tight text-gray-900 leading-tight">Order Experience</h2>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-lg border border-green-100">
                            <MapPin size={10} className="text-green-600" />
                            <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">{outlet?.name || "Local Branch"}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] leading-none opacity-60">
                            serving matcha lovers today. 🍵
                        </p>
                    </div>
                </div>

                <label className="relative w-full lg:w-96 group cursor-text">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-green-600">
                        <Search size={16} strokeWidth={2.5} className="text-gray-400 group-focus-within:text-green-600 transition-colors" />
                    </div>
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search product or SKU..."
                        className="pl-12 h-12 bg-white border-gray-100 rounded-2xl focus:ring-4 focus:ring-green-600/5 focus:border-green-600 transition-all font-bold text-xs uppercase tracking-widest shadow-xs placeholder:text-gray-400"
                    />
                </label>
            </div>

            {/* Product Grid */}
            <div className="min-h-[500px]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Spinner className="size-8 text-green-700" />
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest animate-pulse">Syncing stock data...</p>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredProducts.map((p) => {
                            const cartItem = cart.find(item => item.product.id === p.id);
                            return (
                                <POSProductCard
                                    key={p.id}
                                    product={p}
                                    stock={p.stock}
                                    quantityInCart={cartItem?.quantity || 0}
                                    onAdd={addToCart}
                                    onUpdateQuantity={updateQuantity}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-40 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 gap-6">
                        <div className="h-16 w-16 rounded-3xl bg-white flex items-center justify-center text-gray-300 shadow-sm border border-gray-100">
                            <Package size={32} />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-sm font-black text-gray-900 uppercase tracking-wider">No products available</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest opacity-60">Adjust your search or check other categories.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default POSSection;
