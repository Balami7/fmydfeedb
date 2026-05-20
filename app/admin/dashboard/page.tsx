'use client';

import React, { useEffect, useState } from 'react';
import {
  Users, ShoppingCart, BarChart3, Package, Bell, Search, LogOut,
  X, Edit2, Trash2, Download, Eye
} from 'lucide-react';
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  image: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  href: string;
  external: boolean;
}

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
}

interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  age_range: string;
  occupation: string;
  visitor_category: string;
  state_of_residence: string;
  lga: string;
  home_address: string;
  gender: string;
  visit_date: string;
  registration_date: string;
}

interface SurveyResponse {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  age_range: string;
  occupation: string;
  visitor_category: string;
  state_of_residence: string;
  lga: string;
  home_address: string;
  gender: string;
  visit_date: string;
  heard_of_ministry: string;
  aware_programmes: string[];
  familiarity_score: number;
  priority_areas: string[];
  opportunities_opinion: string;
  most_interesting_programme: string;
  programme_to_expand: string;
  improvements: string;
  new_initiatives: string;
  biggest_challenge: string;
  challenge_solutions: string;
  program_types_interest: string[];
  would_participate: string;
  has_disability: string;
  disability_details: string;
  accommodation_support: string;
  anything_else: string;
  comments: string;
  submitted_at: string;
}

function parseMaybeJson<T>(v: unknown): T | null {
  if (typeof v !== "string" || !v) return null;
  try { return JSON.parse(v) as T; } catch { return null; }
}

function toArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  const parsed = parseMaybeJson<unknown>(v);
  if (Array.isArray(parsed)) return parsed.map(String);
  if (typeof v === "string" && v) return [v];
  return [];
}

function fmtDate(v: unknown): string {
  if (!v) return "—";
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
}

function fmtDateTime(v: unknown): string {
  if (!v) return "—";
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'services' | 'gallery' | 'attendance' | 'survey'>('dashboard');

  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  // Product Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState('');

  // Service Modal
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceImageFile, setServiceImageFile] = useState<File | null>(null);
  const [serviceImagePreview, setServiceImagePreview] = useState('');
  const [serviceHref, setServiceHref] = useState('');
  const [serviceExternal, setServiceExternal] = useState(false);

  // Gallery Modal
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [galleryCaption, setGalleryCaption] = useState('');
  const [galleryImageFile, setGalleryImageFile] = useState<File | null>(null);
  const [galleryImagePreview, setGalleryImagePreview] = useState('');

  const authToken = (): string | null =>
    typeof window === "undefined" ? null : localStorage.getItem("admin_token");

  const loadDashboard = async () => {
    const token = authToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    try {
      const res = await fetch("/FMYDHUB/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.status === 401) {
        localStorage.removeItem("admin_token");
        router.replace("/admin/login");
        return;
      }
      if (!res.ok) return;
      const d = await res.json();

      setProducts((d.products || []).map((p: any) => ({
        id: String(p.id),
        name: p.name || "",
        category: p.category || "",
        price: Number(p.price) || 0,
        quantity: Number(p.quantity) || 0,
        description: p.description || "",
        image: p.image || "",
      })));

      setServices((d.services || []).map((s: any) => ({
        id: String(s.id),
        title: s.name || "",
        description: s.description || "",
        imageSrc: s.image || "",
        href: s.href || "",
        external: !!s.external,
      })));

      setGallery((d.galleries || []).map((g: any) => ({
        id: String(g.id),
        src: g.image || "",
        alt: g.title || "",
        caption: g.title || "",
      })));

      setRegistrations((d.registrations || []).map((r: any) => ({
        id: String(r.id),
        full_name: r.name || "",
        email: r.email || "",
        phone: r.phone || "",
        age_range: r.age || "",
        occupation: r.occupation || "",
        visitor_category: r.visitor_category || "",
        state_of_residence: r.state || "",
        lga: r.lga || "",
        home_address: r.address || "",
        gender: r.gender || "",
        visit_date: r.visit_date || "",
        registration_date: r.createdAt || "",
      })));

      setSurveyResponses((d.surveyResponses || []).map((s: any) => ({
        id: String(s.id),
        full_name: s.full_name || "",
        email: s.email || "",
        phone: s.phone || "",
        age_range: s.age_range || "",
        occupation: s.occupation || "",
        visitor_category: s.visitor_category || "",
        state_of_residence: s.state_of_residence || "",
        lga: s.lga || "",
        home_address: s.home_address || "",
        gender: s.gender || "",
        visit_date: s.visit_date || "",
        heard_of_ministry: s.heard_of_ministry || "",
        aware_programmes: toArray(s.aware_programmes),
        familiarity_score: Number(s.familiarity_score) || 0,
        priority_areas: toArray(s.priority_areas),
        opportunities_opinion: s.opportunities_opinion || "",
        most_interesting_programme: s.most_interesting_programme || "",
        programme_to_expand: s.programme_to_expand || "",
        improvements: s.improvements || "",
        new_initiatives: s.new_initiatives || "",
        biggest_challenge: s.biggest_challenge || "",
        challenge_solutions: s.challenge_solutions || "",
        program_types_interest: toArray(s.program_types_interest),
        would_participate: s.would_participate || "",
        has_disability: s.has_disability || "",
        disability_details: s.disability_details || "",
        accommodation_support: s.accommodation_support || "",
        anything_else: s.anything_else || "",
        comments: s.comments || "",
        submitted_at: s.submitted_at || s.createdAt || "",
      })));

      setOrders(d.orders || []);
    } catch (e) {
      console.error("Dashboard load failed", e);
    }
  };

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedItem, setSelectedItem] = useState<Registration | SurveyResponse | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailType, setDetailType] = useState<'registration' | 'survey'>('registration');

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
    setProductQuantity(p.quantity.toString());
    setProductDescription(p.description);
    setProductImageFile(null);
    setProductImagePreview(p.image);
    setShowProductModal(true);
  };
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const token = authToken();
    const res = await fetch(`/FMYDHUB/api/products?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(`Delete failed: ${data.error || res.status}`);
      return;
    }
    await loadDashboard();
  };
  const handleSaveProduct = async () => {
    if (!productName || !productPrice) return alert("Please fill name and price");
    const token = authToken();
    const fd = new FormData();
    if (editingProduct) fd.append("id", editingProduct.id);
    fd.append("name", productName);
    fd.append("description", productDescription || "");
    fd.append("price", String(Number(productPrice) || 0));
    fd.append("quantity", String(Number(productQuantity) || 0));
    if (productImageFile) fd.append("image", productImageFile);
    const res = await fetch("/FMYDHUB/api/products", {
      method: editingProduct ? "PUT" : "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(`Save failed: ${data.error || res.status}`);
      return;
    }
    resetProductForm();
    await loadDashboard();
  };
  const resetProductForm = () => {
    setProductName(''); setProductCategory(''); setProductPrice(''); setProductQuantity('');
    setProductDescription(''); setProductImageFile(null); setProductImagePreview('');
    setEditingProduct(null); setShowProductModal(false);
  };

  // Service Functions
  const openServiceModal = () => { resetServiceForm(); setShowServiceModal(true); };
  const handleEditService = (s: Service) => {
    setEditingService(s);
    setServiceTitle(s.title);
    setServiceDescription(s.description);
    setServiceImageFile(null);
    setServiceImagePreview(s.imageSrc);
    setServiceHref(s.href || '');
    setServiceExternal(!!s.external);
    setShowServiceModal(true);
  };
  const handleDeleteService = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const token = authToken();
    const res = await fetch(`/FMYDHUB/api/services?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(`Delete failed: ${data.error || res.status}`);
      return;
    }
    await loadDashboard();
  };
  const handleSaveService = async () => {
    if (!serviceTitle) return alert("Service title is required");
    const token = authToken();
    const fd = new FormData();
    if (editingService) fd.append("id", editingService.id);
    fd.append("name", serviceTitle);
    fd.append("description", serviceDescription || "");
    fd.append("href", serviceHref || "");
    fd.append("external", serviceExternal ? "true" : "false");
    if (serviceImageFile) fd.append("image", serviceImageFile);
    const res = await fetch("/FMYDHUB/api/services", {
      method: editingService ? "PUT" : "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(`Save failed: ${data.error || res.status}`);
      return;
    }
    resetServiceForm();
    await loadDashboard();
  };
  const resetServiceForm = () => {
    setServiceTitle(''); setServiceDescription(''); setServiceImageFile(null);
    setServiceImagePreview(''); setServiceHref(''); setServiceExternal(false);
    setEditingService(null); setShowServiceModal(false);
  };

  // Gallery Functions
  const openGalleryModal = () => { resetGalleryForm(); setShowGalleryModal(true); };

  const handleEditGallery = (item: GalleryItem) => {
    setEditingGalleryItem(item);
    setGalleryCaption(item.caption);
    setGalleryImageFile(null);
    setGalleryImagePreview(item.src);
    setShowGalleryModal(true);
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm("Delete this gallery image?")) return;
    const token = authToken();
    const res = await fetch(`/FMYDHUB/api/gallery?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(`Delete failed: ${data.error || res.status}`);
      return;
    }
    await loadDashboard();
  };

  const handleSaveGallery = async () => {
    if (editingGalleryItem) {
      alert("Gallery edit is not supported — delete and re-add.");
      return;
    }
    if (!galleryCaption || !galleryImageFile) {
      return alert("Caption and image are both required");
    }
    const token = authToken();
    const fd = new FormData();
    fd.append("title", galleryCaption);
    fd.append("image", galleryImageFile);
    const res = await fetch("/FMYDHUB/api/gallery", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(`Save failed: ${data.error || res.status}`);
      return;
    }
    resetGalleryForm();
    await loadDashboard();
  };

  const resetGalleryForm = () => {
    setGalleryCaption('');
    setGalleryImageFile(null);
    setGalleryImagePreview('');
    setEditingGalleryItem(null);
    setShowGalleryModal(false);
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
              { id: 'gallery', label: 'Gallery', icon: <Package size={20} /> },
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
              {activeTab === 'gallery' && 'Gallery Management'}
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
                { title: "Gallery Images", value: gallery.length },
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
                <h3 className="font-black text-xl">Marketplace Orders</h3>
                <button onClick={() => exportToCSV(orders, 'orders')} className="flex items-center gap-2 border px-5 py-2 hover:bg-gray-100">
                  <Download size={18} /> Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">Customer</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Phone</th>
                      <th className="p-3 text-left">Zone</th>
                      <th className="p-3 text-right">Delivery Fee</th>
                      <th className="p-3 text-right">Items</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan={8} className="p-12 text-center text-gray-500">No orders yet.</td></tr>
                    ) : orders.map((o: any) => (
                      <tr key={o.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{o.customerName}</td>
                        <td className="p-3 text-xs">{o.email}</td>
                        <td className="p-3">{o.phone}</td>
                        <td className="p-3">{o.deliveryZone}</td>
                        <td className="p-3 text-right">₦{Number(o.deliveryFee || 0).toLocaleString()}</td>
                        <td className="p-3 text-right">{(o.items || []).length}</td>
                        <td className="p-3">{o.status}</td>
                        <td className="p-3 text-xs">{fmtDate(o.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

          {/* ====================== GALLERY TAB ====================== */}
          {activeTab === 'gallery' && (
            <div>
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-black">Gallery Management</h2>
                <button 
                  onClick={openGalleryModal} 
                  className="bg-emerald-600 text-white px-6 py-3 font-semibold hover:bg-emerald-700"
                >
                  + Add Image
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.length === 0 ? (
                  <p className="col-span-full text-center py-12 text-gray-500">
                    No images in gallery yet. Add some above.
                  </p>
                ) : (
                  gallery.map(item => (
                    <div key={item.id} className="border border-black bg-white overflow-hidden">
                      <img 
                        src={item.src} 
                        alt={item.caption} 
                        className="w-full h-48 object-cover border-b border-black" 
                      />
                      <div className="p-4">
                        <p className="font-medium line-clamp-2 mb-2">{item.caption}</p>
                        <div className="flex gap-3 mt-4">
                          <button 
                            onClick={() => handleEditGallery(item)}
                            className="flex-1 border py-2 hover:bg-gray-100 flex items-center justify-center gap-2"
                          >
                            <Edit2 size={16} /> Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteGallery(item.id)}
                            className="flex-1 border border-red-600 text-red-600 py-2 hover:bg-red-50 flex items-center justify-center gap-2"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="border border-black">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="font-black text-xl">Attendance & Registrations</h3>
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
                      <th className="p-4 text-left">Category</th>
                      <th className="p-4 text-left">State</th>
                      <th className="p-4 text-left">Date</th>
                      <th className="p-4 text-center">View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.length === 0 ? (
                      <tr><td colSpan={8} className="p-12 text-center text-gray-500">No registrations yet.</td></tr>
                    ) : registrations.map(reg => (
                      <tr key={reg.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => { setSelectedItem(reg); setDetailType('registration'); setShowDetailModal(true); }}>
                        <td className="p-4 font-medium">{reg.full_name}</td>
                        <td className="p-4">{reg.email}</td>
                        <td className="p-4">{reg.phone}</td>
                        <td className="p-4">{reg.age_range}</td>
                        <td className="p-4">{reg.visitor_category}</td>
                        <td className="p-4">{reg.state_of_residence}</td>
                        <td className="p-4 text-sm">{fmtDate(reg.registration_date)}</td>
                        <td className="p-4 text-center">
                          <button onClick={(e) => { e.stopPropagation(); setSelectedItem(reg); setDetailType('registration'); setShowDetailModal(true); }} className="text-emerald-600 hover:text-emerald-700"><Eye size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'survey' && (
            <div className="border border-black">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="font-black text-xl">Full Survey Responses (Step 1-4)</h3>
                <button onClick={() => exportToCSV(surveyResponses, 'full_survey')} className="flex items-center gap-2 border px-5 py-2 hover:bg-gray-100">
                  <Download size={18} /> Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Age</th>
                      <th className="p-3 text-left">Heard of Ministry</th>
                      <th className="p-3 text-center">Familiarity</th>
                      <th className="p-3 text-left">Biggest Challenge</th>
                      <th className="p-3 text-left">Would Participate</th>
                      <th className="p-3 text-left">Submitted</th>
                      <th className="p-3 text-center">View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {surveyResponses.length === 0 ? (
                      <tr><td colSpan={9} className="p-12 text-center text-gray-500">No survey responses yet.</td></tr>
                    ) : surveyResponses.map(s => (
                      <tr key={s.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => { setSelectedItem(s); setDetailType('survey'); setShowDetailModal(true); }}>
                        <td className="p-3 font-medium">{s.full_name}</td>
                        <td className="p-3 text-xs">{s.email}</td>
                        <td className="p-3">{s.age_range}</td>
                        <td className="p-3 truncate">{s.heard_of_ministry}</td>
                        <td className="p-3 text-center font-bold">{s.familiarity_score}/5</td>
                        <td className="p-3 truncate">{s.biggest_challenge}</td>
                        <td className="p-3">{s.would_participate}</td>
                        <td className="p-3 text-xs">{fmtDate(s.submitted_at)}</td>
                        <td className="p-3 text-center">
                          <button onClick={(e) => { e.stopPropagation(); setSelectedItem(s); setDetailType('survey'); setShowDetailModal(true); }} className="text-emerald-600 hover:text-emerald-700"><Eye size={18} /></button>
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

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-black w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-black">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={resetProductForm}><X size={28} /></button>
              </div>
              {/* Product form content (same as before) */}
              <div className="space-y-5">
                <input type="text" placeholder="Product Name *" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full border border-black p-4" />
                <input type="text" placeholder="Category" value={productCategory} onChange={(e) => setProductCategory(e.target.value)} className="w-full border border-black p-4" />
                <input type="number" placeholder="Price (₦) *" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} className="w-full border border-black p-4" />
                <input type="number" placeholder="Quantity" value={productQuantity} onChange={(e) => setProductQuantity(e.target.value)} className="w-full border border-black p-4" />

                <div>
                  <label className="block mb-2 font-medium">Product Image</label>
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProductImageFile(file);
                      setProductImagePreview(URL.createObjectURL(file));
                    }
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

      {/* Service Modal */}
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
                    if (file) {
                      setServiceImageFile(file);
                      setServiceImagePreview(URL.createObjectURL(file));
                    }
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

      {/* Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-black w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-black">
                  {editingGalleryItem ? 'Edit Gallery Image' : 'Add New Gallery Image'}
                </h2>
                <button onClick={resetGalleryForm}><X size={28} /></button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block mb-2 font-medium">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setGalleryImageFile(file);
                        setGalleryImagePreview(URL.createObjectURL(file));
                      }
                    }}
                    className="w-full border border-black p-3"
                  />
                  {galleryImagePreview && (
                    <img src={galleryImagePreview} alt="preview" className="mt-4 h-48 object-cover border border-black" />
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Caption *"
                  value={galleryCaption}
                  onChange={(e) => setGalleryCaption(e.target.value)}
                  className="w-full border border-black p-4"
                />

                <button 
                  onClick={handleSaveGallery} 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 font-bold"
                >
                  {editingGalleryItem ? 'Update Image' : 'Add to Gallery'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal - Registration or Survey */}
      {showDetailModal && selectedItem && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-black w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black">
                  {detailType === 'registration' ? 'Registration Details' : 'Full Survey Response'}
                </h2>
                <button onClick={() => { setShowDetailModal(false); setSelectedItem(null); }} className="hover:text-red-600"><X size={28} /></button>
              </div>

              {detailType === 'registration' && selectedItem && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-600 font-bold">FULL NAME</p>
                      <p className="text-lg font-semibold">{selectedItem.full_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-bold">EMAIL</p>
                      <p className="text-lg">{selectedItem.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-bold">PHONE</p>
                      <p className="text-lg">{selectedItem.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-bold">AGE RANGE</p>
                      <p className="text-lg">{selectedItem.age_range}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-bold">GENDER</p>
                      <p className="text-lg">{(selectedItem as Registration).gender}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-bold">OCCUPATION</p>
                      <p className="text-lg">{(selectedItem as Registration).occupation}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-bold">VISITOR CATEGORY</p>
                      <p className="text-lg">{(selectedItem as Registration).visitor_category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-bold">STATE OF RESIDENCE</p>
                      <p className="text-lg">{(selectedItem as Registration).state_of_residence}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-bold">LGA</p>
                      <p className="text-lg">{(selectedItem as Registration).lga}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-bold">VISIT DATE</p>
                      <p className="text-lg">{fmtDate((selectedItem as Registration).visit_date)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-bold">REGISTRATION DATE</p>
                      <p className="text-lg">{fmtDate((selectedItem as Registration).registration_date)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-bold">HOME ADDRESS</p>
                    <p className="text-lg">{(selectedItem as Registration).home_address}</p>
                  </div>
                </div>
              )}

              {detailType === 'survey' && selectedItem && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                    <p className="text-xs font-bold text-blue-900 mb-3">STEP 1: VISITOR INFORMATION</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 font-bold">Full Name</p>
                        <p className="text-sm">{selectedItem.full_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-bold">Email</p>
                        <p className="text-sm">{selectedItem.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-bold">Phone</p>
                        <p className="text-sm">{selectedItem.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-bold">Age Range</p>
                        <p className="text-sm">{selectedItem.age_range}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-bold">Gender</p>
                        <p className="text-sm">{(selectedItem as SurveyResponse).gender}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-bold">Occupation</p>
                        <p className="text-sm">{(selectedItem as SurveyResponse).occupation}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-bold">Visitor Category</p>
                        <p className="text-sm">{(selectedItem as SurveyResponse).visitor_category}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-bold">State of Residence</p>
                        <p className="text-sm">{(selectedItem as SurveyResponse).state_of_residence}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-bold">LGA</p>
                        <p className="text-sm">{(selectedItem as SurveyResponse).lga}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-bold">Visit Date</p>
                        <p className="text-sm">{fmtDate((selectedItem as SurveyResponse).visit_date)}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-gray-600 font-bold">Home Address</p>
                      <p className="text-sm">{(selectedItem as SurveyResponse).home_address}</p>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 p-4 rounded">
                    <p className="text-xs font-bold text-green-900 mb-3">STEP 2: AWARENESS</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 font-bold">Heard of Ministry</p>
                        <p className="text-sm">{(selectedItem as SurveyResponse).heard_of_ministry}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-bold">Familiarity Score</p>
                        <p className="text-lg font-bold text-emerald-600">{(selectedItem as SurveyResponse).familiarity_score}/5</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-gray-600 font-bold mb-2">Aware Programmes</p>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray((selectedItem as SurveyResponse).aware_programmes) && (selectedItem as SurveyResponse).aware_programmes.map((prog: string, i: number) => (
                          <span key={i} className="bg-green-200 text-green-900 text-xs px-3 py-1 rounded">{prog}</span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-gray-600 font-bold mb-2">Priority Areas (Max 3)</p>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray((selectedItem as SurveyResponse).priority_areas) && (selectedItem as SurveyResponse).priority_areas.map((area: string, i: number) => (
                          <span key={i} className="bg-emerald-200 text-emerald-900 text-xs px-3 py-1 rounded">{area}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                    <p className="text-xs font-bold text-yellow-900 mb-3">STEP 3: FEEDBACK</p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-600 font-bold">Opinion on Opportunities</p>
                        <p className="text-sm">{(selectedItem as SurveyResponse).opportunities_opinion}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-bold">Most Interesting Programme</p>
                        <p className="text-sm">{(selectedItem as SurveyResponse).most_interesting_programme}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-bold">Programme to Expand</p>
                        <p className="text-sm">{(selectedItem as SurveyResponse).programme_to_expand}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-bold">Suggested Improvements</p>
                        <p className="text-sm">{(selectedItem as SurveyResponse).improvements}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-bold">New Initiatives Ideas</p>
                        <p className="text-sm">{(selectedItem as SurveyResponse).new_initiatives}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-bold">Biggest Challenge</p>
                        <p className="text-sm font-semibold">{(selectedItem as SurveyResponse).biggest_challenge}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-bold">Recommended Solutions</p>
                        <p className="text-sm">{(selectedItem as SurveyResponse).challenge_solutions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-bold mb-2">Program Types of Interest</p>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray((selectedItem as SurveyResponse).program_types_interest) && (selectedItem as SurveyResponse).program_types_interest.map((type: string, i: number) => (
                            <span key={i} className="bg-yellow-200 text-yellow-900 text-xs px-3 py-1 rounded">{type}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 p-4 rounded">
                    <p className="text-xs font-bold text-purple-900 mb-3">STEP 4: INCLUSION & FEEDBACK</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 font-bold">Would Participate</p>
                        <p className="text-sm">{(selectedItem as SurveyResponse).would_participate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-bold">Has Disability</p>
                        <p className="text-sm">{(selectedItem as SurveyResponse).has_disability}</p>
                      </div>
                    </div>
                    {(selectedItem as SurveyResponse).disability_details && (
                      <div className="mt-4">
                        <p className="text-xs text-gray-600 font-bold">Disability Details</p>
                        <p className="text-sm">{(selectedItem as SurveyResponse).disability_details}</p>
                      </div>
                    )}
                    {(selectedItem as SurveyResponse).accommodation_support && (
                      <div className="mt-4">
                        <p className="text-xs text-gray-600 font-bold">Accommodation Support</p>
                        <p className="text-sm">{(selectedItem as SurveyResponse).accommodation_support}</p>
                      </div>
                    )}
                    {(selectedItem as SurveyResponse).anything_else && (
                      <div className="mt-4">
                        <p className="text-xs text-gray-600 font-bold">Anything Else</p>
                        <p className="text-sm">{(selectedItem as SurveyResponse).anything_else}</p>
                      </div>
                    )}
                    {(selectedItem as SurveyResponse).comments && (
                      <div className="mt-4">
                        <p className="text-xs text-gray-600 font-bold">Comments</p>
                        <p className="text-sm">{(selectedItem as SurveyResponse).comments}</p>
                      </div>
                    )}
                  </div>

                  <div className="text-right text-xs text-gray-500">
                    Submitted: {fmtDateTime((selectedItem as SurveyResponse).submitted_at)}
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => { setShowDetailModal(false); setSelectedItem(null); }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
