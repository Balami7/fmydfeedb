'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingCart, Search, X, Menu } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

const navLinks = [
  { title: 'Marketplace', href: '/marketplace', active: true },
  { title: 'FMYD', href: 'https://fmyd.gov.ng/' },
  { title: 'YOPI TRACKER', href: '#' },
  { title: 'Waste 2 Wealth', href: 'https://wastetowealth.fmyd.gov.ng/' },
  { title: 'Youth Initiative', href: 'https://yid.fmyd.gov.ng/' },
  { title: 'NIYA', href: 'https://niya.gov.ng/' },
];

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [deliveryZone, setDeliveryZone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch('/api/products', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',           
        });

        if (!response.ok) throw new Error('Failed to load products');

        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError('Unable to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
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

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, type: 'plus' | 'minus') => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          const qty = type === 'plus' ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity: qty };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CartPanel = () => (
    <div className="bg-white border border-black p-5 h-fit">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-black uppercase text-base">Your Cart</h2>
        <button onClick={() => setMobileCartOpen(false)} className="lg:hidden">
          <X size={22} />
        </button>
      </div>

      <div className="space-y-4 mb-6">
        {cart.length === 0 ? (
          <p className="text-sm">Your cart is empty</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="border-b pb-3">
              <p className="font-semibold text-sm">{item.name}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm">₦{item.price.toLocaleString()}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, 'minus')}
                    className="px-2 border border-black"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 'plus')}
                    className="px-2 border border-black"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Delivery Radius</label>
        <select
          value={deliveryZone}
          onChange={(e) => setDeliveryZone(e.target.value)}
          className="w-full border border-black p-3 text-sm outline-none bg-white"
        >
          <option value="">Select Delivery Radius</option>
          <option value="abuja">Within Abuja</option>
          <option value="outside-abuja">Outside Abuja</option>
          <option value="outside-nigeria">Outside Nigeria</option>
        </select>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold mb-2">Delivery Address</label>
        <textarea
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          placeholder="Enter full delivery address..."
          rows={5}
          className="w-full border border-black p-3 text-sm outline-none"
        />
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₦{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          <span>₦{deliveryFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-t border-black pt-3 font-black text-base">
          <span>Total</span>
          <span>₦{total.toLocaleString()}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.location.href = '/checkout'}
        className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 font-bold uppercase text-sm tracking-wider transition-colors rounded-lg"
      >
        Proceed to Checkout
      </button>
    </div>
  );


  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading Marketplace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-black text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
  <nav className="max-w-7xl mx-auto px-4 md:px-6 h-[80px] flex items-center justify-between">
    
    {/* Logo Container */}
    <div className="flex items-center gap-4">
      <Image 
        src="/fmyd.png" 
        alt="FMYD Marketplace" 
        width={100} 
        height={100} 
        className="object-contain" 
      />
      <Image 
        src="/6.jpeg" 
        alt="Civil Service Conference" 
        width={100} 
        height={100} 
        className="object-contain" 
      />
    </div>

    {/* Desktop Navigation */}
    <div className="hidden md:flex items-center gap-7 text-sm font-semibold">
      {navLinks.map((link) => link.active ? (
        <div key={link.title} className="relative py-1 text-emerald-600 font-bold">
          <a href={link.href}>{link.title}</a>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
        </div>
      ) : (
        <a 
          key={link.title} 
          href={link.href} 
          target={link.href.startsWith('http') ? '_blank' : '_self'} 
          rel="noreferrer" 
          className="hover:text-emerald-600 transition"
        >
          {link.title}
        </a>
      ))}
    </div>

    {/* Mobile Controls */}
    <div className="flex items-center gap-4 md:hidden">
      <button onClick={() => setMobileMenuOpen(true)}>
        <Menu size={24} />
      </button>
      <button onClick={() => setMobileCartOpen(true)} className="relative">
        <ShoppingCart size={24} />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
            {cart.length}
          </span>
        )}
      </button>
    </div>

  </nav>
</header>


      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-[300]">
          <div className="bg-white w-[280px] h-full p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-bold text-lg">Menu</h2>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-5 font-semibold">
              {navLinks.map((link) => (
                <a key={link.title} href={link.href} target={link.href.startsWith('http') ? '_blank' : '_self'}>
                  {link.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          <div>
            <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
              <h1 className="text-2xl font-black uppercase">FMYD Marketplace</h1>

              <div className="flex items-center border border-black px-3 py-2 w-full md:w-[320px]">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ml-2 w-full outline-none text-sm"
                />
              </div>
            </div>

            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="cursor-pointer group">
                  <div
                    onClick={() => setSelectedProduct(product)}
                    className="relative h-[150px] bg-gray-50 overflow-hidden"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="pt-3">
                    <p className="text-[10px] uppercase font-semibold tracking-widest text-gray-500">
                      {product.category}
                    </p>
                    <h3
                      onClick={() => setSelectedProduct(product)}
                      className="font-bold text-sm mt-1 line-clamp-2 cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <div className="mt-2">
                      <span className="text-base font-black">₦{product.price.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="w-full mt-3 bg-green-600 text-white py-2 rounded-md text-sm font-semibold hover:bg-green-700 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <p className="text-center text-gray-500 py-12">No products found</p>
            )}
          </div>

        
          <div className="hidden lg:block sticky top-24">
            <CartPanel />
          </div>
        </div>
      </section>

      
      {mobileCartOpen && (
        <div className="fixed inset-0 bg-black/60 z-[250] flex justify-end">
          <div className="w-full max-w-[380px] bg-white h-full overflow-y-auto p-4">
            <CartPanel />
          </div>
        </div>
      )}

      
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4">
          <div className="bg-white max-w-4xl w-full relative p-6 rounded-lg">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-5 text-2xl"
            >
              <X size={28} />
            </button>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative h-[320px] bg-gray-50 rounded-lg">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  fill
                  className="object-contain p-6"
                />
              </div>

              <div>
                <h2 className="text-2xl font-black mb-4">{selectedProduct.name}</h2>
                <p className="text-3xl font-black mb-5">₦{selectedProduct.price.toLocaleString()}</p>
                <p className="text-sm leading-7 mb-6">{selectedProduct.description}</p>

                <button
                  onClick={() => addToCart(selectedProduct)}
                  className="w-full bg-green-600 text-white py-3 font-bold uppercase tracking-wider hover:bg-green-700 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}