export const metadata = {
  title: 'Privacy Policy | Frizly Crunch',
  description: 'Privacy Policy of Frizly Crunch Foods Pvt. Ltd.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-brand-cream pt-32 pb-16 px-4 md:px-8">
      <div className="max-w-[800px] mx-auto bg-white p-8 md:p-12 rounded-[24px] shadow-sm">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-8">Privacy Policy</h1>
        
        <div className="prose prose-brand max-w-none text-brand-text">
          <p className="mb-4">Last updated: June 2026</p>
          
          <h2 className="text-xl font-bold text-brand-dark mt-8 mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to Frizly Crunch. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you as to how we look after your personal data when you visit our website 
            and tell you about your privacy rights and how the law protects you.
          </p>

          <h2 className="text-xl font-bold text-brand-dark mt-8 mb-4">2. The Data We Collect About You</h2>
          <p className="mb-4">
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
            <li><strong>Financial Data:</strong> includes payment card details (processed securely via Razorpay).</li>
            <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
          </ul>

          <h2 className="text-xl font-bold text-brand-dark mt-8 mb-4">3. How We Use Your Personal Data</h2>
          <p className="mb-4">
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal obligation.</li>
          </ul>

          <h2 className="text-xl font-bold text-brand-dark mt-8 mb-4">4. Contact Details</h2>
          <p className="mb-4">
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
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
