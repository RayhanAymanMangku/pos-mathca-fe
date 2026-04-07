import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, type CategoryFormValues } from '../../validators/category-schema';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Tag } from 'lucide-react';

interface CategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CategoryFormValues) => void;
  isLoading: boolean;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
  });

  const onFormSubmit = (values: CategoryFormValues) => {
    onSubmit(values);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] rounded-2xl border-none shadow-2xl bg-white/95 backdrop-blur-xl p-0 overflow-hidden ring-1 ring-white/20">
        <DialogHeader className="pt-8 pb-6 px-8 bg-green-50/50 border-b border-green-100 flex flex-col items-center text-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-green-100/50 flex items-center justify-center text-green-700 ring-1 ring-green-200 shadow-sm">
            <Tag strokeWidth={2.5} size={28} />
          </div>
          <div className="space-y-1.5">
            <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900 leading-none">Add Category</DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
              Create a new category to organize your products effectively. 🍵
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-8 space-y-6 bg-white">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
              Category Name
            </label>
            <Input
              {...register('name')}
              placeholder="e.g. Matcha Latte, Dessert, etc."
              className="h-12 bg-gray-50/50 border-gray-100 rounded-xl focus-visible:ring-2 focus-visible:ring-green-600/20 focus-visible:border-green-600 transition-all duration-200 outline-hidden"
            />
            {errors.name && (
              <p className="text-xs font-bold text-red-500 mt-1 ml-1">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-green-800 hover:bg-green-700 text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-green-900/10 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer outline-hidden"
            >
              {isLoading ? <Spinner className="size-4 mr-2" /> : "Save Category"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="w-full h-11 rounded-xl font-bold text-gray-400 hover:text-gray-900 transition-all uppercase tracking-widest text-[10px] cursor-pointer outline-hidden"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
