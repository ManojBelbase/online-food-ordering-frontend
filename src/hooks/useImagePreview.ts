import { useState } from "react";

export const useImagePreview = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return {
    selectedImage,
    openImageModal,
    closeImageModal,
  };
};
