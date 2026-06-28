export const metadata = {
  title: 'Terms and Conditions | Frizly Crunch',
  description: 'Terms and Conditions of Frizly Crunch Foods Pvt. Ltd.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-brand-cream pt-32 pb-16 px-4 md:px-8">
      <div className="max-w-[800px] mx-auto bg-white p-8 md:p-12 rounded-[24px] shadow-sm">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-8">Terms and Conditions</h1>
        
        <div className="prose prose-brand max-w-none text-brand-text">
          <p className="mb-4">Last updated: June 2026</p>
          
          <h2 className="text-xl font-bold text-brand-dark mt-8 mb-4">1. Agreement to Terms</h2>
          <p className="mb-4">
            These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Frizly Crunch Foods Pvt. Ltd. (“we,” “us” or “our”), concerning your access to and use of the frizlycrunch.com website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
          </p>

          <h2 className="text-xl font-bold text-brand-dark mt-8 mb-4">2. Intellectual Property Rights</h2>
          <p className="mb-4">
            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us.
          </p>

          <h2 className="text-xl font-bold text-brand-dark mt-8 mb-4">3. Products and Pricing</h2>
          <p className="mb-4">
            We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors. All pricing is in Indian Rupees (INR) and is subject to change without notice.
          </p>

          <h2 className="text-xl font-bold text-brand-dark mt-8 mb-4">4. Contact Information</h2>
          <p className="mb-4">
            For any queries regarding these terms, please reach out to us at:
          </p>
          <p className="mb-4">
            Email: hello@frizlycrunch.com<br />
            Address: [Company Registered Address Pending]
          </p>
        </div>
      </div>
    </div>
  );
}
