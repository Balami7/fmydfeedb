'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Service {
  id: string | number;
  title: string;
  description?: string;
  imageSrc: string;
  href: string;
  external: boolean;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const response = await fetch('/api/services', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',        
        });

        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }

        const data: Service[] = await response.json();
        setServices(data);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Unable to load services at the moment. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pt-28">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 py-3">
          <div className="max-w-5xl mx-auto">
            <div className="relative w-44 h-20">
              <Image 
                src="/fmyd.png" 
                alt="FMYD Logo" 
                fill 
                priority 
                className="object-contain object-left" 
                sizes="176px" 
              />
            </div>
          </div>
        </nav>

        <main className="flex-grow max-w-5xl w-full mx-auto py-10 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading services...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pt-28">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 py-3">
          <div className="max-w-5xl mx-auto">
            <div className="relative w-44 h-20">
              <Image 
                src="/fmyd.png" 
                alt="FMYD Logo" 
                fill 
                priority 
                className="object-contain object-left" 
                sizes="176px" 
              />
            </div>
          </div>
        </nav>

        <main className="flex-grow max-w-5xl w-full mx-auto py-10 px-4 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-28">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-start">
          <div className="relative w-44 h-20">
            <Image 
              src="/fmyd.png" 
              alt="FMYD Logo" 
              fill 
              priority 
              className="object-contain object-left" 
              sizes="176px" 
            />
          </div>
        </div>
      </nav>

   
      <main className="flex-grow max-w-5xl w-full mx-auto py-10 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((service) => {
            const hasLink = service.href?.trim().length > 0;

            return hasLink ? (
              <Link
                key={service.id}
                href={service.href}
                target={service.external ? "_blank" : undefined}
                rel={service.external ? "noopener noreferrer" : undefined}
                className="group flex flex-col bg-white border-2 border-gray-200 rounded-2xl p-5 hover:border-black hover:shadow-lg transition-all h-full"
              >
                <div className="relative w-full h-40 bg-gray-100 rounded-xl overflow-hidden mb-4">
                  <Image 
                    src={service.imageSrc} 
                    alt={service.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-300" 
                    sizes="(max-width: 768px) 100vw, 33vw" 
                  />
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-3 text-center group-hover:text-black">
                  {service.title}
                </h2>

                {service.description && (
                  <p className="text-sm text-gray-600 mb-6 text-center line-clamp-3">
                    {service.description}
                  </p>
                )}

                <div className="mt-auto text-center text-sm font-semibold text-black group-hover:text-emerald-600">
                  Explore →
                </div>
              </Link>
            ) : (
              <div 
                key={service.id} 
                className="flex flex-col bg-white border-2 border-gray-200 rounded-2xl p-5 h-full"
              >
                <div className="relative w-full h-40 bg-gray-100 rounded-xl overflow-hidden mb-4">
                  <Image 
                    src={service.imageSrc} 
                    alt={service.title} 
                    fill 
                    className="object-cover" 
                    sizes="(max-width: 768px) 100vw, 33vw" 
                  />
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-3 text-center">
                  {service.title}
                </h2>

                {service.description && (
                  <p className="text-sm text-gray-600 mb-6 text-center">
                    {service.description}
                  </p>
                )}

                <div className="mt-auto text-center text-sm font-medium text-gray-400">
                  Coming Soon
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}