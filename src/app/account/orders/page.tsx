'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Package, MapPin, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function OrdersPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="min-h-screen bg-brand-cream pt-32 pb-16 px-4 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-brand-cream pt-24 md:pt-32 pb-16 px-4 md:px-8">
      <div className="max-w-[1000px] mx-auto">
        <h1 className="font-display text-3xl font-bold text-brand-dark mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Sidebar */}
          <div className="md:col-span-1 bg-white p-6 rounded-3xl border border-brand-cream-dk shadow-sm self-start">
            <div className="flex items-center gap-4 border-b border-brand-cream-dk pb-6 mb-6">
              <div className="w-16 h-16 bg-brand-burgundy rounded-full flex items-center justify-center text-white text-xl font-bold">
                {user.displayName?.[0] || user.email?.[0] || user.phoneNumber?.[1] || 'U'}
              </div>
              <div>
                <h2 className="font-bold text-brand-dark truncate w-32">{user.displayName || 'Welcome!'}</h2>
                <p className="text-xs text-brand-text-lt truncate w-32">{user.email || user.phoneNumber}</p>
              </div>
            </div>
            
            <nav className="flex flex-col gap-2">
              <Link href="/account" className="flex items-center gap-3 p-3 text-brand-text-lt hover:bg-brand-cream rounded-xl transition-colors">
                <User className="w-5 h-5" /> Dashboard
              </Link>
              <Link href="/account/orders" className="flex items-center gap-3 p-3 bg-brand-cream text-brand-burgundy rounded-xl font-semibold">
                <Package className="w-5 h-5" /> My Orders
              </Link>
              <button className="flex items-center gap-3 p-3 text-brand-text-lt hover:bg-brand-cream rounded-xl transition-colors text-left w-full">
                <MapPin className="w-5 h-5" /> Saved Addresses
              </button>
              <button onClick={() => { logout(); router.push('/'); }} className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-left w-full mt-4">
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 flex flex-col gap-8">
            <div className="bg-white p-8 rounded-3xl border border-brand-cream-dk shadow-sm">
              <h3 className="font-display text-xl font-bold text-brand-dark mb-6">Order History</h3>
              
              {/* Empty state for mock */}
              <div className="text-center py-16 bg-brand-cream/50 rounded-2xl border border-dashed border-brand-cream-dk">
                <Package className="w-12 h-12 text-brand-gold mx-auto mb-4" />
                <p className="text-brand-dark font-medium text-lg mb-2">No orders found</p>
                <p className="text-sm text-brand-text-lt mb-6">Looks like you haven't made your first order yet.</p>
                <Button onClick={() => router.push('/products')}>Browse Products</Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
