import { Contact } from "@/components/sections/Contact";

export const metadata = {
  title: 'Contact Us | Frizly Crunch',
  description: 'Get in touch with the Frizly Crunch team.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-brand-cream pt-32 pb-16">
      <Contact />
    </div>
  );
}
