"use client";

import { X } from "lucide-react";
import Image from "next/image";

interface ImagePreviewModalProps {
  imageUrl: string | null;
  onClose: () => void;
  alt?: string;
}

export const ImagePreviewModal = ({ imageUrl, onClose, alt = "Image preview" }: ImagePreviewModalProps) => {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-5xl max-h-full bg-white rounded-2xl shadow-2xl border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 cursor-pointer z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>
        <Image
          src={imageUrl}
          alt={alt}
          width={800}
          height={600}
          className="rounded-2xl object-contain max-h-[85vh] max-w-full"
        />
      </div>
    </div>
  );
};
