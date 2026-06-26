'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Package, MapPin, LogOut, ChevronRight,
  Phone, Mail, Clock, CheckCircle2, Truck, ShoppingBag, Edit2, Check
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

interface OrderItem {
  product: { name: string; price: number; emoji: string };
  qty: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  discountAmount?: number;
  discountPercent?: number;
  status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  paymentMethod: string;
  createdAt: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    pincode: string;
    phone: string;
    email?: string;
  };
}

const STATUS_CONFIG = {
  PROCESSING: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
  SHIPPED:    { label: 'Shipped',   color: 'bg-amber-100 text-amber-700', icon: Truck },
  DELIVERED:  { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout, updateDisplayName, openAuthModal } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'address'>('orders');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  // Redirect to home if not logged in (after loading completes)
  useEffect(() => {
    if (!loading && !user) {
      openAuthModal();
      router.push('/');
    }
  }, [user, loading, router, openAuthModal]);

  // Fetch user's orders
  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const params = new URLSearchParams();
        if (user.uid)         params.set('uid', user.uid);
        if (user.phoneNumber) params.set('phone', user.phoneNumber);
        if (user.email)       params.set('email', user.email);

        const res = await fetch(`/api/user/orders?${params}`);
        const data = await res.json();
        if (data.success) setOrders(data.orders);
      } catch (e) {
        console.error('Failed to fetch orders', e);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleNameSave = async () => {
    if (!nameInput.trim()) return;
    await updateDisplayName(nameInput.trim());
    setEditingName(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-brand-burgundy border-t-transparent animate-spin" />
          <p className="text-brand-text-lt text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.displayName || 'Frizly Fan';
  const initial = displayName[0].toUpperCase();
  const lastOrder = orders[0];

  return (
    <div className="min-h-screen bg-brand-cream pt-28 pb-16 px-4 md:px-8">
      <div className="max-w-[1000px] mx-auto">

        {/* ── Profile Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[28px] p-6 md:p-8 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-6"
        >
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full bg-brand-burgundy flex items-center justify-center overflow-hidden shadow-lg">
              {user.photoURL ? (
                <Image src={user.photoURL} alt="Profile" width={80} height={80} className="object-cover w-full h-full" />
              ) : (
                <span className="text-3xl font-bold text-white font-display">{initial}</span>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-sage rounded-full border-2 border-white flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex items-center gap-2 mb-1">
                <input
                  autoFocus
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleNameSave()}
                  className="font-display text-2xl font-bold text-brand-dark border-b-2 border-brand-burgundy outline-none bg-transparent w-full max-w-[260px]"
                  placeholder="Your name"
                />
                <button onClick={handleNameSave}
                  className="p-1.5 bg-brand-burgundy rounded-full text-white hover:bg-brand-burgundy-lt transition-colors shrink-0">
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-display text-2xl font-bold text-brand-dark">{displayName}</h1>
                <button onClick={() => { setEditingName(true); setNameInput(displayName === 'Frizly Fan' ? '' : displayName); }}
                  className="p-1 text-brand-text-lt hover:text-brand-burgundy transition-colors">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex flex-col gap-1">
              {user.phoneNumber && (
                <div className="flex items-center gap-2 text-sm text-brand-text-lt">
                  <Phone className="w-3.5 h-3.5 text-brand-burgundy" />
                  {user.phoneNumber}
                </div>
              )}
              {user.email && (
                <div className="flex items-center gap-2 text-sm text-brand-text-lt">
                  <Mail className="w-3.5 h-3.5 text-brand-burgundy" />
                  {user.email}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2 shrink-0">
            <div className="text-center sm:text-right">
              <div className="font-display text-2xl font-bold text-brand-burgundy">{orders.length}</div>
              <div className="text-[0.7rem] text-brand-text-lt uppercase tracking-wide">Orders</div>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-600 transition-colors font-medium">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </motion.div>

        {/* ── Active Order Banner ── */}
        {lastOrder && lastOrder.status !== 'DELIVERED' && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Link href={`/track?id=${lastOrder.id}`}>
              <div className="bg-gradient-to-r from-brand-burgundy to-[#4a1010] rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold text-sm">Active Order — {lastOrder.id}</div>
                  <div className="text-white/60 text-xs mt-0.5">
                    {STATUS_CONFIG[lastOrder.status].label} · ₹{lastOrder.total}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/60" />
              </div>
            </Link>
          </motion.div>
        )}

        {/* ── Tabs ── */}
        <div className="flex gap-2 mb-5">
          {[
            { id: 'orders' as const, label: 'My Orders', icon: Package },
            { id: 'address' as const, label: 'Saved Address', icon: MapPin },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-burgundy text-white shadow-md'
                  : 'bg-white text-brand-text-lt hover:bg-brand-cream-dk'
              }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── Orders Tab ── */}
          {activeTab === 'orders' && (
            <motion.div key="orders"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-4"
            >
              {ordersLoading ? (
                <div className="bg-white rounded-[24px] p-12 text-center shadow-sm">
                  <div className="w-8 h-8 rounded-full border-3 border-brand-burgundy border-t-transparent animate-spin mx-auto mb-3" />
                  <p className="text-brand-text-lt text-sm">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-[24px] p-12 text-center shadow-sm">
                  <ShoppingBag className="w-12 h-12 text-brand-cream-dk mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold text-brand-dark mb-2">No orders yet</h3>
                  <p className="text-brand-text-lt text-sm mb-6">Your delicious journey starts here!</p>
                  <Link href="/#products">
                    <Button>Shop Now</Button>
                  </Link>
                </div>
              ) : (
                orders.map((order, i) => {
                  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.PROCESSING;
                  const StatusIcon = status.icon;
                  const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  });

                  return (
                    <motion.div key={order.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="bg-white rounded-[20px] p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="font-display text-base font-bold text-brand-dark">{order.id}</div>
                          <div className="flex items-center gap-1.5 text-xs text-brand-text-lt mt-0.5">
                            <Clock className="w-3 h-3" />
                            {date}
                          </div>
                        </div>
                        <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full shrink-0 ${status.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {order.items.map(({ product, qty }) => (
                          <div key={product.name}
                            className="flex items-center gap-1.5 bg-brand-cream rounded-full px-3 py-1 text-xs font-medium text-brand-text">
                            <span>{product.emoji}</span>
                            {product.name}
                            {qty > 1 && <span className="text-brand-text-lt">×{qty}</span>}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-brand-cream-dk">
                        <div>
                          <span className="font-bold text-brand-dark text-lg">₹{order.total}</span>
                          {order.discountAmount ? (
                            <span className="text-xs text-brand-sage ml-2 font-medium">
                              saved ₹{order.discountAmount}
                            </span>
                          ) : null}
                          <div className="text-[0.65rem] text-brand-text-lt capitalize mt-0.5">
                            {order.paymentMethod === 'razorpay' ? 'Paid Online ✅' : 'Cash on Delivery'}
                          </div>
                        </div>
                        <Link href={`/track?id=${order.id}`}>
                          <button className="flex items-center gap-1.5 text-sm font-semibold text-brand-burgundy hover:underline">
                            Track <ChevronRight className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}

          {/* ── Address Tab ── */}
          {activeTab === 'address' && (
            <motion.div key="address"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            >
              {lastOrder?.shippingAddress ? (
                <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-brand-cream rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-brand-burgundy" />
                    </div>
                    <div>
                      <div className="font-bold text-brand-dark">Last Used Address</div>
                      <div className="text-xs text-brand-text-lt">From order {lastOrder.id}</div>
                    </div>
                  </div>

                  <div className="bg-brand-cream rounded-2xl p-5 text-sm text-brand-text leading-[1.9]">
                    <div className="font-bold text-brand-dark">{lastOrder.shippingAddress.fullName}</div>
                    <div>{lastOrder.shippingAddress.address}</div>
                    <div>{lastOrder.shippingAddress.city} — {lastOrder.shippingAddress.pincode}</div>
                    <div className="flex items-center gap-1.5 mt-2 text-brand-text-lt">
                      <Phone className="w-3.5 h-3.5" />
                      {lastOrder.shippingAddress.phone}
                    </div>
                    {lastOrder.shippingAddress.email && (
                      <div className="flex items-center gap-1.5 text-brand-text-lt">
                        <Mail className="w-3.5 h-3.5" />
                        {lastOrder.shippingAddress.email}
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-brand-text-lt mt-4">
                    This address will be pre-filled at checkout next time you shop.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-[24px] p-12 text-center shadow-sm">
                  <MapPin className="w-12 h-12 text-brand-cream-dk mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold text-brand-dark mb-2">No saved address</h3>
                  <p className="text-brand-text-lt text-sm">Your address will appear here after your first order.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
