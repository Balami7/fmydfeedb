'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, CheckCircle, Upload, X } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | ''>('');
  const [deliveryZone, setDeliveryZone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const getDeliveryFee = () => {
    if (deliveryZone === 'abuja') return 5000;
    if (deliveryZone === 'outside-abuja') return 10000;
    if (deliveryZone === 'outside-nigeria') return 25000;
    return 0;
  };

  const deliveryFee = getDeliveryFee();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentProof(file);
      const reader = new FileReader();
      reader.onload = (e) => setProofPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeProof = () => {
    setPaymentProof(null);
    setProofPreview(null);
  };

  const handleSubmitOrder = async () => {
    if (!fullName || !phoneNumber || !deliveryAddress || !deliveryZone || !paymentMethod) {
      alert("Please fill all required fields");
      return;
    }
    if (paymentMethod === 'transfer' && !paymentProof) {
      alert("Please upload proof of payment");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('phoneNumber', phoneNumber);
    formData.append('deliveryZone', deliveryZone);
    formData.append('deliveryAddress', deliveryAddress);
    formData.append('paymentMethod', paymentMethod);
    formData.append('subtotal', subtotal.toString());
    formData.append('deliveryFee', deliveryFee.toString());
    formData.append('total', total.toString());
    formData.append('items', JSON.stringify(cart));

    if (paymentProof) {
      formData.append('paymentProof', paymentProof);
    }

    try {
      const response = await fetch('/FMYDHUB/api/orders', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSubmitted(true);
        localStorage.removeItem('cart'); // Clear cart after successful order
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <CheckCircle size={80} className="mx-auto text-green-600 mb-6" />
          <h1 className="text-3xl font-black mb-3">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you {fullName}. Your order has been received and will be processed shortly.
          </p>
          <a
            href="/marketplace"
            className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold"
          >
            Return to Marketplace
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-[80px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/marketplace" className="border border-black p-2 hover:bg-gray-50">
              <ArrowLeft size={20} />
            </a>
            <Image src="/fmyd.png" alt="FMYD Marketplace" width={100} height={100} className="object-contain" />
          </div>
          <h1 className="text-lg md:text-xl font-black uppercase">Checkout</h1>
        </div>
      </header>

      
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          
          <div>
            <h2 className="text-2xl font-black uppercase mb-6">Delivery & Payment</h2>

            
            <div className="border border-black p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">Customer Information</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-black p-3 outline-none"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full border border-black p-3 outline-none"
                  required
                />
              </div>
            </div>

            
            <div className="border border-black p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">Delivery Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">Delivery Radius *</label>
                  <select
                    value={deliveryZone}
                    onChange={(e) => setDeliveryZone(e.target.value)}
                    className="w-full border border-black p-3 bg-white outline-none"
                    required
                  >
                    <option value="">Select Delivery Radius</option>
                    <option value="abuja">Within Abuja</option>
                    <option value="outside-abuja">Outside Abuja</option>
                    <option value="outside-nigeria">Outside Nigeria</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Delivery Address *</label>
                  <textarea
                    rows={5}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter full delivery address..."
                    className="w-full border border-black p-3 outline-none resize-none"
                    required
                  />
                </div>
              </div>
            </div>

            
            <div className="border border-black p-6">
              <h3 className="font-bold text-lg mb-5">Payment Method *</h3>
              
              <div className="space-y-4">
                <label className={`block border p-4 cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-green-600 bg-green-50' : 'border-black'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
                    <span className="font-bold">Cash Payment to Cashier</span>
                  </div>
                  {paymentMethod === 'cash' && (
                    <div className="mt-4 text-sm text-green-600 font-medium">No transfer needed.</div>
                  )}
                </label>

                <label className={`block border p-4 cursor-pointer transition-all ${paymentMethod === 'transfer' ? 'border-green-600 bg-green-50' : 'border-black'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" checked={paymentMethod === 'transfer'} onChange={() => setPaymentMethod('transfer')} />
                    <span className="font-bold">Bank Transfer</span>
                  </div>

                  {paymentMethod === 'transfer' && (
                    <div className="mt-4 text-sm space-y-4">
                      <div className="border border-black p-4 bg-gray-50 text-sm">
                        <p><strong>Bank:</strong> First Bank</p>
                        <p><strong>Account Name:</strong> FMYD Marketplace Ltd</p>
                        <p><strong>Account Number:</strong> 0123456789</p>
                      </div>

                      <div>
                        <p className="font-semibold mb-2">Upload Proof of Payment *</p>
                        <div className="border-2 border-dashed border-black p-6 text-center">
                          <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" id="proof" />
                          <label htmlFor="proof" className="cursor-pointer flex flex-col items-center">
                            <Upload size={32} />
                            <p className="mt-2">Click to upload receipt</p>
                          </label>
                        </div>

                        {proofPreview && (
                          <div className="mt-4 relative">
                            <img src={proofPreview} alt="Proof" className="max-h-48 mx-auto rounded" />
                            <button onClick={removeProof} className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full">
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

         
          <div className="h-fit sticky top-24">
            <div className="border border-black p-6">
              <h3 className="font-black uppercase text-lg mb-5">Order Summary</h3>

              <div className="max-h-[400px] overflow-y-auto mb-4 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b pb-4">
                    <div className="w-16 h-16 bg-gray-100 relative flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="font-bold mt-1">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₦{deliveryFee.toLocaleString()}</span>
                </div>

                <div className="flex justify-between border-t border-black pt-3 font-black text-lg">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting || !paymentMethod || (paymentMethod === 'transfer' && !paymentProof)}
                className="w-full mt-6 bg-green-600 text-white py-4 font-bold uppercase hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing Order..." : "Confirm & Place Order"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}