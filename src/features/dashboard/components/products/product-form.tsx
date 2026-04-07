import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductFormValues } from '../../validators/product-schema';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from '@/services/category-api';

interface ProductFormProps {
  onSubmit: (values: ProductFormValues) => void;
  isLoading: boolean;
  initialValues?: ProductFormValues;
  buttonText: string;
  categories: Category[];
}

const ProductForm = ({
  onSubmit,
  isLoading,
  initialValues,
  buttonText,
  categories
}: ProductFormProps) => {

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialValues || {
      name: '',
      sku: '',
      basePrice: 0,
      sellPrice: 0,
      imageUrl: '',
      categoryId: '',
    }
  });


  const selectedCategory = watch('categoryId');

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-5 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 leading-none">Product Name</label>
            <Input
              {...register('name')}
              placeholder="e.g. Matcha Classic"
              className="h-11 bg-gray-50/50 border-gray-100 rounded-xl focus-visible:ring-2 focus-visible:ring-green-600/20 focus-visible:border-green-600 transition-all duration-200 outline-hidden"
            />
            {errors.name && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 leading-none">SKU / Code</label>
            <Input
              {...register('sku')}
              placeholder="MTCH-001"
              className="h-11 bg-gray-50/50 border-gray-100 rounded-xl focus-visible:ring-2 focus-visible:ring-green-600/20 focus-visible:border-green-600 transition-all duration-200 outline-hidden"
            />
            {errors.sku && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{errors.sku.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 leading-none">Category</label>
            <Select
              onValueChange={(value) => setValue('categoryId', value)}
              value={selectedCategory}
            >
              <SelectTrigger className="h-11 bg-gray-50/50 border-gray-100 rounded-xl focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all duration-200 outline-hidden">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100 shadow-xl overflow-hidden bg-white">
                {categories.length === 0 ? (
                  <div className="p-4 text-center text-xs text-muted-foreground italic">No categories found.🍵</div>
                ) : (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id} className="text-xs font-bold focus:bg-green-50 focus:text-green-900 rounded-lg cursor-pointer py-2.5">
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.categoryId && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{errors.categoryId.message}</p>}
          </div>
        </div>

        {/* Pricing & Image */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 leading-none">Base Price</label>
            <Input
              {...register('basePrice')}
              type="number"
              placeholder="0"
              className="h-11 bg-gray-50/50 border-gray-100 rounded-xl focus-visible:ring-2 focus-visible:ring-green-600/20 focus-visible:border-green-600 transition-all duration-200 outline-hidden"
            />
            {errors.basePrice && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{errors.basePrice.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 leading-none">Sell Price</label>
            <Input
              {...register('sellPrice')}
              type="number"
              placeholder="0"
              className="h-11 bg-gray-50/50 border-gray-100 rounded-xl focus-visible:ring-2 focus-visible:ring-green-600/20 focus-visible:border-green-600 transition-all duration-200 outline-hidden"
            />
            {errors.sellPrice && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{errors.sellPrice.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 leading-none">Image URL</label>
            <Input
              {...register('imageUrl')}
              placeholder="https://example.com/image.png"
              className="h-11 bg-gray-50/50 border-gray-100 rounded-xl focus-visible:ring-2 focus-visible:ring-green-600/20 focus-visible:border-green-600 transition-all duration-200 outline-hidden"
            />
            {errors.imageUrl && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{errors.imageUrl.message}</p>}
          </div>
        </div>
      </div>

      <div className="pt-6">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-green-800 hover:bg-green-700 text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-green-900/10 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer outline-hidden"
        >
          {isLoading ? <Spinner className="size-5 mr-3" /> : buttonText}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
