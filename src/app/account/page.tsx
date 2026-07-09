'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Package, MapPin, User, LogOut, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    async function fetchOrders() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('firebase_uid', user!.uid)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (data) {
          setRecentOrders(data);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setFetching(false);
      }
    }
    fetchOrders();
  }, [user]);

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
              
              {fetching ? (
                <div className="text-center py-10">
                  <div className="w-8 h-8 border-4 border-brand-cream-dk border-t-brand-burgundy rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-brand-text-lt">Loading...</p>
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-10 bg-brand-cream/50 rounded-2xl border border-dashed border-brand-cream-dk">
                  <Package className="w-10 h-10 text-brand-gold mx-auto mb-3" />
                  <p className="text-brand-dark font-medium mb-1">No orders yet</p>
                  <p className="text-sm text-brand-text-lt mb-4">You haven't placed any orders.</p>
                  <Button onClick={() => router.push('/#products')}>Start Shopping</Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {recentOrders.map((order, i) => {
                    const totalItems = order.items?.reduce((sum: number, item: any) => sum + item.qty, 0) || 0;
                    const date = order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    }) : 'Recent';

                    return (
                      <Link href={`/order/${order.id}`} key={order.id || i} className="group block border border-brand-cream-dk rounded-2xl p-4 hover:border-brand-burgundy/30 hover:shadow-md transition-all bg-white">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-bold text-brand-burgundy">{order.id}</span>
                              <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold tracking-wider uppercase">
                                PAID
                              </span>
                            </div>
                            <p className="text-sm text-brand-text-lt">
                              {date} &nbsp;·&nbsp; {totalItems} item{totalItems !== 1 ? 's' : ''} &nbsp;·&nbsp; <strong className="text-brand-dark">₹{order.total_amount || order.total}</strong>
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-brand-sage font-semibold text-sm group-hover:text-brand-burgundy transition-colors">
                            View <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
