export const metadata = {
  title: 'Your Cart | Frizly Crunch',
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-brand-cream pt-32 pb-16 px-4 md:px-8">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="font-display text-3xl font-bold text-brand-dark mb-4">Your Cart</h1>
        <p>Full cart view. Note: Mobile will primarily use the Bottom Sheet Cart Drawer.</p>
      </div>
    </div>
  );
}
