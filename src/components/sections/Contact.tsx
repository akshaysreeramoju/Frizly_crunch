'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, Globe, Smartphone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setIsSuccess(true);
        reset();
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error(error);
      alert('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-8 bg-gradient-to-br from-[#FDF9F4] to-[#F2E8D5]">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 items-start">
        
        {/* Info */}
        <div>
          <span className="section-label">Get in Touch</span>
          <h2 className="section-title mb-4">We'd Love to <em>Hear from You</em></h2>
          <p className="text-[0.9rem] text-brand-text-lt mb-8 leading-[1.8]">
            Have questions about our products? Want to place a bulk order? Reach out to us!
          </p>

          <div className="flex flex-col gap-5">
            {[
              { icon: Phone, label: 'Customer Care', value: '+91 98765 43210' },
              { icon: Mail, label: 'Email', value: 'hello@frizlycrunch.com' },
              { icon: Globe, label: 'Website', value: 'www.frizlycrunch.com' },
              { icon: Smartphone, label: 'Follow Us', value: '@frizlycrunch' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:translate-x-1 hover:shadow-md transition-all duration-300"
              >
                <div className="w-11 text-center shrink-0 text-brand-burgundy">
                  <item.icon className="w-6 h-6 mx-auto" />
                </div>
                <div>
                  <strong className="block text-[0.78rem] font-bold tracking-[0.05em] uppercase text-brand-text-lt mb-0.5">
                    {item.label}
                  </strong>
                  <span className="text-[0.9rem] text-brand-text font-medium">
                    {item.value}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[24px] p-8 shadow-md"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-[0.78rem] font-bold tracking-[0.05em] uppercase text-brand-text-lt">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Priya Sharma"
                {...register('name')}
                className={`p-3 border-2 rounded-xl text-[0.9rem] bg-brand-cream transition-all focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-brand-burgundy/10 ${
                  errors.name ? 'border-red-500' : 'border-brand-cream-dk focus:border-brand-burgundy'
                }`}
              />
              {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[0.78rem] font-bold tracking-[0.05em] uppercase text-brand-text-lt">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="hello@example.com"
                {...register('email')}
                className={`p-3 border-2 rounded-xl text-[0.9rem] bg-brand-cream transition-all focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-brand-burgundy/10 ${
                  errors.email ? 'border-red-500' : 'border-brand-cream-dk focus:border-brand-burgundy'
                }`}
              />
              {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="subject" className="text-[0.78rem] font-bold tracking-[0.05em] uppercase text-brand-text-lt">
                Subject
              </label>
              <select
                id="subject"
                {...register('subject')}
                className={`p-3 border-2 rounded-xl text-[0.9rem] bg-brand-cream transition-all focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-brand-burgundy/10 ${
                  errors.subject ? 'border-red-500' : 'border-brand-cream-dk focus:border-brand-burgundy'
                }`}
              >
                <option value="">Select a subject</option>
                <option value="order">Place an Order</option>
                <option value="bulk">Bulk / Corporate Order</option>
                <option value="feedback">Product Feedback</option>
                <option value="other">Other</option>
              </select>
              {errors.subject && <span className="text-red-500 text-xs">{errors.subject.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-[0.78rem] font-bold tracking-[0.05em] uppercase text-brand-text-lt">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="Tell us how we can help..."
                {...register('message')}
                className={`p-3 border-2 rounded-xl text-[0.9rem] bg-brand-cream transition-all focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-brand-burgundy/10 resize-y min-h-[100px] ${
                  errors.message ? 'border-red-500' : 'border-brand-cream-dk focus:border-brand-burgundy'
                }`}
              />
              {errors.message && <span className="text-red-500 text-xs">{errors.message.message}</span>}
            </div>

            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>

            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-2 text-brand-sage font-semibold text-[0.9rem] p-3 bg-brand-sage/10 rounded-xl"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Thank you! We'll get back to you within 24 hours.
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
