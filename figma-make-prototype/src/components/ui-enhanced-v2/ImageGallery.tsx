import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Share2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';

interface GalleryImage {
  id: string;
  src: string;
  alt?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  columns?: number;
  aspectRatio?: 'square' | 'video' | 'auto';
  onImageClick?: (image: GalleryImage, index: number) => void;
  className?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  columns = 3,
  aspectRatio = 'auto',
  onImageClick,
  className = '',
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleImageClick = (image: GalleryImage, index: number) => {
    setSelectedIndex(index);
    setIsOpen(true);
    onImageClick?.(image, index);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedIndex(null);
  };

  const aspectRatioClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: '',
  }[aspectRatio];

  return (
    <>
      <div
        className={`
          grid gap-4
          ${columns === 2 ? 'grid-cols-2' : ''}
          ${columns === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : ''}
          ${columns === 4 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : ''}
          ${className}
        `}
      >
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => handleImageClick(image, index)}
            className={`
              relative overflow-hidden rounded-lg bg-[#1A1A20] border border-[#2A2A30]
              hover:border-[#1CE479] transition-all duration-300 group
              ${aspectRatioClass}
            `}
          >
            <img
              src={image.thumbnail || image.src}
              alt={image.alt || image.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {image.title && (
                  <h4 className="text-white text-sm truncate">{image.title}</h4>
                )}
                {image.description && (
                  <p className="text-gray-300 text-xs truncate mt-1">{image.description}</p>
                )}
              </div>
            </div>

            {/* Zoom Icon */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
                <ZoomIn className="w-4 h-4 text-white" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <ImageLightbox
          images={images}
          initialIndex={selectedIndex}
          isOpen={isOpen}
          onClose={handleClose}
        />
      )}
    </>
  );
};

interface ImageLightboxProps {
  images: GalleryImage[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  initialIndex,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoom(1);
  }, [initialIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setZoom(1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setZoom(1);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 1));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = images[currentIndex].src;
    link.download = images[currentIndex].title || `image-${currentIndex + 1}`;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: images[currentIndex].title,
          text: images[currentIndex].description,
          url: images[currentIndex].src,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const currentImage = images[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-0">
        {/* Hidden accessibility header */}
        <DialogHeader className="sr-only">
          <DialogTitle>Image Gallery</DialogTitle>
          <DialogDescription>
            Viewing image {currentIndex + 1} of {images.length}
          </DialogDescription>
        </DialogHeader>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 mr-4">
              {currentImage.title && (
                <h3 className="text-white truncate">{currentImage.title}</h3>
              )}
              <p className="text-sm text-gray-400">
                {currentIndex + 1} / {images.length}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 1}
                className="text-white hover:bg-white/10"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className="text-white hover:bg-white/10"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4" />
              </Button>

              {navigator.share && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="text-white hover:bg-white/10"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Image */}
        <div className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">
          <img
            src={currentImage.src}
            alt={currentImage.alt || currentImage.title}
            className="max-w-full max-h-full object-contain transition-transform duration-300"
            style={{ transform: `scale(${zoom})` }}
          />
        </div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-3 text-white transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-3 text-white transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => {
                    setCurrentIndex(index);
                    setZoom(1);
                  }}
                  className={`
                    flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
                    ${index === currentIndex
                      ? 'border-[#1CE479] scale-110'
                      : 'border-transparent hover:border-gray-500'
                    }
                  `}
                >
                  <img
                    src={image.thumbnail || image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {currentImage.description && (
          <div className="absolute bottom-20 left-0 right-0 text-center px-4">
            <p className="text-white text-sm bg-black/50 backdrop-blur-sm inline-block px-4 py-2 rounded-lg">
              {currentImage.description}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};