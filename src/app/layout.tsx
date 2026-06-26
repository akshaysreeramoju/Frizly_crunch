import type { Metadata, Viewport } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { ToastContainer } from "@/components/ui/Toast";
import { AuthModal } from "@/components/auth/AuthModal";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className={`${playfair.variable} ${montserrat.variable} antialiased overflow-x-hidden`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <CartSidebar />
            <AuthModal />
            <ToastContainer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
