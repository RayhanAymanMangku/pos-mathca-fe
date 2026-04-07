import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    onConfirm: () => void;
    isLoading?: boolean;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'primary';
    icon?: React.ReactNode;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onOpenChange,
    title,
    description,
    onConfirm,
    isLoading = false,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = 'primary',
    icon
}) => {
    const isDanger = variant === 'danger';

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] rounded-2xl border-none shadow-2xl bg-white/95 backdrop-blur-xl p-0 overflow-hidden ring-1 ring-white/20">
                <div className="flex flex-col items-center text-center p-8 pt-10">
                    {/* Header Icon */}
                    {icon && (
                        <div className={cn(
                            "h-20 w-20 rounded-xl flex items-center justify-center mb-6 ring-1 shadow-sm transition-transform duration-500 hover:scale-110",
                            isDanger
                                ? "bg-red-50 text-red-600 ring-red-100"
                                : "bg-green-50 text-green-700 ring-green-100"
                        )}>
                            {icon}
                        </div>
                    )}

                    <DialogHeader className="space-y-3 mb-8 w-full">
                        <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900 leading-none">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed font-sans">
                            {description}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col w-full gap-3">
                        <Button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={cn(
                                "w-full h-12 rounded-xl font-bold uppercase tracking-widest transition-all duration-200 shadow-md cursor-pointer outline-hidden",
                                isDanger
                                    ? "bg-red-600 hover:bg-red-500 text-white shadow-red-900/10"
                                    : "bg-green-800 hover:bg-green-700 text-white shadow-green-900/10"
                            )}
                        >
                            {isLoading ? <Spinner className="size-4 mr-2" /> : confirmText}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                            className="w-full h-12 rounded-2xl font-bold text-gray-400 hover:text-gray-900 hover:bg-gray-100/50 transition-all uppercase tracking-widest text-[10px] cursor-pointer outline-hidden"
                        >
                            {cancelText}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDialog;
