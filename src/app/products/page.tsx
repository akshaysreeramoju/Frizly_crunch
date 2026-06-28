import { Products } from "@/components/sections/Products";

export const metadata = {
  title: 'All Products | Frizly Crunch',
  description: 'Shop our full collection of premium freeze-dried fruits and vegetables. 100% natural, no added sugar.',
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-brand-cream pt-32 pb-16">
      <Products />
    </div>
  );
}
