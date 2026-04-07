import type { Product } from '@/types/product';
import type { Category } from '@/services/category-api';
import { MoreHorizontal, Edit, Trash2, Package } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { formatCurrency } from '@/lib/utils';

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductTable = ({ 
  products, 
  categories,
  onEdit, 
  onDelete 
}: ProductTableProps) => {
  const getCategoryName = (id: string) => {
    return categories.find(c => c.id === id)?.name || 'Unknown';
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border-none bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100 backdrop-blur-sm">
              <th className="px-6 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Inventory Product</th>
              <th className="px-6 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">SKU CODE</th>
              <th className="px-6 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap text-center">Category</th>
              <th className="px-6 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap text-right">Pricing (Sell)</th>
              <th className="px-6 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-3 bg-gray-50 rounded-2xl ring-1 ring-gray-100">
                        <Package className="size-6 text-gray-300" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium italic">
                        No products found in your inventory. Let's add some! 🍵
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="group hover:bg-green-50/20 transition-all duration-200">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="h-11 w-11 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <Package className="size-5 text-gray-300" />
                        )}
                      </div>
                      <span className="text-[13px] font-bold text-gray-900 group-hover:text-green-800 transition-colors leading-none">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <code className="text-[10px] font-bold bg-gray-50/80 px-2.5 py-1 rounded-lg text-gray-500 uppercase tracking-tight ring-1 ring-gray-100">
                      {product.sku}
                    </code>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    <span className="text-[10px] font-bold text-green-700 bg-green-50/80 px-3 py-1.5 rounded-xl uppercase tracking-widest ring-1 ring-green-100/50">
                      {getCategoryName(product.categoryId)}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[13px] font-bold text-gray-900 underline decoration-green-300/50 decoration-2 underline-offset-4 decoration-skip-ink">
                        {formatCurrency(product.sellPrice)}
                      </span>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-80">
                        Cost: {formatCurrency(product.basePrice)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-green-100/50 hover:text-green-800 transition-all cursor-pointer outline-hidden border border-transparent hover:border-green-100">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-1.5 border-none shadow-xl rounded-2xl ring-1 ring-gray-100 bg-white/95 backdrop-blur-lg" align="end">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-[11px] font-bold text-gray-700 hover:text-green-700 hover:bg-green-50/80 rounded-xl h-10 px-3 transition-all cursor-pointer outline-hidden group"
                          onClick={() => onEdit(product)}
                        >
                          <Edit className="mr-2.5 h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                          Edit Details
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-[11px] font-bold text-red-600 hover:text-red-700 hover:bg-red-50/80 rounded-xl h-10 px-3 transition-all cursor-pointer outline-hidden group"
                          onClick={() => onDelete(product.id)}
                        >
                          <Trash2 className="mr-2.5 h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                          Remove Item
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
