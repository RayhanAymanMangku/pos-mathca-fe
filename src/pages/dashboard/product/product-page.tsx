import HeaderSection from '@/features/dashboard/components/sections/header-section';
import ProductSection from '@/features/dashboard/components/products/product-section';

const ProductPage = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <HeaderSection
                title="Products Management"
                description="View and manage your store's product catalog and categories."
            />

            <div className="pb-10">
                <ProductSection />
            </div>
        </div>
    );
};

export default ProductPage;
