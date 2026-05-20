'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface GalleryItem {
  id: number | string;
  src: string;
  alt: string;
  caption: string;
  category?: string;
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        setLoading(true);
        const response = await fetch('/FMYDHUB/api/gallery', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch gallery');
        }

        const data: GalleryItem[] = await response.json();
        setGalleryItems(data);
      } catch (err) {
        console.error('Error fetching gallery:', err);
        setError('Unable to load gallery at the moment. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchGallery();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 py-3">
  <div className="max-w-6xl mx-auto flex items-center justify-between">
    
    {/* Clickable Home Link with Both Logos */}
    <Link href="/" className="flex items-center gap-4">
      {/* First Logo */}
      <div className="relative w-44 h-20">
        <Image 
          src="/fmyd.png" 
          alt="FMYD Logo" 
          fill 
          className="object-contain object-left" 
          sizes="176px" 
        />
      </div>
      
      {/* Second Logo */}
      <div className="relative w-44 h-20">
        <Image 
          src="/6.jpeg" 
          alt="Civil Service Conference" 
          fill 
          className="object-contain object-left" 
          sizes="176px" 
        />
      </div>
    </Link>

    <Link href="/services" className="text-sm font-medium text-gray-600 hover:text-black">
      ← Back to Services
    </Link>
  </div>
</nav>


        <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full mb-6"></div>
          <p className="text-gray-600 text-lg">Loading gallery...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <div className="relative w-44 h-20">
                <Image src="/fmyd.png" alt="FMYD Logo" fill className="object-contain object-left" sizes="176px" />
              </div>
            </Link>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-black text-white rounded-2xl hover:bg-gray-800 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="relative w-44 h-20">
              <Image 
                src="/fmyd.png" 
                alt="FMYD Logo" 
                fill 
                className="object-contain object-left" 
                sizes="176px" 
              />
            </div>
          </Link>
          <Link 
            href="/pre" 
            className="text-sm font-medium text-gray-600 hover:text-black transition"
          >
            ← Back to Services
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Gallery</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our collection of stunning artworks and creative designs
          </p>
        </div>

        {galleryItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No images found in the gallery.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-300 hover:shadow-xl transition-all duration-300 cursor-pointer active:scale-[0.98] touch-manipulation"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                <div className="p-6">
                  <p className="text-gray-900 font-medium leading-snug text-[15px]">
                    {item.caption}
                  </p>
                  {item.category && (
                    <span className="inline-block mt-3 text-xs font-medium px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-[95vw] max-h-[95vh] w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative w-full" style={{ maxHeight: '75vh' }}>
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={1200}
                height={800}
                className="w-full h-auto object-contain mx-auto"
                priority
              />
            </div>

            <div className="p-6 md:p-8 bg-white">
              <p className="text-xl md:text-2xl text-gray-900 font-medium leading-tight">
                {selectedImage.caption}
              </p>
              {selectedImage.category && (
                <p className="text-gray-500 mt-2">{selectedImage.category}</p>
              )}
            </div>

            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/80 hover:bg-black text-white p-3 rounded-full transition-all text-xl w-12 h-12 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}