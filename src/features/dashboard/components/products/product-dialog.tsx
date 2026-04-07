import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ProductForm from './product-form';
import type { ProductFormValues } from '../../validators/product-schema';
import { Package } from 'lucide-react';
import type { Category } from '@/services/category-api';

interface ProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onSubmit: (values: ProductFormValues) => void;
  isLoading: boolean;
  initialValues?: ProductFormValues;
  buttonText: string;
  categories: Category[];
}

const ProductDialog = ({
  isOpen,
  onOpenChange,
  title,
  description,
  onSubmit,
  isLoading,
  initialValues,
  buttonText,
  categories
}: ProductDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] rounded-2xl border-none shadow-2xl bg-white/95 backdrop-blur-xl p-0 overflow-hidden ring-1 ring-white/20">
        <DialogHeader className="pt-8 pb-6 px-10 bg-green-50/50 border-b border-green-100 flex flex-col items-center text-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-green-100/50 flex items-center justify-center text-green-700 ring-1 ring-green-200 shadow-sm">
            <Package strokeWidth={2.5} size={28} />
          </div>
          <div className="space-y-1.5">
            <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900 leading-none">{title}</DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed font-sans">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="p-10 bg-white">
          <ProductForm
            onSubmit={onSubmit}
            isLoading={isLoading}
            initialValues={initialValues}
            buttonText={buttonText}
            categories={categories}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
