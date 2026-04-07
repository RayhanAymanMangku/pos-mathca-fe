import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Package, Plus, Minus, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Stock, StockAdjustmentMode } from "@/types/stock";
import type { Outlet } from "@/types/outlet";
import { getAllProduct } from "@/services/product-api";

interface StockAdjustDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    stock: Stock | null;                    
    outletId: string;
    outlets: Outlet[];
    onSubmit: (quantity: number, mode: StockAdjustmentMode, productId?: string, outletId?: string) => void;
    isLoading: boolean;
}

const StockAdjustDialog = ({
    isOpen,
    onOpenChange,
    stock,
    outletId,
    outlets,
    onSubmit,
    isLoading
}: StockAdjustDialogProps) => {
    const isAddMode = stock === null;

    const [quantity, setQuantity] = useState<number>(1);
    const [adjustmentMode, setAdjustmentMode] = useState<StockAdjustmentMode>('ADD');
    const [selectedProductId, setSelectedProductId] = useState<string>("");
    const [selectedOutletId, setSelectedOutletId] = useState<string>(outletId);

    // Reset state when dialog opens/closes or mode changes
    useEffect(() => {
        if (isOpen) {
            setQuantity(1);
            setAdjustmentMode('ADD');
            setSelectedProductId("");
            setSelectedOutletId(outletId);
        }
    }, [isOpen, outletId]);

    // Fetch products only in add mode
    const { data: products = [] } = useQuery({
        queryKey: ['products'],
        queryFn: getAllProduct,
        enabled: isAddMode && isOpen,
    });

    const handleConfirm = () => {
        if (quantity <= 0) return;
        if (isAddMode) {
            if (!selectedProductId || !selectedOutletId) return;
            onSubmit(quantity, adjustmentMode, selectedProductId, selectedOutletId);
        } else {
            onSubmit(quantity, adjustmentMode);
        }
    };

    const currentProjection = stock
        ? adjustmentMode === 'ADD'
            ? stock.quantity + quantity
            : Math.max(0, stock.quantity - quantity)
        : quantity;

    const canConfirm = isAddMode
        ? quantity > 0 && !!selectedProductId && !!selectedOutletId
        : quantity > 0;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] rounded-2xl border-none shadow-2xl bg-white/95 backdrop-blur-xl p-0 overflow-hidden ring-1 ring-white/20">
                <DialogHeader className="pt-8 pb-6 px-10 bg-green-50/50 border-b border-green-100 flex flex-col items-center text-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-green-100/50 flex items-center justify-center text-green-700 ring-1 ring-green-200 shadow-sm relative">
                        <Package strokeWidth={2.5} size={28} />
                        <div className={cn(
                            "absolute -top-1.5 -right-1.5 size-7 rounded-xl flex items-center justify-center text-white border-2 border-white shadow-md transition-colors",
                            adjustmentMode === 'ADD' ? "bg-green-600" : "bg-red-600"
                        )}>
                            {adjustmentMode === 'ADD' ? <Plus size={14} strokeWidth={3} /> : <Minus size={14} strokeWidth={3} />}
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <DialogTitle className="text-xl font-bold tracking-tight text-gray-900 leading-none">
                            {isAddMode ? "Add Stock" : "Adjust Stock"}
                        </DialogTitle>
                        <DialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed px-4">
                            {isAddMode
                                ? "Initialize new stock for a product at a specific outlet."
                                : <>Adjusting <span className="text-green-800 font-bold">{stock?.product?.name || 'this item'}</span>.</>
                            } 🍵
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="p-8 space-y-6 bg-white">
                    {/* Product & Outlet selectors — only in Add mode */}
                    {isAddMode && (
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Product</label>
                                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                                    <SelectTrigger className="h-14 bg-gray-50/50 border-gray-100 rounded-xl focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all outline-hidden w-full">
                                        <SelectValue placeholder="Select a product" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-gray-100 shadow-xl bg-white overflow-hidden">
                                        {products.map((p) => (
                                            <SelectItem key={p.id} value={p.id} className="text-xs font-bold focus:bg-green-50 focus:text-green-900 rounded-lg cursor-pointer py-2.5">
                                                {p.name} <span className="text-gray-400 font-medium ml-1">({p.sku})</span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Outlet</label>
                                <Select value={selectedOutletId} onValueChange={setSelectedOutletId}>
                                    <SelectTrigger className="h-14 w-full bg-gray-50/50 border-gray-100 rounded-xl focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all outline-hidden">
                                        <SelectValue placeholder="Select an outlet" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-gray-100 shadow-xl bg-white overflow-hidden">
                                        {outlets.map((o) => (
                                            <SelectItem key={o.id} value={o.id} className="text-xs font-bold focus:bg-green-50 focus:text-green-900 rounded-lg cursor-pointer py-2.5">
                                                {o.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {/* Toggle */}
                    <div className="flex p-1 bg-gray-100 rounded-xl ring-1 ring-gray-100/50">
                        <button
                            type="button"
                            onClick={() => setAdjustmentMode('ADD')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200 outline-hidden cursor-pointer",
                                adjustmentMode === 'ADD' ? "bg-white text-green-700 shadow-sm ring-1 ring-gray-200/50" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <Plus size={13} strokeWidth={3} />
                            Add Stock
                        </button>
                        <button
                            type="button"
                            onClick={() => setAdjustmentMode('SUBTRACT')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200 outline-hidden cursor-pointer",
                                adjustmentMode === 'SUBTRACT' ? "bg-white text-red-600 shadow-sm ring-1 ring-gray-200/50" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <Minus size={13} strokeWidth={3} />
                            Reduce Stock
                        </button>
                    </div>

                    {/* Quantity Input */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Quantity</label>
                        <div className="relative group/input">
                            <Input
                                type="number"
                                min={1}
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                className="h-16 text-3xl font-black text-center bg-gray-50/30 border-gray-100 rounded-xl focus-visible:ring-2 focus-visible:ring-green-600/20 focus-visible:border-green-600 transition-all outline-hidden"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-40 group-hover/input:opacity-100 transition-opacity">
                                <button type="button" onClick={() => setQuantity(q => q + 1)} className="p-1 hover:bg-green-50 rounded-lg transition-all text-gray-400 hover:text-green-600"><Plus size={14} /></button>
                                <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-1 hover:bg-red-50 rounded-lg transition-all text-gray-400 hover:text-red-500"><Minus size={14} /></button>
                            </div>
                        </div>
                        {!isAddMode && (
                            <p className="text-[10px] text-center font-bold text-muted-foreground uppercase tracking-widest">
                                New Total: <span className="text-gray-900 font-black">{currentProjection}</span> units
                            </p>
                        )}
                    </div>
                </div>

                <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-gray-900 hover:bg-gray-100 uppercase tracking-widest transition-all cursor-pointer outline-hidden"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isLoading || !canConfirm}
                        className={cn(
                            "flex-1 h-12 flex items-center justify-center gap-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 shadow-md cursor-pointer outline-hidden active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed",
                            adjustmentMode === 'ADD' ? "bg-green-800 hover:bg-green-700 text-white shadow-green-900/20" : "bg-red-700 hover:bg-red-600 text-white shadow-red-900/20"
                        )}
                    >
                        {isLoading ? <Spinner className="size-4" /> : (
                            <>
                                Save Changes
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default StockAdjustDialog;
