import POSSection from "@/features/dashboard/components/pos/pos-section";
import POSCartPanel from "@/features/dashboard/components/pos/pos-cart-panel";
import { Sheet, SheetContent, SheetDescription, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import { useStore } from "@/store/store";
import { useState } from "react";

const POSPage = () => {
    const { cart } = useStore();
    const [isOpen, setIsOpen] = useState(false);

    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <div className=" pb-24 lg:pb-0 animate-in fade-in duration-500">
            {/* Main Product Grid Area */}
            <POSSection />

            {/* Floating Mobile Cart Button */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <button className="h-16 px-8 rounded-full bg-gray-900 text-white shadow-2xl flex items-center gap-4 border-4 border-white active:scale-95 transition-all group overflow-hidden">
                            <div className="relative">
                                <ShoppingCart size={20} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-3 -right-3 h-5 w-5 bg-green-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-gray-900 animate-in zoom-in duration-300">
                                        {cartItemCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">View Basket</span>
                            <div className="h-1 w-1 rounded-full bg-white/30" />
                            <span className="text-xs font-black text-green-400">
                                Rp {cart.reduce((t, i) => t + (i.product.sellPrice * i.quantity), 0).toLocaleString()}
                            </span>
                        </button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="p-0 border-none h-[85vh] rounded-t-[40px] shadow-2xl bg-white overflow-hidden">
                        <SheetTitle className="sr-only">POS Shopping Cart</SheetTitle>
                        <SheetDescription className="sr-only">Review your products and proceed to payment.</SheetDescription>
                        <POSCartPanel onClose={() => setIsOpen(false)} />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Side Cart (Always Visible or Triggered) */}
            <div className="hidden lg:block fixed top-[104px] bottom-6 right-6 w-96 transform translate-x-4 opacity-0 animate-in slide-in-from-right fade-in duration-700 fill-mode-forwards delay-300">
                <div className="h-full rounded-[40px] overflow-hidden border border-gray-100 shadow-2xl ring-1 ring-gray-50/50 bg-white">
                    <POSCartPanel />
                </div>
            </div>

            {/* Spacing for Desktop Offset */}
            <div className="hidden lg:block w-96 ml-auto" />
        </div>
    );
};

export default POSPage;
