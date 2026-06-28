export const metadata = {
  title: 'Our Story | Frizly Crunch',
  description: 'Learn about Frizly Crunch and our mission to reinvent healthy snacking with 100% natural freeze-dried fruits and vegetables.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-cream pt-32 pb-16 px-4 md:px-8">
      <div className="max-w-[800px] mx-auto bg-white p-8 md:p-12 rounded-[24px] shadow-sm">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-8">Our Story</h1>
        <p className="text-brand-text mb-4">
          Frizly Crunch was born out of a simple observation: healthy snacks shouldn't be boring, and tasty snacks shouldn't be unhealthy.
        </p>
        <p className="text-brand-text mb-4">
          We use state-of-the-art freeze-drying technology to preserve 97% of the nutrients, flavor, and color of fresh produce, without adding any sugar, oil, or preservatives.
        </p>
      </div>
    </div>
  );
}
