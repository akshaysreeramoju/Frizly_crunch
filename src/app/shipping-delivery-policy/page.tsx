export const metadata = {
  title: 'Shipping and Delivery Policy | Frizly Crunch',
  description: 'Shipping and Delivery Policy of Frizly Crunch Foods Pvt. Ltd.',
};

export default function ShippingDeliveryPolicyPage() {
  return (
    <div className="min-h-screen bg-brand-cream pt-32 pb-16 px-4 md:px-8">
      <div className="max-w-[800px] mx-auto bg-white p-8 md:p-12 rounded-[24px] shadow-sm">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-8">Shipping & Delivery Policy</h1>
        
        <div className="prose prose-brand max-w-none text-brand-text">
          <p className="mb-4">Last updated: June 2026</p>
          
          <h2 className="text-xl font-bold text-brand-dark mt-8 mb-4">1. Order Processing Times</h2>
          <p className="mb-4">
            All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.
          </p>
          <p className="mb-4">
            If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.
          </p>

          <h2 className="text-xl font-bold text-brand-dark mt-8 mb-4">2. Shipping Rates & Delivery Estimates</h2>
          <p className="mb-4">
            Shipping charges for your order will be calculated and displayed at checkout.
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Orders above ₹499:</strong> Free Standard Shipping (3-5 business days)</li>
            <li><strong>Orders below ₹499:</strong> Flat rate of ₹50 for Standard Shipping (3-5 business days)</li>
          </ul>
          <p className="mb-4">
            Delivery delays can occasionally occur due to unforeseen circumstances or carrier issues.
          </p>

          <h2 className="text-xl font-bold text-brand-dark mt-8 mb-4">3. Shipment Confirmation & Order Tracking</h2>
          <p className="mb-4">
            You will receive a Shipment Confirmation email/SMS once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours. You can also track your order on our /track page.
          </p>

          <h2 className="text-xl font-bold text-brand-dark mt-8 mb-4">4. Damages</h2>
          <p className="mb-4">
            If you received your order damaged, please contact us immediately so we can file a claim with the shipment carrier and arrange a replacement for you. Please save all packaging materials and damaged goods before filing a claim.
          </p>

          <h2 className="text-xl font-bold text-brand-dark mt-8 mb-4">5. Contact Information</h2>
          <p className="mb-4">
            Email: hello@frizlycrunch.com<br />
            Address: [Company Registered Address Pending]
          </p>
        </div>
      </div>
    </div>
  );
}
