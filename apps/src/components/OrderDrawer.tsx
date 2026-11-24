"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Gift,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatIDR } from "../data/mockProducts";

export const OrderDrawer: React.FC = () => {
  const router = useRouter();
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  if (!isCartOpen) return null;

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  const handleGoToCartPage = () => {
    setIsCartOpen(false);
    router.push("/cart");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-white shadow-2xl flex flex-col font-sans">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-[#F2E4D6] flex items-center justify-between bg-[#FFFBF7]">
            <div className="flex items-baseline gap-2">
              <h2 className="text-base font-semibold text-[#4A2A1C]">
                Shopping Bag
              </h2>
              <span className="text-xs text-[#7A5644]">
                ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-gray-400 hover:text-[#4A2A1C] transition-colors rounded-[2px]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length > 0 ? (
              <div className="flex flex-col divide-y divide-[#F2E4D6]">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="py-4 first:pt-0 last:pb-0 flex gap-4"
                  >
                    <div className="relative w-18 h-18 bg-[#F0F0F0] rounded-[2px] overflow-hidden shrink-0 border border-[#E6D2C0]">
                      <Image
                        src={
                          item.product.coverImage ||
                          item.product.images?.[0] ||
                          "/images/prod-boardbook.jpg"
                        }
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-medium text-[#4A2A1C] line-clamp-1">
                            {item.product.title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-400 hover:text-[#C0392B] p-0.5 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[11px] text-[#7A5644] block">
                          {item.product.category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-[#E6D2C0] rounded-[2px] h-7 px-1.5 bg-white">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="text-xs text-[#7A5644] hover:text-[#B05A26] px-1 font-bold cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="text-xs font-semibold text-[#4A2A1C] px-2 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="text-xs text-[#7A5644] hover:text-[#B05A26] px-1 font-bold cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs font-bold text-[#4A2A1C]">
                          {formatIDR(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty Drawer */
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="relative w-32 h-32 mb-3">
                  <Image
                    src="/images/mascot/maskot-keranjang-kosong.png"
                    alt="Empty Shopping Bag"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-sm font-semibold text-[#4A2A1C] mb-1">
                  Your bag is currently empty
                </h3>
                <p className="text-xs text-[#7A5644] mb-6 max-w-xs leading-relaxed">
                  Explore our curated children&apos;s books and educational wooden toys to fill it up.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    router.push("/shop");
                  }}
                  className="px-6 py-2.5 bg-[#B05A26] text-white text-xs font-semibold rounded-[2px] cursor-pointer"
                >
                  Explore Catalog
                </button>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#F2E4D6] bg-[#FFFBF7] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#7A5644]">Subtotal</span>
                <span className="text-lg font-bold text-[#B05A26]">
                  {formatIDR(subtotal)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#2A6E37] bg-white p-2 rounded-[2px] border border-[#E6D2C0]">
                <Gift className="w-3.5 h-3.5 text-[#B05A26] shrink-0" />
                <span>Complimentary gift wrap &amp; handwritten greeting card!</span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleGoToCheckout}
                  className="w-full py-3 bg-[#B05A26] hover:bg-[#964B1F] text-white font-semibold text-xs rounded-[2px] transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleGoToCartPage}
                  className="w-full py-2.5 border border-[#E6D2C0] text-[#4A2A1C] hover:bg-white text-xs font-medium rounded-[2px] transition-colors cursor-pointer"
                >
                  View Full Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
