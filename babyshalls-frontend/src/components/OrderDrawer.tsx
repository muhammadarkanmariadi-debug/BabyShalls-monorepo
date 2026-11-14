'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatIDR } from '../data/mockProducts';

export const OrderDrawer: React.FC = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    giftWrapping,
    updateGiftWrapping,
    giftWrappingCost,
    grandTotal,
    isCartOpen,
    setIsCartOpen
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Pick up in Store (Citraland Puncak Tidar, Malang)');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');

  if (!isCartOpen) return null;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      // Save order to backend or localStorage
      const apiEndpoint = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/orders';
      await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          customerName,
          customerEmail,
          phoneNumber: customerPhone,
          deliveryMethod,
          deliveryAddress,
          items: items.map((i) => ({
            productId: i.product.id,
            title: i.product.title,
            quantity: i.quantity,
            price: i.product.price
          })),
          giftOptions: giftWrapping,
          total: grandTotal
        })
      }).catch(() => {
        // Non-blocking fallback
      });

      // Save to localStorage
      const orders = JSON.parse(localStorage.getItem('babyshalls_orders') || '[]');
      orders.unshift({
        orderId,
        customerName: customerName || 'Pelanggan BabyShalls',
        customerEmail: customerEmail || 'customer@example.com',
        customerPhone: customerPhone || '081234567890',
        deliveryMethod,
        deliveryAddress: deliveryMethod.includes('Pick up') ? 'Ambil Sendiri di Toko Citraland Puncak Tidar, Malang' : (deliveryAddress || 'Malang, Jawa Timur'),
        paymentMethod: 'Transfer Bank BCA / QRIS',
        status: 'Menunggu Pembayaran',
        shippingTrackingNumber: '',
        courier: deliveryMethod.includes('Pick up') ? 'Ambil di Toko' : 'JNE Express',
        items: items.map((i) => ({
          productId: i.product.id,
          title: i.product.title,
          coverImage: i.product.coverImage,
          quantity: i.quantity,
          price: i.product.price
        })),
        giftWrapping,
        subtotal,
        giftWrappingCost,
        total: grandTotal,
        date: new Date().toISOString()
      });
      localStorage.setItem('babyshalls_orders', JSON.stringify(orders));
    } catch {
      // Fallback
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setConfirmedOrderId(orderId);
      setOrderConfirmed(true);
      clearCart();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/40 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#EAE6DF] flex flex-col justify-between text-left">
          
          {/* Header */}
          <div className="p-6 border-b border-[#EAE6DF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} strokeWidth={1.5} className="text-[#C86D51]" />
              <h2 className="text-base font-bold uppercase tracking-wider text-[#221F1F]">
                Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setOrderConfirmed(false);
              }}
              className="text-[#666666] hover:text-[#221F1F] p-1"
              aria-label="Close Bag"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Cart Item List or Order Confirmed View */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {orderConfirmed ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-14 h-14 bg-[#E2ECE0] text-[#3A5C37] rounded-full flex items-center justify-center mx-auto border border-[#C7DAC3]">
                  <Check size={28} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-[#2C2725]">Pesanan Berhasil Dibuat!</h3>
                <p className="text-xs font-semibold text-[#E07A5F] uppercase tracking-wider">
                  Order ID: {confirmedOrderId}
                </p>
                <p className="text-xs text-[#68625D] leading-relaxed max-w-xs mx-auto">
                  Terima kasih, <strong>{customerName || 'Pelanggan'}</strong>. Pesanan Anda telah tercatat di sistem butik BabyShalls. Bukti instruksi pembayaran dan status resi dapat dilihat melalui link di bawah ini.
                </p>
                <div className="pt-2 flex flex-col gap-2 max-w-xs mx-auto">
                  <Link
                    href={`/order-success/${confirmedOrderId}`}
                    onClick={() => {
                      setOrderConfirmed(false);
                      setIsCartOpen(false);
                    }}
                    className="w-full py-2.5 bg-[#E07A5F] hover:bg-[#cc654b] text-white text-xs font-semibold rounded-md transition-colors text-center"
                  >
                    Lihat Bukti Pesanan &amp; Pembayaran
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={() => {
                      setOrderConfirmed(false);
                      setIsCartOpen(false);
                    }}
                    className="w-full py-2.5 bg-white border border-[#EDE8E1] hover:border-[#E07A5F] text-[#2C2725] text-xs font-semibold rounded-md transition-colors text-center"
                  >
                    Cek Riwayat Pesanan Saya
                  </Link>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <p className="text-sm text-[#221F1F] font-medium">Your shopping bag is currently empty.</p>
                <p className="text-xs text-[#666666]">
                  Browse our curated children’s books and educational toys.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 text-xs font-semibold text-[#C86D51] hover:underline"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              <>
                <div className="divide-y divide-[#EAE6DF]">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="py-4 flex gap-4 items-start">
                      <Link
                        href={`/product/${product.id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="w-16 h-22 bg-[#F5F5F5] rounded-sm overflow-hidden shrink-0 block border border-[#EAE6DF]"
                      >
                        <img
                          src={product.coverImage}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${product.id}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-sm font-semibold text-[#221F1F] hover:text-[#C86D51] line-clamp-1 block"
                        >
                          {product.title}
                        </Link>
                        <p className="text-xs text-[#666666] line-clamp-1 mt-0.5">
                          {product.author}
                        </p>
                        <p className="text-xs font-bold text-[#C86D51] mt-1">
                          {formatIDR(product.price)}
                        </p>

                        {/* Quantity Counter */}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-[#EAE6DF] rounded-md h-7 px-2">
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, -1)}
                              className="text-xs text-[#666666] hover:text-[#221F1F] px-1 cursor-pointer"
                            >
                              −
                            </button>
                            <span className="w-6 text-center text-xs font-medium text-[#221F1F]">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, 1)}
                              className="text-xs text-[#666666] hover:text-[#221F1F] px-1 cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            className="text-xs text-[#666666] hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Optional Gift Wrapping Box */}
                <div className="border border-[#EAE6DF] rounded-md p-4 space-y-3 bg-[#FAFAFA]">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#221F1F]">
                    <span>Gift Wrapping &amp; Card</span>
                    <span className="text-[#C86D51]">+{formatIDR(giftWrappingCost)}</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <label className="flex items-center gap-2 text-[#666666] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={giftWrapping.birthdayCard}
                        onChange={(e) => updateGiftWrapping({ birthdayCard: e.target.checked })}
                        className="rounded accent-[#C86D51]"
                      />
                      <span>Handwritten Card (+{formatIDR(15000)})</span>
                    </label>

                    <label className="flex items-center gap-2 text-[#666666] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={giftWrapping.customRibbon}
                        onChange={(e) => updateGiftWrapping({ customRibbon: e.target.checked })}
                        className="rounded accent-[#C86D51]"
                      />
                      <span>Signature Ribbon Wrap (+{formatIDR(10000)})</span>
                    </label>

                    <label className="flex items-center gap-2 text-[#666666] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={giftWrapping.signatureBox}
                        onChange={(e) => updateGiftWrapping({ signatureBox: e.target.checked })}
                        className="rounded accent-[#C86D51]"
                      />
                      <span>Pinewood Keepsake Box (+{formatIDR(35000)})</span>
                    </label>
                  </div>

                  {giftWrapping.birthdayCard && (
                    <textarea
                      placeholder="Write your greeting note here..."
                      value={giftWrapping.cardMessage}
                      onChange={(e) => updateGiftWrapping({ cardMessage: e.target.value })}
                      className="w-full text-xs p-2.5 border border-[#EAE6DF] bg-white rounded-md focus:outline-none focus:border-[#C86D51] h-16 resize-none"
                    />
                  )}
                </div>

                {/* Standard Checkout Form */}
                <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-3 pt-2">
                  <div className="text-xs uppercase tracking-wider font-semibold text-[#221F1F]">
                    Delivery Information
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-[#EAE6DF] rounded-md focus:outline-none focus:border-[#C86D51]"
                  />

                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-[#EAE6DF] rounded-md focus:outline-none focus:border-[#C86D51]"
                  />

                  <input
                    type="tel"
                    required
                    placeholder="Phone Number (e.g. 081234567890)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-[#EAE6DF] rounded-md focus:outline-none focus:border-[#C86D51]"
                  />

                  <select
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-[#EAE6DF] rounded-md bg-white focus:outline-none focus:border-[#C86D51]"
                  >
                    <option value="Pick up in Store (Citraland Puncak Tidar, Malang)">
                      Pick up in Store (Citraland Puncak Tidar, Malang) — Free
                    </option>
                    <option value="Instant Courier (GoSend / GrabExpress Malang)">
                      Instant Courier (GoSend / GrabExpress Malang)
                    </option>
                    <option value="Regular Shipping (JNE / SiCepat Nationwide)">
                      Regular Shipping (JNE / SiCepat Nationwide)
                    </option>
                  </select>

                  {!deliveryMethod.includes('Pick up in Store') && (
                    <input
                      type="text"
                      required
                      placeholder="Shipping Address (Street, City, Zipcode)"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-[#EAE6DF] rounded-md focus:outline-none focus:border-[#C86D51]"
                    />
                  )}
                </form>
              </>
            )}
          </div>

          {/* Footer Checkout Summary & Submit Button */}
          {!orderConfirmed && items.length > 0 && (
            <div className="p-6 border-t border-[#EAE6DF] space-y-4 bg-white">
              <div className="space-y-1.5 text-xs text-[#666666]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#221F1F]">{formatIDR(subtotal)}</span>
                </div>
                {giftWrappingCost > 0 && (
                  <div className="flex justify-between">
                    <span>Gift Packaging</span>
                    <span className="font-medium text-[#C86D51]">+{formatIDR(giftWrappingCost)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#221F1F] pt-2 border-t border-[#EAE6DF]">
                  <span>Total</span>
                  <span className="text-[#C86D51]">{formatIDR(grandTotal)}</span>
                </div>
              </div>

              {/* Solid Orange Place Order Button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#C86D51] hover:bg-[#b2583d] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Processing Order...' : 'Place Order'}</span>
                <ArrowRight size={14} />
              </button>

              <p className="text-[11px] text-[#666666] text-center">
                Payment verified upon confirmation • Store pickup at Citraland Puncak Tidar, Malang.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
