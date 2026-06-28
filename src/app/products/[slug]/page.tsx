import { PRODUCTS } from '@/lib/products';
import { ProductDetailClient } from './ProductDetailClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = PRODUCTS[resolvedParams.slug];
  if (!product) return { title: 'Product Not Found | Frizly Crunch' };
  
  return {
    title: `${product.name} | Premium Freeze-Dried ${product.category === 'fruit' ? 'Fruit' : 'Vegetable'} | Frizly Crunch`,
    description: product.desc,
    openGraph: {
      title: `${product.name} - Frizly Crunch`,
      description: product.desc,
      images: [product.img],
    }
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const product = PRODUCTS[slug];

  if (!product) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": `https://frizlycrunch.com${product.img}`,
    "description": product.desc,
    "brand": {
      "@type": "Brand",
      "name": "Frizly Crunch"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://frizlycrunch.com/products/${slug}`,
      "priceCurrency": "INR",
      "price": product.price,
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetailClient slug={slug} />
    </>
  );
}
