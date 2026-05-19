'use client';

import React, { useState } from 'react';
import {
  Users, ShoppingCart, BarChart3, Package, Bell, Search, LogOut,
  X, Edit2, Trash2, Download, Eye
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
  href: string;
  external: boolean;
}

interface Registration { 
  id: number;
  full_name: string;
  email: string;
  phone: string;
  age_range: string;
  sector: string;
  profession: string;
  area_of_expertise: string;
  registration_date: string;
}

interface SurveyResponse { 
  id: number;
  full_name: string;
  email: string;
  phone: string;
  age_range: string;
  ministry_feelings: string;
  familiarity_score: number;
  priority_areas: string[];
  major_challenge: string;
  submitted_at: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'services' | 'attendance' | 'survey'>('dashboard');

  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  // Product Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImagePreview, setProductImagePreview] = useState('');

  // Service Modal
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceImagePreview, setServiceImagePreview] = useState('');
  const [serviceHref, setServiceHref] = useState('');
  const [serviceExternal, setServiceExternal] = useState(false);

  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Export CSV
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return alert("No data to export");
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).map(val => `"${val}"`).join(',')).join('\n');
    const csv = headers + '\n' + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
  };

  // Product Functions
  const openProductModal = () => { resetProductForm(); setShowProductModal(true); };
  const handleEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductName(p.name);
    setProductCategory(p.category);
    setProductPrice(p.price.toString());
    setProductDescription(p.description);
    setProductImagePreview(p.image);
    setShowProductModal(true);
  };
  const handleDeleteProduct = (id: number) => {
    if (confirm("Delete this product?")) setProducts(prev => prev.filter(p => p.id !== id));
  };
  const handleSaveProduct = () => {
    if (!productName || !productCategory || !productPrice) return alert("Please fill all required fields");
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, name: productName, category: productCategory, price: Number(productPrice), description: productDescription, image: productImagePreview || p.image } : p));
    } else {
      setProducts(prev => [...prev, { id: Date.now(), name: productName, category: productCategory, price: Number(productPrice), description: productDescription, image: productImagePreview || '/placeholder.jpg' }]);
    }
    resetProductForm();
  };
  const resetProductForm = () => {
    setProductName(''); setProductCategory(''); setProductPrice(''); setProductDescription(''); setProductImagePreview(''); setEditingProduct(null); setShowProductModal(false);
  };

  // Service Functions
  const openServiceModal = () => { resetServiceForm(); setShowServiceModal(true); };
  const handleEditService = (s: Service) => {
    setEditingService(s);
    setServiceTitle(s.title);
    setServiceDescription(s.description);
    setServiceImagePreview(s.imageSrc);
    setServiceHref(s.href);
    setServiceExternal(s.external);
    setShowServiceModal(true);
  };
  const handleDeleteService = (id: number) => {
    if (confirm("Delete this service?")) setServices(prev => prev.filter(s => s.id !== id));
  };
  const handleSaveService = () => {
    if (!serviceTitle) return alert("Service title is required");
    if (editingService) {
      setServices(prev => prev.map(s => s.id === editingService.id ? { ...s, title: serviceTitle, description: serviceDescription, imageSrc: serviceImagePreview || s.imageSrc, href: serviceHref, external: serviceExternal } : s));
    } else {
      setServices(prev => [...prev, { id: Date.now(), title: serviceTitle, description: serviceDescription, imageSrc: serviceImagePreview || '/placeholder.jpg', href: serviceHref, external: serviceExternal }]);
    }
    resetServiceForm();
  };
  const resetServiceForm = () => {
    setServiceTitle(''); setServiceDescription(''); setServiceImagePreview(''); setServiceHref(''); setServiceExternal(false); setEditingService(null); setShowServiceModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 min-h-screen border-r border-black bg-white p-6 hidden lg:block">
          <div className="mb-10">
            <img src="/fmyd.png" alt="FMYD Logo" className="h-16 w-auto" />
          </div>

          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={20} /> },
              { id: 'orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
              { id: 'products', label: 'Products', icon: <Package size={20} /> },
              { id: 'services', label: 'Services', icon: <Package size={20} /> },
              { id: 'attendance', label: 'Attendance', icon: <Users size={20} /> },
              { id: 'survey', label: 'Survey Responses', icon: <Users size={20} /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === item.id ? 'bg-emerald-600 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-black uppercase">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'orders' && 'Marketplace Orders'}
              {activeTab === 'products' && 'Products Management'}
              {activeTab === 'services' && 'Services Management'}
              {activeTab === 'attendance' && 'Attendance'}
              {activeTab === 'survey' && 'Full Survey Responses'}
            </h1>
          </div>

          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {[
                { title: "Registrations", value: registrations.length },
                { title: "Full Survey Responses", value: surveyResponses.length },
                { title: "Marketplace Orders", value: orders.length },
                { title: "Active Products", value: products.length },
              ].map((stat, i) => (
                <div key={i} className="border border-black p-6 bg-white">
                  <h3 className="text-sm font-semibold">{stat.title}</h3>
                  <p className="text-4xl font-black mt-3">{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="border border-black">
              <div className="p-6 border-b flex justify-between">
                <h3 className="font-black text-xl">Marketplace Order</h3>
                <button onClick={() => exportToCSV(orders, 'orders')} className="flex items-center gap-2 border px-5 py-2 hover:bg-gray-100">
                  <Download size={18} /> Export CSV
                </button>
              </div>
              <p className="p-20 text-center text-gray-500">Orders placed through the marketplace and checkout will appear here.</p>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-black">Products Management</h2>
                <button onClick={openProductModal} className="bg-emerald-600 text-white px-6 py-3 font-semibold hover:bg-emerald-700">+ Add Product</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length === 0 ? (
                  <p className="col-span-full text-center py-12 text-gray-500">No products yet. Add some above.</p>
                ) : products.map(p => (
                  <div key={p.id} className="border border-black p-4 bg-white">
                    <img src={p.image} alt={p.name} className="w-full h-48 object-cover border border-black mb-4" />
                    <h4 className="font-bold">{p.name}</h4>
                    <p className="text-sm text-gray-600">{p.category}</p>
                    <p className="font-black text-xl">₦{p.price.toLocaleString()}</p>
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => handleEditProduct(p)} className="flex-1 border py-2 hover:bg-gray-100"><Edit2 size={16} /> Edit</button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="flex-1 border border-red-600 text-red-600 py-2 hover:bg-red-50"><Trash2 size={16} /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div>
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-black">Services Management</h2>
                <button onClick={openServiceModal} className="bg-emerald-600 text-white px-6 py-3 font-semibold hover:bg-emerald-700">+ Add Service</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.length === 0 ? (
                  <p className="col-span-full text-center py-12 text-gray-500">No services yet.</p>
                ) : services.map(s => (
                  <div key={s.id} className="border border-black p-4 bg-white">
                    <img src={s.imageSrc} alt={s.title} className="w-full h-40 object-cover border border-black mb-4" />
                    <h4 className="font-bold">{s.title}</h4>
                    <p className="text-sm line-clamp-2">{s.description}</p>
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => handleEditService(s)} className="flex-1 border py-2 hover:bg-gray-100"><Edit2 size={16} /> Edit</button>
                      <button onClick={() => handleDeleteService(s.id)} className="flex-1 border border-red-600 text-red-600 py-2 hover:bg-red-50"><Trash2 size={16} /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attendance Tab - Step 1 Only */}
          {activeTab === 'attendance' && (
            <div className="border border-black">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="font-black text-xl">Attendance</h3>
                <button onClick={() => exportToCSV(registrations, 'attendance')} className="flex items-center gap-2 border px-5 py-2 hover:bg-gray-100">
                  <Download size={18} /> Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-4 text-left">Full Name</th>
                      <th className="p-4 text-left">Email</th>
                      <th className="p-4 text-left">Phone</th>
                      <th className="p-4 text-left">Age Range</th>
                      <th className="p-4 text-left">Date</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.length === 0 ? (
                      <tr><td colSpan={6} className="p-12 text-center text-gray-500">No registrations yet.</td></tr>
                    ) : registrations.map(reg => (
                      <tr key={reg.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium">{reg.full_name}</td>
                        <td className="p-4">{reg.email}</td>
                        <td className="p-4">{reg.phone}</td>
                        <td className="p-4">{reg.age_range}</td>
                        <td className="p-4 text-sm">{reg.registration_date}</td>
                        <td className="p-4">
                          <button onClick={() => setSelectedItem(reg)}><Eye size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Survey Tab - Full Data */}
          {activeTab === 'survey' && (
            <div className="border border-black">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="font-black text-xl">Survey Responses</h3>
                <button onClick={() => exportToCSV(surveyResponses, 'full_survey')} className="flex items-center gap-2 border px-5 py-2 hover:bg-gray-100">
                  <Download size={18} /> Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-4 text-left">Name</th>
                      <th className="p-4 text-left">Age Range</th>
                      <th className="p-4 text-left">Familiarity</th>
                      <th className="p-4 text-left">Submitted</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {surveyResponses.length === 0 ? (
                      <tr><td colSpan={5} className="p-12 text-center text-gray-500">No survey responses yet.</td></tr>
                    ) : surveyResponses.map(s => (
                      <tr key={s.id} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium">{s.full_name}</td>
                        <td className="p-4">{s.age_range}</td>
                        <td className="p-4">{s.familiarity_score}/5</td>
                        <td className="p-4 text-sm">{s.submitted_at}</td>
                        <td className="p-4">
                          <button onClick={() => setSelectedItem(s)}><Eye size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= PRODUCT MODAL ================= */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-black w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-black">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={resetProductForm}><X size={28} /></button>
              </div>

              <div className="space-y-5">
                <input type="text" placeholder="Product Name *" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full border border-black p-4" />
                <input type="text" placeholder="Category *" value={productCategory} onChange={(e) => setProductCategory(e.target.value)} className="w-full border border-black p-4" />
                <input type="number" placeholder="Price (₦) *" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} className="w-full border border-black p-4" />
                
                <div>
                  <label className="block mb-2 font-medium">Product Image</label>
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setProductImagePreview(URL.createObjectURL(file));
                  }} className="w-full border border-black p-3" />
                  {productImagePreview && <img src={productImagePreview} alt="preview" className="mt-4 h-48 object-cover" />}
                </div>

                <textarea placeholder="Description" rows={4} value={productDescription} onChange={(e) => setProductDescription(e.target.value)} className="w-full border border-black p-4" />

                <button onClick={handleSaveProduct} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 font-bold">
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SERVICE MODAL ================= */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-black w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-black">{editingService ? 'Edit Service' : 'Add New Service'}</h2>
                <button onClick={resetServiceForm}><X size={28} /></button>
              </div>

              <div className="space-y-5">
                <input type="text" placeholder="Service Title *" value={serviceTitle} onChange={(e) => setServiceTitle(e.target.value)} className="w-full border border-black p-4" />
                <input type="text" placeholder="Link (URL)" value={serviceHref} onChange={(e) => setServiceHref(e.target.value)} className="w-full border border-black p-4" />

                <div>
                  <label className="block mb-2 font-medium">Service Image</label>
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setServiceImagePreview(URL.createObjectURL(file));
                  }} className="w-full border border-black p-3" />
                  {serviceImagePreview && <img src={serviceImagePreview} alt="preview" className="mt-4 h-40 object-cover" />}
                </div>

                <textarea placeholder="Description" rows={4} value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} className="w-full border border-black p-4" />

                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={serviceExternal} onChange={(e) => setServiceExternal(e.target.checked)} />
                  Open in new tab (External Link)
                </label>

                <button onClick={handleSaveService} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 font-bold">
                  {editingService ? 'Update Service' : 'Save Service'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}