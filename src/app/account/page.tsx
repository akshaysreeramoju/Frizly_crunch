'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Package, MapPin, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function AccountPage() {
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
              <Link href="/account" className="flex items-center gap-3 p-3 bg-brand-cream text-brand-burgundy rounded-xl font-semibold">
                <User className="w-5 h-5" /> Dashboard
              </Link>
              <Link href="/account/orders" className="flex items-center gap-3 p-3 text-brand-text-lt hover:bg-brand-cream rounded-xl transition-colors">
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
              <h3 className="font-display text-xl font-bold text-brand-dark mb-4">Account Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-brand-text-lt uppercase tracking-wider block mb-2">Full Name</label>
                  <p className="font-medium text-brand-dark">{user.displayName || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-text-lt uppercase tracking-wider block mb-2">Email</label>
                  <p className="font-medium text-brand-dark">{user.email || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-text-lt uppercase tracking-wider block mb-2">Phone</label>
                  <p className="font-medium text-brand-dark">{user.phoneNumber || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-brand-cream-dk shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display text-xl font-bold text-brand-dark">Recent Orders</h3>
                <Link href="/account/orders" className="text-sm font-semibold text-brand-burgundy hover:underline">View All</Link>
              </div>
              
              {/* Empty state for mock */}
              <div className="text-center py-10 bg-brand-cream/50 rounded-2xl border border-dashed border-brand-cream-dk">
                <Package className="w-10 h-10 text-brand-gold mx-auto mb-3" />
                <p className="text-brand-dark font-medium mb-1">No orders yet</p>
                <p className="text-sm text-brand-text-lt mb-4">You haven't placed any orders.</p>
                <Button onClick={() => router.push('/products')}>Start Shopping</Button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
