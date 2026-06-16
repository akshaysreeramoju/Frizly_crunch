import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { ToastContainer } from "@/components/ui/Toast";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Frizly Crunch – Real Food. Reinvented.",
  description: "Premium freeze-dried fruits and vegetables. 100% real fruit, nothing added. No added sugar, no preservatives, no artificial colours.",
  keywords: "freeze-dried fruit, freeze-dried vegetables, healthy snacks, natural snacks, Frizly Crunch, no added sugar, premium snacks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${montserrat.variable} antialiased`}
      >
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CartSidebar />
          <ToastContainer />
        </CartProvider>
      </body>
    </html>
  );
}
