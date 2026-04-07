import { useStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, CreditCard, Banknote, X, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { createTransaction } from "@/services/transaction-api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { useShallow } from 'zustand/react/shallow';

const POSCartPanel = ({ onClose }: { onClose?: () => void }) => {
    const { cart, user, updateQuantity, removeFromCart, clearCart, getCartTotal } = useStore(useShallow((state) => ({
        cart: state.cart,
        user: state.user,
        updateQuantity: state.updateQuantity,
        removeFromCart: state.removeFromCart,
        clearCart: state.clearCart,
        getCartTotal: state.getCartTotal,
    })));
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pendingMethod, setPendingMethod] = useState<"CASH" | "QRIS" | null>(null);
    const queryClient = useQueryClient();

    const total = getCartTotal();

    const processCheckout = async (method: "CASH" | "QRIS") => {
        if (!user?.outletId || cart.length === 0) return;

        setIsProcessing(true);
        setIsConfirmOpen(false);
        try {
            await createTransaction({
                outletId: user.outletId,
                paymentMethod: method,
                items: cart.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    priceAtTime: item.product.sellPrice
                }))
            });

            // Success flow
            setIsSuccess(true);
            clearCart();
            queryClient.invalidateQueries({ queryKey: ["stocks"] });
            toast.success(`Transaction recorded via ${method}! 🍵`);
        } catch (error: any) {
            toast.error(error.message || "Checkout failed. Please try again.");
        } finally {
            setIsProcessing(false);
            setPendingMethod(null);
        }
    };

    const handleCheckout = (method: "CASH" | "QRIS") => {
        setPendingMethod(method);
        setIsConfirmOpen(true);
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-xl shadow-green-900/10 border-4 border-white mb-2">
                    <CheckCircle2 size={40} strokeWidth={3} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Order Recorded</h3>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] leading-relaxed max-w-[200px] mx-auto">
                        Your transaction has been securely stored in the matching ecosystem.
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setIsSuccess(false);
                        onClose?.();
                    }}
                    className="w-full bg-gray-900 hover:bg-green-700 text-white font-bold h-12 rounded-2xl uppercase tracking-widest text-[10px]"
                >
                    Prepare New Order
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-green-50 flex items-center justify-center text-green-700 border border-green-100 shadow-sm">
                        <ShoppingCart size={18} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-0.5">
                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-tighter">Your Basket</h2>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">
                            {cart.length} unique items
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="h-10 w-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer outline-hidden"
                >
                    <X size={16} strokeWidth={3} />
                </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length > 0 ? (
                    cart.map((item) => (
                        <div key={item.product.id} className="group flex items-center gap-4 bg-gray-50/50 p-3 rounded-2xl border border-gray-100 ring-1 ring-gray-50/50 transition-all hover:bg-white hover:shadow-md hover:ring-green-100/50">
                            <div className="h-16 w-16 rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-100 group-hover:ring-green-100">
                                <img
                                    src={item.product.imageUrl || "/placeholder-product.png"}
                                    alt={item.product.name}
                                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                />
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                                <h3 className="font-bold text-xs text-gray-900 line-clamp-1">{item.product.name}</h3>
                                <div className="flex items-center justify-between">
                                    <p className="text-[11px] font-black text-green-700">Rp {item.product.sellPrice.toLocaleString()}</p>
                                    <div className="flex items-center gap-2 bg-white rounded-lg p-0.5 ring-1 ring-gray-100">
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                            className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-gray-50 text-gray-400 cursor-pointer outline-hidden"
                                        >
                                            <X size={10} strokeWidth={3} />
                                        </button>
                                        <span className="text-[10px] font-black text-gray-700 min-w-[20px] text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                            className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-green-50 text-green-700 cursor-pointer outline-hidden"
                                        >
                                            <span className="font-black text-[14px]">+</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="h-8 w-8 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors cursor-pointer outline-hidden"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center py-20 text-center gap-4 opacity-40 grayscale-[0.8]">
                        <ShoppingCart size={40} className="text-gray-300" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] max-w-[150px]">Your basket is currently empty</p>
                    </div>
                )}
            </div>

            {/* Footer / Checkout */}
            <div className="p-6 bg-white border-t border-gray-100 space-y-6 shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Subtotal</span>
                        <span className="text-sm font-bold text-gray-600 tracking-tight">Rp {total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-end pt-1">
                        <span className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">Order Total</span>
                        <span className="text-3xl font-black text-green-700 tracking-tighter">Rp {total.toLocaleString()}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button
                        disabled={cart.length === 0 || isProcessing}
                        onClick={() => handleCheckout("CASH")}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-2xl h-14 flex flex-col items-center justify-center gap-1 group transition-all cursor-pointer outline-hidden border border-gray-200/50"
                    >
                        <Banknote size={16} className="text-gray-600 transition-transform group-hover:scale-110" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Pay Cash</span>
                    </Button>
                    <Button
                        disabled={cart.length === 0 || isProcessing}
                        onClick={() => handleCheckout("QRIS")}
                        className="bg-green-700 hover:bg-green-800 text-white rounded-2xl h-14 flex flex-col items-center justify-center gap-1 group transition-all shadow-lg shadow-green-900/10 cursor-pointer outline-hidden"
                    >
                        <CreditCard size={16} className="transition-transform group-hover:scale-110" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/90">Pay QRIS</span>
                    </Button>
                </div>

                {cart.length > 0 && (
                    <button
                        onClick={clearCart}
                        disabled={isProcessing}
                        className="w-full text-center text-[9px] font-black text-muted-foreground hover:text-red-500 uppercase tracking-widest transition-colors cursor-pointer"
                    >
                        Abandon Current Basket
                    </button>
                )}
            </div>

            <ConfirmDialog 
                isOpen={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                title="Selesaikan Transaksi?"
                description={`Apakah Anda yakin ingin memproses transaksi sebesar Rp ${total.toLocaleString()} menggunakan metode ${pendingMethod}?`}
                onConfirm={() => pendingMethod && processCheckout(pendingMethod)}
                isLoading={isProcessing}
                confirmText={pendingMethod === "QRIS" ? "Lanjut QRIS" : "Selesaikan Cash"}
                icon={pendingMethod === "QRIS" ? <CreditCard size={32} /> : <Banknote size={32} />}
            />
        </div>
    );
};

export default POSCartPanel;
