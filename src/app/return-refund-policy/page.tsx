export const metadata = {
  title: 'Return and Refund Policy | Frizly Crunch',
  description: 'Return and Refund Policy of Frizly Crunch Foods Pvt. Ltd.',
};

export default function ReturnRefundPolicyPage() {
  return (
    <div className="min-h-screen bg-brand-cream pt-32 pb-16 px-4 md:px-8">
      <div className="max-w-[800px] mx-auto bg-white p-8 md:p-12 rounded-[24px] shadow-sm">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-8">Return & Refund Policy</h1>
        
        <div className="prose prose-brand max-w-none text-brand-text">
          <p className="mb-4">Last updated: June 2026</p>
          
          <h2 className="text-xl font-bold text-brand-dark mt-8 mb-4">1. Return Policy</h2>
          <p className="mb-4">
            Since our products are edible items, we generally do not accept returns. However, your satisfaction is our priority. If you receive a damaged, defective, or incorrect product, we will replace it or issue a refund.
          </p>
          <p className="mb-4">
            To be eligible for a replacement or refund due to a damaged/incorrect item, you must notify us within 48 hours of delivery. Please provide photos of the damaged item and the original packaging.
          </p>

          <h2 className="text-xl font-bold text-brand-dark mt-8 mb-4">2. Refund Process</h2>
          <p className="mb-4">
            Once your claim is received and inspected, we will send you an email or message to notify you of the approval or rejection of your refund/replacement.
          </p>
          <p className="mb-4">
            If approved for a refund, it will be processed, and a credit will automatically be applied to your credit card or original method of payment, within 5-7 business days.
          </p>

          <h2 className="text-xl font-bold text-brand-dark mt-8 mb-4">3. Late or Missing Refunds</h2>
          <p className="mb-4">
            If you haven't received a refund yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted. Next contact your bank. There is often some processing time before a refund is posted.
          </p>
          <p className="mb-4">
            If you’ve done all of this and you still have not received your refund yet, please contact us.
          </p>

          <h2 className="text-xl font-bold text-brand-dark mt-8 mb-4">4. Contact Information</h2>
          <p className="mb-4">
            Email: hello@frizlycrunch.com<br />
            Address: [Company Registered Address Pending]
          </p>
        </div>
      </div>
    </div>
  );
}
